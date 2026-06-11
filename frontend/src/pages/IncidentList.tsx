import { useEffect, useState } from "react";
import { Button, Card, Input, Select, Table, Tag, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { listIncidents } from "../api/incidents";
import { IncidentStatus, IncidentSummary, Priority } from "../api/types";
import { PriorityTag, StatusTag } from "../components/tags";

const STATUS_OPTIONS: IncidentStatus[] = [
  "NEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "ON_HOLD",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];
const PRIORITY_OPTIONS: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function IncidentList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<IncidentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>();
  const [priority, setPriority] = useState<string>();
  const [search, setSearch] = useState<string>(searchParams.get("q") ?? "");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearch(q);
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    listIncidents({ status, priority, search, page, size: 20 })
      .then((res) => {
        setData(res.content);
        setTotal(res.totalElements);
      })
      .catch(() => message.error("Failed to load incidents"))
      .finally(() => setLoading(false));
  }, [status, priority, search, page]);

  const columns: ColumnsType<IncidentSummary> = [
    {
      title: "Number",
      dataIndex: "number",
      render: (_, r) => (
        <Link className="incident-num-link" to={`/incidents/${r.id}`}>
          {r.number}
        </Link>
      ),
      width: 130,
    },
    { title: "Title", dataIndex: "title", ellipsis: true },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (p: Priority) => <PriorityTag value={p} />,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: IncidentStatus) => <StatusTag value={s} />,
      width: 150,
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      render: (_, r) =>
        r.assignee ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#e0e7ff",
                color: "#4338ca",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {initials(r.assignee.name)}
            </span>
            {r.assignee.name}
          </span>
        ) : (
          <span className="muted">Unassigned</span>
        ),
      width: 180,
    },
    {
      title: "Group",
      dataIndex: "assignedGroup",
      render: (_, r) => r.assignedGroup?.name ?? <span className="muted">—</span>,
      width: 160,
    },
    {
      title: "SLA",
      dataIndex: "slaBreached",
      render: (_, r) =>
        r.slaBreached ? (
          <Tag color="error">Breached</Tag>
        ) : r.slaDueAt ? (
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {dayjs(r.slaDueAt).format("MMM D, HH:mm")}
          </span>
        ) : (
          <span className="muted">—</span>
        ),
      width: 150,
    },
  ];

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
          <h1 className="page-title">Incidents</h1>
          <div className="muted" style={{ marginTop: 4 }}>
            {total} {total === 1 ? "incident" : "incidents"} total
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/incidents/new")}
        >
          New Incident
        </Button>
      </div>

      <Card className="section-card" styles={{ body: { padding: 16 } }}>
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined className="muted" />}
            placeholder="Search number, title, description"
            style={{ width: 320 }}
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
          <Select
            placeholder="All statuses"
            allowClear
            style={{ width: 170 }}
            value={status}
            options={STATUS_OPTIONS.map((s) => ({
              value: s,
              label: s.replace("_", " "),
            }))}
            onChange={(v) => {
              setPage(0);
              setStatus(v);
            }}
          />
          <Select
            placeholder="All priorities"
            allowClear
            style={{ width: 160 }}
            value={priority}
            options={PRIORITY_OPTIONS.map((p) => ({ value: p, label: p }))}
            onChange={(v) => {
              setPage(0);
              setPriority(v);
            }}
          />
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data}
          onRow={(r) => ({
            onClick: () => navigate(`/incidents/${r.id}`),
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: page + 1,
            pageSize: 20,
            total,
            onChange: (p) => setPage(p - 1),
            showSizeChanger: false,
            showTotal: (t) => `${t} total`,
          }}
        />
      </Card>
    </div>
  );
}
