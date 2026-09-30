import React, { useState } from 'react';
import { Booking, PaymentMethod } from '../../types';
import { X, QrCode, CreditCard, Building, Banknote, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (bookingId: string, method: PaymentMethod, invoiceId: string) => void;
}

export const PaymentModal: React.FC<Props> = ({
  booking,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI_QR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState('');

  if (!isOpen || !booking) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const invoiceId = `INV-AU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedInvoiceId(invoiceId);
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentSuccess(booking.id, selectedMethod, invoiceId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-y-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#1E3A5F]">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
                  Settlement & Payment
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Booking {booking.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    [DEMO PAYMENT MODE]
                  </span>
                </div>
              </div>
            </div>

            {/* Credibility Notice */}
            <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Prototype Notice: No real currency will be charged. This demonstrates the seamless multi-method settlement gateway designed for Apex Union cooperatives.
              </span>
            </div>

            {/* Price Summary Card */}
            <div className="mt-4 p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Service Description</span>
                <span className="font-semibold text-white">{booking.serviceCategory}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Worker Share ({booking.workerName})</span>
                <span>₹{booking.pricing.workerAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cooperative Guild & Platform Fee</span>
                <span>₹{booking.pricing.platformFee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxes & GST (18%)</span>
                <span>₹{booking.pricing.taxes}</span>
              </div>
              <div className="pt-2 border-t border-[#1E3A5F] flex justify-between font-bold text-base text-white">
                <span>Total Amount Due</span>
                <span className="text-[#F3E5AB]">₹{booking.pricing.totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Payment Channel
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI_QR')}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    selectedMethod === 'UPI_QR'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-[#050C16] border-[#1E3A5F] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold">UPI Dynamic QR</div>
                    <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    selectedMethod === 'CARD'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-[#050C16] border-[#1E3A5F] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold">Debit / Credit Card</div>
                    <div className="text-[10px] text-slate-400">Visa, RuPay, MC</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NET_BANKING')}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    selectedMethod === 'NET_BANKING'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-[#050C16] border-[#1E3A5F] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold">Net Banking</div>
                    <div className="text-[10px] text-slate-400">All Major Indian Banks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CASH')}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    selectedMethod === 'CASH'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-[#050C16] border-[#1E3A5F] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold">Cash to Worker</div>
                    <div className="text-[10px] text-slate-400">Pay upon job sign-off</div>
                  </div>
                </button>
              </div>
            </div>

            {/* QR Mock Display if UPI selected */}
            {selectedMethod === 'UPI_QR' && (
              <div className="mt-4 p-4 rounded-xl bg-[#050C16] border border-[#1E3A5F] flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  {/* Stylized QR Code SVG */}
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    {/* Top-left position marker */}
                    <rect x="10" y="10" width="25" height="25" fill="#0B192C" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="#0B192C" />
                    {/* Top-right position marker */}
                    <rect x="65" y="10" width="25" height="25" fill="#0B192C" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="#0B192C" />
                    {/* Bottom-left position marker */}
                    <rect x="10" y="65" width="25" height="25" fill="#0B192C" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="#0B192C" />
                    {/* Data dots */}
                    <rect x="40" y="12" width="6" height="6" fill="#0B192C" />
                    <rect x="50" y="18" width="6" height="6" fill="#0B192C" />
                    <rect x="42" y="32" width="12" height="6" fill="#0B192C" />
                    <rect x="20" y="44" width="8" height="8" fill="#0B192C" />
                    <rect x="68" y="42" width="18" height="8" fill="#0B192C" />
                    <rect x="45" y="50" width="10" height="10" fill="#D4AF37" />
                    <rect x="40" y="68" width="8" height="8" fill="#0B192C" />
                    <rect x="60" y="65" width="12" height="12" fill="#0B192C" />
                    <rect x="78" y="78" width="8" height="8" fill="#0B192C" />
                  </svg>
                </div>
                <div className="text-[11px] text-slate-300">
                  Scan with any UPI App · <span className="font-bold text-[#F3E5AB]">UPI ID: apexunion.guild@icici</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Settlement...</span>
                ) : (
                  <>
                    <span>Simulate Payment (₹{booking.pricing.totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold font-['Cinzel',serif] text-gold-gradient">
              Settlement Completed!
            </h3>

            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              ₹{booking.pricing.totalAmount} has been recorded successfully. Worker earnings of ₹{booking.pricing.workerAmount} have been credited to the cooperative escrow account.
            </p>

            <div className="p-3 rounded-xl bg-[#050C16] border border-[#1E3A5F] max-w-xs mx-auto text-xs text-slate-400">
              Generated Invoice: <strong className="text-amber-300">{generatedInvoiceId}</strong>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78727] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
