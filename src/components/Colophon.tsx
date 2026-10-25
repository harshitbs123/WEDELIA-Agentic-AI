import React from 'react';

export const Colophon: React.FC = () => {
  return (
    <footer className="bg-[#050507] border-t border-white/10 pt-16 pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Brand Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          <div className="md:col-span-6 space-y-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white font-display">
              WEDELIA
            </div>
            <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
              Premium fashion rental for moments that matter. Designed for young women who understand that personal style is about the entrance you make, not the clothes you own.
            </p>
            <div className="text-[11px] font-mono text-[#d4ff00]">
              DELHI NCR • MUMBAI • BANGALORE • HYDERABAD • CHENNAI
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-3">
              Campus Concierge
            </div>
            <div className="text-xs text-neutral-400">
              WhatsApp Support: +91 98112 04928
            </div>
            <div className="text-xs text-neutral-400">
              Direct: concierge@wedelia-archive.com
            </div>
            <div className="text-xs text-neutral-400">
              Campus Dispatch Hub: Hauz Khas Village, New Delhi
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-3">
              Rental Policies
            </div>
            <div className="text-xs text-neutral-400">Zero-Liability Damage Shield Included</div>
            <div className="text-xs text-neutral-400">Complimentary Secondary Backup Size</div>
            <div className="text-xs text-neutral-400">100% Security Deposit Refund Guarantee</div>
            <div className="text-xs text-neutral-400">Eco-Friendly Closed-Loop Solvent Cleaning</div>
          </div>
        </div>

        {/* Archival Creative Attribution (Strict adherence to design-taste-frontend rule) */}
        <div className="pt-8 pb-4 text-[10px] font-mono text-neutral-500 leading-relaxed space-y-1">
          <div className="text-neutral-400 font-bold uppercase tracking-wider mb-1">
            Archival & Open Collection Credits
          </div>
          <div>
            1. "Christian Dior evening gown called 'Zémire', Fall-Winter 1954 03" by Mabalu, CC BY-SA 4.0, via Wikimedia Commons.
          </div>
          <div>
            2. "Two Jean Dessès evening gowns, 1951", CC BY-SA 4.0, via Wikimedia Commons.
          </div>
          <div>
            3. "Robe longue, 1983.12.1(1)" by Paul Poiret, couturier, Public Domain (CC0), via Wikimedia Commons.
          </div>
          <div>
            4. "Strapless evening dresses with hoop skirt - rear view with lacing in the back" by Tobias ToMar Maier, CC BY-SA 3.0, via Wikimedia Commons.
          </div>
          <div>
            5. "Custo Barcelona at The Brandery Summer Edition 2010 -2" by thebrandery, CC BY 2.0, via Wikimedia Commons.
          </div>
          <div>
            6. "Court dress (ca. 1750), silk with metallic thread", Public Domain (CC0), via The Metropolitan Museum of Art.
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-600 gap-2">
          <div>© 2026 WEDELIA FASHION RENTAL ARCHIVE. ALL RIGHTS RESERVED.</div>
          <div className="text-[#d4ff00]">RENT THE LOOK FOR THE MOMENT.</div>
        </div>

      </div>
    </footer>
  );
};
