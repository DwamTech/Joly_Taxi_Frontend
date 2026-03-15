/**
 * دالة لتنسيق القيم الفارغة أو غير المعرفة
 * @param value القيمة المراد تنسيقها
 * @param fallback القيمة الافتراضية (افتراضياً "لا يوجد")
 * @returns القيمة المنسقة
 */
export function formatValue(value: any, fallback: string = "لا يوجد"): string {
  if (value === null || value === undefined || value === "" || value === "undefined") {
    return fallback;
  }
  
  if (typeof value === "string" && value.trim() === "") {
    return fallback;
  }
  
  return String(value);
}

/**
 * دالة لتنسيق الأرقام مع التعامل مع القيم الفارغة
 * @param value القيمة الرقمية
 * @param fallback القيمة الافتراضية
 * @returns الرقم المنسق أو القيمة الافتراضية
 */
export function formatNumber(value: number | null | undefined, fallback: string = "لا يوجد"): string {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return String(value);
}

/**
 * دالة لتنسيق النصوص مع التعامل مع القيم الفارغة
 * @param value النص
 * @param fallback القيمة الافتراضية
 * @returns النص المنسق أو القيمة الافتراضية
 */
export function formatText(value: string | null | undefined, fallback: string = "لا يوجد"): string {
  if (!value || value.trim() === "" || value === "undefined") {
    return fallback;
  }
  return value;
}

/**
 * دالة لتنسيق التواريخ مع التعامل مع القيم الفارغة
 * @param dateString تاريخ كنص
 * @param fallback القيمة الافتراضية
 * @returns التاريخ المنسق أو القيمة الافتراضية
 */
export function formatDate(dateString: string | null | undefined, fallback: string = "لا يوجد"): string {
  if (!dateString || dateString === "undefined") {
    return fallback;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
}
/**
 * دالة عامة لتنسيق القيم للعرض مع التعامل مع القيم الفارغة
 * @param value القيمة المراد عرضها
 * @param fallback القيمة الافتراضية (افتراضياً "لا يوجد")
 * @returns القيمة المنسقة للعرض
 */
export function formatDisplayValue(value: any, fallback: string = "لا يوجد"): string {
  return formatValue(value, fallback);
}