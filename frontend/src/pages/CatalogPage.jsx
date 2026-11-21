import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import {
  Search,
  Sparkles,
  MessageCircle,
  SlidersHorizontal,
  X,
  ArrowLeft,
  Scissors,
  CheckCircle2
} from 'lucide-react';

export default function CatalogPage({
  darkMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  selectedProduct,
  setSelectedProduct
}) {
  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProduct]);

  const scrollToCollection = () => {
    const el = document.getElementById('boutique-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Selected Product Detail Screen with Sticky Selected Item & Scrollable Related Products Below
  if (selectedProduct) {
    const sameCategoryItems = filteredProducts.filter(
      (item) => item.id !== selectedProduct.id && item.category === selectedProduct.category
    );
    const otherItems = filteredProducts.filter(
      (item) =>
        item.id !== selectedProduct.id &&
        item.category !== selectedProduct.category &&
        !sameCategoryItems.some((s) => s.id === item.id)
    );
    const relatedProducts = [...sameCategoryItems, ...otherItems];

    const whatsappUrl = `https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20am%20interested%20in%20${encodeURIComponent(
      selectedProduct.name
    )}%20(Price:%20Rs.${selectedProduct.price})`;

    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex-1">
        {/* Top Back Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
              darkMode
                ? 'bg-[#180B13] text-amber-300 border-rose-900/60 hover:bg-rose-950/60'
                : 'bg-white text-stone-900 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </button>
        </div>

        {/* Sticky Selected Catalog Section */}
        <section
          className={`lg:sticky lg:top-24 z-20 rounded-3xl border shadow-lg overflow-hidden mb-10 transition-colors ${
            darkMode
              ? 'bg-[#180B13] border-rose-900/60 text-rose-100'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Selected Product Photo */}
            <div
              className={`md:col-span-5 aspect-[3/4] md:aspect-auto md:max-h-[520px] overflow-hidden ${
                darkMode ? 'bg-rose-950/40' : 'bg-[#FAF7F2]'
              }`}
            >
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-top block"
              />
            </div>

            {/* Selected Product Details */}
            <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <span
                  className={`inline-block text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-rose-950/70 text-amber-300 border-amber-500/30'
                      : 'text-rose-950 bg-[#FAF7F2] border-stone-200'
                  }`}
                >
                  {selectedProduct.category}
                </span>

                <h1
                  className={`text-2xl sm:text-3xl font-black mt-3 font-serif ${
                    darkMode ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {selectedProduct.name}
                </h1>

                <div
                  className={`mt-2 text-2xl sm:text-3xl font-black ${
                    darkMode ? 'text-amber-300' : 'text-rose-950'
                  }`}
                >
                  ₹{selectedProduct.price}
                </div>

                {selectedProduct.description && (
                  <p
                    className={`text-sm mt-4 leading-relaxed border-t pt-4 ${
                      darkMode
                        ? 'text-rose-200/80 border-rose-900/50'
                        : 'text-stone-600 border-stone-100'
                    }`}
                  >
                    {selectedProduct.description}
                  </p>
                )}

                <div className="mt-5 space-y-2.5 text-xs sm:text-sm">
                  {selectedProduct.dimensions && (
                    <div
                      className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                        darkMode
                          ? 'bg-amber-950/30 text-amber-200 border-amber-500/20'
                          : 'text-stone-700 bg-[#FAF7F2] border-stone-200/80'
                      }`}
                    >
                      <Sparkles size={16} className="text-amber-500 shrink-0" />
                      <span className="font-bold">Available Sizes:</span>
                      <span>{selectedProduct.dimensions}</span>
                    </div>
                  )}

                  {selectedProduct.material && (
                    <div
                      className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                        darkMode
                          ? 'bg-rose-950/50 text-rose-100 border-rose-900/50'
                          : 'text-stone-700 bg-[#FAF7F2] border-stone-200/80'
                      }`}
                    >
                      <Scissors size={16} className="text-rose-800 shrink-0" />
                      <span className="font-bold">Fabric:</span>
                      <span>{selectedProduct.material}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-emerald-600 pt-1 font-semibold">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>NR Mart Hub Verified Boutique Collection</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-5 border-t ${darkMode ? 'border-rose-900/50' : 'border-stone-100'}`}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-2xl text-sm transition shadow-md"
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Below (Moves as you scroll) */}
        <section className="pt-2">
          <div className="mb-5">
            <h2
              className={`text-xl sm:text-2xl font-bold font-serif ${
                darkMode ? 'text-amber-200' : 'text-stone-900'
              }`}
            >
              Related Products
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-rose-300/70' : 'text-stone-500'}`}>
              Scroll to browse more garments from our collection
            </p>
          </div>

          {relatedProducts.length === 0 ? (
            <div
              className={`p-8 rounded-2xl border text-center text-xs sm:text-sm ${
                darkMode
                  ? 'bg-[#180B13] border-rose-900/40 text-rose-300/70'
                  : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              No other products available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelect={setSelectedProduct}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <>
      {/* Clean & Luxury Hero Banner */}
      <section
        className={`w-full text-white py-12 sm:py-16 lg:py-24 px-5 sm:px-8 lg:px-16 border-b transition-colors duration-300 ${
          darkMode
            ? 'bg-gradient-to-br from-[#19060F] via-[#260B18] to-[#12040A] border-rose-950/80'
            : 'bg-gradient-to-br from-[#210D15] via-[#2E131E] to-[#19080F] border-rose-950/60'
        }`}
      >
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={13} className="text-amber-400 shrink-0" />
            <span>NR Mart Hub Boutique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-serif">
            Timeless Silks &amp; Festive Weaves
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-rose-100/85 max-w-xl mx-auto leading-relaxed font-normal">
            Handpicked silk sarees, designer suits, and occasion wear with direct WhatsApp styling support.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={scrollToCollection}
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-rose-950 font-extrabold rounded-2xl text-sm transition shadow-lg cursor-pointer"
            >
              Explore Collection
            </button>

            <a
              href="https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20would%20like%20to%20see%20today's%20latest%20collection."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} className="text-amber-300 shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Showcase Section */}
      <main
        id="boutique-collection"
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-7 sm:py-10 flex-1"
      >
        {/* Filter & Search Bar */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 transition-colors duration-300 ${
            darkMode ? 'bg-[#180B13] border-rose-900/40' : 'bg-white border-stone-200'
          }`}
        >
          {/* Category Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 md:pb-0 md:flex-wrap w-full md:w-auto">
            <span
              className={`shrink-0 text-xs font-bold uppercase tracking-wider mr-1 flex items-center gap-1.5 ${
                darkMode ? 'text-rose-400/70' : 'text-stone-400'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Categories:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
              className={`w-full pl-10 pr-9 py-3 text-sm font-medium border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 transition ${
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
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Counter Row */}
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6 px-1">
          <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-rose-300/80' : 'text-stone-600'}`}>
            Showing{' '}
            <span className={`font-bold ${darkMode ? 'text-amber-300' : 'text-stone-900'}`}>
              {filteredProducts.length}
            </span>{' '}
            designs
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
              Reset Filter
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div
            className={`text-center py-16 sm:py-24 px-5 rounded-2xl sm:rounded-3xl border border-dashed ${
              darkMode ? 'bg-[#180B13] border-rose-900/50' : 'bg-white border-stone-300'
            }`}
          >
            <p className={`text-sm sm:text-base font-bold ${darkMode ? 'text-rose-200' : 'text-stone-700'}`}>
              No garments found for your filter.
            </p>
            <p className={`text-xs mt-1.5 ${darkMode ? 'text-rose-400/60' : 'text-stone-400'}`}>
              Try another category or clear your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
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
    </>
  );
}