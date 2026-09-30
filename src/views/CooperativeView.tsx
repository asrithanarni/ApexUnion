import React, { useState } from 'react';
import { ActiveTab, Booking, Cooperative, LanguageCode, UserRole, Worker } from '../types';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Clock,
  UserCheck,
  AlertTriangle,
  Award,
  Plus,
} from 'lucide-react';

interface Props {
  cooperatives: Cooperative[];
  workers: Worker[];
  bookings: Booking[];
  onInspectWorker: (worker: Worker) => void;
  onOpenAllocation: (booking: Booking) => void;
  onNavigate?: (tab: ActiveTab) => void;
  language?: LanguageCode;
  role?: UserRole;
}

export const CooperativeView: React.FC<Props> = ({
  cooperatives,
  workers,
  bookings,
  onInspectWorker,
  onOpenAllocation,
  onNavigate,
  language = 'en',
  role = 'COOPERATIVE_ADMIN',
}) => {
  const [selectedCoopId, setSelectedCoopId] = useState<string>(cooperatives[0]?.id || '');
  const activeCoop = cooperatives.find((c) => c.id === selectedCoopId) || cooperatives[0];

  const coopWorkers = workers.filter((w) => w.cooperativeId === activeCoop?.id);
  const pendingRequests = bookings.filter((b) => b.cooperativeId === activeCoop?.id && b.status === 'REQUESTED');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="cooperatives"
          onNavigate={onNavigate}
          language={language}
          role={role}
          badge="Cooperative Societies · Simulated Data"
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            Cooperative Guild Administration Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empowering labour cooperatives with centralized worker verification, AI dispatch & workload visibility
          </p>
        </div>

        {/* Cooperative Guild Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#D4AF37] uppercase">Guild:</label>
          <select
            value={selectedCoopId}
            onChange={(e) => setSelectedCoopId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-[#050C16] border border-[#D4AF37]/40 text-amber-200 focus:outline-none focus:border-[#D4AF37]"
          >
            {cooperatives.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Cooperative Summary Card */}
      {activeCoop && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1D33] via-[#0A192F] to-[#050C16] border border-[#D4AF37]/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1E3A5F]">
            <div>
              <div className="text-[10px] text-[#D4AF37] font-mono font-bold tracking-wider uppercase">
                {activeCoop.code} · Reg: {activeCoop.registrationNumber}
              </div>
              <h2 className="text-xl font-bold text-white font-['Cinzel',serif]">{activeCoop.name}</h2>
              <div className="text-xs text-slate-300">
                President / Coordinator: <strong className="text-white">{activeCoop.contactPerson}</strong> · {activeCoop.phone}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {activeCoop.city}, {activeCoop.state}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Roster Size</span>
              <span className="text-xl font-bold text-white">{activeCoop.registeredWorkersCount} Artisans</span>
            </div>
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Audit Verified</span>
              <span className="text-xl font-bold text-emerald-400">{activeCoop.verifiedWorkersCount} Active</span>
            </div>
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Completed Jobs</span>
              <span className="text-xl font-bold text-[#F3E5AB]">{activeCoop.completedJobsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Satisfaction</span>
              <span className="text-xl font-bold text-amber-400">{activeCoop.averageRating} ★</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Workforce Allocation Queue */}
      <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
              Incoming Bookings Awaiting Artisan Allocation ({pendingRequests.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Cooperative Admin is Final Authority</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#050C16] rounded-xl border border-[#1E3A5F]">
            No unassigned customer bookings for this cooperative right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#050C16] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-sm text-white">{b.id} · {b.serviceCategory}</div>
                  <div className="text-xs text-slate-300">Customer: {b.customerName} ({b.customerAddress})</div>
                  <div className="text-xs text-slate-400 italic">"{b.problemDescription}"</div>
                </div>

                <button
                  onClick={() => onOpenAllocation(b)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Review AI Allocation</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workers Roster & Verification Management */}
      <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
            Registered Guild Workers & Verification Dossiers ({coopWorkers.length})
          </h3>
          <span className="text-xs text-[#D4AF37]">Click 'Audit Dossier' to review OCR documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#050C16] text-[#D4AF37] uppercase font-mono text-[10px] tracking-wider border-b border-[#1E3A5F]">
              <tr>
                <th className="p-3">Artisan</th>
                <th className="p-3">Worker ID</th>
                <th className="p-3">Primary Trades</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Workload</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60 text-slate-300">
              {coopWorkers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img src={w.photoUrl} alt={w.name} className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/40" />
                      <div>
                        <div className="font-bold text-white">{w.name}</div>
                        <div className="text-[10px] text-slate-400">{w.experienceYears}y exp · {w.rating}★</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[#F3E5AB]">{w.workerIdCode}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {w.skills.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#050C16] text-slate-300 border border-[#1E3A5F]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        w.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {w.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${w.currentWorkload === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                      {w.currentWorkload === 0 ? 'Available (0 jobs)' : `${w.currentWorkload} Active Job`}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onInspectWorker(w)}
                      className="px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#1E3A5F] text-amber-200 border border-[#D4AF37]/30 text-[11px] font-bold transition-colors"
                    >
                      Audit Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
