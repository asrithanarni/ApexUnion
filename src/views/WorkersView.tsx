import React, { useState } from 'react';
import { ActiveTab, LanguageCode, ServiceCategory, UserRole, Worker, WorkerVerificationStatus } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { getTranslation } from '../localization/translations';
import { SubNavHeader } from '../components/SubNavHeader';
import { ServiceIcon } from '../components/ServiceIcon';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Award,
  CalendarCheck2,
  FileCheck2,
  Users,
} from 'lucide-react';

interface Props {
  language: LanguageCode;
  workers: Worker[];
  onSelectWorker: (worker: Worker) => void;
  onInspectWorker: (worker: Worker) => void;
  onNavigate?: (tab: ActiveTab) => void;
  role?: UserRole;
}

export const WorkersView: React.FC<Props> = ({
  language,
  workers,
  onSelectWorker,
  onInspectWorker,
  onNavigate,
  role = 'CUSTOMER',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      w.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerIdCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || w.serviceCategories.includes(selectedCategory as ServiceCategory);

    const matchesVerification =
      verificationFilter === 'ALL' || w.verificationStatus === verificationFilter;

    return matchesSearch && matchesCategory && matchesVerification;
  });

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="workers"
          onNavigate={onNavigate}
          language={language}
          role={role}
          badge="Demo Artisan Directory · Simulated"
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            {getTranslation('artisanGuild', language, 'Artisan Guild Directory')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {getTranslation('artisanGuildDesc', language, 'Browse verified craftsmen and artisans registered under affiliated labour cooperatives')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] px-3.5 py-1.5 rounded-xl bg-[#050C16] border border-[#D4AF37]/30">
          <Users className="w-4 h-4" />
          <span>{filteredWorkers.length} {getTranslation('verifiedArtisans', language, 'verified artisans')}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-[#0A192F] border border-[#1E3A5F] space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by worker name, skill, trade, locality (e.g. Ramesh, Plumber, Banjara Hills)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Trade Guilds</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {getTranslation(getCategoryTranslationKey(c.id), language, c.name)}
                </option>
              ))}
            </select>

            {/* Verification Status */}
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Verification</option>
              <option value="VERIFIED">Verified Only (OCR / NCVT)</option>
              <option value="PENDING">Pending Audit</option>
            </select>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#D4AF37] text-slate-950 font-bold'
                : 'bg-[#050C16] text-slate-300 border border-[#1E3A5F] hover:border-slate-400'
            }`}
          >
            All Guilds
          </button>
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#D4AF37] text-slate-950 font-bold'
                  : 'bg-[#050C16] text-slate-300 border border-[#1E3A5F] hover:border-slate-400'
              }`}
            >
              {getTranslation(getCategoryTranslationKey(c.id), language, c.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w) => (
          <div
            key={w.id}
            className="p-5 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#D4AF37]/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={w.photoUrl}
                  alt={w.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37]/50 shadow"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-white truncate">{w.name}</h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {w.rating.toFixed(1)}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#D4AF37] block mt-0.5">
                    {w.workerIdCode}
                  </span>

                  <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                    {w.serviceCategories.map((c) => getTranslation(getCategoryTranslationKey(c), language, c)).join(' · ')}
                  </div>

                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {w.cooperativeName}
                  </div>
                </div>
              </div>

              {/* Status & Credential Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {w.verificationStatus}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    w.availability === 'AVAILABLE'
                      ? 'bg-blue-950 text-blue-300 border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {w.availability}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#050C16] text-[#D4AF37] border border-[#1E3A5F]">
                  ₹{w.hourlyRate}/hr
                </span>
              </div>

              {/* Attributes Box */}
              <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">{getTranslation('experienceLabel', language, 'Experience')}:</span>
                  <span className="font-semibold text-white">{w.experienceYears} {getTranslation('experienceYears', language, 'Years')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{getTranslation('distanceLabel', language, 'Distance')}:</span>
                  <span className="font-semibold text-white">{w.distanceKm} {getTranslation('distanceAway', language, 'km away')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurisdiction Area:</span>
                  <span className="font-semibold text-white truncate max-w-[150px]">{w.serviceArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Dossier:</span>
                  <span className="text-emerald-400 font-semibold">{w.documents.length} Audited Certificates</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#1E3A5F]">
              <button
                onClick={() => onInspectWorker(w)}
                className="flex-1 py-2 text-xs font-bold text-slate-300 bg-[#050C16] hover:bg-[#102A43] rounded-lg transition-colors border border-[#1E3A5F] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{getTranslation('credentialsBtn', language, 'Credentials')}</span>
              </button>

              <button
                onClick={() => onSelectWorker(w)}
                className="flex-1 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#B78727] rounded-lg hover:opacity-95 transition-opacity cursor-pointer shadow"
              >
                {getTranslation('bookNowBtn', language, 'Book Worker')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
