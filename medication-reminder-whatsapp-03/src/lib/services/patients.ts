import { getStore } from "@/lib/mock/store";
import { addMessageLog } from "@/lib/services/reminders";
import type {
  AccountType,
  AdherenceSummary,
  Caregiver,
  ConsentEvent,
  DemoSession,
  Medication,
  MedicationSchedule,
  Patient,
} from "@/lib/types";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function ensureDemoAccount(input: {
  email: string;
  ownerName: string;
  accountType: AccountType;
}) {
  const store = getStore();
  const existing = store.accounts.find((item) => item.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    return {
      session: {
        accountId: existing.id,
        email: existing.email,
        ownerName: existing.ownerName,
        accountType: existing.accountType,
      } satisfies DemoSession,
    };
  }

  const accountId = id("account");
  const caregiverId = id("caregiver");

  store.accounts.push({
    id: accountId,
    ownerName: input.ownerName,
    email: input.email,
    accountType: input.accountType,
    createdAt: nowIso(),
  });

  store.caregivers.push({
    id: caregiverId,
    accountId,
    name: input.ownerName,
    email: input.email,
    phone: "+91 90000 00000",
    whatsappOptIn: true,
    createdAt: nowIso(),
  });

  return {
    session: {
      accountId,
      email: input.email,
      ownerName: input.ownerName,
      accountType: input.accountType,
    } satisfies DemoSession,
  };
}

export function createPatient(input: {
  session: DemoSession;
  caregiverName: string;
  caregiverPhone: string;
  patientName: string;
  patientPhone: string;
  timezone: string;
  preferredLanguage: string;
  patientConsent: boolean;
  caregiverConsent: boolean;
}) {
  const store = getStore();
  const caregiver =
    store.caregivers.find((item) => item.accountId === input.session.accountId) ??
    ({
      id: id("caregiver"),
      accountId: input.session.accountId,
      name: input.caregiverName,
      email: input.session.email,
      phone: input.caregiverPhone,
      whatsappOptIn: input.caregiverConsent,
      createdAt: nowIso(),
    } satisfies Caregiver);

  if (!store.caregivers.some((item) => item.id === caregiver.id)) {
    store.caregivers.push(caregiver);
  } else {
    caregiver.name = input.caregiverName;
    caregiver.phone = input.caregiverPhone;
    caregiver.whatsappOptIn = input.caregiverConsent;
  }

  const patient: Patient = {
    id: id("patient"),
    accountId: input.session.accountId,
    caregiverId: caregiver.id,
    name: input.patientName,
    phone: input.patientPhone,
    timezone: input.timezone,
    preferredLanguage: input.preferredLanguage,
    status: "active",
    createdAt: nowIso(),
  };

  const consents: ConsentEvent[] = [
    {
      id: id("consent"),
      patientId: patient.id,
      caregiverId: caregiver.id,
      type: "patient_opt_in",
      note: input.patientConsent
        ? "Patient consent captured during caregiver onboarding."
        : "Patient consent pending manual confirmation.",
      createdAt: nowIso(),
    },
    {
      id: id("consent"),
      patientId: patient.id,
      caregiverId: caregiver.id,
      type: "caregiver_opt_in",
      note: input.caregiverConsent
        ? "Caregiver escalation consent captured."
        : "Caregiver escalation consent pending.",
      createdAt: nowIso(),
    },
    {
      id: id("consent"),
      patientId: patient.id,
      caregiverId: caregiver.id,
      type: "health_disclaimer",
      note: "Reminder tool is not a medical device and does not replace physician advice.",
      createdAt: nowIso(),
    },
  ];

  store.patients.push(patient);
  store.consentEvents.unshift(...consents);

  addMessageLog({
    accountId: patient.accountId,
    patientId: patient.id,
    caregiverId: caregiver.id,
    direction: "outbound",
    kind: "system",
    channel: "mock_whatsapp",
    content: `Patient ${patient.name} onboarded. Waiting for the first reminder cycle.`,
    payload: { onboarding: true },
    deliveryStatus: "delivered",
  });

  return patient;
}

export function createMedication(input: {
  patientId: string;
  name: string;
  doseText: string;
  instructions: string;
  reminderTime: string;
  graceMinutes: number;
}) {
  const store = getStore();
  const medication: Medication = {
    id: id("med"),
    patientId: input.patientId,
    name: input.name,
    doseText: input.doseText,
    instructions: input.instructions,
    active: true,
    createdAt: nowIso(),
  };

  const schedule: MedicationSchedule = {
    id: id("schedule"),
    medicationId: medication.id,
    reminderTime: input.reminderTime,
    recurrenceRule: "FREQ=DAILY",
    graceMinutes: input.graceMinutes,
    createdAt: nowIso(),
  };

  store.medications.push(medication);
  store.medicationSchedules.push(schedule);
  return { medication, schedule };
}

