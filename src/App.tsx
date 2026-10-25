import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ChannelSelector } from './components/ChannelSelector';
import { HorizontalRunway } from './components/HorizontalRunway';
import { WardrobeCard } from './components/WardrobeCard';
import { RentalDrawer } from './components/RentalDrawer';
import { HowItWorks } from './components/HowItWorks';
import { EditorialStory } from './components/EditorialStory';
import { Colophon } from './components/Colophon';
import { VaultModal } from './components/VaultModal';
import { WARDROBE_COLLECTION, OCCASIONS, LookItem } from './data/wardrobe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Filter, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [activeChannel, setActiveChannel] = useState<string>('fest');
  const [activeDrawerLook, setActiveDrawerLook] = useState<LookItem | null>(null);
  const [drawerDuration, setDrawerDuration] = useState<number>(3);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [reservedOrders, setReservedOrders] = useState<Array<{ look: LookItem; totalAmount: number; date: string }>>([]);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // GSAP animation setup
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 800px)',
        isMobile: '(max-width: 799px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (!reduceMotion) {
          // Punchy editorial entrance (fast, confident, never blocking readability)
          gsap.from('.hero-enter', {
            opacity: 0,
            y: 16,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          });

          // ScrollTrigger section reveal
          gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((sec) => {
            gsap.from(sec, {
              scrollTrigger: {
                trigger: sec,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
              opacity: 0,
              y: 24,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'opacity,transform',
            });
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  // Filter looks
  const filteredLooks =
    activeChannel === 'all'
      ? WARDROBE_COLLECTION
      : WARDROBE_COLLECTION.filter((item) => item.occasion === activeChannel);

  const handleOpenDrawer = (look: LookItem, duration: number = 3) => {
    setActiveDrawerLook(look);
    setDrawerDuration(duration);
    setIsDrawerOpen(true);
  };

  const handleReserveSuccess = (look: LookItem, totalAmount: number) => {
    setReservedOrders((prev) => [
      ...prev,
      {
        look,
        totalAmount,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
    ]);
  };

  const handleRemoveOrder = (index: number) => {
    setReservedOrders((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div ref={mainContainerRef} className="min-h-screen bg-[#08080a] text-[#f5f5f7] flex flex-col selection:bg-[#d4ff00] selection:text-black">
      {/* 1. Header Navigation */}
      <Navbar onOpenVault={() => setIsVaultOpen(true)} cartCount={reservedOrders.length} />

      <main className="flex-1">
        {/* 2. Hero Section with Interactive WebGL Liquid Fabric Canvas */}
        <Hero
          activeChannel={activeChannel}
          onSelectOccasion={(occ) => setActiveChannel(occ)}
        />

        {/* 3. Occasion Frequency Broadcast Console */}
        <ChannelSelector
          activeChannel={activeChannel}
          onSelectChannel={(ch) => setActiveChannel(ch)}
        />

        {/* 4. Kinetic Marquee Ribbon */}
        <div className="bg-[#d4ff00] text-black py-2.5 overflow-hidden whitespace-nowrap border-y border-black font-mono font-extrabold text-xs uppercase tracking-widest select-none">
          <div className="inline-block animate-marquee">
            <span>• COMPLIMENTARY BACKUP SIZE IN EVERY ORDER • ZERO-LIABILITY DAMAGE SHIELD • 100% INSURED SPILLS • 24H CAMPUS HOSTEL DELIVERY • WEAR IT, RETURN IT UNWASHED • DU • NIFT • IIT • ASHOKA • ST. XAVIER'S • BITS • </span>
            <span>• COMPLIMENTARY BACKUP SIZE IN EVERY ORDER • ZERO-LIABILITY DAMAGE SHIELD • 100% INSURED SPILLS • 24H CAMPUS HOSTEL DELIVERY • WEAR IT, RETURN IT UNWASHED • DU • NIFT • IIT • ASHOKA • ST. XAVIER'S • BITS • </span>
          </div>
        </div>

        {/* 5. The Signature "Holy Shit" Moment: The Pinned Horizontal Runway Archive */}
        <HorizontalRunway
          looks={WARDROBE_COLLECTION}
          onInspectLook={(look) => handleOpenDrawer(look, 3)}
        />

        {/* 6. The Occasion Wardrobe Grid (Filtered Live) */}
        <section id="wardrobe" className="py-16 sm:py-24 border-b border-white/8 section-reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Heading & Category Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-6 border-b border-white/10 gap-6">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4ff00] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>THE AUTUMN / SPRING ARCHIVE</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
                  RENT FOR YOUR OCCASION.
                </h2>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-mono text-neutral-500 uppercase mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filter By:
                </span>
                <button
                  onClick={() => setActiveChannel('all')}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-wide uppercase transition-all ${
                    activeChannel === 'all'
                      ? 'bg-[#d4ff00] text-black shadow-md'
                      : 'bg-[#121217] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  All Looks ({WARDROBE_COLLECTION.length})
                </button>
                {OCCASIONS.filter(o => o.id !== 'all').map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setActiveChannel(occ.id)}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-wide uppercase transition-all ${
                      activeChannel === occ.id
                        ? 'bg-[#d4ff00] text-black shadow-md'
                        : 'bg-[#121217] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5'
                    }`}
                  >
                    {occ.label} ({occ.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Wardrobe Grid (Strict responsive design: 1 col on mobile, 2 on tablet, 3 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredLooks.map((look) => (
                <WardrobeCard
                  key={look.id}
                  look={look}
                  onOpenDrawer={handleOpenDrawer}
                />
              ))}
            </div>

            {/* Campus Assurance Banner */}
            <div className="mt-12 p-6 bg-[#101014] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] animate-pulse"></span>
                <span className="text-xs font-mono text-neutral-300 uppercase">
                  Have an event this Friday or Saturday? Book before Wednesday 6 PM for guaranteed Thursday delivery.
                </span>
              </div>
              <a
                href="#how-it-works"
                className="text-xs font-bold uppercase tracking-wider text-[#d4ff00] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Read Campus SLA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </section>

        {/* 7. The Editorial Runway & Culture Story */}
        <EditorialStory />

        {/* 8. How Rental Works (Frictionless 4-Step Process) */}
        <HowItWorks />
      </main>

      {/* 9. Legal Attribution & Colophon */}
      <Colophon />

      {/* 10. Interactive Rental Drawer & Size Selector */}
      <RentalDrawer
        look={activeDrawerLook}
        initialDuration={drawerDuration}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onReserveSuccess={handleReserveSuccess}
      />

      {/* 11. Reserved Vault Queue Modal */}
      <VaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        reservedOrders={reservedOrders}
        onRemoveOrder={handleRemoveOrder}
      />
    </div>
  );
}

export default App;
