# متطلبات API الرحلات - للباك إند

## نظرة عامة
هذا المستند يوضح متطلبات API الخاصة بإدارة الرحلات في لوحة التحكم.

## ملاحظة مهمة: التحديث اللحظي
- يجب تحديث بيانات الرحلات بشكل لحظي (كل 5 ثواني)
- **يجب تحديث فقط البيانات الخاصة بالرحلة نفسها**
- **لا يجب تحديث معلومات المستخدم أو السائق** إذا كانت تأتي من مصدر مختلف
- هذا يقلل من حجم البيانات المنقولة ويحسن الأداء

---

## 1. جلب جميع الرحلات
**Endpoint:** `GET /api/trips`

**الغرض:** جلب قائمة بجميع الرحلات مع معلومات أساسية

**Response:**
```json
{
  "trips": [
    {
      "id": 1,
      "trip_number": "TRIP-2024-001",
      "rider_id": 2,
      "rider_name": "سارة أحمد حسن",
      "rider_phone": "01112345678",
      "driver_id": 1,
      "driver_name": "أحمد محمد علي",
      "driver_phone": "01012345678",
      "driver_avatar": "/profile.jpg",
      "driver_rating": 4.8,
      "vehicle_type": "سيدان",
      "vehicle_brand": "تويوتا",
      "vehicle_model": "كورولا",
      "vehicle_license": "أ ب ج 1234",
      "from_location": {
        "lat": 30.0444,
        "lng": 31.2357,
        "address": "مدينة نصر، القاهرة"
      },
      "to_location": {
        "lat": 30.0626,
        "lng": 31.2497,
        "address": "مصر الجديدة، القاهرة"
      },
      "distance_km": 5.2,
      "estimated_price": 35.50,
      "final_price": 35.50,
      "requires_ac": true,
      "status": "completed",
      "created_at": "2024-03-02T08:00:00Z",
      "accepted_at": "2024-03-02T08:02:00Z",
      "started_at": "2024-03-02T08:15:00Z",
      "completed_at": "2024-03-02T08:35:00Z",
      "payment_method": "cash"
    }
  ]
}
```

---

## 2. جلب التحديثات اللحظية للرحلات (مهم جداً)
**Endpoint:** `GET /api/trips/updates`

**Query Parameters:**
- `since` (optional): آخر وقت تحديث (ISO 8601 format)

**الغرض:** جلب التحديثات اللحظية للرحلات فقط بدون معلومات المستخدم/السائق

**ملاحظات مهمة:**
1. هذا الـ endpoint يجب أن يُستدعى كل 5 ثواني
2. يجب أن يُرجع **فقط** البيانات المتغيرة للرحلة
3. **لا يجب** أن يُرجع معلومات المستخدم أو السائق (الاسم، الهاتف، الصورة، التقييم)
4. هذا يقلل حجم البيانات المنقولة بشكل كبير

**الحقول التي يجب تحديثها:**
- `status` - حالة الرحلة
- `distance_km` - المسافة (إذا كانت الرحلة جارية)
- `estimated_price` - السعر المقدر
- `final_price` - السعر النهائي
- `from_location` / `to_location` - المواقع (إذا تغيرت)
- `accepted_at` - وقت القبول
- `started_at` - وقت البدء
- `completed_at` - وقت الانتهاء
- `cancelled_at` - وقت الإلغاء
- `cancelled_by` - من قام بالإلغاء
- `cancellation_reason` - سبب الإلغاء
- `notes` - ملاحظات

**الحقول التي لا يجب تحديثها:**
- `rider_name`, `rider_phone`, `rider_avatar`
- `driver_name`, `driver_phone`, `driver_avatar`, `driver_rating`
- `vehicle_brand`, `vehicle_model`, `vehicle_license`

**Response:**
```json
{
  "updates": [
    {
      "id": 1,
      "status": "ongoing",
      "distance_km": 3.5,
      "started_at": "2024-03-02T08:15:00Z"
    },
    {
      "id": 2,
      "status": "completed",
      "final_price": 45.00,
      "completed_at": "2024-03-02T08:30:00Z"
    }
  ],
  "timestamp": "2024-03-02T08:30:00Z"
}
```

