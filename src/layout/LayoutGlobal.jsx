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
    setCollapsed(screens.xs ? true : !screens.md);
  }, [screens.xs, screens.md]);

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
    <Layout className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        collapsedWidth={screens.xs ? 0 : 64}
        trigger={null}
        className="fixed inset-y-0 left-0 z-50 bg-gray-900 text-white shadow-lg transition-all duration-200"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center py-4 px-2 border-b border-gray-700">
          <img
            src="/images/photo.jpg"
            alt="Logo"
            className={`h-10 w-10 rounded-full border-2 border-gray-200 shadow-sm transition-transform duration-200 ${
              collapsed ? "scale-90" : "scale-100"
            }`}
          />
          {!collapsed && (
            <span className="ml-2 text-lg font-semibold text-white">FBB DEPT</span>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          className="mt-3"
          items={items.map((item) => ({
            key: item.key,
            icon: (
              <span className="text-xl text-gray-300 group-hover:text-white transition-colors">
                {item.icon}
              </span>
            ),
            label: collapsed ? (
              <Tooltip placement="right" title={item.label}>
                <span className="sr-only">{item.label}</span>
              </Tooltip>
            ) : (
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                {item.label}
              </span>
            ),
            className: "group hover:bg-gray-800 rounded-lg mx-2",
          }))}
          style={{ background: "transparent", borderRight: "none" }}
        />
      </Sider>

      {/* Main Content */}
      <Layout
        className="transition-all duration-200"
        style={{
          marginLeft: collapsed ? (screens.xs ? 0 : 64) : 240,
          minHeight: "100vh",
        }}
      >
        <Content
          className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-sm m-4 sm:m-6 md:m-8"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;