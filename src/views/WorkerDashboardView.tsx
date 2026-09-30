import React, { useState } from 'react';
import { ActiveTab, Booking, LanguageCode, Worker, WorkerAvailability } from '../types';
import { getTranslation } from '../localization/translations';
import { ServiceIcon } from '../components/ServiceIcon';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  User,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  CalendarCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Play,
  CheckSquare,
  DollarSign,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Briefcase,
  Zap,
  Building2,
  ChevronRight,
  History,
} from 'lucide-react';

interface Props {
  language: LanguageCode;
  worker?: Worker;
  allWorkers: Worker[];
  bookings: Booking[];
  onUpdateAvailability: (workerId: string, availability: WorkerAvailability) => void;
  onAcceptJob: (bookingId: string) => void;
  onRejectJob: (bookingId: string) => void;
  onStartJob: (bookingId: string) => void;
  onCompleteJob: (bookingId: string) => void;
  onNavigate?: (tab: ActiveTab) => void;
}

export const WorkerDashboardView: React.FC<Props> = ({
  language,
  worker: propWorker,
  allWorkers,
  bookings,
  onUpdateAvailability,
  onAcceptJob,
  onRejectJob,
  onStartJob,
  onCompleteJob,
  onNavigate,
}) => {
  // Use passed worker or default to first verified worker (Ramesh Kumar w-101)
  const currentWorker = propWorker || allWorkers.find((w) => w.id === 'w-101') || allWorkers[0];
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(currentWorker.id);
  const activeWorker = allWorkers.find((w) => w.id === selectedWorkerId) || currentWorker;

  // Incoming job requests for this worker (status: REQUESTED or ASSIGNED to worker)
  const incomingRequests = bookings.filter(
    (b) => (b.workerId === activeWorker.id && b.status === 'ASSIGNED') ||
           (b.status === 'REQUESTED' && b.serviceCategory === activeWorker.serviceCategories[0])
  );

  // Active in-progress job (status: ACCEPTED, ON_THE_WAY, IN_PROGRESS)
  const activeJob = bookings.find(
    (b) => b.workerId === activeWorker.id && ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
  );

  // Completed job history
  const jobHistory = bookings.filter(
    (b) => b.workerId === activeWorker.id && b.status === 'COMPLETED'
  );

  const availabilityOptions: { status: WorkerAvailability; label: string; color: string }[] = [
    { status: 'AVAILABLE', label: 'Ready for Dispatch (Available)', color: 'bg-emerald-500 text-slate-950 border-emerald-400' },
    { status: 'BUSY', label: 'On Active Job (Busy)', color: 'bg-amber-500 text-slate-950 border-amber-400' },
    { status: 'ON_LEAVE', label: 'Off Duty (On Leave)', color: 'bg-slate-700 text-slate-300 border-slate-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="workerDashboard"
          onNavigate={onNavigate}
          language={language}
          role="WORKER"
          badge="Worker Console · Simulated Demo"
        />
      )}

      {/* SIMULATED DATA TRANSPARENCY NOTICE BANNER */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1A1A05] via-[#241E08] to-[#120F03] border border-[#D4AF37]/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-[#D4AF37] text-slate-950 text-[10px]">
            Demo Data
          </span>
          <span className="text-amber-200">
            <strong>Simulated Prototype Data:</strong> Worker profiles, practical assessment scores, GPS locations, and earnings are mock prototype records for academic evaluation.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Prototype Mode: Active
        </span>
      </div>

      {/* WORKER PROFILE & AVAILABILITY HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1D33] via-[#0A192F] to-[#050C16] border border-[#D4AF37]/40 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Profile Basic Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <img
                src={activeWorker.photoUrl}
                alt={activeWorker.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A192F] ${
                  activeWorker.availability === 'AVAILABLE' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                title={`Status: ${activeWorker.availability}`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                  {activeWorker.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#050C16] text-[#F3E5AB] border border-[#D4AF37]/30">
                  {activeWorker.workerIdCode}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {activeWorker.verificationStatus} [Simulated]
                </span>
              </div>

              <div className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{activeWorker.cooperativeName}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {activeWorker.rating.toFixed(1)} ({activeWorker.reviewCount} customer reviews)
                </span>
                <span>·</span>
                <span>{activeWorker.experienceYears} Years Trade Experience</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">{activeWorker.completedJobs} Jobs Completed</span>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> {activeWorker.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {activeWorker.serviceArea}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Availability Switcher */}
          <div className="p-4 rounded-2xl bg-[#050C16] border border-[#1E3A5F] space-y-2 w-full lg:w-auto shrink-0">
            <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
              Artisan Live Availability Toggle
            </div>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((opt) => {
                const isActive = activeWorker.availability === opt.status;
                return (
                  <button
                    key={opt.status}
                    onClick={() => onUpdateAvailability(activeWorker.id, opt.status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? `${opt.color} shadow-lg scale-105`
                        : 'bg-[#0A192F] text-slate-400 border-[#1E3A5F] hover:text-white hover:border-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="pt-4 border-t border-[#1E3A5F]/70 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Certified Skills:
          </span>
          {activeWorker.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#102A43] text-amber-200 border border-[#D4AF37]/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
          <span className="text-[10px] text-slate-500 ml-auto font-mono">
            Govt NSDC / NCVT Audited Dossier
          </span>
        </div>
      </div>

      {/* METRICS & EARNINGS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Today's Payout
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ₹{activeWorker.earningsSummary?.todayEarnings || 1850}
          </div>
          <div className="text-[10px] text-slate-400">3 dispatches finalized</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Weekly Guild Total
          </div>
          <div className="text-2xl font-black font-mono text-[#F3E5AB]">
            ₹{activeWorker.earningsSummary?.weeklyEarnings || 9400}
          </div>
          <div className="text-[10px] text-emerald-400">Direct to Bank / UPI</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Lifetime Cooperative Payout
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">
            ₹{activeWorker.earningsSummary?.totalEarnings?.toLocaleString() || '1,42,800'}
          </div>
          <div className="text-[10px] text-slate-400">0% predatory margin (5% guild fee)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Practical Skill Score
          </div>
          <div className="text-2xl font-black font-mono text-blue-400">
            {activeWorker.practicalAssessment?.practicalScore || 96} / 100
          </div>
          <div className="text-[10px] text-emerald-400">Grade: {activeWorker.practicalAssessment?.grade || 'A+'} (Audited)</div>
        </div>
      </div>

      {/* PRACTICAL SKILL ASSESSMENT BREAKDOWN */}
      {activeWorker.practicalAssessment && (
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-base font-bold font-['Cinzel',serif] text-white">
                Guild Practical Skill Assessment Audit
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Grade {activeWorker.practicalAssessment.grade} · Examined on {activeWorker.practicalAssessment.assessmentDate}
            </span>
          </div>

          <p className="text-xs text-slate-300 italic">
            "{activeWorker.practicalAssessment.assessmentNotes}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {activeWorker.practicalAssessment.evaluatedModules.map((mod, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate pr-2">{mod.moduleName}</span>
                  <span className="font-mono text-emerald-400 font-bold shrink-0">
                    {mod.score}/{mod.maxScore}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-emerald-400 h-full rounded-full"
                    style={{ width: `${(mod.score / mod.maxScore) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">{mod.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-[#1E3A5F] pt-3">
            <span>Evaluator: <strong>{activeWorker.practicalAssessment.inspectorName}</strong></span>
            <span>Body: <strong>{activeWorker.practicalAssessment.assessedByGuild}</strong></span>
          </div>
        </div>
      )}

      {/* ACTIVE JOB EXECUTION CONTROLS (IF CURRENTLY ON A JOB) */}
      {activeJob && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F243E] via-[#0A192F] to-[#081525] border-2 border-[#D4AF37] shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider block">
                  Active Dispatched Assignment in Progress
                </span>
                <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                  Booking {activeJob.id} · {activeJob.serviceCategory}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Current Stage: {activeJob.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1.5">
              <div className="text-[10px] text-[#D4AF37] uppercase font-bold">Customer Details & Location</div>
              <div className="text-sm font-bold text-white">{activeJob.customerName}</div>
              <div className="text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeJob.customerAddress}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Contact: {activeJob.customerPhone}</span>
              </div>
              <div className="text-xs text-amber-300 pt-1 italic">
                Problem: "{activeJob.problemDescription}"
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] text-[#D4AF37] uppercase font-bold">Payment & Payout Structure</div>
                <div className="text-xl font-black font-mono text-[#F3E5AB] mt-1">
                  ₹{activeJob.pricing.totalAmount} Total Service Amount
                </div>
                <div className="text-[11px] text-slate-400">
                  Worker Direct Payout: <strong className="text-emerald-400">₹{activeJob.pricing.workerAmount}</strong> · Cooperative 5% reserve: ₹{activeJob.pricing.platformFee}
                </div>
              </div>

              {/* Action Buttons for Worker Workflow */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E3A5F]">
                {activeJob.status === 'ACCEPTED' && (
                  <button
                    onClick={() => onStartJob(activeJob.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Travel / Start Job</span>
                  </button>
                )}

                {['ON_THE_WAY', 'IN_PROGRESS'].includes(activeJob.status) && (
                  <button
                    onClick={() => onCompleteJob(activeJob.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Complete Job & Settle Payout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INCOMING DISPATCH REQUESTS (ACCEPT / REJECT) */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-base font-bold font-['Cinzel',serif] text-white">
              Incoming Job Requests ({incomingRequests.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Immediate Guild Allocation Response Required</span>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-[#050C16] rounded-xl border border-[#1E3A5F]">
            No incoming pending service dispatches at this moment. You are ready on the guild roster.
          </div>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-[#050C16] border border-[#D4AF37]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-200">{req.id}</span>
                    <span className="text-sm font-bold text-white">{req.serviceCategory}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      req.urgency === 'Emergency' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {req.urgency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Customer: <strong className="text-white">{req.customerName}</strong> · Address: {req.customerAddress}
                  </div>
                  <div className="text-xs text-slate-400 italic">
                    Problem: "{req.problemDescription}"
                  </div>
                  <div className="text-[11px] text-[#D4AF37] font-mono">
                    Estimated Compensation: ₹{req.pricing.workerAmount} (Total ₹{req.pricing.totalAmount})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => onRejectJob(req.id)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Decline</span>
                  </button>

                  <button
                    onClick={() => onAcceptJob(req.id)}
                    className="flex-1 md:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Accept Job</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOB HISTORY & CUSTOMER REVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Completed Jobs History */}
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-['Cinzel',serif]">
                Recent Completed Dispatches
              </h3>
            </div>
            <span className="text-xs text-slate-400">{jobHistory.length} completed</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {jobHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-[#050C16] rounded-xl border border-[#1E3A5F]">
                Completed dispatch records will appear here upon completion.
              </div>
            ) : (
              jobHistory.map((job) => (
                <div key={job.id} className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{job.serviceCategory} · {job.id}</div>
                    <div className="text-slate-400">{job.customerName} ({job.customerCity})</div>
                    <div className="text-[10px] text-slate-500">{job.scheduledDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-400 font-bold">₹{job.pricing.workerAmount}</div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">Settled</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ratings & Customer Feedback */}
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-['Cinzel',serif]">
                Verified Customer Feedback
              </h3>
            </div>
            <span className="text-xs text-amber-300 font-bold">{activeWorker.rating.toFixed(1)} ★ Rating</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Dr. Arjun Reddy (Banjara Hills)</span>
                <span className="text-amber-400 font-bold">5.0 ★</span>
              </div>
              <p className="text-slate-300 italic text-[11px]">
                "Arrived in 20 minutes under emergency leakage call. Expertly replaced the main valve washer with high precision. Cooperative billing was completely transparent."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Pooja Sharma (Jubilee Hills)</span>
                <span className="text-amber-400 font-bold">4.8 ★</span>
              </div>
              <p className="text-slate-300 italic text-[11px]">
                "Very polite craftsman with valid NCVT trade certificate badge. Completed pipe fitting cleanly without mess."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
