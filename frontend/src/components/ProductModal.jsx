import React from 'react';
import { X, MessageCircle, CheckCircle2, Scissors, Sparkles } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const whatsappUrl = `https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(Price:%20Rs.${product.price})`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-rose-50 rounded-full text-slate-600 transition"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-rose-50/50 min-h-[360px] md:min-h-[460px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3 font-serif">{product.name}</h2>
              <div className="mt-2 text-2xl font-black text-rose-900">
                ₹{product.price}
                <span className="text-xs font-normal text-slate-500 ml-2">(Retail & Bulk Orders)</span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed border-t border-rose-50 pt-4">
                {product.description}
              </p>

              <div className="mt-5 space-y-2 text-xs">
                {product.material && (
                  <div className="flex items-center gap-2 text-slate-700 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                    <Scissors size={15} className="text-rose-700" />
                    <span className="font-bold text-slate-900">Fabric Quality:</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center gap-2 text-slate-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <Sparkles size={15} className="text-amber-700" />
                    <span className="font-bold text-slate-900">Sizes Available:</span>
                    <span>{product.dimensions}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-emerald-700 pt-2 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Direct Handpicked Weaves & Quality Assured</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-50">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded-2xl text-sm transition shadow-md"
              >
                <MessageCircle size={18} className="text-amber-300" />
                Enquire Stock on WhatsApp
              </a>
              <p className="text-center text-[11px] text-slate-400 mt-2">Chat directly with boutique staff for matching colors and blouse piece options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}