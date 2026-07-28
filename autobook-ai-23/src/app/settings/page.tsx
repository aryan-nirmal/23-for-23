import { SettingsForm } from "@/components/settings-form";
import { getSettings } from "@/lib/store";

export default function SettingsPage() {
  const settings = getSettings();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-5">
        <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Manage Gmail connection and availability preferences
        </p>
      </header>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}