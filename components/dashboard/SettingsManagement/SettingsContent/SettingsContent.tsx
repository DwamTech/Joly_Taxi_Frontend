"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import GeneralSettings from "../GeneralSettings/GeneralSettings";
import { AdminSettingsData, UpdateAdminSettingsPayload } from "@/models/Settings";
import { settingsService } from "@/services/settingsService";
import "./SettingsContent.css";

export default function SettingsContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState<AdminSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await settingsService.getSettings();
      setData(response.data);
    } catch (error: any) {
      const message = error?.message || "فشل في تحميل إعدادات النظام";
      setLoadError(message);
      showToast("تعذر تحميل الإعدادات، برجاء المحاولة مرة أخرى", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveGeneral = async (newData: UpdateAdminSettingsPayload) => {
    setIsSaving(true);
    try {
      const response = await settingsService.updateSettings(newData);
      if (response.data) {
        setData(response.data);
      } else {
        await loadSettings();
      }
      showToast("تم تحديث الإعدادات بنجاح", "success");
    } catch (error: any) {
      showToast("تعذر تحديث الإعدادات، برجاء مراجعة البيانات والمحاولة مرة أخرى", "error");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="settings-feedback-state">جاري تحميل الإعدادات من السيرفر...</div>;
  }

  if (!data) {
    return (
      <div className="settings-feedback-state error">
        <span>{loadError || "لا توجد بيانات إعدادات متاحة حالياً"}</span>
        <button className="retry-btn" onClick={loadSettings}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

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
          {/*<button
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
          </button>*/}
        </div>

        <div className="tab-content">
          {activeTab === "general" && (
            <GeneralSettings data={data} onSave={handleSaveGeneral} isSaving={isSaving} />
          )}
          {loadError && <div className="settings-inline-warning">{loadError}</div>}
        </div>
      </div>
    </div>
  );
}
