import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Empty,
  Input,
  List,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  addComment,
  getGroups,
  getIncident,
  getUsers,
  updateIncident,
} from "../api/incidents";
import { IncidentDetail as Incident, IncidentStatus, Ref } from "../api/types";
import { PriorityTag, StatusTag } from "../components/tags";

export default function IncidentDetail() {
  const { id } = useParams();
  const incidentId = Number(id);
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Ref[]>([]);
  const [groups, setGroups] = useState<Ref[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentInternal, setCommentInternal] = useState(false);
  const [resolution, setResolution] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    getIncident(incidentId)
      .then((data) => {
        setIncident(data);
        setResolution(data.resolution ?? "");
      })
      .catch(() => message.error("Failed to load incident"))
      .finally(() => setLoading(false));
  }, [incidentId]);

  useEffect(() => {
    load();
    Promise.all([getUsers(), getGroups()])
      .then(([u, g]) => {
        setUsers(u);
        setGroups(g);
      })
      .catch(() => {});
  }, [load]);

  const patch = (body: Parameters<typeof updateIncident>[1], ok: string) => {
    updateIncident(incidentId, body)
      .then(() => {
        message.success(ok);
        load();
      })
      .catch((e) => message.error(e?.response?.data?.message ?? "Update failed"));
  };

  const submitComment = () => {
    if (!commentBody.trim()) return;
    addComment(incidentId, commentBody, commentInternal)
      .then(() => {
        setCommentBody("");
        setCommentInternal(false);
        load();
      })
      .catch(() => message.error("Failed to add comment"));
  };

  if (loading || !incident) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const refOptions = (refs: Ref[]) =>
    refs.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 8, paddingLeft: 0 }}
        onClick={() => navigate("/incidents")}
      >
        Back to incidents
      </Button>

      <div className="detail-hero">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            className="incident-num-link"
            style={{ fontSize: 22, fontWeight: 800 }}
          >
            {incident.number}
          </span>
          <StatusTag value={incident.status} />
          <PriorityTag value={incident.priority} />
          {incident.slaBreached && <Tag color="error">SLA Breached</Tag>}
        </div>
        <Typography.Title level={4} style={{ margin: "12px 0 0" }}>
          {incident.title}
        </Typography.Title>
      </div>

      <Row gutter={[18, 18]}>
        <Col xs={24} lg={16}>
          <Card className="section-card" title="Details" style={{ marginBottom: 18 }}>
            <Typography.Paragraph style={{ marginBottom: 18 }}>
              {incident.description || (
                <Typography.Text type="secondary">No description</Typography.Text>
              )}
            </Typography.Paragraph>

            <Descriptions column={{ xs: 1, sm: 2 }} size="middle" bordered>
              <Descriptions.Item label="Impact">{incident.impact}</Descriptions.Item>
              <Descriptions.Item label="Urgency">{incident.urgency}</Descriptions.Item>
              <Descriptions.Item label="Category">
                {incident.category?.name ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Reporter">
                {incident.reporter?.name ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(incident.createdAt).format("MMM D, YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="SLA Due">
                {incident.slaDueAt
                  ? dayjs(incident.slaDueAt).format("MMM D, YYYY HH:mm")
                  : "—"}
                {incident.slaBreached ? " (breached)" : ""}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="section-card" title="Work Notes & Comments">
            <List
              dataSource={incident.comments}
              locale={{ emptyText: <Empty description="No comments yet" /> }}
              renderItem={(c) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          background: c.internal ? "#fef3c7" : "#d7ede5",
                          color: c.internal ? "#b45309" : "#047551",
                          fontWeight: 700,
                        }}
                      >
                        {(c.author?.name ?? "S").slice(0, 1).toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <span>{c.author?.name ?? "System"}</span>
                        {c.internal && <Tag color="warning">Internal</Tag>}
                        <Typography.Text type="secondary" style={{ fontWeight: 400 }}>
                          {dayjs(c.createdAt).format("MMM D, HH:mm")}
                        </Typography.Text>
                      </Space>
                    }
                    description={c.body}
                  />
                </List.Item>
              )}
            />
            <div style={{ marginTop: 12 }}>
              <Input.TextArea
                rows={3}
                value={commentBody}
                placeholder="Add a comment or work note"
                onChange={(e) => setCommentBody(e.target.value)}
              />
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={commentInternal}
                  onChange={(e) => setCommentInternal(e.target.checked)}
                >
                  Internal work note
                </Checkbox>
                <Button type="primary" onClick={submitComment}>
                  Add Note
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="section-card" title="Actions" style={{ marginBottom: 18 }}>
            <Typography.Text strong>Status</Typography.Text>
            <Select
              style={{ width: "100%", marginTop: 6, marginBottom: 16 }}
              value={incident.status}
              onChange={(v: IncidentStatus) => patch({ status: v }, "Status updated")}
              options={[incident.status, ...incident.allowedNextStatuses].map((s) => ({
                value: s,
                label: s.replace("_", " "),
                disabled: s === incident.status,
              }))}
            />

            <Typography.Text strong>Assignee</Typography.Text>
            <Select
              style={{ width: "100%", marginTop: 6, marginBottom: 16 }}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Unassigned"
              value={incident.assignee?.id}
              options={refOptions(users)}
              onChange={(v) => patch({ assigneeId: v }, "Assignee updated")}
            />

            <Typography.Text strong>Group</Typography.Text>
            <Select
              style={{ width: "100%", marginTop: 6 }}
              allowClear
              placeholder="No group"
              value={incident.assignedGroup?.id}
              options={refOptions(groups)}
              onChange={(v) => patch({ assignedGroupId: v }, "Group updated")}
            />
          </Card>

          <Card className="section-card" title="Resolution" style={{ marginBottom: 18 }}>
            <Input.TextArea
              rows={4}
              value={resolution}
              placeholder="Describe how the incident was resolved"
              onChange={(e) => setResolution(e.target.value)}
            />
            <Button
              type="primary"
              ghost
              style={{ marginTop: 10 }}
              onClick={() => patch({ resolution }, "Resolution saved")}
            >
              Save Resolution
            </Button>
          </Card>

          <Card className="section-card" title="Activity">
            {incident.activity.length === 0 ? (
              <Typography.Text type="secondary">No activity yet</Typography.Text>
            ) : (
              <Timeline
                items={incident.activity.map((a) => ({
                  color: "blue",
                  children: (
                    <span>
                      <strong>{a.field}</strong>: {a.oldValue ?? "—"} →{" "}
                      {a.newValue ?? "—"}
                      <br />
                      <Typography.Text type="secondary">
                        {dayjs(a.createdAt).format("MMM D, HH:mm")}
                      </Typography.Text>
                    </span>
                  ),
                }))}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
