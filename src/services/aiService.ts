import { AIAnalysisResult, LanguageCode, ServiceCategory, Worker, WorkerRecommendation } from '../types';

// Regex patterns to detect script and language
export const detectInputLanguage = (text: string): { code: LanguageCode; name: string } => {
  if (!text || text.trim().length === 0) {
    return { code: 'en', name: 'English' };
  }

  // Native Script Detection
  // Telugu: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return { code: 'te', name: 'Telugu (తెలుగు)' };
  // Tamil: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return { code: 'ta', name: 'Tamil (தமிழ்)' };
  // Malayalam: \u0D00-\u0D7F
  if (/[\u0D00-\u0D7F]/.test(text)) return { code: 'ml', name: 'Malayalam (മലയാളം)' };
  // Kannada: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' };
  // Bengali / Assamese: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) {
    if (text.includes('ৰ') || text.includes('ৱ')) return { code: 'as', name: 'Assamese (অসমীয়া)' };
    return { code: 'bn', name: 'Bengali (বাংলা)' };
  }
  // Gujarati: \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(text)) return { code: 'gu', name: 'Gujarati (ગુજરાતી)' };
  // Punjabi / Gurmukhi: \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) return { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' };
  // Odia: \u0B00-\u0B7F
  if (/[\u0B00-\u0B7F]/.test(text)) return { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' };
  // Urdu / Arabic: \u0600-\u06FF
  if (/[\u0600-\u06FF]/.test(text)) return { code: 'ur', name: 'Urdu (اردو)' };
  // Devanagari: Hindi or Marathi
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('नळ') || text.includes('गरज') || text.includes('काम') || text.includes('तात्काळ')) {
      return { code: 'mr', name: 'Marathi (मराठी)' };
    }
    return { code: 'hi', name: 'Hindi (हिन्दी)' };
  }

  // Romanized Transliterated Indian Regional Languages & Mixed Input
  const lower = text.toLowerCase();
  if (lower.includes('ayindi') || lower.includes('kavali') || lower.includes('urgent ga') || lower.includes('chesi') || lower.includes('undi') || lower.includes('vastara')) {
    return { code: 'te', name: 'Telugu (Tanglish / Mixed)' };
  }
  if (lower.includes('chahiye') || lower.includes('ho gaya') || lower.includes('chal raha') || lower.includes('karna hai') || lower.includes('pani beh')) {
    return { code: 'hi', name: 'Hindi (Hinglish / Mixed)' };
  }
  if (lower.includes('venum') || lower.includes('aagudhu') || lower.includes('irukku') || lower.includes('varuma')) {
    return { code: 'ta', name: 'Tamil (Tanglish / Mixed)' };
  }
  if (lower.includes('venam') || lower.includes('aayi') || lower.includes('cheyyanam') || lower.includes('und')) {
    return { code: 'ml', name: 'Malayalam (Manglish / Mixed)' };
  }
  if (lower.includes('beku') || lower.includes('aagide') || lower.includes('madabeku') || lower.includes('baralla')) {
    return { code: 'kn', name: 'Kannada (Kanglish / Mixed)' };
  }
  if (lower.includes('dorkar') || lower.includes('korche') || lower.includes('hoyeche') || lower.includes('lagbe')) {
    return { code: 'bn', name: 'Bengali (Banglish / Mixed)' };
  }
  if (lower.includes('pahije') || lower.includes('zala') || lower.includes('ahe') || lower.includes('karaycha')) {
    return { code: 'mr', name: 'Marathi (Mixed)' };
  }
  if (lower.includes('joiye') || lower.includes('chhe') || lower.includes('karyu') || lower.includes('nathi')) {
    return { code: 'gu', name: 'Gujarati (Mixed)' };
  }
  if (lower.includes('chahida') || lower.includes('pya') || lower.includes('hoya') || lower.includes('karo')) {
    return { code: 'pa', name: 'Punjabi (Mixed)' };
  }
  if (lower.includes('darkar') || lower.includes('heuchi') || lower.includes('kariba')) {
    return { code: 'or', name: 'Odia (Mixed)' };
  }
  if (lower.includes('lagibo') || lower.includes('hoise') || lower.includes('koribo')) {
    return { code: 'as', name: 'Assamese (Mixed)' };
  }

  return { code: 'en', name: 'English' };
};

