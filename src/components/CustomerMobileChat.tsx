import React, { useState, useEffect, useRef } from 'react';
import {
  OmnipotentMessage,
  OmnipotentSession,
  PlatformType,
  ArtifactType
} from '../types';
import { syncService } from '../lib/supabase';
import {
  SCENARIO_PRESETS,
  processCustomerMessageWithOmnipotent
} from '../lib/omnipotentEngine';
import { ArtifactRenderer } from './ArtifactRenderer';
import {
  Send,
  Sparkles,
  Smartphone,
  CheckCheck,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  onBackToHost?: () => void;
}

export const CustomerMobileChat: React.FC<Props> = ({ onBackToHost }) => {
  const [messages, setMessages] = useState<OmnipotentMessage[]>([]);
  const [session, setSession] = useState<OmnipotentSession | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncState, setSyncState] = useState(syncService.getConnectionState());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubMessages = syncService.subscribeToMessages((newMsgs) => {
      setMessages(newMsgs);
    });
    const unsubSession = syncService.subscribeToSession((s) => {
      setSession(s);
    });

    return () => {
      unsubMessages();
      unsubSession();
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Scenario Pills Quick Tap
  const handleTriggerScenario = async (scenarioKey: string) => {
    const scenario = SCENARIO_PRESETS[scenarioKey];
    if (!scenario || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Send customer message
      const customerMsg = await syncService.sendMessage({
        sender: 'Vikram Malhotra',
        sender_type: 'customer',
        role: 'customer',
        text: scenario.customerMessage,
        platform: scenario.platform,
        status: 'delivered',
      });

      // 2. Add backend execution logs to the shared bus so host dashboard immediately animates
      for (const log of scenario.executionLogs) {
        await syncService.addExecutionLog(log);
      }

      // 3. Update session platform if needed
      await syncService.updateSessionPlatform(scenario.platform);

      // 4. Trigger Omnipotent Engine generation on the host side
      // The host will see the draft reply and artifact in the Whisper Copilot!
    } catch (err) {
      console.error('Scenario trigger error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manual customer message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const text = inputText.trim();
    setInputText('');
    setIsSubmitting(true);

    try {
      // 1. Send customer message to sync service
      await syncService.sendMessage({
        sender: 'Vikram Malhotra',
        sender_type: 'customer',
        role: 'customer',
        text: text,
        platform: session?.platform || 'whatsapp',
        status: 'delivered',
      });

      // 2. Process with Omnipotent engine to seed shadow role logs
      const result = await processCustomerMessageWithOmnipotent(text);
      for (const log of result.executionLogs) {
        await syncService.addExecutionLog(log);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex justify-center selection:bg-blue-600/30">
      {/* Mobile viewport container */}
      <div className="w-full max-w-md bg-[#0B0B0E] border-x border-white/5 flex flex-col h-screen shadow-2xl relative">
        
        {/* Mobile Header (WhatsApp / Slack style) */}
        <div className="bg-[#12141C] border-b border-white/10 px-4 py-3 flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (onBackToHost) {
                  onBackToHost();
                } else {
                  window.location.href = '/?mode=terminal';
                }
              }}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
              title="Return to Host Terminal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Rep Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-sm text-white border border-white/20">
                S
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#12141C]" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm text-zinc-100">Sameen</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                <span>Omnipotent Dedicated Lead</span>
                <span>• Online</span>
              </p>
            </div>
          </div>

          {/* Quick link to Host Terminal */}
          <button
            onClick={() => {
              window.location.href = '/?mode=terminal';
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium flex items-center space-x-1 transition"
          >
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>Host View</span>
          </button>
        </div>

        {/* 4 Chaos Scenario Quick-Tap Pills Bar */}
        <div className="bg-[#0f1118] border-b border-white/10 px-3 py-2 z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Tap 1-Click Chaos Scenarios</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Mobile Judge Mode</span>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {Object.values(SCENARIO_PRESETS).map((s) => (
              <button
                key={s.id}
                onClick={() => handleTriggerScenario(s.id)}
                disabled={isSubmitting}
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] active:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 text-[11px] font-medium text-zinc-200 transition flex items-center space-x-1 shadow-sm"
              >
                <span>{s.pillTitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dot-pattern bg-[length:16px_16px]">
          {/* Welcome Info Box */}
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl text-center space-y-1">
            <p className="text-xs font-semibold text-zinc-300">
              Welcome to the Judge Mobile View
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Type any high-friction enterprise request below or tap a scenario pill. Watch the laptop Host Dashboard process and return approved artifacts in real time!
            </p>
          </div>

          {/* Render Messages */}
          {messages.map((msg) => {
            const isCustomer = msg.sender_type === 'customer' || msg.role === 'customer';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Tag */}
                <div className="flex items-center space-x-1 text-[10px] text-zinc-500 mb-1 px-1">
                  <span>{isCustomer ? 'You (Vikram - Krypton)' : msg.sender}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                    isCustomer
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#181b24] text-zinc-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                  </div>
                </div>

                {/* Attached Artifact (if generated & approved) */}
                {msg.artifact_data && msg.artifact_type && (
                  <div className="w-full max-w-[95%] mt-2.5">
                    <ArtifactRenderer type={msg.artifact_type} data={msg.artifact_data} compact={true} />
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#12141C] border-t border-white/10 p-3 z-20">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type chaos message (e.g. 50 units in Tokyo)..."
              disabled={isSubmitting}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Sync Status Footer */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 px-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{syncState.provider}</span>
            </span>
            <span>Real-time Multi-Tab Sync</span>
          </div>
        </div>

      </div>
    </div>
  );
};
