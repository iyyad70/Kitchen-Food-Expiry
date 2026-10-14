import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileAppView } from './components/MobileAppView';
import { AdminPortalView } from './components/AdminPortalView';
import { SetupGuideView } from './components/SetupGuideView';
import { BarcodeSandboxView } from './components/BarcodeSandboxView';
import { INITIAL_PANTRY_ITEMS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from './data/initialData';
import { PantryItem, User, NotificationItem } from './types';
import { CheckCircle2, AlertTriangle, Bell, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mobile' | 'admin' | 'guide' | 'sandbox'>('mobile');
  
  // Persist items in localStorage
  const [items, setItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('smart_pantry_items_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved pantry items', e);
      }
    }
    return INITIAL_PANTRY_ITEMS;
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Ahmad Farid

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smart_pantry_notifs_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'alert' | 'info';
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('smart_pantry_items_v1', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('smart_pantry_notifs_v1', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (text: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Add new item
  const handleAddItem = (newItemData: Omit<PantryItem, 'id' | 'status'>) => {
    const newItem: PantryItem = {
      ...newItemData,
      id: 'item-' + Date.now(),
      status: 'active',
    };
    setItems(prev => [newItem, ...prev]);

    // Also trigger a notification for household
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: currentUser.id,
      title: 'Pantry Item Added',
      message: `${currentUser.name} added "${newItem.productName}" to the ${newItem.location}.`,
      createdAt: 'Just now',
      type: 'info',
      read: false,
      itemId: newItem.id,
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Added "${newItem.productName}" to ${newItem.location}!`, 'success');
  };

  // 2. Mark item consumed (food waste prevented!)
  const handleConsumeItem = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          showToast(`Rescued "${item.productName}"! Prevented RM ${item.estimatedPrice.toFixed(2)} in food waste.`, 'success');
          return {
            ...item,
            status: 'consumed' as const,
            consumedDate: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  // 3. Mark item wasted (expired / thrown away)
  const handleWasteItem = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          showToast(`Logged "${item.productName}" as wasted. RM ${item.estimatedPrice.toFixed(2)} recorded in audit log.`, 'alert');
          return {
            ...item,
            status: 'wasted' as const
          };
        }
        return item;
      })
    );
  };

  // 4. Delete item
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from pantry database', 'info');
  };

  // 5. Simulate 24-Hour Expiry Alert (Lecturer Demo Feature)
  const handleTriggerTestAlert = () => {
    const targetItem = items.find(i => i.barcode === '9556185000433') || items[0];
    const newNotif: NotificationItem = {
      id: 'alert-' + Date.now(),
      userId: currentUser.id,
      title: `⚡ 24h Expiry Alert: ${targetItem?.productName || 'Milk'}`,
      message: `Your ${targetItem?.productName || 'Fresh Milk'} expires tomorrow! Chef suggestion: Make golden pancakes or white pasta sauce today.`,
      createdAt: 'Just now',
      type: 'urgent',
      read: false,
      itemId: targetItem?.id,
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Push Alert Sent: ${newNotif.title}`, 'alert');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'mobile' && (
          <MobileAppView
            items={items}
            users={users}
            currentUser={currentUser}
            notifications={notifications}
            onAddItem={handleAddItem}
            onConsumeItem={handleConsumeItem}
            onWasteItem={handleWasteItem}
            onDeleteItem={handleDeleteItem}
            onTriggerTestAlert={handleTriggerTestAlert}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortalView
            items={items}
            users={users}
            onConsumeItem={handleConsumeItem}
            onWasteItem={handleWasteItem}
          />
        )}

        {activeTab === 'guide' && <SetupGuideView />}

        {activeTab === 'sandbox' && <BarcodeSandboxView />}
      </main>

      {/* Toast Notification Notification Pop-up */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-lg text-white ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600'
                : toastMessage.type === 'alert'
                ? 'bg-amber-600'
                : 'bg-slate-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : toastMessage.type === 'alert' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart Pantry &amp; Expiry Tracker · Academic Final Year Capstone</span>
          <div className="flex items-center gap-3">
            <span>Laragon MySQL (port 3306)</span>
            <span>·</span>
            <span>Open Food Facts API</span>
            <span>·</span>
            <span>Power BI Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
