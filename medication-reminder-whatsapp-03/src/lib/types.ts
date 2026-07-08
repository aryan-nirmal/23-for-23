export type AccountType = "family" | "clinic";

export type ReminderStatus =
  | "scheduled"
  | "sent"
  | "taken"
  | "snoozed"
  | "missed"
  | "escalated"
  | "failed";

export type MessageDirection = "inbound" | "outbound";

export type MessageKind = "reminder" | "escalation" | "summary" | "reply" | "system";

export type MessageDeliveryStatus = "queued" | "delivered" | "failed";

export interface Account {
  id: string;
  ownerName: string;
  email: string;
  accountType: AccountType;
  createdAt: string;
}

export interface Caregiver {
  id: string;
  accountId: string;
  name: string;
  email: string;
  phone: string;
  whatsappOptIn: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  accountId: string;
  caregiverId: string;
  name: string;
  phone: string;
  timezone: string;
  preferredLanguage: string;
  status: "active" | "paused";
  createdAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  doseText: string;
  instructions: string;
  active: boolean;
  createdAt: string;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  reminderTime: string;
  recurrenceRule: string;
  graceMinutes: number;
  createdAt: string;
}

export interface ReminderEvent {
  id: string;
  patientId: string;
  medicationId: string;
  scheduleId: string;
  dueAt: string;
  localDateKey: string;
  status: ReminderStatus;
  sentAt?: string;
  acknowledgedAt?: string;
  escalatedAt?: string;
  replyText?: string;
  wasDelayed: boolean;
  createdAt: string;
}

export interface ConsentEvent {
  id: string;
  patientId: string;
  caregiverId: string;
  type: "patient_opt_in" | "caregiver_opt_in" | "health_disclaimer";
  note: string;
  createdAt: string;
}

export interface MessageLog {
  id: string;
  accountId: string;
  patientId?: string;
  caregiverId?: string;
  reminderEventId?: string;
  direction: MessageDirection;
  kind: MessageKind;
  channel: "mock_whatsapp";
  content: string;
  payload: Record<string, unknown>;
  deliveryStatus: MessageDeliveryStatus;
  createdAt: string;
}

export interface AdherenceSummary {
  id: string;
  patientId: string;
  weekStart: string;
  takenCount: number;
  missedCount: number;
  delayedCount: number;
  createdAt: string;
}

export interface DemoSession {
  accountId: string;
  accountType: AccountType;
  email: string;
  ownerName: string;
}

export interface StoreState {
  accounts: Account[];
  caregivers: Caregiver[];
  patients: Patient[];
  medications: Medication[];
  medicationSchedules: MedicationSchedule[];
  reminderEvents: ReminderEvent[];
  consentEvents: ConsentEvent[];
  messageLogs: MessageLog[];
  adherenceSummaries: AdherenceSummary[];
}
