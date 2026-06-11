import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList";
import IncidentDetail from "./pages/IncidentDetail";
import IncidentCreate from "./pages/IncidentCreate";

const { Header, Content, Sider } = Layout;

export default function App() {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/incidents/new")
    ? "/incidents/new"
    : location.pathname.startsWith("/incidents")
    ? "/incidents"
    : location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          Helix ITSM
        </Typography.Title>
        <Typography.Text style={{ color: "rgba(255,255,255,0.65)", marginLeft: 12 }}>
          Incident Management
        </Typography.Text>
      </Header>
      <Layout>
        <Sider width={220} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={[
              {
                key: "/",
                icon: <DashboardOutlined />,
                label: <Link to="/">Dashboard</Link>,
              },
              {
                key: "/incidents",
                icon: <UnorderedListOutlined />,
                label: <Link to="/incidents">Incidents</Link>,
              },
              {
                key: "/incidents/new",
                icon: <PlusOutlined />,
                label: <Link to="/incidents/new">New Incident</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: 24 }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<IncidentList />} />
              <Route path="/incidents/new" element={<IncidentCreate />} />
              <Route path="/incidents/:id" element={<IncidentDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
