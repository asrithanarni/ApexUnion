import React from 'react';
import { X, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Cpu, Compass } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrototypeBoundariesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/40 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
                Prototype Boundaries & Credibility Matrix
              </h2>
              <p className="text-xs text-slate-400">
                PRD Section 32 & 50 Compliance · Honest Academic & Evaluation Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="mt-6 space-y-6">
          {/* IMPLEMENTED Section */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span className="tracking-wider uppercase">Implemented (Fully Functional In This App)</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Full Role-Based Access: Customer, Cooperative Admin, Platform Admin
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> 13 Indian Regional Languages with instant dynamic switching & script support
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> AI Natural Language Request Understanding & Service Classification
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Transparent Worker Recommendation Scoring (PRD 7-factor weights)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> End-to-end Booking Lifecycle (Requested → Assigned → In-Progress → Completed)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Cooperative Admin Worker Allocation & Workload Monitoring
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Worker Document Verification Workflow with OCR extracted inspection
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Printable GST Invoice Generation & Worker Ratings / Review System
              </li>
            </ul>
          </div>

          {/* DEMO / MOCK Section */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span className="tracking-wider uppercase">Demo / Simulated (For Presentation & Flow Testing)</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">⚡</span> Simulated Payment Gateway (UPI QR, Card, Net Banking with demo receipts)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">⚡</span> Simulated GPS Live Map Worker Tracking (Interactive coordinates & ETA)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">⚡</span> Document OCR Extraction Simulation (Demonstrates Trade & ID verification)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">⚡</span> Voice Input Mic Interface (Speech-to-text simulation in regional languages)
              </li>
            </ul>
          </div>

          {/* PLANNED PRODUCTION Section */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold text-sm">
              <Compass className="w-4 h-4" />
              <span className="tracking-wider uppercase">Planned Production Integrations (Phase 2 Roadmap)</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">⏳</span> Production Razorpay / NPCI UPI Payment Gateway Integration
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">⏳</span> Official Government DigiLocker & NCVT Skill Registry API verification
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">⏳</span> Google Maps Platform Real-time Directions & Worker Turn-by-Turn GPS
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">⏳</span> Automated SMS / WhatsApp Business booking notification dispatch
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1E3A5F] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
