import { AuthService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// واجهات البيانات للـ API Response
interface ApiRatingTag {
  id: number;
  label: string;
  is_positive: boolean;
}

// واجهات البيانات لتفاصيل التقييم المفصل
interface ApiDetailedRatingTag {
  id: number;
  label_ar: string;
  label_en: string;
  is_positive: boolean;
  label: string;
  pivot: {
    trip_rating_id: number;
    rating_tag_id: number;
  };
}

interface ApiDriverProfile {
  user_id: number;
  rating_avg: string;
  rating_count: number;
  reliability_percent: number;
  national_id_number: string;
  driver_license_expiry: string;
  expire_profile_at: string;
  verification_status: string;
  completed_trips_count: number;
  cancelled_trips_count: number;
  online_status: string;
  last_lat: string;
  last_lng: string;
  last_location_at: string;
  created_at: string;
  updated_at: string;
  offer_locked_until: string | null;
  offer_locked_trip_request_id: number | null;
  verification_status_name: string;
}

interface ApiRatingStats {
  rating_avg: number;
  rating_count: number;
}

interface ApiDetailedRater {
  id: number;
  name: string;
  phone: string;
  role: string;
  role_name: string;
}

interface ApiDetailedRatedUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  role_name: string;
  driver_profile?: ApiDriverProfile;
  rating_stats?: ApiRatingStats;
}

interface ApiTripRequest {
  id: number;
  from_address: string;
  to_address: string;
  status: string;
  final_price: string;
  suggested_price: string;
  status_name: string;
  cancelled_by_name: string | null;
}

interface ApiDetailedRating {
  id: number;
  trip_request_id: number;
  rater_user_id: number;
  rated_user_id: number;
  rater_type: string;
  stars: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  rater_type_name: string;
  has_comment: boolean;
  rater: ApiDetailedRater;
  rated_user: ApiDetailedRatedUser;
  trip_request: ApiTripRequest;
  tags: ApiDetailedRatingTag[];
}

interface ApiDetailedRatingResponse {
  message: string;
  data: ApiDetailedRating;
}

interface ApiRater {
  id: number;
  name: string;
  phone: string;
  role: string;
  role_name: string;
}

interface ApiRatedUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  role_name: string;
}

interface ApiRating {
  id: number;
  rater_type: string;
  rater_type_name: string;
  stars: number;
  comment: string | null;
  has_comment: boolean;
  created_at: string;
  rater: ApiRater;
  rated_user: ApiRatedUser;
  tags: ApiRatingTag[];
}

interface ApiTripInfo {
  id: number;
  from_address: string;
  to_address: string;
  status: string;
  status_name: string;
}

interface ApiGroupedRating {
  trip_id: number;
  trip_info: ApiTripInfo;
  ratings_count: number;
  average_stars: number;
  ratings: ApiRating[];
}

interface ApiRatingsResponse {
  message: string;
  data: {
    current_page: number;
    data: ApiGroupedRating[];
    per_page: number;
    total: number;
    last_page: number;
  };
}

// واجهات البيانات للتطبيق
export interface RatingTag {
  id: number;
  label: string;
  isPositive: boolean;
}

// واجهات البيانات لتفاصيل التقييم المفصل
export interface DetailedRatingTag {
  id: number;
  labelAr: string;
  labelEn: string;
  isPositive: boolean;
  label: string;
}

export interface DriverProfile {
  userId: number;
  ratingAvg: number;
  ratingCount: number;
  reliabilityPercent: number;
  nationalIdNumber: string;
  driverLicenseExpiry: string;
  expireProfileAt: string;
  verificationStatus: string;
  verificationStatusName: string;
  completedTripsCount: number;
  cancelledTripsCount: number;
  onlineStatus: string;
  lastLat: number;
  lastLng: number;
  lastLocationAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingStats {
  ratingAvg: number;
  ratingCount: number;
}

export interface DetailedRatingUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  roleName: string;
  driverProfile?: DriverProfile;
  ratingStats?: RatingStats;
}

