import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  createIncident,
  getCategories,
  getGroups,
  getUsers,
} from "../api/incidents";
import { CreateIncidentRequest, Level, Priority, Ref } from "../api/types";
import { PriorityTag } from "../components/tags";

const LEVELS: Level[] = ["LOW", "MEDIUM", "HIGH"];

/** Mirror of backend Priority.fromMatrix for an instant preview. */
function previewPriority(impact?: Level, urgency?: Level): Priority | null {
  if (!impact || !urgency) return null;
  if (impact === "HIGH" && urgency === "HIGH") return "CRITICAL";
  if (impact === "HIGH" || urgency === "HIGH") return "HIGH";
  if (impact === "MEDIUM" || urgency === "MEDIUM") return "MEDIUM";
  return "LOW";
}

export default function IncidentCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateIncidentRequest>();
  const [users, setUsers] = useState<Ref[]>([]);
  const [groups, setGroups] = useState<Ref[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const impact = Form.useWatch("impact", form);
  const urgency = Form.useWatch("urgency", form);
  const preview = previewPriority(impact, urgency);

  useEffect(() => {
    Promise.all([getUsers(), getGroups(), getCategories()])
      .then(([u, g, c]) => {
        setUsers(u);
        setGroups(g);
        setCategories(c);
      })
      .catch(() => message.error("Failed to load reference data"));
  }, []);

  const onFinish = (values: CreateIncidentRequest) => {
    setSubmitting(true);
    createIncident(values)
      .then((incident) => {
        message.success(`Created ${incident.number}`);
        navigate(`/incidents/${incident.id}`);
      })
      .catch(() => message.error("Failed to create incident"))
      .finally(() => setSubmitting(false));
  };

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
      <h1 className="page-title" style={{ marginBottom: 18 }}>
        New Incident
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ impact: "MEDIUM", urgency: "MEDIUM" }}
      >
        <Row gutter={18}>
          <Col xs={24} lg={16}>
            <Card className="section-card" title="Incident details" style={{ marginBottom: 18 }}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Short summary of the issue" maxLength={250} />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea rows={5} placeholder="Detailed description" />
              </Form.Item>

              <Form.Item label="Category" name="categoryId">
                <Select
                  allowClear
                  placeholder="Select a category"
                  options={refOptions(categories)}
                />
              </Form.Item>
            </Card>

            <Card className="section-card" title="Classification">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Impact" name="impact" rules={[{ required: true }]}>
                    <Select options={LEVELS.map((l) => ({ value: l, label: l }))} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Urgency" name="urgency" rules={[{ required: true }]}>
                    <Select options={LEVELS.map((l) => ({ value: l, label: l }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Space align="center">
                <Typography.Text type="secondary">
                  Derived priority:
                </Typography.Text>
                {preview ? (
                  <PriorityTag value={preview} />
                ) : (
                  <Typography.Text type="secondary">—</Typography.Text>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="section-card" title="Assignment" style={{ marginBottom: 18 }}>
              <Form.Item label="Reporter" name="reporterId">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Who reported this?"
                  options={refOptions(users)}
                />
              </Form.Item>
              <Form.Item label="Assign to group" name="assignedGroupId">
                <Select allowClear placeholder="Support group" options={refOptions(groups)} />
              </Form.Item>
              <Form.Item label="Assign to agent" name="assigneeId">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Agent"
                  options={refOptions(users)}
                />
              </Form.Item>
            </Card>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              size="large"
            >
              Create Incident
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
