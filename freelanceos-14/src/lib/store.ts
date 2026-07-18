export type ProjectStatus = "active" | "completed" | "on_hold";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  date: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  description: string;
  budget: number;
  deadline: string;
  startDate: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectId?: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
  description: string;
}

export interface Contract {
  id: string;
  name: string;
  description: string;
  content: string;
  updatedAt: string;
}

const clients: Client[] = [
  {
    id: "client-1",
    name: "Sarah Chen",
    email: "sarah@northwind.io",
    company: "Northwind Digital",
    phone: "+1 415-555-0142",
    notes: "Prefers async updates via email. Retainer client.",
    createdAt: "2025-11-01",
  },
  {
    id: "client-2",
    name: "Marcus Webb",
    email: "marcus@lumina.studio",
    company: "Lumina Studio",
    phone: "+1 212-555-0198",
    notes: "Brand-focused. Quarterly design sprints.",
    createdAt: "2025-09-15",
  },
  {
    id: "client-3",
    name: "Elena Rodriguez",
    email: "elena@apexventures.com",
    company: "Apex Ventures",
    phone: "+1 305-555-0167",
    notes: "Startup accelerator. Fast turnaround expected.",
    createdAt: "2026-01-10",
  },
  {
    id: "client-4",
    name: "James Okafor",
    email: "james@greenleaf.co",
    company: "Greenleaf Co",
    phone: "+1 503-555-0133",
    createdAt: "2025-12-05",
  },
];

const projects: Project[] = [
  {
    id: "proj-1",
    name: "Northwind Website Redesign",
    clientId: "client-1",
    status: "active",
    description: "Full redesign of marketing site with new component library.",
    budget: 12000,
    deadline: "2026-06-20",
    startDate: "2026-03-01",
  },
  {
    id: "proj-2",
    name: "Lumina Brand Refresh",
    clientId: "client-2",
    status: "active",
    description: "Logo, typography, and brand guidelines update.",
    budget: 8500,
    deadline: "2026-06-15",
    startDate: "2026-04-01",
  },
  {
    id: "proj-3",
    name: "Apex Pitch Deck",
    clientId: "client-3",
    status: "on_hold",
    description: "Investor deck design for Series A fundraising.",
    budget: 4500,
    deadline: "2026-07-01",
    startDate: "2026-05-01",
  },
  {
    id: "proj-4",
    name: "Greenleaf E-commerce MVP",
    clientId: "client-4",
    status: "completed",
    description: "Shopify theme customization and launch support.",
    budget: 6200,
    deadline: "2026-04-30",
    startDate: "2026-02-01",
  },
  {
    id: "proj-5",
    name: "Northwind Analytics Dashboard",
    clientId: "client-1",
    status: "active",
    description: "Internal dashboard for campaign performance tracking.",
    budget: 9800,
    deadline: "2026-06-28",
    startDate: "2026-05-10",
  },
];

const tasks: Task[] = [
  { id: "task-1", projectId: "proj-1", title: "Finalize homepage wireframes", status: "done", dueDate: "2026-05-20" },
  { id: "task-2", projectId: "proj-1", title: "Build hero section components", status: "in_progress", dueDate: "2026-06-10" },
  { id: "task-3", projectId: "proj-1", title: "Client review round 2", status: "todo", dueDate: "2026-06-14" },
  { id: "task-4", projectId: "proj-2", title: "Logo concept sketches", status: "done", dueDate: "2026-05-15" },
  { id: "task-5", projectId: "proj-2", title: "Typography system", status: "in_progress", dueDate: "2026-06-12" },
  { id: "task-6", projectId: "proj-3", title: "Slide structure outline", status: "todo", dueDate: "2026-06-18" },
  { id: "task-7", projectId: "proj-5", title: "API integration spec", status: "in_progress", dueDate: "2026-06-09" },
  { id: "task-8", projectId: "proj-5", title: "Chart component library", status: "todo", dueDate: "2026-06-22" },
];

const timeline: TimelineEvent[] = [
  { id: "tl-1", projectId: "proj-1", title: "Kickoff call", date: "2026-03-01", description: "Aligned on scope and timeline." },
  { id: "tl-2", projectId: "proj-1", title: "Wireframes approved", date: "2026-05-22", description: "Client signed off on IA and layouts." },
  { id: "tl-3", projectId: "proj-1", title: "Development sprint 1", date: "2026-06-01", description: "Started component implementation." },
  { id: "tl-4", projectId: "proj-2", title: "Brand audit delivered", date: "2026-04-10" },
  { id: "tl-5", projectId: "proj-2", title: "Logo direction selected", date: "2026-05-18", description: "Option B chosen with minor tweaks." },
  { id: "tl-6", projectId: "proj-5", title: "Requirements workshop", date: "2026-05-12" },
];

