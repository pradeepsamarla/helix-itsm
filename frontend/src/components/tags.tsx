import { Tag } from "antd";
import { IncidentStatus, Priority } from "../api/types";

const PRIORITY_COLORS: Record<Priority, string> = {
  CRITICAL: "red",
  HIGH: "volcano",
  MEDIUM: "gold",
  LOW: "blue",
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  NEW: "default",
  ASSIGNED: "cyan",
  IN_PROGRESS: "processing",
  ON_HOLD: "orange",
  RESOLVED: "green",
  CLOSED: "default",
  CANCELLED: "default",
};

export function PriorityTag({ value }: { value: Priority }) {
  return <Tag color={PRIORITY_COLORS[value]}>{value}</Tag>;
}

export function StatusTag({ value }: { value: IncidentStatus }) {
  return <Tag color={STATUS_COLORS[value]}>{value.replace("_", " ")}</Tag>;
}
