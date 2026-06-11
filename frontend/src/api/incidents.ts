import { api } from "./client";
import {
  CreateIncidentRequest,
  DashboardStats,
  IncidentDetail,
  IncidentSummary,
  Page,
  Ref,
  UpdateIncidentRequest,
  Comment,
} from "./types";

export interface IncidentQuery {
  status?: string;
  priority?: string;
  assigneeId?: number;
  groupId?: number;
  search?: string;
  page?: number;
  size?: number;
}

export async function listIncidents(
  query: IncidentQuery
): Promise<Page<IncidentSummary>> {
  const { data } = await api.get<Page<IncidentSummary>>("/api/incidents", {
    params: query,
  });
  return data;
}

export async function getIncident(id: number): Promise<IncidentDetail> {
  const { data } = await api.get<IncidentDetail>(`/api/incidents/${id}`);
  return data;
}

export async function createIncident(
  req: CreateIncidentRequest
): Promise<IncidentDetail> {
  const { data } = await api.post<IncidentDetail>("/api/incidents", req);
  return data;
}

export async function updateIncident(
  id: number,
  req: UpdateIncidentRequest
): Promise<IncidentDetail> {
  const { data } = await api.patch<IncidentDetail>(`/api/incidents/${id}`, req);
  return data;
}

export async function addComment(
  id: number,
  body: string,
  internal: boolean,
  authorId?: number
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/api/incidents/${id}/comments`, {
    body,
    internal,
    authorId,
  });
  return data;
}

export async function getStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/api/dashboard/stats");
  return data;
}

export async function getUsers(): Promise<Ref[]> {
  const { data } = await api.get<Ref[]>("/api/reference/users");
  return data;
}

export async function getGroups(): Promise<Ref[]> {
  const { data } = await api.get<Ref[]>("/api/reference/groups");
  return data;
}

export async function getCategories(): Promise<Ref[]> {
  const { data } = await api.get<Ref[]>("/api/reference/categories");
  return data;
}
