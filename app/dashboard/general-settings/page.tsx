"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import GeneralSettingsHero from "@/components/dashboard/GeneralSettingsManagement/GeneralSettingsHero/GeneralSettingsHero";
import GeneralSettingsContent from "@/components/dashboard/GeneralSettingsManagement/GeneralSettingsContent/GeneralSettingsContent";
import "./general-settings.css";

function GeneralSettingsPageContent() {
  return (
    <div className="general-settings-page">
      <GeneralSettingsHero />
      <GeneralSettingsContent />
    </div>
  );
}

export default function GeneralSettingsPage() {
  return (
    <ToastProvider>
      <GeneralSettingsPageContent />
    </ToastProvider>
  );
}