---

## 3. جلب تفاصيل رحلة واحدة
**Endpoint:** `GET /api/trips/:id`

**الغرض:** جلب جميع تفاصيل رحلة معينة (يُستخدم عند فتح نافذة التفاصيل)

**Response:**
```json
{
  "trip": {
    "id": 1,
    "trip_number": "TRIP-2024-001",
    "rider_id": 2,
    "rider_name": "سارة أحمد حسن",
    "rider_phone": "01112345678",
    "rider_avatar": "/profile.jpg",
    "driver_id": 1,
    "driver_name": "أحمد محمد علي",
    "driver_phone": "01012345678",
    "driver_avatar": "/profile.jpg",
    "driver_rating": 4.8,
    "vehicle_type": "سيدان",
    "vehicle_brand": "تويوتا",
    "vehicle_model": "كورولا",
    "vehicle_license": "أ ب ج 1234",
    "from_location": {
      "lat": 30.0444,
      "lng": 31.2357,
      "address": "مدينة نصر، القاهرة"
    },
    "to_location": {
      "lat": 30.0626,
      "lng": 31.2497,
      "address": "مصر الجديدة، القاهرة"
    },
    "distance_km": 5.2,
    "estimated_price": 35.50,
    "final_price": 35.50,
    "requires_ac": true,
    "status": "completed",
    "created_at": "2024-03-02T08:00:00Z",
    "accepted_at": "2024-03-02T08:02:00Z",
    "started_at": "2024-03-02T08:15:00Z",
    "completed_at": "2024-03-02T08:35:00Z",
    "payment_method": "cash",
    "notes": "رحلة سلسة بدون مشاكل"
  }
}
```

---

## 4. تحديث حالة الرحلة
**Endpoint:** `PATCH /api/trips/:id/status`

**Request Body:**
```json
{
  "status": "cancelled"
}
```

**Response:**
```json
{
  "trip": {
    "id": 1,
    "status": "cancelled",
    "cancelled_at": "2024-03-02T08:30:00Z"
  }
}
```

---

## حالات الرحلة (Trip Status)
- `open` - مفتوحة (في انتظار سائق)
- `accepted` - مقبولة (تم قبولها من سائق)
- `ongoing` - جارية (الرحلة بدأت)
- `completed` - منتهية (تم إكمال الرحلة)
- `cancelled` - ملغاة (تم إلغاء الرحلة)
- `expired` - منتهية الصلاحية (لم يتم قبولها في الوقت المحدد)

---

## طرق الدفع (Payment Methods)
- `cash` - نقدي
- `card` - بطاقة
- `wallet` - محفظة

---

## Authentication
جميع الـ endpoints تتطلب authentication token في الـ cookies:
```
Cookie: auth_token=<token>
```

---

## Error Responses
```json
{
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "الرحلة غير موجودة",
    "status": 404
  }
}
```

---

## ملاحظات للتطوير

### 1. تحسين الأداء
- استخدم pagination للرحلات (20 رحلة لكل صفحة)
- استخدم caching للبيانات التي لا تتغير كثيراً
- استخدم database indexes على الحقول المستخدمة في البحث والفلترة

### 2. Real-time Updates
- يمكن استخدام WebSocket بدلاً من polling كل 5 ثواني
- يمكن استخدام Server-Sent Events (SSE) للتحديثات اللحظية
- تأكد من إرسال فقط البيانات المتغيرة

### 3. Security
- تحقق من صلاحيات المستخدم قبل إرجاع البيانات
- استخدم rate limiting لمنع الـ abuse
- تحقق من صحة البيانات المُرسلة

### 4. Database Schema
تأكد من وجود الـ indexes التالية:
```sql
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_at ON trips(created_at);
CREATE INDEX idx_trips_rider_id ON trips(rider_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_trip_number ON trips(trip_number);
```
