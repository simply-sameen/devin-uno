import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OmnipotentSession, OmnipotentMessage, ExecutionLog, PlatformType } from '../types';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Default demo session
export const DEFAULT_SESSION_ID = 'session-omni-live-01';

export const INITIAL_DEFAULT_SESSION: OmnipotentSession = {
  id: DEFAULT_SESSION_ID,
  customer_name: 'Vikram Malhotra',
  company: 'Krypton Technologies Ltd',
  platform: 'whatsapp',
  status: 'active',
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_SEED_MESSAGES: OmnipotentMessage[] = [
  {
    id: 'msg-seed-1',
    session_id: DEFAULT_SESSION_ID,
    sender: 'Vikram Malhotra',
    sender_type: 'customer',
    role: 'customer',
    text: 'Hey Sameen! Our tech review just approved moving ahead with the enterprise tier.',
    timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    platform: 'whatsapp',
    status: 'delivered',
  },
  {
    id: 'msg-seed-2',
    session_id: DEFAULT_SESSION_ID,
    sender: 'Sameen (Omnipotent Lead)',
    sender_type: 'rep',
    role: 'assistant',
    text: 'Fantastic news Vikram! Ready on our end to turn this around immediately.',
    timestamp: new Date(Date.now() - 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    platform: 'whatsapp',
    status: 'delivered',
  },
];

// Initialize Supabase Client safely
let supabase: SupabaseClient | null = null;
let isRealSupabase = false;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isRealSupabase = true;
  }
} catch (err) {
  console.warn('Supabase initialization failed, falling back to Local Real-Time Mesh:', err);
  supabase = null;
  isRealSupabase = false;
}

export { supabase };

// Multi-Tab & Cross-Device Sync Channel using BroadcastChannel API
const broadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('omnipotent_realtime_sync')
  : null;

// LocalStorage Keys
const STORAGE_KEYS = {
  SESSIONS: 'omnipotent_sessions',
  MESSAGES: 'omnipotent_messages',
  EXECUTIONS: 'omnipotent_executions',
  ACTIVE_SESSION: 'omnipotent_active_session_id',
};

// Listeners set
type MessageListener = (messages: OmnipotentMessage[]) => void;
type SessionListener = (session: OmnipotentSession) => void;
type ExecutionListener = (logs: ExecutionLog[]) => void;

const messageListeners = new Set<MessageListener>();
const sessionListeners = new Set<SessionListener>();
const executionListeners = new Set<ExecutionListener>();

// Helper to broadcast changes
function notifyLocalListeners(type: 'messages' | 'session' | 'executions', payload?: any) {
  if (type === 'messages') {
    const msgs = getStoredMessages();
    messageListeners.forEach(listener => listener(msgs));
  } else if (type === 'session') {
    const session = getStoredSession();
    sessionListeners.forEach(listener => listener(session));
  } else if (type === 'executions') {
    const logs = getStoredExecutions();
    executionListeners.forEach(listener => listener(logs));
  }

  // Broadcast to other tabs
  if (broadcast) {
    try {
      broadcast.postMessage({ type, payload, timestamp: Date.now() });
    } catch {
      // Ignore broadcast errors
    }
  }
}

// Setup Cross-Tab Listeners
if (typeof window !== 'undefined') {
  if (broadcast) {
    broadcast.onmessage = (event) => {
      const { type } = event.data || {};
      if (type === 'messages') {
        const msgs = getStoredMessages();
        messageListeners.forEach(l => l(msgs));
      } else if (type === 'session') {
        const sess = getStoredSession();
        sessionListeners.forEach(l => l(sess));
      } else if (type === 'executions') {
        const logs = getStoredExecutions();
        executionListeners.forEach(l => l(logs));
      }
    };
  }

  // Also listen for storage events as fallback for browsers/sub-windows
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.MESSAGES) {
      const msgs = getStoredMessages();
      messageListeners.forEach(l => l(msgs));
    } else if (e.key === STORAGE_KEYS.SESSIONS) {
      const sess = getStoredSession();
      sessionListeners.forEach(l => l(sess));
    } else if (e.key === STORAGE_KEYS.EXECUTIONS) {
      const logs = getStoredExecutions();
      executionListeners.forEach(l => l(logs));
    }
  });
}

// Local Storage Accessors
function getStoredMessages(): OmnipotentMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_SEED_MESSAGES));
      return INITIAL_SEED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEED_MESSAGES;
  }
}

function getStoredSession(): OmnipotentSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_DEFAULT_SESSION));
      return INITIAL_DEFAULT_SESSION;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEFAULT_SESSION;
  }
}

