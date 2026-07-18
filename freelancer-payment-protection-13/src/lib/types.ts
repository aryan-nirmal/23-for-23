export type MilestoneStatus =
  | "draft"
  | "funded"
  | "in_progress"
  | "submitted"
  | "approved"
  | "released";

export type TransactionType = "fund" | "release";

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
}

export interface Project {
  id: string;
  clientName: string;
  totalAmount: number;
  milestones: Milestone[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  clientName: string;
  milestoneId: string;
  milestoneTitle: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  paymentId: string;
  status: "success";
}

export const MILESTONE_STATUSES: MilestoneStatus[] = [
  "draft",
  "funded",
  "in_progress",
  "submitted",
  "approved",
  "released",
];

export const STATUS_LABELS: Record<MilestoneStatus, string> = {
  draft: "Draft",
  funded: "Funded",
  in_progress: "In Progress",
  submitted: "Submitted",
  approved: "Approved",
  released: "Released",
};