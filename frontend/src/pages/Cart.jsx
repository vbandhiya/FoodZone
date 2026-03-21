import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAddressStore } from '../store/addressStore';
import { Plus, Minus, Trash2, ShoppingCart, MapPin, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCartStore();
  const { addresses, getDefaultAddress } = useAddressStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [address, setAddress] = useState('');
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (step === 'checkout' && !address) {
      const def = getDefaultAddress();
      if (def) setAddress(def.fullAddress);
    }
  }, [step, getDefaultAddress, address]);

  const handleProceed = () => {
    if (!currentUser) {
      toast.info("Please login to proceed to checkout");
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setStep('checkout');
  };

  const submitOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a valid delivery address");
      return;
    }
    
    setPlacingOrder(true);
    try {
      const orderPayload = {
        userId: currentUser.uid,
        userName: currentUser.name || "Anonymous",
        items: cart,
        totalPrice: cartTotal() + 15,
        address,
        paymentType: paymentMethod,
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        toast.success("Order Placed Successfully! 🎉");
        clearCart();
        navigate('/profile');
      } else {
        const err = await res.json();
        toast.error("Failed to place order: " + (err.error || "Unknown"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while placing order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-gray-50 min-h-[70vh]">
        <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
        <Link to="/" className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-500 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold cursor-pointer w-fit p-2 -ml-2 rounded-lg hover:bg-gray-100 mb-4">
          <ArrowLeft className="w-5 h-5" /> Continue Browsing
        </button>
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-extrabold text-gray-900">
             {step === 'cart' ? 'Your Cart' : 'Checkout securely'}
           </h1>
           {step === 'checkout' && (
             <button onClick={() => setStep('cart')} className="text-primary-600 font-bold hover:underline">Back to Cart</button>
           )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-4">
            {step === 'cart' ? (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                  <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">&#8377; {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-600 hover:text-primary-600"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-600 hover:text-primary-600"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition bg-gray-50 cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              // Checkout form styling strictly mimicking cart item box aesthetics to prevent UI deviation
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <MapPin className="text-primary-600 w-5 h-5"/> Delivery Address
                    </h3>
                    {addresses.length > 0 && (
                      <button 
                        onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                        className="text-xs font-bold text-primary-600 hover:underline cursor-pointer"
                      >
                        {showSavedAddresses ? 'Enter Manually' : 'Use Saved Address'}
                      </button>
                    )}
                  </div>

                  {showSavedAddresses && addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          onClick={() => setAddress(addr.fullAddress)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${address === addr.fullAddress ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${address === addr.fullAddress ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                            {address === addr.fullAddress && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{addr.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{addr.fullAddress}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full apartment/street address..."
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50 min-h-[100px] resize-none text-sm"
                    ></textarea>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><CreditCard className="text-primary-600 w-5 h-5"/> Payment Method</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-primary-500 bg-primary-50">
                      <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-primary-600 cursor-pointer" />
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer opacity-50">
                      <input type="radio" disabled className="w-5 h-5 cursor-not-allowed" />
                      <span className="font-medium text-gray-500">Credit/Debit Card (Coming Soon)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900">&#8377; {cartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-gray-900">&#8377; 15</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mb-6">
                <span className="text-lg font-bold text-gray-900">Total Pay</span>
                <span className="text-2xl font-extrabold text-primary-600">&#8377; {cartTotal() + 15}</span>
              </div>
              
              {step === 'cart' ? (
                <button 
                  onClick={handleProceed}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-500 transition shadow-lg hover:shadow-primary-500/30 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button 
                  onClick={submitOrder}
                  disabled={placingOrder}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition shadow-lg hover:shadow-green-500/30 cursor-pointer disabled:opacity-50"
                >
                  {placingOrder ? 'Processing...' : 'Place Order Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
