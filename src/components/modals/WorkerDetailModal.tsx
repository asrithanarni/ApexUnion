import React, { useState } from 'react';
import { Worker } from '../../types';
import {
  X,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Briefcase,
  Languages,
  Award,
  FileCheck2,
  CalendarCheck2,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

interface Props {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (worker: Worker) => void;
}

export const WorkerDetailModal: React.FC<Props> = ({ worker, isOpen, onClose, onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'reviews'>('profile');

  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Worker Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-[#1E3A5F]">
          <div className="relative">
            <img
              src={worker.photoUrl}
              alt={worker.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D4AF37]/60 shadow-lg"
            />
            {worker.verificationStatus === 'VERIFIED' && (
              <span
                className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#06101E] border border-[#D4AF37] text-[#D4AF37]"
                title="Verified by Cooperative Guild"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white font-['Cinzel',serif]">{worker.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#102A43] text-amber-200 border border-amber-300/30">
                {worker.workerIdCode}
              </span>
            </div>

            <p className="text-xs text-[#D4AF37] font-medium mb-2">
              {worker.cooperativeName}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {worker.rating.toFixed(1)} ({worker.reviewCount} reviews)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {worker.experienceYears} Years Exp
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {worker.distanceKm} km away
              </span>
            </div>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#1E3A5F] pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Worker Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Verified Credentials ({worker.documents.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Bio */}
              <div>
                <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D4AF37] mb-1">
                  Professional Summary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#050C16] p-3 rounded-xl border border-[#1E3A5F]">
                  {worker.bio}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D4AF37] mb-2">
                  Specialized Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#102A43] text-slate-200 border border-[#1E3A5F]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Base Rate</span>
                  <span className="text-base font-bold text-[#F3E5AB]">₹{worker.hourlyRate}</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ service</span>
                </div>

                <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Completed Jobs</span>
                  <span className="text-base font-bold text-emerald-400">{worker.completedJobs}</span>
                  <span className="text-[10px] text-slate-400 ml-1">verified</span>
                </div>

                <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Current Workload</span>
                  <span className={`text-base font-bold ${worker.currentWorkload === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {worker.currentWorkload === 0 ? 'Available Now' : `${worker.currentWorkload} Active Job`}
                  </span>
                </div>
              </div>

              {/* Languages & Service Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-start gap-2">
                  <Languages className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Languages Spoken</span>
                    <span className="text-slate-400">{worker.languagesSpoken.join(', ')}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Covered Zones</span>
                    <span className="text-slate-400">{worker.serviceArea}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>
                  Cooperative Verification Protocol: Document processing simulated via OCR metadata extraction. All credentials audited by Cooperative Guild Officers.
                </span>
              </div>

              {worker.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-sm text-slate-100">{doc.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                      {doc.verificationStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Document Category: <span className="text-slate-200">{doc.type}</span> · Uploaded: {doc.uploadDate}
                  </div>

                  {/* OCR Extracted Data Container */}
                  <div className="mt-2 p-3 rounded-lg bg-[#0A192F] border border-[#1E3A5F]/80 text-xs space-y-1">
                    <div className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                      OCR Extracted Data [Simulated Processing]
                    </div>
                    {doc.extractedOCR.holderName && (
                      <div className="text-slate-300">
                        <span className="text-slate-500">Name:</span> {doc.extractedOCR.holderName}
                      </div>
                    )}
                    {doc.extractedOCR.tradeTitle && (
                      <div className="text-slate-300">
                        <span className="text-slate-500">Trade Designation:</span> {doc.extractedOCR.tradeTitle}
                      </div>
                    )}
                    {doc.extractedOCR.certifyingBody && (
                      <div className="text-slate-300">
                        <span className="text-slate-500">Issuing Board:</span> {doc.extractedOCR.certifyingBody}
                      </div>
                    )}
                    {doc.extractedOCR.confidencePercentage && (
                      <div className="text-slate-300">
                        <span className="text-slate-500">OCR Match Confidence:</span>{' '}
                        <span className="text-emerald-400 font-bold">{doc.extractedOCR.confidencePercentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#1E3A5F] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Backed by <span className="text-[#D4AF37]">{worker.cooperativeName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(worker);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-slate-950" />
              Book Worker (₹{worker.hourlyRate})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
