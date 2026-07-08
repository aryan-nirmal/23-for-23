import { getStore } from "@/lib/mock/store";
import {
  addMessageLog,
  buildEscalationCopy,
  buildReminderCopy,
  buildSummaryCopy,
  markReminderStatus,
  parseReplyIntent,
} from "@/lib/services/reminders";
import type { AdherenceSummary, ReminderEvent } from "@/lib/types";

export interface MessagingProvider {
  sendReminder(eventId: string): ReminderEvent | null;
  sendEscalation(eventId: string): ReminderEvent | null;
  sendWeeklySummary(summaryId: string): AdherenceSummary | null;
  parseInboundReply(eventId: string, replyText: string): ReminderEvent | null;
}

class MockMessagingProvider implements MessagingProvider {
  sendReminder(eventId: string) {
    const store = getStore();
    const event = store.reminderEvents.find((item) => item.id === eventId);

    if (!event) {
      return null;
    }

    const medication = store.medications.find((item) => item.id === event.medicationId);
    const patient = store.patients.find((item) => item.id === event.patientId);
    const caregiver = store.caregivers.find((item) => item.id === patient?.caregiverId);

    if (!medication || !patient || !caregiver) {
      markReminderStatus(eventId, "failed");
      return null;
    }

    markReminderStatus(eventId, "sent", { sentAt: new Date().toISOString() });
    addMessageLog({
      accountId: patient.accountId,
      patientId: patient.id,
      caregiverId: caregiver.id,
      reminderEventId: event.id,
      direction: "outbound",
      kind: "reminder",
      channel: "mock_whatsapp",
      content: buildReminderCopy(medication),
      payload: { patientPhone: patient.phone, medicationId: medication.id },
      deliveryStatus: "delivered",
    });

    return event;
  }

  sendEscalation(eventId: string) {
    const store = getStore();
    const event = store.reminderEvents.find((item) => item.id === eventId);

    if (!event) {
      return null;
    }

    const medication = store.medications.find((item) => item.id === event.medicationId);
    const patient = store.patients.find((item) => item.id === event.patientId);
    const caregiver = store.caregivers.find((item) => item.id === patient?.caregiverId);

    if (!medication || !patient || !caregiver) {
      return null;
    }

    markReminderStatus(eventId, "escalated", { escalatedAt: new Date().toISOString() });
    addMessageLog({
      accountId: patient.accountId,
      patientId: patient.id,
      caregiverId: caregiver.id,
      reminderEventId: event.id,
      direction: "outbound",
      kind: "escalation",
      channel: "mock_whatsapp",
      content: buildEscalationCopy(patient.name, medication.name),
      payload: { caregiverPhone: caregiver.phone, medicationId: medication.id },
      deliveryStatus: "delivered",
    });

    return event;
  }

  sendWeeklySummary(summaryId: string) {
    const store = getStore();
    const summary = store.adherenceSummaries.find((item) => item.id === summaryId);

    if (!summary) {
      return null;
    }

    const patient = store.patients.find((item) => item.id === summary.patientId);
    const caregiver = store.caregivers.find((item) => item.id === patient?.caregiverId);

    if (!patient || !caregiver) {
      return null;
    }

    addMessageLog({
      accountId: patient.accountId,
      patientId: patient.id,
      caregiverId: caregiver.id,
      direction: "outbound",
      kind: "summary",
      channel: "mock_whatsapp",
      content: buildSummaryCopy(patient.name, summary),
      payload: { weekStart: summary.weekStart },
      deliveryStatus: "delivered",
    });

    return summary;
  }

  parseInboundReply(eventId: string, replyText: string) {
    const store = getStore();
    const event = store.reminderEvents.find((item) => item.id === eventId);

    if (!event) {
      return null;
    }

    const patient = store.patients.find((item) => item.id === event.patientId);

    if (!patient) {
      return null;
    }

    const parsed = parseReplyIntent(replyText);

    addMessageLog({
      accountId: patient.accountId,
      patientId: patient.id,
      caregiverId: patient.caregiverId,
      reminderEventId: event.id,
      direction: "inbound",
      kind: "reply",
      channel: "mock_whatsapp",
      content: parsed.normalized,
      payload: { rawReply: replyText },
      deliveryStatus: "delivered",
    });

    if (parsed.intent === "taken") {
      return markReminderStatus(eventId, "taken", {
        acknowledgedAt: new Date().toISOString(),
        replyText: parsed.normalized,
      });
    }

    if (parsed.intent === "snooze") {
      const deferredDueAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      return markReminderStatus(eventId, "snoozed", {
        dueAt: deferredDueAt,
        wasDelayed: true,
        replyText: parsed.normalized,
      });
    }

    return markReminderStatus(eventId, event.status, { replyText: parsed.normalized });
  }
}

export const messagingProvider = new MockMessagingProvider();
