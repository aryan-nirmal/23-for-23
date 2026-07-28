export type EmailStatus = "new" | "proposed" | "confirmed";

export interface BookingIntent {
  summary: string;
  confidence: number;
  preferredDates: string[];
  durationMinutes: number;
  attendeeName: string;
  attendeeEmail: string;
  meetingType: string;
}

export interface BookingEmail {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  receivedAt: string;
  intent: BookingIntent;
  status: EmailStatus;
  proposedSlots: string[];
  confirmedSlot?: string;
  proposalText?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  emailId?: string;
  type: "blocked" | "booked";
}

export interface WorkingHours {
  startHour: number;
  endHour: number;
  days: number[];
}

export interface AppSettings {
  gmailConnected: boolean;
  gmailEmail: string;
  workingHours: WorkingHours;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}