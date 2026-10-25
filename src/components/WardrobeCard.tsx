import React, { useState } from 'react';
import { LookItem } from '../data/wardrobe';
import { Calendar, ArrowRight } from 'lucide-react';

interface WardrobeCardProps {
  look: LookItem;
  onOpenDrawer: (look: LookItem, durationDays: number) => void;
}

export const WardrobeCard: React.FC<WardrobeCardProps> = ({ look, onOpenDrawer }) => {
  const [duration, setDuration] = useState<number>(3);

  // Dynamic pricing calculation
  const calculatePrice = (days: number) => {
    if (days === 3) return look.rentalBasePrice;
    if (days === 5) return Math.round(look.rentalBasePrice * 1.35);
    return Math.round(look.rentalBasePrice * 1.6);
  };

  const activePrice = calculatePrice(duration);
  const savingsPct = Math.round((1 - activePrice / look.retailPrice) * 100);

  return (
    <article className="group bg-[#101014] border border-white/8 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg">
      {/* Top Editorial Tag */}
      <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#0c0c0f]">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#d4ff00]">
          {look.tag}
        </span>
        <span className="text-[10px] font-mono text-neutral-400 uppercase">
          {look.occasionLabel}
        </span>
      </div>

      {/* Main Image with Hover Zoom & Framing */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#0d0d11] cursor-pointer flex items-center justify-center"
        onClick={() => onOpenDrawer(look, duration)}
      >
        <img
          src={look.image}
          alt={`WEDELIA Archive Look: ${look.name} — ${look.occasionLabel}`}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter contrast-[1.08]"
          loading="lazy"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <span className="bg-[#d4ff00] text-black font-extrabold uppercase text-xs tracking-wider px-4 py-2.5 flex items-center gap-1.5 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <span>Inspect Silhouette</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Subtle Top & Bottom Image Scrims for Editorial Tone */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#101014] via-[#101014]/60 to-transparent pointer-events-none"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Designer and Title */}
          <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">
            {look.designer}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-[#d4ff00] transition-colors font-display">
            {look.name}
          </h3>

          {/* Silhouette & Fabric Micro-Notes */}
          <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-light">
            {look.silhouette}. Fabric: <span className="text-neutral-300">{look.fabric}</span>.
          </p>
        </div>

        <div>
          {/* Interactive Rental Duration Toggle */}
          <div className="mb-4 pt-3 border-t border-white/5">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-neutral-400 mb-2">
              <span>Rental Window</span>
              <span className="text-neutral-200 font-semibold">{duration} Days Rental</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-[#18181f] p-1 border border-white/5">
              {[3, 5, 7].map((days) => (
                <button
                  key={days}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDuration(days);
                  }}
                  className={`py-1 text-[11px] font-mono font-semibold uppercase transition-colors ${
                    duration === days
                      ? 'bg-[#d4ff00] text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  aria-label={`Select ${days} days rental`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Savings Breakdown */}
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                ₹{activePrice.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-neutral-400 ml-1">/ {duration}d</span>
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                Retail: <span className="line-through">₹{look.retailPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5">
              SAVE {savingsPct}%
            </span>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => onOpenDrawer(look, duration)}
            className="w-full bg-white/5 hover:bg-[#d4ff00] text-white hover:text-black border border-white/10 hover:border-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Select Dates & Sizes</span>
          </button>
        </div>
      </div>
    </article>
  );
};
