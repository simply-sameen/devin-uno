import {
  ScenarioDefinition,
  GSTInvoiceData,
  StockReservationData,
  SLARedlineData,
  DispatchVoucherData,
  ExecutionLog,
  ArtifactType,
  BackendRoleStatus
} from '../types';

// The 4 Presets specified by Omnipotent Track 1
export const SCENARIO_PRESETS: Record<string, ScenarioDefinition> = {
  scenario_gst_stock: {
    id: 'scenario_gst_stock',
    title: 'Scenario 1: GST Invoice + Stock Lock',
    pillTitle: '⚡ 250 Nodes + 18% GST',
    subtitle: 'Finance tax engine + warehouse bin allocation in < 2 seconds',
    badge: 'Finance & WMS',
    platform: 'whatsapp',
    customerMessage: 'Hey Sameen, our procurement approved the 250 Enterprise Node licenses with 18% GST invoice. Need 12% bulk discount locked in bin BLR-WH-4 today.',
    draftReply: 'Hi Vikram, I have prepared your approved tax invoice (INV-2026-9812) reflecting the 12% enterprise tier discount and 18% GST breakdown. Our warehouse team has already locked 250 units in Bin BLR-WH-4 under reservation RES-9812-BLR for the next 48 hours. Please review the invoice card below.',
    artifactType: 'GST_INVOICE',
    initialArtifactData: {
      invoiceNumber: 'INV-2026-9812',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      customerName: 'Vikram Malhotra',
      company: 'Krypton Technologies Ltd',
      gstin: '29AABCK1234F1Z8',
      billingAddress: 'Tower B, Tech Park, Outer Ring Rd, Bengaluru, Karnataka 560103',
      items: [
        {
          description: 'Omnipotent Enterprise Compute Node (1-Yr Term)',
          hsnCode: '998313',
          qty: 250,
          unitPrice: 12500,
          discountPercent: 12,
          taxableAmount: 2750000,
        },
        {
          description: 'Dedicated Cluster SLA & 24/7 Priority Support',
          hsnCode: '998319',
          qty: 1,
          unitPrice: 375000,
          discountPercent: 12,
          taxableAmount: 330000,
        }
      ],
      subtotal: 3500000,
      discountTotal: 420000,
      cgst: 277200, // 9% of 3080000
      sgst: 277200, // 9% of 3080000
      igst: 0,
      totalAmount: 3634400,
      currency: 'INR (₹)',
      status: 'Draft',
    } as GSTInvoiceData,
    executionLogs: [
      {
        id: 'log-1',
        role: 'Finance Copilot',
        action: 'HSN Tax Engine Validation',
        timestamp: '10:42:01 AM',
        status: 'success',
        details: 'Evaluated Karnataka Intra-State 18% GST (CGST 9% + SGST 9%) for HSN 998313.',
      },
      {
        id: 'log-2',
        role: 'Finance Copilot',
        action: 'Discount Policy Override',
        timestamp: '10:42:02 AM',
        status: 'success',
        details: 'Applied 12% bulk enterprise volume discount (-₹420,000). Margin clearance: 44.2% (Pass).',
      },
      {
        id: 'log-3',
        role: 'Warehouse & Inventory',
        action: 'WMS Bin Allocation',
        timestamp: '10:42:03 AM',
        status: 'success',
        details: 'Locked 250 physical units in BLR-WH-4 (Bay 12, Shelf C). Reservation ID: RES-9812-BLR.',
      },
      {
        id: 'log-4',
        role: 'Frontline Rep',
        action: 'Whisper Copilot Synthesis',
        timestamp: '10:42:04 AM',
        status: 'active',
        details: 'Tone-matched reply drafted with interactive GST tax card ready for Sameen approval.',
      }
    ],
    rolesInvolved: ['finance', 'inventory', 'frontline'],
  },

  scenario_legal_sla: {
    id: 'scenario_legal_sla',
    title: 'Scenario 2: Legal SLA + API Key',
    pillTitle: '⚖️ 99.99% SLA Redline',
    subtitle: 'Contract risk analysis & isolated cluster token generation',
    badge: 'Legal & Tech Ops',
    platform: 'slack',
    customerMessage: 'Sending over our Tier-1 enterprise vendor agreement. Need 99.99% SLA commitment with 3x credit liquidated damages cap, plus staging cluster API credentials.',
    draftReply: 'Hi Vikram, I have redlined Section 14.2 of your MSA. We have approved the 99.99% monthly uptime SLA with 100% service credit for downtime beyond 4.3 mins/month. We have adjusted the liquidated damages cap to our standard 1.5x quarterly fees to remain within mutual reinsurance limits. Your staging cluster API credentials have been provisioned below.',
    artifactType: 'SLA_REDLINE',
    initialArtifactData: {
      documentId: 'MSA-2026-REDLINE-44',
      contractTitle: 'Master Cloud Infrastructure & SLA Addendum',
      parties: 'Krypton Technologies Ltd & Omnipotent Systems Inc.',
      proposedUptime: '99.99% Monthly High Availability',
      agreedUptime: '99.99% with Automated Heartbeat Multi-AZ Failover',
      clauseId: 'Section 14.2 (Liquidated Damages & SLA Remedies)',
      originalText: 'In the event availability falls below 99.99%, Customer shall be entitled to liquidated damages equal to three hundred percent (300% / 3x) of aggregate monthly service fees.',
      redlinedText: 'In the event availability falls below 99.99%, Provider shall grant tiered Service Credits up to 100% of monthly billings; total liability cap for outage-related remedies is adjusted to 1.5x quarterly fees (Section 14.2-Alt).',
      riskAssessment: 'Reduced unhedged liability exposure by $450,000 while satisfying customer enterprise uptime threshold.',
      liabilityCap: '1.5x Quarterly Service Fees ($180,000 max)',
      governingLaw: 'Jurisdiction of Bengaluru Commercial Courts / Delaware Int.',
      approvalStatus: 'Pre-Approved by General Counsel',
    } as SLARedlineData,
    executionLogs: [
      {
        id: 'log-11',
        role: 'Legal Risk Desk',
        action: 'Contract Liability Audit',
        timestamp: '10:45:11 AM',
        status: 'warn',
        details: 'Flagged 3x liquidated damages clause as disproportionate risk (Reinsurance threshold: 1.5x).',
      },
      {
        id: 'log-12',
        role: 'Legal Risk Desk',
        action: 'Clause Redlining',
        timestamp: '10:45:12 AM',
        status: 'success',
        details: 'Generated standard Section 14.2-Alt with tiered service credits and 1.5x quarterly cap.',
      },
      {
        id: 'log-13',
        role: 'Tech & API Operations',
        action: 'Cluster Key Generation',
        timestamp: '10:45:14 AM',
        status: 'success',
        details: 'Provisioned isolated sandbox tenant key `omni_live_k8s_9999_7f8a9` on staging endpoint.',
      }
    ],
    rolesInvolved: ['legal', 'tech', 'frontline'],
  },

  scenario_damaged_batch: {
    id: 'scenario_damaged_batch',
    title: 'Scenario 3: Damaged Batch Dispatch',
    pillTitle: '🚨 Damaged Batch Hot-Swap',
    subtitle: 'Zero-hesitation priority replacement without return backlog',
    badge: 'QA & Logistics',
    platform: 'whatsapp',
    customerMessage: 'Emergency: Delivery batch #BAT-884 arrived with 40 cracked fiber transceiver units at Hyderabad hub. Need immediate hot-swap dispatch without waiting for reverse logistics.',
    draftReply: 'Vikram, I have bypassed the return inspection hold. Incident #INC-991 is verified, and our Secunderabad Priority Hub has packed 40 fresh optical transceiver units (SN-SEC-9101 to 9140). Dispatch Voucher DSP-EXP-2026-081 is live with BlueDart Apex Air (AWB: 8840192837). Same-day delivery by 4:30 PM.',
    artifactType: 'DISPATCH_VOUCHER',
    initialArtifactData: {
      voucherId: 'DSP-EXP-2026-081',
      incidentRef: 'INC-HYD-991-CRACKED',
      destination: 'Krypton Data Center Hub, HITEC City, Hyderabad 500081',
      carrier: 'BlueDart Apex Air (Priority Flight BD-402)',
      airwayBill: 'AWB-8840-1928-37',
      priorityLevel: 'Critical Hot-Swap',
      originHub: 'Secunderabad Central Master Hub (Hub-SEC-01)',
      estimatedDelivery: 'Today by 4:30 PM IST',
      itemsReplaced: [
        {
          sku: 'OMNI-QSFP28-100G',
          description: '100G Optical Transceiver Module (Single-Mode)',
          qty: 40,
          serialNumbers: ['SN-SEC-9101', 'SN-SEC-9102', 'SN-SEC-9103', 'SN-SEC-9104', '... [40 Total]'],
        }
      ],
      dispatchStatus: 'Air Cargo Booked',
    } as DispatchVoucherData,
    executionLogs: [
      {
        id: 'log-21',
        role: 'Warehouse & Inventory',
        action: 'QA Incident Ingestion',
        timestamp: '11:02:10 AM',
        status: 'warn',
        details: 'Logged #INC-HYD-991. Defective lot #BAT-884 quarantined in system.',
      },
      {
        id: 'log-22',
        role: 'Executive Dispatch Logistics',
        action: 'Emergency Air Cargo Reservation',
        timestamp: '11:02:11 AM',
        status: 'success',
        details: 'Reserved flight bay BD-402 with BlueDart Apex Air. AWB 8840192837 generated.',
      },
      {
        id: 'log-23',
        role: 'Finance Copilot',
        action: 'Zero-Dollar Replacement Voucher',
        timestamp: '11:02:12 AM',
        status: 'success',
        details: 'Bypassed reverse-logistics prepayment barrier; cost attributed to transit insurance.',
      }
    ],
    rolesInvolved: ['inventory', 'dispatch', 'finance', 'frontline'],
  },

  scenario_split_billing: {
    id: 'scenario_split_billing',
    title: 'Scenario 4: Custom Scope Split Billing',
    pillTitle: '🌐 Split APAC/US Billing',
    subtitle: 'Dual-entity currency hedging and multi-jurisdiction compliance',
    badge: 'Cross-Border Finance',
    platform: 'email',
    customerMessage: 'We need to split our Q4 project: 60% billed to APAC entity in SGD, 40% to US parent entity in USD with separate PO numbers (PO-APAC-77 and PO-US-991).',
    draftReply: 'Hi Vikram, we have executed your split-billing structure. Invoice INV-2026-9815 covers 60% ($72,000 SGD) mapped to PO-APAC-77 under Singapore GST exemption, and INV-2026-9816 covers 40% ($48,000 USD) mapped to PO-US-991. Both invoices and FX lock contracts are attached below.',
    artifactType: 'GST_INVOICE',
    initialArtifactData: {
      invoiceNumber: 'INV-2026-SPLIT-9815A',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      customerName: 'Vikram Malhotra',
      company: 'Krypton Technologies APAC Pte Ltd (60%) & Inc (40%)',
      gstin: 'UEN: 20219812A / US-EIN: 84-9182391',
      billingAddress: 'Dual Jurisdictions: Marina Bay Financial Ctr SG & Wilmington DE USA',
      items: [
        {
          description: 'Q4 Enterprise Cloud Infrastructure - APAC Allocation (60% / PO-APAC-77)',
          hsnCode: '998313',
          qty: 1,
          unitPrice: 72000,
          discountPercent: 5,
          taxableAmount: 68400,
        },
        {
          description: 'Q4 Enterprise Cloud Infrastructure - US Parent Allocation (40% / PO-US-991)',
          hsnCode: '998313',
          qty: 1,
          unitPrice: 48000,
          discountPercent: 5,
          taxableAmount: 45600,
        }
      ],
      subtotal: 120000,
      discountTotal: 6000,
      cgst: 0,
      sgst: 0,
      igst: 0, // Zero rated export / multi-jurisdiction
      totalAmount: 114000,
      currency: 'USD / SGD Blended',
      status: 'Approved',
    } as GSTInvoiceData,
    executionLogs: [
      {
        id: 'log-31',
        role: 'Finance Copilot',
        action: 'FX Lock & Currency Split',
        timestamp: '11:15:30 AM',
        status: 'success',
        details: 'Fixed USD/SGD exchange rate hedge at 1.34 for 60-day settlement window.',
      },
      {
        id: 'log-32',
        role: 'Legal Risk Desk',
        action: 'Dual PO Cross-Entity Alignment',
        timestamp: '11:15:31 AM',
        status: 'success',
        details: 'Verified PO-APAC-77 and PO-US-991 terms under bilateral tax treaty compliance.',
      }
    ],
    rolesInvolved: ['finance', 'legal', 'frontline'],
  }
};

