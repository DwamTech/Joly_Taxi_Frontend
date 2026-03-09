"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import AppSettings from "../../SettingsManagement/GeneralSettings/GeneralSettings";
import SecuritySettings from "../../SettingsManagement/SecuritySettings/SecuritySettings";
import SystemSettings from "../../SettingsManagement/SystemSettings/SystemSettings";
import settingsData from "@/data/settings/settings-data.json";
import "./GeneralSettingsContent.css";

export default function GeneralSettingsContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("app");
  const [data, setData] = useState(settingsData);

  const handleSaveApp = (newData: any) => {
    setData({ ...data, ...newData });
    console.log("Saving app settings:", newData);
  };

  const handleSaveSecurity = (newData: any) => {
    setData({ ...data, ...newData });
    console.log("Saving security settings:", newData);
  };

  const handleSaveSystem = (newData: any) => {
    setData({ ...data, ...newData });
    console.log("Saving system settings:", newData);
  };

  return (
    <div className="general-settings-content">
      <div className="general-settings-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "app" ? "active" : ""}`}
            onClick={() => setActiveTab("app")}
          >
            ⚙️ الإعدادات العامة
          </button>
          <button
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🔒 الأمان والخصوصية
          </button>
          <button
            className={`tab-button ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            🛠️ النظام والنسخ الاحتياطي
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "app" && (
            <AppSettings data={data} onSave={handleSaveApp} />
          )}
          {activeTab === "security" && (
            <SecuritySettings data={data} onSave={handleSaveSecurity} />
          )}
          {activeTab === "system" && (
            <SystemSettings data={data} onSave={handleSaveSystem} />
          )}
        </div>
      </div>
    </div>
  );
}
