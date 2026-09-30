import React, { useState } from 'react';
import { ActiveTab, AuditLog, Booking, Complaint, Cooperative, LanguageCode, UserRole, Worker } from '../types';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  MessageSquareWarning,
  DollarSign,
  PieChart,
} from 'lucide-react';

interface Props {
  workers: Worker[];
  bookings: Booking[];
  cooperatives: Cooperative[];
  complaints: Complaint[];
  auditLogs: AuditLog[];
  onResolveComplaint: (complaintId: string, resolutionNote: string) => void;
  onNavigate?: (tab: ActiveTab) => void;
  language?: LanguageCode;
  role?: UserRole;
}

export const AnalyticsView: React.FC<Props> = ({
  workers,
  bookings,
  cooperatives,
  complaints,
  auditLogs,
  onResolveComplaint,
  onNavigate,
  language = 'en',
  role = 'PLATFORM_ADMIN',
}) => {
  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('ALL');

  const demandData = [
    { category: 'Plumbing', requests: 48, percentage: 88 },
    { category: 'Electrical', requests: 52, percentage: 95 },
    { category: 'AC Service', requests: 39, percentage: 72 },
    { category: 'Carpentry', requests: 34, percentage: 62 },
    { category: 'Cleaning', requests: 42, percentage: 78 },
    { category: 'Appliance Repair', requests: 29, percentage: 53 },
    { category: 'Painting', requests: 24, percentage: 44 },
    { category: 'Caregiving', requests: 15, percentage: 28 },
  ];

  const filteredAudits = auditLogs.filter(
    (a) => selectedAuditFilter === 'ALL' || a.entityType === selectedAuditFilter
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="analytics"
          onNavigate={onNavigate}
          language={language}
          role={role}
          badge="Audit & Metrics · Simulated Prototype Data"
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            Federation Demand & Workforce Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time platform demand distribution, fair guild revenue metrics & compliance audit records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            Network Health: 99.4%
          </span>
        </div>
      </div>

      {/* Demand Analytics & Charts (PRD Section 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Demand Visual Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
                Service Demand by Trade Category
              </h2>
            </div>
            <span className="text-xs text-slate-400">Current Month Bookings</span>
          </div>

          <div className="space-y-3 pt-2">
            {demandData.map((d) => (
              <div key={d.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{d.category}</span>
                  <span className="font-mono text-[#F3E5AB] font-bold">{d.requests} requests</span>
                </div>
                {/* Visual heat progress bar */}
                <div className="w-full h-3 rounded-full bg-[#050C16] border border-[#1E3A5F] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-700"
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Architecture Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
                Fair Guild Revenue Split
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Artisan Direct Share:</span>
                  <span className="text-emerald-400 font-bold text-sm">90%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Direct worker payout protected against corporate middleman cuts.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Cooperative Guild & Platform:</span>
                  <span className="text-amber-300 font-bold text-sm">10%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Funds training, tools insurance & member welfare facilities.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Platform GMV:</span>
                  <span className="text-white font-bold text-sm">₹1,84,400</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Accumulated across 1,420 completed community tasks.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300">
            ✓ 100% of artisan settlements cleared within 24 hours of client sign-off.
          </div>
        </div>
      </div>

      {/* Grievance & Complaints Conciliation Board (PRD Section 30) */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
              Customer Support & Guild Complaints Resolution
            </h2>
          </div>
          <span className="text-xs text-slate-400">Independent Guild Arbitration</span>
        </div>

        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300">{c.id}</span>
                  <span className="text-slate-400">· Booking: {c.bookingId}</span>
                  <span className="text-white font-bold">({c.customerName})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                    c.status === 'RESOLVED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <div className="text-slate-200">
                <span className="text-slate-400 font-semibold">Issue:</span> {c.description}
              </div>

              {c.resolutionNote && (
                <div className="p-2.5 rounded-lg bg-[#0A192F] border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <strong>Resolution:</strong> {c.resolutionNote}
                </div>
              )}

              {c.status !== 'RESOLVED' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() =>
                      onResolveComplaint(
                        c.id,
                        'Reviewed with cooperative coordinator and settled amicably with customer.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform Audit Trail (PRD Section 44) */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
              Administrative & Allocation Audit Trail
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={selectedAuditFilter}
              onChange={(e) => setSelectedAuditFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="BOOKING">Bookings</option>
              <option value="VERIFICATION">Verifications</option>
              <option value="COOPERATIVE">Cooperatives</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredAudits.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#D4AF37] font-bold">{a.id}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#102A43] text-amber-200">
                    {a.action}
                  </span>
                  <span className="text-slate-300 font-semibold">{a.userName}</span>
                </div>
                <div className="text-slate-400 mt-1">{a.details}</div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono shrink-0">
                {new Date(a.timestamp).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
