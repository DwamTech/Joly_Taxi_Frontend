"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { AdminNotificationItem, CreateAdminNotificationRequest } from "@/models/Notification";
import { adminNotificationsService } from "@/services/adminNotificationsService";
import { notificationsService } from "@/services/notificationsService";
import NotificationsHero from "../NotificationsHero/NotificationsHero";
import SendNotificationForm from "../SendNotificationForm/SendNotificationForm";
import NotificationsHistory from "../NotificationsHistory/NotificationsHistory";
import NotificationTemplates from "../NotificationTemplates/NotificationTemplates";
import notificationsData from "@/data/notifications/notifications-data.json";
import "./NotificationsManagementContent.css";

export default function NotificationsManagementContent() {
  const adminNotificationsPerPage = 20;
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("send");
  const [sentNotifications, setSentNotifications] = useState(notificationsData.sentNotifications);
  const [templates, setTemplates] = useState(notificationsData.templates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isSendingHighCancellationWarning, setIsSendingHighCancellationWarning] = useState(false);
  const [adminSentNotifications, setAdminSentNotifications] = useState<AdminNotificationItem[]>([]);
  const [isLoadingAdminNotifications, setIsLoadingAdminNotifications] = useState(false);
  const [incomingAdminNotifications, setIncomingAdminNotifications] = useState<any[]>([]);
  const [isLoadingIncomingAdminNotifications, setIsLoadingIncomingAdminNotifications] = useState(false);
  const [adminNotificationsPagination, setAdminNotificationsPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  });
  const [incomingAdminNotificationsPagination, setIncomingAdminNotificationsPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  });
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const loadAdminNotifications = useCallback(
    async (page: number = 1, showError = true) => {
      setIsLoadingAdminNotifications(true);
      try {
        const response = await adminNotificationsService.getAdminNotifications(page, adminNotificationsPerPage);
        const pageData = response?.data;
        const list = Array.isArray(pageData?.data) ? pageData.data : [];
        setAdminSentNotifications(list);
        setAdminNotificationsPagination({
          currentPage: pageData?.current_page ?? page,
          lastPage: Math.max(1, pageData?.last_page ?? 1),
          perPage: pageData?.per_page ?? list.length,
          total: pageData?.total ?? list.length,
        });
      } catch (error: any) {
        if (showError) {
          showToast(error?.message || "فشل في جلب إشعارات الادمن", "error");
        }
      } finally {
        setIsLoadingAdminNotifications(false);
      }
    },
    [showToast]
  );

  const loadIncomingAdminNotifications = useCallback(
    async (page: number = 1, showError = true) => {
      setIsLoadingIncomingAdminNotifications(true);
      try {
        const response = await adminNotificationsService.getMyNotifications(page, adminNotificationsPerPage);
        const pageData = response?.data;
        const list = Array.isArray(pageData?.data) ? pageData.data : [];
        const mappedList = list.map((notification) => ({
          id: notification.id,
          type: notification.type || notification.notification_type || "info",
          notification_type: notification.notification_type || notification.type || "info",
          title_ar: notification.title_ar || "",
          title_en: notification.title_en || "",
          body_ar: notification.body_ar || "",
          body_en: notification.body_en || "",
          recipient_type: notification.recipient_type || "admin",
          recipient_count: 1,
          sent_at: notification.sent_at || notification.created_at || null,
          created_at: notification.created_at || null,
          status: String(notification.status || "sent"),
          sent_via: Array.isArray(notification.sent_via) ? notification.sent_via : [],
          user: notification.user || null,
          recipient_summary: notification.user?.name || "الادمن",
          recipient_ids: Array.isArray(notification.recipient_ids) ? notification.recipient_ids : null,
          is_read: Boolean(notification.is_read),
          read_at: notification.read_at || null,
        }));
        setIncomingAdminNotifications(mappedList);
        setIncomingAdminNotificationsPagination({
          currentPage: pageData?.current_page ?? page,
          lastPage: Math.max(1, pageData?.last_page ?? 1),
          perPage: pageData?.per_page ?? list.length,
          total: pageData?.total ?? list.length,
        });
      } catch (error: any) {
        if (showError) {
          showToast(error?.message || "فشل في جلب الإشعارات المرسلة للادمن", "error");
        }
      } finally {
        setIsLoadingIncomingAdminNotifications(false);
      }
    },
    [showToast]
  );

  const loadUnreadNotificationsCount = useCallback(
    async (showError = true) => {
      try {
        const count = await adminNotificationsService.getUnreadNotificationsCount();
        setUnreadNotificationsCount(count);
      } catch (error: any) {
        if (showError) {
          showToast(error?.message || "فشل في جلب عدد الإشعارات غير المقروءة", "error");
        }
      }
    },
    [showToast]
  );

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
      await loadAdminNotifications(1, false);
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

  const handleDeleteNotification = async (notificationId: number) => {
    await adminNotificationsService.deleteAdminNotification(notificationId);
    showToast("تم حذف الإشعار بنجاح", "success");
    await Promise.all([
      loadAdminNotifications(adminNotificationsPagination.currentPage, false),
      loadIncomingAdminNotifications(incomingAdminNotificationsPagination.currentPage, false),
    ]);
  };

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    await adminNotificationsService.markNotificationAsRead(notificationId);
    setIncomingAdminNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              is_read: true,
            }
          : notification
      )
    );
    await loadUnreadNotificationsCount(false);
  };

  const handleMarkAllNotificationsAsRead = async () => {
    await adminNotificationsService.markAllNotificationsAsRead();
    setIncomingAdminNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
    await Promise.all([
      loadIncomingAdminNotifications(incomingAdminNotificationsPagination.currentPage, false),
      loadUnreadNotificationsCount(false),
    ]);
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

  const handleSendHighCancellationWarning = async () => {
    setIsSendingHighCancellationWarning(true);
    try {
      const response = await notificationsService.sendHighCancellationWarning({
        target_group: "all",
        include_stats: true,
      });
      const sentCount = response?.data?.notifications_sent ?? 0;
      const failedCount = response?.data?.notifications_failed ?? 0;
      const threshold = response?.data?.threshold;
      showToast(
        `تم إرسال تحذير تعدد الإلغاء بنجاح (الحد: ${threshold ?? "-"} | تم الإرسال: ${sentCount} | فشل: ${failedCount})`,
        "success"
      );
      await loadAdminNotifications(1, false);
      setActiveTab("history");
    } catch (error: any) {
      showToast(error?.message || "فشل في إرسال تحذير تعدد الإلغاء", "error");
    } finally {
      setIsSendingHighCancellationWarning(false);
    }
  };

  useEffect(() => {
    loadAdminNotifications(1);
    loadIncomingAdminNotifications(1);
    loadUnreadNotificationsCount();
  }, [loadAdminNotifications, loadIncomingAdminNotifications, loadUnreadNotificationsCount]);

  const handleAdminNotificationsPageChange = async (page: number) => {
    const safePage = Math.max(1, Math.min(page, adminNotificationsPagination.lastPage || 1));
    await loadAdminNotifications(safePage);
  };

  const handleIncomingAdminNotificationsPageChange = async (page: number) => {
    const safePage = Math.max(1, Math.min(page, incomingAdminNotificationsPagination.lastPage || 1));
    await loadIncomingAdminNotifications(safePage);
  };

  return (
    <div className="notifications-management-page">
      <NotificationsHero
        totalNotifications={stats.total}
        todayNotifications={stats.today}
        failedNotifications={stats.failed}
        unreadNotifications={unreadNotificationsCount}
      />

      <div className="notifications-tabs">
        <div className="tabs-header">
          <div className="tabs-nav">
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
          </div>
          <button
            type="button"
            className="high-cancellation-btn"
            onClick={handleSendHighCancellationWarning}
            disabled={isSendingHighCancellationWarning}
          >
            {isSendingHighCancellationWarning
              ? "⏳ جاري إرسال التحذير..."
              : "🚨 إرسال إشعار تحذير لتعدد الإلغاء"}
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
              notifications={incomingAdminNotifications}
              adminSentNotifications={adminSentNotifications}
              isLoadingAdminNotifications={isLoadingAdminNotifications}
              isLoadingIncomingAdminNotifications={isLoadingIncomingAdminNotifications}
              adminNotificationsCurrentPage={adminNotificationsPagination.currentPage}
              adminNotificationsLastPage={adminNotificationsPagination.lastPage}
              adminNotificationsTotal={adminNotificationsPagination.total}
              adminNotificationsPerPage={adminNotificationsPagination.perPage}
              onAdminNotificationsPageChange={handleAdminNotificationsPageChange}
              incomingAdminNotificationsCurrentPage={incomingAdminNotificationsPagination.currentPage}
              incomingAdminNotificationsLastPage={incomingAdminNotificationsPagination.lastPage}
              incomingAdminNotificationsTotal={incomingAdminNotificationsPagination.total}
              incomingAdminNotificationsPerPage={incomingAdminNotificationsPagination.perPage}
              onIncomingAdminNotificationsPageChange={handleIncomingAdminNotificationsPageChange}
              onResend={handleResendNotification}
              onDelete={handleDeleteNotification}
              unreadNotificationsCount={unreadNotificationsCount}
              onMarkNotificationAsRead={handleMarkNotificationAsRead}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
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
