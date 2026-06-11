export type Level = "LOW" | "MEDIUM" | "HIGH";

export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export interface Ref {
  id: number;
  name: string;
}

export interface IncidentSummary {
  id: number;
  number: string;
  title: string;
  status: IncidentStatus;
  priority: Priority;
  impact: Level;
  urgency: Level;
  category: Ref | null;
  assignee: Ref | null;
  assignedGroup: Ref | null;
  slaDueAt: string | null;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  author: Ref | null;
  body: string;
  internal: boolean;
  createdAt: string;
}

export interface Activity {
  id: number;
  actor: Ref | null;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export interface IncidentDetail extends IncidentSummary {
  description: string | null;
  reporter: Ref | null;
  resolution: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  allowedNextStatuses: IncidentStatus[];
  comments: Comment[];
  activity: Activity[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  slaBreached: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface CreateIncidentRequest {
  title: string;
  description?: string;
  impact: Level;
  urgency: Level;
  categoryId?: number;
  reporterId?: number;
  assigneeId?: number;
  assignedGroupId?: number;
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  impact?: Level;
  urgency?: Level;
  categoryId?: number;
  assigneeId?: number;
  assignedGroupId?: number;
  resolution?: string;
}
