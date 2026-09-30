import React, { useState } from 'react';
import { Booking, Complaint } from '../../types';
import { X, MessageSquareWarning, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplaint: (complaint: Complaint) => void;
}

export const ComplaintModal: React.FC<Props> = ({
  booking,
  isOpen,
  onClose,
  onSubmitComplaint,
}) => {
  const [category, setCategory] = useState<Complaint['category']>('Service Quality');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: booking.id,
      customerName: booking.customerName,
      category,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    onSubmitComplaint(newComplaint);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#1E3A5F]">
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
                  Raise Support Grievance
                </h2>
                <p className="text-xs text-slate-400">
                  Direct Escalation to Cooperative Guild Conciliator (PRD Section 30)
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs">
                <div className="text-slate-400">Booking Reference:</div>
                <div className="font-bold text-white text-sm">{booking.id} · {booking.serviceCategory}</div>
                <div className="text-[#D4AF37]">{booking.cooperativeName} ({booking.workerName})</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Service Quality">Service Quality & Workmanship</option>
                  <option value="Worker Behavior">Worker Conduct & Behavior</option>
                  <option value="Pricing Issue">Pricing & Tariff Discrepancy</option>
                  <option value="Delay / No-Show">Delay or Punctuality Issue</option>
                  <option value="Other">Other Guild Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Describe What Happened
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Explain the issue clearly for the cooperative arbitration team..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit to Guild</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif] text-white">
              Grievance Registered
            </h3>
            <p className="text-xs text-slate-300">
              The cooperative administrator will review the dispatch audit records and contact you within 2 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
