import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  Form,
  Divider,
  Space,
  message,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  ShopOutlined,
  LoginOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  ContactsOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG_DEV } from '../config/email';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      // Clean the input values (remove spaces and convert to lowercase for comparison)
      const username = values.username.trim().toLowerCase();
      const password = values.password.trim();
      
      console.log('Attempting login with:', { username, password }); // Debug log
      
      // Default credentials for now
      if (username === 'admin' && password === 'password') {
        // Store token in localStorage
        localStorage.setItem('crmToken', 'dummy-token-123');
        localStorage.setItem('crmUser', JSON.stringify({ username: 'admin', role: 'admin' }));
        // Navigate to dashboard
        navigate('/crm/dashboard');
      } else {
        setError(`שם משתמש או סיסמה שגויים. הזנת: "${username}" / "${password}". השתמש ב: admin / password`);
      }
    } catch {
      setError('שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    form.setFieldsValue({ username: 'admin', password: 'password' });
  };

  const handleContactSubmit = async (values: ContactForm) => {
    setContactLoading(true);
    
    try {
      // הגדרות EmailJS - תצטרך לעדכן את הערכים האלה
      const emailJSParams = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        description: values.description,
        to_email: 'yacov131@gmail.com', // המייל שלך
        date: new Date().toLocaleDateString('he-IL') + ' ' + new Date().toLocaleTimeString('he-IL')
      };

      // שליחה עם EmailJS
      const result = await emailjs.send(
        EMAIL_CONFIG_DEV.SERVICE_ID,
        EMAIL_CONFIG_DEV.TEMPLATE_ID,
        emailJSParams,
        EMAIL_CONFIG_DEV.USER_ID
      );

      if (result.status === 200) {
        message.success('הפניה נשלחה בהצלחה! נחזור אליך בהקדם');
        contactForm.resetFields();
        setShowContact(false);
      } else {
        message.error('שגיאה בשליחת הפניה');
      }
      
    } catch (error) {
      console.error('Error sending contact form:', error);
      message.error('שגיאה בשליחת הפניה, אנא נסה שנית');
    } finally {
      setContactLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '16px',
        position: 'relative',
        overflow: 'hidden',
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

  const cardStyle: React.CSSProperties = {
    maxWidth: '500px',
    width: '60%',
    minWidth: '400px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 1,
  };

  const iconContainerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  };

  const demoBoxStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.8) 100%)',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  // Contact Form Component
  const renderContactForm = () => (
    <Card style={cardStyle} styles={{ body: { padding: '48px' } }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', duration: 1 }}
        >
          <div style={iconContainerStyle}>
            <ContactsOutlined style={{ fontSize: '40px', color: 'white' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Title
            level={1}
            style={{
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '8px',
              direction: 'rtl',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            יצירת קשר למוצר המלא
          </Title>
          <Text
            type="secondary"
            style={{ 
              direction: 'rtl', 
              fontSize: '16px',
              display: 'block',
              marginBottom: '16px'
            }}
          >
            מלא את הפרטים ונחזור אליך עם הצעה מותאמת אישית
          </Text>
        </motion.div>
      </div>

      {/* Contact Form */}
      <Form
        form={contactForm}
        name="contact"
        onFinish={handleContactSubmit}
        layout="vertical"
        size="large"
        style={{ direction: 'rtl' }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="firstName"
            label="שם פרטי"
            rules={[{ required: true, message: 'נא הזן שם פרטי' }]}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="הזן שם פרטי"
              style={{ 
                borderRadius: '12px', 
                height: '48px',
                textAlign: 'right',
              }}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="שם משפחה"
            rules={[{ required: true, message: 'נא הזן שם משפחה' }]}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="הזן שם משפחה"
              style={{ 
                borderRadius: '12px', 
                height: '48px',
                textAlign: 'right',
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="אימייל"
          rules={[
            { required: true, message: 'נא הזן כתובת אימייל' },
            { type: 'email', message: 'אנא הזן כתובת אימייל תקינה' }
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#667eea' }} />}
            placeholder="example@email.com"
            style={{ 
              borderRadius: '12px', 
              height: '48px',
              textAlign: 'right',
            }}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="טלפון"
          rules={[{ required: true, message: 'נא הזן מספר טלפון' }]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: '#667eea' }} />}
            placeholder="050-1234567"
            style={{ 
              borderRadius: '12px', 
              height: '48px',
              textAlign: 'right',
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="תיאור הצרכים שלך"
          rules={[{ required: true, message: 'נא הזן תיאור קצר של הצרכים שלך' }]}
        >
          <TextArea
            rows={4}
            placeholder="ספר לנו על הצרכים שלך, סוג העסק, כמות לקוחות וכו..."
            style={{ 
              borderRadius: '12px',
              textAlign: 'right',
            }}
          />
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }} size="large">
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => setShowContact(false)}
            style={{
              borderRadius: '12px',
              fontWeight: 600,
              minWidth: '120px',
            }}
          >
            חזרה
          </Button>
          
          <Button
            type="primary"
            htmlType="submit"
            loading={contactLoading}
            icon={contactLoading ? <LoadingOutlined /> : <SendOutlined />}
            size="large"
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              fontWeight: 600,
              minWidth: '120px',
            }}
          >
            {contactLoading ? 'שולח...' : 'שלח פניה'}
          </Button>
        </Space>
      </Form>
    </Card>
  );

  return (
    <div style={containerStyle}>
      {/* Background overlay */}
      <div style={overlayStyle} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {showContact ? renderContactForm() : (
        <Card style={cardStyle} styles={{ body: { padding: '48px' } }}>
            {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', duration: 1 }}
              >
              <div style={iconContainerStyle}>
                <ShopOutlined style={{ fontSize: '40px', color: 'white' }} />
              </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
              <Title
                level={1}
                style={{
                    fontWeight: 800,
                    color: '#1a1a1a',
                  marginBottom: '8px',
                    direction: 'rtl',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  }}
                >
                  CRM מתקדם
              </Title>
              <Title
                level={4}
                type="secondary"
                style={{ 
                  direction: 'rtl', 
                  marginBottom: '16px', 
                  fontWeight: 500,
                  margin: '0 0 8px 0'
                }}
                >
                  מערכת ניהול לקוחות מתקדמת
              </Title>
              <Text
                type="secondary"
                style={{ 
                  direction: 'rtl', 
                  fontSize: '16px',
                  display: 'block',
                  marginBottom: '16px'
                }}
                >
                  ניהול לידים, לקוחות, פוליסות ודוחות במקום אחד
              </Text>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
              <div style={demoBoxStyle}>
                <Text strong style={{ color: '#1a1a1a', direction: 'rtl', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                    🔐 פרטי כניסה לדמו
                </Text>
                <Text strong style={{ color: '#1a1a1a', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                    👤 שם משתמש: admin
                </Text>
                <Text strong style={{ color: '#1a1a1a', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                    🔑 סיסמה: password
                </Text>
                  <Button
                    size="small"
                  type="default"
                  onClick={fillDemoCredentials}
                  style={{
                      borderColor: '#6b7280',
                      color: '#1a1a1a',
                    fontSize: '14px',
                    height: '32px',
                    borderRadius: '8px',
                    }}
                  >
                    מלא אוטומטית
                  </Button>
              </div>
              </motion.div>
          </div>

            {/* Login Form */}
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            style={{ direction: 'rtl' }}
          >
            <Form.Item
              name="username"
                label="שם משתמש"
              rules={[{ required: true, message: 'נא הזן שם משתמש' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#007AFF' }} />}
                placeholder="הזן שם משתמש"
                style={{ 
                    borderRadius: '12px',
                  height: '48px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
                label="סיסמה"
              rules={[{ required: true, message: 'נא הזן סיסמה' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#007AFF' }} />}
                placeholder="הזן סיסמה"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ 
                  borderRadius: '12px', 
                  height: '48px',
                  direction: 'rtl',
                }}
              />
            </Form.Item>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ 
                  marginBottom: '24px', 
                    borderRadius: '12px',
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              />
              )}

            <Form.Item style={{ marginBottom: 0 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : <LoginOutlined />}
                  block
                  style={{
                    height: '56px',
                    fontSize: '18px',
                    fontWeight: 600,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'linear-gradient(135deg, #5a67d8 0%, #6a4c93 100%)';
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    (e.target as HTMLElement).style.transform = 'translateY(0px)';
                    (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  {loading ? 'מתחבר...' : '🚀 כניסה למערכת'}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>

            {/* Footer */}
          <Divider style={{ margin: '32px 0 24px 0' }} />
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Text type="secondary" style={{ direction: 'rtl', fontSize: '14px', display: 'block', marginBottom: '16px' }}>
                מערכת CRM מתקדמת לניהול לקוחות וביטוחים
            </Text>
            <Button
              type="default"
              size="large"
              icon={<ContactsOutlined />}
              onClick={() => setShowContact(true)}
              style={{
                borderColor: '#667eea',
                color: '#667eea',
                borderRadius: '12px',
                fontWeight: 600,
                direction: 'rtl',
              }}
            >
              יצירת קשר למוצר המלא
            </Button>
          </div>
        </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Login;