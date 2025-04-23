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

  // Handle sidebar collapse based on screen size
  useEffect(() => {
    setCollapsed(!screens.md);
  }, [screens.md]);

  // Determine selected menu item
  const selectedKey = items.find((item) => item.link === location.pathname)?.key || "1";

  // Handle menu item click
  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find((item) => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.link);
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        collapsedWidth={screens.xs ? 0 : 80}
        trigger={null}
        className="fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl"
        style={{ transition: "width 0.3s ease-in-out" }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <img
            src="/images/photo.jpg"
            alt="Logo"
            className={`h-12 w-12 rounded-full border-2 border-white shadow-md transition-transform duration-300 ${
              collapsed ? "scale-90" : "scale-100"
            }`}
          />
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          className="mt-4"
          items={items.map((item) => ({
            key: item.key,
            icon: (
              <span className="text-lg">{item.icon}</span>
            ),
            label: collapsed ? (
              <Tooltip placement="right" title={item.label}>
                <span className="sr-only">{item.label}</span>
              </Tooltip>
            ) : (
              <span className="font-medium">{item.label}</span>
            ),
          }))}
          style={{ background: "transparent", borderRight: "none" }}
        />
      </Sider>

      {/* Main Content */}
      <Layout
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? (screens.xs ? 0 : 80) : 250,
          minHeight: "100vh",
        }}
      >
        <Content
          className="p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-sm m-4"
          style={{ minHeight: "calc(100vh - 2rem)" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;