import {
  addDays,
  addMinutes,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns";
import { formatSlotRange } from "./utils";
import type {
  AppSettings,
  BookingEmail,
  CalendarEvent,
  TimeSlot,
} from "./types";

function getWeekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

function seedEmails(): BookingEmail[] {
  const now = new Date();
  return [
    {
      id: "email-1",
      from: "sarah.chen@acmecorp.com",
      fromName: "Sarah Chen",
      subject: "Quick sync next week?",
      body: `Hi there,

Hope you're doing well! I'd love to schedule a 30-minute call to discuss the Q3 partnership proposal. I'm flexible next Tuesday or Wednesday afternoon — whatever works best for you.

Looking forward to connecting!

Best,
Sarah Chen
Partnerships Lead, Acme Corp`,
      receivedAt: addDays(now, -1).toISOString(),
      intent: {
        summary: "30-min partnership sync requested for Tue/Wed afternoon",
        confidence: 0.94,
        preferredDates: ["Tuesday", "Wednesday"],
        durationMinutes: 30,
        attendeeName: "Sarah Chen",
        attendeeEmail: "sarah.chen@acmecorp.com",
        meetingType: "Video call",
      },
      status: "new",
      proposedSlots: [],
    },
    {
      id: "email-2",
      from: "marcus.j@startup.io",
      fromName: "Marcus Johnson",
      subject: "Demo request — Autobook AI",
      body: `Hello,

I came across Autobook AI and I'm really impressed. Would it be possible to book a 45-minute product demo sometime this week? I'm available Thursday or Friday morning.

Thanks,
Marcus`,
      receivedAt: addDays(now, -2).toISOString(),
      intent: {
        summary: "45-min product demo requested for Thu/Fri morning",
        confidence: 0.91,
        preferredDates: ["Thursday", "Friday"],
        durationMinutes: 45,
        attendeeName: "Marcus Johnson",
        attendeeEmail: "marcus.j@startup.io",
        meetingType: "Product demo",
      },
      status: "new",
      proposedSlots: [],
    },
    {
      id: "email-3",
      from: "elena.vasquez@design.co",
      fromName: "Elena Vasquez",
      subject: "Re: Design review session",
      body: `Hi,

Following up on our thread — can we lock in a 60-minute design review? I'm free Monday or Tuesday between 10am–2pm. Let me know what slots you have open.

Cheers,
Elena`,
      receivedAt: addDays(now, -3).toISOString(),
      intent: {
        summary: "60-min design review, prefers Mon/Tue 10am–2pm",
        confidence: 0.88,
        preferredDates: ["Monday", "Tuesday"],
        durationMinutes: 60,
        attendeeName: "Elena Vasquez",
        attendeeEmail: "elena.vasquez@design.co",
        meetingType: "Design review",
      },
      status: "proposed",
      proposedSlots: [],
      proposalText:
        "Hi Elena, thanks for reaching out! Here are a few times that work on my end...",
    },
    {
      id: "email-4",
      from: "james.wright@enterprise.com",
      fromName: "James Wright",
      subject: "Quarterly business review",
      body: `Team,

We need to schedule our QBR for next week. 90 minutes should suffice. Please propose some times — I'm flexible on Wednesday or Thursday.

Regards,
James Wright
VP Operations`,
      receivedAt: addDays(now, -0.5).toISOString(),
      intent: {
        summary: "90-min quarterly business review, Wed/Thu flexible",
        confidence: 0.96,
        preferredDates: ["Wednesday", "Thursday"],
        durationMinutes: 90,
        attendeeName: "James Wright",
        attendeeEmail: "james.wright@enterprise.com",
        meetingType: "QBR",
      },
      status: "new",
      proposedSlots: [],
    },
    {
      id: "email-5",
      from: "priya.patel@healthtech.com",
      fromName: "Priya Patel",
      subject: "Intro call — integration partnership",
      body: `Hi,

I'd love to set up a brief 30-minute intro call to explore a potential integration partnership. Are you available any day this week after 2pm?

Best,
Priya Patel`,
      receivedAt: addDays(now, -0.2).toISOString(),
      intent: {
        summary: "30-min intro call, prefers afternoons this week",
        confidence: 0.89,
        preferredDates: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        durationMinutes: 30,
        attendeeName: "Priya Patel",
        attendeeEmail: "priya.patel@healthtech.com",
        meetingType: "Intro call",
      },
      status: "new",
      proposedSlots: [],
    },
  ];
}

function seedBlockedEvents(): CalendarEvent[] {
  const weekStart = getWeekStart();
  const blocked: Array<{ day: number; startH: number; startM: number; durationMin: number; title: string }> = [
    { day: 0, startH: 10, startM: 0, durationMin: 60, title: "Team standup" },
    { day: 0, startH: 14, startM: 0, durationMin: 90, title: "Sprint planning" },
    { day: 1, startH: 9, startM: 0, durationMin: 30, title: "1:1 with manager" },
    { day: 1, startH: 13, startM: 0, durationMin: 60, title: "Lunch & learn" },
    { day: 2, startH: 11, startM: 0, durationMin: 120, title: "Client workshop" },
    { day: 3, startH: 9, startM: 30, durationMin: 60, title: "Product sync" },
    { day: 3, startH: 15, startM: 0, durationMin: 60, title: "Investor update" },
    { day: 4, startH: 10, startM: 0, durationMin: 90, title: "All-hands meeting" },
    { day: 4, startH: 14, startM: 30, durationMin: 30, title: "Weekly retro" },
  ];

  return blocked.map((b, i) => {
    const start = setMinutes(
      setHours(addDays(weekStart, b.day), b.startH),
      b.startM
    );
    const end = addMinutes(start, b.durationMin);
    return {
      id: `blocked-${i}`,
      title: b.title,
      start: start.toISOString(),
      end: end.toISOString(),
      type: "blocked" as const,
    };
  });
}

const defaultSettings: AppSettings = {
  gmailConnected: true,
  gmailEmail: "you@company.com",
  workingHours: {
    startHour: 9,
    endHour: 17,
    days: [1, 2, 3, 4, 5],
  },
};

interface Store {
  emails: BookingEmail[];
  events: CalendarEvent[];
  settings: AppSettings;
}

const globalStore = globalThis as typeof globalThis & { __autobookStore?: Store };

function getStore(): Store {
  if (!globalStore.__autobookStore) {
    globalStore.__autobookStore = {
      emails: seedEmails(),
      events: seedBlockedEvents(),
      settings: { ...defaultSettings, workingHours: { ...defaultSettings.workingHours, days: [...defaultSettings.workingHours.days] } },
    };
  }
  return globalStore.__autobookStore;
}

export function getEmails(): BookingEmail[] {
  return getStore().emails;
}

export function getEmailById(id: string): BookingEmail | undefined {
  return getStore().emails.find((e) => e.id === id);
}

export function getEvents(): CalendarEvent[] {
  return getStore().events;
}

export function getSettings(): AppSettings {
  return getStore().settings;
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  const store = getStore();
  store.settings = { ...store.settings, ...partial };
  if (partial.workingHours) {
    store.settings.workingHours = {
      ...store.settings.workingHours,
      ...partial.workingHours,
    };
  }
  return store.settings;
}

function slotOverlapsEvent(
  slotStart: Date,
  slotEnd: Date,
  events: CalendarEvent[]
): boolean {
  return events.some((ev) => {
    const evStart = new Date(ev.start);
    const evEnd = new Date(ev.end);
    return slotStart < evEnd && slotEnd > evStart;
  });
}

export function getAvailableSlots(
  durationMinutes: number,
  count = 5
): TimeSlot[] {
  const store = getStore();
  const { startHour, endHour, days } = store.settings.workingHours;
  const weekStart = getWeekStart();
  const slots: TimeSlot[] = [];

  for (let dayOffset = 0; dayOffset < 5 && slots.length < count; dayOffset++) {
    const day = addDays(weekStart, dayOffset);
    const dayOfWeek = day.getDay();
    if (!days.includes(dayOfWeek)) continue;

    for (let hour = startHour; hour < endHour && slots.length < count; hour++) {
      for (const minute of [0, 30]) {
        if (hour === endHour - 1 && minute === 30 && durationMinutes > 30)
          continue;

        const start = setMinutes(setHours(day, hour), minute);
        const end = addMinutes(start, durationMinutes);

        if (end.getHours() > endHour || (end.getHours() === endHour && end.getMinutes() > 0)) {
          continue;
        }

        const available = !slotOverlapsEvent(start, end, store.events);
        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          available,
        });

        if (slots.length >= count) break;
      }
    }
  }

  return slots.filter((s) => s.available).slice(0, count);
}

