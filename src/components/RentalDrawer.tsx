import React, { useState } from 'react';
import { LookItem } from '../data/wardrobe';
import { X, CheckCircle2, Shirt, Truck, ArrowRight } from 'lucide-react';

interface RentalDrawerProps {
  look: LookItem | null;
  initialDuration: number;
  isOpen: boolean;
  onClose: () => void;
  onReserveSuccess: (look: LookItem, totalAmount: number) => void;
}

export const RentalDrawer: React.FC<RentalDrawerProps> = ({
  look,
  initialDuration,
  isOpen,
  onClose,
  onReserveSuccess,
}) => {
  if (!look || !isOpen) return null;

  const [duration, setDuration] = useState<number>(initialDuration);
  const [primarySize, setPrimarySize] = useState<string>(look.sizes[0] || 'S');
  const [backupSize, setBackupSize] = useState<string>(
    look.sizes[1] || look.sizes[0] || 'M'
  );
  const [eventDate, setEventDate] = useState<string>('2026-11-06');
  const [campusHostel, setCampusHostel] = useState<string>('Miranda House Hostel, North Campus, DU');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Pricing formula
  const getPrice = (days: number) => {
    if (days === 3) return look.rentalBasePrice;
    if (days === 5) return Math.round(look.rentalBasePrice * 1.35);
    return Math.round(look.rentalBasePrice * 1.6);
  };

  const rentalFee = getPrice(duration);
  const securityDeposit = 1500; // 100% refundable
  const totalAmount = rentalFee + securityDeposit;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onReserveSuccess(look, totalAmount);
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-[#0d0d10] border-l border-white/10 h-full overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0d0d10]/95 backdrop-blur-md z-20">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#d4ff00] font-bold tracking-wider">
              RESERVE ARCHIVE SILHOUETTE
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
              {look.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Close rental drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Success Screen State */}
          {isSuccess ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-[#d4ff00]/10 border-2 border-[#d4ff00] text-[#d4ff00] rounded-full mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white tracking-tight">
                LOOK RESERVED FOR YOUR EVENT
              </h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto font-light leading-relaxed">
                Your archive outfit and free backup size ({primarySize} + {backupSize}) will arrive at {campusHostel} 24 hours prior to {eventDate}.
              </p>
              <div className="inline-block bg-[#18181f] border border-white/10 px-4 py-2 font-mono text-xs text-[#d4ff00]">
                DISPATCH CODE: WED-CAMPUS-2026-X9
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              
              {/* Look Preview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#141419] p-4 border border-white/5">
                <div className="sm:col-span-4 aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <img
                    src={look.image}
                    alt={look.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="sm:col-span-8 flex flex-col justify-between text-xs space-y-2">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">{look.designer}</div>
                    <div className="font-bold text-white text-sm mb-1">{look.occasionLabel}</div>
                    <div className="text-neutral-400 font-light leading-relaxed">
                      {look.silhouette}
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-2 text-[11px] text-neutral-300">
                    <span className="font-semibold text-[#d4ff00]">Styling Note:</span> {look.stylingTips}
                  </div>
                </div>
              </div>

              {/* 1. Duration Window */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 tracking-wider mb-2">
                  1. Select Rental Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 7].map((days) => (
                    <button
                      type="button"
                      key={days}
                      onClick={() => setDuration(days)}
                      className={`p-3 text-center border transition-all ${
                        duration === days
                          ? 'bg-[#d4ff00] text-black border-[#d4ff00] font-bold'
                          : 'bg-[#141419] text-neutral-300 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs uppercase font-mono">{days} Days</div>
                      <div className="text-sm font-mono font-bold mt-1">₹{getPrice(days)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Event Date Picker */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 tracking-wider mb-2">
                  2. Your Event / Call Date (Delivered 24h Before)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 text-white p-3 text-sm font-mono focus:outline-none focus:border-[#d4ff00]"
                    required
                  />
                  <div className="mt-1.5 text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#d4ff00]" />
                    <span>Campus courier delivers on: <b>{eventDate} (Morning Dispatch)</b></span>
                  </div>
                </div>
              </div>

              {/* 3. Dual-Size Selector (Primary + Free Backup Size) */}
              <div className="bg-[#141419] p-4 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-white flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-[#d4ff00]" />
                    <span>3. Size Selection (With Free Backup)</span>
                  </span>
                  <span className="text-[10px] bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 px-2 py-0.5 font-mono uppercase font-bold">
                    Zero Fit Risk
                  </span>
                </div>

                {/* Primary Size */}
                <div>
                  <div className="text-[11px] text-neutral-400 mb-2">Choose your primary size:</div>
                  <div className="flex gap-2">
                    {look.sizes.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setPrimarySize(s)}
                        className={`w-10 h-10 text-xs font-bold font-mono transition-colors ${
                          primarySize === s
                            ? 'bg-white text-black'
                            : 'bg-[#1f1f27] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Secondary Backup Size */}
                <div className="border-t border-white/5 pt-3">
                  <div className="text-[11px] text-neutral-400 mb-2 flex items-center justify-between">
                    <span>Complimentary 2nd backup size in your bag:</span>
                    <span className="text-[#d4ff00] font-mono text-[10px]">₹0 Included</span>
                  </div>
                  <div className="flex gap-2">
                    {look.sizes.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setBackupSize(s)}
                        className={`w-10 h-10 text-xs font-bold font-mono transition-colors ${
                          backupSize === s
                            ? 'bg-[#d4ff00] text-black shadow-md'
                            : 'bg-[#1f1f27] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2 font-light">
                    * Try both on. Keep the tag on the size that doesn't fit and return both unwashed.
                  </p>
                </div>
              </div>

              {/* 4. Campus Hostel / Drop Point */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 tracking-wider mb-2">
                  4. Campus Hostel / PG Delivery Address
                </label>
                <input
                  type="text"
                  value={campusHostel}
                  onChange={(e) => setCampusHostel(e.target.value)}
                  placeholder="e.g. Room 204, Ganga Hostel, JNU / PG in Koramangala"
                  className="w-full bg-[#141419] border border-white/10 text-white p-3 text-sm focus:outline-none focus:border-[#d4ff00]"
                  required
                />
              </div>

              {/* 5. Complete Cost Breakdown */}
              <div className="bg-[#101014] p-4 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>{duration}-Day Archive Rental Fee</span>
                  <span className="text-white">₹{rentalFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Free Backup Size ({backupSize})</span>
                  <span className="text-[#d4ff00]">₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Zero-Liability Damage Shield</span>
                  <span className="text-emerald-400">₹0 (Included)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Campus Courier Pickup & Return</span>
                  <span className="text-[#d4ff00]">₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-neutral-400 border-t border-white/5 pt-2">
                  <span>Refundable Security Deposit</span>
                  <span className="text-neutral-300">₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[10px] text-neutral-500 pb-1">
                  * Deposit is 100% credited back to UPI/Card immediately upon courier pickup.
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                  <span>Total Due Today</span>
                  <span className="text-[#d4ff00] text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-extrabold uppercase tracking-wider py-4 px-6 text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_25px_rgba(212,255,0,0.25)]"
              >
                <span>Reserve Outfit for {eventDate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

        {/* Drawer Footer Guarantees */}
        <div className="p-4 bg-[#0a0a0c] border-t border-white/10 text-[11px] font-mono text-neutral-500 flex justify-between items-center">
          <span>SECURED UPI / RAZORPAY ESCROW</span>
          <span className="text-neutral-400">100% AUTHENTIC ARCHIVE</span>
        </div>

      </div>
    </div>
  );
};
