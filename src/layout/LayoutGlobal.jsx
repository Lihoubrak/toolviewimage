import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FileImageOutlined, DashboardOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

// Hàm tạo các item cho menu
function getItem(label, key, icon, link) {
  return {
    key,
    icon,
    label,
    link,
  };
}

// Add more items to the sidebar menu
const items = [
  getItem('View Image', '1', <FileImageOutlined />, '/'),
  getItem('KPI', '2', <BarChartOutlined />, '/kpi'),
//   getItem('Reports', '3', <BarChartOutlined />, '/reports'),
//   getItem('Settings', '4', <SettingOutlined />, '/settings'),
];

const LayoutGlobal = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
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
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.link}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Content className="p-8 overflow-auto h-full bg-gray-50 rounded-xl shadow-md">
          {/* Nội dung của các trang con */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutGlobal;