export function updateEmail(
  id: string,
  updates: Partial<BookingEmail>
): BookingEmail | undefined {
  const store = getStore();
  const index = store.emails.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  store.emails[index] = { ...store.emails[index], ...updates };
  return store.emails[index];
}

export function confirmBooking(
  emailId: string,
  slotStart: string
): { email: BookingEmail; event: CalendarEvent } | null {
  const email = getEmailById(emailId);
  if (!email) return null;

  const start = new Date(slotStart);
  const end = addMinutes(start, email.intent.durationMinutes);

  const event: CalendarEvent = {
    id: `booked-${emailId}-${Date.now()}`,
    title: `${email.intent.meetingType} — ${email.intent.attendeeName}`,
    start: start.toISOString(),
    end: end.toISOString(),
    emailId,
    type: "booked",
  };

  const store = getStore();
  store.events.push(event);

  const updated = updateEmail(emailId, {
    status: "confirmed",
    confirmedSlot: slotStart,
    proposedSlots: email.proposedSlots.length
      ? email.proposedSlots
      : [slotStart],
  });

  if (!updated) return null;
  return { email: updated, event };
}

export function generateProposalText(
  email: BookingEmail,
  slots: TimeSlot[]
): string {
  const slotLines = slots
    .map((s, i) => `  ${i + 1}. ${formatSlotRange(s.start, s.end)}`)
    .join("\n");

  return `Hi ${email.intent.attendeeName.split(" ")[0]},

Thank you for reaching out! I'd be happy to schedule our ${email.intent.durationMinutes}-minute ${email.intent.meetingType.toLowerCase()}.

Here are a few times that work on my end:

${slotLines}

Please let me know which option works best for you, and I'll send a calendar invite right away.

Best regards`;
}