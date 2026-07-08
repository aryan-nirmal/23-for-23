import type {
  Account,
  AdherenceSummary,
  Caregiver,
  ConsentEvent,
  Medication,
  MedicationSchedule,
  MessageLog,
  Patient,
  ReminderEvent,
  StoreState,
} from "@/lib/types";

declare global {
  var __wmwStore: StoreState | undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function buildSeedStore(): StoreState {
  const createdAt = nowIso();

  const account: Account = {
    id: "account_demo",
    ownerName: "Rahul Sharma",
    email: "rahul@pulseprompt.app",
    accountType: "family",
    createdAt,
  };

  const caregiver: Caregiver = {
    id: "caregiver_demo",
    accountId: account.id,
    name: "Rahul Sharma",
    email: account.email,
    phone: "+91 98765 43210",
    whatsappOptIn: true,
    createdAt,
  };

  const patientOne: Patient = {
    id: "patient_meena",
    accountId: account.id,
    caregiverId: caregiver.id,
    name: "Meena Sharma",
    phone: "+91 98111 22334",
    timezone: "Asia/Kolkata",
    preferredLanguage: "English",
    status: "active",
    createdAt,
  };

  const patientTwo: Patient = {
    id: "patient_joseph",
    accountId: account.id,
    caregiverId: caregiver.id,
    name: "Joseph D'Souza",
    phone: "+91 98222 77441",
    timezone: "Asia/Kolkata",
    preferredLanguage: "English",
    status: "active",
    createdAt,
  };

  const medications: Medication[] = [
    {
      id: "med_gluformin",
      patientId: patientOne.id,
      name: "Gluformin",
      doseText: "500 mg",
      instructions: "After breakfast",
      active: true,
      createdAt,
    },
    {
      id: "med_telvas",
      patientId: patientOne.id,
      name: "Telvas",
      doseText: "40 mg",
      instructions: "After dinner",
      active: true,
      createdAt,
    },
    {
      id: "med_thyro",
      patientId: patientTwo.id,
      name: "Thyrocare",
      doseText: "75 mcg",
      instructions: "30 minutes before breakfast",
      active: true,
      createdAt,
    },
  ];

  const medicationSchedules: MedicationSchedule[] = [
    {
      id: "schedule_gluformin_morning",
      medicationId: medications[0].id,
      reminderTime: "08:30",
      recurrenceRule: "FREQ=DAILY",
      graceMinutes: 30,
      createdAt,
    },
    {
      id: "schedule_telvas_evening",
      medicationId: medications[1].id,
      reminderTime: "20:00",
      recurrenceRule: "FREQ=DAILY",
      graceMinutes: 30,
      createdAt,
    },
    {
      id: "schedule_thyro_morning",
      medicationId: medications[2].id,
      reminderTime: "06:45",
      recurrenceRule: "FREQ=DAILY",
      graceMinutes: 20,
      createdAt,
    },
  ];

  const reminderEvents: ReminderEvent[] = [
    {
      id: "event_seed_taken",
      patientId: patientOne.id,
      medicationId: medications[0].id,
      scheduleId: medicationSchedules[0].id,
      dueAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      localDateKey: "seed-today-a",
      status: "taken",
      sentAt: new Date(Date.now() - 1000 * 60 * 119).toISOString(),
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 112).toISOString(),
      replyText: "YES",
      wasDelayed: false,
      createdAt,
    },
    {
      id: "event_seed_missed",
      patientId: patientTwo.id,
      medicationId: medications[2].id,
      scheduleId: medicationSchedules[2].id,
      dueAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      localDateKey: "seed-today-b",
      status: "escalated",
      sentAt: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
      escalatedAt: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
      wasDelayed: true,
      createdAt,
    },
  ];

  const consentEvents: ConsentEvent[] = [
    {
      id: "consent_patient_1",
      patientId: patientOne.id,
      caregiverId: caregiver.id,
      type: "patient_opt_in",
      note: "Patient confirmed WhatsApp reminder consent during onboarding.",
      createdAt,
    },
    {
      id: "consent_disclaimer_1",
      patientId: patientOne.id,
      caregiverId: caregiver.id,
      type: "health_disclaimer",
      note: "Reminder tool is not a medical device and does not replace physician advice.",
      createdAt,
    },
  ];

  const messageLogs: MessageLog[] = [
    {
      id: "log_seed_1",
      accountId: account.id,
      patientId: patientOne.id,
      caregiverId: caregiver.id,
      reminderEventId: reminderEvents[0].id,
      direction: "outbound",
      kind: "reminder",
      channel: "mock_whatsapp",
      content: "Time for Gluformin 500 mg. Reply YES once taken.",
      payload: { template: "reminder_default" },
      deliveryStatus: "delivered",
      createdAt,
    },
    {
      id: "log_seed_2",
      accountId: account.id,
      patientId: patientOne.id,
      caregiverId: caregiver.id,
      reminderEventId: reminderEvents[0].id,
      direction: "inbound",
      kind: "reply",
      channel: "mock_whatsapp",
      content: "YES",
      payload: { source: "seed" },
      deliveryStatus: "delivered",
      createdAt,
    },
  ];

  const adherenceSummaries: AdherenceSummary[] = [
    {
      id: "summary_seed_1",
      patientId: patientOne.id,
      weekStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      takenCount: 11,
      missedCount: 1,
      delayedCount: 2,
      createdAt,
    },
  ];

  return {
    accounts: [account],
    caregivers: [caregiver],
    patients: [patientOne, patientTwo],
    medications,
    medicationSchedules,
    reminderEvents,
    consentEvents,
    messageLogs,
    adherenceSummaries,
  };
}

export function getStore() {
  if (!globalThis.__wmwStore) {
    globalThis.__wmwStore = buildSeedStore();
  }

  return globalThis.__wmwStore;
}