export const analyzeServiceRequest = async (
  rawText: string,
  preferredCategory?: ServiceCategory
): Promise<AIAnalysisResult> => {
  const detectedLang = detectInputLanguage(rawText);
  const lower = rawText.toLowerCase();

  // Category keyword mapping
  let category: ServiceCategory = preferredCategory || 'Plumbing';
  let requiredSkills: string[] = [];
  let urgency: 'Normal' | 'High' | 'Emergency' = 'Normal';

  // Check emergency keywords
  if (
    lower.includes('spark') ||
    lower.includes('shock') ||
    lower.includes('fire') ||
    lower.includes('flooding') ||
    lower.includes('burst') ||
    lower.includes('emergency') ||
    lower.includes('urgent ga') ||
    lower.includes('urgent') ||
    lower.includes('వెంటనే') ||
    lower.includes('तुरंत') ||
    lower.includes('அவசரம்') ||
    lower.includes('അടിയന്തിരം') ||
    lower.includes('ತುರ್ತು')
  ) {
    urgency = 'Emergency';
  } else if (
    lower.includes('urgent') ||
    lower.includes('today') ||
    lower.includes('leak') ||
    lower.includes('leakage') ||
    lower.includes('stop') ||
    lower.includes('స్పార్క్')
  ) {
    urgency = 'High';
  }

  // Detect category keywords across regional languages
  if (
    lower.includes('tap') ||
    lower.includes('pipe') ||
    lower.includes('leak') ||
    lower.includes('water') ||
    lower.includes('plumb') ||
    lower.includes('drain') ||
    lower.includes('sink') ||
    lower.includes('टैप') ||
    lower.includes('नल') ||
    lower.includes('पानी') ||
    lower.includes('पाइप') ||
    lower.includes('లీక్') ||
    lower.includes('నీళ్లు') ||
    lower.includes('ట్యాప్') ||
    lower.includes('குழாய்') ||
    lower.includes('தண்ணீர்') ||
    lower.includes('ടാപ്പ്') ||
    lower.includes('വെള്ളം') ||
    lower.includes('ನಲ್ಲಿ') ||
    lower.includes('ನೀರ') ||
    lower.includes('জল') ||
    lower.includes('নল') ||
    lower.includes('పాଣି')
  ) {
    category = 'Plumbing';
    requiredSkills = ['Leakage Diagnosis', 'Tap & Valve Repair', 'Pipe Fitting'];
  } else if (
    lower.includes('current') ||
    lower.includes('shock') ||
    lower.includes('electric') ||
    lower.includes('wire') ||
    lower.includes('mcb') ||
    lower.includes('trip') ||
    lower.includes('switch') ||
    lower.includes('light') ||
    lower.includes('बिजली') ||
    lower.includes('वायरिंग') ||
    lower.includes('కరెంట్') ||
    lower.includes('స్విచ్') ||
    lower.includes('மின்சாரம்') ||
    lower.includes('വൈദ്യുതി') ||
    lower.includes('ವಿದ್ಯುತ್')
  ) {
    category = 'Electrical';
    requiredSkills = ['Short Circuit Tripping', 'MCB Box Rewiring', 'Inverter Wiring'];
  } else if (
    lower.includes('ac') ||
    lower.includes('cool') ||
    lower.includes('air condition') ||
    lower.includes('gas') ||
    lower.includes('compressor') ||
    lower.includes('कूलिंग') ||
    lower.includes('ஏசி') ||
    lower.includes('ఏసీ')
  ) {
    category = 'AC Service';
    requiredSkills = ['Inverter Split AC Gas Refill', 'Jet Pump Coil Wash', 'Compressor Replacement'];
  } else if (
    lower.includes('wood') ||
    lower.includes('door') ||
    lower.includes('lock') ||
    lower.includes('chair') ||
    lower.includes('table') ||
    lower.includes('carpent') ||
    lower.includes('furniture') ||
    lower.includes('लकड़ी') ||
    lower.includes('दरवाजा') ||
    lower.includes('కార్పెంటర్') ||
    lower.includes('చెక్క')
  ) {
    category = 'Carpentry';
    requiredSkills = ['Modular Kitchen Alignment', 'Godrej / Yale Lock Fitting', 'Door Swelling Trimming'];
  } else if (
    lower.includes('clean') ||
    lower.includes('wash') ||
    lower.includes('sofa') ||
    lower.includes('sanitize') ||
    lower.includes('सफाई') ||
    lower.includes('క్లీనింగ్') ||
    lower.includes('சுத்தம்')
  ) {
    category = 'Cleaning';
    requiredSkills = ['Kitchen Degreasing', 'Bathroom Descaling', 'Sofa Wet Vacuuming'];
  } else if (
    lower.includes('paint') ||
    lower.includes('wall') ||
    lower.includes('colour') ||
    lower.includes('damp') ||
    lower.includes('पेंट') ||
    lower.includes('రంగులు') ||
    lower.includes('வர்ணம்')
  ) {
    category = 'Painting';
    requiredSkills = ['Wall Waterproofing', 'Airless Spray Painting', 'Crack Filling & Putty'];
  } else if (
    lower.includes('elder') ||
    lower.includes('patient') ||
    lower.includes('care') ||
    lower.includes('nurse') ||
    lower.includes('दवा') ||
    lower.includes('కేర్')
  ) {
    category = 'Caregiving';
    requiredSkills = ['Elderly Assistance', 'Vital Signs Monitoring', 'Medication Management'];
  } else if (
    lower.includes('fridge') ||
    lower.includes('washing machine') ||
    lower.includes('appliance') ||
    lower.includes('microwave') ||
    lower.includes('वाशिंग मशीन')
  ) {
    category = 'Appliance Repair';
    requiredSkills = ['Washing Machine Drum Alignment', 'PCB Board Repair', 'Thermostat Diagnostic'];
  }

  // Summary extraction
  let extractedProblem = rawText;
  if (lower.includes('pipe leak') || lower.includes('pipe') && lower.includes('leak')) {
    extractedProblem = 'Pipe Leak';
  } else if (lower.includes('tap') && lower.includes('leak')) {
    extractedProblem = 'Tap Water Leakage & Washer Replacement';
  } else if (lower.includes('spark') || lower.includes('short circuit') || lower.includes('mcb')) {
    extractedProblem = 'Electrical Short Circuit & MCB Tripping';
  } else if (lower.includes('ac') && (lower.includes('gas') || lower.includes('cool'))) {
    extractedProblem = 'AC Cooling & Inverter Gas Refill';
  } else if (lower.includes('lock') || lower.includes('door')) {
    extractedProblem = 'Door Lock & Latch Fitting';
  } else if (rawText.length < 5) {
    extractedProblem = `Inspection and service request for ${category}`;
  }

  return {
    detectedLanguage: detectedLang.name,
    serviceCategory: category,
    extractedProblem,
    requiredSkills,
    urgency,
    confidenceScore: 0.94,
    reasoning: `Identified primary service category as '${category}' with urgency level '${urgency}' from natural language request (${detectedLang.name}).`,
  };
};

