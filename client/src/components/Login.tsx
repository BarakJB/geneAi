import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  Divider,
  Space,
  message,
  Form,
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
import { useTheme } from '../contexts/ThemeContext';


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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { theme } = useTheme();

  // Add custom styles for inputs to match login button design (scoped per theme)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = theme.mode === 'dark' ? `
      /* Enhanced input styling - ONLY for wrappers */
      .login-component .ant-input-affix-wrapper,
      .login-component .ant-input-password,
      .login-component .ant-input-textarea {
        background: rgba(0, 0, 0, 0.3) !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid white !important;
        border-color: white !important;
        border-radius: 12px !important;
        color: white !important;
        min-height: 48px !important;
        height: 48px !important;
        backdrop-filter: blur(10px) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
      }

      /* Remove all styling from inner inputs - they should be invisible */

      /* Ensure inner inputs in wrappers are completely invisible */
      .login-component .ant-input-affix-wrapper input,
      .login-component .ant-input-password input {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }
      
      .login-component .ant-input::placeholder,
      .login-component .ant-input-password input::placeholder,
      .login-component .ant-input-affix-wrapper input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
        font-weight: 400 !important;
        text-align: right !important;
        direction: rtl !important;
      }
      
      /* Hover effects - ONLY for wrappers */
      .login-component .ant-input-affix-wrapper:hover,
      .login-component .ant-input-password:hover,
      .login-component .ant-input-textarea:hover {
        border-color: #667eea !important;
        background: rgba(0, 0, 0, 0.4) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
        transform: translateY(-1px) !important;
      }
      
      /* Focus effects - ONLY for wrappers */
      .login-component .ant-input-affix-wrapper:focus,
      .login-component .ant-input-affix-wrapper-focused,
      .login-component .ant-input-password:focus,
      .login-component .ant-input-password-focused,
      .login-component .ant-input-textarea:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
        background: rgba(0, 0, 0, 0.4) !important;
        outline: none !important;
      }

      /* Password field specific styling */
      .login-component .ant-input-password input {
        background: transparent !important;
        color: white !important;
        border: none !important;
        text-align: right !important;
        direction: rtl !important;
        padding: 12px 16px !important;
      }

      /* Input text alignment - only for wrappers */

      /* CRITICAL: Make inner input completely transparent */
      .login-component .ant-input-affix-wrapper input {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        text-align: right !important;
        direction: rtl !important;
        padding: 0 !important;
        color: white !important;
      }

      .login-component .ant-input-affix-wrapper {
        padding: 12px 16px !important;
        direction: rtl !important;
      }

      /* Password field inner input */
      .login-component .ant-input-password input {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        text-align: right !important;
        direction: rtl !important;
        color: white !important;
      }

      /* Icons styling */
      .login-component .ant-input-prefix,
      .login-component .ant-input-suffix,
      .login-component .ant-input-password-icon {
        color: rgba(255, 255, 255, 0.65) !important;
      }

      .login-component .anticon {
        color: rgba(255, 255, 255, 0.65) !important;
      }

      /* RTL icon positioning */
      .login-component .ant-input-prefix {
        margin-left: 8px !important;
        margin-right: 0 !important;
      }

      .login-component .ant-input-suffix {
        margin-right: 8px !important;
        margin-left: 0 !important;
      }

      /* Labels styling */
      .login-component .ant-form-item-label > label {
        color: white !important;
        font-weight: 500 !important;
      }

      /* Form items spacing */
      .login-component .ant-form-item {
        margin-bottom: 24px;
      }

      .login-component .ant-form-item .ant-form-item-control-input {
        min-height: 48px;
      }

      /* TextArea styling */
      .login-component .ant-input.ant-input {
        min-height: 48px !important;
        padding: 12px 16px !important;
      }

      .login-component .ant-input-textarea .ant-input {
        min-height: 96px !important;
        padding: 12px 16px !important;
        resize: vertical !important;
        text-align: right !important;
        direction: rtl !important;
      }

      /* Ensure all form inputs are consistent */
      .login-component .ant-form-item .ant-input,
      .login-component .ant-form-item .ant-input-password,
      .login-component .ant-form-item .ant-input-affix-wrapper,
      .login-component .ant-form-item .ant-input-textarea .ant-input {
        background: rgba(0, 0, 0, 0.3) !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid white !important;
        border-color: white !important;
        border-radius: 12px !important;
        color: white !important;
        min-height: 48px !important;
        height: 48px !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
      }

      /* Simplified - removed redundant rules since we only style wrappers now */
    ` : `
      /* Light theme: clean inputs */
      .login-component .ant-input-affix-wrapper,
      .login-component .ant-input-password,
      .login-component .ant-input-textarea {
        background: #ffffff !important;
        border: 1px solid #d9d9d9 !important;
        border-radius: 12px !important;
        color: #000000 !important;
        min-height: 48px !important;
        height: 48px !important;
        box-shadow: none !important;
      }

      .login-component .ant-input-affix-wrapper input,
      .login-component .ant-input-password input {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: #000000 !important;
      }

      .login-component .ant-input::placeholder,
      .login-component .ant-input-password input::placeholder,
      .login-component .ant-input-affix-wrapper input::placeholder {
        color: rgba(0,0,0,0.45) !important;
        text-align: right !important;
        direction: rtl !important;
      }

      .login-component .ant-input-prefix,
      .login-component .ant-input-suffix,
      .login-component .ant-input-password-icon {
        color: rgba(0,0,0,0.45) !important;
      }

      .login-component .ant-form-item-label > label {
        color: #000000 !important;
      }

      .login-component .ant-form-item .ant-input,
      .login-component .ant-form-item .ant-input-password,
      .login-component .ant-form-item .ant-input-affix-wrapper,
      .login-component .ant-form-item .ant-input-textarea .ant-input {
        background: #ffffff !important;
        border: 1px solid #d9d9d9 !important;
        color: #000000 !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme.mode]);
  const [contactForm] = Form.useForm();

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('נא הזן שם משתמש וסיסמה');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Clean the input values (remove spaces and convert to lowercase for comparison)
      const cleanUsername = username.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      console.log('Attempting login with:', { username: cleanUsername, password: cleanPassword }); // Debug log
      
      // Default credentials for now
      if (cleanUsername === 'admin' && cleanPassword === 'password') {
        // Store token in localStorage
        localStorage.setItem('crmToken', 'dummy-token-123');
        localStorage.setItem('crmUser', JSON.stringify({ username: 'admin', role: 'admin' }));
        // Navigate to dashboard
        navigate('/crm/dashboard');
      } else {
        setError(`שם משתמש או סיסמה שגויים. הזנת: "${cleanUsername}" / "${cleanPassword}". השתמש ב: admin / password`);
      }
    } catch {
      setError('שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
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
    background: theme.mode === 'dark' ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
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

  const cardStyle: React.CSSProperties = theme.mode === 'dark' ? {
    maxWidth: '500px',
    width: '60%',
    minWidth: '400px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    position: 'relative',
    zIndex: 1,
  } : {
    maxWidth: '500px',
    width: '60%',
    minWidth: '400px',
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
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
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
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
              color: 'white',
              marginBottom: '8px',
              direction: 'rtl',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            יצירת קשר למוצר המלא
          </Title>
          <Text
            style={{ 
              direction: 'rtl', 
              fontSize: '16px',
              display: 'block',
              marginBottom: '16px',
              color: 'rgba(255, 255, 255, 0.8)'
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
            prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />}
            placeholder="example@email.com"
            style={{ 
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
            prefix={<PhoneOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />}
            placeholder="050-1234567"
            style={{ 
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
    <div style={containerStyle} className="login-component">
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <img 
                  src="/cover-logo.png" 
                  alt="Cover" 
                  style={{ 
                    height: '48px', 
                    width: 'auto'
                  }} 
                />
                <Title
                  level={1}
                  style={{
                      fontWeight: 800,
                      color: 'white',
                    marginBottom: '8px',
                      direction: 'rtl',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    margin: 0
                    }}
                  >
                    CRM מתקדם
                </Title>
              </div>
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
                <Text strong style={{ color: 'white', direction: 'rtl', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                    🔐 פרטי כניסה לדמו
                </Text>
                <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                    👤 שם משתמש: 
                </Text>
                <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                    🔑 סיסמה: 
                </Text>
                  {/* <Button
                    size="small"
                  type="default"
                  onClick={fillDemoCredentials}
                  style={{
                      borderColor: 'white',
                      color: 'white',
                    fontSize: '14px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'transparent',
                    }}
                  >
                    מלא אוטומטית
                  </Button> */}
              </div>
              </motion.div>
          </div>

            {/* Login Form */}
          <div style={{ direction: 'rtl' }}>
            {/* Username field */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="username" style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: 500, 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                שם משתמש
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />}
                placeholder="הזן שם משתמש"
                size="large"
                className="login-input-field"
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: 500, 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                סיסמה
              </label>
              <Input.Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />}
                placeholder="הזן סיסמה"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="rgba(255, 255, 255, 0.65)" /> : <EyeInvisibleOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />)}
                className="login-input-field login-password-field"
              />
            </div>

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

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '24px' }}
            >
              <Button
                type="primary"
                onClick={handleSubmit}
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
          </div>

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