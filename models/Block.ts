export interface BlockUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  blocks_count?: number;
}

export interface UserBlockItem {
  id: number;
  blocker: BlockUser;
  blocked: BlockUser;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserBlocksPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface UserBlocksPaginationData {
  current_page: number;
  data: UserBlockItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: UserBlocksPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface GetUserBlocksResponse {
  ok: boolean;
  message: string;
  data: UserBlocksPaginationData;
}

export interface BlockStatisticsUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  role_name?: string;
}

export interface BlockStatisticsRankItem {
  user: BlockStatisticsUser;
  block_count: number;
}

export interface UserBlocksStatisticsData {
  total_blocks: number;
  active_blocks: number;
  inactive_blocks: number;
  cancelled_blocks: number;
  today_blocks: number;
  this_week_blocks: number;
  this_month_blocks: number;
  most_blocked_users: BlockStatisticsRankItem[];
  most_blocking_users: BlockStatisticsRankItem[];
}

export interface GetUserBlocksStatisticsResponse {
  ok: boolean;
  message: string;
  data: UserBlocksStatisticsData;
}