let invoices: Invoice[] = [
  {
    id: "inv-1",
    number: "INV-2026-001",
    clientId: "client-1",
    projectId: "proj-1",
    amount: 4000,
    status: "paid",
    issuedAt: "2026-03-05",
    dueDate: "2026-03-20",
    description: "Northwind Website — Phase 1 deposit",
  },
  {
    id: "inv-2",
    number: "INV-2026-002",
    clientId: "client-2",
    projectId: "proj-2",
    amount: 2800,
    status: "sent",
    issuedAt: "2026-05-01",
    dueDate: "2026-06-01",
    description: "Lumina Brand Refresh — Milestone 1",
  },
  {
    id: "inv-3",
    number: "INV-2026-003",
    clientId: "client-1",
    projectId: "proj-5",
    amount: 3200,
    status: "draft",
    issuedAt: "2026-06-01",
    dueDate: "2026-06-30",
    description: "Analytics Dashboard — Sprint 1",
  },
  {
    id: "inv-4",
    number: "INV-2026-004",
    clientId: "client-3",
    projectId: "proj-3",
    amount: 1500,
    status: "overdue",
    issuedAt: "2026-04-15",
    dueDate: "2026-05-15",
    description: "Apex Pitch Deck — Discovery fee",
  },
  {
    id: "inv-5",
    number: "INV-2026-005",
    clientId: "client-4",
    projectId: "proj-4",
    amount: 6200,
    status: "paid",
    issuedAt: "2026-02-10",
    dueDate: "2026-03-10",
    description: "Greenleaf E-commerce — Final payment",
  },
];

const contracts: Contract[] = [
  {
    id: "contract-1",
    name: "Standard Freelance Agreement",
    description: "General-purpose contract for design and development work.",
    updatedAt: "2026-01-15",
    content: `FREELANCE SERVICES AGREEMENT

This Agreement is entered into between the Client and the Freelancer for the provision of professional services.

1. SCOPE OF WORK
The Freelancer shall perform the services described in the project proposal or statement of work attached hereto.

2. COMPENSATION
Client agrees to pay the fees specified in the project proposal. Invoices are due within 14 days of receipt.

3. INTELLECTUAL PROPERTY
Upon full payment, all deliverables created specifically for the Client shall become the property of the Client.

4. CONFIDENTIALITY
Both parties agree to keep confidential any proprietary information shared during the engagement.

5. TERMINATION
Either party may terminate with 14 days written notice. Client shall pay for work completed to date.`,
  },
  {
    id: "contract-2",
    name: "Retainer Agreement",
    description: "Monthly retainer for ongoing design and development support.",
    updatedAt: "2026-02-01",
    content: `MONTHLY RETAINER AGREEMENT

This Retainer Agreement establishes an ongoing working relationship between the parties.

1. RETAINER FEE
Client agrees to pay a monthly retainer fee for a defined number of hours or deliverables per month.

2. ROLLOVER
Unused hours may roll over to the following month, up to a maximum of one month's allocation.

3. PRIORITY ACCESS
Retainer clients receive priority scheduling and response times within one business day.

4. SCOPE ADJUSTMENTS
Additional work beyond the retainer scope will be quoted separately before commencement.

5. TERM
This agreement renews monthly unless terminated with 30 days written notice.`,
  },
  {
    id: "contract-3",
    name: "NDA — Mutual",
    description: "Mutual non-disclosure agreement for sensitive projects.",
    updatedAt: "2025-12-10",
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

The parties wish to explore a business opportunity and need to share confidential information.

1. DEFINITION
"Confidential Information" means any non-public information disclosed by either party.

2. OBLIGATIONS
Each party agrees to protect the other's Confidential Information with reasonable care and not disclose it to third parties.

3. EXCLUSIONS
Information that is publicly available, independently developed, or rightfully received from a third party is excluded.

4. TERM
This agreement remains in effect for two years from the date of signing.

5. RETURN OF MATERIALS
Upon request, each party shall return or destroy all Confidential Information received.`,
  },
];

export function getClients(): Client[] {
  return [...clients];
}

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getProjects(): Project[] {
  return [...projects];
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByClientId(clientId: string): Project[] {
  return projects.filter((p) => p.clientId === clientId);
}

export function getActiveProjects(): Project[] {
  return projects.filter((p) => p.status === "active");
}

export function getTasksByProjectId(projectId: string): Task[] {
  return tasks.filter((t) => t.projectId === projectId);
}

export function getTimelineByProjectId(projectId: string): TimelineEvent[] {
  return timeline
    .filter((e) => e.projectId === projectId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getInvoices(): Invoice[] {
  return [...invoices].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );
}

export function getPendingInvoices(): Invoice[] {
  return invoices.filter((i) => i.status === "sent" || i.status === "overdue");
}

export function getContracts(): Contract[] {
  return [...contracts];
}

export function getContractById(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function getUpcomingDeadlines(days = 30): Project[] {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  return projects
    .filter((p) => p.status === "active")
    .filter((p) => {
      const deadline = new Date(p.deadline);
      return deadline >= now && deadline <= cutoff;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

export interface CreateInvoiceInput {
  clientId: string;
  projectId?: string;
  amount: number;
  dueDate: string;
  description: string;
}

export function createInvoice(input: CreateInvoiceInput): Invoice {
  const nextNum = invoices.length + 1;
  const invoice: Invoice = {
    id: `inv-${Date.now()}`,
    number: `INV-2026-${String(nextNum).padStart(3, "0")}`,
    clientId: input.clientId,
    projectId: input.projectId,
    amount: input.amount,
    status: "draft",
    issuedAt: new Date().toISOString().split("T")[0],
    dueDate: input.dueDate,
    description: input.description,
  };
  invoices = [invoice, ...invoices];
  return invoice;
}