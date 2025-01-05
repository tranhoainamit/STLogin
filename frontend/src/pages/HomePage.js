import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import './HomePage.css';

const { Header, Sider, Content } = Layout;

function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePath, setProfilePath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo && userInfo.username) {
      setUsername(userInfo.username);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSelectPath = async () => {
    try {
      const selectedPath = await window.electron.ipcRenderer.invoke('select-profile-path');
      setProfilePath(selectedPath);
      message.success(`Selected profile path: ${selectedPath}`);
    } catch (error) {
      message.error('Failed to select profile path');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMenuClick = (key) => {
    if (key === '1') navigate('/home/profile');
    else if (key === '2') navigate('/home/proxy');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">STLogin</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={({ key }) => handleMenuClick(key)}>
          <Menu.Item key="1" icon={<PlusOutlined />}>
            Hồ Sơ
          </Menu.Item>
          <Menu.Item key="2" icon={<DatabaseOutlined />}>
            Quản lý proxy
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, textAlign: 'right', paddingRight: 20 }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <span style={{ color: '#1890ff', cursor: 'pointer' }}>
              <UserOutlined style={{ marginRight: 8 }} />
              {username}
            </span>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          <Button type="primary" onClick={handleSelectPath}>
            Settings (Select Profile Path)
          </Button>
          {profilePath && <p>Current Profile Path: {profilePath}</p>}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomePage;
