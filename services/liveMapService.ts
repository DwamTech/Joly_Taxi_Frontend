import { ApiDriver, ApiMapSummary, DriverLocation } from "@/models/LiveMap";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

// Map vehicle type name → icon
function vehicleIcon(vehicleType: string): string {
  const lower = vehicleType.toLowerCase();
  if (lower.includes("سكوتر") || lower.includes("scooter")) return "🛵";
  if (lower.includes("فاخر") || lower.includes("luxury"))   return "🚘";
  if (lower.includes("كبير") || lower.includes("van"))      return "🚐";
  return "🚗";
}

// Convert API driver → DriverLocation used by existing components
export function toDriverLocation(d: ApiDriver): DriverLocation {
  return {
    driver_id:        d.id,
    driver_name:      d.name,
    phone:            "",           // not in API response
    vehicle_type:     d.vehicle_type,
    vehicle_type_icon: vehicleIcon(d.vehicle_type),
    status:           d.status as DriverLocation["status"],
    rating:           d.rating,
    trips_today:      d.trips_today,
    latitude:         d.latitude,
    longitude:        d.longitude,
    last_update:      new Date().toISOString(),
  };
}

export interface LiveMapData {
  drivers: DriverLocation[];
  summary: ApiMapSummary;
}

export class LiveMapService {
  static async getOnlineDrivers(): Promise<LiveMapData> {
    const token = AuthService.getToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/live-map/online-drivers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`فشل تحميل بيانات الخريطة: ${response.status}`);
    }

    const json = await response.json();
    const { drivers, summary } = json.data;

    return {
      drivers: (drivers as ApiDriver[]).map(toDriverLocation),
      summary,
    };
  }
}
