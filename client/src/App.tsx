import React from 'react';
import { ConfigProvider, Layout, Typography, Button, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PensionCalculator from './components/PensionCalculator';
import SalaryCalculatorPage from './components/SalaryCalculatorPage';
import PayslipAnalyzer from './components/PayslipAnalyzer';
import Login from './components/Login';
import CRMWrapper from './components/CRM/CRMWrapper';
import LeadFormPage from './components/LeadFormPage';
import MarketingSite from './components/MarketingSite';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import 'antd/dist/reset.css';
import './App.css';
import './theme.css';

const { Header } = Layout;
const { Title } = Typography;

// Custom theme configuration for Ant Design based on theme mode
const getAntdTheme = (themeMode: 'dark' | 'light') => ({
  token: {
    // Primary colors
    colorPrimary: themeMode === 'dark' ? '#98c8ef' : '#007AFF',
    colorPrimaryHover: themeMode === 'dark' ? '#1976D2' : '#5AC8FA',
    colorPrimaryActive: themeMode === 'dark' ? '#0D47A1' : '#0056CC',
    
    // Success colors
    colorSuccess: themeMode === 'dark' ? '#4CAF50' : '#34C759',
    colorSuccessHover: themeMode === 'dark' ? '#66BB6A' : '#30D158',
    
    // Warning colors  
    colorWarning: themeMode === 'dark' ? '#FFC107' : '#FF9500',
    
    // Error colors
    colorError: themeMode === 'dark' ? '#F44336' : '#FF3B30',
    
    // Background colors
    colorBgBase: themeMode === 'dark' ? '#0f0f23' : '#ffffff',
    colorBgContainer: themeMode === 'dark' ? '#222' : '#ffffff',
    colorBgElevated: themeMode === 'dark' ? '#333' : '#ffffff',
    
    // Text colors
    colorText: themeMode === 'dark' ? '#ffffff' : '#1C1C1E',
    colorTextSecondary: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#8E8E93',
    colorTextTertiary: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#C7C7CC',
    
    // Border
    colorBorder: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#dee2e6',
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
    boxShadow: themeMode === 'dark' ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
    boxShadowSecondary: themeMode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.07)',
    boxShadowTertiary: themeMode === 'dark' ? '0 8px 20px rgba(0,0,0,0.7)' : '0 8px 20px rgba(0,0,0,0.08)',
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
      boxShadow: themeMode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
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
  algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
});

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [
    { path: '/', label: 'מחשבון פנסיה' },
    { path: '/salary', label: 'מחשבון שכר סוכן' },
    { path: '/payslip', label: 'ניתוח תלוש' },
    { path: '/lead', label: 'טופס ליד' },
    { path: '/crm/login', label: 'CRM' },
  ];

  const headerBackground = theme.mode === 'dark' 
    ? 'linear-gradient(135deg, #98c8ef 0%, #1976D2 100%)'
    : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)';

  return (
    <Header
      style={{
        background: headerBackground,
        boxShadow: '0 4px 20px rgba(0,122,255,0.3)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/cover-logo.png" 
          alt="Cover" 
          style={{ 
            height: '32px', 
            width: 'auto'
          }} 
        />
        <Title
          level={4}
          style={{
            color: 'white',
            margin: 0,
            fontWeight: 400,
            fontSize: '16px',
            direction: 'rtl',
          }}
        >
          כלים חכמים
        </Title>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Theme Toggle Button */}
        <Button
          type="text"
          size="large"
          onClick={toggleTheme}
          style={{
            color: 'white',
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {theme.mode === 'dark' ? '☀️' : '🌙'} {theme.mode === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
        </Button>
        
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
          {/* Top bar is now unified via Navigation component */}
          <Navigation />
          
          

          <PensionCalculator />

          
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

// Internal App component that uses theme
const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <ConfigProvider theme={getAntdTheme(theme.mode)} direction="rtl">
      <Router>
        <Layout
          style={{
            minHeight: '100vh',
            background: theme.colors.primary,
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
              path="/lead" 
              element={
                <PageWrapper>
                  <Navigation />
                  <LeadFormPage />
                </PageWrapper>
              } 
            />
            <Route 
              path=":brand" 
              element={
                <PageWrapper>
                  <Navigation />
                  <LeadFormPage />
                </PageWrapper>
              } 
            />
            <Route 
              path="/salary" 
              element={
                <PageWrapper>
                  <Navigation />
                  <SalaryCalculatorPage />
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
              path="/site/preview" 
              element={
                <PageWrapper>
                  <Navigation />
                  <div style={{ padding: '0px' }}>
                    <MarketingSite />
                  </div>
                </PageWrapper>
              } 
            />
            <Route 
              path="/site/:slug" 
              element={
                <PageWrapper>
                  <Navigation />
                  <div style={{ padding: 0 }}>
                    <MarketingSite />
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
            <Route 
              path="/crm/tasks" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/xml-import" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/client-management" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/clients" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/client/:clientId" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/campaigns" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/bionic-agent" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
            <Route 
              path="/crm/website-builder" 
              element={
                <PageWrapper>
                  <CRMWrapper />
                </PageWrapper>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;