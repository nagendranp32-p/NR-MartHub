import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product, onSelect, darkMode }) {
  const whatsappUrl = `https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(product.name)}%20(Price:%20Rs.${product.price})`;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        darkMode 
          ? 'bg-[#180B13] border-rose-900/40 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-rose-950/50' 
          : 'bg-white border-stone-200/90 shadow-xs hover:shadow-2xl hover:border-stone-300'
      }`}
    >
      <div>
        {/* Garment Image */}
        <div className={`relative aspect-3/4 overflow-hidden ${darkMode ? 'bg-rose-950/40' : 'bg-rose-50/50'}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 left-3">
            <span className={`backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold shadow-xs border ${
              darkMode 
                ? 'bg-black/70 text-amber-300 border-amber-500/30' 
                : 'bg-white/95 text-rose-900 border-rose-100'
            }`}>
              {product.category}
            </span>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-white/95 text-slate-900 backdrop-blur rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Eye size={15} /> View Fabric Details
            </span>
          </div>
        </div>

        {/* Textile Details */}
        <div className="p-5">
          <h3 className={`font-bold transition-colors line-clamp-1 text-base font-serif ${
            darkMode ? 'text-rose-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-rose-950'
          }`}>
            {product.name}
          </h3>
          <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${darkMode ? 'text-rose-200/60' : 'text-slate-500'}`}>
            {product.description}
          </p>

          <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px]">
            {product.material && (
              <span className={`px-2.5 py-0.5 rounded-md font-semibold border ${
                darkMode 
                  ? 'bg-rose-950/60 text-amber-200/90 border-rose-900/60' 
                  : 'bg-rose-50 text-rose-900 border-rose-100'
              }`}>
                Fabric: {product.material}
              </span>
            )}
            {product.dimensions && (
              <span className={`px-2.5 py-0.5 rounded-md font-semibold border ${
                darkMode 
                  ? 'bg-amber-950/40 text-amber-300 border-amber-900/60' 
                  : 'bg-amber-50 text-amber-900 border-amber-100'
              }`}>
                Sizes: {product.dimensions}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className={`px-5 pb-5 pt-3 border-t flex items-center justify-between ${
        darkMode ? 'border-rose-950 bg-rose-950/30' : 'border-stone-100 bg-stone-50/60'
      }`}>
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest block ${darkMode ? 'text-rose-400/60' : 'text-slate-400'}`}>
            Showroom Price
          </span>
          <span className={`text-lg font-black ${darkMode ? 'text-amber-300' : 'text-rose-950'}`}>
            ₹{product.price}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-3.5 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Enquire
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}