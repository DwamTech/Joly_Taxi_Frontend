export interface RatingTag {
  id: number;
  label: string;
  is_positive: boolean;
}

export interface Rating {
  id: number;
  trip_request_id: number;
  rater_user_id: number;
  rated_user_id: number;
  rater_name: string;
  rated_name: string;
  rater_type: "driver" | "rider";
  rated_type: "driver" | "rider";
  stars: number;
  comment: string | null;
  tags: RatingTag[];
  created_at: string;
  updated_at: string;
}

export interface RatingTagManagement {
  id: number;
  label_ar: string;
  label_en: string;
  applies_to: "driver" | "rider" | "both";
  min_stars: number;
  max_stars: number;
  is_positive: boolean;
  is_active: boolean;
  usage_count: number;
}
