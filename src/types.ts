/**
 * APEX UNION - Core Domain Types
 */

export type UserRole = 'CUSTOMER' | 'WORKER' | 'COOPERATIVE_ADMIN' | 'PLATFORM_ADMIN';

export type LanguageCode =
  | 'en' // English
  | 'te' // Telugu (తెలుగు)
  | 'hi' // Hindi (हिन्दी)
  | 'ta' // Tamil (தமிழ்)
  | 'ml' // Malayalam (മലയാളം)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ur'; // Urdu (اردو)

export type ServiceCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Carpentry'
  | 'AC Service'
  | 'Gardening'
  | 'Painting'
  | 'Cleaning'
  | 'Appliance Repair'
  | 'Caregiving';

export type WorkerVerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';
export type WorkerAvailability = 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';

export interface WorkerDocument {
  id: string;
  name: string;
  type: 'Aadhaar / ID' | 'Trade Certificate' | 'Experience Letter' | 'Police Clearance';
  uploadDate: string;
  verificationStatus: WorkerVerificationStatus;
  extractedOCR: {
    holderName?: string;
    tradeTitle?: string;
    certifyingBody?: string;
    issueYear?: number;
    scoreOrGrade?: string;
    confidencePercentage?: number;
  };
}

export interface Worker {
  id: string;
  workerIdCode: string; // e.g. "AU-HYD-PL-042"
  name: string;
  photoUrl: string;
  phone: string;
  email: string;
  cooperativeId: string;
  cooperativeName: string;
  serviceCategories: ServiceCategory[];
  skills: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  verificationStatus: WorkerVerificationStatus;
  availability: WorkerAvailability;
  serviceArea: string;
  distanceKm: number;
  currentWorkload: number; // e.g. 1 (active jobs)
  completedJobs: number;
  hourlyRate: number;
  languagesSpoken: string[];
  documents: WorkerDocument[];
  bio: string;
  practicalAssessment?: {
    assessedByGuild: string;
    assessmentDate: string;
    practicalScore: number; // e.g. 96/100
    grade: 'A+' | 'A' | 'B';
    evaluatedModules: { moduleName: string; score: number; maxScore: number; status: 'PASSED' | 'EXCELLENT' }[];
    inspectorName: string;
    assessmentNotes: string;
  };
  earningsSummary?: {
    todayEarnings: number;
    weeklyEarnings: number;
    totalEarnings: number;
    pendingPayout: number;
    completedJobsCount: number;
  };
}

export interface Cooperative {
  id: string;
  code: string;
  name: string;
  state: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  registeredWorkersCount: number;
  verifiedWorkersCount: number;
  activeBookingsCount: number;
  completedJobsCount: number;
  averageRating: number;
  foundedYear: number;
  registrationNumber: string;
}

export type BookingStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI_QR' | 'CARD' | 'NET_BANKING' | 'CASH';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface PriceBreakdown {
  serviceCharge: number;
  platformFee: number;
  taxes: number;
  workerAmount: number;
  totalAmount: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  serviceCategory: ServiceCategory;
  problemDescription: string;
  originalLanguage: string;
  urgency: 'Normal' | 'High' | 'Emergency';
  requiredSkills: string[];
  status: BookingStatus;
  workerId?: string;
  workerName?: string;
  workerPhoto?: string;
  workerPhone?: string;
  cooperativeId: string;
  cooperativeName: string;
  requestedAt: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  pricing: PriceBreakdown;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  invoiceId?: string;
  review?: {
    rating: number;
    feedback: string;
    submittedAt: string;
  };
  trackingLocation?: {
    lat: number;
    lng: number;
    etaMinutes: number;
    currentAddress: string;
  };
}

export interface RecommendationBreakdown {
  skillMatch: number;      // max 30
  availability: number;    // max 20
  distance: number;        // max 15
  experience: number;      // max 10
  rating: number;          // max 10
  verification: number;    // max 10
  workload: number;        // max 5
  totalScore: number;      // max 100
}

export interface WorkerRecommendation {
  worker: Worker;
  score: number;
  breakdown: RecommendationBreakdown;
  reasons: string[];
}

export interface AIAnalysisResult {
  detectedLanguage: string;
  serviceCategory: ServiceCategory;
  extractedProblem: string;
  requiredSkills: string[];
  urgency: 'Normal' | 'High' | 'Emergency';
  confidenceScore: number;
  reasoning: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  customerName: string;
  category: 'Service Quality' | 'Worker Behavior' | 'Pricing Issue' | 'Delay / No-Show' | 'Other';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  resolutionNote?: string;
}

export interface AuditLog {
  id: string;
  userRole: UserRole;
  userName: string;
  action: string;
  timestamp: string;
  entityType: 'WORKER' | 'BOOKING' | 'COOPERATIVE' | 'VERIFICATION' | 'COMPLAINT';
  entityId: string;
  details: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'request'
  | 'workers'
  | 'bookings'
  | 'workerDashboard'
  | 'cooperatives'
  | 'analytics'
  | 'profile'
  | 'settings';
