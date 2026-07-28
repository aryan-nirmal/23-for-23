import {
  addDays,
  format,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { getEvents, getSettings } from "@/lib/store";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);

export default function CalendarPage() {
  const settings = getSettings();
  const events = getEvents();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  function getEventsForCell(day: Date, hour: number) {
    const cellStart = setMinutes(setHours(day, hour), 0);
    const cellEnd = setMinutes(setHours(day, hour + 1), 0);

    return events.filter((ev) => {
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      return evStart < cellEnd && evEnd > cellStart;
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Calendar</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Week of {format(weekStart, "MMM d, yyyy")} · Mon–Fri{" "}
              {settings.workingHours.startHour}:00–
              {settings.workingHours.endHour}:00
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-violet-500/40 border border-violet-500/60" />
              Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-700 border border-zinc-600" />
              Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-900 border border-zinc-800" />
              Available
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-[700px] overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-zinc-800 bg-zinc-900">
            <div className="p-3" />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="border-l border-zinc-800 p-3 text-center"
              >
                <p className="text-xs text-zinc-500">{format(day, "EEE")}</p>
                <p className="text-sm font-medium text-zinc-200">
                  {format(day, "MMM d")}
                </p>
              </div>
            ))}
          </div>

          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-zinc-800/60 last:border-0"
            >
              <div className="flex items-start justify-end px-2 py-2 text-xs text-zinc-600">
                {format(setHours(new Date(), hour), "h a")}
              </div>
              {days.map((day) => {
                const cellEvents = getEventsForCell(day, hour);
                const hasBooked = cellEvents.some((e) => e.type === "booked");
                const hasBlocked = cellEvents.some(
                  (e) => e.type === "blocked"
                );

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={cn(
                      "relative min-h-[52px] border-l border-zinc-800/60 p-1",
                      hasBooked
                        ? "bg-violet-500/10"
                        : hasBlocked
                          ? "bg-zinc-800/60"
                          : "bg-zinc-950"
                    )}
                  >
                    {cellEvents.map((ev) => {
                      const evStart = new Date(ev.start);
                      if (evStart.getHours() !== hour) return null;
                      return (
                        <div
                          key={ev.id}
                          className={cn(
                            "rounded px-1.5 py-1 text-xs leading-tight",
                            ev.type === "booked"
                              ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                              : "bg-zinc-700/80 text-zinc-300 border border-zinc-600/60"
                          )}
                        >
                          <p className="truncate font-medium">{ev.title}</p>
                          <p className="truncate text-[10px] opacity-70">
                            {format(evStart, "h:mm a")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {events.filter((e) => e.type === "booked").length === 0 && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-500">
            <CalendarIcon className="h-5 w-5 shrink-0" />
            No confirmed bookings yet. Head to the inbox to confirm a meeting.
          </div>
        )}
      </div>
    </div>
  );
}