function getStoredExecutions(): ExecutionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXECUTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Public Real-Time Sync API
export const syncService = {
  getConnectionState() {
    return {
      isSupabase: isRealSupabase,
      status: isRealSupabase ? 'connected' : 'local_mesh_active',
      provider: isRealSupabase ? 'Supabase Cloud (PostgreSQL)' : 'Zero-Latency Local Mesh (Multi-Tab/Window)',
    };
  },

  async getSession(sessionId: string = DEFAULT_SESSION_ID): Promise<OmnipotentSession> {
    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('omnipotent_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();
        if (!error && data) return data as OmnipotentSession;
      } catch (err) {
        console.warn('Supabase getSession fallback to local:', err);
      }
    }
    return getStoredSession();
  },

  async updateSessionPlatform(platform: PlatformType): Promise<OmnipotentSession> {
    const current = getStoredSession();
    const updated = { ...current, platform, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));

    if (isRealSupabase && supabase) {
      try {
        await supabase
          .from('omnipotent_sessions')
          .upsert(updated);
      } catch (err) {
        console.warn('Supabase updateSession error:', err);
      }
    }

    notifyLocalListeners('session', updated);
    return updated;
  },

  async getMessages(sessionId: string = DEFAULT_SESSION_ID): Promise<OmnipotentMessage[]> {
    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('omnipotent_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true });
        if (!error && data && data.length > 0) return data as OmnipotentMessage[];
      } catch (err) {
        console.warn('Supabase getMessages fallback to local:', err);
      }
    }
    return getStoredMessages();
  },

  async sendMessage(message: Omit<OmnipotentMessage, 'id' | 'timestamp' | 'session_id'> & { id?: string; timestamp?: string; session_id?: string }): Promise<OmnipotentMessage> {
    const fullMessage: OmnipotentMessage = {
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      session_id: message.session_id || DEFAULT_SESSION_ID,
      sender: message.sender,
      sender_type: message.sender_type,
      role: message.role,
      text: message.text,
      timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      platform: message.platform || 'whatsapp',
      status: message.status || 'delivered',
      artifact_type: message.artifact_type || null,
      artifact_data: message.artifact_data || null,
    };

    // Store in localStorage
    const current = getStoredMessages();
    const updated = [...current, fullMessage];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

    // Send to Supabase if configured
    if (isRealSupabase && supabase) {
      try {
        await supabase.from('omnipotent_messages').insert([fullMessage]);
      } catch (err) {
        console.warn('Supabase insert message error:', err);
      }
    }

    notifyLocalListeners('messages', fullMessage);
    return fullMessage;
  },

  async updateMessageArtifact(messageId: string, artifactData: any, status: 'approved' | 'delivered' = 'approved') {
    const current = getStoredMessages();
    const updated = current.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          artifact_data: artifactData,
          status,
        };
      }
      return msg;
    });

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

    if (isRealSupabase && supabase) {
      try {
        await supabase
          .from('omnipotent_messages')
          .update({ artifact_data: artifactData, status })
          .eq('id', messageId);
      } catch (err) {
        console.warn('Supabase update message error:', err);
      }
    }

    notifyLocalListeners('messages', updated);
  },

  async clearDemoMessages() {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_SEED_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify([]));

    if (isRealSupabase && supabase) {
      try {
        await supabase.from('omnipotent_messages').delete().neq('id', '');
        await supabase.from('omnipotent_executions').delete().neq('id', '');
      } catch (err) {
        console.warn('Supabase clear messages error:', err);
      }
    }

    notifyLocalListeners('messages', INITIAL_SEED_MESSAGES);
    notifyLocalListeners('executions', []);
  },

  async getExecutionLogs(): Promise<ExecutionLog[]> {
    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('omnipotent_executions')
          .select('*')
          .order('timestamp', { ascending: false });
        if (!error && data) return data as ExecutionLog[];
      } catch (err) {
        console.warn('Supabase getExecutionLogs error:', err);
      }
    }
    return getStoredExecutions();
  },

  async addExecutionLog(log: ExecutionLog) {
    const current = getStoredExecutions();
    const updated = [log, ...current].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(updated));

    if (isRealSupabase && supabase) {
      try {
        await supabase.from('omnipotent_executions').insert([log]);
      } catch (err) {
        console.warn('Supabase insert execution log error:', err);
      }
    }

    notifyLocalListeners('executions', updated);
  },

  subscribeToMessages(callback: MessageListener): () => void {
    messageListeners.add(callback);
    // Initial emission
    callback(getStoredMessages());

    // Supabase Realtime channel subscription if active
    let supabaseChannel: any = null;
    if (isRealSupabase && supabase) {
      try {
        supabaseChannel = supabase
          .channel('public:omnipotent_messages')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'omnipotent_messages' }, () => {
            this.getMessages().then(msgs => callback(msgs));
          })
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime channel failed:', err);
      }
    }

    return () => {
      messageListeners.delete(callback);
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  },

  subscribeToSession(callback: SessionListener): () => void {
    sessionListeners.add(callback);
    callback(getStoredSession());
    return () => {
      sessionListeners.delete(callback);
    };
  },

  subscribeToExecutions(callback: ExecutionListener): () => void {
    executionListeners.add(callback);
    callback(getStoredExecutions());
    return () => {
      executionListeners.delete(callback);
    };
  },
};
