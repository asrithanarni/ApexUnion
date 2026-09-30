import React, { useState } from 'react';
import { Booking, ServiceCategory, Worker } from '../../types';
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker | null;
  initialCategory?: ServiceCategory;
  initialProblem?: string;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  worker,
  initialCategory = 'Plumbing',
  initialProblem = '',
  onBookingConfirmed,
}) => {
  const [scheduledDate, setScheduledDate] = useState('2026-09-30');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [customerAddress, setCustomerAddress] = useState('Flat 304, Green Palms Residency, Road No 36, Jubilee Hills');
  const [customerPhone, setCustomerPhone] = useState('+91 98480 91827');
  const [customerName, setCustomerName] = useState('Dr. Arjun Reddy');
  const [problemDescription, setProblemDescription] = useState(
    initialProblem || 'Need urgent assistance with water leakage from the kitchen sink angle valve.'
  );
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Emergency'>('Normal');

  if (!isOpen) return null;

  const baseRate = worker ? worker.hourlyRate : 450;
  const platformFee = Math.round(baseRate * 0.1);
  const taxes = Math.round(baseRate * 0.04);
  const workerAmount = baseRate - platformFee;
  const totalAmount = baseRate + platformFee + taxes;

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: Booking = {
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'cust-current',
      customerName,
      customerPhone,
      customerAddress,
      customerCity: 'Hyderabad',
      serviceCategory: worker ? worker.serviceCategories[0] : initialCategory,
      problemDescription,
      originalLanguage: 'English',
      urgency,
      requiredSkills: worker ? worker.skills.slice(0, 2) : ['Diagnosis & Repair'],
      status: 'ASSIGNED',
      workerId: worker?.id || 'w-101',
      workerName: worker?.name || 'Ramesh Kumar',
      workerPhoto: worker?.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      workerPhone: worker?.phone || '+91 98482 11094',
      cooperativeId: worker?.cooperativeId || 'coop-hyd-1',
      cooperativeName: worker?.cooperativeName || 'Hyderabad Skilled Workers Cooperative Society',
      requestedAt: new Date().toISOString(),
      scheduledDate,
      scheduledTimeSlot: timeSlot,
      pricing: {
        serviceCharge: baseRate,
        platformFee,
        taxes,
        workerAmount,
        totalAmount,
      },
      paymentStatus: 'PENDING',
      trackingLocation: {
        lat: 17.4156,
        lng: 78.4354,
        etaMinutes: 20,
        currentAddress: 'Assigned from Regional Cooperative Dispatch Center',
      },
    };

    onBookingConfirmed(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#1E3A5F]">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
              Book Skilled Worker
            </h2>
            <p className="text-xs text-slate-400">
              Cooperative Backed · Transparent Labor Pricing · Safe Dispatch
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateBooking} className="mt-5 space-y-4">
          {/* Worker Snapshot */}
          {worker && (
            <div className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center gap-3.5">
              <img
                src={worker.photoUrl}
                alt={worker.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/50"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{worker.name}</span>
                  <span className="text-xs font-bold text-[#F3E5AB]">₹{worker.hourlyRate} base</span>
                </div>
                <div className="text-[11px] text-[#D4AF37] font-medium">{worker.cooperativeName}</div>
                <div className="text-[11px] text-slate-400">{worker.distanceKm} km from you · {worker.experienceYears}y exp</div>
              </div>
            </div>
          )}

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Issue / Service Requirement
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={2}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Time Window
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              >
                <option>09:00 AM - 11:00 AM (Morning)</option>
                <option>11:30 AM - 01:30 PM (Midday)</option>
                <option>02:30 PM - 04:30 PM (Afternoon)</option>
                <option>05:00 PM - 07:00 PM (Evening)</option>
              </select>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service Urgency
            </label>
            <div className="flex gap-2">
              {(['Normal', 'High', 'Emergency'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    urgency === u
                      ? 'bg-[#D4AF37]/25 text-[#F3E5AB] border-[#D4AF37]'
                      : 'bg-[#050C16] text-slate-400 border-[#1E3A5F] hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Address & Contact */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Service Address & Contact
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="House/Flat No, Street, Landmark"
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Transparent Price Breakdown (PRD Section 14) */}
          <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2 text-xs">
            <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Fair Labor Price Architecture</span>
              <span className="text-slate-400 font-normal">Transparent Guild Split</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>Standard Service Base Fee</span>
              <span>₹{baseRate}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cooperative Support & Guild Tech Fee (10%)</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST & Welfare Cess (4%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="pt-2 border-t border-[#1E3A5F] flex justify-between font-bold text-sm text-white">
              <span>Total Estimated Amount</span>
              <span className="text-[#F3E5AB]">₹{totalAmount}</span>
            </div>

            <div className="mt-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct Worker Payout: <strong>₹{workerAmount}</strong> is remitted directly to the artisan.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 transition-all"
            >
              Confirm & Book (₹{totalAmount})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
