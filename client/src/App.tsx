import React from 'react';
import { ConfigProvider, Layout, Typography, Button } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PensionCalculator from './components/PensionCalculator';
import SalaryCalculator from './components/SalaryCalculator';
import PayslipAnalyzer from './components/PayslipAnalyzer';
import Login from './components/Login';
import CRMWrapper from './components/CRM/CRMWrapper';
import GoogleAd from './components/GoogleAd';
import FloatingAd from './components/FloatingAd';
import AdDebugger from './components/AdDebugger';
import 'antd/dist/reset.css';
import './App.css';

const { Header } = Layout;
const { Title } = Typography;

// Custom theme configuration for Ant Design
const customTheme = {
  token: {
    // Primary colors
    colorPrimary: '#007AFF', // Apple Blue
    colorPrimaryHover: '#5AC8FA',
    colorPrimaryActive: '#0056CC',
    
    // Success colors
    colorSuccess: '#34C759', // Apple Green
    colorSuccessHover: '#30D158',
    
    // Warning colors  
    colorWarning: '#FF9500', // Apple Orange
    
    // Error colors
    colorError: '#FF3B30', // Apple Red
    
    // Background colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#1C1C1E',
    colorTextSecondary: '#8E8E93',
    colorTextTertiary: '#C7C7CC',
    
    // Border
    borderRadius: 16,
    borderRadiusLG: 20,
    borderRadiusSM: 12,
    
    // Font
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    fontSizeHeading1: 56,
    fontSizeHeading2: 40,
    fontSizeHeading3: 32,
    fontSizeHeading4: 28,
    fontSizeHeading5: 24,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    
    // Shadows
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    boxShadowSecondary: '0 4px 12px rgba(0,0,0,0.07)',
    boxShadowTertiary: '0 8px 20px rgba(0,0,0,0.08)',
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 48,
      fontWeight: 600,
      paddingInline: 24,
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 48,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 48,
    },
  },
};

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'מחשבון פנסיה' },
    { path: '/salary', label: 'מחשבון שכר' },
    { path: '/payslip', label: 'ניתוח תלוש' },
    { path: '/crm/login', label: 'CRM' },
  ];

  return (
    <Header
      style={{
        background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
        boxShadow: '0 4px 20px rgba(0,122,255,0.3)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}
    >
      <Title
        level={3}
        style={{
          color: 'white',
          margin: 0,
          fontWeight: 700,
          fontSize: '24px',
          direction: 'rtl',
        }}
      >
        GeneAI - כלים חכמים
      </Title>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/'
            : item.path.startsWith('/crm')
            ? location.pathname.startsWith('/crm')
            : location.pathname === item.path;

          return (
            <Button
              key={item.path}
              type="text"
              size="large"
              style={{
                color: 'white',
                fontWeight: 600,
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              <Link
                to={item.path}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </Header>
  );
};

// Home page component
const HomePage: React.FC = () => {
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          {/* Navigation Buttons */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            left: '20px',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Left side - Other calculators */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/salary">
                <Button
                  size="large"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    color: '#007AFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    direction: 'rtl',
                  }}
                >
                  💰 מחשבון שכר
                </Button>
              </Link>
              <Link to="/payslip">
                <Button
                  size="large"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    color: '#007AFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    direction: 'rtl',
                  }}
                >
                  📄 ניתוח תלוש
                </Button>
              </Link>
            </div>

            {/* Right side - CRM access */}
            <Link to="/crm/login">
              <Button
                type="primary"
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(0,122,255,0.3)',
                  direction: 'rtl',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                🏢 כניסה ל-CRM
              </Button>
            </Link>
          </div>
          
          {/* פרסומת עליונה */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginBottom: '32px' }}
          >
            <GoogleAd 
              adSlot="1111222233"
              adFormat="horizontal"
              style={{ marginTop: '20px' }}
            />
          </motion.div>

          <PensionCalculator />

          {/* פרסומת צדדית קבועה */}
          <div 
            className="google-ad-sidebar left"
            style={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              width: '160px'
            }}>
            <GoogleAd 
              adSlot="4444555566"
              adFormat="vertical"
              style={{ 
                position: 'sticky',
                top: '50vh',
                transform: 'translateY(-50%)'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Page wrapper component for better animation control
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <ConfigProvider theme={customTheme} direction="rtl">
      <Router>
        <Layout
          style={{
            minHeight: '100vh',
            background: '#ffffff',
          }}
        >
          <Routes>
            <Route 
              path="/" 
              element={
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              } 
            />
            <Route 
              path="/salary" 
              element={
                <PageWrapper>
                  <Navigation />
                  <div style={{ padding: '24px' }}>
                    <SalaryCalculator />
                  </div>
                </PageWrapper>
              } 
            />
            <Route 
              path="/payslip" 
              element={
                <PageWrapper>
                  <Navigation />
                  <div style={{ padding: '24px' }}>
                    <PayslipAnalyzer />
                  </div>
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/login" 
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/dashboard" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/pension" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/salary" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/payslip" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/add-client" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/insurance" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/integrations" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/new-lead" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/schedule-meeting" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/reports" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
          </Routes>
        </Layout>
        
        {/* פרסומת צפה חכמה */}
        <FloatingAd />
        
        {/* כלי בדיקת פרסומות - רק בפיתוח */}
        {process.env.NODE_ENV === 'development' && <AdDebugger />}
      </Router>
    </ConfigProvider>
  );
}

export default App;