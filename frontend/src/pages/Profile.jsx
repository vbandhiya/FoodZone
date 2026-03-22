import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Settings, MapPin, Package, ArrowLeft, Download, FileText, X, Plus, Trash2, Edit2, Bell, Moon, Sun, Lock, Globe, Camera } from 'lucide-react';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAddressStore } from '../store/addressStore';
import { useSettingsStore } from '../store/settingsStore';
import RestaurantCard from '../components/RestaurantCard';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const { favorites } = useFavoritesStore();
  
  // Address Store
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: '', fullAddress: '' });

  // Settings Store
  const { theme, setTheme, notifications, toggleNotifications, userName, userPhone, setUserInfo } = useSettingsStore();
  const [localName, setLocalName] = useState(userName || currentUser?.name || '');
  const [localPhone, setLocalPhone] = useState(userPhone || '');
  
  // Local UI-preview settings buffers (Do not trigger global changes until Explicitly Saved)
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    if (userName) setLocalName(userName);
    if (userPhone) setLocalPhone(userPhone);
    setLocalTheme(theme);
    setLocalNotifications(notifications);
  }, [userName, userPhone, theme, notifications]);

  const handleSaveSettings = () => {
    setUserInfo(localName, localPhone);
    // Physically commit the delayed generic settings directly to the Global App Theme Engine
    if(localTheme !== theme) setTheme(localTheme);
    if(localNotifications !== notifications) toggleNotifications();
    toast.success("Settings saved! 🚀 Themes securely applied.");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.label || !addressForm.fullAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm);
      toast.success("Address updated!");
    } else {
      addAddress(addressForm);
      toast.success("New address added!");
    }
    
    setIsAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm({ label: '', fullAddress: '' });
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({ label: addr.label, fullAddress: addr.fullAddress });
    setIsAddressModalOpen(true);
  };

  if (!currentUser) return null; // Handled by ProtectedRoute

  useEffect(() => {
    if (activeTab === 'orders' && currentUser) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:5000/api/orders/user/${currentUser.uid}`);
          if (res.ok) {
            setOrders(await res.json());
          }
        } catch (error) {
          console.error("Failed to load orders", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else if (activeTab === 'favorites') {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/restaurants`);
          if (res.ok) {
            const allRestaurants = await res.json();
            const filtered = allRestaurants.filter(r => favorites.includes(r.id));
            setFavoriteRestaurants(filtered);
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [activeTab, currentUser, favorites]);

  return (
    <>
    <div className={`bg-gray-50 min-h-screen py-8 ${selectedOrder ? 'print:hidden' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => window.location.href='/'} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold cursor-pointer w-fit p-2 -ml-2 rounded-lg hover:bg-gray-100 mb-4">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-400 to-accent-400"></div>
          <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 relative">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-gray-400">{(localName || currentUser.name)?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-gray-900">{localName || currentUser.name || "Foodie User"}</h1>
              <p className="text-gray-500 font-medium">{currentUser.email}</p>
            </div>
            {currentUser.role === 'admin' && (
              <span className="bg-purple-100 text-purple-700 font-bold px-4 py-1 rounded-full text-sm">Administrator</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
            {[
              { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
              { id: 'favorites', icon: Heart, label: 'Favorites' },
              { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === tab.id ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab}</h2>
            
            {activeTab === 'orders' ? (
              <div className="space-y-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                     {[1,2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl w-full"></div>)}
                  </div>
                ) : orders.length > 0 ? (
                  orders.map(order => (
                    <div 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition cursor-pointer relative bg-white"
                    >
                      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                        <div>
                          <p className="font-bold text-gray-900">Order #{order.id?.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          {order.status || "Placed"}
                        </span>
                      </div>
                      <div className="space-y-3 mb-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{item.quantity}x</span>
                            <span className="font-medium text-gray-800">{item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-sm text-gray-500 font-medium">{order.paymentType || "COD"} • {order.items?.length} items</span>
                        <span className="font-bold text-lg text-primary-600">&#8377; {order.totalPrice || order.total}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'favorites' ? (
              <div className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : favoriteRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {favoriteRestaurants.map(restaurant => (
                      <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} className="block">
                        <RestaurantCard restaurant={restaurant} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50 flex flex-col items-center">
                    <Heart className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Tap the heart icon on any restaurant to save it here for later.</p>
                    <button onClick={() => window.location.href='/'} className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-500 transition shadow-sm cursor-pointer">Find Restaurants</button>
                  </div>
                )}
              </div>
            ) : activeTab === 'addresses' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Your Saved Addresses</h3>
                  <button 
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({ label: '', fullAddress: '' });
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-primary-600 font-bold hover:bg-primary-50 px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    <Plus className="w-5 h-5" /> Add New
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`bg-white border p-6 rounded-2xl flex justify-between items-start shadow-sm transition-all hover:shadow-md ${addr.isDefault ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${addr.isDefault ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-lg text-gray-900">{addr.label}</h4>
                              {addr.isDefault && (
                                <span className="bg-primary-100 text-primary-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Default</span>
                              )}
                            </div>
                            <p className="text-gray-500 mt-1 max-w-md leading-relaxed">{addr.fullAddress}</p>
                            {!addr.isDefault && (
                              <button 
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-sm font-bold text-primary-600 mt-3 hover:underline cursor-pointer"
                              >
                                Set as default
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditAddress(addr)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => {
                              deleteAddress(addr.id);
                              toast.info("Address deleted");
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                    <MapPin className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No addresses saved</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Add a delivery address to checkout faster next time!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10">
                {/* Profile Settings */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary-600" /> Account Identity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition font-medium text-gray-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        placeholder="+91 9876543210" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition font-medium text-gray-900" 
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* Vibe & System Settings */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-primary-600" /> Vibe Check & Experience
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-gray-600 dark:text-gray-300">
                          {localTheme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Dark Mode</p>
                          <p className="text-xs text-gray-500">Easier on the eyes (Preview mode)</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setLocalTheme(localTheme === 'light' ? 'dark' : 'light')}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 outline-none ${localTheme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${localTheme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-gray-600 dark:text-gray-300">
                          <Bell className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Notifications</p>
                          <p className="text-xs text-gray-500">Order updates & hype (Preview)</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setLocalNotifications(!localNotifications)}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 outline-none ${localNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${localNotifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </section>

                <button 
                  onClick={handleSaveSettings}
                  className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-primary-500 transition shadow-xl hover:shadow-primary-500/40 hover:-translate-y-1 cursor-pointer"
                >
                  SAVE ALL SETTINGS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full print:h-auto print:overflow-visible relative">
            
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 print:hidden rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600"/> Order Invoice</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer">
                  <Download className="w-4 h-4"/> Print
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full cursor-pointer">
                  <X className="w-5 h-5"/>
                </button>
              </div>
            </div>

            <div className="p-8 print:p-0">
              <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6 text-gray-800">
                <div>
                  <h2 className="text-3xl font-extrabold text-primary-600 mb-1">FOOD ZONE</h2>
                  <p className="text-sm text-gray-500">The best food, delivered fast.</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">INVOICE</p>
                  <p className="text-sm text-gray-500">#{selectedOrder.id?.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Billed To</p>
                  <p className="font-bold text-gray-800">{localName || currentUser.name || selectedOrder.userName || "Customer"}</p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Delivery Address</p>
                  <p className="text-sm text-gray-600 max-w-[200px]">{selectedOrder.address || "N/A"}</p>
                </div>
              </div>

              <table className="w-full text-left mb-8">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 text-sm">
                    <th className="pb-3 font-bold">Item Description</th>
                    <th className="pb-3 font-bold text-center">Qty</th>
                    <th className="pb-3 font-bold text-right">Price</th>
                    <th className="pb-3 font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-600">&#8377; {item.price}</td>
                      <td className="py-4 text-right font-bold text-gray-900">&#8377; {item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="w-1/2 ml-auto space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">&#8377; {(selectedOrder.totalPrice || selectedOrder.total) - 15}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-gray-900">&#8377; 15</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                  <span className="font-bold text-gray-900">Total Paid</span>
                  <span className="font-extrabold text-xl text-primary-600">&#8377; {selectedOrder.totalPrice || selectedOrder.total}</span>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400 print:mt-8">
                <p>Order Status: <span className="font-bold text-gray-600 uppercase">{selectedOrder.status || "Placed"}</span> | Payment: {selectedOrder.paymentType || selectedOrder.paymentMethod || "COD"}</p>
                <p className="mt-2">Thank you for dining with Food Zone!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Address Label</label>
                <input 
                  type="text" 
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                  placeholder="Home, Office, Bestie's Place..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition font-medium text-gray-900" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Full Delivery Details</label>
                <textarea 
                  value={addressForm.fullAddress}
                  onChange={(e) => setAddressForm({...addressForm, fullAddress: e.target.value})}
                  placeholder="Street name, apartment, floor, landmark..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition font-medium text-gray-900 min-h-[120px] resize-none" 
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-4 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-500 transition shadow-lg shadow-primary-500/20 cursor-pointer"
                >
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