// Default status for backend roles
export const DEFAULT_BACKEND_ROLES: BackendRoleStatus[] = [
  {
    id: 'frontline',
    title: 'Frontline Rep',
    name: 'Sameen (Lead)',
    status: 'idle',
    lastAction: 'Standing by for customer incoming request',
    lastTimestamp: 'Just now',
    metric: '100% SLA',
    icon: 'UserCheck',
    color: 'emerald',
  },
  {
    id: 'finance',
    title: 'Finance Copilot',
    name: 'Auto-Tax & Invoicing',
    status: 'idle',
    lastAction: 'ERP GST Engine v4.2 synchronized',
    lastTimestamp: '2m ago',
    metric: '18% GST / HSN 9983',
    icon: 'Receipt',
    color: 'blue',
  },
  {
    id: 'inventory',
    title: 'Warehouse & Inventory',
    name: 'WMS Bin Allocation',
    status: 'idle',
    lastAction: 'BLR-WH-4 Real-time stock audit verified',
    lastTimestamp: '3m ago',
    metric: '9,420 units active',
    icon: 'Package',
    color: 'amber',
  },
  {
    id: 'legal',
    title: 'Legal Risk Desk',
    name: 'SLA & Contract Governance',
    status: 'idle',
    lastAction: 'Standard 1.5x liability templates loaded',
    lastTimestamp: '5m ago',
    metric: 'Zero unhedged SLA',
    icon: 'ShieldCheck',
    color: 'purple',
  },
  {
    id: 'tech',
    title: 'Tech & API Operations',
    name: 'Tenant Cluster Provisioner',
    status: 'idle',
    lastAction: 'Sandbox API gateway ready',
    lastTimestamp: '8m ago',
    metric: '99.99% Cluster Mesh',
    icon: 'Cpu',
    color: 'cyan',
  },
  {
    id: 'dispatch',
    title: 'Executive Dispatch',
    name: 'Express Cargo Logistics',
    status: 'idle',
    lastAction: 'BlueDart & DHL priority flight link active',
    lastTimestamp: '12m ago',
    metric: '< 4h Airway Dispatch',
    icon: 'Truck',
    color: 'rose',
  },
];

