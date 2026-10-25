import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pick Your Event Dates',
      desc: 'Select 3, 5, or 7 days covering your fest weekend or gala night. We deliver 24 hours prior to call time.',
      sub: 'Free backup size included in every order.'
    },
    {
      num: '02',
      title: 'The Hostel Fit Check',
      desc: 'Unbox both sizes in your room. Keep the tag on the backup. Zero sizing anxiety, zero tailoring needed.',
      sub: '100% fit rate across 40+ colleges.'
    },
    {
      num: '03',
      title: 'Own Your Moment',
      desc: 'Walk in, get photographed, dance unrestricted. Accidental beverage spills and dancefloor tears are 100% insured.',
      sub: '₹0 liability with our Damage Shield.'
    },
    {
      num: '04',
      title: 'Return 100% Unwashed',
      desc: 'Drop both outfits in the pre-addressed bio-bag. Our campus courier collects from your hostel gate on Monday.',
      sub: 'We handle eco-friendly dry cleaning.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-white/8 bg-[#0a0a0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4ff00] mb-2">
              THE ZERO-FRICTION RITUAL
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
              HOW RENTAL WORKS.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 text-sm max-w-md font-light leading-relaxed">
            Engineered around the chaos of college fest weekends. Delivered on time, guaranteed to fit, returned with zero laundry chores.
          </p>
        </div>

        {/* 4 Architectural Step Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#121217] border border-white/8 p-6 flex flex-col justify-between hover:border-white/20 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-mono font-extrabold text-[#d4ff00] group-hover:scale-110 transition-transform">
                    {step.num}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#d4ff00] transition-colors"></span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-3 font-display">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="border-t border-white/5 pt-3 text-[10px] font-mono text-neutral-500 uppercase">
                {step.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Real Comparison Table: Rent vs Buy */}
        <div className="mt-12 p-6 sm:p-8 bg-[#101014] border border-white/10">
          <div className="text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
            THE MATHEMATICS OF CAMPUS DRESSING
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
              <div className="text-neutral-400 text-xs uppercase mb-1">Traditional Buying</div>
              <div className="text-2xl font-bold font-mono text-white mb-2">₹25,000 – ₹45,000</div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Worn once for photos, repeated outfits feel awkward on Instagram, sits dead in hostel wardrobe, dry cleaning bills pile up.
              </p>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
              <div className="text-[#d4ff00] text-xs uppercase font-bold mb-1">WEDELIA Rental</div>
              <div className="text-2xl font-bold font-mono text-[#d4ff00] mb-2">₹1,499 – ₹2,999</div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Runway archive couture every single weekend, endless novelty, 2 sizes delivered, zero dry cleaning fees, zero buyer's remorse.
              </p>
            </div>
            <div>
              <div className="text-emerald-400 text-xs uppercase font-bold mb-1">Environmental Impact</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mb-2">92% Less Waste</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Eliminates fast-fashion polyester churn. High-circulation archives dry-cleaned with green closed-loop solvents.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
