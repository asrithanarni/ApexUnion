import React, { useState } from 'react';
import { Booking, Worker } from '../../types';
import { X, Sparkles, CheckCircle2, UserCheck, MapPin, Briefcase, Star, Clock } from 'lucide-react';

interface Props {
  booking: Booking | null;
  workers: Worker[];
  isOpen: boolean;
  onClose: () => void;
  onAllocateWorker: (bookingId: string, worker: Worker) => void;
}

export const AllocationModal: React.FC<Props> = ({
  booking,
  workers,
  isOpen,
  onClose,
  onAllocateWorker,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');

  if (!isOpen || !booking) return null;

  // Filter eligible workers belonging to this cooperative and matching service
  const eligibleWorkers = workers.filter(
    (w) =>
      w.serviceCategories.includes(booking.serviceCategory) &&
      w.verificationStatus === 'VERIFIED'
  );

  // If no exact match, show all verified workers of this cooperative
  const displayWorkers = eligibleWorkers.length > 0 ? eligibleWorkers : workers.filter((w) => w.verificationStatus === 'VERIFIED');

  const handleConfirmAllocation = () => {
    const targetWorker = displayWorkers.find((w) => w.id === selectedWorkerId) || displayWorkers[0];
    if (targetWorker) {
      onAllocateWorker(booking.id, targetWorker);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#1E3A5F]">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
              AI Workforce Allocation Dispatch
            </h2>
            <p className="text-xs text-slate-400">
              Cooperative Decision Gate · AI Decision-Support (PRD Section 17)
            </p>
          </div>
        </div>

        {/* Booking Context */}
        <div className="mt-4 p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">
              Booking {booking.id} · {booking.serviceCategory}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500/30">
              Urgency: {booking.urgency}
            </span>
          </div>
          <div className="text-slate-300">
            Customer: <strong className="text-white">{booking.customerName}</strong> ({booking.customerAddress})
          </div>
          <div className="text-slate-400 italic">"{booking.problemDescription}"</div>
        </div>

        {/* AI Recommendations List */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#D4AF37]">
              AI Suggested Artisans for Allocation
            </h3>
            <span className="text-[10px] text-slate-400">Ranked by distance, workload & skill matching</span>
          </div>

          <div className="space-y-2">
            {displayWorkers.map((w, idx) => {
              const isSelected = selectedWorkerId === w.id || (!selectedWorkerId && idx === 0);
              const skillLevel = w.serviceCategories.includes(booking.serviceCategory) ? 'High' : 'Medium';
              const workloadLevel = w.currentWorkload === 0 ? 'Low (0 jobs)' : `${w.currentWorkload} Active Job`;

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                      : 'bg-[#050C16] border-[#1E3A5F] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={w.photoUrl}
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{w.name}</span>
                        {idx === 0 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            ★ Top AI Match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#D4AF37] font-medium">{w.workerIdCode}</div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {w.distanceKm} km
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {workloadLevel}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {w.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      Skill: {skillLevel}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Status: {w.availability}
                    </div>
                    <div className="mt-1">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center border ${
                        isSelected ? 'border-[#D4AF37] bg-[#D4AF37] text-slate-950' : 'border-slate-600'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-6 pt-4 border-t border-[#1E3A5F] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Cooperative administrator has final authority over dispatch.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAllocation}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Confirm & Dispatch Artisan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
