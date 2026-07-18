import type { Project, Transaction } from "./types";

const globalStore = globalThis as typeof globalThis & {
  __projects?: Project[];
  __transactions?: Transaction[];
};

function getProjects(): Project[] {
  if (!globalStore.__projects) {
    globalStore.__projects = [
      {
        id: "proj_demo_001",
        clientName: "Acme Corp",
        totalAmount: 150000,
        createdAt: new Date("2026-05-01").toISOString(),
        milestones: [
          {
            id: "ms_demo_001",
            title: "Discovery & Wireframes",
            amount: 50000,
            dueDate: "2026-06-15",
            status: "released",
          },
          {
            id: "ms_demo_002",
            title: "UI Development",
            amount: 60000,
            dueDate: "2026-07-01",
            status: "submitted",
          },
          {
            id: "ms_demo_003",
            title: "Launch & Handoff",
            amount: 40000,
            dueDate: "2026-07-20",
            status: "draft",
          },
        ],
      },
    ];
  }
  return globalStore.__projects;
}

function getTransactions(): Transaction[] {
  if (!globalStore.__transactions) {
    globalStore.__transactions = [
      {
        id: "txn_demo_001",
        projectId: "proj_demo_001",
        clientName: "Acme Corp",
        milestoneId: "ms_demo_001",
        milestoneTitle: "Discovery & Wireframes",
        type: "fund",
        amount: 50000,
        timestamp: new Date("2026-05-02T10:00:00").toISOString(),
        paymentId: "pay_demo_fund_001",
        status: "success",
      },
      {
        id: "txn_demo_002",
        projectId: "proj_demo_001",
        clientName: "Acme Corp",
        milestoneId: "ms_demo_001",
        milestoneTitle: "Discovery & Wireframes",
        type: "release",
        amount: 50000,
        timestamp: new Date("2026-05-20T14:30:00").toISOString(),
        paymentId: "pay_demo_release_001",
        status: "success",
      },
    ];
  }
  return globalStore.__transactions;
}

export function listProjects(): Project[] {
  return [...getProjects()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function addProject(project: Project): Project {
  getProjects().unshift(project);
  return project;
}

export function updateMilestone(
  projectId: string,
  milestoneId: string,
  updater: (milestone: Project["milestones"][number]) => void
): Project | undefined {
  const project = getProject(projectId);
  if (!project) return undefined;

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return undefined;

  updater(milestone);
  return project;
}

export function listTransactions(): Transaction[] {
  return [...getTransactions()].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function addTransaction(transaction: Transaction): Transaction {
  getTransactions().unshift(transaction);
  return transaction;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generatePaymentId(type: "fund" | "release"): string {
  const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `pay_${type}_${suffix}`;
}