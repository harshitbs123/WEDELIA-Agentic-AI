import React from 'react';
import { Radio, Sparkles } from 'lucide-react';

export interface ChannelInfo {
  id: string;
  channelNum: string;
  label: string;
  vibe: string;
  textureUrl: string;
  accentColor: string;
  manifesto: string;
}

export const CHANNELS: ChannelInfo[] = [
  {
    id: 'fest',
    channelNum: 'CH-01',
    label: 'College Fest Star Night',
    vibe: 'Stage Strobes • Liquid Metallic • High-Exposure Crowd Energy',
    textureUrl: '/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg',
    accentColor: '#d4ff00',
    manifesto: 'Engineered for 5-hour DJ sets, stadium crowd surges, and direct flash photos that stop thumbs.',
  },
  {
    id: 'farewell',
    channelNum: 'CH-02',
    label: 'Farewell Gala & Ball',
    vibe: 'Sculpted Faille • Obsidian Black Tie • The Unforgettable Exit',
    textureUrl: '/assets/editorial/christian-dior-evening-gown-called-zemire-fall.jpg',
    accentColor: '#ffffff',
    manifesto: 'Four years of college boil down to one night. Leave no doubt about who owned the room.',
  },
  {
    id: 'concert',
    channelNum: 'CH-03',
    label: 'Concert & After-Hours',
    vibe: 'Reflective Jacquard • Athletic Couture • Rave Kinetics',
    textureUrl: '/assets/editorial/robe-longue-1983-12-1-1.jpg',
    accentColor: '#00f0ff',
    manifesto: 'Breathable technical fabrics with metallic yarn that glow under ultraviolet lasers.',
  },
  {
    id: 'freshers',
    channelNum: 'CH-04',
    label: 'Freshers Debut & Society',
    vibe: 'Pure Silk Chiffon • Asymmetrical Grecian Wrap • Debut Tension',
    textureUrl: '/assets/editorial/two-jean-desses-evening-gowns-1951.jpg',
    accentColor: '#ff2a6d',
    manifesto: 'First impressions are irreversible. Micro-pleated elegance with effortless movement.',
  },
  {
    id: 'afterdark',
    channelNum: 'CH-05',
    label: 'Gilded Imperial Gala',
    vibe: 'Gold Thread Brocade • Structured Pannier • Avant-Garde Heritage',
    textureUrl: '/assets/editorial/court-dress.jpg',
    accentColor: '#e5b869',
    manifesto: 'Heavy metallic thread woven on pure silk damask. When your look demands historical gravitas.',
  },
];

interface ChannelSelectorProps {
  activeChannel: string;
  onSelectChannel: (channelId: string) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  activeChannel,
  onSelectChannel,
}) => {
  const current = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];

  return (
    <section className="py-12 bg-[#0c0c10] border-b border-white/8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tuner Bar Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#d4ff00] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 font-bold">
              OCCASION FREQUENCY TUNER // 108.4 MHz
            </span>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">
            SELECT EVENT TO RETUNE DIGITAL FABRIC SHADER & ARCHIVE
          </div>
        </div>

        {/* Channels Radio Frequency Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {CHANNELS.map((ch) => {
            const isActive = ch.id === activeChannel;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChannel(ch.id)}
                className={`p-3.5 text-left border transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'bg-[#15151c] border-[#d4ff00] shadow-[0_0_20px_rgba(212,255,0,0.15)]'
                    : 'bg-[#101014] border-white/5 hover:border-white/25 hover:bg-[#131318]'
                }`}
              >
                {/* Active Indicator Pip */}
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${
                    isActive ? 'text-[#d4ff00]' : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}>
                    {ch.channelNum}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#d4ff00] animate-ping' : 'bg-neutral-700'
                    }`}
                  ></span>
                </div>

                <div className="text-xs font-bold font-display tracking-tight text-white mb-1">
                  {ch.label}
                </div>
                <div className="text-[10px] text-neutral-400 font-light line-clamp-1">
                  {ch.vibe}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Channel Manifesto Ribbon */}
        <div className="p-4 bg-[#101014] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#d4ff00] text-black uppercase">
              {current.channelNum}
            </span>
            <span className="text-xs text-neutral-300 font-light leading-relaxed">
              <b>{current.label}:</b> {current.manifesto}
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#d4ff00] shrink-0 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive WebGL Fabric Retuned</span>
          </div>
        </div>

      </div>
    </section>
  );
};
