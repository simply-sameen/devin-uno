import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Terminal,
  Smartphone,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  FileText,
  Truck,
  TrendingDown,
  Cpu
} from 'lucide-react';

interface Props {
  onLaunchTerminal: () => void;
  onLaunchCustomer: () => void;
}

export const LandingView: React.FC<Props> = ({ onLaunchTerminal, onLaunchCustomer }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      const customerUrl = `${origin}/customer`;
      QRCode.toCanvas(canvasRef.current, customerUrl, {
        width: 170,
        margin: 1,
        color: {
          dark: '#0a0a0c',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between selection:bg-blue-600/30 overflow-hidden">
      {/* Background Cybernetic Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-base text-white">OMNIPOTENT</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                Track 1
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Autonomous Enterprise Operations Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLaunchCustomer}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 font-medium transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile Customer (/customer)</span>
          </button>
          <button
            onClick={onLaunchTerminal}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch Terminal</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Stark Manifesto & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>KILL THE BUSYWORK • 0s HANDOFF CHURN</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Customers buy from a person. <br />
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                They churn at the handoff.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl">
              When high-value buyers ask for bulk GST tax invoices, 99.99% SLA redlines, emergency replacement transceivers, or split APAC billing—deals stall in backend Slack threads.
              <br /><br />
              <strong className="text-zinc-200">Omnipotent</strong> shadows your frontline human rep with 5 autonomous enterprise roles, generating committed ledger artifacts and whisper drafts in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onLaunchTerminal}
                id="launch-host-terminal-btn"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center space-x-3 shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Terminal className="w-5 h-5 text-blue-200" />
                <span>LAUNCH LIVE HOST TERMINAL ↗</span>
              </button>

              <button
                onClick={onLaunchCustomer}
                id="open-mobile-customer-btn"
                className="px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-emerald-500/40 text-zinc-200 font-semibold text-sm flex items-center justify-center space-x-3 transition-all"
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>OPEN MOBILE CUSTOMER CHAT (/customer)</span>
              </button>
            </div>

            {/* Test Matrix Stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/5 max-w-md">
              <div>
                <p className="text-xl font-mono font-bold text-white">4 / 4</p>
                <p className="text-xs text-zinc-500">Chaos Scenarios</p>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-emerald-400">&lt; 1.2s</p>
                <p className="text-xs text-zinc-500">Artifact Generation</p>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-blue-400">1-Click</p>
                <p className="text-xs text-zinc-500">Human Approval</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile QR Code Card for Judges */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-b from-card to-black p-6 shadow-2xl glass-glow-blue">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Live Judge Mobile Test
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                  Instant Sync
                </span>
              </div>

              {/* QR Code Canvas */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white shadow-inner mb-4">
                <canvas ref={canvasRef} className="rounded" />
                <p className="text-[11px] font-medium text-zinc-800 mt-2">
                  Point phone camera at QR code
                </p>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs text-zinc-300 font-medium">
                  Scan to simulate the Customer on your phone while viewing Host Dashboard on this screen.
                </p>
                <button
                  onClick={onLaunchCustomer}
                  className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-blue-400 hover:text-blue-300 font-medium transition flex items-center justify-center space-x-1.5"
                >
                  <span>Or test in companion tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1.5 hover:border-blue-500/30 transition">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs">
              <FileText className="w-4 h-4" />
              <span>Tax & GST Engine</span>
            </div>
            <p className="text-xs text-zinc-400">
              18% GST, Karnataka intra-state HSN classification, and bulk discount margin checks.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1.5 hover:border-amber-500/30 transition">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Lock className="w-4 h-4" />
              <span>WMS Warehouse Locks</span>
            </div>
            <p className="text-xs text-zinc-400">
              Real-time bin allocations (BLR-WH-4) and 48-hour hardware reservation tokens.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1.5 hover:border-purple-500/30 transition">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Legal SLA Redlines</span>
            </div>
            <p className="text-xs text-zinc-400">
              Automatic risk audits capping 3x liquidated damages to standard 1.5x quarterly fees.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1.5 hover:border-rose-500/30 transition">
            <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
              <Truck className="w-4 h-4" />
              <span>Emergency Dispatch</span>
            </div>
            <p className="text-xs text-zinc-400">
              Zero-hesitation BlueDart Apex Air vouchers for cracked transceivers without return delays.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 px-6 text-center text-xs text-zinc-600">
        OMNIPOTENT • Built from scratch for Track 1: Kill the Busywork • Dual Interface Real-Time Architecture
      </footer>
    </div>
  );
};
