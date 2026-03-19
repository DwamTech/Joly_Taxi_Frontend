"use client";

import { useState, useEffect } from "react";
import { Rating } from "@/models/Rating";
import { getGroupedRatings, GroupedRating, Rating as ServiceRating, deleteRating } from "@/services/ratingsService";
import RatingsFilters from "../RatingsFilters/RatingsFilters";
import RatingsTable from "../RatingsTable/RatingsTable";
import RatingDetailsModal from "../RatingDetailsModal/RatingDetailsModal";
import Pagination from "@/components/Pagination/Pagination";
import Toast from "@/components/Toast/Toast";
import "./RatingsContent.css";

export default function RatingsContent() {
  const [groupedRatings, setGroupedRatings] = useState<GroupedRating[]>([]);
  void groupedRatings; void setGroupedRatings; // Mark as used
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const itemsPerPage = 20; // يتطابق مع per_page من الـ API

  // تحويل ServiceRating إلى Rating للتوافق مع الكومبوننت الحالي
  const convertServiceRatingToRating = (serviceRating: ServiceRating, tripId: number): Rating => {
    return {
      id: serviceRating.id,
      trip_request_id: tripId,
      rater_user_id: serviceRating.rater.id,
      rated_user_id: serviceRating.ratedUser.id,
      rater_name: serviceRating.rater.name,
      rated_name: serviceRating.ratedUser.name,
      rater_type: serviceRating.raterType,
      rated_type: serviceRating.ratedUser.role === 'driver' ? 'driver' : 'rider',
      stars: serviceRating.stars,
      comment: serviceRating.comment,
      tags: serviceRating.tags.map(tag => ({
        id: tag.id,
        label: tag.label,
        is_positive: tag.isPositive
      })),
      created_at: serviceRating.createdAt,
      updated_at: serviceRating.createdAt // نفس التاريخ لأن الـ API لا يرسل updated_at
    };
  };

  // جلب البيانات من الـ API
  const fetchRatings = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getGroupedRatings(page);
      setGroupedRatings(result.ratings);

      // تحويل التقييمات المجمعة إلى قائمة مسطحة
      const flatRatings: Rating[] = [];
      result.ratings.forEach(group => {
        group.ratings.forEach(rating => {
          flatRatings.push(convertServiceRatingToRating(rating, group.tripId));
        });
      });

      setRatings(flatRatings);
      setFilteredRatings(flatRatings);
      setTotalPages(result.pagination.lastPage);
      setTotalItems(result.pagination.total);
      setCurrentPage(result.pagination.currentPage);

    } catch (err: any) {
      console.error('Error fetching ratings:', err);
      setError(err.message || 'فشل في جلب التقييمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings(1);
  }, []);

  const handleFilter = (filters: any) => {
    let filtered = [...ratings];

    if (filters.search) {
      filtered = filtered.filter(
        (r) =>
          r.trip_request_id.toString().includes(filters.search) ||
          r.rater_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.rated_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.raterType !== "all") {
      filtered = filtered.filter((r) => r.rater_type === filters.raterType);
    }

    if (filters.stars !== "all") {
      filtered = filtered.filter((r) => r.stars === parseInt(filters.stars));
    }

    if (filters.hasComment !== "all") {
      const hasComment = filters.hasComment === "yes";
      filtered = filtered.filter((r) => (hasComment ? r.comment : !r.comment));
    }

    setFilteredRatings(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const message = await deleteRating(id);

      // إظهار رسالة نجاح
      setToast({
        message: `✅ ${message}`,
        type: 'success'
      });

      // إعادة تحميل البيانات للصفحة الحالية
      await fetchRatings(currentPage);

    } catch (error: any) {
      console.error('Error deleting rating:', error);
      setToast({
        message: `❌ ${error.message || 'فشل في حذف التقييم'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchRatings(page);
  };

  if (loading) {
    return (
      <div className="ratings-content">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>جاري تحميل التقييمات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ratings-content">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => fetchRatings(currentPage)}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // للفلترة المحلية، نستخدم التقييمات المفلترة
  const displayRatings = filteredRatings;

  return (
    <div className="ratings-content">
      <RatingsFilters onFilter={handleFilter} resultsCount={displayRatings.length} />
      <RatingsTable
        ratings={displayRatings}
        onViewDetails={setSelectedRating}
        onDelete={handleDelete}
        loading={loading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
      {selectedRating && (
        <RatingDetailsModal
          rating={selectedRating}
          onClose={() => setSelectedRating(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
