"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import Pagination from "@/components/Pagination/Pagination";
import { AdminNotificationItem } from "@/models/Notification";
import { adminNotificationsService } from "@/services/adminNotificationsService";
import "./NotificationsHistory.css";

interface Notification {
  id: number;
  type: string;
  notification_type?: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  recipient_type: string | null;
  recipient_count: number | null;
  sent_at: string | null;
  created_at?: string;
  status: string;
  sent_via: string[];
  user?: {
    id?: number;
    name?: string;
    phone?: string;
    role_name?: string;
    role?: string;
  } | null;
  recipient_summary?: string;
  recipient_names?: string[];
  recipient_ids?: number[] | null;
  is_read?: boolean;
  read_at?: string | null;
}

interface NotificationsHistoryProps {
  notifications: Notification[];
  adminSentNotifications?: AdminNotificationItem[];
  isLoadingAdminNotifications?: boolean;
  isLoadingIncomingAdminNotifications?: boolean;
  adminNotificationsCurrentPage?: number;
  adminNotificationsLastPage?: number;
  adminNotificationsTotal?: number;
  adminNotificationsPerPage?: number;
  onAdminNotificationsPageChange?: (page: number) => void;
  incomingAdminNotificationsCurrentPage?: number;
  incomingAdminNotificationsLastPage?: number;
  incomingAdminNotificationsTotal?: number;
  incomingAdminNotificationsPerPage?: number;
  onIncomingAdminNotificationsPageChange?: (page: number) => void;
  onResend: (id: number) => void;
  onDelete: (id: number) => Promise<void> | void;
  unreadNotificationsCount?: number;
  onMarkNotificationAsRead?: (id: number) => Promise<void> | void;
  onMarkAllNotificationsAsRead?: () => Promise<void> | void;
}

