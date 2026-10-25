import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Shirt, Sparkles } from 'lucide-react';
import { LiquidFabricCanvas } from './LiquidFabricCanvas';
import { CHANNELS } from './ChannelSelector';

interface HeroProps {
  activeChannel: string;
  onSelectOccasion: (occ: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ activeChannel, onSelectOccasion }) => {
  const currentChannel = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];
  const [isShaderActive, setIsShaderActive] = useState<boolean>(true);

  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-20 border-b border-white/8 bg-grain overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-12 border-x border-white/5">
          <div className="col-span-4 border-r border-white/5 hidden lg:block h-full"></div>
          <div className="col-span-4 border-r border-white/5 hidden lg:block h-full"></div>
          <div className="col-span-4 hidden lg:block h-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Experimental Editorial Typography & Intent (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Live Frequency Badge */}
            <div className="hero-enter inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#d4ff00] animate-ping"></span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 whitespace-nowrap">
                {currentChannel.channelNum} // LIVE ARCHIVE FREQUENCY
              </span>
            </div>

            {/* Oversized Layered Display Headline */}
            <h1 className="hero-enter text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.93] mb-5 font-display">
              RENT THE LOOK <br />
              <span className="text-neutral-400 font-editorial italic font-normal tracking-tight">for the</span>{' '}
              <span className="text-[#d4ff00] underline decoration-1 underline-offset-8">MOMENT.</span>
            </h1>

            {/* Editorial Thesis Statement */}
            <p className="hero-enter text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-6 font-light">
              You have somewhere to go and you need an unforgettable entrance. Don't spend ₹35,000 on an outfit you'll be photographed in once. Rent runway archive pieces, festival metallics, and farewell gowns for 3, 5, or 7 days with campus hostel delivery.
            </p>

            {/* Live Interactive Channel Switcher Ribbon */}
            <div className="hero-enter mb-6 p-4 bg-[#101014] border border-white/10 rounded-sm">
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2 flex items-center justify-between">
                <span>Tune into your event:</span>
                <span className="text-[#d4ff00] font-bold text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Interactive Shaders Active</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onSelectOccasion(ch.id)}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all ${
                      activeChannel === ch.id
                        ? 'bg-[#d4ff00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                        : 'bg-[#18181f] text-neutral-300 hover:text-white hover:bg-neutral-800 border border-white/5'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action Triggers */}
            <div className="hero-enter flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              <a
                href="#runway-archive"
                className="inline-flex items-center gap-2 bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3.5 transition-transform active:scale-95 shadow-[0_0_20px_rgba(212,255,0,0.25)]"
              >
                <span>Glide The Living Runway</span>
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
                  <div className="text-[10px] text-neutral-400 leading-tight">2nd size in every bag for zero fit anxiety</div>
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
                  <div className="text-[10px] text-neutral-400 leading-tight">Eco closed-loop dry cleaning included</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: WebGL Liquid Fabric Shader Canvas & Tactile Frame (5 Cols) */}
          <div className="hero-enter lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* WebGL Canvas Mode Switcher Bar */}
              <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-mono uppercase">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse"></span>
                  <span>TACTILE FABRIC SHADER: {currentChannel.channelNum}</span>
                </div>
                <div className="flex gap-1 bg-[#101014] p-0.5 border border-white/10">
                  <button
                    onClick={() => setIsShaderActive(!isShaderActive)}
                    className="px-2 py-0.5 text-neutral-400 hover:text-white transition-colors"
                  >
                    {isShaderActive ? 'SHADERS ON' : 'PAUSE SHADERS'}
                  </button>
                </div>
              </div>

              {/* Main Outer Editorial Frame */}
              <div className="relative bg-[#101014] border border-white/15 p-2 sm:p-3 overflow-hidden shadow-2xl">
                
                {/* 4:5 Aspect Frame housing WebGL Canvas */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
                  {isShaderActive ? (
                    <LiquidFabricCanvas
                      activeTextureUrl={currentChannel.textureUrl}
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={currentChannel.textureUrl}
                      alt={currentChannel.label}
                      className="w-full h-full object-cover object-top filter contrast-110"
                    />
                  )}

                  {/* Dark subtle vignette scrim for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none"></div>

                  {/* Top-Right Badge: Tactile Instruction */}
                  <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-mono text-white flex items-center gap-1.5 uppercase pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-ping"></span>
                    <span>DRAG CURSOR OVER FABRIC</span>
                  </div>

                  {/* Bottom Image Tag with Channel Info */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0a0a0c]/95 backdrop-blur-md p-3 border border-white/10 pointer-events-none">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {currentChannel.label}
                      </span>
                      <span className="text-[#d4ff00] text-xs font-mono font-bold">
                        {currentChannel.channelNum}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono leading-tight">
                      {currentChannel.vibe}
                    </div>
                  </div>
                </div>

                {/* Sub-label */}
                <div className="pt-2 px-1 flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
                  <span>DISPATCH: ARCHIVE-{currentChannel.channelNum}</span>
                  <span>DELHI • MUMBAI • BANGALORE</span>
                </div>

              </div>

              {/* Decorative Accent Tab */}
              <div className="absolute -bottom-3 -right-3 bg-[#d4ff00] text-black text-[10px] font-extrabold uppercase px-3 py-1 font-mono tracking-wider shadow-lg hidden sm:block pointer-events-none">
                #RENT_THE_MOMENT
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
