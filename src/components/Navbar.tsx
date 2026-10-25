import React from 'react';
import { ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenVault: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVault, cartCount }) => {
  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#wardrobe"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#d4ff00] focus:text-black focus:font-bold focus:text-xs uppercase"
      >
        Skip to wardrobe collection
      </a>

      <header className="sticky top-0 z-40 bg-[#08080a]/95 backdrop-blur-md border-b border-white/8 transition-colors">
        {/* Kinetic Top Campus Dispatch Bar */}
        <div className="bg-[#101014] border-b border-white/5 py-1.5 px-4 text-[11px] font-mono uppercase tracking-wider text-neutral-400 overflow-hidden">
          <div className="flex items-center justify-between gap-4 whitespace-nowrap">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
              <span className="inline-block w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse shrink-0"></span>
              <span className="font-semibold text-neutral-200">CAMPUS DISPATCH:</span>
              <span className="truncate">Delivering to DU North/South, NIFT, IIT, Ashoka, St. Xavier's & 40+ Campuses</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-neutral-400 shrink-0">
              <span>₹0 Damage Shield</span>
              <span>•</span>
              <span>Free Backup Size Included</span>
              <span>•</span>
              <span className="text-[#d4ff00] font-semibold">Fest Weekend Dispatch Active</span>
            </div>
          </div>
        </div>

        {/* Main Editorial Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-baseline gap-4">
            <a 
              href="#" 
              className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-white font-display hover:text-[#d4ff00] transition-colors"
              aria-label="WEDELIA Home"
            >
              WEDELIA
            </a>
            <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-neutral-500 font-sans border-l border-white/10 pl-3">
              Haute Rental Archive
            </span>
          </div>

          {/* Curated Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-widest text-neutral-300 font-medium">
            <a href="#wardrobe" className="hover:text-white transition-colors">The Collection</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Rental Formula</a>
            <a href="#editorial" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Campus Dispatch</span>
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#wardrobe"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white px-3 py-2 border border-white/10 rounded-sm hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff00]"
            >
              <span>Explore Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00]" />
            </a>

            <button
              onClick={onOpenVault}
              className="relative flex items-center gap-2 bg-[#d4ff00] hover:bg-[#c2eb00] text-black px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-extrabold uppercase tracking-wider transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`View reserved looks, ${cartCount} items in queue`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Reserved Look</span>
              {cartCount > 0 && (
                <span className="bg-black text-[#d4ff00] text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
