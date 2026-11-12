import React from 'react';
import { Shirt, MessageSquareQuote, Settings, Sun, Moon } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAdmin, darkMode, setDarkMode }) {
  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 shadow-xs ${
      darkMode 
        ? 'bg-[#150A10]/95 border-rose-950/70 text-rose-100' 
        : 'bg-white/95 border-rose-100 text-slate-900'
    }`}>
      <div className="w-full px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer">
          <div className="w-12 h-12 bg-rose-950 text-amber-300 rounded-2xl flex items-center justify-center shadow-md border border-amber-500/30">
            <Shirt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black tracking-tight font-serif ${darkMode ? 'text-amber-200' : 'text-rose-950'}`}>
                NR Mart Hub
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                darkMode 
                  ? 'bg-rose-950/80 text-amber-300 border-amber-500/30' 
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                Boutique
              </span>
            </div>
            <p className={`text-xs font-medium tracking-wide ${darkMode ? 'text-rose-300/70' : 'text-rose-900/60'}`}>
              Exclusive Textiles & Designer Silks
            </p>
          </div>
        </div>

        {/* Right Section: Dark Mode Toggle, Customer Tag, Admin, WhatsApp */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Dark / Light Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
              darkMode 
                ? 'bg-rose-950/60 border-amber-500/30 text-amber-300 hover:bg-rose-900' 
                : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={17} className="text-amber-300" /> : <Moon size={17} className="text-stone-700" />}
          </button>

          {currentUser && (
            <span className={`hidden lg:inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${
              darkMode 
                ? 'bg-rose-950/40 text-amber-200/90 border-rose-900/60' 
                : 'bg-rose-50 text-rose-900/80 border-rose-100'
            }`}>
              Customer: {currentUser.name}
            </span>
          )}

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer shadow-xs border ${
              darkMode
                ? 'bg-rose-950/80 text-amber-300 border-rose-900 hover:bg-rose-900'
                : 'text-rose-950 bg-rose-100 hover:bg-rose-200 border-rose-200'
            }`}
            title="Open Admin Dashboard"
          >
            <Settings size={15} className={darkMode ? 'text-amber-400' : 'text-rose-900'} />
            <span>Admin</span>
          </button>

          {/* WhatsApp Direct Enquiry */}
          <a
            href="https://wa.me/919360219967?text=Hello%20NR%20Mart%20Hub,%20I%20am%20looking%20for%20clothing%20enquiry."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-rose-900 hover:bg-rose-950 rounded-xl transition-all shadow-md shadow-rose-900/20"
          >
            <MessageSquareQuote size={16} className="text-amber-300" />
            <span className="hidden sm:inline">WhatsApp Enquiry</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

      </div>
    </header>
  );
}