import React, { useState, useEffect, useRef } from 'react';
import {
  OmnipotentMessage,
  OmnipotentSession,
  BackendRoleStatus,
  ExecutionLog,
  PlatformType,
  ArtifactType
} from '../types';
import { syncService } from '../lib/supabase';
import {
  SCENARIO_PRESETS,
  DEFAULT_BACKEND_ROLES,
  processCustomerMessageWithOmnipotent
} from '../lib/omnipotentEngine';
import { ArtifactRenderer } from './ArtifactRenderer';
import { QRCodeModal } from './QRCodeModal';
import {
  Terminal,
  Cpu,
  Smartphone,
  QrCode,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Truck,
  Package,
  Receipt,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Lock,
  Layers,
  ArrowRight,
  Database,
  Radio
} from 'lucide-react';

interface Props {
  onBackToLanding?: () => void;
  onOpenCustomer?: () => void;
}

export const HostDashboard: React.FC<Props> = ({ onBackToLanding, onOpenCustomer }) => {
  const [messages, setMessages] = useState<OmnipotentMessage[]>([]);
  const [session, setSession] = useState<OmnipotentSession | null>(null);
  const [roles, setRoles] = useState<BackendRoleStatus[]>(DEFAULT_BACKEND_ROLES);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformType>('whatsapp');

  // Whisper Copilot state
  const [activeArtifactType, setActiveArtifactType] = useState<ArtifactType>('GST_INVOICE');
  const [activeArtifactData, setActiveArtifactData] = useState<any>(SCENARIO_PRESETS.scenario_gst_stock.initialArtifactData);
  const [draftReplyText, setDraftReplyText] = useState<string>(SCENARIO_PRESETS.scenario_gst_stock.draftReply);
  const [isApproving, setIsApproving] = useState(false);
  const [lastCommittedId, setLastCommittedId] = useState<string | null>(null);

  // Manual host message input
  const [manualHostMessage, setManualHostMessage] = useState('');

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const syncState = syncService.getConnectionState();

  // Subscriptions to Real-Time Sync Service
  useEffect(() => {
    const unsubMessages = syncService.subscribeToMessages((newMsgs) => {
      setMessages(newMsgs);

      // Auto-inspect latest incoming customer message to populate Whisper Copilot
      const latestCustomerMsg = [...newMsgs].reverse().find(m => m.sender_type === 'customer' || m.role === 'customer');
      if (latestCustomerMsg) {
        processCustomerMessageWithOmnipotent(latestCustomerMsg.text).then(res => {
          setActiveArtifactType(res.artifactType);
          setActiveArtifactData(res.artifactData);
          setDraftReplyText(res.draftReply);
        });
      }
    });

    const unsubSession = syncService.subscribeToSession((s) => {
      setSession(s);
      if (s?.platform) setActivePlatform(s.platform);
    });

    const unsubLogs = syncService.subscribeToExecutions((logs) => {
      setExecutionLogs(logs);

      // Update role statuses based on recent logs
      if (logs.length > 0) {
        setRoles(prevRoles => prevRoles.map(r => {
          const matchingLog = logs.find(l => l.role.toLowerCase().includes(r.id) || l.role.toLowerCase().includes(r.title.toLowerCase()));
          if (matchingLog) {
            return {
              ...r,
              status: 'executing',
              lastAction: matchingLog.action,
              lastTimestamp: matchingLog.timestamp,
            };
          }
          return r;
        }));
      }
    });

    return () => {
      unsubMessages();
      unsubSession();
      unsubLogs();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle switching platforms
  const handlePlatformSwitch = async (platform: PlatformType) => {
    setActivePlatform(platform);
    await syncService.updateSessionPlatform(platform);
  };

  // Trigger one of the 4 Presets from Host Terminal
  const handleTriggerPreset = async (presetKey: string) => {
    const scenario = SCENARIO_PRESETS[presetKey];
    if (!scenario) return;

    // 1. Send customer message simulating inbound request
    await syncService.sendMessage({
      sender: 'Vikram Malhotra',
      sender_type: 'customer',
      role: 'customer',
      text: scenario.customerMessage,
      platform: scenario.platform,
      status: 'delivered',
    });

    // 2. Load artifact & whisper draft
    setActiveArtifactType(scenario.artifactType);
    setActiveArtifactData(scenario.initialArtifactData);
    setDraftReplyText(scenario.draftReply);
    setActivePlatform(scenario.platform);

    // 3. Add execution logs to shared bus
    for (const log of scenario.executionLogs) {
      await syncService.addExecutionLog(log);
    }
  };

  // 1-Click [ APPROVE, COMMIT & SEND TO CUSTOMER ]
  const handleApproveAndSend = async () => {
    if (isApproving) return;
    setIsApproving(true);

    try {
      // 1. Commit and mark artifact status as committed
      const committedArtifact = {
        ...activeArtifactData,
        status: activeArtifactType === 'GST_INVOICE' ? 'Committed to SAP ERP' :
                activeArtifactType === 'SLA_REDLINE' ? 'Executed' :
                'Dispatched',
      };

      // 2. Send rep message with attached rich artifact to customer stream
      const repMsg = await syncService.sendMessage({
        sender: 'Sameen (Lead Rep)',
        sender_type: 'rep',
        role: 'assistant',
        text: draftReplyText,
        platform: activePlatform,
        status: 'approved',
        artifact_type: activeArtifactType,
        artifact_data: committedArtifact,
      });

      // 3. Add audit log
      await syncService.addExecutionLog({
        id: `commit-${Date.now()}`,
        role: 'Frontline Rep',
        action: 'Human Approval & ERP Commit',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        details: `Approved by Sameen. Ledger write committed & dispatched to customer via ${activePlatform}.`,
      });

      // 4. Update roles status to committed
      setRoles(prev => prev.map(r => ({ ...r, status: 'committed' })));
      setLastCommittedId(repMsg.id);

      // Short animation timeout
      setTimeout(() => {
        setIsApproving(false);
      }, 500);
    } catch (err) {
      console.error('Approve and send error:', err);
      setIsApproving(false);
    }
  };

  // Reset / Clear Demo
  const handleResetDemo = async () => {
    if (confirm('Reset messages and clear execution logs to start a fresh demo?')) {
      await syncService.clearDemoMessages();
      setRoles(DEFAULT_BACKEND_ROLES);
      setActiveArtifactType('GST_INVOICE');
      setActiveArtifactData(SCENARIO_PRESETS.scenario_gst_stock.initialArtifactData);
      setDraftReplyText(SCENARIO_PRESETS.scenario_gst_stock.draftReply);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      
      {/* Top Bar Navigation */}
      <header className="h-14 border-b border-white/10 bg-[#0e1017] px-4 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-sm text-white">OMNIPOTENT</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                HOST TERMINAL
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Autonomous Enterprise Delegation Engine</p>
          </div>
        </div>

        {/* Center: Multi-Platform Switcher */}
        <div className="hidden md:flex items-center bg-black/50 p-1 rounded-xl border border-white/10 space-x-1">
          {(['whatsapp', 'slack', 'email'] as PlatformType[]).map((p) => {
            const isActive = activePlatform === p;
            return (
              <button
                key={p}
                onClick={() => handlePlatformSwitch(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span>{p}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Right: Sync Status, QR Code Modal & Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Sync indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-zinc-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate max-w-[140px]">{syncState.provider}</span>
          </div>

          {/* QR Code / Mobile View button */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            id="host-open-qr-modal-btn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mobile View (Scan QR)</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={handleResetDemo}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
            title="Reset Session & Clear Logs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Return to Landing */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* Main 3-Panel Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-3.5rem)]">
        
        {/* ======================================================== */}
        {/* LEFT PANEL (Col 3): Role Delegation Matrix & Live Logs   */}
        {/* ======================================================== */}
        <aside className="lg:col-span-3 border-r border-white/10 bg-[#0B0C10] flex flex-col overflow-hidden">
          
          {/* Matrix Header */}
          <div className="p-3 border-b border-white/10 bg-[#0f1118] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Role Delegation Matrix
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">5 Shadow Roles</span>
          </div>

          {/* Active Roles List */}
          <div className="p-3 space-y-2 overflow-y-auto max-h-[48%] border-b border-white/10">
            {roles.map((role) => {
              const isFrontline = role.id === 'frontline';
              const isExec = role.status === 'executing';
              const isComm = role.status === 'committed';

              return (
                <div
                  key={role.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isFrontline
                      ? 'bg-blue-950/20 border-blue-500/30'
                      : isExec
                      ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/20'
                      : isComm
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isExec ? 'bg-amber-400 animate-ping' :
                        isComm ? 'bg-emerald-400' :
                        'bg-zinc-600'
                      }`} />
                      <span className="text-xs font-bold text-white">{role.title}</span>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-zinc-400">
                      {role.metric}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-medium truncate">{role.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{role.lastAction}</p>
                </div>
              );
            })}
          </div>

          {/* Real-Time Execution Log Ticker */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#07080c]">
            <div className="px-3 py-2 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Live Backend Ledger Ticker
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">● Sub-Second</span>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto font-mono text-[11px]">
              {executionLogs.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 text-xs">
                  Awaiting role delegation trigger...
                </div>
              ) : (
                executionLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-blue-400">{log.role}</span>
                      <span className="text-zinc-500">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-200 font-sans font-medium text-xs">{log.action}</p>
                    <p className="text-zinc-400 font-sans text-[10px] leading-tight">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* CENTER PANEL (Col 5): Live Customer Message Stream       */}
        {/* ======================================================== */}
        <main className="lg:col-span-5 flex flex-col bg-[#08090D] border-r border-white/10 overflow-hidden">
          
          {/* Conversation Header */}
          <div className="p-3 border-b border-white/10 bg-[#0f1118] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                V
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-white">Vikram Malhotra</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-semibold">VIP Tier 1</span>
                </div>
                <p className="text-[10px] text-zinc-400">Krypton Technologies Ltd • Active via {activePlatform.toUpperCase()}</p>
              </div>
            </div>

            <button
              onClick={() => setIsQRModalOpen(true)}
              className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 font-medium flex items-center space-x-1 transition"
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Simulate Mobile</span>
            </button>
          </div>

          {/* Quick Scenario Triggers Bar (for rapid judge demo) */}
          <div className="bg-[#12141d] px-3 py-2 border-b border-white/5 flex items-center space-x-2 overflow-x-auto shrink-0 no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0">Test Scenarios:</span>
            {Object.values(SCENARIO_PRESETS).map((s) => (
              <button
                key={s.id}
                onClick={() => handleTriggerPreset(s.id)}
                className="shrink-0 px-2 py-1 rounded bg-white/[0.04] hover:bg-blue-600/20 hover:border-blue-500/40 border border-white/10 text-[11px] font-medium text-zinc-300 transition"
              >
                {s.pillTitle}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dot-pattern bg-[length:20px_20px]">
            {messages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer' || msg.role === 'customer';

              return (
                <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                  {/* Sender Tag */}
                  <div className="flex items-center space-x-1 text-[10px] text-zinc-500 mb-1 px-1">
                    <span className="font-semibold">{msg.sender}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    <span>•</span>
                    <span className="uppercase text-[9px]">{msg.platform}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                      isCustomer
                        ? 'bg-[#161822] text-zinc-100 border border-white/10 rounded-tl-none'
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex justify-end items-center space-x-1 mt-1 text-[9px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {!isCustomer && <CheckCircle2 className="w-3 h-3 text-cyan-200" />}
                    </div>
                  </div>

                  {/* Attached Rich Artifact Card */}
                  {msg.artifact_data && msg.artifact_type && (
                    <div className="w-full max-w-[90%] mt-3">
                      <ArtifactRenderer type={msg.artifact_type} data={msg.artifact_data} />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatScrollRef} />
          </div>

          {/* Manual Host Reply Bar (in case Sameen wants to send custom message) */}
          <div className="p-3 border-t border-white/10 bg-[#0e1017] shrink-0">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!manualHostMessage.trim()) return;
                const txt = manualHostMessage.trim();
                setManualHostMessage('');
                await syncService.sendMessage({
                  sender: 'Sameen (Lead Rep)',
                  sender_type: 'rep',
                  role: 'assistant',
                  text: txt,
                  platform: activePlatform,
                  status: 'delivered',
                });
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={manualHostMessage}
                onChange={(e) => setManualHostMessage(e.target.value)}
                placeholder="Type direct response to customer..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!manualHostMessage.trim()}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-semibold disabled:opacity-40 transition"
              >
                Send
              </button>
            </form>
          </div>
        </main>

        {/* ======================================================== */}
        {/* RIGHT PANEL (Col 4): Omnipotent Whisper Copilot          */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 bg-[#0c0d13] flex flex-col overflow-hidden">
          
          {/* Copilot Header */}
          <div className="p-3 border-b border-white/10 bg-[#12141e] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Omnipotent Whisper Copilot
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Artifact Ready
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* 1. Editable Work Artifact Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Synthesized Work Artifact</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Editable Preview</span>
              </div>

              {/* Render Artifact in Preview Mode */}
              <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg bg-black/30">
                <ArtifactRenderer type={activeArtifactType} data={activeArtifactData} />
              </div>
            </div>

            {/* 2. Tone-Matched Draft Reply */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tone-Matched Whisper Draft</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Rep Delivery Voice</span>
              </div>

              <textarea
                rows={4}
                value={draftReplyText}
                onChange={(e) => setDraftReplyText(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            {/* 3. Action Commit Button */}
            <div className="pt-2">
              <button
                onClick={handleApproveAndSend}
                disabled={isApproving}
                id="approve-commit-send-btn"
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2.5 shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{isApproving ? 'COMMITTING TO ERP & SENDING...' : 'APPROVE, COMMIT & SEND TO CUSTOMER ↗'}</span>
              </button>

              <p className="text-[10px] text-center text-zinc-500 mt-2 font-mono">
                1-Click executes ERP ledger update, WMS bin locks & instant mobile transmission.
              </p>
            </div>

          </div>
        </aside>

      </div>

      {/* QR Code Modal for Judge Mobile Testing */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};
