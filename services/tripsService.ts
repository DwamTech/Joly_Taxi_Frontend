import { Trip, TripStatus } from "@/models/Trip";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch all trips from the API
 * This endpoint should return only trip data without full user/driver details
 * to optimize performance and reduce data transfer
 */
export async function fetchTrips(): Promise<Trip[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication token if needed
        // "Authorization": `Bearer ${token}`,
      },
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }

    const data = await response.json();
    return data.trips || data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
}

/**
 * Fetch real-time updates for trips
 * This should return only trip-specific fields that change frequently:
 * - status
 * - current location (if ongoing)
 * - distance_km (if ongoing)
 * - estimated_price
 * - timestamps (accepted_at, started_at, completed_at, cancelled_at)
 * 
 * User and driver information should NOT be included to avoid unnecessary data transfer
 */
export async function fetchTripUpdates(
  lastUpdateTime?: string
): Promise<Partial<Trip>[]> {
  try {
    const params = new URLSearchParams();
    if (lastUpdateTime) {
      params.append("since", lastUpdateTime);
    }

    const response = await fetch(
      `${API_BASE_URL}/trips/updates?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trip updates: ${response.statusText}`);
    }

    const data = await response.json();
    return data.updates || data;
  } catch (error) {
    console.error("Error fetching trip updates:", error);
    throw error;
  }
}

/**
 * Fetch a single trip with full details
 * This includes complete user and driver information
 * Used when viewing trip details modal
 */
export async function fetchTripDetails(tripId: number): Promise<Trip> {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trip details: ${response.statusText}`);
    }

    const data = await response.json();
    return data.trip || data;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw error;
  }
}

/**
 * Update trip status
 */
export async function updateTripStatus(
  tripId: number,
  status: TripStatus
): Promise<Trip> {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update trip status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.trip || data;
  } catch (error) {
    console.error("Error updating trip status:", error);
    throw error;
  }
}

/**
 * Helper function to merge trip updates with existing trip data
 * This preserves user/driver information while updating trip-specific fields
 */
export function mergeTripUpdates(
  existingTrips: Trip[],
  updates: Partial<Trip>[]
): Trip[] {
  const updatesMap = new Map(updates.map((update) => [update.id, update]));

  return existingTrips.map((trip) => {
    const update = updatesMap.get(trip.id);
    if (!update) return trip;

    // Merge only trip-specific fields, preserve user/driver data
    return {
      ...trip,
      // Update trip-specific fields
      status: update.status ?? trip.status,
      distance_km: update.distance_km ?? trip.distance_km,
      estimated_price: update.estimated_price ?? trip.estimated_price,
      final_price: update.final_price ?? trip.final_price,
      from_location: update.from_location ?? trip.from_location,
      to_location: update.to_location ?? trip.to_location,
      accepted_at: update.accepted_at ?? trip.accepted_at,
      started_at: update.started_at ?? trip.started_at,
      completed_at: update.completed_at ?? trip.completed_at,
      cancelled_at: update.cancelled_at ?? trip.cancelled_at,
      cancelled_by: update.cancelled_by ?? trip.cancelled_by,
      cancellation_reason: update.cancellation_reason ?? trip.cancellation_reason,
      notes: update.notes ?? trip.notes,
      // Keep existing user/driver data unchanged
      // rider_name, rider_phone, driver_name, driver_phone, driver_avatar, driver_rating
      // are NOT updated from the updates endpoint
    };
  });
}
