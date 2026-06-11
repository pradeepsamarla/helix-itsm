import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button, Card, Col, Row, Skeleton, message } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  FileTextFilled,
  WarningFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getStats } from "../api/incidents";
import { DashboardStats, IncidentStatus, Priority } from "../api/types";
import { PriorityTag, StatusTag } from "../components/tags";
import { PRIORITY_STYLE, STATUS_STYLE } from "../theme";

type Kpi = {
  label: string;
  value: number;
  accent: string;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => message.error("Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <Row gutter={[18, 18]}>
        {[0, 1, 2, 3].map((i) => (
          <Col xs={24} sm={12} xl={6} key={i}>
            <Card className="section-card">
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  const kpis: Kpi[] = [
    {
      label: "Total Incidents",
      value: stats.total,
      accent: "#2563eb",
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      icon: <FileTextFilled />,
    },
    {
      label: "Open",
      value: stats.open,
      accent: "#0ea5e9",
      iconBg: "#e0f2fe",
      iconColor: "#0284c7",
      icon: <ClockCircleFilled />,
    },
    {
      label: "Resolved / Closed",
      value: stats.resolved,
      accent: "#16a34a",
      iconBg: "#ecfdf5",
      iconColor: "#16a34a",
      icon: <CheckCircleFilled />,
    },
    {
      label: "SLA Breached",
      value: stats.slaBreached,
      accent: "#dc2626",
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      icon: <WarningFilled />,
    },
  ];

  const statusKeys = Object.keys(stats.byStatus) as IncidentStatus[];
  const priorityKeys = Object.keys(stats.byPriority) as Priority[];
  const statusMax = Math.max(1, ...Object.values(stats.byStatus));
  const priorityMax = Math.max(1, ...Object.values(stats.byPriority));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="muted" style={{ marginTop: 4 }}>
            Real-time view of incident operations
          </div>
        </div>
        <Button type="primary" onClick={() => navigate("/incidents/new")}>
          New Incident
        </Button>
      </div>

      <Row gutter={[18, 18]}>
        {kpis.map((k) => (
          <Col xs={24} sm={12} xl={6} key={k.label}>
            <div
              className="kpi-card"
              style={{ "--accent": k.accent } as CSSProperties}
            >
              <div
                className="kpi-icon"
                style={{ background: k.iconBg, color: k.iconColor }}
              >
                {k.icon}
              </div>
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[18, 18]} style={{ marginTop: 18 }}>
        <Col xs={24} lg={12}>
          <Card
            className="section-card"
            title="Incidents by Status"
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/incidents")}
              >
                View all <ArrowRightOutlined />
              </Button>
            }
          >
            {statusKeys.map((k) => (
              <div className="dist-row" key={k}>
                <StatusTag value={k} />
                <div className="dist-track">
                  <div
                    className="dist-fill"
                    style={{
                      width: `${(stats.byStatus[k] / statusMax) * 100}%`,
                      background: STATUS_STYLE[k].dot,
                    }}
                  />
                </div>
                <div className="dist-count">{stats.byStatus[k]}</div>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="section-card" title="Incidents by Priority">
            {priorityKeys.map((k) => (
              <div className="dist-row" key={k}>
                <PriorityTag value={k} />
                <div className="dist-track">
                  <div
                    className="dist-fill"
                    style={{
                      width: `${(stats.byPriority[k] / priorityMax) * 100}%`,
                      background: PRIORITY_STYLE[k].bg,
                    }}
                  />
                </div>
                <div className="dist-count">{stats.byPriority[k]}</div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
