import React, { useState } from 'react';
import {
  ActiveTab,
  AuditLog,
  Booking,
  BookingStatus,
  Complaint,
  Cooperative,
  LanguageCode,
  PaymentMethod,
  UserRole,
  Worker,
  WorkerAvailability,
  WorkerVerificationStatus,
} from './types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BOOKINGS,
  INITIAL_COMPLAINTS,
  INITIAL_COOPERATIVES,
  INITIAL_WORKERS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Logo } from './components/Logo';
import { PrototypeBoundariesModal } from './components/PrototypeBoundariesModal';
import { WorkerDetailModal } from './components/modals/WorkerDetailModal';
import { BookingModal } from './components/modals/BookingModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { ReviewModal } from './components/modals/ReviewModal';
import { VerificationInspectionModal } from './components/modals/VerificationInspectionModal';
import { AllocationModal } from './components/modals/AllocationModal';
import { ComplaintModal } from './components/modals/ComplaintModal';
import { DashboardView } from './views/DashboardView';
import { ServiceRequestView } from './views/ServiceRequestView';
import { WorkersView } from './views/WorkersView';
import { BookingsView } from './views/BookingsView';
import { WorkerDashboardView } from './views/WorkerDashboardView';
import { CooperativeView } from './views/CooperativeView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { ShieldCheck, Heart, Sparkles, Building2, HelpCircle } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Core Data Store (Live in-memory state with realistic seeds)
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(INITIAL_COOPERATIVES);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals Management
  const [boundariesModalOpen, setBoundariesModalOpen] = useState(false);
  const [detailWorker, setDetailWorker] = useState<Worker | null>(null);
  const [bookingWorker, setBookingWorker] = useState<Worker | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [inspectionWorker, setInspectionWorker] = useState<Worker | null>(null);
  const [allocationBooking, setAllocationBooking] = useState<Booking | null>(null);

  // Toast / Status notification banner
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Helper to record an immutable administrative audit log
  const logAudit = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      userRole: currentRole,
      userName: currentRole === 'CUSTOMER' ? 'Dr. Arjun Reddy' : currentRole === 'COOPERATIVE_ADMIN' ? 'Srinivasa Rao V.' : 'Platform Overseer',
      action,
      timestamp: new Date().toISOString(),
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Advance Booking Lifecycle (Requested -> Assigned -> Accepted -> On The Way -> In Progress -> Completed)
  const handleAdvanceStatus = (bookingId: string) => {
    const order: BookingStatus[] = ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'];
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const currentIdx = order.indexOf(b.status);
        const nextStatus = currentIdx < order.length - 1 ? order[currentIdx + 1] : order[currentIdx];
        logAudit('STAGE_TRANSITION', 'BOOKING', b.id, `Status progressed from ${b.status} to ${nextStatus}.`);
        showBanner(`Booking ${b.id} stage advanced to: ${nextStatus.replace('_', ' ')}`);
        return { ...b, status: nextStatus };
      })
    );
  };

  // 2. Booking confirmed
  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    logAudit('BOOKING_CREATED', 'BOOKING', newBooking.id, `Created service request for ${newBooking.serviceCategory} under ${newBooking.cooperativeName}.`);
    showBanner(`Booking ${newBooking.id} created! Artisan dispatch initiated.`);
    setActiveTab('bookings');
  };

  // 3. Payment settlement
  const handlePaymentSuccess = (bookingId: string, method: PaymentMethod, invoiceId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          paymentStatus: 'PAID',
          paymentMethod: method,
          invoiceId,
        };
      })
    );
    logAudit('PAYMENT_SETTLED', 'BOOKING', bookingId, `Settlement received via ${method}. Generated Invoice ${invoiceId}.`);
    showBanner(`Payment of ₹${paymentBooking?.pricing.totalAmount} recorded! Tax invoice ready.`);
  };

  // 4. Rating & Review submitted
  const handleSubmitReview = (bookingId: string, rating: number, feedback: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        // Update assigned worker's rating as well
        if (b.workerId) {
          setWorkers((wList) =>
            wList.map((w) => {
              if (w.id !== b.workerId) return w;
              const newCount = w.reviewCount + 1;
              const newRating = Number(((w.rating * w.reviewCount + rating) / newCount).toFixed(1));
              return { ...w, rating: newRating, reviewCount: newCount };
            })
          );
        }
        return {
          ...b,
          review: {
            rating,
            feedback,
            submittedAt: new Date().toISOString(),
          },
        };
      })
    );
    logAudit('REVIEW_SUBMITTED', 'BOOKING', bookingId, `Customer submitted a ${rating}★ review with feedback.`);
    showBanner(`Review registered! Thank you for rating the cooperative artisan.`);
  };

  // 5. Worker Verification Audit (Cooperative Admin)
  const handleWorkerStatusUpdate = (workerId: string, status: WorkerVerificationStatus, note: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          verificationStatus: status,
          documents: w.documents.map((d) => ({ ...d, verificationStatus: status })),
        };
      })
    );

    // Update cooperative verified count
    setCooperatives((prev) =>
      prev.map((c) => {
        const targetWorker = workers.find((w) => w.id === workerId);
        if (targetWorker && targetWorker.cooperativeId === c.id && status === 'VERIFIED') {
          return { ...c, verifiedWorkersCount: c.verifiedWorkersCount + 1 };
        }
        return c;
      })
    );

    logAudit(`WORKER_${status}`, 'VERIFICATION', workerId, note);
    showBanner(`Worker ${workerId} verification status updated to: ${status}`);
  };

  // 6. AI Workforce Allocation confirmation
  const handleAllocateWorker = (bookingId: string, worker: Worker) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'ASSIGNED',
          workerId: worker.id,
          workerName: worker.name,
          workerPhoto: worker.photoUrl,
          workerPhone: worker.phone,
        };
      })
    );

    // Update worker current workload
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== worker.id) return w;
        return { ...w, currentWorkload: w.currentWorkload + 1 };
      })
    );

    logAudit('WORKER_ALLOCATED', 'BOOKING', bookingId, `Allocated ${worker.name} (${worker.workerIdCode}) to service request.`);
    showBanner(`${worker.name} successfully dispatched to Booking ${bookingId}!`);
  };

  // 7. Complaint submission & resolution
  const handleSubmitComplaint = (complaint: Complaint) => {
    setComplaints((prev) => [complaint, ...prev]);
    logAudit('COMPLAINT_FILED', 'COMPLAINT', complaint.id, `Customer raised issue on booking ${complaint.bookingId}: ${complaint.category}.`);
    showBanner(`Support grievance ${complaint.id} registered for cooperative arbitration.`);
  };

  const handleResolveComplaint = (complaintId: string, resolutionNote: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return { ...c, status: 'RESOLVED', resolutionNote };
      })
    );
    logAudit('COMPLAINT_RESOLVED', 'COMPLAINT', complaintId, resolutionNote);
    showBanner(`Grievance ${complaintId} marked resolved.`);
  };

  // 8. Worker Dispatch Workflow Handlers
  const handleUpdateWorkerAvailability = (workerId: string, availability: WorkerAvailability) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, availability } : w))
    );
    showBanner(`Worker availability updated to: ${availability}`);
    logAudit('WORKER_AVAILABILITY_CHANGE', 'WORKER', workerId, `Availability toggled to ${availability}`);
  };

  const handleAcceptJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b))
    );
    showBanner(`Job ${bookingId} accepted! Prepare for dispatch.`);
    logAudit('JOB_ACCEPTED', 'BOOKING', bookingId, `Worker accepted service assignment.`);
  };

  const handleRejectJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'REQUESTED', workerId: undefined, workerName: undefined } : b))
    );
    showBanner(`Job ${bookingId} declined. Returned to allocation queue.`);
    logAudit('JOB_DECLINED', 'BOOKING', bookingId, `Worker declined assignment.`);
  };

  const handleStartJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b))
    );
    showBanner(`Job ${bookingId} commenced on site.`);
    logAudit('JOB_STARTED', 'BOOKING', bookingId, `Service execution started on customer site.`);
  };

  const handleCompleteJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'COMPLETED', paymentStatus: 'PAID' } : b))
    );
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking?.workerId) {
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id !== targetBooking.workerId) return w;
          const addedPay = targetBooking.pricing.workerAmount || 450;
          const oldEarnings = w.earningsSummary || { todayEarnings: 0, weeklyEarnings: 0, totalEarnings: 0, pendingPayout: 0, completedJobsCount: 0 };
          return {
            ...w,
            completedJobs: w.completedJobs + 1,
            earningsSummary: {
              ...oldEarnings,
              todayEarnings: oldEarnings.todayEarnings + addedPay,
              weeklyEarnings: oldEarnings.weeklyEarnings + addedPay,
              totalEarnings: oldEarnings.totalEarnings + addedPay,
              completedJobsCount: oldEarnings.completedJobsCount + 1,
            },
          };
        })
      );
    }
    showBanner(`Job ${bookingId} completed! Payout credit recorded.`);
    logAudit('JOB_COMPLETED', 'BOOKING', bookingId, `Service completed. Compensation added to artisan ledger.`);
  };

  // 9. Reset Demo Data
  const handleResetDemoData = () => {
    setWorkers(INITIAL_WORKERS);
    setBookings(INITIAL_BOOKINGS);
    setCooperatives(INITIAL_COOPERATIVES);
    setComplaints(INITIAL_COMPLAINTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showBanner('Apex Union demonstration dataset reset to clean initial state.');
  };

  return (
    <div className="min-h-screen bg-[#050C16] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onOpenBoundaries={() => setBoundariesModalOpen(true)}
      />

      {/* Floating System Notification Toast */}
      {bannerNotice && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F2238] to-[#0A192F] border border-[#D4AF37] shadow-2xl text-xs text-[#F3E5AB] font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{bannerNotice}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            role={currentRole}
            language={currentLanguage}
            onLanguageChange={(lang) => setCurrentLanguage(lang)}
            workers={workers}
            bookings={bookings}
            cooperatives={cooperatives}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectWorker={(w) => {
              setBookingWorker(w);
              setBookingModalOpen(true);
            }}
            onSelectBooking={(b) => {
              setActiveTab('bookings');
            }}
            onInspectWorker={(w) => setDetailWorker(w)}
            onOpenAllocation={(b) => setAllocationBooking(b)}
            onUpdateWorkerAvailability={handleUpdateWorkerAvailability}
            onAcceptJob={handleAcceptJob}
            onRejectJob={handleRejectJob}
            onStartJob={handleStartJob}
            onCompleteJob={handleCompleteJob}
          />
        )}

        {activeTab === 'request' && (
          <ServiceRequestView
            currentLanguage={currentLanguage}
            workers={workers}
            onSelectWorker={(w) => {
              setBookingWorker(w);
              setBookingModalOpen(true);
            }}
            onInspectWorker={(w) => setDetailWorker(w)}
            onNavigate={(tab) => setActiveTab(tab)}
            role={currentRole}
          />
        )}

        {activeTab === 'workers' && (
          <WorkersView
            language={currentLanguage}
            workers={workers}
            onSelectWorker={(w) => {
              setBookingWorker(w);
              setBookingModalOpen(true);
            }}
            onInspectWorker={(w) => setDetailWorker(w)}
            onNavigate={(tab) => setActiveTab(tab)}
            role={currentRole}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView
            language={currentLanguage}
            bookings={bookings}
            onOpenPayment={(b) => setPaymentBooking(b)}
            onOpenInvoice={(b) => setInvoiceBooking(b)}
            onOpenReview={(b) => setReviewBooking(b)}
            onOpenComplaint={(b) => setComplaintBooking(b)}
            onAdvanceStatus={handleAdvanceStatus}
            onNavigate={(tab) => setActiveTab(tab)}
            role={currentRole}
          />
        )}

        {activeTab === 'workerDashboard' && (
          <WorkerDashboardView
            language={currentLanguage}
            allWorkers={workers}
            bookings={bookings}
            onUpdateAvailability={handleUpdateWorkerAvailability}
            onAcceptJob={handleAcceptJob}
            onRejectJob={handleRejectJob}
            onStartJob={handleStartJob}
            onCompleteJob={handleCompleteJob}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'cooperatives' && (
          <CooperativeView
            cooperatives={cooperatives}
            workers={workers}
            bookings={bookings}
            onInspectWorker={(w) => setInspectionWorker(w)}
            onOpenAllocation={(b) => setAllocationBooking(b)}
            onNavigate={(tab) => setActiveTab(tab)}
            language={currentLanguage}
            role={currentRole}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            workers={workers}
            bookings={bookings}
            cooperatives={cooperatives}
            complaints={complaints}
            auditLogs={auditLogs}
            onResolveComplaint={handleResolveComplaint}
            onNavigate={(tab) => setActiveTab(tab)}
            language={currentLanguage}
            role={currentRole}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            role={currentRole}
            language={currentLanguage}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentLanguage={currentLanguage}
            onLanguageChange={(lang) => setCurrentLanguage(lang)}
            onResetDemoData={handleResetDemoData}
            onOpenBoundaries={() => setBoundariesModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            role={currentRole}
          />
        )}
      </main>

      {/* Footer with AU Logo & Navy Gold Aesthetics */}
      <footer className="w-full border-t border-[#1E3A5F] bg-[#06101E] text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setBoundariesModalOpen(true)}
                className="hover:text-[#D4AF37] transition-colors text-amber-300 font-semibold cursor-pointer"
              >
                PRD Boundaries [Matrix]
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E3A5F]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Apex Union Federation · Registered under Cooperative Societies Act & Skill India NSDC Guild Framework.
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Crafted for Skilled Workers, Cooperatives & Customers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <PrototypeBoundariesModal
        isOpen={boundariesModalOpen}
        onClose={() => setBoundariesModalOpen(false)}
      />

      <WorkerDetailModal
        worker={detailWorker}
        isOpen={!!detailWorker}
        onClose={() => setDetailWorker(null)}
        onBookNow={(w) => {
          setBookingWorker(w);
          setBookingModalOpen(true);
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingWorker(null);
        }}
        worker={bookingWorker}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <PaymentModal
        booking={paymentBooking}
        isOpen={!!paymentBooking}
        onClose={() => setPaymentBooking(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <InvoiceModal
        booking={invoiceBooking}
        isOpen={!!invoiceBooking}
        onClose={() => setInvoiceBooking(null)}
      />

      <ReviewModal
        booking={reviewBooking}
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        onSubmitReview={handleSubmitReview}
      />

      <VerificationInspectionModal
        worker={inspectionWorker}
        isOpen={!!inspectionWorker}
        onClose={() => setInspectionWorker(null)}
        onUpdateStatus={handleWorkerStatusUpdate}
      />

      <AllocationModal
        booking={allocationBooking}
        workers={workers}
        isOpen={!!allocationBooking}
        onClose={() => setAllocationBooking(null)}
        onAllocateWorker={handleAllocateWorker}
      />

      <ComplaintModal
        booking={complaintBooking}
        isOpen={!!complaintBooking}
        onClose={() => setComplaintBooking(null)}
        onSubmitComplaint={handleSubmitComplaint}
      />
    </div>
  );
}
