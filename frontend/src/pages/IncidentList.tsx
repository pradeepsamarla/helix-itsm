import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
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

export default function IncidentList() {
  const navigate = useNavigate();
  const [data, setData] = useState<IncidentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>();
  const [priority, setPriority] = useState<string>();
  const [search, setSearch] = useState<string>("");

  const load = () => {
    setLoading(true);
    listIncidents({ status, priority, search, page, size: 20 })
      .then((res) => {
        setData(res.content);
        setTotal(res.totalElements);
      })
      .catch(() => message.error("Failed to load incidents"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, priority, search, page]);

  const columns: ColumnsType<IncidentSummary> = [
    {
      title: "Number",
      dataIndex: "number",
      render: (_, r) => <Link to={`/incidents/${r.id}`}>{r.number}</Link>,
      width: 130,
    },
    { title: "Title", dataIndex: "title", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: IncidentStatus) => <StatusTag value={s} />,
      width: 130,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (p: Priority) => <PriorityTag value={p} />,
      width: 110,
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      render: (_, r) => r.assignee?.name ?? <Tag>Unassigned</Tag>,
      width: 150,
    },
    {
      title: "Group",
      dataIndex: "assignedGroup",
      render: (_, r) => r.assignedGroup?.name ?? "-",
      width: 160,
    },
    {
      title: "SLA",
      dataIndex: "slaBreached",
      render: (_, r) =>
        r.slaBreached ? (
          <Tag color="red">Breached</Tag>
        ) : r.slaDueAt ? (
          dayjs(r.slaDueAt).format("MMM D, HH:mm")
        ) : (
          "-"
        ),
      width: 140,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Incidents
        </Typography.Title>
        <Button type="primary" onClick={() => navigate("/incidents/new")}>
          New Incident
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search number, title, description"
          allowClear
          style={{ width: 300 }}
          onSearch={(v) => {
            setPage(0);
            setSearch(v);
          }}
        />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          onChange={(v) => {
            setPage(0);
            setStatus(v);
          }}
        />
        <Select
          placeholder="Priority"
          allowClear
          style={{ width: 140 }}
          options={PRIORITY_OPTIONS.map((p) => ({ value: p, label: p }))}
          onChange={(v) => {
            setPage(0);
            setPriority(v);
          }}
        />
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: page + 1,
          pageSize: 20,
          total,
          onChange: (p) => setPage(p - 1),
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
