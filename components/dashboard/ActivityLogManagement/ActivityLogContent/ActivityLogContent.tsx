"use client";

import { useState } from "react";
import ActivityLogHero from "../ActivityLogHero/ActivityLogHero";
import ActivityLogFilters, {
  FilterValues,
} from "../ActivityLogFilters/ActivityLogFilters";
import ActivityLogTable from "../ActivityLogTable/ActivityLogTable";
import activityLogData from "@/data/activity-log/activity-log-data.json";
import { ActivityLog } from "@/models/ActivityLog";
import "./ActivityLogContent.css";

export default function ActivityLogContent() {
  const [activities] = useState<ActivityLog[]>(activityLogData.activities as ActivityLog[]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>(
    activityLogData.activities as ActivityLog[]
  );

  // Get unique admins for filter
  const uniqueAdmins = Array.from(
    new Map(
      activities.map((activity) => [
        activity.admin_id,
        { id: activity.admin_id, name: activity.admin_name },
      ])
    ).values()
  );

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...activities];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (activity) =>
          activity.admin_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          activity.action.toLowerCase().includes(filters.search.toLowerCase()) ||
          activity.details.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Action type filter
    if (filters.actionType !== "all") {
      filtered = filtered.filter(
        (activity) => activity.action_type === filters.actionType
      );
    }

    // Admin filter
    if (filters.adminId !== "all") {
      filtered = filtered.filter(
        (activity) => activity.admin_id === filters.adminId
      );
    }

    // Date from filter
    if (filters.dateFrom) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.created_at);
        const fromDate = new Date(filters.dateFrom);
        return activityDate >= fromDate;
      });
    }

    // Date to filter
    if (filters.dateTo) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.created_at);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        return activityDate <= toDate;
      });
    }

    setFilteredActivities(filtered);
  };

  // Calculate today's activities
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.created_at);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === today.getTime();
  }).length;

  // Calculate critical actions (delete, block)
  const criticalActions = activities.filter(
    (activity) =>
      activity.action_type === "delete" || activity.action_type === "block"
  ).length;

  return (
    <div className="activity-log-content">
      <ActivityLogHero
        totalActivities={activityLogData.statistics.total_activities}
        todayActivities={todayActivities}
        activeAdmins={activityLogData.statistics.active_admins}
        criticalActions={criticalActions}
      />

      <div className="activity-log-content-wrapper">
        <ActivityLogFilters
          onFilterChange={handleFilterChange}
          resultsCount={filteredActivities.length}
          admins={uniqueAdmins}
        />

        <ActivityLogTable activities={filteredActivities} />
      </div>
    </div>
  );
}
