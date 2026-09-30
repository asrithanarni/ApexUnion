import React, { useState } from 'react';
import {
  ActiveTab,
  Booking,
  Cooperative,
  LanguageCode,
  ServiceCategory,
  UserRole,
  Worker,
  WorkerAvailability,
} from '../types';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { getRoleDetails, getTranslation } from '../localization/translations';
import { ServiceIcon } from '../components/ServiceIcon';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  CalendarCheck,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  LayoutDashboard,
  User,
  Settings,
  Compass,
  Briefcase,
  AlertCircle,
  ShieldAlert,
  BarChart3,
  Phone,
  Mail,
  Award,
  Play,
  CheckSquare,
  DollarSign,
  Zap,
} from 'lucide-react';

interface Props {
  role: UserRole;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  workers: Worker[];
  bookings: Booking[];
  cooperatives: Cooperative[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectWorker: (worker: Worker) => void;
  onSelectBooking: (booking: Booking) => void;
  onInspectWorker: (worker: Worker) => void;
  onOpenAllocation: (booking: Booking) => void;
  onUpdateWorkerAvailability?: (workerId: string, availability: WorkerAvailability) => void;
  onAcceptJob?: (bookingId: string) => void;
  onRejectJob?: (bookingId: string) => void;
  onStartJob?: (bookingId: string) => void;
  onCompleteJob?: (bookingId: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  role,
  language,
  workers,
  bookings,
  cooperatives,
  onNavigate,
  onSelectWorker,
  onSelectBooking,
  onInspectWorker,
  onOpenAllocation,
  onUpdateWorkerAvailability,
  onAcceptJob,
  onRejectJob,
  onStartJob,
  onCompleteJob,
}) => {
  const activeBookings = bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const pendingAllocations = bookings.filter((b) => b.status === 'REQUESTED');
  const pendingVerifications = workers.filter((w) => w.verificationStatus === 'PENDING');
  const verifiedWorkers = workers.filter((w) => w.verificationStatus === 'VERIFIED');

  // Selected Worker state for Artisan View
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('w-101');
  const activeWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  // Incoming job requests for worker
  const workerIncomingRequests = bookings.filter(
    (b) =>
      (b.workerId === activeWorker?.id && b.status === 'ASSIGNED') ||
      (b.status === 'REQUESTED' && b.serviceCategory === activeWorker?.serviceCategories[0])
  );

  // Active in-progress job for worker
  const workerActiveJob = bookings.find(
    (b) => b.workerId === activeWorker?.id && ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
  );

  const getCategoryTranslationKey = (cat: ServiceCategory): string => {
    switch (cat) {
      case 'Plumbing': return 'catPlumbing';
      case 'Electrical': return 'catElectrical';
      case 'Carpentry': return 'catCarpentry';
      case 'AC Service': return 'catACService';
      case 'Appliance Repair': return 'catAppliance';
      case 'Painting': return 'catPainting';
      case 'Cleaning': return 'catCleaning';
      case 'Gardening': return 'catGardening';
      case 'Caregiving': return 'catCaregiving';
    }
  };

  const getCategoryDescTranslationKey = (cat: ServiceCategory): string => {
    switch (cat) {
      case 'Plumbing': return 'catPlumbingDesc';
      case 'Electrical': return 'catElectricalDesc';
      case 'Carpentry': return 'catCarpentryDesc';
      case 'AC Service': return 'catACServiceDesc';
      case 'Appliance Repair': return 'catApplianceDesc';
      case 'Painting': return 'catPaintingDesc';
      case 'Cleaning': return 'catCleaningDesc';
      case 'Gardening': return 'catGardeningDesc';
      case 'Caregiving': return 'catCaregivingDesc';
    }
  };

  // 1. Role-specific Home Navigation Strip beside Apex Union logo
  const getTopNavButtons = () => {
    switch (role) {
      case 'WORKER':
        return [
          {
            tab: 'workerDashboard' as ActiveTab,
            label: getTranslation('workerDashboard', language, 'Worker Console'),
            icon: <Briefcase className="w-3.5 h-3.5" />,
            active: true,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'ఉద్యోగాలు & చరిత్ర' : language === 'hi' ? 'जॉब्स और इतिहास' : 'Jobs & History',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
            active: false,
          },
          {
            tab: 'profile' as ActiveTab,
            label: language === 'te' ? 'నైపుణ్యాల ప్రొఫైల్' : language === 'hi' ? 'कारीगर प्रोफ़ाइल' : 'Skills & Dossier',
            icon: <Award className="w-3.5 h-3.5 text-amber-300" />,
            active: false,
          },
          {
            tab: 'dashboard' as ActiveTab,
            label: language === 'te' ? 'మార్కెట్‌ప్లేస్ వ్యూ' : language === 'hi' ? 'मार्केटप्लेस व्यू' : 'Marketplace View',
            icon: <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />,
            active: false,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
            active: false,
          },
        ];

      case 'COOPERATIVE_ADMIN':
        return [
          {
            tab: 'cooperatives' as ActiveTab,
            label: language === 'te' ? 'సహకార సంఘం అడ్మిన్' : language === 'hi' ? 'सहकारी समिति हब' : 'Cooperative Hub',
            icon: <Building2 className="w-3.5 h-3.5" />,
            active: true,
          },
          {
            tab: 'workers' as ActiveTab,
            label: language === 'te' ? 'కార్మికుల ధృవీకరణ' : language === 'hi' ? 'श्रमिक रोस्टर व सत्यापन' : 'Guild Roster',
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
            active: false,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'కేటాయింపుల క్యూ' : language === 'hi' ? 'आवंटन कतार' : 'Allocation Queue',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
            active: false,
          },
          {
            tab: 'analytics' as ActiveTab,
            label: getTranslation('analytics', language, 'Guild Analytics'),
            icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
            active: false,
          },
          {
            tab: 'profile' as ActiveTab,
            label: getTranslation('profile', language, 'Admin Profile'),
            icon: <User className="w-3.5 h-3.5 text-slate-300" />,
            active: false,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
            active: false,
          },
        ];

      case 'PLATFORM_ADMIN':
        return [
          {
            tab: 'analytics' as ActiveTab,
            label: language === 'te' ? 'ప్లాట్‌ఫారమ్ విశ్లేషణలు' : language === 'hi' ? 'राष्ट्रीय एनालिटिक्स' : 'Platform Analytics',
            icon: <BarChart3 className="w-3.5 h-3.5" />,
            active: true,
          },
          {
            tab: 'cooperatives' as ActiveTab,
            label: language === 'te' ? 'సహకార సమాఖ్య' : language === 'hi' ? 'सहकारी महासंघ' : 'Multi-Guild Federation',
            icon: <Building2 className="w-3.5 h-3.5 text-amber-300" />,
            active: false,
          },
          {
            tab: 'workers' as ActiveTab,
            label: language === 'te' ? 'కార్మికుల డైరెక్టరీ' : language === 'hi' ? 'कारीगर निर्देशिका' : 'Artisan Registry',
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
            active: false,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'నెట్‌వర్క్ బుకింగ్‌లు' : language === 'hi' ? 'नेटवर्क बुकिंग्स' : 'Dispatches',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
            active: false,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
            active: false,
          },
        ];

      case 'CUSTOMER':
      default:
        return [
          {
            tab: 'dashboard' as ActiveTab,
            label: getTranslation('dashboard', language, 'Dashboard'),
            icon: <LayoutDashboard className="w-3.5 h-3.5" />,
            active: true,
          },
          {
            tab: 'request' as ActiveTab,
            label: getTranslation('requestService', language, 'AI Service Request'),
            icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
            active: false,
          },
          {
            tab: 'workers' as ActiveTab,
            label: getTranslation('artisanGuild', language, 'Artisan Guild'),
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
            active: false,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: getTranslation('bookings', language, 'Bookings'),
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
            active: false,
          },
          {
            tab: 'profile' as ActiveTab,
            label: getTranslation('profile', language, 'Profile'),
            icon: <User className="w-3.5 h-3.5 text-amber-300" />,
            active: false,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
            active: false,
          },
        ];
    }
  };

  // 2. Role-specific Home Control Center Navigation Cards
  const getHomeCards = () => {
    switch (role) {
      case 'WORKER':
        return [
          {
            tab: 'workerDashboard' as ActiveTab,
            title: getTranslation('workerDashboard', language, 'Worker Console'),
            description: language === 'te' ? 'ఉద్యోగాల నిర్వహణ & ప్రత్యక్ష స్థితి' : 'Live Job Dispatch, Practical Skills & Earnings',
            icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
            badge: 'Active Console',
          },
          {
            tab: 'workerDashboard' as ActiveTab,
            title: language === 'te' ? 'వచ్చిన అభ్యర్థనలు' : language === 'hi' ? 'आए अनुरोध' : 'Incoming Requests',
            description: language === 'te' ? `${workerIncomingRequests.length} కొత్త ఉద్యోగ అభ్యర్థనలు` : `${workerIncomingRequests.length} pending service requests ready to accept`,
            icon: <Zap className="w-5 h-5 text-amber-400" />,
            badge: `${workerIncomingRequests.length} Available`,
          },
          {
            tab: 'workerDashboard' as ActiveTab,
            title: language === 'te' ? 'నైపుణ్యాల అసెస్‌మెంట్' : language === 'hi' ? 'व्यावहारिक कौशल' : 'Practical Skill Assessment',
            description: 'NCVT Audited · Score: 96/100 · Grade: A+',
            icon: <Award className="w-5 h-5 text-purple-400" />,
            badge: 'Grade A+',
          },
          {
            tab: 'workerDashboard' as ActiveTab,
            title: language === 'te' ? 'సంపాదన & లెడ్జర్' : language === 'hi' ? 'कमाई और खाता' : 'Earnings Ledger',
            description: `Today: ₹${activeWorker?.earningsSummary?.todayEarnings || 1350} · Weekly: ₹${activeWorker?.earningsSummary?.weeklyEarnings || 7800}`,
            icon: <DollarSign className="w-5 h-5 text-emerald-300" />,
            badge: '₹ Verified',
          },
          {
            tab: 'bookings' as ActiveTab,
            title: language === 'te' ? 'ఉద్యోగాల చరిత్ర' : language === 'hi' ? 'कार्य इतिहास' : 'Job History & Telemetry',
            description: `${activeWorker?.completedJobs || 142} jobs completed · 4.9★ rating`,
            icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
            badge: `${activeWorker?.completedJobs || 142} Done`,
          },
          {
            tab: 'profile' as ActiveTab,
            title: getTranslation('profile', language, 'Artisan Dossier'),
            description: 'KYC, Identity & Cooperative Membership',
            icon: <User className="w-5 h-5 text-[#F3E5AB]" />,
            badge: 'Member Active',
          },
          {
            tab: 'settings' as ActiveTab,
            title: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-5 h-5 text-slate-300" />,
            description: 'Notification preferences & display language',
            badge: 'Settings',
          },
        ];

      case 'COOPERATIVE_ADMIN':
        return [
          {
            tab: 'cooperatives' as ActiveTab,
            title: language === 'te' ? 'సహకార సంఘం హబ్' : 'Cooperative Society Hub',
            description: 'Hyderabad Skilled Workers Cooperative (Reg TS-2014)',
            icon: <Building2 className="w-5 h-5 text-amber-300" />,
            badge: 'Guild Active',
          },
          {
            tab: 'cooperatives' as ActiveTab,
            title: language === 'te' ? 'వర్క్‌ఫోర్స్ కేటాయింపు' : 'AI Allocation Queue',
            description: `${pendingAllocations.length} incoming customer issues awaiting artisan allocation`,
            icon: <Sparkles className="w-5 h-5 text-amber-400" />,
            badge: `${pendingAllocations.length} Pending`,
          },
          {
            tab: 'workers' as ActiveTab,
            title: language === 'te' ? 'గిల్డ్ రోస్టర్' : 'Artisan Roster & Audit',
            description: `${workers.length} registered craftsmen · Document verification queue`,
            icon: <Users className="w-5 h-5 text-emerald-400" />,
            badge: `${verifiedWorkers.length} Verified`,
          },
          {
            tab: 'bookings' as ActiveTab,
            title: language === 'te' ? 'ఫీల్డ్ డిస్పాచ్‌లు' : 'Field Dispatches',
            description: `${activeBookings.length} jobs in field execution across service zones`,
            icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
            badge: `${activeBookings.length} Active`,
          },
          {
            tab: 'analytics' as ActiveTab,
            title: getTranslation('analytics', language, 'Guild Analytics'),
            description: 'Fair wages distribution, fulfillment rates & ratings',
            icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
            badge: '4.8 ★ Guild',
          },
          {
            tab: 'profile' as ActiveTab,
            title: getTranslation('profile', language, 'Admin Profile'),
            description: 'Cooperative Society Administrator Credentials',
            icon: <User className="w-5 h-5 text-[#F3E5AB]" />,
            badge: 'Admin KYC',
          },
          {
            tab: 'settings' as ActiveTab,
            title: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-5 h-5 text-slate-300" />,
            description: 'Guild platform rules & language options',
            badge: 'Rules',
          },
        ];

      case 'PLATFORM_ADMIN':
        return [
          {
            tab: 'analytics' as ActiveTab,
            title: language === 'te' ? 'జాతీయ సమాఖ్య విశ్లేషణలు' : 'Platform Federation Analytics',
            description: 'Real-time trade demand distribution & compliance across 3 states',
            icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
            badge: 'Federation Live',
          },
          {
            tab: 'cooperatives' as ActiveTab,
            title: language === 'te' ? 'సహకార సంఘాల సమాఖ్య' : 'Multi-Guild Federation',
            description: '3 Affiliated Labour Cooperatives (Hyderabad, Bangalore, Pune)',
            icon: <Building2 className="w-5 h-5 text-amber-300" />,
            badge: '3 Societies',
          },
          {
            tab: 'workers' as ActiveTab,
            title: language === 'te' ? 'కార్మికుల జాతీయ రిజిస్ట్రీ' : 'National Artisan Registry',
            description: `${workers.length} verified artisans across Telangana, Karnataka & MH`,
            icon: <Users className="w-5 h-5 text-emerald-400" />,
            badge: `${workers.length} Artisans`,
          },
          {
            tab: 'bookings' as ActiveTab,
            title: language === 'te' ? 'నెట్‌వర్క్ బుకింగ్‌లు' : 'Network Dispatches',
            description: `${bookings.length} total bookings · 98.4% fulfillment rate`,
            icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
            badge: `${bookings.length} Orders`,
          },
          {
            tab: 'analytics' as ActiveTab,
            title: language === 'te' ? 'ఫిర్యాదుల పరిష్కారం' : 'Dispute Conciliation Desk',
            description: 'Audit logs & grievance conciliation workbench',
            icon: <AlertCircle className="w-5 h-5 text-emerald-400" />,
            badge: '0 Critical',
          },
          {
            tab: 'profile' as ActiveTab,
            title: getTranslation('profile', language, 'Overseer Profile'),
            description: 'Apex Union National Federation Overseer Dossier',
            icon: <User className="w-5 h-5 text-[#F3E5AB]" />,
            badge: 'Governance',
          },
          {
            tab: 'settings' as ActiveTab,
            title: getTranslation('settings', language, 'Platform Settings'),
            icon: <Settings className="w-5 h-5 text-slate-300" />,
            description: 'Federation policy, audit limits & language config',
            badge: 'Config',
          },
        ];

      case 'CUSTOMER':
      default:
        return [
          {
            tab: 'dashboard' as ActiveTab,
            title: getTranslation('dashboard', language, 'Dashboard'),
            description: getTranslation('dashboardDesc', language, 'Overview & Control Center'),
            icon: <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />,
            badge: 'Active Hub',
          },
          {
            tab: 'request' as ActiveTab,
            title: getTranslation('requestService', language, 'AI Service Request'),
            description: getTranslation('requestServiceDesc', language, 'Natural Language & Voice Diagnosis'),
            icon: <Sparkles className="w-5 h-5 text-amber-400" />,
            badge: 'Multilingual AI',
          },
          {
            tab: 'workers' as ActiveTab,
            title: getTranslation('artisanGuild', language, 'Artisan Guild'),
            description: getTranslation('artisanGuildDesc', language, 'Directory of Verified Craftsmen'),
            icon: <Users className="w-5 h-5 text-emerald-400" />,
            badge: `${workers.length} Demo Workers`,
          },
          {
            tab: 'bookings' as ActiveTab,
            title: getTranslation('bookings', language, 'Bookings'),
            description: getTranslation('bookingsDesc', language, 'Lifecycle Tracking & Live Telemetry'),
            icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
            badge: activeBookings.length > 0 ? `${activeBookings.length} Active` : 'Telemetry',
          },
          {
            tab: 'profile' as ActiveTab,
            title: getTranslation('profile', language, 'Profile'),
            description: getTranslation('profileDesc', language, 'Credentials, KYC & Addresses'),
            icon: <User className="w-5 h-5 text-[#F3E5AB]" />,
            badge: 'KYC Verified',
          },
          {
            tab: 'settings' as ActiveTab,
            title: getTranslation('settings', language, 'Settings'),
            description: getTranslation('settingsDesc', language, 'Global Language & Preferences'),
            icon: <Settings className="w-5 h-5 text-slate-300" />,
            badge: '12 Languages',
          },
        ];
    }
  };

  const topNavButtons = getTopNavButtons();
  const homeCards = getHomeCards();
  const currentRoleDetails = getRoleDetails(role, language);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ================= TOP HOME STRIP: BESIDE APEX UNION LOGO ================= */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#06101E] via-[#0A192F] to-[#06101E] border border-[#D4AF37]/50 shadow-2xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Left: Apex Union Brand Emblem */}
        <div className="flex items-center gap-3">
          <Logo size="md" />
        </div>

        {/* Center / Right: Role-Tailored Navigations beside Apex Union on Home Page */}
        <div className="flex flex-wrap items-center gap-2">
          {topNavButtons.map((btn) => (
            <button
              key={btn.tab + btn.label}
              onClick={() => onNavigate(btn.tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                btn.active
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 shadow-md shadow-[#D4AF37]/25'
                  : 'bg-[#050C16] text-[#F3E5AB] border border-[#1E3A5F] hover:border-[#D4AF37]/60 hover:text-white'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Right Badge: Explicit Demo Data Tag + Role Indicator */}
        <div className="shrink-0 flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider border ${currentRoleDetails.activeColor} flex items-center gap-1`}>
            <span>{currentRoleDetails.badge}</span>
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
            <span>Simulated Prototype Data</span>
          </span>
        </div>
      </div>

      {/* ================= HOME CONTROL CENTER NAVIGATION CARDS ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-base sm:text-lg font-bold font-['Cinzel',serif] text-white">
              {getTranslation('homeControlCenter', language, 'Home Control Center')} · {currentRoleDetails.badge}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {currentRoleDetails.label} — {getTranslation('homeControlCenterSub', language, 'Essential platform tools & workflow')}
          </span>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 ${homeCards.length > 6 ? 'lg:grid-cols-7' : 'lg:grid-cols-6'} gap-3`}>
          {homeCards.map((card, idx) => {
            return (
              <button
                key={card.title + idx}
                onClick={() => onNavigate(card.tab)}
                className="p-3.5 sm:p-4 rounded-2xl text-left transition-all group cursor-pointer border flex flex-col justify-between relative overflow-hidden shadow-lg bg-[#0A192F] border-[#1E3A5F] hover:border-[#D4AF37]/60 hover:bg-[#0F243E] hover:-translate-y-0.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#050C16] border border-[#1E3A5F] group-hover:border-[#D4AF37]/50 transition-colors">
                      {card.icon}
                    </div>
                    {card.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-[#050C16] text-[#D4AF37] border border-[#D4AF37]/30">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-[#F3E5AB] transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1E3A5F]/60 flex items-center justify-between text-[11px] text-[#D4AF37] font-semibold">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 1. CUSTOMER DASHBOARD EXPERIENCE ================= */}
      {role === 'CUSTOMER' && (
        <>
          {/* Hero Banner with Gold Accents */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1D33] via-[#0A192F] to-[#050C16] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{getTranslation('heroZone', language, 'Service Zone: Banjara Hills, Hyderabad · 48 Verified Cooperative Artisans Active')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-['Cinzel',serif] text-white tracking-tight leading-tight">
                {getTranslation('heroTitle', language, 'Trusted Skilled Workers from Labour Cooperatives')}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                {getTranslation('heroSubtitle', language, 'Connect with verified plumbers, electricians, carpenters, and technicians backed by registered artisan guilds. Describe your problem in any Indian language.')}
              </p>

              {/* Natural language request CTA */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('request')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{getTranslation('requestService', language, 'AI Service Request')} (AI)</span>
                </button>

                <button
                  onClick={() => onNavigate('workers')}
                  className="px-5 py-3 rounded-xl bg-[#0B1D33] border border-[#D4AF37]/40 text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-[#102A43] transition-all cursor-pointer"
                >
                  {getTranslation('browseGuildBtn', language, 'Browse Guild Directory')}
                </button>
              </div>
            </div>
          </div>

          {/* Active Booking Tracker Widget (if any) */}
          {activeBookings.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {getTranslation('activeServiceBanner', language, 'Active Service In Progress')}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('bookings')}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  {getTranslation('viewFullTracking', language, 'View Full Tracking & Live Map')} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeBookings.slice(0, 1).map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {b.workerPhoto ? (
                      <img src={b.workerPhoto} alt={b.workerName} className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#102A43] flex items-center justify-center text-[#D4AF37]">
                        <Clock className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-400">{getTranslation('bookings', language)} {b.id} · {getTranslation(getCategoryTranslationKey(b.serviceCategory), language, b.serviceCategory)}</div>
                      <div className="text-sm font-bold text-white">{b.workerName || 'Awaiting Cooperative Dispatch'}</div>
                      <div className="text-[11px] text-[#D4AF37]">{b.cooperativeName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Status: {b.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onSelectBooking(b)}
                      className="px-4 py-2 rounded-lg bg-[#102A43] hover:bg-[#1E3A5F] text-amber-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Track Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Categories Grid WITH PROPER TAILORED SERVICE ICONS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold font-['Cinzel',serif] text-white">
                  {getTranslation('categoriesTitle', language, 'Cooperative Trade Guild Services')}
                </h2>
                <p className="text-xs text-slate-400">
                  {getTranslation('categoriesSub', language, 'Standardized rates fixed transparently by labour societies')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('request')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer"
              >
                {getTranslation('describeCustomIssue', language, 'Describe custom issue')} →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
              {SERVICE_CATEGORIES.map((cat) => {
                const nameKey = getCategoryTranslationKey(cat.id);
                const descKey = getCategoryDescTranslationKey(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => onNavigate('request')}
                    className="p-4 rounded-xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#D4AF37]/60 hover:bg-[#0F2238] transition-all cursor-pointer group shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-[#06101E] border border-[#1E3A5F] group-hover:border-[#D4AF37]/50 text-[#D4AF37] transition-colors">
                        <ServiceIcon category={cat.id} size={22} className="text-[#D4AF37]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-200">₹{cat.baseRate} {getTranslation('baseFee', language, 'base')}</span>
                    </div>
                    <div className="mt-3 font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {getTranslation(nameKey, language, cat.name)}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {getTranslation(descKey, language, cat.description)}
                    </div>
                    <div className="mt-2 text-[10px] text-[#D4AF37] font-semibold">
                      {cat.count} {getTranslation('verifiedArtisans', language, 'verified artisans')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Verified Workers Spotlight (with Demo Data badge) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-['Cinzel',serif] text-white">
                    {getTranslation('topCraftsmenTitle', language, 'Top Rated Cooperative Craftsmen Near You')}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40">
                    Demo Data
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {getTranslation('topCraftsmenSub', language, 'Background verified with physical trade certificates audited')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('workers')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer"
              >
                {getTranslation('viewAllWorkers', language, 'View all')} ({workers.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {verifiedWorkers.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#D4AF37]/60 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <img
                        src={w.photoUrl}
                        alt={w.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37]/50 shadow"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{w.name}</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {w.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#D4AF37] font-medium">
                          {w.serviceCategories.map((c) => getTranslation(getCategoryTranslationKey(c), language, c)).join(' · ')}
                        </div>
                        <div className="text-[10px] text-slate-400">{w.cooperativeName}</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-[11px] text-slate-300 space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{getTranslation('experienceLabel', language, 'Experience')}:</span>
                        <span className="font-bold text-white">{w.experienceYears} {getTranslation('experienceYears', language, 'Years')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{getTranslation('distanceLabel', language, 'Distance')}:</span>
                        <span className="font-bold text-white">{w.distanceKm} {getTranslation('distanceAway', language, 'km away')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{getTranslation('verificationLabel', language, 'Verification')}:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> NCVT / Govt Audited [Demo]
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#1E3A5F]">
                    <button
                      onClick={() => onInspectWorker(w)}
                      className="flex-1 py-2 text-xs font-bold text-slate-300 bg-[#050C16] hover:bg-[#102A43] rounded-lg transition-colors border border-[#1E3A5F] cursor-pointer"
                    >
                      {getTranslation('credentialsBtn', language, 'Credentials')}
                    </button>
                    <button
                      onClick={() => onSelectWorker(w)}
                      className="flex-1 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#B78727] rounded-lg hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      {getTranslation('bookNowBtn', language, 'Book Worker')} (₹{w.hourlyRate})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= 2. WORKER / ARTISAN DASHBOARD EXPERIENCE ================= */}
      {role === 'WORKER' && (
        <div className="space-y-6">
          {/* Worker Profile Dossier Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#061523] via-[#0A192F] to-[#040D18] border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={activeWorker?.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                alt={activeWorker?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                    {activeWorker?.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>NCVT Certified · Grade A+</span>
                  </span>
                </div>
                <div className="text-xs text-amber-300 font-semibold">
                  {activeWorker?.serviceCategories.map((c) => getTranslation(getCategoryTranslationKey(c), language, c)).join(' · ')} · {activeWorker?.experienceYears} Years Experience
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{activeWorker?.cooperativeName}</span>
                  <span>·</span>
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{activeWorker?.serviceArea}</span>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#050C16] p-3 rounded-2xl border border-[#1E3A5F]">
              <div className="text-xs">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Duty Status:</div>
                <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeWorker?.availability === 'AVAILABLE'
                        ? 'bg-emerald-400 animate-pulse'
                        : activeWorker?.availability === 'BUSY'
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span>
                    {activeWorker?.availability === 'AVAILABLE'
                      ? 'Ready for Dispatch'
                      : activeWorker?.availability === 'BUSY'
                      ? 'On Active Job'
                      : 'Off Duty'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {(['AVAILABLE', 'BUSY', 'ON_LEAVE'] as WorkerAvailability[]).map((status) => {
                  const isCur = (activeWorker?.availability || 'AVAILABLE') === status;
                  return (
                    <button
                      key={status}
                      onClick={() => onUpdateWorkerAvailability && onUpdateWorkerAvailability(activeWorker.id, status)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        isCur
                          ? status === 'AVAILABLE'
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : status === 'BUSY'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-slate-700 text-white shadow'
                          : 'bg-[#0A192F] text-slate-400 hover:text-white border border-[#1E3A5F]'
                      }`}
                    >
                      {status === 'AVAILABLE' ? 'Online' : status === 'BUSY' ? 'Busy' : 'Off Duty'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Worker Metrics Strip: Earnings & Jobs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0A192F] border border-emerald-500/30 shadow-lg">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Today's Earnings</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">₹{activeWorker?.earningsSummary?.todayEarnings || 1350}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">3 services delivered</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-lg">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Weekly Compensation</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">₹{activeWorker?.earningsSummary?.weeklyEarnings || 7800}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Fair union standard rates</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-lg">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Guild Payout</div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1">₹{activeWorker?.earningsSummary?.pendingPayout || 3150}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Direct to Bank / UPI</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-lg">
              <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Artisan Rating</div>
              <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1">
                <span>{activeWorker?.rating.toFixed(1)}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{activeWorker?.completedJobs || 142} Jobs Completed</div>
            </div>
          </div>

          {/* Incoming Job Requests Queue for Worker */}
          <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold font-['Cinzel',serif] text-white">
                  Incoming Job Requests ({workerIncomingRequests.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400">Accept to confirm arrival</span>
            </div>

            {workerIncomingRequests.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-center text-xs text-slate-400">
                No new pending requests in your queue. You are ready for dispatch!
              </div>
            ) : (
              <div className="space-y-3">
                {workerIncomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#050C16] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{req.id} · {req.serviceCategory}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-500/30">
                          {req.urgency}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">
                          ₹{req.pricing.workerAmount || 450} Artisan Payout
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>Customer: {req.customerName} ({req.customerAddress})</span>
                      </div>
                      <div className="text-xs text-slate-400 italic">"{req.problemDescription}"</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onRejectJob && onRejectJob(req.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onAcceptJob && onAcceptJob(req.id)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow hover:opacity-95 cursor-pointer"
                      >
                        Accept Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active In-Progress Service Card (if any) */}
          {workerActiveJob && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0F243E] via-[#0A192F] to-[#0F243E] border-2 border-emerald-500/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Current On-Site Service Execution</span>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Status: {workerActiveJob.status.replace('_', ' ')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{workerActiveJob.customerName} · {workerActiveJob.serviceCategory}</div>
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{workerActiveJob.customerAddress}</span>
                    <span>·</span>
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{workerActiveJob.customerPhone}</span>
                  </div>
                  <div className="text-xs text-slate-400 italic">Problem: "{workerActiveJob.problemDescription}"</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {workerActiveJob.status === 'ACCEPTED' && (
                    <button
                      onClick={() => onStartJob && onStartJob(workerActiveJob.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Job On-Site</span>
                    </button>
                  )}

                  {['ON_THE_WAY', 'IN_PROGRESS'].includes(workerActiveJob.status) && (
                    <button
                      onClick={() => onCompleteJob && onCompleteJob(workerActiveJob.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Complete Job & Collect Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Practical Skill Assessment Dossier Card */}
          <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-base font-bold font-['Cinzel',serif] text-white">
                  Practical Skill Assessment Dossier (NCVT / Guild Certified)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40">
                Score: {activeWorker?.practicalAssessment?.practicalScore || 96}/100 · Grade {activeWorker?.practicalAssessment?.grade || 'A+'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(activeWorker?.practicalAssessment?.evaluatedModules || [
                { moduleName: 'Pipe Fitting & Leak Pressure Test', score: 98, passed: true },
                { moduleName: 'Geyser & Water Heater Installation', score: 95, passed: true },
                { moduleName: 'Underground Drain Snaking', score: 96, passed: true },
                { moduleName: 'Electrical Earth Grounding Safety', score: 94, passed: true },
              ]).map((mod, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">{mod.moduleName}</span>
                    <span className="text-emerald-400 font-bold">{mod.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${mod.score}%` }} />
                  </div>
                  <div className="text-[10px] text-emerald-300 flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Practical Standard Met</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. COOPERATIVE ADMIN DASHBOARD EXPERIENCE ================= */}
      {role === 'COOPERATIVE_ADMIN' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                  Admin Command Console
                </div>
                <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                  Hyderabad Skilled Workers Cooperative Society
                </h1>
                <p className="text-xs text-slate-400">
                  Reg No: TS-COOP-HYD-2014-1092 · Admin: Srinivasa Rao V. [Simulated Data]
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('cooperatives')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow"
                >
                  Manage Guild Roster
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Roster</div>
                <div className="text-2xl font-bold text-white mt-1">68</div>
                <div className="text-[10px] text-emerald-400 mt-1">62 Verified Workers</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Verifications</div>
                <div className="text-2xl font-bold text-amber-300 mt-1">{pendingVerifications.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">OCR Audits Queue</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Bookings</div>
                <div className="text-2xl font-bold text-[#F3E5AB] mt-1">{activeBookings.length}</div>
                <div className="text-[10px] text-blue-400 mt-1">In Field Dispatch</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Guild Rating</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">4.8 ★</div>
                <div className="text-[10px] text-slate-400 mt-1">1,420 Completed Jobs</div>
              </div>
            </div>
          </div>

          {/* Pending AI Allocations Gate */}
          <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
                  AI Workforce Allocation Queue ({pendingAllocations.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400">Cooperative Admin Approval Required</span>
            </div>

            {pendingAllocations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-[#050C16] rounded-xl border border-[#1E3A5F]">
                No pending service requests awaiting worker allocation.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAllocations.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-[#050C16] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">
                          {b.id} · {b.serviceCategory}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500/30">
                          Urgency: {b.urgency}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        Customer: {b.customerName} ({b.customerAddress})
                      </div>
                      <div className="text-xs text-slate-400 italic">"{b.problemDescription}"</div>
                    </div>

                    <button
                      onClick={() => onOpenAllocation(b)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Review AI Allocation</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. PLATFORM ADMIN DASHBOARD EXPERIENCE ================= */}
      {role === 'PLATFORM_ADMIN' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                  Federation Overseer Console
                </div>
                <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                  Apex Union National Guild Network
                </h1>
                <p className="text-xs text-slate-400">
                  Auditing 3 Registered Labour Cooperatives Across 3 States [Simulated Prototype Platform]
                </p>
              </div>

              <button
                onClick={() => onNavigate('analytics')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow"
              >
                Comprehensive Platform Analytics
              </button>
            </div>

            {/* Federation Macro Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Affiliated Cooperatives</div>
                <div className="text-2xl font-bold text-white mt-1">3 Guilds</div>
                <div className="text-[10px] text-emerald-400 mt-1">100% Compliance</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Skilled Artisans</div>
                <div className="text-2xl font-bold text-[#F3E5AB] mt-1">{workers.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">177 Verifiable Jobs</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Network Bookings</div>
                <div className="text-2xl font-bold text-blue-300 mt-1">{bookings.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">98.4% Fulfillment Rate</div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Grievances / Audit</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">0 Critical</div>
                <div className="text-[10px] text-slate-400 mt-1">2 Under Active Conciliation</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
