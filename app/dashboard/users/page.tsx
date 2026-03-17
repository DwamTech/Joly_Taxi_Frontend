"use client";

import { useState, useEffect, useMemo } from "react";
import { User, VerificationStatus } from "@/models/User";
import { ToastProvider, useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Pagination from "@/components/Pagination/Pagination";
import UsersHero from "@/components/dashboard/UsersManagement/UsersHero/UsersHero";
import RoleTabs from "@/components/dashboard/UsersManagement/RoleTabs/RoleTabs";
import UsersFilters, {
  FilterValues,
} from "@/components/dashboard/UsersManagement/UsersFilters/UsersFilters";
import UsersTable from "@/components/dashboard/UsersManagement/UsersTable/UsersTable";
import UserDetailsModal from "@/components/dashboard/UsersManagement/UserDetailsModal/UserDetailsModal";
import AddUserModal from "@/components/dashboard/UsersManagement/AddUserModal/AddUserModal";
import EditUserModal from "@/components/dashboard/UsersManagement/EditUserModal/EditUserModal";
import SendNotificationModal from "@/components/dashboard/UsersManagement/SendNotificationModal/SendNotificationModal";
import { getAllUsers, getUsers, getUsersStats, getUserDetails, updateUser, toggleBlockUser, deleteUser, convertToUIUser } from "@/services/usersService";
import { exportUsersToExcel } from "@/utils/exportToExcel";
import "./users.css";

function UsersManagementContent() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; userId: number; userName: string }>({
    show: false,
    userId: 0,
    userName: "",
  });
  const [notificationModal, setNotificationModal] = useState<{ show: boolean; userId: number; userName: string }>({
    show: false,
    userId: 0,
    userName: "",
  });
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    phone: "",
    role: "all",
    status: "all",
    profileStatus: "all",
    sortBy: "newest",
  });

  // تحميل الـ role المحفوظ عند فتح الصفحة
  useEffect(() => {
    const savedRole = localStorage.getItem("usersActiveRole");
    if (savedRole) {
      setFilters(prev => ({ ...prev, role: savedRole }));
    }
  }, []);

  // Store stats from API
  const [apiStats, setApiStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRiders: 0,
    totalBoth: 0,
    activeDrivers: 0,
    activeRiders: 0,
  });

  // Load stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getUsersStats();
        console.log('Received stats:', stats);
        
        // Map API response to our format
        setApiStats({
          totalUsers: stats.active_users || 0,
          totalDrivers: stats.verified_drivers || 0,
          totalRiders: stats.total_riders || 0,
          totalBoth: 0, // Not provided by API
          activeDrivers: stats.verified_drivers || 0,
          activeRiders: stats.total_riders || 0,
        });
      } catch (error) {
        console.warn("Stats endpoint not available, will use pagination total:", error);
        // Fallback: stats will be updated when users are loaded
      }
    };

    fetchStats();
  }, []); // Load once on mount

  // Load users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        console.log('Loading page:', currentPage);
        const response = await getUsers(currentPage);
        console.log('Response received:', response);
        
        const convertedUsers = response.data.map(convertToUIUser);
        console.log('Converted users:', convertedUsers);
        console.log('Sample user roles:', convertedUsers.slice(0, 3).map(u => ({ name: u.name, role: u.role })));
        setUsers(convertedUsers);
        setTotalPages(response.pagination.last_page);
        setTotalItems(response.pagination.total);
        
        // Stats are loaded separately from /api/admin/users/status
        // No need to update from users response
      } catch (error: any) {
        console.error("Error loading users:", error);
        console.error("Error message:", error.message);
        showToast(`فشل في تحميل بيانات المستخدمين: ${error.message}`, "error");
        // Keep previous data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, showToast]); // Add showToast to dependencies

  // Calculate counts for tabs from actual table data
  const roleCounts = useMemo(() => {
    return {
      all: users.length,
      user: users.filter(u => u.role === "user").length,
      driver: users.filter(u => u.role === "driver").length,
      both: users.filter(u => u.role === "both").length,
    };
  }, [users]);

  // Use API stats for hero
  const activeStats = useMemo(() => {
    return {
      totalUsers: apiStats.totalUsers,
      activeDrivers: apiStats.activeDrivers,
      activeRiders: apiStats.activeRiders,
    };
  }, [apiStats]);

  // Apply filters locally on current page data
  useEffect(() => {
    let result = [...users];

    // Search by name
    if (filters.search) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Search by phone
    if (filters.phone) {
      result = result.filter((user) => user.phone.includes(filters.phone));
    }

    // Filter by role
    if (filters.role !== "all") {
      if (filters.role === "user") {
        result = result.filter((user) => user.role === "user" || user.role === "both");
      } else if (filters.role === "driver") {
        result = result.filter((user) => user.role === "driver" || user.role === "both");
      } else if (filters.role === "both") {
        result = result.filter((user) => user.role === "both");
      }
    }

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((user) => user.status === filters.status);
    }

    // Filter by profile status
    if (filters.profileStatus !== "all") {
      result = result.filter((user) => {
        if (user.role !== "driver" && user.role !== "both") {
          return false;
        }
        const userProfileStatus =
          user.driver_profile?.profile_status ||
          user.driver_profile?.verification_status ||
          "pending";
        return userProfileStatus === filters.profileStatus;
      });
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
      case "most_active":
        result.sort(
          (a, b) =>
            new Date(b.last_active_at).getTime() -
            new Date(a.last_active_at).getTime()
        );
        break;
    }

    setFilteredUsers(result);
  }, [filters, users]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRoleChange = (role: string) => {
    setFilters((prev) => ({ ...prev, role }));
    setCurrentPage(1); // Reset to first page when role changes
    localStorage.setItem("usersActiveRole", role); // حفظ الـ role
  };

  const handleViewUser = async (user: User) => {
    try {
      // Fetch full user details from API
      const userDetails = await getUserDetails(user.id);
      const normalizedRole: User["role"] =
        userDetails.type === "driver" || userDetails.type === "both"
          ? userDetails.type
          : "user";
      const createdAt = userDetails.registration_date || new Date().toISOString();
      const lastLogin = userDetails.last_login || createdAt;
      
      // Convert API response to User model
      const fullUser: User = {
        id: userDetails.id,
        name: userDetails.name,
        phone: userDetails.phone,
        email: userDetails.email,
        role: normalizedRole,
        status: userDetails.status,
        agent_code: null,
        delegate_number: null,
        created_at: createdAt,
        last_active_at: lastLogin,
        last_login_at: lastLogin,
        // Add rider profile if exists
        rider_profile: userDetails.rider_info ? {
          id: userDetails.id,
          user_id: userDetails.id,
          rating_avg: userDetails.rider_info.average_rating,
          rating_count: userDetails.rider_info.total_ratings,
          reliability_percent: 0,
          completed_trips_count: userDetails.rider_info.completed_trips,
          cancelled_trips_count: userDetails.rider_info.cancelled_trips,
          preferences: null,
          created_at: createdAt,
          updated_at: lastLogin,
        } : undefined,
        // Add driver profile if exists
        driver_profile: userDetails.driver_info ? {
          national_id_number: userDetails.driver_info.national_id,
          driver_license_expiry: userDetails.driver_info.license_expiry,
          expire_profile_at: userDetails.driver_info.profile_expiry,
          verification_status: userDetails.driver_info.profile_status || userDetails.driver_info.status || userDetails.driver_info.verification_status,
          profile_status: userDetails.driver_info.profile_status || userDetails.driver_info.status || userDetails.driver_info.verification_status,
          online_status: userDetails.driver_info.online_status === "online",
          rating_avg: userDetails.driver_info.average_rating,
          rating_count: userDetails.driver_info.total_ratings,
          completed_trips_count: userDetails.driver_info.completed_trips,
          cancelled_trips_count: userDetails.driver_info.cancelled_trips,
        } : undefined,
        // Add vehicle if exists
        vehicle: userDetails.driver_info?.vehicle || undefined,
        // Add subscriptions if exists
        subscriptions: userDetails.driver_info?.subscriptions || undefined,
        // Add documents if exists
        documents: userDetails.driver_info?.documents.map(doc => ({
          id: doc.id,
          driver_user_id: userDetails.id,
          type: doc.type as any,
          file_path: doc.url,
          file_url: doc.url,
          expires_at: doc.expires_at,
          status: doc.status || "approved",
          created_at: createdAt,
          updated_at: lastLogin,
        })) || undefined,
      };
      
      setSelectedUser(fullUser);
    } catch (error) {
      showToast("فشل في تحميل تفاصيل المستخدم", "error");
      console.error("Error loading user details:", error);
    }
  };

  const handleAddUser = (userData: any) => {
    setUsers((prevUsers) => [userData, ...prevUsers]);
    showToast("تم إضافة المستخدم بنجاح", "success");
    // TODO: Call API to add user
    console.log("Add user:", userData);
  };

  const handleExportData = () => {
    exportUsersToExcel(filteredUsers);
    showToast("تم تصدير البيانات بنجاح", "success");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Call API to update user
      await updateUser(updatedUser.id, updatedUser);
      
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      
      showToast("تم تحديث بيانات المستخدم بنجاح", "success");
      
      // Reload stats after update
      try {
        const stats = await getUsersStats();
        setApiStats({
          totalUsers: stats.active_users,
          totalDrivers: stats.verified_drivers,
          totalRiders: stats.total_riders,
          totalBoth: 0,
          activeDrivers: stats.verified_drivers,
          activeRiders: stats.total_riders,
        });
      } catch (error) {
        console.warn("Failed to reload stats after update");
      }
    } catch (error: any) {
      showToast(`فشل في تحديث بيانات المستخدم: ${error.message}`, "error");
      console.error("Error updating user:", error);
    }
  };

  const handleBlockUser = async (userId: number, reason?: string) => {
    try {
      // Call API to toggle block status
      const result = await toggleBlockUser(userId, reason);
      
      // Update local state with new status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, status: result.status as any }
            : user
        )
      );
      
      if (result.status === "blocked") {
        showToast("تم حظر المستخدم", "warning");
      } else {
        showToast("تم إلغاء حظر المستخدم", "success");
      }
    } catch (error: any) {
      showToast(`فشل في تغيير حالة الحظر: ${error.message}`, "error");
      console.error("Error toggling block status:", error);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setDeleteConfirm({
        show: true,
        userId: userId,
        userName: user.name,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      // Call API to delete user
      await deleteUser(deleteConfirm.userId);
      
      // Remove from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteConfirm.userId));
      
      showToast("تم حذف المستخدم بنجاح", "success");
      setDeleteConfirm({ show: false, userId: 0, userName: "" });
      
      // Reload stats after deletion
      try {
        const stats = await getUsersStats();
        setApiStats({
          totalUsers: stats.active_users,
          totalDrivers: stats.verified_drivers,
          totalRiders: stats.total_riders,
          totalBoth: 0,
          activeDrivers: stats.verified_drivers,
          activeRiders: stats.total_riders,
        });
      } catch (error) {
        console.warn("Failed to reload stats after deletion");
      }
    } catch (error: any) {
      showToast(`فشل في حذف المستخدم: ${error.message}`, "error");
      console.error("Error deleting user:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, userId: 0, userName: "" });
  };

  const handleSendNotification = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setNotificationModal({
        show: true,
        userId: userId,
        userName: user.name,
      });
    }
  };

  const handleVerificationChange = (
    userId: number,
    status: VerificationStatus
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId && user.driver_profile
          ? {
              ...user,
              driver_profile: {
                ...user.driver_profile,
                verification_status: status,
                profile_status: status,
              },
            }
          : user
      )
    );
    showToast("تم تحديث حالة التحقق", "success");
    // TODO: Call API to update verification status
    console.log("Update verification status:", userId, status);
  };

  return (
    <div className="users-management-page">
      <UsersHero
        totalUsers={activeStats.totalUsers}
        activeDrivers={activeStats.activeDrivers}
        activeRiders={activeStats.activeRiders}
        onAddUser={() => setShowAddModal(true)}
        onExportData={handleExportData}
      />

      <UsersFilters
        onFilterChange={handleFilterChange}
        resultsCount={filteredUsers.length}
      />

      <RoleTabs
        activeRole={filters.role}
        onRoleChange={handleRoleChange}
        counts={roleCounts}
      />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2rem" }}>⏳</div>
          <p>جاري تحميل البيانات...</p>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onBlockUser={handleBlockUser}
          onDeleteUser={handleDeleteUser}
          onSendNotification={handleSendNotification}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onVerificationChange={handleVerificationChange}
        />
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAddUser={handleAddUser}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message={`هل أنت متأكد من حذف المستخدم "${deleteConfirm.userName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {notificationModal.show && (
        <SendNotificationModal
          userId={notificationModal.userId}
          userName={notificationModal.userName}
          onClose={() => setNotificationModal({ show: false, userId: 0, userName: "" })}
        />
      )}
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <ToastProvider>
      <UsersManagementContent />
    </ToastProvider>
  );
}
