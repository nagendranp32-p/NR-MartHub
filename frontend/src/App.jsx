import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { getProducts } from './services/api';
import { Search, Sparkles, Award, Truck, ShieldCheck, Flame, SlidersHorizontal, X } from 'lucide-react';

const BOUTIQUE_COLLECTION = [
  {
    id: 1,
    name: "Pure Kanchipuram Bridal Silk Saree",
    category: "Silk Sarees",
    price: "6,999",
    dimensions: "Free Size (6.3m with Blouse)",
    material: "Pure Soft Mulberry Silk & Pure Zari",
    description: "Authentic bridal weave with rich contrast korvai zari border and grand brocade pallu piece.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
  },
  {
    id: 2,
    name: "Designer Floral Organza Anarkali Set",
    category: "Kurtis & Suits",
    price: "2,499",
    dimensions: "M, L, XL, XXL",
    material: "Pure Organza with Shantoon Lining",
    description: "Hand-painted floral flare suit set complemented with delicate border work and printed dupatta.",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800"
  },
  {
    id: 3,
    name: "Embroidered Royal Velvet Lehenga Choli",
    category: "Bridal Lehengas",
    price: "9,899",
    dimensions: "Semi-Stitched (Up to 42 Bust)",
    material: "Micro Velvet & Heavy Dori Embroidery",
    description: "Intricately detailed bridal ceremony lehenga with hand-crafted sequin work and dual net dupattas.",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
  },
  {
    id: 4,
    name: "Men's Tussar Silk Kurta & Woven Dhoti Set",
    category: "Mens Ethnic",
    price: "3,199",
    dimensions: "38, 40, 42, 44",
    material: "Handloom Tussar Silk",
    description: "Traditional gentleman's festive ensemble with zari piping details for weddings and celebrations.",
    imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800"
  }
];

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  // Dark Mode State with LocalStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('nr_boutique_darkmode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('nr_boutique_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Customer Gate State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nr_catalog_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic Categories State
  const [categories, setCategories] = useState(() => {
    const savedCats = localStorage.getItem('nr_boutique_categories');
    return savedCats
      ? JSON.parse(savedCats)
      : ['All', 'Silk Sarees', 'Kurtis & Suits', 'Bridal Lehengas', 'Mens Ethnic'];
  });

  const [products, setProducts] = useState(BOUTIQUE_COLLECTION);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const refreshProducts = () => {
    getProducts(selectedCategory)
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshProducts();
  }, [selectedCategory, isAdminView]);

  if (isAdminView) {
    return (
      <AdminPage
        onBackToCatalog={() => setIsAdminView(false)}
        categories={categories}
        setCategories={setCategories}
      />
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name?.toLowerCase().includes(query) ||
      p.material?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`w-full min-h-screen flex flex-col font-sans antialiased overflow-x-clip transition-colors duration-300 ${
        darkMode ? 'bg-[#0E060B] text-rose-100' : 'bg-[#FAF7F2] text-stone-900'
      }`}
    >
      {/* Customer Login Gate */}
      {!currentUser && <LoginModal onLoginSuccess={(user) => setCurrentUser(user)} />}

      {/* Navbar with Dark Mode Toggle Hook */}
      <Navbar
        currentUser={currentUser}
        onOpenAdmin={() => setIsAdminView(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Hero Showcase Section */}
      <section
        className={`w-full text-white py-7 sm:py-14 lg:py-20 px-4 sm:px-8 lg:px-16 border-b shadow-xl transition-colors duration-300 ${
          darkMode
            ? 'bg-gradient-to-r from-[#17050E] via-[#210915] to-[#12040B] border-rose-950/80'
            : 'bg-gradient-to-r from-[#210D15] via-[#2D121D] to-[#17080E] border-rose-950/60'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-rose-950/80 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-inner">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span>Direct Manufacturer &amp; Handloom Weaves</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-serif drop-shadow-md">
              Heritage Weaves &amp; Contemporary Silks
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-[#F3E8E8] max-w-3xl leading-relaxed font-light">
              Welcome to the exclusive digital catalog of <strong>NR Mart Hub Boutique</strong>. Browse our collection of pure silk sarees, handcrafted lehengas, and designer occasion wear. Direct WhatsApp consultation for bespoke stitching, matching colors, and dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-rose-900/60 text-xs">
              <div className="flex items-center gap-2 sm:gap-2.5 text-stone-200">
                <Award size={15} className="text-amber-400 shrink-0" />
                <span>100% Certified Pure Fabric Quality</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-stone-200">
                <Truck size={15} className="text-amber-400 shrink-0" />
                <span>Safe Doorstep Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-stone-200">
                <ShieldCheck size={15} className="text-amber-400 shrink-0" />
                <span>Wholesale &amp; Retail Showroom Pricing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#3B1726]/80 backdrop-blur-md border border-amber-500/20 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl space-y-3 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-2.5 sm:pb-3">
              <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Order Consultation
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-800">
                <Flame size={11} /> Fast Response
              </span>
            </div>

            <div className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-stone-200">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 border border-amber-400/30">
                  1
                </span>
                <span>Select an ensemble to view fabric specs and available sizes.</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 border border-amber-400/30">
                  2
                </span>
                <span>
                  Click <strong>&quot;Enquire&quot;</strong> to connect with our showroom stylists.
                </span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 border border-amber-400/30">
                  3
                </span>
                <span>Request live video showcase or confirm delivery over WhatsApp.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Showcase Section */}
      <main className="w-full max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 py-5 sm:py-10 flex-1">
        {/* Filter & Search Bar */}
        <div
          className={`p-3.5 sm:p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-5 mb-5 sm:mb-8 transition-colors duration-300 ${
            darkMode ? 'bg-[#180B13] border-rose-900/40' : 'bg-white border-stone-200'
          }`}
        >
          {/* Category Pills (Horizontal scroll on mobile, wrap on desktop) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap w-full md:w-auto">
            <span
              className={`shrink-0 text-[11px] sm:text-xs font-bold uppercase tracking-wider mr-0.5 flex items-center gap-1.5 ${
                darkMode ? 'text-rose-400/70' : 'text-stone-400'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Categories:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-950 text-amber-300 border border-amber-500/40 shadow-md'
                    : darkMode
                      ? 'bg-rose-950/40 text-rose-200 border border-rose-900/40 hover:bg-rose-900/60'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-rose-400' : 'text-stone-400'
              }`}
              size={16}
            />
            <input
              type="text"
              placeholder="Search silk, kurti, cotton, zari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm font-medium border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 transition ${
                darkMode
                  ? 'bg-rose-950/30 border-rose-900 text-rose-100 placeholder-rose-400/50 focus:bg-rose-950/60'
                  : 'bg-stone-50/60 border-stone-200 text-stone-900 focus:bg-white'
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Counter Row */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 px-1">
          <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-rose-300/80' : 'text-stone-600'}`}>
            Displaying{' '}
            <span className={`font-bold ${darkMode ? 'text-amber-300' : 'text-stone-900'}`}>
              {filteredProducts.length}
            </span>{' '}
            signature garments
          </p>

          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className={`shrink-0 text-xs font-bold hover:underline cursor-pointer ${
                darkMode ? 'text-amber-400' : 'text-rose-900'
              }`}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div
            className={`text-center py-16 sm:py-24 px-4 rounded-2xl sm:rounded-3xl border border-dashed ${
              darkMode ? 'bg-[#180B13] border-rose-900/50' : 'bg-white border-stone-300'
            }`}
          >
            <p className={`text-sm sm:text-base font-bold ${darkMode ? 'text-rose-200' : 'text-stone-700'}`}>
              No garments match your current selection.
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-rose-400/60' : 'text-stone-400'}`}>
              Try resetting filters or searching for sarees, lehengas, or kurtis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-7">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={setSelectedProduct}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </main>

      <Footer darkMode={darkMode} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}