export interface TripRequest {
  id: number;
  fromAddress: string;
  toAddress: string;
  status: string;
  statusName: string;
  finalPrice: number;
  suggestedPrice: number;
  cancelledByName: string | null;
}

export interface DetailedRating {
  id: number;
  tripRequestId: number;
  raterUserId: number;
  ratedUserId: number;
  raterType: 'rider' | 'driver';
  raterTypeName: string;
  stars: number;
  comment: string | null;
  hasComment: boolean;
  createdAt: string;
  updatedAt: string;
  rater: DetailedRatingUser;
  ratedUser: DetailedRatingUser;
  tripRequest: TripRequest;
  tags: DetailedRatingTag[];
}

export interface RatingUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  roleName: string;
}

export interface Rating {
  id: number;
  raterType: 'rider' | 'driver';
  raterTypeName: string;
  stars: number;
  comment: string | null;
  hasComment: boolean;
  createdAt: string;
  rater: RatingUser;
  ratedUser: RatingUser;
  tags: RatingTag[];
}

export interface TripInfo {
  id: number;
  fromAddress: string;
  toAddress: string;
  status: string;
  statusName: string;
}

export interface GroupedRating {
  tripId: number;
  tripInfo: TripInfo;
  ratingsCount: number;
  averageStars: number;
  ratings: Rating[];
}

