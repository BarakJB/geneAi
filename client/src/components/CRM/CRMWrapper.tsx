import React from 'react';
import { useLocation } from 'react-router-dom';
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
import TaskManagement from './TaskManagement';
import PensionXMLImport from './PensionXMLImport';
import ClientManagement from './ClientManagement';
import ClientPersonalArea from './ClientPersonalArea';
 
import SidebarLayout from '../Layout/SidebarLayout';
 
 

// Removed Ant Layout header/content in favor of MinimalShell

 

const CRMWrapper: React.FC = () => {
  const location = useLocation();
  
  // Time display can be reintroduced in the header when needed

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

  // (Removed interval-based time update to keep component lean)

  // Sidebar handles navigation directly; keep navigate for internal routing when needed

  // Menu items are now defined in the SidebarLayout

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
      case '/crm/tasks':
        return '📋 ניהול משימות';
      case '/crm/xml-import':
        return '📥 ייבוא נתוני פנסיה';
      case '/crm/client-management':
        return '👥 ניהול לקוחות';
      case '/crm/clients':
        return '👥 רשימת לקוחות';
      case '/crm/dashboard':
      default:
        if (location.pathname.startsWith('/crm/client/')) {
          return '👤 איזור אישי - לקוח';
        }
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
              case '/crm/tasks':
          return <TaskManagement />;
      case '/crm/xml-import':
        return <PensionXMLImport />;
      case '/crm/client-management':
        return <ClientManagement />;
      case '/crm/clients':
        return <ClientManagement />;
      case '/crm/dashboard':
      default:
        if (location.pathname.startsWith('/crm/client/')) {
          return <ClientPersonalArea />;
        }
        return <Dashboard />;
    }
  };

  // Removed dropdown menu in favor of permanent sidebar

  // Removed old Ant header styles

  return (
    <SidebarLayout title={getPageTitle()}>
      {renderContent()}
    </SidebarLayout>
  );
};

export default CRMWrapper;