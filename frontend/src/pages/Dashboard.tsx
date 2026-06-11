import { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Statistic, Typography, message } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getStats } from "../api/incidents";
import { DashboardStats } from "../api/types";
import { PriorityTag, StatusTag } from "../components/tags";
import { IncidentStatus, Priority } from "../api/types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => message.error("Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <Spin />;
  }

  return (
    <div>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Open"
              value={stats.open}
              valueStyle={{ color: "#1668dc" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Resolved / Closed"
              value={stats.resolved}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="SLA Breached"
              value={stats.slaBreached}
              valueStyle={{ color: "#cf1322" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="By Status">
            {Object.entries(stats.byStatus).map(([k, v]) => (
              <div
                key={k}
                style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}
              >
                <StatusTag value={k as IncidentStatus} />
                <strong>{v}</strong>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="By Priority">
            {Object.entries(stats.byPriority).map(([k, v]) => (
              <div
                key={k}
                style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}
              >
                <PriorityTag value={k as Priority} />
                <strong>{v}</strong>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
