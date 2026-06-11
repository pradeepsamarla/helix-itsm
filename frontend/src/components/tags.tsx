import { IncidentStatus, Priority } from "../api/types";
import { PRIORITY_STYLE, STATUS_STYLE } from "../theme";

export function StatusTag({ value }: { value: IncidentStatus }) {
  const s = STATUS_STYLE[value];
  return (
    <span className="pill" style={{ background: s.bg, color: s.color }}>
      <span className="pill-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export function PriorityTag({ value }: { value: Priority }) {
  const p = PRIORITY_STYLE[value];
  return (
    <span className="badge-solid" style={{ background: p.bg, color: p.color }}>
      {p.label}
    </span>
  );
}
