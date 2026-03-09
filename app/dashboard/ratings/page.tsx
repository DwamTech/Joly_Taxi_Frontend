"use client";

import { useState, useEffect } from "react";
import RatingsHero from "@/components/dashboard/RatingsManagement/RatingsHero/RatingsHero";
import RatingsContent from "@/components/dashboard/RatingsManagement/RatingsContent/RatingsContent";
import TagsManagement from "@/components/dashboard/RatingsManagement/TagsManagement";
import "./ratings.css";

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState<"ratings" | "tags">("ratings");

  // تحميل التاب المحفوظ عند فتح الصفحة
  useEffect(() => {
    const savedTab = localStorage.getItem("ratingsActiveTab") as "ratings" | "tags" | null;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // حفظ التاب عند تغييره
  const handleTabChange = (tab: "ratings" | "tags") => {
    setActiveTab(tab);
    localStorage.setItem("ratingsActiveTab", tab);
  };

  return (
    <div className="ratings-management-page">
      <RatingsHero activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "ratings" ? (
        <RatingsContent />
      ) : (
        <TagsManagement />
      )}
    </div>
  );
}
