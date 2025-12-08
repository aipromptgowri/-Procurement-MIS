export enum VendorRating {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum POStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DELIVERED = 'Delivered',
  PARTIAL = 'Partial',
  DELAYED = 'Delayed'
}

export enum InvoiceStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue'
}

export interface Material {
  id: string;
  name: string;
  unit: string;
}

export interface Vendor {
  id: string;
  name: string;
  rating: VendorRating;
  onTimeDeliveryScore: number; // Percentage
  avgLeadTime: number; // Days
}

export interface PurchaseOrder {
  poNumber: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  materialName: string;
  value: number;
  dateRaised: string;
  deliveryDueDate: string;
  status: POStatus;
}

export interface Invoice {
  id: string;
  vendorName: string;
  poNumber: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface FinanceData {
  totalOutstandingPayables: number;
  overduePayables: number;
  weeklyCashFlowReq: number;
  budgetUtilizedTotal: number;
  recentInvoices: Invoice[];
}

export interface ProjectStats {
  id: string;
  name: string;
  budgetUtilization: number; // Percentage
  materialRequirementsReceived: number;
  posRaisedCount: number;
  deliveriesCompleted: number;
  outstandingItems: number;
  criticalShortages: string[];
}

export interface WeeklyData {
  weekStarting: string;
  totalPOsRaised: number;
  totalPOValue: number;
  pendingIndentsCount: number;
  pendingIndentsValue: number;
  pendingApprovals: number;
  deliveriesCompleted: number;
  deliveriesDelayed: number;
  qualityIssuesReported: number;
  topMaterials: { name: string; value: number }[];
  projects: ProjectStats[];
  highValuePOs: PurchaseOrder[];
  vendors: Vendor[];
  finance: FinanceData;
}

export interface GeneratedReportSections {
  executiveSummary: string;
  risksAndIssues: string;
  actionItems: string;
  conclusion: string;
  vendorFollowUps: string;
}

export type UserRole = 'procurement' | 'finance';

export interface User {
  username: string;
  role: UserRole;
  name: string;
}