import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FileImageOutlined, BarChartOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

// Function to generate menu items
function getItem(label, key, icon, link) {
  return { key, icon, label, link };
}

// Sidebar menu items
const items = [
  getItem('View Image', '1', <FileImageOutlined />, '/'),
  getItem('KPI', '2', <BarChartOutlined />, '/kpi'),
];

const LayoutGlobal = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Track selected key

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update selected key when a menu item is clicked
  };

  return (
    <Layout>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="bg-gray-800 text-white fixed top-0 bottom-0 left-0 z-10"
        width={240}
      >
        <div className="flex justify-center p-4">
          {/* Logo */}
          <img
            src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
            alt="Logo"
            className="w-12 h-12"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Dynamically set the selected key
          onClick={handleMenuClick} // Handle click to update state
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.link}>{item.label}</Link>,
          }))}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Content className="p-3">
          {/* Child content */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;
