import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Check,
  Eye,
  Heart,
  Tag,
  X,
  Package,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const CATEGORIES = [
  'All',
  'Seeds',
  'Fertilizers',
  'Pest Control',
  'Nutrients',
  'Irrigation',
  'Machinery',
  'Tools',
  'Organic Products',
];

export const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart, totalItemCount } = useCart();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();
      if (sort === 'price_asc') params.sort = 'price_asc';
      if (sort === 'price_desc') params.sort = 'price_desc';
      if (sort === 'rating') params.sort = 'rating';

      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setToastMessage(`✓ Added "${product.name.slice(0, 24)}..." to cart.`);
    setTimeout(() => setToastMessage(''), 2500);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Agriculture Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Certified quality seeds, bio-pesticides, drip lateral kits, and farm machinery with direct farmer delivery
          </p>
        </div>

        <Link
          to="/cart"
          className="relative px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20"
        >
          <ShoppingCart className="w-4 h-4 text-secondary" />
          <span>View Cart</span>
          {totalItemCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-secondary text-primary-dark font-black text-xs">
              {totalItemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search seeds, sprays, solar drip..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs text-gray-400 font-medium">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <SkeletonLoader rows={4} height="h-64" />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No products found</h3>
          <p className="text-xs text-gray-400 mt-1">Try switching categories or clearing search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => setSelectedProduct(p)}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 border border-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.discountPercentage > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      {p.discountPercentage}% OFF
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {p.category}
                  </span>
                </div>

                {/* Brand & Title */}
                <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
                  {p.brand}
                </p>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mt-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.unit}</p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-gray-800">{p.rating}</span>
                  <span className="text-[10px] text-gray-400">({p.reviewsCount})</span>
                </div>
              </div>

              {/* Price & Add to Cart Button */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-gray-900">
                    ₹{p.price.toLocaleString()}
                  </span>
                  {p.originalPrice > p.price && (
                    <span className="block text-[11px] text-gray-400 line-through">
                      ₹{p.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(p, e)}
                  className="px-3.5 py-2 rounded-xl bg-light-green text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
              <span className="px-2.5 py-1 bg-light-green text-primary font-bold text-xs rounded-full">
                {selectedProduct.category}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-primary uppercase">{selectedProduct.brand}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{selectedProduct.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">• {selectedProduct.reviewsCount} Verified Reviews</span>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-gray-900">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-bold text-secondary">
                    Pack: {selectedProduct.unit}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center space-x-3">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center justify-center space-x-2 shadow-md shadow-primary/20"
                  >
                    <ShoppingCart className="w-4 h-4 text-secondary" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
