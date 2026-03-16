import { AuthService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// واجهات البيانات للـ API Response
interface ApiRatingTag {
  id: number;
  label_ar: string;
  label_en: string;
  applicable_to: "driver" | "rider" | "both";
  min_stars: number;
  max_stars: number;
  is_positive: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  label: string;
}

interface ApiRatingTagsResponse {
  message: string;
  data: ApiRatingTag[];
}

// تحويل البيانات من API إلى نموذج التطبيق
function mapApiTagToModel(apiTag: ApiRatingTag): import('@/models/Rating').RatingTagManagement & { created_at?: string; updated_at?: string; label?: string } {
  return {
    id: apiTag.id,
    label_ar: apiTag.label_ar,
    label_en: apiTag.label_en,
    applies_to: apiTag.applicable_to,
    min_stars: apiTag.min_stars,
    max_stars: apiTag.max_stars,
    is_positive: apiTag.is_positive,
    is_active: apiTag.active,
    usage_count: 0, // لا يتم إرسال هذا من الـ API، نضع قيمة افتراضية
    created_at: apiTag.created_at,
    updated_at: apiTag.updated_at,
    label: apiTag.label,
  };
}

/**
 * جلب جميع وسوم التقييمات
 * @returns قائمة بجميع وسوم التقييمات
 */
export async function getAllRatingTags(): Promise<(import('@/models/Rating').RatingTagManagement & { created_at?: string; updated_at?: string; label?: string })[]> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags`;
  
  console.log('Fetching rating tags:', {
    url,
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
      let message = 'فشل في جلب وسوم التقييمات';
      
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

    const result: ApiRatingTagsResponse = await response.json();
    console.log('Success response:', result);
    
    return result.data.map(mapApiTagToModel);
  } catch (error: any) {
    console.error('Error fetching rating tags:', error);
    throw new Error(error?.message || 'فشل في جلب وسوم التقييمات');
  }
}
/**
 * تبديل حالة وسم التقييم (نشط/غير نشط)
 * @param tagId معرف الوسم
 * @returns رسالة نجاح العملية
 */
export async function toggleRatingTagStatus(tagId: number): Promise<string> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags/${tagId}`;
  
  console.log('Toggling rating tag status:', {
    url,
    tagId,
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
      let message = 'فشل في تغيير حالة الوسم';
      
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
    let message = 'تم تغيير حالة الوسم بنجاح';
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
    console.error('Error toggling rating tag status:', error);
    throw new Error(error?.message || 'فشل في تغيير حالة الوسم');
  }
}
/**
 * جلب تفاصيل وسم تقييم محدد
 * @param tagId معرف الوسم
 * @returns تفاصيل الوسم الكاملة
 */
export async function getRatingTagDetails(tagId: number): Promise<import('@/models/Rating').RatingTagManagement & { created_at?: string; updated_at?: string; label?: string }> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags/${tagId}`;
  
  console.log('Fetching rating tag details:', {
    url,
    tagId,
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
      let message = 'فشل في جلب تفاصيل الوسم';
      
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

    const result: { message: string; data: ApiRatingTag } = await response.json();
    console.log('Success response:', result);
    
    return mapApiTagToModel(result.data);
  } catch (error: any) {
    console.error('Error fetching rating tag details:', error);
    throw new Error(error?.message || 'فشل في جلب تفاصيل الوسم');
  }
}
/**
 * حذف وسم تقييم نهائياً (Force Delete)
 * @param tagId معرف الوسم المراد حذفه
 * @returns رسالة نجاح الحذف
 */
export async function forceDeleteRatingTag(tagId: number): Promise<string> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags/${tagId}/force-delete`;
  
  console.log('Force deleting rating tag:', {
    url,
    tagId,
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
      let message = 'فشل في حذف الوسم';
      
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
    let message = 'تم حذف الوسم نهائياً بنجاح';
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
    console.error('Error force deleting rating tag:', error);
    throw new Error(error?.message || 'فشل في حذف الوسم');
  }
}
// واجهة البيانات لإنشاء وسم جديد
export interface CreateRatingTagRequest {
  label_ar: string;
  label_en: string;
  applicable_to: "driver" | "rider" | "both";
  min_stars: number;
  max_stars: number;
  is_positive: boolean;
  active: boolean;
}

// واجهة البيانات لتحديث وسم موجود
export interface UpdateRatingTagRequest {
  label_ar: string;
  label_en: string;
  applicable_to: "driver" | "rider" | "both";
  min_stars: number;
  max_stars: number;
  is_positive: boolean;
  active: boolean;
}

interface CreateRatingTagResponse {
  message: string;
  data: ApiRatingTag;
}

interface UpdateRatingTagResponse {
  message: string;
  data: ApiRatingTag;
}

/**
 * إنشاء وسم تقييم جديد
 * @param tagData بيانات الوسم الجديد
 * @returns الوسم المُنشأ مع تفاصيله
 */
export async function createRatingTag(tagData: CreateRatingTagRequest): Promise<ExtendedRatingTag> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags`;
  
  console.log('Creating rating tag:', {
    url,
    tagData,
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(tagData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في إنشاء الوسم';
      
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

    const result: CreateRatingTagResponse = await response.json();
    console.log('Success response:', result);
    
    return mapApiTagToModel(result.data);
  } catch (error: any) {
    console.error('Error creating rating tag:', error);
    throw new Error(error?.message || 'فشل في إنشاء الوسم');
  }
}

/**
 * تحديث وسم تقييم موجود
 * @param tagId معرف الوسم المراد تحديثه
 * @param tagData بيانات الوسم المحدثة
 * @returns الوسم المُحدث مع تفاصيله
 */
export async function updateRatingTag(tagId: number, tagData: UpdateRatingTagRequest): Promise<ExtendedRatingTag> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/rating-tags/${tagId}`;
  
  console.log('Updating rating tag:', {
    url,
    tagId,
    tagData,
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(tagData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في تحديث الوسم';
      
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

    const result: UpdateRatingTagResponse = await response.json();
    console.log('Success response:', result);
    
    return mapApiTagToModel(result.data);
  } catch (error: any) {
    console.error('Error updating rating tag:', error);
    throw new Error(error?.message || 'فشل في تحديث الوسم');
  }
}

// تصدير النوع المُوسع
export type ExtendedRatingTag = import('@/models/Rating').RatingTagManagement & { 
  created_at?: string; 
  updated_at?: string; 
  label?: string; 
};