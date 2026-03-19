"use client";

import { useState, useEffect, useMemo } from "react";
import { Subscription, SubscriptionStatus } from "@/models/Subscription";
import { ToastProvider, useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Pagination from "@/components/Pagination/Pagination";
import SubscriptionsHero from "@/components/dashboard/SubscriptionsManagement/SubscriptionsHero/SubscriptionsHero";
import SubscriptionsFilters, {
  SubscriptionFilterValues,
} from "@/components/dashboard/SubscriptionsManagement/SubscriptionsFilters/SubscriptionsFilters";
import SubscriptionsTable from "@/components/dashboard/SubscriptionsManagement/SubscriptionsTable/SubscriptionsTable";
import SubscriptionDetailsModal from "@/components/dashboard/SubscriptionsManagement/SubscriptionDetailsModal/SubscriptionDetailsModal";
import ExtendSubscriptionModal from "@/components/dashboard/SubscriptionsManagement/ExtendSubscriptionModal/ExtendSubscriptionModal";
import CreateSubscriptionModal from "@/components/dashboard/SubscriptionsManagement/CreateSubscriptionModal/CreateSubscriptionModal";
import { exportSubscriptionsToExcel } from "@/utils/exportSubscriptionsToExcel";
import {
  createOrRenewAdminSubscription,
  getAdminSubscriptionById,
  getAdminSubscriptions,
} from "@/services/subscriptionsService";
import { deleteAdminSubscription } from "@/services/subscriptionsDeleteService";
import { extendAdminSubscription } from "@/services/subscriptionsExtendService";
import { updateAdminSubscriptionStatus } from "@/services/subscriptionsStatusService";
import { sendSubscriptionRenewalReminder } from "@/services/subscriptionNotificationsService";
import { getUsers, convertToUIUser } from "@/services/usersService";
import { User } from "@/models/User";
import { VehicleType } from "@/models/VehicleType";
import { getAdminVehicleTypes } from "@/services/vehicleTypesService";
import "./subscriptions.css";

function SubscriptionsManagementContent() {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [paginatedSubscriptions, setPaginatedSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [showCreateSubscriptionModal, setShowCreateSubscriptionModal] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [extendingSubscription, setExtendingSubscription] = useState<Subscription | null>(null);
  const [actionConfirm, setActionConfirm] = useState<{
    show: boolean;
    type: "activate" | "reject" | "extend" | "cancel" | "delete";
    subscriptionId: number;
    subscriptionNumber: string;
  }>({
    show: false,
    type: "activate",
    subscriptionId: 0,
    subscriptionNumber: "",
  });
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [filters, setFilters] = useState<SubscriptionFilterValues>({
    search: "",
    driverName: "",
    status: "all",
    vehicleType: "all",
    sortBy: "newest",
  });

  const loadAllSubscriptions = async () => {
    const firstPage = await getAdminSubscriptions(1);
    let all = [...firstPage.subscriptions];
    for (let p = 2; p <= firstPage.pagination.lastPage; p += 1) {
      const pageResult = await getAdminSubscriptions(p);
      all = all.concat(pageResult.subscriptions);
    }
    return all;
  };

  // Load subscriptions from API
  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const all = await loadAllSubscriptions();
        if (!isActive) return;
        setSubscriptions(all);
        setFilteredSubscriptions(all);
      } catch (error: any) {
        if (!isActive) return;
        showToast(error?.message || "فشل في جلب الاشتراكات", "error");
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [showToast]);

  // Load users for subscription creation
  useEffect(() => {
    let isActive = true;
    const loadUsers = async () => {
      try {
        const response = await getUsers(1);
        if (!isActive) return;
        const apiUsers = Array.isArray(response?.data) ? response.data : [];
        setUsers(apiUsers.map(convertToUIUser));
      } catch {
        if (!isActive) return;
        setUsers([]);
      }
    };
    loadUsers();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadVehicleTypes = async () => {
      try {
        const types = await getAdminVehicleTypes();
        if (!isActive) return;
        setVehicleTypes(types.filter((type) => type.requires_subscription));
      } catch {
        if (!isActive) return;
        setVehicleTypes([]);
      }
    };
    loadVehicleTypes();
    return () => {
      isActive = false;
    };
  }, []);

  // Calculate stats for hero
  const subscriptionStats = useMemo(() => {
    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
      pendingSubscriptions: subscriptions.filter((s) => s.status === "pending").length,
    };
  }, [subscriptions]);

  // Apply filters
  useEffect(() => {
    let result = [...subscriptions];

    // Search by subscription number
    if (filters.search) {
      result = result.filter((subscription) =>
        subscription.subscription_number
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    // Search by driver name
    if (filters.driverName) {
      result = result.filter((subscription) =>
        subscription.driver.name
          .toLowerCase()
          .includes(filters.driverName.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((subscription) => subscription.status === filters.status);
    }

    // Filter by vehicle type
    if (filters.vehicleType !== "all") {
      result = result.filter(
        (subscription) => subscription.vehicle_type === filters.vehicleType
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "expiring_soon":
        result.sort((a, b) => {
          const aDays = a.days_remaining ?? Infinity;
          const bDays = b.days_remaining ?? Infinity;
          return aDays - bDays;
        });
        break;
    }

    setFilteredSubscriptions(result);
    setCurrentPage(1);
  }, [filters, subscriptions]);

  // Apply pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedSubscriptions(filteredSubscriptions.slice(startIndex, endIndex));
  }, [currentPage, filteredSubscriptions, itemsPerPage]);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: SubscriptionFilterValues) => {
    setFilters(newFilters);
  };

  const handleViewSubscription = async (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    try {
      const details = await getAdminSubscriptionById(subscription.id);
      setSelectedSubscription(details);
    } catch (error: any) {
      showToast(error?.message || "فشل في جلب تفاصيل الاشتراك", "error");
    }
  };

  const refreshSubscriptions = async () => {
    try {
      const all = await loadAllSubscriptions();
      setSubscriptions(all);
      setFilteredSubscriptions(all);
    } catch (error: any) {
      showToast(error?.message || "فشل في تحديث الاشتراكات", "error");
    }
  };

  const handleExportData = () => {
    exportSubscriptionsToExcel(filteredSubscriptions);
    showToast("تم تصدير البيانات بنجاح", "success");
  };

  const handleActivateSubscription = (subscriptionId: number) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      setActionConfirm({
        show: true,
        type: "activate",
        subscriptionId,
        subscriptionNumber: subscription.subscription_number,
      });
    }
  };

  const handleRejectSubscription = (subscriptionId: number) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      setActionConfirm({
        show: true,
        type: "reject",
        subscriptionId,
        subscriptionNumber: subscription.subscription_number,
      });
    }
  };

  const handleExtendSubscription = (subscriptionId: number) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      setExtendingSubscription(subscription);
      setSelectedSubscription(null);
    }
  };

  const confirmExtendSubscription = async (subscriptionId: number, additionalMonths: number) => {
    try {
      const current = subscriptions.find((s) => s.id === subscriptionId);
      const newTotalMonths = current ? current.months_count + additionalMonths : undefined;
      const message = await extendAdminSubscription(subscriptionId, additionalMonths, newTotalMonths);
      showToast(message, "success");
      await refreshSubscriptions();
    } catch (error: any) {
      showToast(error?.message || "فشل في تمديد الاشتراك", "error");
    } finally {
      setExtendingSubscription(null);
    }
  };

  const handleDeleteSubscription = (subscriptionId: number) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      setActionConfirm({
        show: true,
        type: "delete",
        subscriptionId,
        subscriptionNumber: subscription.subscription_number,
      });
    }
  };

  const handleSendNotification = async () => {
    if (isSendingNotification) return; // منع الضغط المتكرر
    
    setIsSendingNotification(true);
    try {
      const result = await sendSubscriptionRenewalReminder();
      
      // عرض رسالة نجاح مبسطة وواضحة
      const stats = result.data;
      
      if (stats.notifications_sent > 0) {
        showToast(
          `تم إرسال تذكير التجديد بنجاح! ✅\n\n` +
          `📊 تم الإرسال: ${stats.notifications_sent} من أصل ${stats.total_subscriptions}\n` +
          `⏰ للاشتراكات المنتهية خلال ${stats.days_before_expiry} أيام`,
          "success"
        );
      } else {
        showToast(
          `لا توجد اشتراكات تحتاج تذكير حالياً ℹ️\n\n` +
          `📋 تم فحص ${stats.total_subscriptions} اشتراك`,
          "info"
        );
      }
      
      // معلومات إضافية في console للمطورين
      console.log("تفاصيل إرسال الإشعار:", {
        message: result.message,
        totalSubscriptions: stats.total_subscriptions,
        sent: stats.notifications_sent,
        failed: stats.notifications_failed,
        daysBeforeExpiry: stats.days_before_expiry,
        subscriptions: stats.subscriptions
      });
      
    } catch (error: any) {
      // رسالة خطأ واضحة ومفيدة
      const errorMessage = error?.message || "حدث خطأ غير متوقع";
      
      if (errorMessage.includes("422") || errorMessage.includes("Unprocessable")) {
        showToast(
          `خطأ في البيانات المرسلة ❌\n\n` +
          `🔧 يرجى المحاولة مرة أخرى أو التواصل مع الدعم التقني`,
          "error"
        );
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        showToast(
          `انتهت صلاحية الجلسة 🔒\n\n` +
          `🔄 يرجى تسجيل الدخول مرة أخرى`,
          "error"
        );
      } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        showToast(
          `ليس لديك صلاحية لإرسال الإشعارات ⛔\n\n` +
          `👤 يرجى التواصل مع المدير`,
          "error"
        );
      } else if (errorMessage.includes("500") || errorMessage.includes("Server Error")) {
        showToast(
          `خطأ في الخادم 🔧\n\n` +
          `⏳ يرجى المحاولة مرة أخرى بعد قليل`,
          "error"
        );
      } else if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        showToast(
          `مشكلة في الاتصال بالإنترنت 🌐\n\n` +
          `📶 تأكد من اتصالك وحاول مرة أخرى`,
          "error"
        );
      } else {
        showToast(
          `فشل في إرسال تذكير التجديد ❌\n\n` +
          `💬 ${errorMessage}`,
          "error"
        );
      }
      
      console.error("خطأ في إرسال تذكير التجديد:", error);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleOpenCreateSubscription = () => {
    setShowCreateSubscriptionModal(true);
  };

  const handleCreateSubscription = async (
    userId: number,
    subscriptionData: { months: number; vehicleTypeId: number }
  ) => {
    setIsCreatingSubscription(true);
    try {
      const result = await createOrRenewAdminSubscription({
        driver_id: userId,
        vehicle_type_id: subscriptionData.vehicleTypeId,
        months: subscriptionData.months,
      });

      setSubscriptions((prev) => {
        const withoutCurrent = prev.filter((item) => item.id !== result.subscription.id);
        return [result.subscription, ...withoutCurrent];
      });
      await refreshSubscriptions();
      setShowCreateSubscriptionModal(false);
      showToast(result.message || "تم إنشاء/تجديد الاشتراك بنجاح", "success");
      
    } catch (error: any) {
      showToast(error?.message || "فشل في إنشاء الاشتراك", "error");
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const handleChangeSubscriptionStatus = async (subscriptionId: number, status: SubscriptionStatus) => {
    if (status !== "active" && status !== "rejected") {
      return;
    }

    try {
      const updated = await updateAdminSubscriptionStatus(subscriptionId, status);
      setSubscriptions((prev) => prev.map((s) => (s.id === subscriptionId ? updated : s)));
      showToast("تم تحديث حالة الاشتراك بنجاح", "success");
    } catch (error: any) {
      showToast(error?.message || "فشل في تحديث حالة الاشتراك", "error");
    }
  };

  const confirmAction = async () => {
    const { type, subscriptionId } = actionConfirm;

    switch (type) {
      case "activate":
        try {
          const updated = await updateAdminSubscriptionStatus(
            subscriptionId,
            "active"
          );
          setSubscriptions((prev) =>
            prev.map((sub) => (sub.id === subscriptionId ? updated : sub))
          );
          showToast("تم تفعيل الاشتراك بنجاح", "success");
        } catch (error: any) {
          showToast(error?.message || "فشل في تفعيل الاشتراك", "error");
        }
        break;
      case "reject":
        try {
          const updated = await updateAdminSubscriptionStatus(
            subscriptionId,
            "rejected"
          );
          setSubscriptions((prev) =>
            prev.map((sub) => (sub.id === subscriptionId ? updated : sub))
          );
          showToast("تم رفض الاشتراك", "warning");
        } catch (error: any) {
          showToast(error?.message || "فشل في رفض الاشتراك", "error");
        }
        break;
      case "extend":
        // Handled by ExtendSubscriptionModal
        break;
      case "cancel":
        showToast("إلغاء الاشتراك غير مدعوم من الواجهة الحالية بعد", "warning");
        break;
      case "delete":
        try {
          const message = await deleteAdminSubscription(subscriptionId);
          setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
          showToast(message, "success");
        } catch (error: any) {
          showToast(error?.message || "فشل في حذف الاشتراك", "error");
        }
        break;
    }

    setActionConfirm({ show: false, type: "activate", subscriptionId: 0, subscriptionNumber: "" });
    setSelectedSubscription(null);
  };

  const cancelAction = () => {
    setActionConfirm({ show: false, type: "activate", subscriptionId: 0, subscriptionNumber: "" });
  };

  const getConfirmMessage = () => {
    const { type, subscriptionNumber } = actionConfirm;
    switch (type) {
      case "activate":
        return `هل أنت متأكد من تفعيل الاشتراك "${subscriptionNumber}"؟`;
      case "reject":
        return `هل أنت متأكد من رفض الاشتراك "${subscriptionNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`;
      case "cancel":
        return `هل أنت متأكد من إلغاء الاشتراك "${subscriptionNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`;
      case "delete":
        return `هل أنت متأكد من حذف الاشتراك "${subscriptionNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`;
      default:
        return "";
    }
  };

  return (
    <div className="subscriptions-management-page">
      <SubscriptionsHero
        totalSubscriptions={subscriptionStats.totalSubscriptions}
        activeSubscriptions={subscriptionStats.activeSubscriptions}
        pendingSubscriptions={subscriptionStats.pendingSubscriptions}
        onExportData={handleExportData}
      />

      <SubscriptionsFilters
        onFilterChange={handleFilterChange}
        resultsCount={filteredSubscriptions.length}
        onSendNotification={handleSendNotification}
        isSendingNotification={isSendingNotification}
        onOpenCreateSubscription={handleOpenCreateSubscription}
      />

      <SubscriptionsTable
        subscriptions={paginatedSubscriptions}
        onViewSubscription={handleViewSubscription}
        onActivateSubscription={handleActivateSubscription}
        onRejectSubscription={handleRejectSubscription}
        onExtendSubscription={handleExtendSubscription}
        onDeleteSubscription={handleDeleteSubscription}
        onChangeStatus={handleChangeSubscriptionStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredSubscriptions.length}
        itemsPerPage={itemsPerPage}
      />

      {selectedSubscription && (
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onActivate={handleActivateSubscription}
          onReject={handleRejectSubscription}
          onExtend={handleExtendSubscription}
          onSendNotification={handleSendNotification}
          onDelete={handleDeleteSubscription}
        />
      )}

      {extendingSubscription && (
        <ExtendSubscriptionModal
          subscription={extendingSubscription}
          onClose={() => setExtendingSubscription(null)}
          onConfirm={confirmExtendSubscription}
        />
      )}

      {showCreateSubscriptionModal && (
        <CreateSubscriptionModal
          isOpen={showCreateSubscriptionModal}
          onClose={() => setShowCreateSubscriptionModal(false)}
          onCreateSubscription={handleCreateSubscription}
          users={users}
          vehicleTypes={vehicleTypes}
          isLoading={isCreatingSubscription}
        />
      )}

      {actionConfirm.show && (
        <ConfirmDialog
          title="تأكيد الإجراء"
          message={getConfirmMessage()}
          confirmText="تأكيد"
          cancelText="إلغاء"
          type={actionConfirm.type === "reject" || actionConfirm.type === "cancel" || actionConfirm.type === "delete" ? "danger" : "warning"}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </div>
  );
}

export default function SubscriptionsManagementPage() {
  return (
    <ToastProvider>
      <SubscriptionsManagementContent />
    </ToastProvider>
  );
}
