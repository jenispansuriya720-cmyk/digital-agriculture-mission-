import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  IndianRupee,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, deliveryFee, totalAmount } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.mobile || '',
    village: user?.village || 'Sanand',
    district: user?.district || 'Ahmedabad',
    state: user?.state || 'Gujarat',
    pincode: '382110',
    landmark: 'Near Gram Panchayat',
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsPlacingOrder(true);
      const items = cart.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        unit: item.product.unit,
      }));

      const res = await orderService.createOrder({
        items,
        subtotal,
        deliveryFee,
        totalAmount,
        shippingAddress,
        paymentMethod: 'Kisan Pay / Cash on Delivery',
      });

      if (res.success && res.data) {
        clearCart();
        navigate('/orders');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center">
        <EmptyState
          icon={ShoppingCart}
          title="Your Shopping Cart is Empty"
          description="Explore certified seeds, soluble fertilizers, bio-pesticides, and drip irrigation accessories in the Krishi Marketplace."
          actionText="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-light-green text-primary rounded-2xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Kisan Agri Cart ({cart.length} Products)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Certified farm inputs fulfilled by authorized agricultural cooperatives
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline px-3 py-1.5"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Products List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft divide-y divide-gray-100">
            {cart.map(({ product, quantity }) => (
              <div key={product._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-primary uppercase">{product.brand}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-[11px] text-gray-500">{product.unit}</p>
                    <p className="text-xs font-black text-gray-900 mt-1">₹{product.price.toLocaleString()} each</p>
                  </div>
                </div>

                {/* Quantity Stepper & Subtotal */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-cream p-1 space-x-2">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-1 hover:bg-white rounded-lg text-gray-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="p-1 hover:bg-white rounded-lg text-gray-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right w-24">
                    <p className="text-sm font-black text-gray-900">
                      ₹{(product.price * quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-[11px] text-rose-500 hover:underline flex items-center justify-end space-x-0.5 mt-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-gray-100 flex items-center space-x-2.5 text-xs text-gray-600">
              <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>100% Genuine Agri-Certified</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-gray-100 flex items-center space-x-2.5 text-xs text-gray-600">
              <Truck className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Village Doorstep Delivery</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-gray-100 flex items-center space-x-2.5 text-xs text-gray-600">
              <IndianRupee className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Pay on Delivery (Kisan Pay)</span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Checkout Box */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-6">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Calculation
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Direct Rural Logistics</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-secondary font-bold">FREE (Orders &gt; ₹1,500)</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Govt Subsidy Exemption</span>
                <span className="font-bold text-secondary">0% GST on Certified Seeds</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-primary">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button
                type="button"
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark shadow-md shadow-primary/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-primary uppercase">Shipping Delivery Address</p>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600">Village</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.village}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, village: e.target.value })}
                      className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600">District</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.district}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                      className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-light-green/40 border border-secondary/30 text-[11px] text-primary">
                  <span className="font-bold">Payment Method: </span>
                  Kisan Pay / Cash on Delivery (Inspection before payment).
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-2/3 py-2.5 px-3 rounded-xl bg-secondary text-primary-dark font-black text-xs hover:bg-secondary-light transition-all shadow-md disabled:opacity-50"
                  >
                    {isPlacingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
