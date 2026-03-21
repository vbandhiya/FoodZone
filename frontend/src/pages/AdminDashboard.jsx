import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Utensils, ShoppingBag, TrendingUp, Edit, Trash2, Plus, 
  Search, ShieldAlert, CheckCircle, Clock, DollarSign, PieChart,
  BarChart3, UserMinus, UserCheck, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Force Admin Dashboard into explicitly Light mode by default, 
  // overriding any global 'dark' class set by App.jsx
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    
    // We intentionally do not restore it on unmount here because App.jsx uses 
    // a reactive useEffect on `theme` which will naturally restore it when needed.
  }, []);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    else setRefreshing(true);
    
    try {
      const baseUrl = 'http://localhost:5000/api/admin';
      
      // Fetch stats and actual data based on tab
      const [statsRes, activeDataRes] = await Promise.all([
        fetch(`${baseUrl}/stats`),
        activeTab === 'overview' ? fetch(`${baseUrl}/analytics`) :
        activeTab === 'users' ? fetch(`${baseUrl}/users`) :
        activeTab === 'orders' ? fetch(`http://localhost:5000/api/orders`) :
        activeTab === 'food' ? fetch(`http://localhost:5000/api/food`) :
        activeTab === 'restaurants' ? fetch(`http://localhost:5000/api/restaurants`) :
        Promise.resolve({ ok: true, json: () => [] })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (activeDataRes.ok) setData(await activeDataRes.json());
      
      if (activeTab === 'overview' || activeTab === 'analytics') {
        const anaRes = await fetch(`${baseUrl}/analytics`);
        if (anaRes.ok) setAnalytics(await anaRes.json());
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
    // Real-time System: Poll every 20 seconds for new orders/stats
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Order status: ${newStatus}`);
        fetchData(true);
      }
    } catch (error) { toast.error("Update failed"); }
  };

  const handleUserStatus = async (userId, isBlocked) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked })
      });
      if (res.ok) {
        toast.success(isBlocked ? "User Restricted" : "User Access Restored");
        fetchData(true);
      }
    } catch (error) { toast.error("Action failed"); }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Permanent delete? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Record removed");
        fetchData(true);
      }
    } catch (error) { toast.error("Delete failed"); }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `http://localhost:5000/api/admin/${activeTab}${editingId ? `/${editingId}` : ''}`;
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData };
      if (payload.price) payload.price = parseFloat(payload.price);
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Update successful!");
        setIsFormOpen(false);
        fetchData(true);
      }
    } catch (error) { toast.error("Network error"); }
  };

  const filteredData = Array.isArray(data) 
    ? data.filter(item => {
        const searchStr = (item.name || item.userName || item.id || "").toLowerCase();
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
        const matchesStatus = activeTab === 'orders' && orderStatusFilter !== 'All' 
          ? item.status === orderStatusFilter 
          : true;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="bg-[#f8fafc] min-h-screen transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-r border-gray-100 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl tracking-tight text-gray-900">Admin</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">FoodZone Control</p>
            </div>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', name: 'Order Logs', icon: ShoppingBag },
              { id: 'restaurants', name: 'Partner Hub', icon: TrendingUp },
              { id: 'food', name: 'Inventory', icon: Utensils },
              { id: 'users', name: 'Membership', icon: Users },
              { id: 'analytics', name: 'Insights', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                  activeTab === tab.id 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 translate-x-1' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-400' : 'text-gray-400 group-hover:text-gray-900'}`} />
                  {tab.name}
                </div>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />}
              </button>
            ))}
          </nav>

          <div className="mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <div className="flex items-center gap-2 mb-2">
               <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-amber-500 animate-spin' : 'bg-emerald-500'}`} />
               <p className="text-[10px] font-bold text-gray-500 uppercase">Live System</p>
             </div>
             <p className="text-[11px] text-gray-400 leading-tight">Orders & Stats auto-update every 20s</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 relative">
          
          {/* Top Bar */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pr-16 lg:pr-20">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-500 font-medium">Real-time snapshots of FoodZone ecosystem</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {['food', 'restaurants', 'orders', 'users'].includes(activeTab) && (
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
              {activeTab === 'orders' && (
                <select 
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl outline-none shadow-sm text-sm font-bold text-gray-600 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}
              <button 
                onClick={() => fetchData()}
                className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-primary-600 transition shadow-sm cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Revenue', value: `\u20B9${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Orders', value: stats?.totalOrders || 0, sub: `${stats?.activeOrders || 0} Active Currently`, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between group hover:border-primary-100 transition-all">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
                        {stat.sub && <p className="text-[11px] text-gray-400 mt-1 font-bold italic">{stat.sub}</p>}
                      </div>
                      <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Stream and Orders Per Day */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-xl flex items-center gap-2"><TrendingUp className="text-primary-500" /> Revenue & Order Stream</h3>
                      <select className="bg-gray-100 border-none rounded-full px-4 py-1.5 text-xs font-bold text-gray-500 outline-none">
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    {/* Simplified CSS Bar Chart - Orders per day */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4 w-full">
                      {Object.entries(analytics?.ordersByDay || {}).slice(-7).map(([date, count], i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group w-full">
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: `${Math.max((count / 15) * 100, 10)}%` }}
                            className="w-full bg-primary-100 rounded-xl group-hover:bg-primary-500 transition-all relative min-h-[20px]"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">{count} Orders</div>
                          </motion.div>
                          <span className="text-[10px] font-bold text-gray-400 truncate w-full flex justify-center text-center">{date.split('-').slice(1).join('/')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Items and Users */}
                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                      <h3 className="font-black text-xl mb-6 flex items-center gap-2"><PieChart className="text-amber-500" /> Popular Picks</h3>
                      <div className="space-y-5">
                        {analytics?.popularItems?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-400">{i+1}</div>
                              <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <div className="bg-gray-50 px-3 py-1 rounded-full text-[11px] font-black text-primary-600">{item.count} Sold</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                      <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Users className="text-blue-500" /> Most Active Users</h3>
                      <div className="space-y-5">
                        {analytics?.activeUsers?.map((user, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-xs text-blue-400">{i+1}</div>
                              <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{user.name}</span>
                            </div>
                            <div className="bg-gray-50 px-3 py-1 rounded-full text-[11px] font-black text-secondary-600">{user.count} Orders</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-100">
                      <th className="p-6">Member ID</th>
                      <th className="p-6">Full Name</th>
                      <th className="p-6">Email Address</th>
                      <th className="p-6">Access Status</th>
                      <th className="p-6 text-right">System Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/30 transition group">
                        <td className="p-6 text-xs text-gray-400 font-mono">#{user.id?.slice(0, 10)}</td>
                        <td className="p-6">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">{user.name?.charAt(0)}</div>
                             <span className="font-bold text-gray-900">{user.name}</span>
                             {user.role === 'admin' && <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Master</span>}
                           </div>
                        </td>
                        <td className="p-6 text-sm text-gray-500 font-medium">{user.email}</td>
                        <td className="p-6">
                           <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                             {user.isBlocked ? 'Restricted' : 'Granted'}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <button 
                             onClick={() => handleUserStatus(user.id, !user.isBlocked)}
                             className={`p-2.5 rounded-2xl transition shadow-sm border ${user.isBlocked ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'}`}
                             title={user.isBlocked ? "Restore Access" : "Restrict Access"}
                           >
                             {user.isBlocked ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Other tabs follow similar premium styling... Orders, Food, Restaurants */}
            {['orders', 'food', 'restaurants'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {(activeTab === 'food' || activeTab === 'restaurants') && (
                  <button onClick={() => { setFormData({}); setEditingId(null); setIsFormOpen(true); }} className="w-full sm:w-auto bg-gray-900 text-white rounded-2xl px-8 py-3.5 font-bold shadow-lg shadow-gray-300 hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Register New {activeTab === 'food' ? 'Dish' : 'Partner'}
                  </button>
                )}
                
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-100">
                         {activeTab === 'orders' ? (
                           <>
                             <th className="p-6">Order ID</th>
                             <th className="p-6">Customer</th>
                             <th className="p-6">Amount</th>
                             <th className="p-6">Pipeline Status</th>
                           </>
                         ) : (
                           <>
                             <th className="p-6">Item Identity</th>
                             <th className="p-6">{activeTab === 'restaurants' ? 'Cuisine Type' : 'Market Price'}</th>
                             <th className="p-6 text-right">Actions</th>
                           </>
                         )}
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {filteredData.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition">
                             {activeTab === 'orders' ? (
                               <>
                                 <td className="p-6 text-xs text-gray-400 font-mono tracking-tighter">#{item.id?.slice(0, 12)}</td>
                                 <td className="p-6">
                                    <p className="font-bold text-gray-900">{item.userName}</p>
                                    <p className="text-[11px] text-gray-400 font-medium">{item.items?.length} items \u2022 {item.paymentType}</p>
                                 </td>
                                 <td className="p-6 font-black text-gray-900">\u20B9{item.totalPrice}</td>
                                 <td className="p-6">
                                    <select 
                                      value={item.status || 'Pending'} 
                                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                      className={`text-[11px] font-black uppercase border-none rounded-xl px-4 py-2 outline-none cursor-pointer shadow-sm ${
                                        item.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                        item.status === 'Preparing' ? 'bg-amber-100 text-amber-700' :
                                        item.status === 'Out for delivery' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Preparing">Preparing</option>
                                      <option value="Out for delivery">Out for Deliver</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                 </td>
                               </>
                             ) : (
                               <>
                                 <td className="p-6">
                                    <div className="flex items-center gap-4">
                                       <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                                       <span className="font-bold text-gray-900">{item.name}</span>
                                    </div>
                                 </td>
                                 <td className="p-6 text-sm font-bold text-gray-600">
                                   {activeTab === 'restaurants' ? item.cuisine : `\u20B9${item.price}`}
                                 </td>
                                 <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                       <button onClick={() => { setFormData(item); setEditingId(item.id); setIsFormOpen(true); }} className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit className="w-4 h-4" /></button>
                                       <button onClick={() => handleDelete(item.id, activeTab)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                 </td>
                               </>
                             )}
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Unified Interaction Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8">{editingId ? 'Edit Perspective' : 'Introduce New Entity'}</h3>
            <form onSubmit={submitForm} className="space-y-5">
              {activeTab === 'restaurants' ? (
                <>
                  <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Partner Name" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Cuisine Genre" required value={formData.cuisine || ''} onChange={e => setFormData({...formData, cuisine: e.target.value})} />
                  <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Visual URL" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                </>
              ) : (
                <>
                  <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Dish Identity" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="flex gap-4">
                    <input className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Attached Restaurant ID" required value={formData.restaurantId || ''} onChange={e => setFormData({...formData, restaurantId: e.target.value})} />
                    <input className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Food Category" required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <input className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" type="number" step="0.01" placeholder="Market Price" required value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                    <select className="px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.isVeg ? 'true' : 'false'} onChange={e => setFormData({...formData, isVeg: e.target.value === 'true'})}>
                      <option value="false">Non-Veg</option>
                      <option value="true">Veg</option>
                    </select>
                  </div>
                  <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" placeholder="Visual URL" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                </>
              )}
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all">Command Execute</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-8 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Abort</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
