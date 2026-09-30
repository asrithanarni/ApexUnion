import React, { useState } from 'react';
import { ActiveTab, LanguageCode, UserRole } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/translations';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  Settings,
  Globe,
  Bell,
  ShieldCheck,
  RotateCcw,
  FileText,
  Lock,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onResetDemoData: () => void;
  onOpenBoundaries: () => void;
  onNavigate?: (tab: ActiveTab) => void;
  role?: UserRole;
}

export const SettingsView: React.FC<Props> = ({
  currentLanguage,
  onLanguageChange,
  onResetDemoData,
  onOpenBoundaries,
  onNavigate,
  role = 'CUSTOMER',
}) => {
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleReset = () => {
    onResetDemoData();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="settings"
          onNavigate={onNavigate}
          language={currentLanguage}
          role={role}
          badge="Preferences · Simulated Environment"
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            {getTranslation('settingsHeading', currentLanguage, 'Platform Settings & Preferences')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {getTranslation('settingsDesc', currentLanguage, 'Configure regional localization, notification channels, prototype credibility & system state')}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* 1. Multilingual Configuration (PRD Section 6 & 27) */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-['Cinzel',serif]">
            {getTranslation('regionalLanguageHeading', currentLanguage, 'Regional Language Preference (12 Supported)')}
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          {getTranslation(
            'regionalLanguageSub',
            currentLanguage,
            'The selected language dynamically configures navigation, AI prompts, error messages, and invoices.'
          )}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {Object.values(SUPPORTED_LANGUAGES).map((l) => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.code)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                currentLanguage === l.code
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold shadow-md ring-1 ring-[#D4AF37]/40'
                  : 'bg-[#050C16] border-[#1E3A5F] text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-base">{l.flag}</span>
                {currentLanguage === l.code && <span className="text-xs text-[#D4AF37] font-bold">● Active</span>}
              </div>
              <div className="text-sm font-bold text-white">{l.nativeName}</div>
              <div className="text-[10px] text-slate-400 font-mono">({l.name})</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dispatch & Notification Channels */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-['Cinzel',serif]">
            {getTranslation('notificationsHeading', currentLanguage, 'Artisan Dispatch & Booking Notifications')}
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">
                {getTranslation('whatsappAlerts', currentLanguage, 'WhatsApp Dispatch Alerts')}
              </div>
              <div className="text-[11px] text-slate-400">
                Receive worker location, arrival countdown & electronic tax invoice on WhatsApp
              </div>
            </div>
            <button
              onClick={() => setWhatsappNotifications(!whatsappNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                whatsappNotifications ? 'bg-[#D4AF37]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  whatsappNotifications ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">
                {getTranslation('smsCodes', currentLanguage, 'SMS Security Codes (OTP)')}
              </div>
              <div className="text-[11px] text-slate-400">
                Mandatory service-start and job-completion sign-off verification codes
              </div>
            </div>
            <button
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                smsNotifications ? 'bg-[#D4AF37]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  smsNotifications ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">
                {getTranslation('emailInvoices', currentLanguage, 'Email Tax Invoices')}
              </div>
              <div className="text-[11px] text-slate-400">
                Official GST printable tax invoice copies dispatched immediately upon settlement
              </div>
            </div>
            <button
              onClick={() => setEmailInvoices(!emailInvoices)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                emailInvoices ? 'bg-[#D4AF37]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  emailInvoices ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Prototype Boundaries Matrix & Data Reset */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-['Cinzel',serif]">
            {getTranslation('credibilityTitle', currentLanguage, 'Evaluation Credibility & State Reset')}
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Apex Union maintains strict transparency between implemented logic, simulated demos, and planned production features.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenBoundaries}
            className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#1E3A5F] text-amber-200 border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Open PRD Boundary Matrix</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>{getTranslation('resetDemoDataBtn', currentLanguage, 'Reset Demo Data to Initial')}</span>
          </button>

          {resetConfirmed && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> State Reset Successfully!
            </span>
          )}
        </div>
      </div>

      {/* 4. Policy Links */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="text-slate-300 hover:text-[#D4AF37] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span>{getTranslation('termsOfService', currentLanguage, 'Terms of Cooperative Service')}</span>
          </button>

          <button
            onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
            className="text-slate-300 hover:text-[#D4AF37] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>{getTranslation('privacyPolicy', currentLanguage, 'Data Privacy Policy')}</span>
          </button>
        </div>

        {showTerms && (
          <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-[11px] text-slate-300 space-y-2">
            <h4 className="font-bold text-amber-200">Apex Union Federation Charter</h4>
            <p>1. Fixed baseline wages are established collaboratively by affiliated labour cooperative general councils.</p>
            <p>2. Direct payment payouts flow with 0% predatory platform margin, maintaining 5% cooperative administration reserves.</p>
            <p>3. Background checks include verification against Government Skill Council (NSDC / NCVT) databases.</p>
          </div>
        )}

        {showPrivacyPolicy && (
          <div className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-[11px] text-slate-300 space-y-2">
            <h4 className="font-bold text-amber-200">Privacy & Consent Commitment</h4>
            <p>1. Customer home address and telephone coordinates are only unmasked to dispatched artisans upon active assignment confirmation.</p>
            <p>2. Worker Aadhaar & trade credentials remain under encrypted cooperative custody and are never sold to commercial lead generators.</p>
          </div>
        )}
      </div>
    </div>
  );
};
