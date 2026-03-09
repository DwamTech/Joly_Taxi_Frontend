/* الحقول الخاصه بال rider */

{
	"message": "تم استرجاع استراكشر موديل rider بنجاح",
	"model": "rider",
	"schema": {
		"user": {
			"id": "integer",
			"name": "string",
			"phone": "string",
			"email": "string|nullable",
			"role": "enum:user,driver,admin",
			"status": "enum:active,inactive,blocked",
			"locale": "string",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"rider_profile": {
			"id": "integer",
			"user_id": "integer",
			"rating_avg": "decimal:2",
			"rating_count": "integer",
			"reliability_percent": "integer",
			"completed_trips_count": "integer",
			"cancelled_trips_count": "integer",
			"preferences": "json|nullable",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"devices": {
			"id": "integer",
			"user_id": "integer",
			"device_id": "string",
			"device_type": "string|nullable",
			"fcm_token": "string|nullable",
			"last_active_at": "timestamp|nullable",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"blocked_users": {
			"id": "integer",
			"blocker_user_id": "integer",
			"blocked_user_id": "integer",
			"reason": "string|nullable",
			"status": "enum:active,inactive",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"blocked_by_users": {
			"id": "integer",
			"blocker_user_id": "integer",
			"blocked_user_id": "integer",
			"reason": "string|nullable",
			"status": "enum:active,inactive",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"favorite_trips": {
			"id": "integer",
			"user_id": "integer",
			"trip_id": "integer|nullable",
			"vehicle_type_id": "integer",
			"title": "string",
			"from_lat": "decimal:8",
			"from_lng": "decimal:8",
			"to_lat": "decimal:8",
			"to_lng": "decimal:8",
			"requires_ac": "boolean",
			"usage_count": "integer",
			"last_estimated_price": "decimal:2|nullable",
			"last_estimated_at": "timestamp|nullable",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"received_ratings": {
			"id": "integer",
			"trip_request_id": "integer",
			"rater_user_id": "integer",
			"rated_user_id": "integer",
			"rater_type": "enum:driver,rider",
			"stars": "integer:1-5",
			"comment": "string|nullable",
			"tags": "array of rating_tags",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"sent_ratings": {
			"id": "integer",
			"trip_request_id": "integer",
			"rater_user_id": "integer",
			"rated_user_id": "integer",
			"rater_type": "enum:driver,rider",
			"stars": "integer:1-5",
			"comment": "string|nullable",
			"tags": "array of rating_tags",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		}
	}
}


/* الحقول الخاصة بال */

{
	"message": "تم استرجاع استراكشر موديل driver بنجاح",
	"model": "driver",
	"schema": {
		"user": {
			"id": "integer",
			"name": "string",
			"phone": "string",
			"email": "string|nullable",
			"password": "string (hashed)",
			"agent_code": "string|nullable",
			"role": "enum:user,driver,admin",
			"status": "enum:active,inactive,blocked",
			"locale": "string",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"driver_profile": {
			"user_id": "integer (primary key)",
			"rating_avg": "decimal:2",
			"rating_count": "integer",
			"reliability_percent": "integer",
			"national_id_number": "string",
			"driver_license_expiry": "date",
			"expire_profile_at": "date",
			"verification_status": "string",
			"online_status": "boolean",
			"last_lat": "decimal:8",
			"last_lng": "decimal:8",
			"last_location_at": "datetime|nullable",
			"offer_locked_until": "datetime|nullable",
			"offer_locked_trip_request_id": "integer|nullable",
			"completed_trips_count": "integer",
			"cancelled_trips_count": "integer",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"vehicles": {
			"id": "integer",
			"driver_user_id": "integer",
			"vehicle_type_id": "integer",
			"brand_id": "integer",
			"model_id": "integer",
			"vehicle_year_id": "integer",
			"has_ac": "boolean",
			"vehicle_license_number": "string",
			"vehicle_license_expiry": "date",
			"is_active": "boolean",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"driver_documents": {
			"id": "integer",
			"driver_user_id": "integer",
			"type": "string",
			"file_path": "string",
			"file_url": "string (accessor)",
			"expires_at": "date|nullable",
			"status": "string",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"driver_subscriptions": {
			"id": "integer",
			"driver_id": "integer",
			"vehicle_type_id": "integer",
			"months": "integer",
			"total_price": "decimal:2",
			"reference": "string|nullable",
			"paid_amount": "decimal:2",
			"status": "string",
			"start_date": "datetime",
			"end_date": "datetime",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"devices": {
			"id": "integer",
			"user_id": "integer",
			"device_id": "string",
			"device_type": "string|nullable",
			"fcm_token": "string|nullable",
			"last_active_at": "datetime|nullable",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"blocked_users": {
			"id": "integer",
			"blocker_user_id": "integer",
			"blocked_user_id": "integer",
			"reason": "string|nullable",
			"status": "string",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"blocked_by_users": {
			"id": "integer",
			"blocker_user_id": "integer",
			"blocked_user_id": "integer",
			"reason": "string|nullable",
			"status": "string",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"received_ratings": {
			"id": "integer",
			"trip_request_id": "integer",
			"rater_user_id": "integer",
			"rated_user_id": "integer",
			"rater_type": "string",
			"stars": "integer",
			"comment": "string|nullable",
			"tags": "array of rating_tags (belongsToMany)",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		},
		"sent_ratings": {
			"id": "integer",
			"trip_request_id": "integer",
			"rater_user_id": "integer",
			"rated_user_id": "integer",
			"rater_type": "string",
			"stars": "integer",
			"comment": "string|nullable",
			"tags": "array of rating_tags (belongsToMany)",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		}
	}
}

/* ال user */

{
	"message": "تم استرجاع استراكشر موديل user بنجاح",
	"model": "user",
	"schema": {
		"id": "integer",
		"name": "string",
		"phone": "string",
		"email": "string|nullable",
		"password": "string (hashed)",
		"role": "enum:user,driver,admin",
		"status": "enum:active,inactive,blocked",
		"locale": "string",
		"agent_code": "string|nullable",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
}