export type ExtensionMessage =
  | { type: "linkedin.extract" }
  | { type: "gmail.extractThread" }
  | { type: "gmail.insertDraft"; payload: { subject: string; body: string } }
  | { type: "background.getActiveContext" }
  | { type: "background.extractCurrentPage" }
  | { type: "background.generateDraft"; payload: unknown }
  | { type: "background.getStore" }
  | { type: "background.updateSettings"; payload: unknown }
  | { type: "background.savePitch"; payload: unknown }
  | { type: "background.deletePitch"; payload: { id: string } }
  | { type: "background.insertIntoGmail"; payload: { subject: string; body: string } }
  | { type: "background.importStore"; payload: unknown };
