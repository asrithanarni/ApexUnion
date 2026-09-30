import React, { useState } from 'react';
import { ActiveTab, LanguageCode, UserRole } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/translations';
import { SubNavHeader } from '../components/SubNavHeader';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Award,
  CheckCircle2,
  Edit3,
  Save,
} from 'lucide-react';

interface Props {
  role: UserRole;
  language: LanguageCode;
  onNavigate?: (tab: ActiveTab) => void;
}

export const ProfileView: React.FC<Props> = ({ role, language, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(
    role === 'CUSTOMER'
      ? 'Dr. Arjun Reddy'
      : role === 'WORKER'
      ? 'Ramesh Kumar'
      : role === 'COOPERATIVE_ADMIN'
      ? 'Srinivasa Rao V.'
      : 'Platform Federation Overseer'
  );
  const [phone, setPhone] = useState(role === 'WORKER' ? '+91 98482 11094' : '+91 98850 12099');
  const [email, setEmail] = useState(role === 'WORKER' ? 'ramesh.plumber@hydworkerscoop.org' : 'arjun.reddy@apexunion.member');
  const [address, setAddress] = useState('Villa 14, Palm Meadows, Road No 10, Banjara Hills, Hyderabad');
  const [city, setCity] = useState('Hyderabad, Telangana');

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="profile"
          onNavigate={onNavigate}
          language={language}
          badge="KYC Profile Dossier · Simulated"
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1D33] via-[#0A192F] to-[#050C16] border border-[#D4AF37]/50 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F2238] to-[#1E3E62] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                  {userName}
                </h1>
                <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="text-xs text-[#D4AF37] font-semibold">
                {role === 'CUSTOMER' && 'Registered Citizen Member · Platinum Tier'}
                {role === 'COOPERATIVE_ADMIN' && 'Cooperative Administrator · Hyderabad Guild'}
                {role === 'PLATFORM_ADMIN' && 'Federation System Administrator'}
              </div>

              <div className="text-[11px] text-slate-400 mt-1">
                Preferred Interface Language:{' '}
                <strong className="text-white">
                  {SUPPORTED_LANGUAGES[language]?.nativeName} ({SUPPORTED_LANGUAGES[language]?.name})
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>{getTranslation('saveProfileBtn', language, 'Save Profile')}</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-slate-950" />
                <span>{getTranslation('editDetailsBtn', language, 'Edit Details')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal & Contact Credentials */}
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] font-['Cinzel',serif]">
            {getTranslation('verifiedContact', language, 'Verified Contact & Identification')}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('fullName', language, 'Full Legal Name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              ) : (
                <div className="font-bold text-white text-sm">{userName}</div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('phoneNumber', language, 'Phone Number')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{phone}</span>
                  <span className="text-[10px] text-emerald-400">✓ OTP Verified</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('emailAddress', language, 'Email Address')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location & Cooperative Affiliation */}
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] font-['Cinzel',serif]">
            Location & Cooperative Guild Access
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('primaryAddress', language, 'Primary Registered Address')}
              </label>
              {isEditing ? (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              ) : (
                <div className="flex items-start gap-2 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('cityZone', language, 'Jurisdiction / City Zone')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050C16] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              ) : (
                <div className="font-semibold text-white">{city}</div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('affiliatedGuild', language, 'Affiliated Cooperative Guild Hub')}
              </label>
              <div className="p-2.5 rounded-lg bg-[#050C16] border border-[#1E3A5F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-medium">Hyderabad Skilled Workers Cooperative</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">TS-COOP-HYD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
