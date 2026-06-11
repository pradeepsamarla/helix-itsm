import { useState } from "react";
import { Avatar, Breadcrumb, Input, Layout, Menu, Tooltip } from "antd";
import {
  AppstoreOutlined,
  BellOutlined,
  DashboardOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList";
import IncidentDetail from "./pages/IncidentDetail";
import IncidentCreate from "./pages/IncidentCreate";

const { Header, Content, Sider } = Layout;

function crumbsFor(pathname: string): string[] {
  if (pathname === "/") return ["Overview", "Dashboard"];
  if (pathname.startsWith("/incidents/new"))
    return ["Incident Management", "Incidents", "New Incident"];
  if (pathname.startsWith("/incidents/")) return ["Incident Management", "Incidents", "Detail"];
  if (pathname.startsWith("/incidents")) return ["Incident Management", "Incidents"];
  return ["Helix"];
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = location.pathname.startsWith("/incidents/new")
    ? "/incidents/new"
    : location.pathname.startsWith("/incidents")
    ? "/incidents"
    : location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="app-header">
        <div className="brand">
          <div className="brand-logo">H</div>
          <div>
            <div className="brand-name">Helix ITSM</div>
            <div className="brand-sub">Service Management</div>
          </div>
        </div>
        <div className="header-search" style={{ flex: 1, maxWidth: 460, marginLeft: 24 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search incidents, people, knowledge…"
            onPressEnter={(e) => {
              const v = (e.target as HTMLInputElement).value.trim();
              navigate(v ? `/incidents?q=${encodeURIComponent(v)}` : "/incidents");
            }}
          />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Tooltip title="Help">
            <QuestionCircleOutlined className="header-icon-btn" />
          </Tooltip>
          <Tooltip title="Notifications">
            <BellOutlined className="header-icon-btn" />
          </Tooltip>
          <Avatar
            style={{ background: "#2563eb", fontWeight: 600 }}
            size={34}
          >
            AD
          </Avatar>
        </div>
      </Header>
      <Layout>
        <Sider
          className="app-sider"
          width={244}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
        >
          {!collapsed && <div className="sider-section-label">ITSM</div>}
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            style={{ borderRight: 0 }}
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
          {!collapsed && <div className="sider-section-label">Coming soon</div>}
          {!collapsed && (
            <Menu
              mode="inline"
              theme="dark"
              selectable={false}
              style={{ borderRight: 0, opacity: 0.5 }}
              items={[
                { key: "problem", icon: <AppstoreOutlined />, label: "Problem", disabled: true },
                { key: "change", icon: <AppstoreOutlined />, label: "Change", disabled: true },
                { key: "cmdb", icon: <AppstoreOutlined />, label: "CMDB", disabled: true },
              ]}
            />
          )}
        </Sider>
        <Layout style={{ padding: "20px 28px 28px" }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={crumbsFor(location.pathname).map((c) => ({ title: c }))}
          />
          <Content>
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
