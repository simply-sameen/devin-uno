import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, ExternalLink, Smartphone, Copy, Check, Wifi } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [customHost, setCustomHost] = useState('');

  // Default customer URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const customerPath = '/customer';
  const currentUrl = customHost.trim()
    ? (customHost.startsWith('http') ? customHost : `http://${customHost}`) + customerPath
    : `${origin}${customerPath}`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, currentUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error('QR code generation error:', err);
      });
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenTab = () => {
    window.open(`${origin}/customer`, '_blank', 'width=420,height=800,menubar=no,toolbar=no');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1017] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Judge Mobile Chat View</h3>
            <p className="text-xs text-zinc-400">Scan with your phone camera or launch simulator</p>
          </div>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center my-4 p-4 rounded-xl bg-white border border-zinc-200">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
          <span className="text-[11px] text-zinc-500 mt-2 font-mono font-medium">
            Scan to open mobile customer interface
          </span>
        </div>

        {/* Local Network IP note */}
        <div className="mb-4 bg-zinc-900/80 p-3 rounded-lg border border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-zinc-300">
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>LAN Mobile Testing (Same Wi-Fi network):</span>
          </div>
          <input
            type="text"
            value={customHost}
            onChange={(e) => setCustomHost(e.target.value)}
            placeholder={`e.g. 192.168.1.45:5173 (optional)`}
            className="w-full px-3 py-1.5 text-xs bg-black/50 border border-white/10 rounded text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleOpenTab}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Mobile View in Companion Window</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center space-x-2 transition border border-white/5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Mobile Chat Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
