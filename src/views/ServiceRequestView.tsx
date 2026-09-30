import React, { useState } from 'react';
import { ActiveTab, AIAnalysisResult, LanguageCode, ServiceCategory, UserRole, Worker, WorkerRecommendation } from '../types';
import { analyzeServiceRequest, calculateWorkerRecommendations } from '../services/aiService';
import { LANGUAGES, SUPPORTED_LANGUAGES, getTranslation } from '../localization/translations';
import { SubNavHeader } from '../components/SubNavHeader';
import { ServiceIcon } from '../components/ServiceIcon';
import {
  Sparkles,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  Send,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface Props {
  currentLanguage: LanguageCode;
  workers: Worker[];
  onSelectWorker: (worker: Worker) => void;
  onInspectWorker: (worker: Worker) => void;
  onNavigate?: (tab: ActiveTab) => void;
  role?: UserRole;
}

export const ServiceRequestView: React.FC<Props> = ({
  currentLanguage,
  workers,
  onSelectWorker,
  onInspectWorker,
  onNavigate,
  role = 'CUSTOMER',
}) => {
  const [inputText, setInputText] = useState(
    SUPPORTED_LANGUAGES[currentLanguage]?.samplePrompt ||
      'My kitchen sink tap is leaking water continuously and needs washer replacement.'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<WorkerRecommendation[]>([]);

  // Mixed Telugu / English sample prompt specified in prompt:
  const mixedTeluguExample = 'Na bathroom pipe leak ayindi, urgent ga plumber kavali.';

  const handlePerformAnalysis = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeServiceRequest(text);
      setAnalysisResult(result);

      // Rank workers based on transparent scoring
      const recs = calculateWorkerRecommendations(workers, result.serviceCategory, result.requiredSkills);
      setRecommendations(recs);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySample = (langCode: LanguageCode) => {
    const sample = SUPPORTED_LANGUAGES[langCode].samplePrompt;
    setInputText(sample);
    handlePerformAnalysis(sample);
  };

  const handleApplyMixedSample = (mixedPrompt: string) => {
    setInputText(mixedPrompt);
    handlePerformAnalysis(mixedPrompt);
  };

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time audio speech-to-text in the active regional language
      setTimeout(() => {
        setIsRecording(false);
        const speechText =
          currentLanguage === 'te'
            ? 'మా బాత్‌రూమ్ పైపు లీక్ అవుతోంది, వెంటనే ప్లంబర్ కావాలి.'
            : SUPPORTED_LANGUAGES[currentLanguage]?.samplePrompt || 'Kitchen plumbing pipe is leaking.';
        setInputText(speechText);
        handlePerformAnalysis(speechText);
      }, 1500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation across every UI */}
      {onNavigate && (
        <SubNavHeader
          activeTab="request"
          onNavigate={onNavigate}
          language={currentLanguage}
          role={role}
          badge="Multilingual NLP · Simulated Demo"
        />
      )}

      {/* Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1D33] via-[#0A192F] to-[#050C16] border border-[#D4AF37]/40 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{getTranslation('requestService', currentLanguage, 'AI Service Request')} · Multilingual NLP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            {getTranslation('aiRequestHeading', currentLanguage, 'Describe Your Problem Naturally')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {getTranslation(
              'aiRequestSub',
              currentLanguage,
              'Type or speak in your native Indian regional language. Our AI identifies your required service category, extracts the core problem, scores urgency, and recommends verified cooperative artisans.'
            )}
          </p>
        </div>
      </div>

      {/* Main Request Form */}
      <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-5">
        {/* Prominent Telugu / Mixed English Prompt Demo Banner (Explicit User Prompt Requirement) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#071322] to-[#0D1E33] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40">
                Mixed NLP Demo
              </span>
              <span className="text-xs font-bold text-white">
                {getTranslation('tryMixedInput', currentLanguage, 'Try Mixed Regional/English Input (Tanglish / Hinglish):')}
              </span>
            </div>
            <div className="text-xs text-amber-300 font-mono italic">
              "{mixedTeluguExample}"
            </div>
          </div>

          <button
            onClick={() => handleApplyMixedSample(mixedTeluguExample)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Telugu Mixed Example</span>
          </button>
        </div>

        {/* Quick Sample Prompts across Indian languages */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37]">
              {getTranslation('tryRegionalPrompts', currentLanguage, 'Try Pre-Tested Regional Language Prompts (PRD Section 7 & 36)')}
            </span>
            <span className="text-[10px] text-slate-400">Click to test instant NLP detection</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1">
            {Object.values(SUPPORTED_LANGUAGES).map((l) => (
              <button
                key={l.code}
                onClick={() => handleApplySample(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentLanguage === l.code
                    ? 'bg-[#D4AF37]/25 text-[#F3E5AB] border-[#D4AF37] shadow-sm'
                    : 'bg-[#050C16] text-slate-300 border-[#1E3A5F] hover:border-slate-500 hover:text-white'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeName}</span>
                <span className="text-[10px] text-slate-400 font-mono">({l.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea with Mic Button */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={getTranslation(
              'describeProblemPlaceholder',
              currentLanguage,
              'Describe your issue in your language (e.g. My kitchen tap is leaking water...)'
            )}
            className="w-full px-4 py-3 text-sm rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all pr-24"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Simulated Voice Mic Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isRecording
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#102A43] text-amber-300 border-[#D4AF37]/30 hover:bg-[#1E3A5F]'
              }`}
              title="Speak your problem (Simulated Speech-to-Text in Regional Languages)"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-[10px] hidden sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Supported: Telugu, Hindi, Malayalam, Bengali, Tamil, Kannada, Marathi, Gujarati, Punjabi, Odia, Assamese, English</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInputText('');
                setAnalysisResult(null);
                setRecommendations([]);
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              {getTranslation('clearBtn', currentLanguage, 'Clear')}
            </button>

            <button
              onClick={() => handlePerformAnalysis()}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <span>{getTranslation('analyzing', currentLanguage, 'Analyzing Request...')}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{getTranslation('analyzeBtn', currentLanguage, 'Analyze & Recommend Workers')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Understanding Result Card (PRD Section 8 & 42) */}
      {analysisResult && (
        <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#D4AF37]/60 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
                  {getTranslation('aiOutputHeading', currentLanguage, 'AI Service Understanding Output')}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {getTranslation('confidenceLabel', currentLanguage, 'Confidence Score')}: {(analysisResult.confidenceScore * 100).toFixed(0)}% · Multilingual NLP Pipeline
                </span>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Verified Classification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('detectedLanguageLabel', currentLanguage, 'Detected Language')}
              </span>
              <span className="text-sm font-bold text-white">{analysisResult.detectedLanguage}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('serviceCategoryLabel', currentLanguage, 'Service Category')}
              </span>
              <span className="text-sm font-bold text-[#F3E5AB]">
                {analysisResult.serviceCategory}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('priorityLabel', currentLanguage, 'Assessed Urgency / Priority')}
              </span>
              <span
                className={`text-sm font-bold ${
                  analysisResult.urgency === 'Emergency'
                    ? 'text-red-400'
                    : analysisResult.urgency === 'High'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {analysisResult.urgency === 'Emergency'
                  ? getTranslation('emergencyPriority', currentLanguage, 'Emergency')
                  : analysisResult.urgency === 'High'
                  ? getTranslation('highPriority', currentLanguage, 'High')
                  : getTranslation('normalPriority', currentLanguage, 'Normal')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {getTranslation('requiredSkillsLabel', currentLanguage, 'Required Skills Tag')}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {analysisResult.requiredSkills.join(', ') || 'General Repair'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C16] border border-[#1E3A5F] text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[#D4AF37] font-bold">
                {getTranslation('extractedProblemLabel', currentLanguage, 'Extracted Problem Summary')}:{' '}
              </span>
              <span className="text-white font-medium">{analysisResult.extractedProblem}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              Service: {analysisResult.serviceCategory} → Problem: {analysisResult.extractedProblem} → Priority: {analysisResult.urgency}
            </span>
          </div>
        </div>
      )}

      {/* AI Worker Recommendations (PRD Section 9 & 37) */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold font-['Cinzel',serif] text-white">
                {getTranslation('rankedRecommendations', currentLanguage, 'Ranked Worker Recommendations')}
              </h2>
              <p className="text-xs text-slate-400">
                {getTranslation(
                  'recommendationWeights',
                  currentLanguage,
                  'Transparent 7-Factor Weighted Scoring: Skill (30%), Availability (20%), Distance (15%), Experience (10%), Rating (10%), Verification (10%), Workload (5%)'
                )}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{recommendations.length} Qualified Artisans Located</span>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const { worker, score, breakdown, reasons } = rec;
              return (
                <div
                  key={worker.id}
                  className={`p-5 rounded-2xl bg-[#0A192F] border transition-all shadow-xl ${
                    idx === 0 ? 'border-[#D4AF37] shadow-[#D4AF37]/10' : 'border-[#1E3A5F]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                    {/* Worker Profile Header */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={worker.photoUrl}
                        alt={worker.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#D4AF37]/60 shadow"
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">{worker.name}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050C16] text-amber-200 border border-[#1E3A5F]">
                            {worker.workerIdCode}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950">
                              {getTranslation('topMatchBadge', currentLanguage, '★ Top AI Match')} (Score: {score}/100)
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#D4AF37] font-semibold">{worker.cooperativeName}</div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {worker.rating.toFixed(1)} ({worker.reviewCount})
                          </span>
                          <span>·</span>
                          <span>{worker.experienceYears} {getTranslation('experienceYears', currentLanguage, 'Years Experience')}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {worker.distanceKm} {getTranslation('distanceAway', currentLanguage, 'km away')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Score Badge & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1E3A5F]">
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-[#F3E5AB]">
                          {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {getTranslation('compositeScore', currentLanguage, 'Composite AI Match')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onInspectWorker(worker)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-[#050C16] hover:bg-[#102A43] rounded-lg transition-colors border border-[#1E3A5F] cursor-pointer"
                        >
                          {getTranslation('credentialsBtn', currentLanguage, 'Credentials')}
                        </button>

                        <button
                          onClick={() => onSelectWorker(worker)}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{getTranslation('bookNowBtn', currentLanguage, 'Book Worker')} (₹{worker.hourlyRate})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Why this worker? Transparent Reasons */}
                  <div className="mt-4 pt-3 border-t border-[#1E3A5F]">
                    <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                      {getTranslation('whyThisWorker', currentLanguage, 'Why this artisan was recommended:')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {reasons.map((r, ri) => (
                        <div key={ri} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r.replace('✓ ', '')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Weight Breakdown Sub-bar */}
                    <div className="mt-3 p-2.5 rounded-lg bg-[#050C16] border border-[#1E3A5F] flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                      <span>{getTranslation('skillMatchLabel', currentLanguage, 'Skill Match')}: {breakdown.skillMatch}/30</span>
                      <span>·</span>
                      <span>{getTranslation('availabilityLabel', currentLanguage, 'Availability')}: {breakdown.availability}/20</span>
                      <span>·</span>
                      <span>{getTranslation('distanceLabel', currentLanguage, 'Distance')}: {breakdown.distance}/15</span>
                      <span>·</span>
                      <span>{getTranslation('experienceLabel', currentLanguage, 'Experience')}: {breakdown.experience}/10</span>
                      <span>·</span>
                      <span>{getTranslation('ratingLabel', currentLanguage, 'Rating')}: {breakdown.rating}/10</span>
                      <span>·</span>
                      <span>{getTranslation('verificationLabel', currentLanguage, 'Verification')}: {breakdown.verification}/10</span>
                      <span>·</span>
                      <span>{getTranslation('workloadLabel', currentLanguage, 'Workload')}: {breakdown.workload}/5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
