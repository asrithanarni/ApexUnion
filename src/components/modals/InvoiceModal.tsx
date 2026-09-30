import React from 'react';
import { Booking } from '../../types';
import { Logo } from '../Logo';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<Props> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceId = booking.invoiceId || `INV-AU-2026-${booking.id.replace('BK-', '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white text-slate-900 shadow-2xl p-8 border-4 border-[#0B1D33]">
        {/* Screen Action Bar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Tax Invoice & Guild Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1D33] text-amber-300 text-xs font-bold hover:bg-[#102A43] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Logo size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Apex Union Multi-Cooperative Guild Federation
              </p>
              <p className="text-[11px] text-slate-400">
                GSTIN: 36AAACA1122G1Z8 · Registered under MSME & Cooperative Societies Act
              </p>
            </div>

            <div className="text-right">
              <h1 className="text-xl font-black font-['Cinzel',serif] text-[#0B1D33] tracking-wide">
                TAX INVOICE
              </h1>
              <div className="text-xs font-mono font-bold text-amber-800">{invoiceId}</div>
              <div className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  {booking.paymentStatus === 'PAID' ? 'PAID IN FULL' : 'PAYMENT DUE'}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Billing & Service Parties */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Customer Details */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Billed To (Customer)
              </div>
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600">{booking.customerAddress}</div>
              <div className="text-slate-600">Contact: {booking.customerPhone}</div>
              <div className="text-slate-500">City: {booking.customerCity}</div>
            </div>

            {/* Cooperative & Worker Details */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Service Provider & Guild
              </div>
              <div className="font-bold text-slate-900 text-sm">{booking.cooperativeName}</div>
              <div className="text-slate-700">
                Assigned Artisan: <strong>{booking.workerName}</strong>
              </div>
              <div className="text-slate-600">Worker Phone: {booking.workerPhone || 'Provided upon booking'}</div>
              <div className="text-slate-500">Booking Ref: {booking.id}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#0B1D33] text-amber-200 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 text-left">Description</th>
                  <th className="p-2.5 text-left">Category</th>
                  <th className="p-2.5 text-center">Qty / Window</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2.5">
                    <div className="font-semibold text-slate-900">{booking.serviceCategory} Professional Service</div>
                    <div className="text-[11px] text-slate-500">{booking.problemDescription}</div>
                  </td>
                  <td className="p-2.5 font-medium">{booking.serviceCategory}</td>
                  <td className="p-2.5 text-center">{booking.scheduledTimeSlot}</td>
                  <td className="p-2.5 text-right font-semibold">₹{booking.pricing.serviceCharge}.00</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 text-slate-600" colSpan={3}>
                    Cooperative Administrative & Platform Tech Fee (10%)
                  </td>
                  <td className="p-2.5 text-right font-medium text-slate-600">₹{booking.pricing.platformFee}.00</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 text-slate-600" colSpan={3}>
                    Applicable GST (CGST 2% + SGST 2%)
                  </td>
                  <td className="p-2.5 text-right font-medium text-slate-600">₹{booking.pricing.taxes}.00</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-slate-900 bg-slate-100 font-bold text-slate-900">
                <tr>
                  <td className="p-3 text-sm" colSpan={3}>
                    Grand Total
                  </td>
                  <td className="p-3 text-right text-base font-black text-[#0B1D33]">
                    ₹{booking.pricing.totalAmount}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Fair Labor Remittance Notice */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Direct Artisan Remittance:
            </span>
            <span className="font-bold text-amber-950">
              ₹{booking.pricing.workerAmount}.00 (Credited via Cooperative Guild Escrow)
            </span>
          </div>

          {/* Stamp & Signature Footer */}
          <div className="pt-4 flex items-end justify-between text-xs text-slate-500">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-slate-400">
                ||| | ||||| || |||||| | |||| ||| |||||||
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Digitally generated through Apex Union Multi-Guild Network.
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mb-1">
                [COOP SEAL]
              </div>
              <div className="text-[10px] font-bold text-slate-800">Authorized Signatory</div>
              <div className="text-[9px] text-slate-400">{booking.cooperativeName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
