import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { getProducts } from './services/api';
import { Search, Sparkles, Award, Truck, ShieldCheck, Flame, SlidersHorizontal } from 'lucide-react';

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
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }} 
      className={`flex flex-col font-sans antialiased transition-colors duration-300 ${
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
        style={{ width: '100%' }} 
        className={`text-white py-14 lg:py-20 px-6 sm:px-12 lg:px-20 border-b shadow-xl transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-r from-[#17050E] via-[#210915] to-[#12040B] border-rose-950/80' 
            : 'bg-gradient-to-r from-[#210D15] via-[#2D121D] to-[#17080E] border-rose-950/60'
        }`}
      >
        <div style={{ width: '100%' }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-inner">
              <Sparkles size={14} className="text-amber-400" />
              <span>Direct Manufacturer & Handloom Weaves</span>
            </div>

            <h1 style={{ color: '#FFFFFF' }} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight font-serif drop-shadow-md">
              Heritage Weaves & Contemporary Silks
            </h1>

            <p style={{ color: '#F3E8E8' }} className="text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed font-light">
              Welcome to the exclusive digital catalog of <strong>NR Mart Hub Boutique</strong>. Browse our collection of pure silk sarees, handcrafted lehengas, and designer occasion wear. Direct WhatsApp consultation for bespoke stitching, matching colors, and dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rose-900/60 text-xs">
              <div className="flex items-center gap-2.5 text-stone-200">
                <Award size={18} className="text-amber-400 shrink-0" />
                <span>100% Certified Pure Fabric Quality</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-200">
                <Truck size={18} className="text-amber-400 shrink-0" />
                <span>Safe Doorstep Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-200">
                <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                <span>Wholesale & Retail Showroom Pricing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#3B1726]/80 backdrop-blur-md border border-amber-500/20 p-7 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">Order Consultation</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                <Flame size={12} /> Fast Response
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-200">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-400/30">1</span>
                <span>Select an ensemble to view fabric specs and available sizes.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-400/30">2</span>
                <span>Click <strong>"Enquire"</strong> to connect with our showroom stylists.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-400/30">3</span>
                <span>Request live video showcase or confirm delivery over WhatsApp.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Showcase Section */}
      <main style={{ width: '100%' }} className="px-6 sm:px-12 lg:px-20 py-10 flex-1">
        
        {/* Filter & Search Bar */}
        <div 
          style={{ width: '100%' }} 
          className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 mb-8 transition-colors duration-300 ${
            darkMode 
              ? 'bg-[#180B13] border-rose-900/40' 
              : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className={`text-xs font-bold uppercase tracking-wider mr-2 flex items-center gap-1.5 ${
              darkMode ? 'text-rose-400/70' : 'text-stone-400'
            }`}>
              <SlidersHorizontal size={15} /> Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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

          <div className="relative w-full md:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-rose-400' : 'text-stone-400'}`} size={17} />
            <input
              type="text"
              placeholder="Search silk, kurti, cotton, zari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 transition ${
                darkMode 
                  ? 'bg-rose-950/30 border-rose-900 text-rose-100 placeholder-rose-400/50 focus:bg-rose-950/60' 
                  : 'bg-stone-50/60 border-stone-200 text-stone-900 focus:bg-white'
              }`}
            />
          </div>
        </div>

        {/* Counter Row */}
        <div style={{ width: '100%' }} className="flex items-center justify-between mb-6 px-1">
          <p className={`text-sm font-semibold ${darkMode ? 'text-rose-300/80' : 'text-stone-600'}`}>
            Displaying <span className={`font-bold ${darkMode ? 'text-amber-300' : 'text-stone-900'}`}>{filteredProducts.length}</span> signature garments
          </p>
          
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              Show All Collections
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div 
            style={{ width: '100%' }} 
            className={`text-center py-24 rounded-3xl border border-dashed ${
              darkMode ? 'bg-[#180B13] border-rose-900/50' : 'bg-white border-stone-300'
            }`}
          >
            <p className={`text-base font-bold ${darkMode ? 'text-rose-200' : 'text-stone-700'}`}>
              No garments match your current selection.
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-rose-400/60' : 'text-stone-400'}`}>
              Try resetting filters or searching for sarees, lehengas, or kurtis.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%' }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-7">
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

      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}