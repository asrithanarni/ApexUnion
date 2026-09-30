import React from 'react';
import { Worker, WorkerVerificationStatus } from '../../types';
import { X, ShieldCheck, CheckCircle2, XCircle, FileText, AlertTriangle, Award } from 'lucide-react';

interface Props {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (workerId: string, status: WorkerVerificationStatus, note: string) => void;
}

export const VerificationInspectionModal: React.FC<Props> = ({
  worker,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !worker) return null;

  const handleApprove = () => {
    onUpdateStatus(
      worker.id,
      'VERIFIED',
      'Cooperative admin verified physical trade certificate, national ID, and police non-criminal clearance.'
    );
    onClose();
  };

  const handleReject = () => {
    onUpdateStatus(
      worker.id,
      'REJECTED',
      'Document failed authenticity threshold. Requires renewed district council re-attestation.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#1E3A5F]">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
              Worker Guild Verification Audit
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">{worker.name} ({worker.workerIdCode})</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                [OCR Processing Simulated]
              </span>
            </div>
          </div>
        </div>

        {/* Prototype Credibility notice */}
        <div className="mt-4 p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
          <span>
            Notice per PRD Section 11: Document processing is simulated via OCR metadata extraction. Official government DigiLocker integration is scheduled for production phase.
          </span>
        </div>

        {/* Candidate Summary */}
        <div className="mt-4 p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center gap-4">
          <img
            src={worker.photoUrl}
            alt={worker.name}
            className="w-16 h-16 rounded-xl object-cover border border-[#D4AF37]/40"
          />
          <div className="flex-1 text-xs space-y-1">
            <div className="text-sm font-bold text-white">{worker.name}</div>
            <div className="text-[#D4AF37]">{worker.cooperativeName}</div>
            <div className="text-slate-400">
              Primary Skills: {worker.skills.join(', ')} · Experience: {worker.experienceYears} Years
            </div>
            <div className="text-slate-400">
              Contact: {worker.phone} · {worker.email}
            </div>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="mt-5 space-y-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[#D4AF37]">
            Uploaded Verification Dossiers ({worker.documents.length})
          </h3>

          {worker.documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-sm text-slate-100">{doc.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#102A43] text-amber-200 border border-amber-300/20">
                  {doc.type}
                </span>
              </div>

              {/* OCR Details Box */}
              <div className="p-3 rounded-lg bg-[#0A192F] border border-[#1E3A5F] text-xs space-y-1 font-mono">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase font-sans">
                  OCR Machine Reading Results:
                </div>
                <div className="text-slate-300">
                  Holder: <span className="text-white font-bold">{doc.extractedOCR.holderName}</span>
                </div>
                {doc.extractedOCR.tradeTitle && (
                  <div className="text-slate-300">
                    Trade: <span className="text-white">{doc.extractedOCR.tradeTitle}</span>
                  </div>
                )}
                {doc.extractedOCR.certifyingBody && (
                  <div className="text-slate-300">
                    Board: <span className="text-white">{doc.extractedOCR.certifyingBody}</span>
                  </div>
                )}
                <div className="text-slate-300 flex items-center justify-between">
                  <span>OCR Signature & Stamp Match:</span>
                  <span className="text-emerald-400 font-bold">{doc.extractedOCR.confidencePercentage}% Confidence</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-[#1E3A5F] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Reject Verification</span>
            </button>

            <button
              onClick={handleApprove}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Approve & Verify Worker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
