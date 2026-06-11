import type { ThemeConfig } from "antd";
import { IncidentStatus, Priority } from "./api/types";

/** Brand palette — modern enterprise service-management look. */
export const brand = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  navy900: "#0b1b34",
  navy800: "#0f2444",
  navy700: "#13294b",
  surface: "#f4f6fb",
  border: "#e6e9f0",
  text: "#0f172a",
  textMuted: "#64748b",
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorTextBase: brand.text,
    colorBgLayout: brand.surface,
    borderRadius: 10,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 38,
    boxShadowSecondary:
      "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      headerHeight: 60,
      bodyBg: brand.surface,
      siderBg: brand.navy900,
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "rgba(59,130,246,0.18)",
      darkItemHoverBg: "rgba(255,255,255,0.06)",
      darkItemColor: "rgba(255,255,255,0.72)",
      darkItemSelectedColor: "#ffffff",
      itemHeight: 44,
      itemBorderRadius: 8,
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 22,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#475569",
      headerSplitColor: "transparent",
      rowHoverBg: "#f5f8ff",
      cellPaddingBlock: 14,
    },
    Button: {
      controlHeight: 38,
      fontWeight: 500,
      primaryShadow: "0 6px 16px rgba(37,99,235,0.24)",
    },
    Statistic: {
      contentFontSize: 30,
    },
  },
};

/** Soft "pill with dot" styling for incident status. */
export const STATUS_STYLE: Record<
  IncidentStatus,
  { bg: string; color: string; dot: string; label: string }
> = {
  NEW: { bg: "#f1f5f9", color: "#475569", dot: "#64748b", label: "New" },
  ASSIGNED: { bg: "#eef2ff", color: "#4338ca", dot: "#6366f1", label: "Assigned" },
  IN_PROGRESS: { bg: "#eff6ff", color: "#1d4ed8", dot: "#2563eb", label: "In Progress" },
  ON_HOLD: { bg: "#fff7ed", color: "#b45309", dot: "#f59e0b", label: "On Hold" },
  RESOLVED: { bg: "#ecfdf5", color: "#15803d", dot: "#16a34a", label: "Resolved" },
  CLOSED: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Closed" },
  CANCELLED: { bg: "#fef2f2", color: "#9f1239", dot: "#fb7185", label: "Cancelled" },
};

/** Bold solid badges for priority (P1..P4 feel). */
export const PRIORITY_STYLE: Record<
  Priority,
  { bg: string; color: string; label: string }
> = {
  CRITICAL: { bg: "#dc2626", color: "#ffffff", label: "Critical" },
  HIGH: { bg: "#ea580c", color: "#ffffff", label: "High" },
  MEDIUM: { bg: "#f59e0b", color: "#ffffff", label: "Medium" },
  LOW: { bg: "#0ea5e9", color: "#ffffff", label: "Low" },
};
