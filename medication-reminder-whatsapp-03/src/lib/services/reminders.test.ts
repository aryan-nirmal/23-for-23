import { getStore } from "@/lib/mock/store";
import { getLocalParts, parseReplyIntent, processDueReminders } from "@/lib/services/reminders";

describe("reply parsing", () => {
  it("normalizes taken aliases", () => {
    expect(parseReplyIntent(" yes ")).toEqual({ normalized: "YES", intent: "taken" });
    expect(parseReplyIntent("done")).toEqual({ normalized: "DONE", intent: "taken" });
  });

  it("normalizes snooze aliases", () => {
    expect(parseReplyIntent("snooze")).toEqual({ normalized: "SNOOZE", intent: "snooze" });
    expect(parseReplyIntent("later")).toEqual({ normalized: "LATER", intent: "snooze" });
  });
});

describe("timezone-aware local parts", () => {
  it("derives local clock values across timezones", () => {
    const fixed = new Date("2026-04-29T12:00:00.000Z");
    expect(getLocalParts(fixed, "Asia/Kolkata")).toMatchObject({
      hour: "17",
      minute: "30",
      dateKey: "2026-04-29",
    });
    expect(getLocalParts(fixed, "Europe/London")).toMatchObject({
      hour: "13",
      minute: "00",
    });
  });
});

describe("reminder processing", () => {
  it("creates only one due reminder per schedule per local day", () => {
    (globalThis as typeof globalThis & { __wmwStore?: ReturnType<typeof getStore> }).__wmwStore = undefined;

    const runAt = new Date("2026-04-29T15:00:00.000Z");
    const firstRun = processDueReminders(runAt);
    const secondRun = processDueReminders(runAt);

    expect(firstRun.length).toBeGreaterThan(0);
    expect(secondRun).toHaveLength(0);
  });
});
