import React, { useState } from 'react';
import { Logo } from './Logo';
import { ActiveTab, LanguageCode, UserRole } from '../types';
import { LANGUAGES, getRoleDetails, getTranslation } from '../localization/translations';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  CalendarCheck,
  Building2,
  BarChart3,
  User,
  Settings,
  Globe,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  onOpenBoundaries: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  currentLanguage,
  setCurrentLanguage,
  onOpenBoundaries,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role-specific navigation tabs that dynamically change based on ACTIVE ROLE
  const getNavItemsForRole = (role: UserRole, lang: LanguageCode) => {
    switch (role) {
      case 'CUSTOMER':
        return [
          { tab: 'dashboard' as ActiveTab, label: getTranslation('dashboard', lang, 'Dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { tab: 'request' as ActiveTab, label: getTranslation('requestService', lang, 'AI Service Request'), icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
          { tab: 'workers' as ActiveTab, label: getTranslation('artisanGuild', lang, 'Artisan Guild'), icon: <Users className="w-4 h-4 text-emerald-400" /> },
          { tab: 'bookings' as ActiveTab, label: getTranslation('bookings', lang, 'My Bookings'), icon: <CalendarCheck className="w-4 h-4 text-blue-400" /> },
          { tab: 'profile' as ActiveTab, label: getTranslation('profile', lang, 'Profile'), icon: <User className="w-4 h-4 text-slate-300" /> },
          { tab: 'settings' as ActiveTab, label: getTranslation('settings', lang, 'Settings'), icon: <Settings className="w-4 h-4 text-slate-400" /> },
        ];
      case 'WORKER':
        return [
          { tab: 'workerDashboard' as ActiveTab, label: getTranslation('workerDashboard', lang, 'Worker Console'), icon: <Briefcase className="w-4 h-4 text-emerald-400" /> },
          { tab: 'bookings' as ActiveTab, label: lang === 'te' ? 'ఉద్యోగాలు & చరిత్ర' : lang === 'hi' ? 'जॉब्स और इतिहास' : 'Jobs & History', icon: <CalendarCheck className="w-4 h-4 text-blue-400" /> },
          { tab: 'profile' as ActiveTab, label: lang === 'te' ? 'నైపుణ్యాల ప్రొఫైల్' : lang === 'hi' ? 'कारीगर प्रोफ़ाइल' : 'Artisan Dossier', icon: <User className="w-4 h-4 text-amber-300" /> },
          { tab: 'dashboard' as ActiveTab, label: lang === 'te' ? 'మార్కెట్‌ప్లేస్ వ్యూ' : lang === 'hi' ? 'मार्केटप्लेस व्यू' : 'Marketplace View', icon: <LayoutDashboard className="w-4 h-4 text-slate-400" /> },
          { tab: 'settings' as ActiveTab, label: getTranslation('settings', lang, 'Settings'), icon: <Settings className="w-4 h-4 text-slate-400" /> },
        ];
      case 'COOPERATIVE_ADMIN':
        return [
          { tab: 'cooperatives' as ActiveTab, label: lang === 'te' ? 'సహకార సంఘం అడ్మిన్' : lang === 'hi' ? 'सहकारी समिति हब' : 'Cooperative Hub', icon: <Building2 className="w-4 h-4 text-amber-300" /> },
          { tab: 'workers' as ActiveTab, label: lang === 'te' ? 'కార్మికుల ధృవీకరణ' : lang === 'hi' ? 'श्रमिक रोस्टर व सत्यापन' : 'Guild Roster & Verifications', icon: <Users className="w-4 h-4 text-emerald-400" /> },
          { tab: 'bookings' as ActiveTab, label: lang === 'te' ? 'కేటాయింపుల క్యూ' : lang === 'hi' ? 'आवंटन कतार' : 'Allocation Queue', icon: <CalendarCheck className="w-4 h-4 text-blue-400" /> },
          { tab: 'analytics' as ActiveTab, label: getTranslation('analytics', lang, 'Guild Analytics'), icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
          { tab: 'profile' as ActiveTab, label: getTranslation('profile', lang, 'Admin Profile'), icon: <User className="w-4 h-4 text-slate-300" /> },
          { tab: 'settings' as ActiveTab, label: getTranslation('settings', lang, 'Settings'), icon: <Settings className="w-4 h-4 text-slate-400" /> },
        ];
      case 'PLATFORM_ADMIN':
        return [
          { tab: 'analytics' as ActiveTab, label: lang === 'te' ? 'ప్లాట్‌ఫారమ్ విశ్లేషణలు' : lang === 'hi' ? 'राष्ट्रीय एनालिटिक्स' : 'Platform Analytics', icon: <BarChart3 className="w-4 h-4 text-purple-400" /> },
          { tab: 'cooperatives' as ActiveTab, label: lang === 'te' ? 'సహకార సంఘాల సమాఖ్య' : lang === 'hi' ? 'सहकारी महासंघ' : 'Multi-Guild Federation', icon: <Building2 className="w-4 h-4 text-amber-300" /> },
          { tab: 'workers' as ActiveTab, label: lang === 'te' ? 'జాతీయ కార్మికుల జాబితా' : lang === 'hi' ? 'देशव्यापी कारीगर निर्देशिका' : 'Artisan Registry', icon: <Users className="w-4 h-4 text-emerald-400" /> },
          { tab: 'bookings' as ActiveTab, label: lang === 'te' ? 'నెట్‌వర్క్ బుకింగ్‌లు' : lang === 'hi' ? 'नेटवर्क बुकिंग्स' : 'Network Dispatches', icon: <CalendarCheck className="w-4 h-4 text-blue-400" /> },
          { tab: 'profile' as ActiveTab, label: getTranslation('profile', lang, 'Overseer Profile'), icon: <User className="w-4 h-4 text-slate-300" /> },
          { tab: 'settings' as ActiveTab, label: getTranslation('settings', lang, 'Settings'), icon: <Settings className="w-4 h-4 text-slate-400" /> },
        ];
    }
  };

  const navItems = getNavItemsForRole(currentRole, currentLanguage);
  const currentRoleDetails = getRoleDetails(currentRole, currentLanguage);

  // Switching role immediately shifts the user experience and dashboard content
  const handleSelectRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);

    // Functional role routing:
    // - Customer → show Customer UI / dashboard
    // - Worker / Artisan → show Worker UI / dashboard
    // - Cooperative Admin → show Cooperative Admin dashboard
    // - Platform Admin → show Platform Admin dashboard
    if (newRole === 'CUSTOMER') {
      setActiveTab('dashboard');
    } else if (newRole === 'WORKER') {
      setActiveTab('workerDashboard');
    } else if (newRole === 'COOPERATIVE_ADMIN') {
      setActiveTab('cooperatives');
    } else if (newRole === 'PLATFORM_ADMIN') {
      setActiveTab('analytics');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E3A5F]/70 bg-[#06101E]/95 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="w-full bg-gradient-to-r from-[#0B1D33] via-[#102A43] to-[#0B1D33] border-b border-[#D4AF37]/20 px-4 py-1.5 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Apex Multi-Guild Network: Live
          </span>
          <span className="hidden md:inline text-slate-500">·</span>
          <span className="hidden md:inline text-slate-400">
            Connecting Certified Labour Cooperatives across Telangana, Karnataka & Maharashtra
          </span>
        </div>

        {/* Prototype Credibility Tag */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBoundaries}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 transition-all cursor-pointer"
            title="View Prototype Status & Credibility Matrix"
          >
            <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
            <span>PRD Status: [IMPLEMENTED / DEMO / PLANNED]</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand AU Logo */}
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => {
              if (currentRole === 'CUSTOMER') setActiveTab('dashboard');
              else if (currentRole === 'WORKER') setActiveTab('workerDashboard');
              else if (currentRole === 'COOPERATIVE_ADMIN') setActiveTab('cooperatives');
              else if (currentRole === 'PLATFORM_ADMIN') setActiveTab('analytics');
            }}
          >
            <Logo size="md" />
          </div>

          {/* Center: Desktop Nav Tabs (Tailored to Selected Role) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#B89035]/10 text-[#F3E5AB] border border-[#D4AF37]/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Language Dropdown & Functional Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Language Dropdown (Unchanged in header) */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setRoleMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F] text-xs text-slate-200 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
                title="Select Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-medium">{LANGUAGES[currentLanguage]?.nativeName || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0A192F] border border-[#D4AF37]/30 shadow-2xl z-50 p-2 grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#D4AF37] border-b border-[#1E3A5F]">
                    Supported Languages (13)
                  </div>
                  {Object.values(LANGUAGES).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setCurrentLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        currentLanguage === l.code
                          ? 'bg-[#D4AF37]/20 text-[#F3E5AB] font-bold border border-[#D4AF37]/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({l.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Functional ACTIVE ROLE Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0F2238] to-[#0A192F] border border-[#D4AF37]/50 shadow-sm text-xs hover:border-[#D4AF37] transition-all cursor-pointer ring-1 ring-[#D4AF37]/20"
                title="Switch Demonstration User Role"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#D4AF37] tracking-wider uppercase font-semibold">
                    {getTranslation('activeRole', currentLanguage, 'Active Role')}
                  </span>
                  <span className={`font-bold text-xs ${currentRoleDetails.color}`}>
                    {currentRoleDetails.badge}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-[#D4AF37] border-b border-[#1E3A5F] flex items-center justify-between">
                    <span>{getTranslation('activeRole', currentLanguage, 'Active Role')}</span>
                    <span className="text-[9px] text-slate-400 font-normal">Changes complete UI</span>
                  </div>

                  {/* 1. Customer Option */}
                  {(() => {
                    const info = getRoleDetails('CUSTOMER', currentLanguage);
                    const isSelected = currentRole === 'CUSTOMER';
                    return (
                      <button
                        onClick={() => handleSelectRole('CUSTOMER')}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#102A43] border-[#D4AF37]/60 text-white shadow'
                            : 'border-transparent text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-amber-300 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{info.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-snug">{info.desc}</div>
                        </div>
                        {isSelected && <span className="text-[#D4AF37] text-xs font-bold">✓</span>}
                      </button>
                    );
                  })()}

                  {/* 2. Worker / Artisan Option */}
                  {(() => {
                    const info = getRoleDetails('WORKER', currentLanguage);
                    const isSelected = currentRole === 'WORKER';
                    return (
                      <button
                        onClick={() => handleSelectRole('WORKER')}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500/60 text-white shadow'
                            : 'border-transparent text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{info.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-snug">{info.desc}</div>
                        </div>
                        {isSelected && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })()}

                  {/* 3. Cooperative Admin Option */}
                  {(() => {
                    const info = getRoleDetails('COOPERATIVE_ADMIN', currentLanguage);
                    const isSelected = currentRole === 'COOPERATIVE_ADMIN';
                    return (
                      <button
                        onClick={() => handleSelectRole('COOPERATIVE_ADMIN')}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-blue-950/70 border-blue-500/60 text-white shadow'
                            : 'border-transparent text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-blue-300 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{info.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-snug">{info.desc}</div>
                        </div>
                        {isSelected && <span className="text-blue-400 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })()}

                  {/* 4. Platform Admin Option */}
                  {(() => {
                    const info = getRoleDetails('PLATFORM_ADMIN', currentLanguage);
                    const isSelected = currentRole === 'PLATFORM_ADMIN';
                    return (
                      <button
                        onClick={() => handleSelectRole('PLATFORM_ADMIN')}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-purple-950/70 border-purple-500/60 text-white shadow'
                            : 'border-transparent text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-purple-300 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>{info.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-snug">{info.desc}</div>
                        </div>
                        {isSelected && <span className="text-purple-400 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#0A192F] border border-[#1E3A5F] text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1E3A5F] bg-[#06101E] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === item.tab
                  ? 'bg-[#D4AF37]/20 text-[#F3E5AB] font-bold border border-[#D4AF37]/30'
                  : 'text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <span className={activeTab === item.tab ? 'text-[#D4AF37]' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