export interface RatingsResult {
  ratings: GroupedRating[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

// دوال التحويل من API إلى نموذج التطبيق
function mapApiTagToModel(apiTag: ApiRatingTag): RatingTag {
  return {
    id: apiTag.id,
    label: apiTag.label,
    isPositive: apiTag.is_positive,
  };
}

function mapApiDetailedTagToModel(apiTag: ApiDetailedRatingTag): DetailedRatingTag {
  return {
    id: apiTag.id,
    labelAr: apiTag.label_ar,
    labelEn: apiTag.label_en,
    isPositive: apiTag.is_positive,
    label: apiTag.label,
  };
}

function mapApiDriverProfileToModel(apiProfile: ApiDriverProfile): DriverProfile {
  return {
    userId: apiProfile.user_id,
    ratingAvg: parseFloat(apiProfile.rating_avg),
    ratingCount: apiProfile.rating_count,
    reliabilityPercent: apiProfile.reliability_percent,
    nationalIdNumber: apiProfile.national_id_number,
    driverLicenseExpiry: apiProfile.driver_license_expiry,
    expireProfileAt: apiProfile.expire_profile_at,
    verificationStatus: apiProfile.verification_status,
    verificationStatusName: apiProfile.verification_status_name,
    completedTripsCount: apiProfile.completed_trips_count,
    cancelledTripsCount: apiProfile.cancelled_trips_count,
    onlineStatus: apiProfile.online_status,
    lastLat: parseFloat(apiProfile.last_lat),
    lastLng: parseFloat(apiProfile.last_lng),
    lastLocationAt: apiProfile.last_location_at,
    createdAt: apiProfile.created_at,
    updatedAt: apiProfile.updated_at,
  };
}

function mapApiRatingStatsToModel(apiStats: ApiRatingStats): RatingStats {
  return {
    ratingAvg: apiStats.rating_avg,
    ratingCount: apiStats.rating_count,
  };
}

function mapApiDetailedUserToModel(apiUser: ApiDetailedRater | ApiDetailedRatedUser): DetailedRatingUser {
  const baseUser = {
    id: apiUser.id,
    name: apiUser.name || 'غير محدد',
    phone: apiUser.phone || 'غير محدد',
    role: apiUser.role,
    roleName: apiUser.role_name || apiUser.role,
  };

  // إضافة معلومات السائق إذا كانت متوفرة
  if ('driver_profile' in apiUser && apiUser.driver_profile) {
    return {
      ...baseUser,
      driverProfile: mapApiDriverProfileToModel(apiUser.driver_profile),
      ratingStats: apiUser.rating_stats ? mapApiRatingStatsToModel(apiUser.rating_stats) : undefined,
    };
  }

  return baseUser;
}

function mapApiTripRequestToModel(apiTrip: ApiTripRequest): TripRequest {
  return {
    id: apiTrip.id,
    fromAddress: apiTrip.from_address,
    toAddress: apiTrip.to_address,
    status: apiTrip.status,
    statusName: apiTrip.status_name,
    finalPrice: parseFloat(apiTrip.final_price),
    suggestedPrice: parseFloat(apiTrip.suggested_price),
    cancelledByName: apiTrip.cancelled_by_name,
  };
}

function mapApiDetailedRatingToModel(apiRating: ApiDetailedRating): DetailedRating {
  return {
    id: apiRating.id,
    tripRequestId: apiRating.trip_request_id,
    raterUserId: apiRating.rater_user_id,
    ratedUserId: apiRating.rated_user_id,
    raterType: apiRating.rater_type as 'rider' | 'driver',
    raterTypeName: apiRating.rater_type_name,
    stars: apiRating.stars,
    comment: apiRating.comment,
    hasComment: apiRating.has_comment,
    createdAt: apiRating.created_at,
    updatedAt: apiRating.updated_at,
    rater: mapApiDetailedUserToModel(apiRating.rater),
    ratedUser: mapApiDetailedUserToModel(apiRating.rated_user),
    tripRequest: mapApiTripRequestToModel(apiRating.trip_request),
    tags: apiRating.tags.map(mapApiDetailedTagToModel),
  };
}

function mapApiUserToModel(apiUser: ApiRater | ApiRatedUser): RatingUser {
  return {
    id: apiUser.id,
    name: apiUser.name || 'غير محدد',
    phone: apiUser.phone || 'غير محدد',
    role: apiUser.role,
    roleName: apiUser.role_name || apiUser.role,
  };
}

function mapApiRatingToModel(apiRating: ApiRating): Rating {
  return {
    id: apiRating.id,
    raterType: apiRating.rater_type as 'rider' | 'driver',
    raterTypeName: apiRating.rater_type_name,
    stars: apiRating.stars,
    comment: apiRating.comment,
    hasComment: apiRating.has_comment,
    createdAt: apiRating.created_at,
    rater: mapApiUserToModel(apiRating.rater),
    ratedUser: mapApiUserToModel(apiRating.rated_user),
    tags: apiRating.tags.map(mapApiTagToModel),
  };
}

function mapApiTripInfoToModel(apiTripInfo: ApiTripInfo): TripInfo {
  return {
    id: apiTripInfo.id,
    fromAddress: apiTripInfo.from_address,
    toAddress: apiTripInfo.to_address,
    status: apiTripInfo.status,
    statusName: apiTripInfo.status_name,
  };
}

function mapApiGroupedRatingToModel(apiGroupedRating: ApiGroupedRating): GroupedRating {
  return {
    tripId: apiGroupedRating.trip_id,
    tripInfo: mapApiTripInfoToModel(apiGroupedRating.trip_info),
    ratingsCount: apiGroupedRating.ratings_count,
    averageStars: apiGroupedRating.average_stars,
    ratings: apiGroupedRating.ratings.map(mapApiRatingToModel),
  };
}

/**
 * جلب التقييمات المجمعة حسب الرحلة
 * @param page رقم الصفحة (افتراضي: 1)
 * @returns نتيجة التقييمات مع معلومات الصفحات
 */
export async function getGroupedRatings(page: number = 1): Promise<RatingsResult> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/ratings/grouped?page=${page}`;
  
  console.log('Fetching grouped ratings:', {
    url,
    page,
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في جلب التقييمات';
      
      try {
        const errJson = await response.json();
        console.log('Error response:', errJson);
        
        if (errJson?.message) {
          message = errJson.message;
        }
        if (errJson?.errors) {
          const details = Object.entries(errJson.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          if (details) {
            message = `${message}: ${details}`;
          }
        }
        throw new Error(message);
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        const text = await response.text();
        console.log('Error response text:', text);
        throw new Error(text || message);
      }
    }

    const result: ApiRatingsResponse = await response.json();
    console.log('Success response:', result);
    
    return {
      ratings: result.data.data.map(mapApiGroupedRatingToModel),
      pagination: {
        currentPage: result.data.current_page,
        perPage: result.data.per_page,
        total: result.data.total,
        lastPage: result.data.last_page,
      },
    };
  } catch (error: any) {
    console.error('Error fetching grouped ratings:', error);
    throw new Error(error?.message || 'فشل في جلب التقييمات');
  }
}

/**
 * جلب تفاصيل تقييم محدد
 * @param ratingId معرف التقييم
 * @returns تفاصيل التقييم الكاملة
 */
export async function getRatingDetails(ratingId: number): Promise<DetailedRating> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/ratings/${ratingId}`;
  
  console.log('Fetching rating details:', {
    url,
    ratingId,
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في جلب تفاصيل التقييم';
      
      try {
        const errJson = await response.json();
        console.log('Error response:', errJson);
        
        if (errJson?.message) {
          message = errJson.message;
        }
        if (errJson?.errors) {
          const details = Object.entries(errJson.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          if (details) {
            message = `${message}: ${details}`;
          }
        }
        throw new Error(message);
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        const text = await response.text();
        console.log('Error response text:', text);
        throw new Error(text || message);
      }
    }

    const result: ApiDetailedRatingResponse = await response.json();
    console.log('Success response:', result);
    
    return mapApiDetailedRatingToModel(result.data);
  } catch (error: any) {
    console.error('Error fetching rating details:', error);
    throw new Error(error?.message || 'فشل في جلب تفاصيل التقييم');
  }
}
/**
 * جلب جميع التقييمات (جميع الصفحات)
 * @returns جميع التقييمات
 */
export async function getAllGroupedRatings(): Promise<GroupedRating[]> {
  try {
    const firstPage = await getGroupedRatings(1);
    let allRatings = [...firstPage.ratings];
    
    // جلب باقي الصفحات إذا كانت موجودة
    for (let page = 2; page <= firstPage.pagination.lastPage; page++) {
      const pageResult = await getGroupedRatings(page);
      allRatings = allRatings.concat(pageResult.ratings);
    }
    
    return allRatings;
  } catch (error: any) {
    console.error('Error fetching all grouped ratings:', error);
    throw new Error(error?.message || 'فشل في جلب جميع التقييمات');
  }
}
/**
 * حذف تقييم محدد
 * @param ratingId معرف التقييم المراد حذفه
 * @returns رسالة نجاح الحذف
 */
export async function deleteRating(ratingId: number): Promise<string> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/ratings/${ratingId}`;
  
  console.log('Deleting rating:', {
    url,
    ratingId,
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في حذف التقييم';
      
      try {
        const errJson = await response.json();
        console.log('Error response:', errJson);
        
        if (errJson?.message) {
          message = errJson.message;
        }
        if (errJson?.errors) {
          const details = Object.entries(errJson.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          if (details) {
            message = `${message}: ${details}`;
          }
        }
        throw new Error(message);
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        const text = await response.text();
        console.log('Error response text:', text);
        throw new Error(text || message);
      }
    }

    // إذا كان الرد فارغ (204 No Content) أو يحتوي على رسالة
    let message = 'تم حذف التقييم بنجاح';
    try {
      const result = await response.json();
      console.log('Success response:', result);
      if (result?.message) {
        message = result.message;
      }
    } catch {
      // الرد فارغ، استخدم الرسالة الافتراضية
    }
    
    return message;
  } catch (error: any) {
    console.error('Error deleting rating:', error);
    throw new Error(error?.message || 'فشل في حذف التقييم');
  }
}