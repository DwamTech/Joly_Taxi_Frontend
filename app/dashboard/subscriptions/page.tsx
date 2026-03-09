"use client";

import { useState, useEffect, useMemo } from "react";
import { Subscription } from "@/models/Subscription";
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
import mockData from "@/data/dashboard/mock-subscriptions.json";
import { exportSubscriptionsToExcel } from "@/utils/exportSubscriptionsToExcel";
import "./subscriptions.css";

function SubscriptionsManagementContent() {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [paginatedSubscriptions, setPaginatedSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [extendingSubscription, setExtendingSubscription] = useState<Subscription | null>(null);
  const [actionConfirm, setActionConfirm] = useState<{
    show: boolean;
    type: "activate" | "reject" | "extend" | "cancel";
    subscriptionId: number;
    subscriptionNumber: string;
  }>({
    show: false,
    type: "activate",
    subscriptionId: 0,
    subscriptionNumber: "",
  });
  const [filters, setFilters] = useState<SubscriptionFilterValues>({
    search: "",
    driverName: "",
    status: "all",
    vehicleType: "all",
    sortBy: "newest",
  });

  // Load subscriptions from mock data
  useEffect(() => {
    setSubscriptions(mockData.subscriptions as Subscription[]);
    setFilteredSubscriptions(mockData.subscriptions as Subscription[]);
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

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
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

  const confirmExtendSubscription = (subscriptionId: number, additionalMonths: number) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId && sub.end_date) {
          const currentEndDate = new Date(sub.end_date);
          const newEndDate = new Date(currentEndDate);
          newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);
          
          const pricePerMonth = sub.total_price / sub.months_count;
          const additionalPrice = pricePerMonth * additionalMonths;
          
          return {
            ...sub,
            months_count: sub.months_count + additionalMonths,
            total_price: sub.total_price + additionalPrice,
            end_date: newEndDate.toISOString(),
            days_remaining: Math.ceil(
              (newEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
          };
        }
        return sub;
      })
    );
    showToast(`تم تمديد الاشتراك لمدة ${additionalMonths} شهر بنجاح`, "success");
    setExtendingSubscription(null);
  };

  const handleCancelSubscription = (subscriptionId: number) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      setActionConfirm({
        show: true,
        type: "cancel",
        subscriptionId,
        subscriptionNumber: subscription.subscription_number,
      });
    }
  };

  const handleSendNotification = (driverId: number) => {
    showToast("سيتم فتح نافذة إرسال الإشعار قريباً", "info");
    // TODO: Open notification modal
    console.log("Send notification to driver:", driverId);
  };

  const confirmAction = () => {
    const { type, subscriptionId } = actionConfirm;

    switch (type) {
      case "activate":
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? {
                  ...sub,
                  status: "active" as const,
                  activated_at: new Date().toISOString(),
                  start_date: new Date().toISOString(),
                  end_date: new Date(
                    Date.now() + sub.months_count * 30 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  days_remaining: sub.months_count * 30,
                }
              : sub
          )
        );
        showToast("تم تفعيل الاشتراك بنجاح", "success");
        break;
      case "reject":
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? { ...sub, status: "rejected" as const, rejected_reason: "تم الرفض من قبل الإدارة" }
              : sub
          )
        );
        showToast("تم رفض الاشتراك", "warning");
        break;
      case "extend":
        // Handled by ExtendSubscriptionModal
        break;
      case "cancel":
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? {
                  ...sub,
                  status: "cancelled" as const,
                  cancelled_at: new Date().toISOString(),
                  cancelled_reason: "تم الإلغاء من قبل الإدارة",
                }
              : sub
          )
        );
        showToast("تم إلغاء الاشتراك", "warning");
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
      />

      <SubscriptionsTable
        subscriptions={paginatedSubscriptions}
        onViewSubscription={handleViewSubscription}
        onActivateSubscription={handleActivateSubscription}
        onRejectSubscription={handleRejectSubscription}
        onExtendSubscription={handleExtendSubscription}
        onCancelSubscription={handleCancelSubscription}
        onSendNotification={handleSendNotification}
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
          onCancel={handleCancelSubscription}
          onSendNotification={handleSendNotification}
        />
      )}

      {extendingSubscription && (
        <ExtendSubscriptionModal
          subscription={extendingSubscription}
          onClose={() => setExtendingSubscription(null)}
          onConfirm={confirmExtendSubscription}
        />
      )}

      {actionConfirm.show && (
        <ConfirmDialog
          title="تأكيد الإجراء"
          message={getConfirmMessage()}
          confirmText="تأكيد"
          cancelText="إلغاء"
          type={actionConfirm.type === "reject" || actionConfirm.type === "cancel" ? "danger" : "warning"}
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
