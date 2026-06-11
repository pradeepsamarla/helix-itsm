import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Input,
  List,
  Row,
  Select,
  Space,
  Spin,
  Timeline,
  Typography,
  message,
} from "antd";
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
      .catch((e) =>
        message.error(e?.response?.data?.message ?? "Update failed")
      );
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
    return <Spin />;
  }

  const refOptions = (refs: Ref[]) =>
    refs.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate("/incidents")}>← Back</Button>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {incident.number}
        </Typography.Title>
        <StatusTag value={incident.status} />
        <PriorityTag value={incident.priority} />
      </Space>

      <Row gutter={16}>
        <Col span={16}>
          <Card title={incident.title} style={{ marginBottom: 16 }}>
            <Typography.Paragraph>
              {incident.description || (
                <Typography.Text type="secondary">No description</Typography.Text>
              )}
            </Typography.Paragraph>

            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Impact">{incident.impact}</Descriptions.Item>
              <Descriptions.Item label="Urgency">{incident.urgency}</Descriptions.Item>
              <Descriptions.Item label="Category">
                {incident.category?.name ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Reporter">
                {incident.reporter?.name ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(incident.createdAt).format("MMM D, YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="SLA Due">
                {incident.slaDueAt
                  ? dayjs(incident.slaDueAt).format("MMM D, YYYY HH:mm")
                  : "-"}
                {incident.slaBreached ? " (breached)" : ""}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Work Notes & Comments" style={{ marginBottom: 16 }}>
            <List
              dataSource={incident.comments}
              locale={{ emptyText: "No comments yet" }}
              renderItem={(c) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{c.author?.name ?? "System"}</span>
                        {c.internal && (
                          <Typography.Text type="warning">[internal]</Typography.Text>
                        )}
                        <Typography.Text type="secondary">
                          {dayjs(c.createdAt).format("MMM D, HH:mm")}
                        </Typography.Text>
                      </Space>
                    }
                    description={c.body}
                  />
                </List.Item>
              )}
            />
            <Divider />
            <Input.TextArea
              rows={3}
              value={commentBody}
              placeholder="Add a comment or work note"
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
              <Checkbox
                checked={commentInternal}
                onChange={(e) => setCommentInternal(e.target.checked)}
              >
                Internal work note
              </Checkbox>
              <Button type="primary" onClick={submitComment}>
                Add
              </Button>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Actions" style={{ marginBottom: 16 }}>
            <Typography.Text strong>Status</Typography.Text>
            <Select
              style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
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
              style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
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
              style={{ width: "100%", marginTop: 4 }}
              allowClear
              placeholder="No group"
              value={incident.assignedGroup?.id}
              options={refOptions(groups)}
              onChange={(v) => patch({ assignedGroupId: v }, "Group updated")}
            />
          </Card>

          <Card title="Resolution" style={{ marginBottom: 16 }}>
            <Input.TextArea
              rows={4}
              value={resolution}
              placeholder="Describe how the incident was resolved"
              onChange={(e) => setResolution(e.target.value)}
            />
            <Button
              style={{ marginTop: 8 }}
              onClick={() => patch({ resolution }, "Resolution saved")}
            >
              Save Resolution
            </Button>
          </Card>

          <Card title="Activity">
            {incident.activity.length === 0 ? (
              <Typography.Text type="secondary">No activity yet</Typography.Text>
            ) : (
              <Timeline
                items={incident.activity.map((a) => ({
                  children: (
                    <span>
                      <strong>{a.field}</strong>: {a.oldValue ?? "-"} →{" "}
                      {a.newValue ?? "-"}
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
