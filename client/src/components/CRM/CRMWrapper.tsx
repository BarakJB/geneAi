import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import PensionCalculator from '../PensionCalculator';
import SalaryCalculator from '../SalaryCalculator';
import PayslipAnalyzer from '../PayslipAnalyzer';
import AddClient from './AddClient';
import InsuranceWebView from '../InsuranceWebView';
import Integrations from '../Integrations';
import NewLead from './NewLead';
import ScheduleMeeting from './ScheduleMeeting';
import Reports from './Reports';
import { 
  Layout,
  Typography,
  Avatar,
  Button,
  Dropdown,
} from 'antd';
import {
  ShopOutlined,
  MenuOutlined,
  CalculatorOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserAddOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SecurityScanOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  title: string;
  url: string;
  color: string;
  isPrimary: boolean;
  isInternal: boolean;
}

const CRMWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Add custom styles for dropdown menu
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .crm-dropdown-menu .ant-dropdown-menu {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
        border: 2px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 16px !important;
        padding: 12px !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        backdrop-filter: blur(10px) !important;
        min-width: 280px !important;
      }
      
      .crm-dropdown-menu .ant-dropdown-menu-item {
        background: transparent !important;
        color: #ffffff !important;
        border-radius: 10px !important;
        margin: 4px 0 !important;
        padding: 12px 16px !important;
        transition: all 0.3s ease !important;
      }
      
      .crm-dropdown-menu .ant-dropdown-menu-item:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        transform: translateX(-4px) !important;
      }
      
      .crm-dropdown-menu .ant-dropdown-menu-item-group-title {
        color: rgba(255, 255, 255, 0.6) !important;
        padding: 8px 16px !important;
        font-size: 12px !important;
      }
      
      .crm-dropdown-menu .ant-dropdown-menu-item-divider {
        background: rgba(255, 255, 255, 0.1) !important;
        margin: 8px 0 !important;
      }
      
      .crm-dropdown-menu .ant-dropdown-menu-item-icon {
        color: #ffffff !important;
        margin-inline-end: 12px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.isInternal) {
      navigate(item.url);
    } else {
      window.open(item.url, '_blank');
    }
  };

  const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <HomeOutlined />, title: 'דאשבורד ראשי', url: '/crm/dashboard', color: '#007AFF', isPrimary: true, isInternal: true },
    { key: 'pension', icon: <CalculatorOutlined />, title: 'מחשבון פנסיה', url: '/crm/pension', color: '#FFFFFF', isPrimary: false, isInternal: true },
    { key: 'salary', icon: <DollarOutlined />, title: 'מחשבון שכר', url: '/crm/salary', color: '#FFFFFF', isPrimary: false, isInternal: true },
    { key: 'payslip', icon: <FileTextOutlined />, title: 'ניתוח תלוש', url: '/crm/payslip', color: '#FFFFFF', isPrimary: false, isInternal: true },
    { key: 'add-client', icon: <UserAddOutlined />, title: 'הוספת לקוח', url: '/crm/add-client', color: '#059669', isPrimary: false, isInternal: true },
    { key: 'insurance', icon: <SecurityScanOutlined />, title: 'הר הביטוח', url: '/crm/insurance', color: '#6366f1', isPrimary: false, isInternal: true },
    { key: 'integrations', icon: <ApiOutlined />, title: 'אינטגרציות', url: '/crm/integrations', color: '#f59e0b', isPrimary: false, isInternal: true },
    { key: 'divider', icon: <></>, title: '', url: '', color: '', isPrimary: false, isInternal: false },
    { key: 'lead', icon: <FileSearchOutlined />, title: 'ליד חדש', url: '/crm/new-lead', color: '#1890ff', isPrimary: false, isInternal: true },
    { key: 'meeting', icon: <CalendarOutlined />, title: 'קבע פגישה', url: '/crm/schedule-meeting', color: '#faad14', isPrimary: false, isInternal: true },
    { key: 'reports', icon: <BarChartOutlined />, title: 'דוחות', url: '/crm/reports', color: '#722ed1', isPrimary: false, isInternal: true },
    { key: 'logout', icon: <LogoutOutlined />, title: 'יציאה', url: '/crm/login', color: '#ef4444', isPrimary: false, isInternal: true },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/crm/pension':
        return '📈 מחשבון פנסיה';
      case '/crm/salary':
        return '💰 מחשבון שכר';
      case '/crm/payslip':
        return '📄 ניתוח תלוש';
      case '/crm/add-client':
        return '👤 הוספת לקוח';
      case '/crm/insurance':
        return '🏛️ הר הביטוח';
      case '/crm/integrations':
        return '🔗 מנהל אינטגרציות';
      case '/crm/new-lead':
        return '🎯 ליד חדש';
      case '/crm/schedule-meeting':
        return '📅 קביעת פגישה';
      case '/crm/reports':
        return '📊 דוחות ואנליטיקה';
      case '/crm/dashboard':
      default:
        return '🏠 דאשבורד ראשי';
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/crm/pension':
        return <PensionCalculator />;
      case '/crm/salary':
        return <SalaryCalculator />;
      case '/crm/payslip':
        return <PayslipAnalyzer />;
      case '/crm/add-client':
        return <AddClient />;
      case '/crm/insurance':
        return <InsuranceWebView />;
      case '/crm/integrations':
        return <Integrations />;
      case '/crm/new-lead':
        return <NewLead />;
      case '/crm/schedule-meeting':
        return <ScheduleMeeting />;
      case '/crm/reports':
        return <Reports />;
      case '/crm/dashboard':
      default:
        return <Dashboard />;
    }
  };

  // Create menu items for Ant Design Dropdown
  const dropdownMenuItems = menuItems.map((item, index) => {
    if (item.key === 'divider') {
      return {
        type: 'divider' as const,
        key: `divider-${index}`,
      };
    }

    return {
      key: item.key,
      icon: item.icon,
      label: (
        <div style={{ 
          direction: 'rtl', 
          textAlign: 'right',
          fontWeight: item.isPrimary ? 700 : 500,
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
        }}>
          <span style={{ color: item.isPrimary ? '#007AFF' : '#ffffff' }}>{item.icon}</span>
          <span style={{ color: item.isPrimary ? '#007AFF' : '#ffffff' }}>{item.title}</span>
        </div>
      ),
      onClick: () => handleMenuItemClick(item),
    };
  });

  // Add section headers
  const finalMenuItems = [
    ...dropdownMenuItems.slice(0, 7), // First 7 items
    {
      type: 'group' as const,
      label: (
        <Text type="secondary" style={{ fontSize: '12px', direction: 'rtl' }}>
          פונקציות CRM נוספות
        </Text>
      ),
      key: 'group-additional',
    },
    ...dropdownMenuItems.slice(8), // Rest of items (skip divider)
  ];

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    padding: '16px 32px',
    height: 'auto',
  };

  const overlayStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    opacity: 0.4,
    pointerEvents: 'none',
  };

  return (
    <Layout style={containerStyle}>
      {/* CRM Header */}
      <Header style={headerStyle}>
        <div style={overlayStyle} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Avatar 
                size={48}
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
                icon={<ShopOutlined style={{ color: 'white' }} />}
              />
            </motion.div>
            <div style={{ direction: 'rtl', textAlign: 'right' }}>
              <Title 
                level={3} 
                style={{ 
                  fontWeight: 800, 
                  color: 'white',
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 3vw, 1.75rem)',
                }}
              >
                {getPageTitle()}
              </Title>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
              }}>
                {currentTime.toLocaleDateString('he-IL')} • {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </div>
          </div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Dropdown
              menu={{ 
                items: finalMenuItems,
                style: {
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  minWidth: '280px',
                },
              }}
              placement="bottomRight"
              trigger={['click']}
              overlayStyle={{
                borderRadius: '20px',
                overflow: 'hidden',
                marginTop: '8px',
              }}
              overlayClassName="crm-dropdown-menu"
            >
              <Button 
                type="text"
                size="large"
                style={{ 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon={<MenuOutlined style={{ fontSize: '24px' }} />}
              />
            </Dropdown>
          </motion.div>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ 
        position: 'relative', 
        zIndex: 1,
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        minHeight: 'calc(100vh - 88px)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: 'calc(100vh - 88px)' }}
        >
          {renderContent()}
        </motion.div>
      </Content>
    </Layout>
  );
};

export default CRMWrapper;