import React from 'react';
import { LookItem } from '../data/wardrobe';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface ReservedOrder {
  look: LookItem;
  totalAmount: number;
  date: string;
}

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservedOrders: ReservedOrder[];
  onRemoveOrder: (index: number) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  reservedOrders,
  onRemoveOrder,
}) => {
  if (!isOpen) return null;

  const totalDue = reservedOrders.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0f0f13] border border-white/15 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#d4ff00] tracking-widest font-bold">
              CAMPUS DISPATCH QUEUE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              YOUR RESERVED LOOKS ({reservedOrders.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close reserved looks vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {reservedOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border border-white/10 text-neutral-500 mx-auto flex items-center justify-center font-mono">
              0
            </div>
            <p className="text-neutral-400 text-sm font-light">
              Your rental queue is currently empty.
            </p>
            <button
              onClick={onClose}
              className="bg-[#d4ff00] text-black font-bold uppercase text-xs tracking-wider px-5 py-2.5 mt-2"
            >
              Explore Archive Looks
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {reservedOrders.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#15151c] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.look.image}
                      alt={item.look.name}
                      className="w-12 h-16 object-cover bg-neutral-900"
                    />
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        {item.look.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {item.look.occasionLabel} • {item.date}
                      </div>
                      <div className="text-[11px] font-mono text-[#d4ff00] font-bold mt-0.5">
                        ₹{item.totalAmount.toLocaleString('en-IN')} (Incl. ₹1,500 Refundable Deposit)
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveOrder(idx)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-neutral-400 uppercase">Estimated Total (Incl. Deposits):</span>
                <span className="text-xl font-bold text-[#d4ff00]">₹{totalDue.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                * All reservations are secured via Razorpay Escrow. Free delivery to your hostel gate with complimentary backup sizes included.
              </p>
              <button
                onClick={() => {
                  alert('Thank you! Your campus reservation has been secured. Our courier will notify you via WhatsApp.');
                  onClose();
                }}
                className="w-full bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-extrabold uppercase tracking-wider py-3.5 text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Campus Delivery Confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
