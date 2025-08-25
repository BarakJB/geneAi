import React from 'react';
import {
  Card,
  Typography,
  Alert,
  Button,
  Row,
  Col,
  Space,
  Divider,
  Tag,
} from 'antd';
import { 
  SecurityScanOutlined, 
  LinkOutlined, 
  BankOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

const InsuranceWebView: React.FC = () => {
  // Add custom styles for inputs to match CRM
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .insurance-webview .ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .insurance-webview .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .insurance-webview .ant-input:focus,
      .insurance-webview .ant-input-focused {
        border-color: white !important;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
      }

      .insurance-webview .ant-form-item-label > label {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const INSURANCE_URL = 'https://harb.cma.gov.il/';

  const openInNewTab = () => {
    window.open(INSURANCE_URL, '_blank');
  };

  const quickLinks = [
    { 
      title: 'מידע לצרכן', 
      url: 'https://www.gov.il/he/departments/capital_market_insurance_and_savings_authority',
      icon: <InfoCircleOutlined />
    },
    { 
      title: 'הגשת תלונה', 
      url: 'https://www.gov.il/he/service/complaint-insurance-cma',
      icon: <FileTextOutlined />
    },
    { 
      title: 'חיפוש סוכן ביטוח', 
      url: 'https://www.gov.il/he/service/agent-search-insurance',
      icon: <BankOutlined />
    },
    { 
      title: 'פיקוח על חברות', 
      url: 'https://www.gov.il/he/departments/topics/insurance_companies_supervision',
      icon: <AuditOutlined />
    },
    { 
      title: 'רישיונות וכישורים', 
      url: 'https://www.gov.il/he/service/insurance-agent-license',
      icon: <SafetyCertificateOutlined />
    },
    { 
      title: 'דוחות שנתיים', 
      url: 'https://www.gov.il/he/departments/publications/?OfficeId=71c2aba4-b87c-4229-83e0-70c99ba9f4b4',
      icon: <FileTextOutlined />
    }
  ];

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    minHeight: 'calc(100vh - 200px)',
  };

  const mainCardStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 250px)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
    color: 'white',
    padding: '24px',
    borderRadius: '16px 16px 0 0',
    marginBottom: '0',
  };

  const contentStyle: React.CSSProperties = {
    padding: '32px',
    direction: 'rtl',
  };

  return (
    <div style={containerStyle} className="insurance-webview">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={mainCardStyle} bodyStyle={{ padding: 0 }}>
          {/* Header */}
          <div style={headerStyle}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space align="center" size="large">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <SecurityScanOutlined style={{ fontSize: '28px', color: '#4ade80' }} />
                  </motion.div>
                  <div>
                    <Title level={3} style={{ color: 'white', margin: 0 }}>
                      הר הביטוח - רשות שוק ההון
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                      מידע ושירותים לצרכני הביטוח
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    <SecurityScanOutlined style={{ marginRight: '4px' }} />
                    מאובטח וממשלתי
                  </Tag>
                  <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    onClick={openInNewTab}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 600,
                      boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    פתח באתר הרשמי
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Content */}
          <div style={contentStyle}>
            {/* Warning Alert */}
            <Alert
              message="הגישה למידע הביטוחי מוגבלת"
              description="האתר של רשות שוק ההון חוסם הצגה ישירה בדפדפן מסיבות אבטחה. לחץ על הכפתור למעלה לפתיחה באתר הרשמי."
              type="warning"
              showIcon
              style={{ 
                marginBottom: '24px',
                borderRadius: '12px',
                textAlign: 'right',
                direction: 'rtl'
              }}
              action={
                <Button 
                  size="small" 
                  type="link" 
                  onClick={openInNewTab}
                  style={{ color: '#d97706' }}
                >
                  פתח עכשיו
                </Button>
              }
            />

            <Row gutter={[24, 24]}>
              {/* About Section */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <InfoCircleOutlined style={{ color: '#3b82f6' }} />
                      <span>אודות הר הביטוח</span>
                    </Space>
                  }
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                  }}
                  headStyle={{
                    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px 16px 0 0',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  bodyStyle={{ 
                    textAlign: 'right', 
                    direction: 'rtl',
                    padding: '24px',
                  }}
                >
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                    רשות שוק ההון, ביטוח וחיסכון היא הגוף הממשלתי המפקח על שוק הביטוח בישראל. 
                    הרשות אחראית על הגנת הצרכנים, פיקוח על חברות הביטוח והבטחת יציבות השוק הפיננסי.
                  </Paragraph>
                  
                  <Divider style={{ margin: '20px 0' }} />
                  
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
                      שירותים עיקריים:
                    </Text>
                    <ul style={{ margin: 0, paddingRight: '20px' }}>
                      <li>פיקוח על חברות ביטוח</li>
                      <li>רישוי סוכני ביטוח</li>
                      <li>טיפול בתלונות צרכנים</li>
                      <li>פרסום דוחות ונתונים</li>
                      <li>קביעת תקנות ונהלים</li>
                    </ul>
                  </Space>
                </Card>
              </Col>

              {/* Contact Info */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <PhoneOutlined style={{ color: '#10b981' }} />
                      <span>יצירת קשר</span>
                    </Space>
                  }
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                  }}
                  headStyle={{
                    borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px 16px 0 0',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  bodyStyle={{ 
                    textAlign: 'right', 
                    direction: 'rtl',
                    padding: '24px',
                  }}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                      <Space align="center" size="middle">
                        <PhoneOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                        <div>
                          <Text strong style={{ display: 'block', fontSize: '16px' }}>
                            מוקד שירות לקוחות
                          </Text>
                          <Text style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                            *6552
                          </Text>
                        </div>
                      </Space>
                    </div>
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div>
                      <Space align="center" size="middle">
                        <MailOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                        <div>
                          <Text strong style={{ display: 'block', fontSize: '16px' }}>
                            דוא"ל
                          </Text>
                          <Text style={{ fontSize: '16px', color: '#3b82f6' }}>
                            info@cma.gov.il
                          </Text>
                        </div>
                      </Space>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div>
                      <Text strong style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>
                        כתובת:
                      </Text>
                      <Text style={{ fontSize: '15px', lineHeight: '1.5' }}>
                        רחוב כנפי נשרים 1, ירושלים 9546434
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              {/* Quick Links */}
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <BankOutlined style={{ color: '#8b5cf6' }} />
                      <span>קישורים מהירים</span>
                    </Space>
                  }
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
                  }}
                  headStyle={{
                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px 16px 0 0',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  bodyStyle={{ 
                    textAlign: 'right', 
                    direction: 'rtl',
                    padding: '24px',
                  }}
                >
                  <Row gutter={[16, 16]}>
                    {quickLinks.map((link, index) => (
                      <Col xs={24} sm={12} lg={8} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            type="default"
                            block
                            size="large"
                            icon={link.icon}
                            onClick={() => window.open(link.url, '_blank')}
                            style={{
                              height: '60px',
                              borderRadius: '12px',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                              textAlign: 'right',
                              direction: 'rtl',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              paddingRight: '16px',
                              fontWeight: 500,
                              fontSize: '14px',
                            }}
                          >
                            {link.title}
                          </Button>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Additional Info */}
            <Card
              style={{
                marginTop: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(107, 114, 128, 0.1)',
                background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.5) 0%, rgba(249, 250, 251, 0.5) 100%)',
              }}
              bodyStyle={{ 
                textAlign: 'center', 
                direction: 'rtl',
                padding: '32px',
              }}
            >
              <Space direction="vertical" size="middle">
                <SecurityScanOutlined style={{ fontSize: '48px', color: '#6b7280' }} />
                <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                  גישה מאובטחת למידע הביטוחי
                </Title>
                <Paragraph style={{ fontSize: '16px', margin: 0, maxWidth: '600px' }}>
                  כל המידע והשירותים זמינים באתר הרשמי של רשות שוק ההון.
                  לחץ על הכפתור למעלה לגישה מלאה ומאובטחת לכל השירותים.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<LinkOutlined />}
                  onClick={openInNewTab}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    height: '48px',
                    paddingInline: '32px',
                    fontSize: '16px',
                  }}
                >
                  גישה לאתר הר הביטוח
                </Button>
              </Space>
            </Card>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default InsuranceWebView;