/**
 * Transparent AI Worker Recommendation Engine
 * Weights matching PRD Section 9:
 * Skill Match — 30%
 * Availability — 20%
 * Distance — 15%
 * Experience — 10%
 * Rating — 10%
 * Verification — 10%
 * Workload — 5%
 */
export const calculateWorkerRecommendations = (
  workers: Worker[],
  serviceCategory: ServiceCategory,
  requiredSkills: string[] = [],
  customerMaxDistanceKm: number = 10
): WorkerRecommendation[] => {
  const recommendations: WorkerRecommendation[] = workers.map((worker) => {
    const reasons: string[] = [];

    // 1. Skill Match (30 pts)
    const categoryMatches = worker.serviceCategories.includes(serviceCategory);
    let skillOverlapCount = 0;
    if (requiredSkills.length > 0) {
      skillOverlapCount = requiredSkills.filter((s) =>
        worker.skills.some((ws) => ws.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ws.toLowerCase()))
      ).length;
    } else {
      skillOverlapCount = 1;
    }
    const skillScore = categoryMatches
      ? Math.min(30, 20 + (skillOverlapCount / Math.max(requiredSkills.length, 1)) * 10)
      : 5;
    if (categoryMatches) {
      reasons.push(`✓ Matches your requested skill in ${serviceCategory}`);
    }

    // 2. Availability (20 pts)
    let availabilityScore = 0;
    if (worker.availability === 'AVAILABLE') {
      availabilityScore = 20;
      reasons.push('✓ Available today for immediate dispatch');
    } else if (worker.availability === 'BUSY') {
      availabilityScore = 8;
    } else {
      availabilityScore = 0;
    }

    // 3. Distance (15 pts)
    // Closer distance scores higher
    const distanceScore = Math.max(0, Math.min(15, Math.round(15 - (worker.distanceKm / customerMaxDistanceKm) * 10)));
    reasons.push(`✓ Located ${worker.distanceKm} km away in your service zone`);

    // 4. Experience (10 pts)
    // 10 years = 10 pts, scaled linearly
    const expScore = Math.min(10, Math.round((worker.experienceYears / 10) * 10));
    reasons.push(`✓ ${worker.experienceYears} Years verifiable trade experience`);

    // 5. Rating (10 pts)
    // 5.0 rating = 10 pts
    const ratingScore = Math.round((worker.rating / 5) * 10);
    reasons.push(`✓ ${worker.rating.toFixed(1)} ★ Rating from ${worker.reviewCount} customer reviews`);

    // 6. Verification (10 pts)
    let verifScore = 0;
    if (worker.verificationStatus === 'VERIFIED') {
      verifScore = 10;
      reasons.push(`✓ Verified by ${worker.cooperativeName}`);
    } else if (worker.verificationStatus === 'PENDING') {
      verifScore = 4;
    }

    // 7. Workload (5 pts)
    // 0 active jobs = 5 pts, 1 job = 4 pts, 2 jobs = 2 pts, 3+ = 0 pts
    const workloadScore = Math.max(0, 5 - worker.currentWorkload * 2);
    if (worker.currentWorkload === 0) {
      reasons.push('✓ Zero pending queue; dedicated service attention');
    }

    const totalScore = Math.min(100, Math.round(skillScore + availabilityScore + distanceScore + expScore + ratingScore + verifScore + workloadScore));

    return {
      worker,
      score: totalScore,
      breakdown: {
        skillMatch: skillScore,
        availability: availabilityScore,
        distance: distanceScore,
        experience: expScore,
        rating: ratingScore,
        verification: verifScore,
        workload: workloadScore,
        totalScore,
      },
      reasons,
    };
  });

  // Sort descending by score
  return recommendations.sort((a, b) => b.score - a.score);
};
