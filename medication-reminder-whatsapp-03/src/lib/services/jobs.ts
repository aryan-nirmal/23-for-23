import { getStore } from "@/lib/mock/store";
import { messagingProvider } from "@/lib/services/messaging";
import {
  collectOverdueEvents,
  markReminderStatus,
  processDueReminders,
} from "@/lib/services/reminders";
import { createWeeklySummary } from "@/lib/services/patients";

export function runReminderJob() {
  const events = processDueReminders();
  const sent = events.map((event) => messagingProvider.sendReminder(event.id)).filter(Boolean);
  return { created: events.length, sent: sent.length, events };
}

export function runEscalationJob() {
  const overdue = collectOverdueEvents();
  overdue.forEach((event) => {
    if (event.status === "sent" || event.status === "snoozed") {
      markReminderStatus(event.id, "missed");
      messagingProvider.sendEscalation(event.id);
    }
  });

  return { escalated: overdue.length, events: overdue };
}

export function runSummaryJob() {
  const store = getStore();
  const summaries = store.patients.map((patient) => createWeeklySummary(patient.id));

  summaries.forEach((summary) => {
    messagingProvider.sendWeeklySummary(summary.id);
  });

  return { summariesCreated: summaries.length, summaries };
}
