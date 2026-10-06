import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-light-green text-primary rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              My Orders & Dispatches ({orders.length})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live tracking for seeds, crop nutrients, drip kits, and machinery shipments
            </p>
          </div>
        </div>

        <Link
          to="/marketplace"
          className="px-4 py-2 text-xs font-bold text-primary bg-light-green/60 hover:bg-light-green rounded-xl transition-colors"
        >
          Explore More Products
        </Link>
      </div>

      {isLoading ? (
        <SkeletonLoader rows={4} height="h-32" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="Purchase certified seeds, crop protection bio-sprays, or irrigation fittings with rural doorstep delivery."
          actionText="Visit Marketplace"
          onAction={() => (window.location.href = '/marketplace')}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all space-y-4"
            >
              {/* Order Meta Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-extrabold text-gray-900">
                    Order #{order.orderId}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="text-xs text-gray-500 flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-gray-700">
                    Payment: <span className="text-emerald-700">{order.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {item.unit} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Tracking Timeline & Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>
                    Ship to: <strong className="text-gray-800">{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.village}, {order.shippingAddress?.district})
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-xs text-gray-500">Total Amount:</span>
                  <span className="text-lg font-black text-primary">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
