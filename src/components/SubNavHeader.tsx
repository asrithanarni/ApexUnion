import React from 'react';
import { ActiveTab, LanguageCode, UserRole } from '../types';
import { getTranslation } from '../localization/translations';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  CalendarCheck,
  User,
  Settings,
  Briefcase,
  Building2,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

interface SubNavHeaderProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  language: LanguageCode;
  role?: UserRole;
  pageTitle?: string;
  badge?: string;
}

export const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  activeTab,
  onNavigate,
  language,
  role = 'CUSTOMER',
  badge = 'Simulated Prototype Data',
}) => {
  const getNavLinks = () => {
    switch (role) {
      case 'WORKER':
        return [
          {
            tab: 'workerDashboard' as ActiveTab,
            label: getTranslation('workerDashboard', language, 'Worker Console'),
            icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'ఉద్యోగాలు & చరిత్ర' : language === 'hi' ? 'जॉब्स और इतिहास' : 'Jobs & History',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
          },
          {
            tab: 'profile' as ActiveTab,
            label: language === 'te' ? 'నైపుణ్యాల ప్రొఫైల్' : language === 'hi' ? 'कारीगर प्रोफ़ाइल' : 'Artisan Dossier',
            icon: <User className="w-3.5 h-3.5 text-amber-300" />,
          },
          {
            tab: 'dashboard' as ActiveTab,
            label: language === 'te' ? 'మార్కెట్‌ప్లేస్ వ్యూ' : language === 'hi' ? 'मार्केटप्लेस व्यू' : 'Marketplace View',
            icon: <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
          },
        ];

      case 'COOPERATIVE_ADMIN':
        return [
          {
            tab: 'cooperatives' as ActiveTab,
            label: language === 'te' ? 'సహకార సంఘం అడ్మిన్' : language === 'hi' ? 'सहकारी समिति हब' : 'Cooperative Hub',
            icon: <Building2 className="w-3.5 h-3.5 text-amber-300" />,
          },
          {
            tab: 'workers' as ActiveTab,
            label: language === 'te' ? 'కార్మికుల ధృవీకరణ' : language === 'hi' ? 'श्रमिक रोस्टर व सत्यापन' : 'Guild Roster',
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'కేటాయింపుల క్యూ' : language === 'hi' ? 'आवंटन कतार' : 'Allocation Queue',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
          },
          {
            tab: 'analytics' as ActiveTab,
            label: getTranslation('analytics', language, 'Guild Analytics'),
            icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
          },
          {
            tab: 'profile' as ActiveTab,
            label: getTranslation('profile', language, 'Admin Profile'),
            icon: <User className="w-3.5 h-3.5 text-slate-300" />,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
          },
        ];

      case 'PLATFORM_ADMIN':
        return [
          {
            tab: 'analytics' as ActiveTab,
            label: language === 'te' ? 'ప్లాట్‌ఫారమ్ విశ్లేషణలు' : language === 'hi' ? 'राष्ट्रीय एनालिटिक्स' : 'Platform Analytics',
            icon: <BarChart3 className="w-3.5 h-3.5 text-purple-400" />,
          },
          {
            tab: 'cooperatives' as ActiveTab,
            label: language === 'te' ? 'సహకార సంఘాల సమాఖ్య' : language === 'hi' ? 'सहकारी महासंघ' : 'Multi-Guild Federation',
            icon: <Building2 className="w-3.5 h-3.5 text-amber-300" />,
          },
          {
            tab: 'workers' as ActiveTab,
            label: language === 'te' ? 'జాతీయ కార్మికుల జాబితా' : language === 'hi' ? 'देशव्यापी कारीगर निर्देशिका' : 'Artisan Registry',
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: language === 'te' ? 'నెట్‌వర్క్ బుకింగ్‌లు' : language === 'hi' ? 'नेटवर्क बुकिंग्स' : 'Network Dispatches',
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
          },
          {
            tab: 'profile' as ActiveTab,
            label: getTranslation('profile', language, 'Overseer Profile'),
            icon: <User className="w-3.5 h-3.5 text-slate-300" />,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-400" />,
          },
        ];

      case 'CUSTOMER':
      default:
        return [
          {
            tab: 'dashboard' as ActiveTab,
            label: getTranslation('dashboard', language, 'Dashboard'),
            icon: <LayoutDashboard className="w-3.5 h-3.5" />,
          },
          {
            tab: 'request' as ActiveTab,
            label: getTranslation('requestService', language, 'AI Service Request'),
            icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
          },
          {
            tab: 'workers' as ActiveTab,
            label: getTranslation('artisanGuild', language, 'Artisan Guild'),
            icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          },
          {
            tab: 'bookings' as ActiveTab,
            label: getTranslation('bookings', language, 'Bookings'),
            icon: <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />,
          },
          {
            tab: 'profile' as ActiveTab,
            label: getTranslation('profile', language, 'Profile'),
            icon: <User className="w-3.5 h-3.5 text-[#F3E5AB]" />,
          },
          {
            tab: 'settings' as ActiveTab,
            label: getTranslation('settings', language, 'Settings'),
            icon: <Settings className="w-3.5 h-3.5 text-slate-300" />,
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="w-full mb-6 p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-[#06101E] via-[#0A192F] to-[#06101E] border border-[#1E3A5F] shadow-xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
      {/* Brand Monogram + Quick Nav Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 px-1 scrollbar-none">
        <button
          onClick={() => {
            if (role === 'CUSTOMER') onNavigate('dashboard');
            else if (role === 'WORKER') onNavigate('workerDashboard');
            else if (role === 'COOPERATIVE_ADMIN') onNavigate('cooperatives');
            else if (role === 'PLATFORM_ADMIN') onNavigate('analytics');
          }}
          className="shrink-0 flex items-center gap-2 pr-2 border-r border-[#1E3A5F] hover:opacity-85 transition-opacity cursor-pointer"
          title="Apex Union Home"
        >
          <Logo size="sm" showText={false} variant="icon-only" />
          <span className="font-['Cinzel',serif] text-xs font-bold text-[#F3E5AB] hidden sm:inline">AU</span>
        </button>

        {navLinks.map((link) => {
          const isActive = activeTab === link.tab;
          return (
            <button
              key={link.tab}
              onClick={() => onNavigate(link.tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold shadow-md shadow-[#D4AF37]/25'
                  : 'bg-[#050C16] text-slate-300 border border-[#1E3A5F] hover:border-[#D4AF37]/50 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Data Disclaimer Tag */}
      <div className="flex items-center gap-2 self-end xl:self-auto shrink-0 px-2">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
          <span>{badge}</span>
        </span>
      </div>
    </div>
  );
};
