# تثبيت مكتبات الخريطة

## المكتبات المطلوبة

لتشغيل الخريطة الحقيقية، يجب تثبيت المكتبات التالية:

```bash
npm install leaflet
npm install @types/leaflet --save-dev
```

## البدائل

إذا واجهت مشاكل في التثبيت، يمكنك استخدام CDN:

### في `app/layout.tsx` أضف:

```tsx
<head>
  <link 
    rel="stylesheet" 
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossOrigin=""
  />
  <script 
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossOrigin=""
  />
</head>
```

## استخدام الخريطة

الخريطة تستخدم:
- **OpenStreetMap** - خرائط مجانية ومفتوحة المصدر
- **Leaflet** - مكتبة JavaScript خفيفة للخرائط التفاعلية

## المميزات

- ✅ خريطة حقيقية مع الشوارع والأماكن
- ✅ علامات مخصصة للسائقين
- ✅ خطوط توضح مسار الرحلات
- ✅ Popups تفاعلية
- ✅ Zoom و Pan
- ✅ مجانية بالكامل

## البدائل الأخرى

إذا أردت استخدام خرائط أخرى:

### Google Maps
```bash
npm install @react-google-maps/api
```
**ملاحظة:** يتطلب API Key مدفوع

### Mapbox
```bash
npm install mapbox-gl
```
**ملاحظة:** يتطلب API Key (مجاني حتى 50,000 طلب/شهر)

## الإحداثيات المستخدمة

الخريطة تركز على القاهرة، مصر:
- خط العرض: 30.0444
- خط الطول: 31.2357
- مستوى التكبير: 12

يمكنك تغيير هذه القيم في `MapView.tsx`
