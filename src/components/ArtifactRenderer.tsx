import React from 'react';
import { GSTInvoiceData, StockReservationData, SLARedlineData, DispatchVoucherData } from '../types';
import {
  FileText,
  Shield,
  Truck,
  CheckCircle2,
  Copy,
  Clock,
  ExternalLink,
  MapPin,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  type: 'GST_INVOICE' | 'STOCK_RESERVATION' | 'SLA_REDLINE' | 'DISPATCH_VOUCHER';
  data: any;
  compact?: boolean;
}

export const ArtifactRenderer: React.FC<Props> = ({ type, data, compact = false }) => {
  if (!data) return null;

  if (type === 'GST_INVOICE') {
    const inv = data as GSTInvoiceData;
    return (
      <div className={`rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-card to-zinc-950/80 p-4 shadow-xl ${compact ? 'text-xs' : 'text-sm'}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-wide">{inv.invoiceNumber || 'INV-2026-9812'}</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {inv.status || 'Committed'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">GST Tax Invoice • HSN 998313</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-400">Date: {inv.date || 'Today'}</p>
            <p className="text-[10px] text-zinc-400">Due: {inv.dueDate || 'Net 15'}</p>
          </div>
        </div>

        {/* Customer & Tax Details */}
        <div className="grid grid-cols-2 gap-2 mb-3 bg-black/30 p-2.5 rounded-lg border border-white/5">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-medium">Billed To</p>
            <p className="font-semibold text-zinc-200 truncate">{inv.company}</p>
            <p className="text-[10px] text-zinc-400 font-mono">GSTIN: {inv.gstin}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-400 uppercase font-medium">Tax Region</p>
            <p className="text-zinc-200 text-xs">Karnataka (Intra-State)</p>
            <p className="text-[10px] text-emerald-400 font-mono">CGST 9% + SGST 9%</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-[11px] font-medium text-zinc-400 px-1">
            <span>Description</span>
            <span>Taxable</span>
          </div>
          {(inv.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs bg-white/[0.02] p-2 rounded border border-white/5">
              <div>
                <p className="font-medium text-zinc-200">{item.description}</p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Qty: {item.qty} × ₹{item.unitPrice.toLocaleString()} {item.discountPercent > 0 && <span className="text-amber-400">(-{item.discountPercent}%)</span>}
                </p>
              </div>
              <p className="font-semibold text-zinc-200 font-mono">₹{item.taxableAmount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="border-t border-white/10 pt-2.5 space-y-1 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span className="font-mono">₹{(inv.subtotal || 3500000).toLocaleString()}</span>
          </div>
          {inv.discountTotal > 0 && (
            <div className="flex justify-between text-amber-400">
              <span>Bulk Discount Override</span>
              <span className="font-mono">-₹{(inv.discountTotal || 420000).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400">
            <span>CGST (9%) + SGST (9%)</span>
            <span className="font-mono">₹{((inv.cgst || 0) + (inv.sgst || 0)).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/10">
            <span className="text-blue-400">Grand Total ({inv.currency || 'INR'})</span>
            <span className="font-mono text-emerald-400">₹{(inv.totalAmount || 3634400).toLocaleString()}</span>
          </div>
        </div>

        {/* Warehouse Link Badge */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center space-x-1.5 text-blue-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Bin BLR-WH-4 Allocated</span>
          </span>
          <span className="font-mono text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">
            RES-9812-BLR
          </span>
        </div>
      </div>
    );
  }

  if (type === 'SLA_REDLINE') {
    const sla = data as SLARedlineData;
    return (
      <div className={`rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-card to-zinc-950/80 p-4 shadow-xl ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-wide">{sla.documentId || 'MSA-2026-REDLINE-44'}</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {sla.approvalStatus || 'GC Approved'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">{sla.contractTitle}</p>
            </div>
          </div>
        </div>

        {/* Clause Redline Diff */}
        <div className="space-y-2 mb-3 bg-black/40 p-3 rounded-lg border border-white/5">
          <p className="text-[11px] font-semibold text-purple-300">{sla.clauseId}</p>
          <div className="text-xs p-2 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300 line-through">
            {sla.originalText}
          </div>
          <div className="text-xs p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-start space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
            <span>{sla.redlinedText}</span>
          </div>
        </div>

        {/* Risk Assessment & Liability Cap */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.02] p-2.5 rounded border border-white/5">
          <div>
            <p className="text-zinc-400 font-medium uppercase text-[10px]">Liability Cap</p>
            <p className="text-emerald-400 font-semibold">{sla.liabilityCap}</p>
          </div>
          <div>
            <p className="text-zinc-400 font-medium uppercase text-[10px]">Governing Law</p>
            <p className="text-zinc-300 truncate">{sla.governingLaw}</p>
          </div>
        </div>

        {/* Generated API Credential Box */}
        <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider">Staging Cluster Token</p>
            <code className="text-xs font-mono text-cyan-200">omni_live_k8s_9999_7f8a9</code>
          </div>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText('omni_live_k8s_9999_7f8a9');
              }
            }}
            className="p-1.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition"
            title="Copy API Token"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'DISPATCH_VOUCHER') {
    const dsp = data as DispatchVoucherData;
    return (
      <div className={`rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-card to-zinc-950/80 p-4 shadow-xl ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-wide">{dsp.voucherId || 'DSP-EXP-2026-081'}</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  {dsp.priorityLevel || 'Critical Hot-Swap'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Emergency Replacement • {dsp.incidentRef}</p>
            </div>
          </div>
        </div>

        {/* Carrier & Waybill */}
        <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 mb-3 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Air Carrier:</span>
            <span className="font-semibold text-white">{dsp.carrier}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Airway Bill (AWB):</span>
            <span className="font-mono text-cyan-400 font-bold">{dsp.airwayBill}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Estimated Delivery:</span>
            <span className="text-emerald-400 font-bold">{dsp.estimatedDelivery}</span>
          </div>
        </div>

        {/* Route visualization */}
        <div className="flex items-center justify-between text-[11px] bg-white/[0.02] p-2 rounded mb-3 border border-white/5">
          <div className="flex items-center space-x-1 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[110px]">{dsp.originHub}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          <div className="flex items-center space-x-1 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[110px]">Hyderabad DC</span>
          </div>
        </div>

        {/* Replaced item summary */}
        <div className="text-xs bg-zinc-900/60 p-2 rounded border border-white/5">
          <p className="text-zinc-300 font-medium">40x 100G Optical Transceiver Module (Single-Mode)</p>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
            Serial Block: SN-SEC-9101 to SN-SEC-9140 • QA Passed
          </p>
        </div>
      </div>
    );
  }

  // Stock Reservation Fallback
  const stk = data as StockReservationData;
  return (
    <div className={`rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-card to-zinc-950/80 p-4 shadow-xl ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">{stk.reservationId || 'RES-9812-BLR'}</span>
            <p className="text-[11px] text-zinc-400">Warehouse Bin Lock • {stk.facility}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] uppercase font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {stk.lockStatus || 'Firm Allocated'}
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-400">Bin Location:</span>
          <span className="font-mono text-white font-bold">{stk.binLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Locked Units:</span>
          <span className="font-mono text-emerald-400 font-bold">{stk.lockedQuantity}</span>
        </div>
      </div>
    </div>
  );
};
