import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Drawer } from 'antd';
import { 
  SafetyOutlined, 
  HomeOutlined, 
  InfoCircleOutlined, 
  ContactsOutlined,
  BookOutlined,
  DashboardOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = ({ contentRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      icon: <BookOutlined />,
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
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    console.log('Location changed:', location.pathname);
    if (contentRef && contentRef.current) {
      console.log('Scrolling Ant Design Content to 0,0');
      contentRef.current.scrollTo(0, 0);
    } else {
      const pageContainer = document.querySelector('.page-container');
      if (pageContainer) {
        console.log('Scrolling .page-container to 0,0');
        pageContainer.scrollTo(0, 0);
      } else {
        console.log('Scrolling window to 0,0');
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, contentRef]);

  return (
    <AntHeader className="header">
      <div className="header-container">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <SafetyOutlined className="logo-icon" />
          <span className="logo-text">Watchers Guard</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="desktop-menu">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="nav-menu"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button">
          <Button
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle"
          />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-drawer"
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="mobile-nav-menu"
        />
      </Drawer>
    </AntHeader>
  );
};

export default Header; 