import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Shirt } from 'lucide-react';

interface HeroProps {
  onSelectOccasion: (occ: string) => void;
  activeOccasion: string;
}

export const Hero: React.FC<HeroProps> = ({ onSelectOccasion, activeOccasion }) => {
  const [heroLookMode, setHeroLookMode] = useState<'runway' | 'gala'>('runway');

  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-20 border-b border-white/8 bg-grain overflow-hidden">
      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-12 border-x border-white/5">
          <div className="col-span-4 border-r border-white/5 hidden lg:block h-full"></div>
          <div className="col-span-4 border-r border-white/5 hidden lg:block h-full"></div>
          <div className="col-span-4 hidden lg:block h-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Statement & Interaction Engine (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Supertitle metadata */}
            <div className="hero-enter inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#d4ff00]"></span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 whitespace-nowrap">
                CAMPUS WARDROBE VAULT • AUTUMN/SPRING 2026
              </span>
            </div>

            {/* Main Headline (Syne font, strict typography) */}
            <h1 className="hero-enter text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95] mb-5 font-display">
              RENT THE LOOK <br />
              <span className="text-neutral-400 font-editorial italic font-normal tracking-tight">for the</span>{' '}
              <span className="text-[#d4ff00] underline decoration-1 underline-offset-8">MOMENT.</span>
            </h1>

            {/* Editorial Thesis Statement */}
            <p className="hero-enter text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-6 font-light">
              You have somewhere to go and you need an unforgettable entrance. Don't spend ₹35,000 on an outfit you'll be photographed in once. Rent runway archive pieces, festival metallics, and farewell gowns for 3, 5, or 7 days.
            </p>

            {/* Interactive Moment Selector Engine */}
            <div className="hero-enter mb-6 p-4 bg-[#101014] border border-white/10 rounded-sm">
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center justify-between">
                <span>Where are you heading this week?</span>
                <span className="text-[#d4ff00] text-[10px] font-bold">Filter Live Collection</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Looks' },
                  { id: 'fest', label: 'College Fest Star Night' },
                  { id: 'concert', label: 'Concert & Rave' },
                  { id: 'farewell', label: 'Farewell Gala' },
                  { id: 'freshers', label: 'Freshers Social' },
                  { id: 'afterdark', label: 'After-Dark Ball' },
                ].map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => {
                      onSelectOccasion(occ.id);
                      document.getElementById('wardrobe')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all ${
                      activeOccasion === occ.id
                        ? 'bg-[#d4ff00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                        : 'bg-[#18181f] text-neutral-300 hover:text-white hover:bg-neutral-800 border border-white/5'
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Call to Action and Guarantees */}
            <div className="hero-enter flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              <a
                href="#wardrobe"
                className="inline-flex items-center gap-2 bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3.5 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Explore The Wardrobe</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors border-b border-neutral-700 hover:border-white py-1"
              >
                <span>How Campus Rental Works</span>
              </a>
            </div>

            {/* Three Institutional Guarantees */}
            <div className="hero-enter grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-neutral-400">
              <div className="flex items-start gap-2">
                <Shirt className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">Free Backup Size</div>
                  <div className="text-[10px] text-neutral-400 leading-tight">Every bag includes a 2nd size for zero fit anxiety</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">₹0 Damage Shield</div>
                  <div className="text-[10px] text-neutral-400 leading-tight">Accidental spills & tears 100% insured</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">Return Unwashed</div>
                  <div className="text-[10px] text-neutral-400 leading-tight">We handle eco closed-loop dry cleaning</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fashion Editorial Hero Focus (5 Cols) */}
          <div className="hero-enter lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Dual Look Toggle Controls */}
              <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-mono uppercase">
                <span className="text-neutral-400">FEATURED ARCHIVE HERO:</span>
                <div className="flex gap-1 bg-[#101014] p-0.5 border border-white/10">
                  <button
                    onClick={() => setHeroLookMode('runway')}
                    className={`px-2 py-0.5 transition-colors ${
                      heroLookMode === 'runway' ? 'bg-[#d4ff00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    FEST RUNWAY
                  </button>
                  <button
                    onClick={() => setHeroLookMode('gala')}
                    className={`px-2 py-0.5 transition-colors ${
                      heroLookMode === 'gala' ? 'bg-[#d4ff00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    GALA SILHOUETTE
                  </button>
                </div>
              </div>

              {/* Outer Editorial Frame with Asymmetrical Accent Borders */}
              <div className="relative bg-[#101014] border border-white/10 p-2 sm:p-3 overflow-hidden shadow-2xl">
                
                {/* Image Container with high contrast styling */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                  {heroLookMode === 'runway' ? (
                    <img
                      src="/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg"
                      alt="WEDELIA Fest Movement Look — Custo Barcelona Runway Archive"
                      className="w-full h-full object-cover object-top filter contrast-110"
                      width={1545}
                      height={2362}
                    />
                  ) : (
                    <img
                      src="/assets/editorial/christian-dior-evening-gown-called-zemire-fall.jpg"
                      alt="WEDELIA Gala Silhouette — Christian Dior Archive Faille Slip"
                      className="w-full h-full object-cover object-top filter contrast-110"
                      width={1152}
                      height={2048}
                    />
                  )}

                  {/* Dark subtle vignette scrim for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>

                  {/* Top-Right Badge: Live Availability */}
                  <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-mono text-white flex items-center gap-1.5 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-ping"></span>
                    <span>Available For This Weekend</span>
                  </div>

                  {/* Bottom Image Tag with Real Pricing Breakdown */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0a0a0c]/95 backdrop-blur-md p-3 border border-white/10">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {heroLookMode === 'runway' ? 'Graphic Kinetic Shift & Wrap' : 'Liquid Obsidian Sculpted Gown'}
                      </span>
                      <span className="text-[#d4ff00] text-sm font-mono font-bold">
                        {heroLookMode === 'runway' ? '₹1,699' : '₹2,499'}{' '}
                        <span className="text-[10px] text-neutral-400 font-sans font-normal">/ 3 days</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>Retail: {heroLookMode === 'runway' ? '₹22,000' : '₹34,000'}</span>
                      <span className="text-emerald-400 font-semibold">SAVE 92.6%</span>
                    </div>
                  </div>
                </div>

                {/* Sub-label */}
                <div className="pt-2 px-1 flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
                  <span>REF: {heroLookMode === 'runway' ? 'ARCHIVE-05 // RUNWAY' : 'ARCHIVE-01 // SILHOUETTE'}</span>
                  <span>DELHI • MUMBAI • BLR</span>
                </div>

              </div>

              {/* Decorative Accent Tab */}
              <div className="absolute -bottom-3 -right-3 bg-[#d4ff00] text-black text-[10px] font-extrabold uppercase px-3 py-1 font-mono tracking-wider shadow-lg hidden sm:block">
                #RENT_THE_MOMENT
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
