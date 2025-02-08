import React, { useState, useEffect } from "react";
import { Layout, Menu, Tooltip, Grid } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FiImage, FiBarChart2, FiFileText } from "react-icons/fi";
import { FaFirefoxBrowser } from "react-icons/fa";
const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const getItem = (label, key, icon, link) => ({ key, icon, label, link });

const items = [
  getItem("View Image", "1", <FiImage />, "/"),
  getItem("KPI", "2", <FiBarChart2 />, "/kpi"),
  getItem("Compare Excel", "3", <FiFileText />, "/compareexcel"),
  getItem("Website Work", "4", <FaFirefoxBrowser />, "/listweb"),
];

const LayoutGlobal = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    if (!screens.md) {
      setCollapsed(true);
    }
  }, [screens.md]);

  const selectedKey =
    items.find((item) => item.link === location.pathname)?.key || "1";

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.link);
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        collapsedWidth={screens.xs ? 0 : 90}
        className="fixed top-0 left-0 bottom-0 bg-gray-900 text-white shadow-lg"
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <img
            src="/images/photo.jpg"
            alt="Logo"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          className="mt-2"
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: collapsed ? (
              <Tooltip title={item.label} placement="right">
                <span>{item.label}</span>
              </Tooltip>
            ) : (
              <span>{item.label}</span>
            ),
          }))}
        />
      </Sider>

      {/* Main Content Area */}
      <Layout
        className="transition-all"
        style={{ marginLeft: collapsed ? (screens.xs ? 0 : 80) : 240 }}
      >
        {/* Content */}
        <Content className="p-6 bg-gray-100 min-h-screen">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;
