import React, { useEffect, useRef } from 'react';
import { LookItem } from '../data/wardrobe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalRunwayProps {
  looks: LookItem[];
  onInspectLook: (look: LookItem) => void;
}

export const HorizontalRunway: React.FC<HorizontalRunwayProps> = ({ looks, onInspectLook }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bgText = bgTextRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };

        if (isDesktop && !reduceMotion) {
          // Calculate total horizontal scroll width
          const totalScrollWidth = track.scrollWidth - window.innerWidth + 120;

          const tween = gsap.to(track, {
            x: () => -totalScrollWidth,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${totalScrollWidth}`,
              invalidateOnRefresh: true,
            },
          });

          // Kinetic background text parallax in reverse
          if (bgText) {
            gsap.to(bgText, {
              x: () => -totalScrollWidth * 0.4,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${totalScrollWidth}`,
                scrub: 1,
              },
            });
          }

          return () => {
            tween.kill();
          };
        }
      }
    );

    return () => mm.revert();
  }, [looks]);

  return (
    <section
      ref={sectionRef}
      id="runway-archive"
      className="relative bg-[#070709] border-y border-white/10 overflow-hidden select-none"
    >
      {/* Background Kinetic Typography Mask */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap text-[18vw] font-extrabold font-display text-white/[0.025] tracking-tighter pointer-events-none z-0"
      >
        THE RUNWAY ARCHIVE • AUTUMN 2026 • THE RUNWAY ARCHIVE
      </div>

      {/* Runway Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 relative z-10">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#d4ff00] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping"></span>
            <span>SIGNATURE EDITORIAL RUNWAY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            THE LIVING LOOKBOOK.
          </h2>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 text-xs font-mono text-neutral-400">
          <span className="hidden lg:inline text-neutral-400">
            [SCROLL TO GLIDE THROUGH ARCHIVE]
          </span>
          <span className="text-[#d4ff00] font-bold">
            {looks.length} HAUTE PIECES CURRENTLY DISPATCHED
          </span>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div className="relative z-10 py-8 lg:py-16">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-4 sm:px-6 lg:px-12 w-full lg:w-max items-stretch"
        >
          {looks.map((look, index) => (
            <div
              key={look.id}
              className="w-full lg:w-[480px] shrink-0 bg-[#0f0f14] border border-white/10 hover:border-[#d4ff00]/60 transition-all duration-500 group flex flex-col justify-between overflow-hidden shadow-2xl relative"
            >
              {/* Top Card Tape Index */}
              <div className="p-3.5 bg-[#0a0a0d] border-b border-white/8 flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#d4ff00] font-extrabold tracking-widest uppercase">
                  ARCHIVE ENTRY // 0{index + 1}
                </span>
                <span className="text-neutral-400 uppercase tracking-wider">
                  {look.occasionLabel}
                </span>
              </div>

              {/* High-Impact Portrait Frame */}
              <div
                className="relative aspect-[3/4] overflow-hidden bg-neutral-900 cursor-pointer"
                onClick={() => onInspectLook(look)}
              >
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter contrast-[1.08]"
                  loading="lazy"
                />

                {/* Direct Action Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-[#d4ff00] text-black font-extrabold uppercase text-xs tracking-wider px-5 py-3 flex items-center gap-2 shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4" />
                    <span>Inspect Silhouette & Dates</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-300 mt-3">
                    Includes complimentary secondary size
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-white border border-white/15">
                  {look.designer}
                </div>
              </div>

              {/* Editorial Description & Pricing Bar */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2 font-display group-hover:text-[#d4ff00] transition-colors">
                    {look.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
                    {look.silhouette}. Fabric: <span className="text-neutral-300">{look.fabric}</span>.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-baseline mb-3">
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#d4ff00]">
                        ₹{look.rentalBasePrice.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-neutral-400">/ 3 days</span>
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500">
                        Retail Value: <span className="line-through">₹{look.retailPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5">
                      SAVE {Math.round((1 - look.rentalBasePrice / look.retailPrice) * 100)}%
                    </span>
                  </div>

                  <button
                    onClick={() => onInspectLook(look)}
                    className="w-full bg-[#16161d] hover:bg-[#d4ff00] text-white hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-transparent flex items-center justify-center gap-2"
                  >
                    <span>Reserve For Your Call Time</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
