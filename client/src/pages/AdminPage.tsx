import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Tractor,
  Wheat,
  ShoppingBag,
  PackageCheck,
  Landmark,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  X,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import { marketService } from '../services/marketService';
import { orderService } from '../services/orderService';
import { schemeService } from '../services/schemeService';
import { User, Product, MarketPrice, Order, Scheme } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const TABS = [
  { id: 'overview', name: 'Dashboard Overview', icon: BarChart3 },
  { id: 'farmers', name: 'Farmers Management', icon: Users },
  { id: 'products', name: 'Marketplace Products', icon: ShoppingBag },
  { id: 'market', name: 'Mandi Prices', icon: TrendingUp },
  { id: 'orders', name: 'Orders Dispatch', icon: PackageCheck },
  { id: 'schemes', name: 'Government Schemes', icon: Landmark },
];

const COLORS = ['#166534', '#22C55E', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isAddProductModal, setIsAddProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Seeds',
    brand: '',
    price: '',
    originalPrice: '',
    stockQuantity: '100',
    unit: '1 pack',
    description: '',
  });

  // Guard: Admin authorization check
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const loadAllAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, farmersRes, prodsRes, marketRes, ordersRes, schemesRes] =
        await Promise.allSettled([
          adminService.getStats(),
          adminService.getAllUsers(),
          productService.getProducts(),
          marketService.getMarketPrices(),
          orderService.getMyOrders(),
          schemeService.getSchemes(),
        ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (farmersRes.status === 'fulfilled' && farmersRes.value.success) {
        setFarmers(farmersRes.value.data);
      }
      if (prodsRes.status === 'fulfilled' && prodsRes.value.success) {
        setProducts(prodsRes.value.data);
      }
      if (marketRes.status === 'fulfilled' && marketRes.value.success) {
        setMarketPrices(marketRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success) {
        setOrders(ordersRes.value.data);
      }
      if (schemesRes.status === 'fulfilled' && schemesRes.value.success) {
        setSchemes(schemesRes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleToggleBlock = async (farmerId: string) => {
    try {
      const res = await adminService.toggleBlockUser(farmerId);
      if (res.success) {
        setFarmers((prev) =>
          prev.map((f) => (f._id === farmerId ? { ...f, isBlocked: !f.isBlocked } : f))
        );
        setToastMessage(res.message);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDeleteFarmer = async (farmerId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this farmer account and all associated farms?')) return;
    try {
      await adminService.deleteUser(farmerId);
      setFarmers((prev) => prev.filter((f) => f._id !== farmerId));
      setToastMessage('✓ Farmer deleted successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert('Could not delete user');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Remove product from marketplace?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setToastMessage('✓ Product removed.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert('Could not delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status as any } : o))
        );
        setToastMessage(`✓ Order status updated to ${status}.`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      alert('Could not update order status');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await productService.createProduct({
        name: productForm.name,
        category: productForm.category as any,
        brand: productForm.brand,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price) * 1.15,
        stockQuantity: Number(productForm.stockQuantity),
        unit: productForm.unit,
        description: productForm.description,
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&q=80&w=400',
      });

      if (res.success && res.data) {
        setProducts([res.data, ...products]);
        setIsAddProductModal(false);
        setToastMessage('✓ Product added to marketplace.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      alert('Error adding product');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-primary text-white shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Platform Administration Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Admin Role
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Krishi Digital unified administration: farmers, crops, mandi records, catalog, and dispatches
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Connected to MongoDB Database: <strong className="text-primary font-mono">krishi_digital</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-cream'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <SkeletonLoader rows={5} height="h-28" />
      ) : (
        <>
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* 7 Core Platform Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Farmers</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalFarmers}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Farms</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalFarms}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Crops</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalCrops}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Products</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Orders</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Experts</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalExperts}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Revenue</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Charts Row: Crop Distribution & Orders Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Crop Distribution Across Registered Farms
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Total acreage cultivated by crop type</p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.cropDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" Ac" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                        />
                        <Bar dataKey="area" name="Total Area (Acres)" fill="#166534" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Marketplace Fulfillment Pipeline
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Status of farmer shipments & orders</p>
                  <div className="space-y-3 pt-2">
                    {Object.entries(stats.ordersByStatus || {}).map(([st, cnt]: any) => (
                      <div key={st} className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700">{st}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-gray-900">{cnt} Orders</span>
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FARMERS MANAGEMENT */}
          {activeTab === 'farmers' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Registered Farmers Database ({farmers.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/60">
                      <th className="py-3 px-4">Farmer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Land / Crop</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {farmers.map((f) => (
                      <tr key={f._id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {f.name}
                          <span className="block text-[11px] font-normal text-gray-400 capitalize">
                            Role: {f.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {f.mobile}
                          <span className="block text-[11px] text-gray-400">{f.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {f.village}, {f.district}
                          <span className="block text-[11px] text-gray-400">{f.state}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {f.landArea} Acres
                          <span className="block text-[11px] text-primary">{f.primaryCrop}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              f.isBlocked
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {f.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleBlock(f._id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                            title={f.isBlocked ? 'Unblock Farmer' : 'Suspend / Block Farmer'}
                          >
                            {f.isBlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                          </button>
                          <button
                            onClick={() => handleDeleteFarmer(f._id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                            title="Delete Farmer Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Marketplace Products ({products.length})
                </h3>
                <button
                  onClick={() => setIsAddProductModal(true)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/60">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {p.name}
                          <span className="block text-[11px] font-normal text-gray-400">{p.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{p.category}</td>
                        <td className="py-3.5 px-4 font-semibold text-primary">{p.brand}</td>
                        <td className="py-3.5 px-4 font-black text-gray-900">₹{p.price.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                            {p.stockQuantity} in stock
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS DISPATCH */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                All Orders & Dispatches ({orders.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/60">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Farmer Details</th>
                      <th className="py-3 px-4">Items Count</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-black text-gray-900">{o.orderId}</td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {o.shippingAddress?.fullName}
                          <span className="block text-[11px] text-gray-400">
                            {o.shippingAddress?.village}, {o.shippingAddress?.district}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{o.items.length} Items</td>
                        <td className="py-3.5 px-4 font-black text-primary">₹{o.totalAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MANDI PRICES */}
          {activeTab === 'market' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                APMC Mandi Price Board ({marketPrices.length} Records)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/60">
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Market</th>
                      <th className="py-3 px-4">Min Price</th>
                      <th className="py-3 px-4">Max Price</th>
                      <th className="py-3 px-4">Modal Price</th>
                      <th className="py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketPrices.map((m) => (
                      <tr key={m._id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{m.crop}</td>
                        <td className="py-3.5 px-4 text-gray-600">{m.market} ({m.district})</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">₹{m.minPrice.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">₹{m.maxPrice.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-black text-gray-900">₹{m.modalPrice.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{m.trend.toUpperCase()} (+{m.changePercent}%)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: GOVERNMENT SCHEMES */}
          {activeTab === 'schemes' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Government Subsidies & Schemes ({schemes.length})
              </h3>

              <div className="space-y-3">
                {schemes.map((s) => (
                  <div key={s._id} className="p-4 rounded-2xl bg-cream border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-gray-900">{s.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-light-green text-primary">
                          {s.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{s.benefits}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{s.deadline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Product Modal */}
      {isAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900">Add New Marketplace Product</h3>
              <button onClick={() => setIsAddProductModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Certified Groundnut Seeds GG-20"
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Nutrients">Nutrients</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Organic Products">Organic Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Brand *</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. GSFC Agro"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Original (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Stock Qty</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Packaging Unit</label>
                <input
                  type="text"
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  placeholder="e.g. 25 kg bag, 1 Litre bottle"
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
