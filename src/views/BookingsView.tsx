import React, { useState } from 'react';
import { ActiveTab, Booking, BookingStatus, LanguageCode, PaymentMethod, UserRole } from '../types';
import { getTranslation } from '../localization/translations';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Star,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Navigation,
  MessageSquareWarning,
} from 'lucide-react';

interface Props {
  language: LanguageCode;
  bookings: Booking[];
  onOpenPayment: (booking: Booking) => void;
  onOpenInvoice: (booking: Booking) => void;
  onOpenReview: (booking: Booking) => void;
  onOpenComplaint: (booking: Booking) => void;
  onAdvanceStatus: (bookingId: string) => void;
  onNavigate?: (tab: ActiveTab) => void;
  role?: UserRole;
}

export const BookingsView: React.FC<Props> = ({
  language,
  bookings,
  onOpenPayment,
  onOpenInvoice,
  onOpenReview,
  onOpenComplaint,
  onAdvanceStatus,
  onNavigate,
  role = 'CUSTOMER',
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const getStageLabel = (status: BookingStatus): string => {
    switch (status) {
      case 'REQUESTED': return getTranslation('stageRequested', language, 'Request Created');
      case 'ASSIGNED': return getTranslation('stageAssigned', language, 'Worker Assigned');
      case 'ACCEPTED': return getTranslation('stageAccepted', language, 'Accepted by Worker');
      case 'ON_THE_WAY': return getTranslation('stageOnTheWay', language, 'On The Way');
      case 'IN_PROGRESS': return getTranslation('stageInProgress', language, 'Service In Progress');
      case 'COMPLETED': return getTranslation('stageCompleted', language, 'Completed');
      default: return status;
    }
  };

  const lifecycleStages: { status: BookingStatus; label: string }[] = [
    { status: 'REQUESTED', label: getStageLabel('REQUESTED') },
    { status: 'ASSIGNED', label: getStageLabel('ASSIGNED') },
    { status: 'ACCEPTED', label: getStageLabel('ACCEPTED') },
    { status: 'ON_THE_WAY', label: getStageLabel('ON_THE_WAY') },
    { status: 'IN_PROGRESS', label: getStageLabel('IN_PROGRESS') },
    { status: 'COMPLETED', label: getStageLabel('COMPLETED') },
  ];

  const getStageIndex = (status: BookingStatus) => {
    return lifecycleStages.findIndex((s) => s.status === status);
  };

  const currentStageIndex = activeBooking ? getStageIndex(activeBooking.status) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="bookings"
          onNavigate={onNavigate}
          language={language}
          role={role}
          badge="Live Dispatch Telemetry · Simulated"
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            {getTranslation('bookingsHeading', language, 'Bookings Lifecycle & Live Tracking')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {getTranslation('bookingsSub', language, 'Real-time stage transitions, dispatch coordination, simulated GPS telemetry & billing')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Bookings:</span>
          <span className="text-sm font-bold text-amber-300 font-mono">{bookings.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List (Left Column) */}
        <div className="space-y-3 lg:col-span-1">
          <div className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] px-1">
            {getTranslation('bookingsQueue', language, 'Your Bookings Queue')}
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {bookings.map((b) => {
              const isSelected = selectedBookingId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                      : 'bg-[#0A192F] border-[#1E3A5F] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs font-mono text-amber-200">{b.id}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'IN_PROGRESS' || b.status === 'ON_THE_WAY'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {getStageLabel(b.status)}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white mb-0.5">{b.serviceCategory}</div>
                  <div className="text-xs text-slate-300 line-clamp-1">{b.problemDescription}</div>

                  <div className="mt-3 pt-2 border-t border-[#1E3A5F]/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{b.scheduledDate}</span>
                    <span className="font-mono text-amber-200 font-bold">₹{b.pricing.totalAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Booking Telemetry & Controls (Right 2 Columns) */}
        {activeBooking && (
          <div className="lg:col-span-2 space-y-5">
            {/* Stage Progress Stepper */}
            <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">BOOKING ID: {activeBooking.id}</span>
                  <h2 className="text-lg font-bold text-white">{activeBooking.serviceCategory} Dispatch</h2>
                </div>

                {/* Advance Stage Control for Live Prototype Testing */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAdvanceStatus(activeBooking.id)}
                    disabled={activeBooking.status === 'COMPLETED'}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{getTranslation('advanceStageBtn', language, 'Advance Stage')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Line */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {lifecycleStages.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage.status}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-amber-200 font-bold shadow-md'
                            : isDone
                            ? 'bg-[#050C16] border-emerald-500/40 text-emerald-400'
                            : 'bg-[#050C16]/50 border-[#1E3A5F] text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-mono mb-1">0{idx + 1}</div>
                        <div className="text-[11px] font-medium leading-tight">{stage.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated Live GPS Map & Dispatch Telemetry */}
            <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white">
                    {getTranslation('liveGpsTitle', language, 'Worker Telemetry & Route Map')}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
                  {getTranslation('mockGpsBadge', language, '[MOCK GPS MAP DEMO]')}
                </span>
              </div>

              {/* Graphical GPS Widget */}
              <div className="relative h-48 rounded-xl overflow-hidden bg-[#06101E] border border-[#1E3A5F] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* Simulated Route Line */}
                <div className="absolute w-2/3 h-1 bg-gradient-to-r from-blue-500 via-[#D4AF37] to-emerald-500 rounded-full opacity-60" />

                <div className="relative z-10 flex items-center justify-between w-full max-w-md px-6">
                  {/* Origin */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-[#0A192F] border-2 border-blue-400 flex items-center justify-center text-blue-400 shadow">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-semibold">{getTranslation('dispatchHub', language, 'Dispatch Hub')}</span>
                  </div>

                  {/* Artisan Tracker Pin */}
                  <div className="flex flex-col items-center gap-1 animate-bounce">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center text-slate-950 shadow-lg shadow-[#D4AF37]/40">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#F3E5AB] bg-[#050C16] px-2 py-0.5 rounded border border-[#D4AF37]">
                      {activeBooking.workerName || 'Worker'} (ETA: 14m)
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-[#0A192F] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-semibold">Your Address</span>
                  </div>
                </div>
              </div>

              {/* Worker & Location Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {getTranslation('assignedCraftsman', language, 'Assigned Craftsman')}
                  </div>
                  <div className="text-sm font-bold text-white">{activeBooking.workerName || 'Pending Allocation'}</div>
                  <div className="text-slate-400">{activeBooking.cooperativeName}</div>
                  <div className="text-slate-400">Phone: {activeBooking.workerPhone || 'Provided upon dispatch'}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {getTranslation('destinationAddress', language, 'Destination Address')}
                  </div>
                  <div className="text-sm font-bold text-white">{activeBooking.customerName}</div>
                  <div className="text-slate-300">{activeBooking.customerAddress}</div>
                  <div className="text-slate-400">Contact: {activeBooking.customerPhone}</div>
                </div>
              </div>

              {/* Action Buttons: Payment, Invoice, Review, Grievance */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E3A5F]">
                <button
                  onClick={() => onOpenComplaint(activeBooking)}
                  className="px-3 py-2 rounded-lg bg-red-950/30 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquareWarning className="w-4 h-4 text-red-400" />
                  <span>{getTranslation('raiseGrievanceBtn', language, 'Raise Support Issue')}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Payment Button */}
                  {activeBooking.paymentStatus === 'PENDING' ? (
                    <button
                      onClick={() => onOpenPayment(activeBooking)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>{getTranslation('settleAndPayBtn', language, 'Settle & Pay')} (₹{activeBooking.pricing.totalAmount})</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{getTranslation('paidInFull', language, 'Paid in Full')}</span>
                      </span>

                      <button
                        onClick={() => onOpenInvoice(activeBooking)}
                        className="px-4 py-2 rounded-lg bg-[#102A43] hover:bg-[#1E3A5F] text-amber-200 border border-[#D4AF37]/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-[#D4AF37]" />
                        <span>{getTranslation('viewTaxInvoiceBtn', language, 'View Tax Invoice')}</span>
                      </button>

                      <button
                        onClick={() => onOpenReview(activeBooking)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-slate-950" />
                        <span>{activeBooking.review ? getTranslation('updateReviewBtn', language, 'Update Review') : getTranslation('rateServiceBtn', language, 'Rate Service')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
