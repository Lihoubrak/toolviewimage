import React, { useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileImageOutlined,
  BarChartOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

// Helper function to create menu item objects
function getItem(label, key, icon, link) {
  return { key, icon, label, link };
}

// Define the menu items
const items = [
  getItem("View Image", "1", <FileImageOutlined />, "/"),
  getItem("KPI", "2", <BarChartOutlined />, "/kpi"),
  getItem("Compare Excel", "3", <FileExcelOutlined />, "/compareexcel"),
];

const LayoutGlobal = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the selected key based on the current route
  const selectedKey =
    items.find((item) => item.link === location.pathname)?.key || "1";

  // Handle menu item clicks
  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.link);
    }
  };

  // Create the items array for the antd Menu component
  const menuItemsForAntd = items.map((item) => ({
    key: item.key,
    icon: item.icon,
    // When collapsed, wrap the label in a Tooltip so the full label shows on hover
    label: collapsed ? (
      <Tooltip title={item.label} placement="right">
        <span>{item.label}</span>
      </Tooltip>
    ) : (
      item.label
    ),
  }));

  return (
    <Layout>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240} // Width when expanded
        collapsedWidth={80} // Width when collapsed
        className="bg-gray-800 text-white fixed top-0 bottom-0 left-0 z-10"
      >
        <div className="flex justify-center p-4">
          <img
            src="/images/photo.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full"
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          items={menuItemsForAntd} // Pass items via the `items` prop
        />
      </Sider>

      {/* Main Content Area */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "margin-left 0.2s",
        }}
      >
        <Content className="p-3">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;
