import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  createIncident,
  getCategories,
  getGroups,
  getUsers,
} from "../api/incidents";
import { CreateIncidentRequest, Level, Ref } from "../api/types";

const LEVELS: Level[] = ["LOW", "MEDIUM", "HIGH"];

export default function IncidentCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateIncidentRequest>();
  const [users, setUsers] = useState<Ref[]>([]);
  const [groups, setGroups] = useState<Ref[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
      <Typography.Title level={3}>New Incident</Typography.Title>
      <Card style={{ maxWidth: 720 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ impact: "MEDIUM", urgency: "MEDIUM" }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Short summary of the issue" maxLength={250} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Detailed description" />
          </Form.Item>

          <Form.Item
            label="Impact"
            name="impact"
            rules={[{ required: true }]}
          >
            <Select options={LEVELS.map((l) => ({ value: l, label: l }))} />
          </Form.Item>

          <Form.Item
            label="Urgency"
            name="urgency"
            rules={[{ required: true }]}
          >
            <Select options={LEVELS.map((l) => ({ value: l, label: l }))} />
          </Form.Item>

          <Form.Item label="Category" name="categoryId">
            <Select allowClear options={refOptions(categories)} />
          </Form.Item>

          <Form.Item label="Reporter" name="reporterId">
            <Select allowClear showSearch optionFilterProp="label" options={refOptions(users)} />
          </Form.Item>

          <Form.Item label="Assign to group" name="assignedGroupId">
            <Select allowClear options={refOptions(groups)} />
          </Form.Item>

          <Form.Item label="Assign to agent" name="assigneeId">
            <Select allowClear showSearch optionFilterProp="label" options={refOptions(users)} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create Incident
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
