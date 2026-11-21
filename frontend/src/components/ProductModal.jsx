import React from 'react';
import { X, MessageCircle, CheckCircle2, Scissors, Sparkles, ArrowUpRight } from 'lucide-react';

export default function ProductModal({
  product,
  allProducts = [],
  onSelectProduct,
  onClose,
  darkMode = false
}) {
  if (!product) return null;

  const whatsappUrl = `https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(Price:%20Rs.${product.price})`;

  // Same category items first (excluding current product); if fewer than 4, fill with other items
  const sameCategoryItems = allProducts.filter(
    (item) => item.id !== product.id && item.category === product.category
  );

  const otherItems = allProducts.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category &&
      !sameCategoryItems.some((s) => s.id === item.id)
  );

  const relatedProducts = [...sameCategoryItems, ...otherItems].slice(0, 4);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border my-auto max-h-[92dvh] flex flex-col ${
          darkMode
            ? 'bg-[#170911] border-rose-900/60 text-rose-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition cursor-pointer shadow-md ${
            darkMode
              ? 'bg-black/70 hover:bg-black text-amber-300 border border-amber-400/20'
              : 'bg-white/95 hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <X size={18} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Top Section: Main Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`min-h-[300px] sm:min-h-[380px] md:min-h-[440px] ${darkMode ? 'bg-rose-950/40' : 'bg-[#FAF7F2]'}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between">
              <div>
                <span
                  className={`inline-block text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-rose-950/70 text-amber-300 border-amber-500/30'
                      : 'text-rose-950 bg-[#FAF7F2] border-stone-200'
                  }`}
                >
                  {product.category}
                </span>

                <h2 className={`text-xl sm:text-2xl font-black mt-3 font-serif ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                  {product.name}
                </h2>

                <div className={`mt-2 text-2xl font-black ${darkMode ? 'text-amber-300' : 'text-rose-950'}`}>
                  ₹{product.price}
                  <span className={`text-xs font-normal ml-2 ${darkMode ? 'text-rose-300/60' : 'text-stone-500'}`}>
                    (Showroom Price)
                  </span>
                </div>

                {product.description && (
                  <p
                    className={`text-xs sm:text-sm mt-4 leading-relaxed border-t pt-4 ${
                      darkMode ? 'text-rose-200/80 border-rose-900/50' : 'text-stone-600 border-stone-100'
                    }`}
                  >
                    {product.description}
                  </p>
                )}

                <div className="mt-5 space-y-2.5 text-xs">
                  {product.dimensions && (
                    <div
                      className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode
                          ? 'bg-amber-950/30 text-amber-200 border-amber-500/20'
                          : 'text-stone-700 bg-[#FAF7F2] border-stone-200/80'
                      }`}
                    >
                      <Sparkles size={15} className="text-amber-500 shrink-0" />
                      <span className="font-bold">Sizes:</span>
                      <span>{product.dimensions}</span>
                    </div>
                  )}

                  {product.material && (
                    <div
                      className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode
                          ? 'bg-rose-950/50 text-rose-100 border-rose-900/50'
                          : 'text-stone-700 bg-[#FAF7F2] border-stone-200/80'
                      }`}
                    >
                      <Scissors size={15} className="text-rose-800 shrink-0" />
                      <span className="font-bold">Fabric:</span>
                      <span>{product.material}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-emerald-600 pt-1 font-semibold">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>Direct Boutique Showcase &amp; Verified Quality</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-rose-900/50' : 'border-stone-100'}`}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-2xl text-sm transition shadow-md"
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section: Related Products */}
          {relatedProducts.length > 0 && (
            <div
              className={`p-5 sm:p-7 border-t ${
                darkMode ? 'bg-[#12070D] border-rose-900/60' : 'bg-[#FAF7F2] border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-base sm:text-lg font-bold font-serif ${darkMode ? 'text-amber-200' : 'text-stone-900'}`}>
                    Related Designs
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-rose-300/65' : 'text-stone-500'}`}>
                    More pieces you may also like
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct && onSelectProduct(rel)}
                    className={`group rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                      darkMode
                        ? 'bg-[#1B0B14] border-rose-900/40 hover:border-amber-400/50'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <p className={`text-xs font-bold line-clamp-1 font-serif ${darkMode ? 'text-rose-100' : 'text-stone-900'}`}>
                        {rel.name}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className={`text-xs font-black ${darkMode ? 'text-amber-300' : 'text-rose-950'}`}>
                          ₹{rel.price}
                        </span>
                        <ArrowUpRight
                          size={13}
                          className={darkMode ? 'text-amber-300/80' : 'text-stone-400 group-hover:text-rose-950'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}