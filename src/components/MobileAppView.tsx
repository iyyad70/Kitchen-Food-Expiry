import React, { useState, useMemo } from 'react';
import {
  Barcode,
  Search,
  Bell,
  Sparkles,
  Check,
  Trash2,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Plus,
  Info,
  Calendar,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { PantryItem, User, NotificationItem } from '../types';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { RecipeModal } from './RecipeModal';

interface MobileAppViewProps {
  items: PantryItem[];
  users: User[];
  currentUser: User;
  notifications: NotificationItem[];
  onAddItem: (item: Omit<PantryItem, 'id' | 'status'>) => void;
  onConsumeItem: (id: string) => void;
  onWasteItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onTriggerTestAlert: () => void;
}

export function MobileAppView({
  items,
  users,
  currentUser,
  notifications,
  onAddItem,
  onConsumeItem,
  onWasteItem,
  onDeleteItem,
  onTriggerTestAlert
}: MobileAppViewProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedRecipeItem, setSelectedRecipeItem] = useState<PantryItem | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'Fridge' | 'Pantry Shelf' | 'Freezer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Helper to calculate days remaining
  const calculateDaysLeft = (expiryDateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter items
  const activeItems = useMemo(() => {
    return items.filter(item => item.status === 'active');
  }, [items]);

  const urgentItems = useMemo(() => {
    return activeItems.filter(item => calculateDaysLeft(item.expiryDate) <= 2);
  }, [activeItems]);

  const filteredItems = useMemo(() => {
    return activeItems.filter(item => {
      const daysLeft = calculateDaysLeft(item.expiryDate);

      // Tab filter
      if (activeTab === 'urgent' && daysLeft > 2) return false;
      if (activeTab === 'Fridge' && item.location !== 'Fridge') return false;
      if (activeTab === 'Pantry Shelf' && item.location !== 'Pantry Shelf') return false;
      if (activeTab === 'Freezer' && item.location !== 'Freezer') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.productName.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.barcode.includes(q)
        );
      }

      return true;
    }).sort((a, b) => calculateDaysLeft(a.expiryDate) - calculateDaysLeft(b.expiryDate));
  }, [activeItems, activeTab, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col items-center">
      {/* Top Simulator Controls Toolbar */}
      <div className="mb-4 flex w-full max-w-4xl items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Mobile User App Simulation (React Native Experience)</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-500">Live barcode lookup + expiry countdowns</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerTestAlert}
            className="flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-amber-800 hover:bg-amber-100"
            title="Simulate push notification sent to mobile device"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Simulate Push Alert</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-slate-100"
          >
            {isPhoneFrame ? <Maximize2 className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
            <span>{isPhoneFrame ? 'Expanded View' : 'Phone Frame'}</span>
          </button>
        </div>
      </div>

      {/* Main Container - either phone frame or responsive desktop */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md rounded-3xl border-8 border-slate-900 bg-slate-50 shadow-2xl overflow-hidden'
            : 'max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 shadow-sm p-4'
        }`}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-slate-500">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* App Bar */}
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Barcode className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Smart Pantry</h1>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Users className="h-3 w-3 text-emerald-600" />
                  <span className="font-medium text-slate-700">{currentUser.householdName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search milk, bread, eggs, barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto px-5 pb-3 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items ({activeItems.length})
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'urgent'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Expiring Soon ({urgentItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('Fridge')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'Fridge'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fridge
            </button>
            <button
              onClick={() => setActiveTab('Pantry Shelf')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'Pantry Shelf'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pantry Shelf
            </button>
            <button
              onClick={() => setActiveTab('Freezer')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'Freezer'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Freezer
            </button>
          </div>
        </div>

        {/* Notifications Dropdown Drawer */}
        {isNotificationsOpen && (
          <div className="border-b border-slate-200 bg-white p-4 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Expiry Push Alerts</span>
              <span className="text-[10px] text-slate-400">Node.js Cron / Device Push</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`rounded-lg border p-2.5 text-xs ${
                    notif.type === 'urgent'
                      ? 'border-rose-200 bg-rose-50/70 text-rose-900'
                      : notif.type === 'warning'
                      ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{notif.title}</span>
                    <span className="text-[10px] font-normal text-slate-500">{notif.createdAt}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Urgent Alert Banner (Lecturer Highlight: Milk expiring in 1-2 days) */}
        {urgentItems.length > 0 && activeTab !== 'urgent' && (
          <div className="mx-4 my-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3">
            <div className="flex items-start gap-2.5">
              <div className="rounded-md bg-rose-100 p-1.5 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-rose-900">
                  {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} expiring soon!
                </h4>
                <p className="text-[11px] text-rose-700">
                  {urgentItems[0].productName} expires{' '}
                  {calculateDaysLeft(urgentItems[0].expiryDate) === 0
                    ? 'today'
                    : calculateDaysLeft(urgentItems[0].expiryDate) === 1
                    ? 'tomorrow'
                    : calculateDaysLeft(urgentItems[0].expiryDate) < 0
                    ? 'yesterday'
                    : `in ${calculateDaysLeft(urgentItems[0].expiryDate)} days`}
                  .
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedRecipeItem(urgentItems[0])}
                    className="flex items-center gap-1 rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-rose-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Rescue with AI Recipe</span>
                  </button>
                  <button
                    onClick={() => onConsumeItem(urgentItems[0].id)}
                    className="flex items-center gap-1 rounded border border-rose-300 bg-white px-2 py-1 text-[10px] font-semibold text-rose-800 hover:bg-rose-100"
                  >
                    <Check className="h-3 w-3" />
                    <span>Consumed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pantry Items List */}
        <div className="p-4 space-y-3 pb-24">
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <Barcode className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No pantry items found</p>
              <p className="text-xs text-slate-500 mt-1">
                Scan a barcode or use a preset to add your first grocery item.
              </p>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Scan Barcode</span>
              </button>
            </div>
          ) : (
            filteredItems.map(item => {
              const daysLeft = calculateDaysLeft(item.expiryDate);
              const isExpired = daysLeft < 0;
              const isCritical = daysLeft >= 0 && daysLeft <= 2;
              const isWarning = daysLeft >= 3 && daysLeft <= 5;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col rounded-xl border bg-white p-3.5 shadow-2xs transition-all hover:shadow-xs ${
                    isExpired
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : isCritical
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {item.brand}
                        </span>
                        {/* Expiry Badge */}
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isExpired
                              ? 'bg-rose-100 text-rose-800'
                              : isCritical
                              ? 'bg-amber-100 text-amber-800'
                              : isWarning
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isExpired
                            ? `Expired ${Math.abs(daysLeft)}d ago`
                            : daysLeft === 0
                            ? 'Expires today'
                            : daysLeft === 1
                            ? 'Expires tomorrow'
                            : `${daysLeft} days left`}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {item.productName}
                      </h3>

                      {/* Metadata row */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {item.location}
                        </span>
                        <span>·</span>
                        <span>
                          Qty: <strong className="text-slate-700">{item.quantity} {item.unit}</strong>
                        </span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">
                          RM {item.estimatedPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Household member who added it */}
                      <div className="mt-1 text-[10px] text-slate-400">
                        Added by <span className="text-slate-600 font-medium">{item.addedBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons row */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <button
                      onClick={() => setSelectedRecipeItem(item)}
                      className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                      title="Get instant recipes for this expiring item"
                    >
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      <span>Recipe Ideas</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onConsumeItem(item.id)}
                        className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                        title="Mark consumed (prevents food waste!)"
                      >
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Consumed</span>
                      </button>

                      <button
                        onClick={() => onWasteItem(item.id)}
                        className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
                        title="Mark as discarded/spoiled"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Waste</span>
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Add / Barcode Scan Action Button */}
        <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xs flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            <span>{activeItems.length} items tracked</span>
            <span className="mx-1.5">·</span>
            <span className="text-emerald-700 font-semibold">
              RM {activeItems.reduce((acc, i) => acc + i.estimatedPrice, 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
          >
            <Barcode className="h-4 w-4" />
            <span>Scan Barcode</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddItem={onAddItem}
        currentUser={currentUser.name}
        householdId={currentUser.householdId}
      />

      <RecipeModal
        isOpen={!!selectedRecipeItem}
        item={selectedRecipeItem}
        onClose={() => setSelectedRecipeItem(null)}
        onMarkConsumed={onConsumeItem}
      />
    </div>
  );
}
