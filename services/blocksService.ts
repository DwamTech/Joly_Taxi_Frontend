import { AuthService } from "./authService";
import {
  BlockStatisticsRankItem,
  BlockStatisticsUser,
  BlockUser,
  GetUserBlocksResponse,
  GetUserBlocksStatisticsResponse,
  UserBlockItem,
  UserBlocksPaginationData,
  UserBlocksStatisticsData,
} from "@/models/Block";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

class BlocksService {
  private toSafeUser(user: any): BlockUser {
    return {
      id: Number(user?.id ?? 0),
      name: String(user?.name ?? "غير متوفر"),
      phone: String(user?.phone ?? "غير متوفر"),
      email: String(user?.email ?? "غير متوفر"),
      role: String(user?.role ?? "user"),
      status: String(user?.status ?? "inactive"),
      blocks_count:
        user?.blocks_count === undefined || user?.blocks_count === null
          ? undefined
          : Number(user.blocks_count),
    };
  }

  private toSafeBlockItem(item: any): UserBlockItem {
    return {
      id: Number(item?.id ?? 0),
      blocker: this.toSafeUser(item?.blocker),
      blocked: this.toSafeUser(item?.blocked),
      reason: String(item?.reason ?? "غير محدد"),
      status: String(item?.status ?? "inactive"),
      created_at: String(item?.created_at ?? ""),
      updated_at: String(item?.updated_at ?? item?.created_at ?? ""),
    };
  }

  private normalizePaginationData(data: any, page: number): UserBlocksPaginationData {
    const rawList = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
    const list = rawList.map((item) => this.toSafeBlockItem(item));
    const currentPage = Number(data?.current_page ?? page);
    const perPage = Number(data?.per_page ?? (list.length > 0 ? list.length : 15));
    const total = Number(data?.total ?? list.length);
    const lastPage = Number(data?.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1))));

    return {
      current_page: currentPage,
      data: list,
      first_page_url: String(data?.first_page_url ?? ""),
      from: data?.from ?? (list.length > 0 ? 1 : null),
      last_page: Math.max(1, lastPage),
      last_page_url: String(data?.last_page_url ?? ""),
      links: Array.isArray(data?.links) ? data.links : [],
      next_page_url: data?.next_page_url ?? null,
      path: String(data?.path ?? ""),
      per_page: Math.max(1, perPage),
      prev_page_url: data?.prev_page_url ?? null,
      to: data?.to ?? (list.length > 0 ? list.length : null),
      total: Math.max(0, total),
    };
  }

  private toSafeStatisticsUser(user: any): BlockStatisticsUser {
    return {
      id: Number(user?.id ?? 0),
      name: String(user?.name ?? "غير متوفر"),
      phone: String(user?.phone ?? "غير متوفر"),
      role: String(user?.role ?? "user"),
      role_name: user?.role_name ? String(user.role_name) : undefined,
    };
  }

  private toSafeStatisticsRankItem(item: any): BlockStatisticsRankItem {
    return {
      user: this.toSafeStatisticsUser(item?.user),
      block_count: Number(item?.block_count ?? 0),
    };
  }

  private normalizeStatisticsData(data: any): UserBlocksStatisticsData {
    return {
      total_blocks: Number(data?.total_blocks ?? 0),
      active_blocks: Number(data?.active_blocks ?? 0),
      inactive_blocks: Number(data?.inactive_blocks ?? 0),
      cancelled_blocks: Number(data?.cancelled_blocks ?? 0),
      today_blocks: Number(data?.today_blocks ?? 0),
      this_week_blocks: Number(data?.this_week_blocks ?? 0),
      this_month_blocks: Number(data?.this_month_blocks ?? 0),
      most_blocked_users: Array.isArray(data?.most_blocked_users)
        ? data.most_blocked_users.map((item: any) => this.toSafeStatisticsRankItem(item))
        : [],
      most_blocking_users: Array.isArray(data?.most_blocking_users)
        ? data.most_blocking_users.map((item: any) => this.toSafeStatisticsRankItem(item))
        : [],
    };
  }

  async getUserBlocks(page: number = 1): Promise<GetUserBlocksResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/user-blocks?page=${page}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "فشل في جلب قائمة الحظر";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const error = await response.json().catch(() => null);
        if (error?.message) {
          message = error.message;
        }
        if (error?.errors) {
          const details = Object.values(error.errors).flat().join(" | ");
          if (details) {
            message = `${message}: ${details}`;
          }
        }
      } else {
        const text = await response.text().catch(() => "");
        if (text) {
          message = text;
        }
      }

      throw new Error(message);
    }

    const payload = await response.json().catch(() => null);

    if (!payload) {
      throw new Error("تعذر قراءة استجابة الخادم");
    }

    if (payload?.ok === false) {
      throw new Error(payload?.message || "فشل في جلب قائمة الحظر");
    }

    return {
      ok: true,
      message: String(payload?.message ?? "تم جلب قائمة الحظر بنجاح"),
      data: this.normalizePaginationData(payload?.data, page),
    };
  }

  async getUserBlocksStatistics(): Promise<GetUserBlocksStatisticsResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/user-blocks/statistics`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "فشل في جلب إحصائيات الحظر";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const error = await response.json().catch(() => null);
        if (error?.message) {
          message = error.message;
        }
      } else {
        const text = await response.text().catch(() => "");
        if (text) {
          message = text;
        }
      }

      throw new Error(message);
    }

    const payload = await response.json().catch(() => null);

    if (!payload) {
      throw new Error("تعذر قراءة استجابة الخادم");
    }

    if (payload?.ok === false) {
      throw new Error(payload?.message || "فشل في جلب إحصائيات الحظر");
    }

    return {
      ok: true,
      message: String(payload?.message ?? "تم جلب إحصائيات الحظر بنجاح"),
      data: this.normalizeStatisticsData(payload?.data),
    };
  }
}

export const blocksService = new BlocksService();
