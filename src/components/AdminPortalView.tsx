import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertOctagon,
  Users,
  Download,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  PieChart,
  Layers,
  Search,
  ShieldCheck
} from 'lucide-react';
import { PantryItem, User } from '../types';

interface AdminPortalViewProps {
  items: PantryItem[];
  users: User[];
  onConsumeItem: (id: string) => void;
  onWasteItem: (id: string) => void;
}

export function AdminPortalView({ items, users, onConsumeItem, onWasteItem }: AdminPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'users' | 'audit_log'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Compute analytics
  const totalItems = items.length;
  const consumedItems = items.filter(i => i.status === 'consumed');
  const wastedItems = items.filter(i => i.status === 'wasted');
  const activeItems = items.filter(i => i.status === 'active');

  const resolvedItemsCount = consumedItems.length + wastedItems.length;
  const wastePercentage = resolvedItemsCount > 0
    ? ((wastedItems.length / resolvedItemsCount) * 100).toFixed(1)
    : '0.0';
  const consumedPercentage = resolvedItemsCount > 0
    ? ((consumedItems.length / resolvedItemsCount) * 100).toFixed(1)
    : '100.0';

  const totalSavedMoney = consumedItems.reduce((acc, i) => acc + i.estimatedPrice, 0);
  const totalLostMoney = wastedItems.reduce((acc, i) => acc + i.estimatedPrice, 0);
  const activeValue = activeItems.reduce((acc, i) => acc + i.estimatedPrice, 0);

  // Group by category
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; consumed: number; wasted: number; active: number; costWasted: number }> = {};
    items.forEach(item => {
      if (!map[item.category]) {
        map[item.category] = { total: 0, consumed: 0, wasted: 0, active: 0, costWasted: 0 };
      }
      map[item.category].total += 1;
      if (item.status === 'consumed') map[item.category].consumed += 1;
      if (item.status === 'wasted') {
        map[item.category].wasted += 1;
        map[item.category].costWasted += item.estimatedPrice;
      }
      if (item.status === 'active') map[item.category].active += 1;
    });
    return Object.entries(map).map(([category, stats]) => ({
      category,
      ...stats
    })).sort((a, b) => b.total - a.total);
  }, [items]);

  // Export CSV function for Power BI
  const handleExportCSV = () => {
    const headers = [
      'Item_ID',
      'Barcode',
      'Product_Name',
      'Brand',
      'Category',
      'Quantity',
      'Unit',
      'Storage_Location',
      'Purchase_Date',
      'Expiry_Date',
      'Status',
      'Estimated_Price_RM',
      'Added_By',
      'Household_ID'
    ];

    const rows = items.map(item => [
      `"${item.id}"`,
      `"${item.barcode}"`,
      `"${item.productName.replace(/"/g, '""')}"`,
      `"${item.brand}"`,
      `"${item.category}"`,
      item.quantity,
      `"${item.unit}"`,
      `"${item.location}"`,
      item.purchaseDate,
      item.expiryDate,
      item.status,
      item.estimatedPrice.toFixed(2),
      `"${item.addedBy}"`,
      `"${item.householdId}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_pantry_powerbi_dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header with Power BI Sync action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">React.js Web Dashboard</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Food Waste &amp; Pantry Inventory Analytics</h1>
          <p className="text-xs text-slate-500">
            Monitor household inventory, evaluate food waste reduction rates, and export models for Power BI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            title="Download CSV formatted for Microsoft Power BI import"
          >
            <Download className="h-4 w-4" />
            <span>Export Dataset for Power BI (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Power BI Style Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Stored Products</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalItems}</span>
            <span className="text-xs font-medium text-emerald-600">
              {activeItems.length} currently active
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Inventory across all registered households</p>
        </div>

        {/* Consumed / Prevented Waste Rate */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-semibold uppercase tracking-wider">Food Waste Diverted</span>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-950">{consumedPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-700">
              ({consumedItems.length} rescued)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">Groceries consumed before expiration</p>
        </div>

        {/* Waste Percentage */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-semibold uppercase tracking-wider">Food Waste Rate</span>
            <AlertOctagon className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-950">{wastePercentage}%</span>
            <span className="text-xs font-semibold text-rose-700">
              ({wastedItems.length} spoiled)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700">Total discarded items due to expiry</p>
        </div>

        {/* Financial Value Rescued */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Household Savings</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">RM {totalSavedMoney.toFixed(2)}</span>
            <span className="text-xs font-medium text-rose-500">
              -RM {totalLostMoney.toFixed(2)} loss
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Grocery money saved by expiry alerts</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Waste Statistics &amp; Category Visuals</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_log')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'audit_log'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Food Waste Audit Log ({items.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Household &amp; User Accounts ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Visual Analytics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visual 1: Category Breakdown Bar Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Food Inventory by Category</h3>
                <p className="text-xs text-slate-500">Distribution of products across food groups</p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Bar Chart
              </span>
            </div>

            <div className="space-y-3">
              {categoryStats.map(stat => {
                const maxTotal = Math.max(...categoryStats.map(s => s.total), 1);
                const percent = Math.round((stat.total / maxTotal) * 100);

                return (
                  <div key={stat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{stat.category}</span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{stat.total} items</span>
                        <span className="text-emerald-600">({stat.consumed} consumed)</span>
                        {stat.wasted > 0 && (
                          <span className="text-rose-600 font-bold">({stat.wasted} wasted)</span>
                        )}
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{ width: `${(stat.consumed / maxTotal) * 100}%` }}
                        className="bg-emerald-500"
                        title={`Consumed: ${stat.consumed}`}
                      />
                      <div
                        style={{ width: `${(stat.active / maxTotal) * 100}%` }}
                        className="bg-sky-400"
                        title={`Active: ${stat.active}`}
                      />
                      <div
                        style={{ width: `${(stat.wasted / maxTotal) * 100}%` }}
                        className="bg-rose-500"
                        title={`Wasted: ${stat.wasted}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Consumed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Active in Pantry
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Spoiled / Wasted
              </span>
            </div>
          </div>

          {/* Visual 2: Waste Prevention vs Loss Gauge */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Outcome Ratio (Power BI Donut Simulation)</h3>
                  <p className="text-xs text-slate-500">Academic ratio showing app impact on household behavior</p>
                </div>
                <PieChart className="h-4 w-4 text-slate-400" />
              </div>

              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-100">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-emerald-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`
                    }}
                  />
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900">{consumedPercentage}%</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Efficiency</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-xs">
              <div className="text-center">
                <span className="text-slate-500">Successfully Consumed</span>
                <p className="text-base font-bold text-emerald-700">{consumedItems.length} products</p>
                <span className="text-[10px] text-emerald-600">Saved RM {totalSavedMoney.toFixed(2)}</span>
              </div>
              <div className="text-center border-l border-slate-200">
                <span className="text-slate-500">Spoiled / Expired</span>
                <p className="text-base font-bold text-rose-700">{wastedItems.length} products</p>
                <span className="text-[10px] text-rose-600">Lost RM {totalLostMoney.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Food Waste Audit Log */}
      {activeTab === 'audit_log' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Produce">Produce</option>
                <option value="Meat & Poultry">Meat &amp; Poultry</option>
                <option value="Pantry & Grains">Pantry &amp; Grains</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Barcode</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Est. Value</th>
                  <th className="px-4 py-3">Added By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items
                  .filter(i => {
                    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      return (
                        i.productName.toLowerCase().includes(q) ||
                        i.brand.toLowerCase().includes(q) ||
                        i.barcode.includes(q)
                      );
                    }
                    return true;
                  })
                  .map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-[10px] text-slate-400">{item.brand}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {item.barcode}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{item.category}</td>
                      <td className="px-4 py-3 text-slate-600">{item.location}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{item.expiryDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            item.status === 'consumed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'wasted'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        RM {item.estimatedPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.addedBy}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registered Users &amp; Household Pantries</h3>
              <p className="text-xs text-slate-500">
                Supports multi-user household collaboration where family members share access.
              </p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              RBAC Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {users.map(u => (
              <div key={u.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm ${u.avatarColor}`}
                  >
                    {u.name.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Role:</span>
                    <span className="font-semibold text-slate-800 uppercase">{u.role.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Household:</span>
                    <span className="font-semibold text-slate-800">{u.householdName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