// Fallback & AI Intent Extractor
export async function processCustomerMessageWithOmnipotent(
  userText: string
): Promise<{
  draftReply: string;
  artifactType: ArtifactType;
  artifactData: any;
  executionLogs: ExecutionLog[];
  rolesActive: string[];
}> {
  const lower = userText.toLowerCase();

  // Try calling Gemini if an API key exists
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '');
  
  if (geminiApiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `You are OMNIPOTENT, the enterprise autonomous delegation copilot.
A customer just sent this request to our frontline rep: "${userText}"

Classify into one of 4 enterprise busywork categories:
1. "GST_INVOICE" (pricing, quotation, tax invoice, discount, bulk license, stock lock)
2. "SLA_REDLINE" (legal, SLA, 99.99%, liquidated damages, API key, credentials)
3. "DISPATCH_VOUCHER" (damaged goods, replacement, hot-swap, priority shipping, airway bill)
4. "GST_INVOICE" (split billing, multi-currency, international POs)

Output a strict JSON object with:
{
  "artifactType": "GST_INVOICE" | "SLA_REDLINE" | "DISPATCH_VOUCHER",
  "draftReply": "A concise, confident, customer-delighting reply from Sameen",
  "artifactData": { ... },
  "logs": [ { "role": "Finance Copilot" | "Warehouse & Inventory" | "Legal Risk Desk" | "Tech & API Operations" | "Executive Dispatch", "action": "string", "details": "string" } ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (cleanJsonMatch) {
        const parsed = JSON.parse(cleanJsonMatch[0]);
        return {
          draftReply: parsed.draftReply || 'Request processed and artifact generated.',
          artifactType: parsed.artifactType || 'GST_INVOICE',
          artifactData: parsed.artifactData || SCENARIO_PRESETS.scenario_gst_stock.initialArtifactData,
          executionLogs: (parsed.logs || []).map((l: any, i: number) => ({
            id: `ai-log-${Date.now()}-${i}`,
            role: l.role || 'Finance Copilot',
            action: l.action || 'Automated Ledger Entry',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'success',
            details: l.details || 'Processed via Omnipotent AI Engine',
          })),
          rolesActive: ['finance', 'inventory', 'frontline'],
        };
      }
    } catch (err) {
      console.warn('Gemini live call error, using deterministic engine fallback:', err);
    }
  }

  // Deterministic Keyword-Matching Engine (100% Reliable, zero network failure)
  if (lower.includes('sla') || lower.includes('legal') || lower.includes('contract') || lower.includes('damage cap') || lower.includes('api key') || lower.includes('99.99')) {
    const s = SCENARIO_PRESETS.scenario_legal_sla;
    return {
      draftReply: s.draftReply,
      artifactType: s.artifactType,
      artifactData: s.initialArtifactData,
      executionLogs: s.executionLogs,
      rolesActive: s.rolesInvolved,
    };
  } else if (lower.includes('damage') || lower.includes('cracked') || lower.includes('hot-swap') || lower.includes('dispatch') || lower.includes('broken') || lower.includes('carrier') || lower.includes('batch')) {
    const s = SCENARIO_PRESETS.scenario_damaged_batch;
    return {
      draftReply: s.draftReply,
      artifactType: s.artifactType,
      artifactData: s.initialArtifactData,
      executionLogs: s.executionLogs,
      rolesActive: s.rolesInvolved,
    };
  } else if (lower.includes('split') || lower.includes('sgd') || lower.includes('usd') || lower.includes('po-') || lower.includes('apac') || lower.includes('entity')) {
    const s = SCENARIO_PRESETS.scenario_split_billing;
    return {
      draftReply: s.draftReply,
      artifactType: s.artifactType,
      artifactData: s.initialArtifactData,
      executionLogs: s.executionLogs,
      rolesActive: s.rolesInvolved,
    };
  } else {
    // Default to GST Invoice + Stock Lock scenario
    const s = SCENARIO_PRESETS.scenario_gst_stock;
    return {
      draftReply: s.draftReply,
      artifactType: s.artifactType,
      artifactData: s.initialArtifactData,
      executionLogs: s.executionLogs,
      rolesActive: s.rolesInvolved,
    };
  }
}
