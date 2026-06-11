import type { ThemeConfig } from "antd";
import { IncidentStatus, Priority } from "./api/types";

/** Khadamatech brand palette — emerald primary with a deep-green enterprise shell. */
export const brand = {
  primary: "#047551",
  primaryDark: "#035c40",
  primaryLight: "#0a9e6e",
  accent: "#0d9488",
  shell900: "#04231b",
  shell800: "#063a2b",
  shell700: "#075c43",
  surface: "#f3f7f5",
  border: "#e2e9e5",
  text: "#0f1d17",
  textMuted: "#5b6b63",
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorLink: brand.primary,
    colorTextBase: brand.text,
    colorBgLayout: brand.surface,
    borderRadius: 10,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 38,
    boxShadowSecondary:
      "0 1px 2px rgba(4,40,30,0.04), 0 8px 24px rgba(4,40,30,0.06)",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      headerHeight: 60,
      bodyBg: brand.surface,
      siderBg: brand.shell900,
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "rgba(10,158,110,0.22)",
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
      headerBg: "#f1f6f3",
      headerColor: "#475c53",
      headerSplitColor: "transparent",
      rowHoverBg: "#eef6f2",
      cellPaddingBlock: 14,
    },
    Button: {
      controlHeight: 38,
      fontWeight: 500,
      primaryShadow: "0 6px 16px rgba(4,117,81,0.26)",
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
  IN_PROGRESS: { bg: "#e6f5ef", color: "#047551", dot: "#0a9e6e", label: "In Progress" },
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
  LOW: { bg: "#0d9488", color: "#ffffff", label: "Low" },
};
