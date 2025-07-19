import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space } from 'antd';
import { 
  SafetyOutlined, 
  HomeOutlined, 
  InfoCircleOutlined, 
  ContactsOutlined,
  BookOutlined,
  DashboardOutlined,
  SearchOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/check',
      icon: <SearchOutlined />,
      label: 'Kiểm tra',
    },
    {
      key: '/business',
      icon: <DashboardOutlined />,
      label: 'Doanh nghiệp',
    },
    {
      key: '/blog',
      icon: <BookOutlined />,
      label: 'Blog',
    },  
    {
      key: '/AIcheck',
      icon: <RobotOutlined />,
      label: 'AI Check',  
    },
    {
      key: '/Introduction',
      icon: <InfoCircleOutlined />,
      label: 'Giới thiệu',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key.startsWith('/')) {
      navigate(e.key);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AntHeader className="header">
      <div className="header-container">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <SafetyOutlined className="logo-icon" />
          <span className="logo-text">Watchers Guard</span>
        </div>
        
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="nav-menu"
        />
        
     
      </div>
    </AntHeader>
  );
};

export default Header; 