export default function NotificationsHistory({
  notifications,
  adminSentNotifications = [],
  isLoadingAdminNotifications = false,
  isLoadingIncomingAdminNotifications = false,
  adminNotificationsCurrentPage = 1,
  adminNotificationsLastPage = 1,
  adminNotificationsTotal = 0,
  adminNotificationsPerPage = 20,
  onAdminNotificationsPageChange,
  incomingAdminNotificationsCurrentPage = 1,
  incomingAdminNotificationsLastPage = 1,
  incomingAdminNotificationsTotal = 0,
  incomingAdminNotificationsPerPage = 20,
  onIncomingAdminNotificationsPageChange,
  onResend: _onResend,
  onDelete,
  unreadNotificationsCount = 0,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
}: NotificationsHistoryProps) {
  const { showToast } = useToast();
  const [historyTab, setHistoryTab] = useState<"admin_sent" | "sent_to_admin">("admin_sent");
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoadingNotificationDetails, setIsLoadingNotificationDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number }>({
    show: false,
    id: 0,
  });
  const [markingNotificationId, setMarkingNotificationId] = useState<number | null>(null);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const isSentToAdmin = (notif: Record<string, any>) => {
    const direction = String(notif?.direction || "").toLowerCase();
    if (direction === "to_admin" || direction === "sent_to_admin" || direction === "for_admin") {
      return true;
    }
    if (direction === "from_admin" || direction === "admin_sent") {
      return false;
    }
    const recipientType = String(notif?.recipient_type || "").toLowerCase();
    if (
      recipientType === "admin" ||
      recipientType === "admins" ||
      recipientType === "management" ||
      recipientType === "support"
    ) {
      return true;
    }
    const recipientRole = String(notif?.recipient_role || "").toLowerCase();
    if (recipientRole === "admin" || recipientRole === "admins") {
      return true;
    }
    const userRole = String(notif?.user?.role || notif?.user?.role_name || "").toLowerCase();
    if (userRole === "admin" || userRole === "management" || userRole === "support") {
      return true;
    }
    return false;
  };

  const notificationGroups = new Map<
    string,
    {
      base: AdminNotificationItem;
      users: Array<{ id?: number; name?: string; role?: string; role_name?: string; phone?: string }>;
      recipientIds: number[];
      recipientTypes: string[];
      roles: string[];
    }
  >();

  const getStatusPriority = (status: string) => {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "sent") {
      return 3;
    }
    if (normalized === "pending") {
      return 2;
    }
    if (normalized === "failed") {
      return 1;
    }
    return 0;
  };

  const inferRecipientTypeFromData = (notif: AdminNotificationItem) => {
    const data = notif.data || {};
    const targetGroup = String(
      (data as Record<string, any>)?.target_group || (data as Record<string, any>)?.recipient_type || ""
    )
      .trim()
      .toLowerCase();
    if (targetGroup === "all" || targetGroup === "drivers" || targetGroup === "riders") {
      return targetGroup;
    }
    return "";
  };

  const inferRecipientFromNotificationMeaning = (notif: AdminNotificationItem) => {
    const rawType = String(notif.notification_type || notif.type || "").toLowerCase();
    const text = `${notif.title_ar || ""} ${notif.title_en || ""} ${notif.body_ar || ""} ${notif.body_en || ""}`.toLowerCase();
    const isSubscriptionReminder =
      rawType.includes("subscription") ||
      text.includes("تجديد الاشتراك") ||
      text.includes("الاشتراك") ||
      text.includes("subscription");
    if (isSubscriptionReminder) {
      return "جميع السائقين";
    }
    return "غير محدد";
  };

  adminSentNotifications.forEach((notif) => {
    const recipientIdsKey = Array.isArray(notif.recipient_ids)
      ? [...notif.recipient_ids].sort((a, b) => a - b).join(",")
      : "";
    const userIdKey = String(notif.user?.id || notif.user_id || "");
    const eventTime = String(notif.sent_at || notif.created_at || "").slice(0, 16);
    const key = [
      String(notif.notification_type || ""),
      String(notif.type || ""),
      notif.title_ar || "",
      notif.title_en || "",
      notif.body_ar || "",
      notif.body_en || "",
      recipientIdsKey,
      userIdKey,
      eventTime,
    ].join("|");
    if (!notificationGroups.has(key)) {
      notificationGroups.set(key, {
        base: notif,
        users: [],
        recipientIds: [],
        recipientTypes: [],
        roles: [],
      });
    }
    const group = notificationGroups.get(key)!;
    if (getStatusPriority(notif.status) > getStatusPriority(group.base.status)) {
      group.base = notif;
    }
    if (notif.user?.id && !group.users.some((user) => user.id === notif.user?.id)) {
      group.users.push({
        id: notif.user.id,
        name: notif.user.name,
        phone: notif.user.phone,
        role_name: notif.user.role_name,
        role: notif.user.role,
      });
    } else if (notif.user?.name && !group.users.some((user) => user.name === notif.user?.name)) {
      group.users.push({
        id: notif.user.id,
        name: notif.user.name,
        phone: notif.user.phone,
        role_name: notif.user.role_name,
        role: notif.user.role,
      });
    }
    if (Array.isArray(notif.recipient_ids)) {
      notif.recipient_ids.forEach((id) => {
        if (!group.recipientIds.includes(id)) {
          group.recipientIds.push(id);
        }
      });
    }
    const recipientType = String(notif.recipient_type || "").toLowerCase();
    if (recipientType && !group.recipientTypes.includes(recipientType)) {
      group.recipientTypes.push(recipientType);
    }
    const inferredRecipientType = inferRecipientTypeFromData(notif);
    if (inferredRecipientType && !group.recipientTypes.includes(inferredRecipientType)) {
      group.recipientTypes.push(inferredRecipientType);
    }
    const userRole = String(notif.user?.role || "").toLowerCase();
    if (userRole && !group.roles.includes(userRole)) {
      group.roles.push(userRole);
    }
  });

  const getRecipientSummary = (
    notif: AdminNotificationItem,
    recipientTypes: string[],
    roles: string[],
    usersCount: number,
    recipientIdsCount: number
  ) => {
    if (recipientTypes.includes("all")) {
      return "جميع الركاب - جميع السائقين";
    }
    if (recipientTypes.includes("drivers")) {
      return "جميع السائقين";
    }
    if (recipientTypes.includes("riders")) {
      return "جميع الركاب";
    }
    if (recipientTypes.includes("custom")) {
      return "مجموعة مخصصة";
    }
    if (recipientTypes.includes("specific") && (recipientIdsCount > 1 || usersCount > 1)) {
      return "مجموعة مخصصة";
    }
    if (roles.length === 1 && roles[0] === "driver" && usersCount > 1) {
      return "جميع السائقين";
    }
    if (roles.length === 1 && roles[0] === "rider" && usersCount > 1) {
      return "جميع الركاب";
    }
    if (roles.includes("driver") && roles.includes("rider")) {
      return "جميع الركاب - جميع السائقين";
    }
    if (usersCount > 1 || recipientIdsCount > 1) {
      return "مجموعة مخصصة";
    }
    if (usersCount === 0 && recipientIdsCount === 0) {
      return inferRecipientFromNotificationMeaning(notif);
    }
    return "مستخدم محدد";
  };

  const inferNotificationType = (notif: AdminNotificationItem) => {
    const rawType = String(notif.notification_type || notif.type || "").trim().toLowerCase();
    const text = `${notif.title_ar || ""} ${notif.title_en || ""} ${notif.body_ar || ""} ${notif.body_en || ""}`.toLowerCase();
    const isWarningText = text.includes("تحذير") || text.includes("warning");
    if (rawType === "warning" || rawType === "warn") {
      return "warning";
    }
    if (rawType === "urgent" || rawType === "critical" || rawType === "high") {
      return "urgent";
    }
    if (isWarningText) {
      return "warning";
    }
    return "info";
  };

  const mappedAdminNotifications: Notification[] = Array.from(notificationGroups.values()).map((group) => {
    const rawRecipientSummary = getRecipientSummary(
      group.base,
      group.recipientTypes,
      group.roles,
      group.users.length,
      group.recipientIds.length
    );
    const singleRecipientId = group.recipientIds.length === 1 ? group.recipientIds[0] : null;
    const recipientSummary =
      rawRecipientSummary === "مستخدم محدد"
        ? group.users.length === 1 && group.users[0]?.name
          ? group.users[0].name
          : singleRecipientId
            ? `مستخدم #${singleRecipientId}`
            : "غير محدد"
        : rawRecipientSummary;
    return {
      id: group.base.id,
      type: group.base.type,
      notification_type: inferNotificationType(group.base),
      title_ar: group.base.title_ar,
      title_en: group.base.title_en,
      body_ar: group.base.body_ar,
      body_en: group.base.body_en,
      recipient_type: group.base.recipient_type,
      recipient_count: group.users.length || group.recipientIds.length || (group.base.user_id ? 1 : null),
      sent_at: group.base.sent_at,
      created_at: group.base.created_at,
      status: String(group.base.status || "pending"),
      sent_via: Array.isArray(group.base.sent_via) ? group.base.sent_via : [],
      recipient_summary: recipientSummary,
      recipient_names: group.users.map((user) => user.name || "").filter(Boolean),
      recipient_ids: group.recipientIds,
      is_read: Boolean(group.base.is_read),
      read_at: group.base.read_at,
      user:
        group.users.length === 1
          ? {
            id: group.users[0].id,
            name: group.users[0].name,
            phone: group.users[0].phone,
            role_name: group.users[0].role_name,
            role: group.users[0].role,
          }
          : null,
    };
  });

  const mappedAdminSentNotifications = mappedAdminNotifications.filter((notif) => !isSentToAdmin(notif));
  const mappedSentToAdminFromAdminNotifications = mappedAdminNotifications.filter((notif) =>
    isSentToAdmin(notif)
  );
  const mergedSentToAdminNotificationsMap = new Map<number, Notification>();
  mappedSentToAdminFromAdminNotifications.forEach((notif) => {
    mergedSentToAdminNotificationsMap.set(notif.id, notif);
  });
  notifications.forEach((notif) => {
    mergedSentToAdminNotificationsMap.set(notif.id, notif);
  });
  const mergedSentToAdminNotifications = Array.from(mergedSentToAdminNotificationsMap.values());

  const visibleNotifications =
    historyTab === "admin_sent" ? mappedAdminSentNotifications : mergedSentToAdminNotifications;

  const adminSentCount = mappedAdminSentNotifications.length;
  const sentToAdminCount =
    incomingAdminNotificationsTotal > 0
      ? Math.max(incomingAdminNotificationsTotal, mergedSentToAdminNotifications.length)
      : mergedSentToAdminNotifications.length;

  const filteredNotifications = visibleNotifications.filter((notif) => {
    if (filters.search && !notif.title_ar.includes(filters.search) && !notif.title_en.includes(filters.search)) {
      return false;
    }
    const rowType = normalizeNotificationType(String(notif.notification_type || notif.type || ""));
    if (filters.type !== "all" && rowType !== filters.type) {
      return false;
    }
    if (filters.status !== "all" && notif.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      sent: { label: "مرسل", color: "#27ae60" },
      pending: { label: "معلق", color: "#f39c12" },
      failed: { label: "فشل", color: "#e74c3c" },
    };
    const config = statusConfig[status] || statusConfig.sent;
    return (
      <span className="status-badge" style={{ background: config.color }}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const normalizedType = normalizeNotificationType(type);
    const typeConfig: any = {
      info: { label: "معلومة", color: "#3498db" },
      warning: { label: "تحذير", color: "#f39c12" },
      urgent: { label: "عاجل", color: "#e74c3c" },
    };
    const config = typeConfig[normalizedType] || typeConfig.info;
    return (
      <span className="type-badge" style={{ borderColor: config.color, color: config.color }}>
        {config.label}
      </span>
    );
  };

  function normalizeNotificationType(type: string) {
    const normalized = String(type || "").trim().toLowerCase();
    if (normalized === "warning" || normalized === "warn") {
      return "warning";
    }
    if (normalized === "urgent" || normalized === "critical" || normalized === "high") {
      return "urgent";
    }
    if (normalized === "info" || normalized === "information" || normalized === "normal") {
      return "info";
    }
    if (normalized.includes("warning") || normalized.includes("warn")) {
      return "warning";
    }
    return "info";
  }

  const getRecipientLabel = (notif: Notification) => {
    if (notif.recipient_summary) {
      return notif.recipient_summary;
    }
    const recipientType = String(notif.recipient_type || "").toLowerCase();
    if (recipientType === "all") {
      return "جميع الركاب - جميع السائقين";
    }
    if (recipientType === "drivers") {
      return "جميع السائقين";
    }
    if (recipientType === "riders") {
      return "جميع الركاب";
    }
    if (recipientType === "custom") {
      return "مجموعة مخصصة";
    }
    if (recipientType === "specific" && (notif.recipient_count || 0) > 1) {
      return "مجموعة مخصصة";
    }
    if (recipientType === "specific") {
      if (notif.user?.name) {
        return notif.user.name;
      }
      if (Array.isArray(notif.recipient_ids) && notif.recipient_ids.length === 1) {
        return `مستخدم #${notif.recipient_ids[0]}`;
      }
      return "غير محدد";
    }
    return notif.user?.name || "غير محدد";
  };

  const formatDate = (value?: string | null) => {
    if (!value) {
      return { date: "-", time: "" };
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return { date: "-", time: "" };
    }
    return {
      date: new Intl.DateTimeFormat("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date),
      time: new Intl.DateTimeFormat("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date),
    };
  };

  const mapNotificationFromApi = (notification: any): Notification => ({
    id: notification?.id,
    type: notification?.type || notification?.notification_type || "info",
    notification_type: notification?.notification_type || notification?.type || "info",
    title_ar: notification?.title_ar || "",
    title_en: notification?.title_en || "",
    body_ar: notification?.body_ar || "",
    body_en: notification?.body_en || "",
    recipient_type: notification?.recipient_type || null,
    recipient_count:
      typeof notification?.recipient_count === "number"
        ? notification.recipient_count
        : Array.isArray(notification?.recipient_ids)
          ? notification.recipient_ids.length
          : notification?.user_id
            ? 1
            : null,
    sent_at: notification?.sent_at || null,
    created_at: notification?.created_at || null,
    status: String(notification?.status || "sent"),
    sent_via: Array.isArray(notification?.sent_via) ? notification.sent_via : [],
    user: notification?.user || null,
    recipient_summary: notification?.recipient_summary,
    recipient_names: Array.isArray(notification?.recipient_names) ? notification.recipient_names : [],
    recipient_ids: Array.isArray(notification?.recipient_ids) ? notification.recipient_ids : null,
    is_read: Boolean(notification?.is_read),
    read_at: notification?.read_at || null,
  });

  const handleViewNotificationDetails = async (notif: Notification) => {
    let preparedNotification = notif;
    if (historyTab === "sent_to_admin" && !notif.is_read && onMarkNotificationAsRead) {
      try {
        setMarkingNotificationId(notif.id);
        await onMarkNotificationAsRead(notif.id);
        preparedNotification = {
          ...notif,
          is_read: true,
          read_at: new Date().toISOString(),
        };
      } catch (error: any) {
        showToast(error?.message || "فشل في تعليم الإشعار كمقروء", "error");
      } finally {
        setMarkingNotificationId(null);
      }
    }
    setSelectedNotification(preparedNotification);
    setIsLoadingNotificationDetails(true);
    try {
      const response = await adminNotificationsService.getAdminNotificationDetails(notif.id);
      const apiData =
        response && typeof response === "object" && "data" in response && response.data
          ? response.data
          : response;
      if (apiData && typeof apiData === "object") {
        setSelectedNotification(mapNotificationFromApi(apiData));
      }
    } catch (error: any) {
      showToast(error?.message || "فشل في جلب تفاصيل الإشعار", "error");
    } finally {
      setIsLoadingNotificationDetails(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!onMarkAllNotificationsAsRead || unreadNotificationsCount <= 0) {
      return;
    }
    try {
      setIsMarkingAllAsRead(true);
      await onMarkAllNotificationsAsRead();
      showToast("تم تعليم كل الإشعارات كمقروءة", "success");
    } catch (error: any) {
      showToast(error?.message || "فشل في تعليم كل الإشعارات كمقروءة", "error");
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await onDelete(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: 0 });
    } catch (error: any) {
      showToast(error?.message || "فشل في حذف الإشعار", "error");
    }
  };

  return (
    <div className="notifications-history">
      <div className="history-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="🔍 البحث بالعنوان..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <CustomSelect
          options={[
            { value: "all", label: "جميع الأنواع", icon: "📋" },
            { value: "info", label: "معلومة", icon: "ℹ️" },
            { value: "warning", label: "تحذير", icon: "⚠️" },
            { value: "urgent", label: "عاجل", icon: "🚨" },
          ]}
          value={filters.type}
          onChange={(value) => setFilters({ ...filters, type: value })}
        />
        <CustomSelect
          options={[
            { value: "all", label: "جميع الحالات", icon: "📊" },
            { value: "sent", label: "مرسل", icon: "✅" },
            { value: "pending", label: "معلق", icon: "⏳" },
            { value: "failed", label: "فشل", icon: "❌" },
          ]}
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
        />
        <div className="history-actions">
          <button
            type="button"
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            disabled={historyTab !== "sent_to_admin" || unreadNotificationsCount <= 0 || isMarkingAllAsRead}
          >
            {isMarkingAllAsRead
              ? "⏳ جاري التعليم..."
              : `✅ تعليم الكل كمقروء (${unreadNotificationsCount})`}
          </button>
        </div>
      </div>

      <div className="history-table-container">
        <div className="history-direction-tabs">
          <button
            className={`history-direction-tab ${historyTab === "admin_sent" ? "active" : ""}`}
            onClick={() => setHistoryTab("admin_sent")}
          >
            المرسل من الادمن ({adminSentCount})
          </button>
          <button
            className={`history-direction-tab ${historyTab === "sent_to_admin" ? "active" : ""}`}
            onClick={() => setHistoryTab("sent_to_admin")}
          >
            المرسل للادمن ({sentToAdminCount})
          </button>
        </div>
        {historyTab === "admin_sent" && isLoadingAdminNotifications && (
          <div className="history-loading-state">جاري تحميل إشعارات الادمن...</div>
        )}
        {historyTab === "sent_to_admin" && isLoadingIncomingAdminNotifications && (
          <div className="history-loading-state">جاري تحميل الإشعارات المرسلة للادمن...</div>
        )}
        <table className="history-table">
          <thead>
            <tr>
              <th>رقم الإشعار</th>
              <th>المستلمون</th>
              <th>النوع</th>
              <th>العنوان</th>
              <th>تاريخ الإرسال</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((notif) => {
              const dateTime = formatDate(notif.sent_at || notif.created_at);
              return (
                <tr key={notif.id}>
                  <td>#{notif.id}</td>
                  <td>
                    <div className="recipient-cell">
                      <span className="recipient-name">{getRecipientLabel(notif)}</span>
                      {!!notif.recipient_count && notif.recipient_count > 1 && (
                        <span className="recipient-meta">{notif.recipient_count} مستلم</span>
                      )}
                    </div>
                  </td>
                  <td>{getTypeBadge(String(notif.notification_type || notif.type || "info"))}</td>
                  <td>
                    <div className="notification-titles">
                      <div className="title-ar">{notif.title_ar}</div>
                    </div>
                  </td>
                  <td>
                    <div className="date-time-cell">
                      <span className="date-line">{dateTime.date}</span>
                      {dateTime.time && <span className="time-line">{dateTime.time}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      {historyTab === "admin_sent" && getStatusBadge(notif.status)}
                      {historyTab === "sent_to_admin" && (
                        <span className={`read-state-badge ${notif.is_read ? "is-read" : "is-unread"}`}>
                          {notif.is_read ? "مقروء" : "غير مقروء"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewNotificationDetails(notif)}
                        title="عرض التفاصيل"
                        disabled={markingNotificationId === notif.id}
                      >
                        {markingNotificationId === notif.id ? "⏳" : "👁️"}
                      </button>
                      {/*<button
                      className="action-btn resend-btn"
                      onClick={() => onResend(notif.id)}
                      title="إعادة إرسال"
                    >
                      🔄
                    </button>*/}
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(notif.id)}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredNotifications.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "1.5rem", color: "#7f8c8d" }}>
                  لا توجد إشعارات في هذا القسم
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {historyTab === "admin_sent" && adminNotificationsLastPage > 1 && (
        <Pagination
          currentPage={adminNotificationsCurrentPage}
          totalPages={adminNotificationsLastPage}
          onPageChange={(page) => onAdminNotificationsPageChange?.(page)}
          totalItems={adminNotificationsTotal || mappedAdminSentNotifications.length}
          itemsPerPage={adminNotificationsPerPage || 20}
          currentPageItemsCount={filteredNotifications.length}
        />
      )}
      {historyTab === "sent_to_admin" && incomingAdminNotificationsLastPage > 1 && (
        <Pagination
          currentPage={incomingAdminNotificationsCurrentPage}
          totalPages={incomingAdminNotificationsLastPage}
          onPageChange={(page) => onIncomingAdminNotificationsPageChange?.(page)}
          totalItems={sentToAdminCount}
          itemsPerPage={incomingAdminNotificationsPerPage || 20}
          currentPageItemsCount={filteredNotifications.length}
        />
      )}

      {selectedNotification && (
        <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>تفاصيل الإشعار</h3>
              <button className="modal-close" onClick={() => setSelectedNotification(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {isLoadingNotificationDetails && (
                <div className="history-loading-state">جاري تحميل تفاصيل الإشعار...</div>
              )}
              {!isLoadingNotificationDetails && (
                <>
                  <div className="detail-row">
                    <strong>النوع:</strong>{" "}
                    {getTypeBadge(String(selectedNotification.notification_type || selectedNotification.type || "info"))}
                  </div>
                  <div className="detail-row">
                    <strong>العنوان (عربي):</strong> {selectedNotification.title_ar}
                  </div>
                  <div className="detail-row">
                    <strong>العنوان (إنجليزي):</strong> {selectedNotification.title_en}
                  </div>
                  <div className="detail-row">
                    <strong>النص (عربي):</strong> {selectedNotification.body_ar}
                  </div>
                  <div className="detail-row">
                    <strong>النص (إنجليزي):</strong> {selectedNotification.body_en}
                  </div>
                  <div className="detail-row">
                    <strong>المستلمون:</strong> {getRecipientLabel(selectedNotification)}
                  </div>
                  {getRecipientLabel(selectedNotification) === "مجموعة مخصصة" &&
                    !!selectedNotification.recipient_names?.length && (
                      <div className="detail-row">
                        <strong>أسماء المجموعة:</strong> {selectedNotification.recipient_names.join("، ")}
                      </div>
                    )}
                  <div className="detail-row">
                    <strong>قنوات الإرسال:</strong> {selectedNotification.sent_via.join("، ")}
                  </div>
                  <div className="detail-row">
                    <strong>الحالة:</strong>{" "}
                    {historyTab === "sent_to_admin"
                      ? getStatusBadge("pending")
                      : getStatusBadge(selectedNotification.status)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا الإشعار؟"
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: 0 })}
        />
      )}
    </div>
  );
}
