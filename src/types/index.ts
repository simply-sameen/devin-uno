export type PlatformType = 'whatsapp' | 'slack' | 'email';

export type SenderType = 'customer' | 'rep' | 'copilot' | 'system';

export type MessageRole = 'customer' | 'assistant' | 'system' | 'backend_action';

export type ArtifactType = 'GST_INVOICE' | 'STOCK_RESERVATION' | 'SLA_REDLINE' | 'DISPATCH_VOUCHER';

export interface OmnipotentSession {
  id: string;
  customer_name: string;
  company: string;
  platform: PlatformType;
  status: 'active' | 'escalated' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface OmnipotentMessage {
  id: string;
  session_id: string;
  sender: string;
  sender_type: SenderType;
  role: MessageRole;
  text: string;
  timestamp: string;
  platform: PlatformType;
  status: 'sent' | 'processing' | 'approved' | 'delivered';
  artifact_type?: ArtifactType | null;
  artifact_data?: any;
}

export interface BackendRoleStatus {
  id: 'frontline' | 'finance' | 'inventory' | 'legal' | 'tech' | 'dispatch';
  title: string;
  name: string;
  status: 'idle' | 'executing' | 'approved' | 'committed';
  lastAction: string;
  lastTimestamp: string;
  metric: string;
  icon: string;
  color: string;
}

export interface ExecutionLog {
  id: string;
  role: string;
  action: string;
  timestamp: string;
  status: 'pending' | 'active' | 'success' | 'warn';
  details: string;
}

export interface GSTInvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  company: string;
  gstin: string;
  billingAddress: string;
  items: Array<{
    description: string;
    hsnCode: string;
    qty: number;
    unitPrice: number;
    discountPercent: number;
    taxableAmount: number;
  }>;
  subtotal: number;
  discountTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  currency: string;
  status: 'Draft' | 'Approved' | 'Committed to SAP ERP';
}

export interface StockReservationData {
  reservationId: string;
  facility: string;
  binLocation: string;
  sku: string;
  productName: string;
  lockedQuantity: number;
  allocatedFor: string;
  expiresInHours: number;
  lockStatus: 'Soft Reserved' | 'Firm Allocated' | 'Locked in WMS';
  auditHash: string;
}

export interface SLARedlineData {
  documentId: string;
  contractTitle: string;
  parties: string;
  proposedUptime: string;
  agreedUptime: string;
  clauseId: string;
  originalText: string;
  redlinedText: string;
  riskAssessment: string;
  liabilityCap: string;
  governingLaw: string;
  approvalStatus: 'Review Required' | 'Pre-Approved by General Counsel' | 'Executed';
}

export interface DispatchVoucherData {
  voucherId: string;
  incidentRef: string;
  destination: string;
  carrier: string;
  airwayBill: string;
  priorityLevel: 'Standard' | 'Critical Hot-Swap' | 'Executive Override';
  itemsReplaced: Array<{
    sku: string;
    description: string;
    qty: number;
    serialNumbers: string[];
  }>;
  originHub: string;
  estimatedDelivery: string;
  dispatchStatus: 'Pending Manifest' | 'Air Cargo Booked' | 'Dispatched';
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  pillTitle: string;
  subtitle: string;
  badge: string;
  platform: PlatformType;
  customerMessage: string;
  draftReply: string;
  artifactType: ArtifactType;
  initialArtifactData: GSTInvoiceData | StockReservationData | SLARedlineData | DispatchVoucherData;
  executionLogs: ExecutionLog[];
  rolesInvolved: string[];
}
