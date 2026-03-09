# متطلبات API للإحصائيات

## Endpoint المطلوب للإحصائيات

### GET /api/admin/users/stats

يجب أن يرجع هذا الـ endpoint الإحصائيات الكاملة لجميع المستخدمين.

#### Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Response Format
```json
{
  "stats": {
    "total_users": 150,
    "total_drivers": 45,
    "total_riders": 120,
    "total_both": 15,
    "active_users": 130,
    "active_drivers": 40,
    "active_riders": 105,
    "inactive_users": 10,
    "blocked_users": 10
  }
}
```

#### حساب الإحصائيات

- `total_users`: إجمالي عدد المستخدمين (الكل)
- `total_drivers`: عدد المستخدمين الذين type = 'driver' أو 'both'
- `total_riders`: عدد المستخدمين الذين type = 'user' أو 'both'
- `total_both`: عدد المستخدمين الذين type = 'both' فقط
- `active_users`: عدد المستخدمين الذين status = 'active'
- `active_drivers`: عدد السائقين النشطين (type = 'driver' أو 'both' AND status = 'active')
- `active_riders`: عدد الركاب النشطين (type = 'user' أو 'both' AND status = 'active')
- `inactive_users`: عدد المستخدمين الذين status = 'inactive'
- `blocked_users`: عدد المستخدمين الذين status = 'blocked'

## بديل: إضافة الإحصائيات في response الـ users

إذا كنت لا تريد إنشاء endpoint منفصل، يمكنك إضافة الإحصائيات في response الـ `/api/admin/users`:

```json
{
  "message": "success",
  "data": [...],
  "pagination": {
    "total": 150,
    "per_page": 20,
    "current_page": 1,
    "last_page": 8,
    "from": 1,
    "to": 20
  },
  "stats": {
    "total_users": 150,
    "total_drivers": 45,
    "total_riders": 120,
    "total_both": 15,
    "active_users": 130,
    "active_drivers": 40,
    "active_riders": 105,
    "inactive_users": 10,
    "blocked_users": 10
  }
}
```

الكود الحالي يدعم الطريقتين!
