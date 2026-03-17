"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { CreateAdminNotificationRequest } from "@/models/Notification";
import { notificationsService } from "@/services/notificationsService";
import NotificationsHero from "../NotificationsHero/NotificationsHero";
import SendNotificationForm from "../SendNotificationForm/SendNotificationForm";
import NotificationsHistory from "../NotificationsHistory/NotificationsHistory";
import NotificationTemplates from "../NotificationTemplates/NotificationTemplates";
import notificationsData from "@/data/notifications/notifications-data.json";
import "./NotificationsManagementContent.css";

export default function NotificationsManagementContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("send");
  const [sentNotifications, setSentNotifications] = useState(notificationsData.sentNotifications);
  const [templates, setTemplates] = useState(notificationsData.templates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const stats = {
    total: sentNotifications.length,
    today: sentNotifications.filter(
      (n) => new Date(n.sent_at).toDateString() === new Date().toDateString()
    ).length,
    failed: sentNotifications.filter((n) => n.status === "failed").length,
  };

  const handleSendNotification = async (data: CreateAdminNotificationRequest) => {
    try {
      const response = await notificationsService.createNotification(data);
      const newNotification = {
        id: response.data.notification_id,
        type: data.notification_type,
        title_ar: data.title_ar,
        title_en: data.title_en,
        body_ar: data.body_ar,
        body_en: data.body_en,
        recipient_type: data.recipient_type,
        recipient_count: response.data.total_recipients,
        sent_at: new Date().toISOString(),
        status: response.data.status,
        sent_via: ["database", "push"],
      };

      setSentNotifications((prev) => [newNotification, ...prev]);
      showToast(response.message || "تم إرسال الإشعار بنجاح", "success");
      setActiveTab("history");
    } catch (error: any) {
      showToast(error?.message || "فشل في إرسال الإشعار", "error");
    }
  };

  const handleResendNotification = (notificationId: number) => {
    showToast("تم إعادة إرسال الإشعار بنجاح", "success");
    console.log("Resending notification:", notificationId);
  };

  const handleDeleteNotification = (notificationId: number) => {
    setSentNotifications(sentNotifications.filter((n) => n.id !== notificationId));
  };

  const handleAddTemplate = (template: any) => {
    setTemplates([...templates, template]);
  };

  const handleEditTemplate = (updatedTemplate: any) => {
    setTemplates(
      templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
    );
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleUseTemplate = (selectedTemplateData: any) => {
    setSelectedTemplate(selectedTemplateData);
    setActiveTab("send");
    showToast("تم تحميل القالب في نموذج الإرسال", "success");
    console.log("Using template:", selectedTemplateData);
  };

  return (
    <div className="notifications-management-page">
      <NotificationsHero
        totalNotifications={stats.total}
        todayNotifications={stats.today}
        failedNotifications={stats.failed}
      />

      <div className="notifications-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "send" ? "active" : ""}`}
            onClick={() => setActiveTab("send")}
          >
            📤 إرسال إشعار جديد
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📋 سجل الإشعارات
          </button>
          {/*<button
            className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            📝 قوالب الإشعارات
          </button>*/}
        </div>

        <div className="tab-content">
          {activeTab === "send" && (
            <SendNotificationForm 
              onSubmit={handleSendNotification}
              templateData={selectedTemplate}
            />
          )}
          {activeTab === "history" && (
            <NotificationsHistory
              notifications={sentNotifications}
              onResend={handleResendNotification}
              onDelete={handleDeleteNotification}
            />
          )}
          {activeTab === "templates" && (
            <NotificationTemplates
              templates={templates}
              onAddTemplate={handleAddTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onUseTemplate={handleUseTemplate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
