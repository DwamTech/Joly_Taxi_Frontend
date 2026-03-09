"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import AccountSettingsHero from "@/components/dashboard/AccountSettings/AccountSettingsHero/AccountSettingsHero";
import AccountSettingsForm from "@/components/dashboard/AccountSettings/AccountSettingsForm/AccountSettingsForm";
import "./settings.css";

function AccountSettingsContent() {
  return (
    <div className="settings-page">
      <AccountSettingsHero />
      <AccountSettingsForm />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <AccountSettingsContent />
    </ToastProvider>
  );
}
