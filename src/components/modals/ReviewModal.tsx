import React, { useState } from 'react';
import { Booking } from '../../types';
import { X, Star, ThumbsUp } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (bookingId: string, rating: number, feedback: string) => void;
}

export const ReviewModal: React.FC<Props> = ({
  booking,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('Excellent precision and courteous behavior. Fixed the problem cleanly!');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(booking.id, rating, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4 border-b border-[#1E3A5F]">
          <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
            Rate Artisan & Guild Service
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your review helps improve cooperative recommendations for everyone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Worker target info */}
          <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex items-center gap-3">
            {booking.workerPhoto && (
              <img
                src={booking.workerPhoto}
                alt={booking.workerName}
                className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/40"
              />
            )}
            <div>
              <div className="text-sm font-bold text-white">{booking.workerName}</div>
              <div className="text-xs text-[#D4AF37]">{booking.serviceCategory} Specialist</div>
              <div className="text-[11px] text-slate-400">{booking.cooperativeName}</div>
            </div>
          </div>

          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Service Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-300">
              {rating === 5 && 'Outstanding Work (5.0)'}
              {rating === 4 && 'Very Good (4.0)'}
              {rating === 3 && 'Average (3.0)'}
              {rating === 2 && 'Needs Improvement (2.0)'}
              {rating === 1 && 'Unsatisfactory (1.0)'}
            </span>
          </div>

          {/* Feedback textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Feedback & Punctuality
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              required
              placeholder="Describe work quality, behavior, cleanliness, and timing..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#050C16] border border-[#1E3A5F] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
