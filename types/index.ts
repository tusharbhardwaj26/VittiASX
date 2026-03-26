// TypeScript types for ASX announcement data

export interface Announcement {
  ticker: string;
  company: string;
  headline: string;
  time: string;          // ISO string
  url: string;
  market_sensitive: boolean;
  document_type: string;
  summary: string[];
  tags: string[];
}

export interface DayLog {
  date: string;
  total: number;
  market_sensitive_count: number;
  generated_at: string;
  announcements: Announcement[];
}

export type ViewMode = 'grid' | 'list';
