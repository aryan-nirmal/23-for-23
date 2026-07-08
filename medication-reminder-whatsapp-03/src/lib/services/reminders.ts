import type {
  Medication,
  MedicationSchedule,
  MessageLog,
  ReminderEvent,
  ReminderStatus,
} from "@/lib/types";
import { getStore } from "@/lib/mock/store";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function formatter(timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour12: false,
    ...options,
  });
}

export function getLocalParts(date: Date, timeZone: string) {
  const parts = formatter(timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
    weekday: lookup.weekday,
    hour: lookup.hour,
    minute: lookup.minute,
    dateKey: `${lookup.year}-${lookup.month}-${lookup.day}`,
  };
}

export function parseReplyIntent(reply: string) {
  const normalized = reply.trim().toUpperCase();

  if (["YES", "TAKEN", "DONE", "OK"].includes(normalized)) {
    return { normalized, intent: "taken" as const };
  }

  if (["SNOOZE", "LATER", "WAIT"].includes(normalized)) {
    return { normalized, intent: "snooze" as const };
  }

  return { normalized, intent: "unknown" as const };
}

function findScheduleMedication(schedule: MedicationSchedule) {
  const store = getStore();
  const medication = store.medications.find((item) => item.id === schedule.medicationId);

  if (!medication) {
    return null;
  }

  const patient = store.patients.find((item) => item.id === medication.patientId);

  if (!patient) {
    return null;
  }

  return { medication, patient };
}

export function buildReminderCopy(medication: Medication) {
  return `Time for ${medication.name} ${medication.doseText}. Reply YES once taken or SNOOZE if you need a few more minutes.`;
}

export function buildEscalationCopy(patientName: string, medicationName: string) {
  return `${patientName} has not confirmed ${medicationName} yet. Please check in with them.`;
}

export function buildSummaryCopy(
  patientName: string,
  summary: { takenCount: number; missedCount: number; delayedCount: number },
) {
  return `Weekly summary for ${patientName}: ${summary.takenCount} taken, ${summary.missedCount} missed, ${summary.delayedCount} delayed.`;
}

export function createReminderEvent(input: {
  scheduleId: string;
  patientId: string;
  medicationId: string;
  localDateKey: string;
}) {
  const event: ReminderEvent = {
    id: id("event"),
    patientId: input.patientId,
    medicationId: input.medicationId,
    scheduleId: input.scheduleId,
    dueAt: nowIso(),
    localDateKey: input.localDateKey,
    status: "scheduled",
    wasDelayed: false,
    createdAt: nowIso(),
  };

  getStore().reminderEvents.unshift(event);
  return event;
}

export function markReminderStatus(eventId: string, status: ReminderStatus, updates?: Partial<ReminderEvent>) {
  const event = getStore().reminderEvents.find((item) => item.id === eventId);

  if (!event) {
    return null;
  }

  event.status = status;
  Object.assign(event, updates);
  return event;
}

export function addMessageLog(log: Omit<MessageLog, "id" | "createdAt">) {
  const entry: MessageLog = {
    ...log,
    id: id("msg"),
    createdAt: nowIso(),
  };

  getStore().messageLogs.unshift(entry);
  return entry;
}

export function processDueReminders(currentDate = new Date()) {
  const store = getStore();
  const createdEvents: ReminderEvent[] = [];

  store.medicationSchedules.forEach((schedule) => {
    const relation = findScheduleMedication(schedule);

    if (!relation || !relation.medication.active || relation.patient.status !== "active") {
      return;
    }

    const local = getLocalParts(currentDate, relation.patient.timezone);
    const currentMinutes = Number(local.hour) * 60 + Number(local.minute);
    const [scheduledHour, scheduledMinute] = schedule.reminderTime.split(":").map(Number);
    const scheduledMinutes = scheduledHour * 60 + scheduledMinute;

    if (currentMinutes < scheduledMinutes) {
      return;
    }

    const existing = store.reminderEvents.find(
      (event) => event.scheduleId === schedule.id && event.localDateKey === local.dateKey,
    );

    if (existing) {
      return;
    }

    const event = createReminderEvent({
      scheduleId: schedule.id,
      patientId: relation.patient.id,
      medicationId: relation.medication.id,
      localDateKey: local.dateKey,
    });

    createdEvents.push(event);
  });

  return createdEvents;
}

export function collectOverdueEvents(currentDate = new Date()) {
  const store = getStore();

  return store.reminderEvents.filter((event) => {
    if (!["sent", "snoozed"].includes(event.status)) {
      return false;
    }

    const schedule = store.medicationSchedules.find((item) => item.id === event.scheduleId);

    if (!schedule) {
      return false;
    }

    const dueTime = new Date(event.dueAt).getTime();
    return currentDate.getTime() - dueTime >= schedule.graceMinutes * 60 * 1000;
  });
}
