"use client";

import { useState, useEffect } from "react";
import { Rating } from "@/models/Rating";
import RatingsFilters from "../RatingsFilters/RatingsFilters";
import RatingsTable from "../RatingsTable/RatingsTable";
import RatingDetailsModal from "../RatingDetailsModal/RatingDetailsModal";
import Pagination from "@/components/Pagination/Pagination";
import mockData from "@/data/dashboard/mock-ratings.json";
import "./RatingsContent.css";

export default function RatingsContent() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setRatings(mockData.ratings);
    setFilteredRatings(mockData.ratings);
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
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setRatings(ratings.filter((r) => r.id !== id));
    setFilteredRatings(filteredRatings.filter((r) => r.id !== id));
  };

  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRatings = filteredRatings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="ratings-content">
      <RatingsFilters onFilter={handleFilter} resultsCount={filteredRatings.length} />
      <RatingsTable
        ratings={paginatedRatings}
        onViewDetails={setSelectedRating}
        onDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredRatings.length}
        itemsPerPage={itemsPerPage}
      />
      {selectedRating && (
        <RatingDetailsModal
          rating={selectedRating}
          onClose={() => setSelectedRating(null)}
        />
      )}
    </div>
  );
}
