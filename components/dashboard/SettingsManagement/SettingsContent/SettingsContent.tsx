"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import GeneralSettings from "../GeneralSettings/GeneralSettings";
import SecuritySettings from "../SecuritySettings/SecuritySettings";
import SystemSettings from "../SystemSettings/SystemSettings";
import settingsData from "@/data/settings/settings-data.json";
import "./SettingsContent.css";

export default function SettingsContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState(settingsData);

  const handleSaveGeneral = (newData: any) => {
    setData({ ...data, ...newData });
    console.log("Saving general settings:", newData);
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
    <div className="settings-content">
      <div className="settings-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
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
          {activeTab === "general" && (
            <GeneralSettings data={data} onSave={handleSaveGeneral} />
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
