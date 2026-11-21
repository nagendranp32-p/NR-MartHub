import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product, onSelect, darkMode }) {
  const whatsappUrl = `https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(product.name)}%20(Price:%20Rs.${product.price})`;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group w-full min-w-0 rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        darkMode
          ? 'bg-[#180B13] border-rose-900/40 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-rose-950/50'
          : 'bg-white border-stone-200/90 shadow-xs hover:shadow-2xl hover:border-stone-300'
      }`}
    >
      <div className="w-full min-w-0">
        {/* Strictly Bounded Image Container */}
        <div
          className={`relative w-full aspect-[3/4] overflow-hidden ${
            darkMode ? 'bg-rose-950/40' : 'bg-[#FAF7F2]'
          }`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-top block group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute top-3 left-3 max-w-[85%]">
            <span
              className={`inline-block truncate backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold shadow-xs border ${
                darkMode
                  ? 'bg-black/75 text-amber-300 border-amber-500/30'
                  : 'bg-white/95 text-rose-950 border-stone-200'
              }`}
            >
              {product.category}
            </span>
          </div>

          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-white/95 text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Eye size={14} /> View Details
            </span>
          </div>
        </div>

        {/* Garment Details */}
        <div className="p-4 sm:p-5 min-w-0">
          <h3
            className={`font-bold transition-colors truncate text-sm sm:text-base font-serif ${
              darkMode
                ? 'text-rose-100 group-hover:text-amber-300'
                : 'text-stone-900 group-hover:text-rose-950'
            }`}
          >
            {product.name}
          </h3>

          {product.description && (
            <p
              className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                darkMode ? 'text-rose-200/65' : 'text-stone-500'
              }`}
            >
              {product.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            {product.dimensions && (
              <span
                className={`px-2.5 py-0.5 rounded-md font-semibold border truncate max-w-full ${
                  darkMode
                    ? 'bg-amber-950/40 text-amber-300 border-amber-900/60'
                    : 'bg-[#FAF7F2] text-stone-700 border-stone-200'
                }`}
              >
                Size: {product.dimensions}
              </span>
            )}
            {product.material && (
              <span
                className={`px-2.5 py-0.5 rounded-md font-semibold border truncate max-w-full ${
                  darkMode
                    ? 'bg-rose-950/60 text-rose-200 border-rose-900/60'
                    : 'bg-rose-50/70 text-rose-950 border-rose-100'
                }`}
              >
                {product.material}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div
        className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t flex items-center justify-between gap-2 ${
          darkMode ? 'border-rose-950 bg-rose-950/25' : 'border-stone-100 bg-[#FAF7F2]/70'
        }`}
      >
        <div className="min-w-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block ${
              darkMode ? 'text-rose-400/60' : 'text-stone-400'
            }`}
          >
            Price
          </span>
          <span
            className={`text-base sm:text-lg font-black truncate block ${
              darkMode ? 'text-amber-300' : 'text-rose-950'
            }`}
          >
            ₹{product.price}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-[#210D15] hover:bg-rose-950 text-amber-300 rounded-xl text-xs font-bold transition shadow-xs"
        >
          <span>Enquire</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}