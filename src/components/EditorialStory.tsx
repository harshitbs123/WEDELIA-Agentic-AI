import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';

export const EditorialStory: React.FC = () => {
  return (
    <section id="editorial" className="py-16 sm:py-24 border-b border-white/8 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4ff00] mb-2 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            <span>CAMPUS DISPATCH // ISSUE 01</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            WE DRESS THE MAIN CHARACTERS <br className="hidden sm:inline" />
            <span className="font-editorial italic font-normal text-neutral-400">of campus nightlife.</span>
          </h2>
        </div>

        {/* 3-Column Editorial Magazine Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card 1: Runway Energy (5 cols) */}
          <div className="lg:col-span-5 bg-[#121217] border border-white/8 p-4 flex flex-col justify-between">
            <div className="aspect-[3/4] overflow-hidden bg-neutral-900 mb-4 relative">
              <img
                src="/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg"
                alt="WEDELIA Campus Runway Series — Festival Movement"
                className="w-full h-full object-cover object-top filter contrast-110"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 text-[10px] font-mono text-[#d4ff00] uppercase border border-white/10">
                DISPATCH #48 // CONCERT CRAWL
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-neutral-500 mb-1">
                FESTIVAL SILHOUETTE LAB
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2 font-display">
                Engineered for Stage Strobe & 35mm Flash
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Most formal wear is designed for polite indoor cocktails. WEDELIA archives are curated for movement: breathable fabrics, reinforced bias seams, and metallic accents that come alive under concert strobes.
              </p>
            </div>
          </div>

          {/* Card 2: Fabric Materiality & Close-up (4 cols) */}
          <div className="lg:col-span-4 bg-[#121217] border border-white/8 p-4 flex flex-col justify-between">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-900 mb-4 relative">
              <img
                src="/assets/editorial/court-dress.jpg"
                alt="Tactile Metallic Gilded Silk Brocade"
                className="w-full h-full object-cover object-center filter contrast-125"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-white">
                TACTILE ARCHIVE // GOLD THREAD BROCADE
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-neutral-500 mb-1">
                TEXTILE PURITY
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2 font-display">
                Real Haute Materiality. Zero Polyester Churn.
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Fast-fashion rental compromises on cheap blends that snag. Every WEDELIA piece is authentic silk, heavy faille, or technical knit inspected by our master conservators before each delivery.
              </p>
            </div>
          </div>

          {/* Card 3: The Manifesto & Campus Map (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div className="bg-[#101014] border border-white/10 p-6 space-y-4">
              <div className="text-[#d4ff00] text-xs font-mono uppercase tracking-widest font-bold">
                CAMPUS DROPS
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Active dedicated drop hubs stationed near major student residential clusters in <b>Delhi NCR</b> (North Campus, South Campus, Noida), <b>Mumbai</b> (Bandra, Churchgate), and <b>Bangalore</b> (Koramangala, Indiranagar).
              </p>
              <div className="border-t border-white/10 pt-3 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                <span>Next Weekend Slots:</span>
                <span className="text-emerald-400 font-bold">84% BOOKED</span>
              </div>
            </div>

            <div className="bg-[#101014] border border-[#d4ff00]/20 p-6 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Host a Fitting Pop-Up
              </div>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                College society president or fest core coordinator? Partner with WEDELIA for an exclusive campus fitting lounge with 40+ archive pieces.
              </p>
              <a
                href="mailto:campus@wedelia-archive.com?subject=Campus%20Fitting%20Pop-up%20Inquiry"
                className="inline-flex items-center gap-1.5 text-xs text-[#d4ff00] hover:underline font-mono uppercase"
              >
                <span>Inquire for Fest 2026</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
