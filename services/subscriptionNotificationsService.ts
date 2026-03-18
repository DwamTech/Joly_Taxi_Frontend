import { AuthService } from './authService';

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

export interface SubscriptionReminderRequest {
  target_group: 'drivers';
  include_stats: boolean | 'true';
}

export interface SubscriptionInfo {
  subscription_id: number;
  driver_id: number;
  driver_name: string;
  vehicle_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  days_used: number;
  days_remaining: number;
  total_price: string;
  paid_amount: string;
}

export interface SubscriptionReminderResponse {
  message: string;
  data: {
    days_before_expiry: number;
    total_subscriptions: number;
    notifications_sent: number;
    notifications_failed: number;
    subscriptions: SubscriptionInfo[];
  };
}

/**
 * إرسال تذكير تجديد الاشتراك للسائقين
 */
export async function sendSubscriptionRenewalReminder(): Promise<SubscriptionReminderResponse> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ar',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // جرب أولاً مع boolean
  let requestBody: any = {
    target_group: 'drivers',
    include_stats: true
  };

  const url = `${API_BASE_URL}/api/admin/notifications/send-subscription-renewal-reminder`;
  
  console.log('Sending subscription renewal reminder:', {
    url,
    method: 'POST',
    headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined },
    body: requestBody
  });
  
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestBody),
    });

    // إذا فشل مع boolean، جرب مع string
    if (!response.ok && response.status === 422) {
      console.log('First attempt failed with 422, trying with string value...');
      requestBody = {
        target_group: 'drivers',
        include_stats: 'true'
      };
      
      response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
    }

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let message = 'فشل في إرسال تذكير تجديد الاشتراك';
      
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

    const result: SubscriptionReminderResponse = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error: any) {
    console.error('Error sending subscription renewal reminder:', error);
    throw new Error(error?.message || 'فشل في إرسال تذكير تجديد الاشتراك');
  }
}