export function updateMedication(input: {
  medicationId: string;
  name?: string;
  doseText?: string;
  instructions?: string;
  active?: boolean;
  reminderTime?: string;
  graceMinutes?: number;
}) {
  const store = getStore();
  const medication = store.medications.find((item) => item.id === input.medicationId);

  if (!medication) {
    return null;
  }

  if (input.name) medication.name = input.name;
  if (input.doseText) medication.doseText = input.doseText;
  if (input.instructions) medication.instructions = input.instructions;
  if (typeof input.active === "boolean") medication.active = input.active;

  const schedule = store.medicationSchedules.find((item) => item.medicationId === medication.id);

  if (schedule) {
    if (input.reminderTime) schedule.reminderTime = input.reminderTime;
    if (typeof input.graceMinutes === "number") schedule.graceMinutes = input.graceMinutes;
  }

  return { medication, schedule };
}

export function getPatientDetails(accountId: string, patientId: string) {
  const store = getStore();
  const patient = store.patients.find((item) => item.accountId === accountId && item.id === patientId);

  if (!patient) {
    return null;
  }

  const caregiver = store.caregivers.find((item) => item.id === patient.caregiverId) ?? null;
  const medications = store.medications.filter((item) => item.patientId === patient.id);
  const schedules = store.medicationSchedules.filter((item) =>
    medications.some((medication) => medication.id === item.medicationId),
  );
  const events = store.reminderEvents
    .filter((item) => item.patientId === patient.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const logs = store.messageLogs
    .filter((item) => item.patientId === patient.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const consents = store.consentEvents
    .filter((item) => item.patientId === patient.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { patient, caregiver, medications, schedules, events, logs, consents };
}

export function getDashboardData(accountId: string) {
  const store = getStore();
  const patients = store.patients.filter((item) => item.accountId === accountId);
  const patientIds = new Set(patients.map((item) => item.id));
  const todayEvents = store.reminderEvents.filter((event) => patientIds.has(event.patientId));
  const totalTaken = todayEvents.filter((event) => event.status === "taken").length;
  const totalMissed = todayEvents.filter((event) => ["missed", "escalated"].includes(event.status)).length;
  const totalSent = todayEvents.filter((event) => ["sent", "taken", "snoozed", "missed", "escalated"].includes(event.status)).length;
  const pending = todayEvents.filter((event) => ["scheduled", "sent", "snoozed"].includes(event.status)).length;

  return {
    patients,
    todayEvents: todayEvents.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    messageLogs: store.messageLogs
      .filter((item) => patientIds.has(item.patientId ?? ""))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10),
    metrics: {
      activePatients: patients.length,
      totalTaken,
      totalMissed,
      pending,
      adherenceRate: totalSent ? Math.round((totalTaken / totalSent) * 100) : 0,
    },
  };
}

export function getPatientAdherence(patientId: string, from?: string, to?: string) {
  const store = getStore();
  const lowerBound = from ? new Date(from).getTime() : Date.now() - 1000 * 60 * 60 * 24 * 7;
  const upperBound = to ? new Date(to).getTime() : Date.now();
  const events = store.reminderEvents.filter((item) => {
    if (item.patientId !== patientId) {
      return false;
    }

    const created = new Date(item.createdAt).getTime();
    return created >= lowerBound && created <= upperBound;
  });

  return {
    patientId,
    from: new Date(lowerBound).toISOString(),
    to: new Date(upperBound).toISOString(),
    takenCount: events.filter((item) => item.status === "taken").length,
    missedCount: events.filter((item) => ["missed", "escalated"].includes(item.status)).length,
    delayedCount: events.filter((item) => item.wasDelayed).length,
    events,
  };
}

export function createWeeklySummary(patientId: string) {
  const adherence = getPatientAdherence(patientId);
  const summary: AdherenceSummary = {
    id: id("summary"),
    patientId,
    weekStart: adherence.from,
    takenCount: adherence.takenCount,
    missedCount: adherence.missedCount,
    delayedCount: adherence.delayedCount,
    createdAt: nowIso(),
  };

  getStore().adherenceSummaries.unshift(summary);
  return summary;
}
