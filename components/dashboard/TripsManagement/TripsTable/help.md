{
    "message": "Data retrieved successfully.",
    "data": {
        "id": 1,
        "rider_user_id": 25,
        "driver_user_id": 22,
        "vehicle_type_id": 1,
        "from_lat": "30.60690000",
        "from_lng": "32.28550000",
        "from_address": "حي  - الإسماعيلية",
        "to_lat": "30.62050000",
        "to_lng": "32.27180000",
        "to_address": "جامعة قناة السويس - البوابة الرئيسية",
        "distance_km": "4.60",
        "eta_seconds": 654,
        "price_per_km_snapshot": "3.00",
        "suggested_price": "14.00",
        "final_price": "125.30",
        "requires_ac": false,
        "notes": "Please call me when you arrive.",
        "status": "ended",
        "cancelled_by": null,
        "cancellation_reason": null,
        "created_at": "2026-03-10T10:47:47.000000Z",
        "updated_at": "2026-03-10T11:02:17.000000Z",
        "status_name": "منتهية",
        "cancelled_by_name": null,
        "rider": {
            "id": 25,
            "role": "user",
            "name": "esraa",
            "phone": "01222222242",
            "email": null,
            "agent_code": null,
            "status": "active",
            "locale": "en",
            "created_at": "2026-03-10T10:24:50.000000Z",
            "updated_at": "2026-03-10T10:24:50.000000Z",
            "role_name": "مستخدم"
        },
        "driver": {
            "id": 22,
            "role": "driver",
            "name": "Tasneem",
            "phone": "01444444444",
            "email": "driver4@example.com",
            "agent_code": null,
            "status": "active",
            "locale": "ar",
            "created_at": "2026-03-09T13:49:16.000000Z",
            "updated_at": "2026-03-10T10:38:06.000000Z",
            "role_name": "سائق",
            "driver_profile": {
                "user_id": 22,
                "rating_avg": "4.00",
                "rating_count": 1,
                "reliability_percent": 95,
                "national_id_number": "12345678901234",
                "driver_license_expiry": "2028-03-09T00:00:00.000000Z",
                "expire_profile_at": "2028-03-09T00:00:00.000000Z",
                "verification_status": "approved",
                "completed_trips_count": 178,
                "cancelled_trips_count": 8,
                "online_status": "online",
                "last_lat": "30.60690000",
                "last_lng": "32.28550000",
                "last_location_at": "2026-03-10T10:33:25.000000Z",
                "created_at": "2026-03-09T13:49:16.000000Z",
                "updated_at": "2026-03-10T11:02:17.000000Z",
                "offer_locked_until": null,
                "offer_locked_trip_request_id": null,
                "verification_status_name": "موافق عليه"
            },
            "vehicles": [
                {
                    "id": 16,
                    "driver_user_id": 22,
                    "vehicle_type_id": 1,
                    "vehicle_type": {
                        "id": 1,
                        "icon": "http://192.168.1.37:8000/storage/vehicle_types/Scooter/1EoZNCArlOQEixNUHX1vJnXv6SP7njJs4ms1Llez.jpg",
                        "base_fare": "50.00",
                        "price_per_km": "3.00",
                        "requires_subscription": true,
                        "wait_time_seconds": 60,
                        "active": true,
                        "sort_order": 1,
                        "max_search_radius_km": "3.00",
                        "created_at": "2026-03-09T13:22:12.000000Z",
                        "updated_at": "2026-03-09T13:22:12.000000Z",
                        "name": "Scooter"
                    },
                    "brand": "تويوتا",
                    "brand_id": null,
                    "model": "كورولا",
                    "model_id": null,
                    "year": 2022,
                    "vehicle_year_id": null,
                    "has_ac": false,
                    "vehicle_license_number": "ABC9129",
                    "vehicle_license_expiry": "2028-03-09T00:00:00.000000Z",
                    "is_active": true,
                    "created_at": "2026-03-09T13:49:16.000000Z",
                    "updated_at": "2026-03-09T13:49:16.000000Z"
                }
            ]
        },
        "vehicle_type": {
            "id": 1,
            "icon": "http://192.168.1.37:8000/storage/vehicle_types/Scooter/1EoZNCArlOQEixNUHX1vJnXv6SP7njJs4ms1Llez.jpg",
            "base_fare": "50.00",
            "price_per_km": "3.00",
            "requires_subscription": true,
            "wait_time_seconds": 60,
            "active": true,
            "sort_order": 1,
            "max_search_radius_km": "3.00",
            "created_at": "2026-03-09T13:22:12.000000Z",
            "updated_at": "2026-03-09T13:22:12.000000Z",
            "name": "Scooter"
        },
        "offers": [
            {
                "id": 1,
                "trip_request_id": 1,
                "driver_user_id": 22,
                "offered_price": "125.30",
                "original_offered_price": "14.00",
                "is_price_changed": true,
                "edit_count": 0,
                "locked_until": "2026-03-10T11:01:35.000000Z",
                "status": "accepted",
                "created_at": "2026-03-10T11:00:35.000000Z",
                "updated_at": "2026-03-10T11:01:28.000000Z",
                "status_name": "مقبول"
            }
        ],
        "timelines": [
            {
                "id": 1,
                "trip_request_id": 1,
                "event_type": "status_change",
                "payload": {
                    "from_status": "open",
                    "to_status": "accepted",
                    "driver_id": 22,
                    "final_price": "125.30"
                },
                "created_at": "2026-03-10T11:01:28.000000Z",
                "updated_at": "2026-03-10T11:01:28.000000Z"
            },
            {
                "id": 2,
                "trip_request_id": 1,
                "event_type": "arrival_update",
                "payload": {
                    "distance": "0 km",
                    "duration": "0 mins",
                    "lat": "30.60690000",
                    "lng": "32.28550000"
                },
                "created_at": "2026-03-10T11:01:29.000000Z",
                "updated_at": "2026-03-10T11:01:29.000000Z"
            },
            {
                "id": 3,
                "trip_request_id": 1,
                "event_type": "status_change",
                "payload": {
                    "from_status": "accepted",
                    "to_status": "started",
                    "by": "rider"
                },
                "created_at": "2026-03-10T11:01:56.000000Z",
                "updated_at": "2026-03-10T11:01:56.000000Z"
            },
            {
                "id": 4,
                "trip_request_id": 1,
                "event_type": "status_change",
                "payload": {
                    "from_status": "started",
                    "to_status": "ended",
                    "by": "rider"
                },
                "created_at": "2026-03-10T11:02:17.000000Z",
                "updated_at": "2026-03-10T11:02:17.000000Z"
            }
        ],
        "ratings": [
            {
                "id": 1,
                "trip_request_id": 1,
                "rater_user_id": 25,
                "rated_user_id": 22,
                "rater_type": "rider",
                "stars": 4,
                "comment": "التعامل لطيف",
                "created_at": "2026-03-10T11:02:17.000000Z",
                "updated_at": "2026-03-10T11:02:17.000000Z",
                "rater_type_name": "راكب",
                "has_comment": true,
                "tags": [
                    {
                        "id": 1,
                        "label_ar": "سائق محترم",
                        "label_en": "Respectful Driver",
                        "applicable_to": "rider",
                        "min_stars": 4,
                        "max_stars": 5,
                        "is_positive": true,
                        "active": true,
                        "created_at": "2026-03-09T13:08:12.000000Z",
                        "updated_at": "2026-03-09T13:08:12.000000Z",
                        "label": "سائق محترم",
                        "pivot": {
                            "trip_rating_id": 1,
                            "rating_tag_id": 1
                        }
                    },
                    {
                        "id": 2,
                        "label_ar": "قيادة آمنة",
                        "label_en": "Safe Driving",
                        "applicable_to": "rider",
                        "min_stars": 4,
                        "max_stars": 5,
                        "is_positive": true,
                        "active": true,
                        "created_at": "2026-03-09T13:08:12.000000Z",
                        "updated_at": "2026-03-09T13:08:12.000000Z",
                        "label": "قيادة آمنة",
                        "pivot": {
                            "trip_rating_id": 1,
                            "rating_tag_id": 2
                        }
                    },
                    {
                        "id": 3,
                        "label_ar": "سيارة نظيفة",
                        "label_en": "Clean Car",
                        "applicable_to": "rider",
                        "min_stars": 4,
                        "max_stars": 5,
                        "is_positive": true,
                        "active": true,
                        "created_at": "2026-03-09T13:08:12.000000Z",
                        "updated_at": "2026-03-09T13:08:12.000000Z",
                        "label": "سيارة نظيفة",
                        "pivot": {
                            "trip_rating_id": 1,
                            "rating_tag_id": 3
                        }
                    }
                ],
                "rater": {
                    "id": 25,
                    "role": "user",
                    "name": "esraa",
                    "phone": "01222222242",
                    "email": null,
                    "agent_code": null,
                    "status": "active",
                    "locale": "en",
                    "created_at": "2026-03-10T10:24:50.000000Z",
                    "updated_at": "2026-03-10T10:24:50.000000Z",
                    "role_name": "مستخدم"
                },
                "rated_user": {
                    "id": 22,
                    "role": "driver",
                    "name": "Tasneem",
                    "phone": "01444444444",
                    "email": "driver4@example.com",
                    "agent_code": null,
                    "status": "active",
                    "locale": "ar",
                    "created_at": "2026-03-09T13:49:16.000000Z",
                    "updated_at": "2026-03-10T10:38:06.000000Z",
                    "role_name": "سائق"
                }
            }
        ]
    }
}