import React, { useState } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileImageOutlined, BarChartOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

// Function to generate menu items
function getItem(label, key, icon, link) {
  return { key, icon, label, link };
}

// Sidebar menu items
const items = [
  getItem('View Image', '1', <FileImageOutlined />, '/'),
  getItem('KPI', '2', <BarChartOutlined />, '/kpi'),
  getItem('Compare Excel', '3', <FileExcelOutlined />, '/compareexcel'),
];

const LayoutGlobal = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the selected key based on the current route
  const selectedKey = items.find(item => item.link === location.pathname)?.key || '1';

  // Handle menu item clicks
  const handleMenuClick = (e) => {
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.link); // Navigate to the selected route
    }
  };

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
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed} // Ensure the menu respects the collapsed state
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {/* Disable tooltip when collapsed */}
              {collapsed ? (
                <Tooltip title={null} placement="right">
                  <span>{item.label}</span>
                </Tooltip>
              ) : (
                item.label
              )}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Content className="p-3">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;