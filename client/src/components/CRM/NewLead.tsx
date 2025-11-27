import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Form,
  Select,
  Typography,
  Space,
  message,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  UserAddOutlined,
  SaveOutlined,
  ClearOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;
const { TextArea } = Input;

interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  expectedBudget: number;
  followUpDate: string;
}

const NewLead: React.FC = () => {
  const [form] = Form.useForm();
  const [lead, setLead] = useState<Lead>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: '',
    status: 'new',
    notes: '',
    expectedBudget: 0,
    followUpDate: '',
  });

  // Scroll effects state
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Check if form is visible
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        const isFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isFormVisible);
      }
    };

    // Add smooth scrolling to body
    document.documentElement.style.scrollBehavior = 'smooth';
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Smooth scrolling for the entire page */
      html {
        scroll-behavior: smooth !important;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #1890ff, #722ed1);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #40a9ff, #9254de);
      }
      
      .lead-input .ant-input {
        background: transparent !important;
        border: none !important;
        color: white !important;
        border-radius: 8px !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .lead-input .ant-input-affix-wrapper {
        background: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .lead-input .ant-input-number {
        background: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-input-number .ant-input-number-input {
        background: transparent !important;
        border: none !important;
        color: white !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .lead-input .ant-select .ant-select-selector {
        background: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-select .ant-select-selection-item {
        color: white !important;
      }
      
      .lead-input .ant-picker {
        background: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-picker input {
        background: transparent !important;
        border: none !important;
        color: white !important;
        outline: none !important;
        box-shadow: none !important;
      }

      .lead-input .ant-form-item-label > label {
        color: white !important;
      }
      
      .lead-input .ant-input-affix-wrapper:hover,
      .lead-input .ant-input-affix-wrapper:focus,
      .lead-input .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
        border-color: rgba(255, 255, 255, 0.5) !important;
        box-shadow: none !important;
      }
      
      .lead-input .ant-input:hover,
      .lead-input .ant-input:focus {
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }
      
      .name-field-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 8px !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.3s ease !important;
      }
      
      .name-field-input:hover {
        border-color: rgba(255, 255, 255, 0.5) !important;
        background: rgba(255, 255, 255, 0.08) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
      }
      
      .name-field-input:focus {
        border-color: rgba(255, 255, 255, 0.7) !important;
        background: rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    background: 'transparent',
    minHeight: 'calc(100vh - 140px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    width: '60%',
    maxWidth: '800px',
    minWidth: '500px',
    margin: '0 auto',
  };

  const handleInputChange = (field: keyof Lead, value: string | number) => {
    setLead(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving lead:', lead);
      message.success('הליד נשמר בהצלחה!');
    } catch (error) {
      console.error('Error saving lead:', error);
      message.error('שגיאה בשמירת הליד');
    }
  };

  const handleClear = () => {
    setLead({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      source: '',
      status: 'new',
      notes: '',
      expectedBudget: 0,
      followUpDate: '',
    });
    form.resetFields();
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Scroll Progress Indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1890ff, #722ed1, #52c41a)',
          width: `${Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`,
          zIndex: 1000,
          transition: 'width 0.1s ease-out',
          boxShadow: '0 0 10px rgba(24, 144, 255, 0.5)'
        }}
      />

      {/* Scroll Depth Indicator */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000,
          opacity: scrollY > 100 ? 0.7 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={`scroll-indicator-${i}`}
            style={{
              width: '4px',
              height: '20px',
              borderRadius: '2px',
              background: scrollY > i * 200 
                ? 'linear-gradient(135deg, #1890ff, #722ed1)' 
                : 'rgba(255, 255, 255, 0.2)',
              transition: 'background 0.3s ease-out'
            }}
          />
        ))}
      </div>
      {/* Parallax Background Effects */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at ${20 + scrollY * 0.02}% ${30 + scrollY * 0.01}%, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${80 - scrollY * 0.015}% ${70 - scrollY * 0.02}%, rgba(114, 46, 209, 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${50 + Math.sin(scrollY * 0.01) * 10}% ${50 + Math.cos(scrollY * 0.01) * 10}%, rgba(82, 196, 26, 0.05) 0%, transparent 40%)
          `,
          zIndex: -1,
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* Floating Particles Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%',
          zIndex: -1,
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`floating-particle-${i}`}
            style={{
              position: 'absolute',
              width: `${8 + i * 2}px`,
              height: `${8 + i * 2}px`,
              borderRadius: '50%',
              background: `rgba(${i % 2 === 0 ? '24, 144, 255' : '114, 46, 209'}, ${0.1 + (i * 0.05)})`,
              left: `${(i * 73) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Header Section with Parallax */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `linear-gradient(135deg, 
            rgba(24, 144, 255, ${0.15 + scrollY * 0.0002}) 0%, 
            rgba(114, 46, 209, ${0.15 + scrollY * 0.0002}) 100%
          )`,
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: `translateY(${scrollY * 0.1}px) scale(${1 - scrollY * 0.0001})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Background Decorative Image with Parallax */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: `translateY(-50%) translateX(${scrollY * 0.05}px) scale(${1 + scrollY * 0.0002})`,
            width: '200px',
            height: '150px',
            backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            opacity: Math.max(0.2, 0.4 - scrollY * 0.0003),
            filter: `blur(${1 + scrollY * 0.002}px)`,
            zIndex: 1,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out'
          }}
        />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Title level={1} style={{ 
              color: 'white', 
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: '42px',
              fontWeight: 700
            }}>
              ביטוח ופיננסים מתקדמים
            </Title>
            <Title level={3} style={{ 
              color: '#1890ff', 
              margin: '0 0 8px 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              fontSize: '28px'
            }}>
              ברק יעקב
            </Title>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              סוכן הביטוח שלכם 🏆
            </div>
          </motion.div>
        </div>

        {/* Floating Elements with Scroll Effects */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: '30px',
            top: '30px',
            fontSize: `${30 + scrollY * 0.01}px`,
            opacity: Math.max(0.3, 0.6 - scrollY * 0.0008),
            transform: `translateY(${scrollY * 0.03}px) rotate(${scrollY * 0.02}deg)`,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, font-size 0.1s ease-out'
          }}
        >
          💼
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{
            position: 'absolute',
            right: '240px',
            top: '20px',
            fontSize: `${28 + scrollY * 0.008}px`,
            opacity: Math.max(0.3, 0.6 - scrollY * 0.0008),
            transform: `translateY(${scrollY * 0.02}px) translateX(${scrollY * 0.01}px)`,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, font-size 0.1s ease-out'
          }}
        >
          🎯
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -8, 0],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            left: '60px',
            bottom: '25px',
            fontSize: `${26 + scrollY * 0.006}px`,
            opacity: Math.max(0.3, 0.6 - scrollY * 0.0008),
            transform: `translateY(${scrollY * 0.04}px) scale(${1 + scrollY * 0.0001})`,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, font-size 0.1s ease-out'
          }}
        >
          📊
        </motion.div>
      </motion.div>

      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0.7, 
          y: 0,
          scale: isVisible ? 1 : 0.98
        }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <Card
          style={{
            ...cardStyle,
            boxShadow: `0 ${8 + scrollY * 0.02}px ${32 + scrollY * 0.05}px rgba(255, 255, 255, ${0.1 + scrollY * 0.0001})`,
            transform: `scale(${1 - scrollY * 0.00005})`,
            transition: 'box-shadow 0.1s ease-out, transform 0.1s ease-out'
          }}
          title={
            <div style={{ textAlign: 'center', direction: 'rtl' }}>
              <Space>
                <UserAddOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  ליד חדש
                </Title>
              </Space>
            </div>
          }
          styles={{
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            },
            body: { padding: '32px', direction: 'rtl' }
          }}
        >
          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ direction: 'rtl' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>שם פרטי</span>}
                  className="lead-input"
                >
                  <Input
                    placeholder="הזן שם פרטי"
                    value={lead.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    prefix={<MailOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                    className="name-field-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>שם משפחה</span>}
                  className="lead-input"
                >
                  <Input
                    placeholder="הזן שם משפחה"
                    value={lead.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    prefix={<MailOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                    className="name-field-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>אימייל</span>}
                  className="lead-input"
                >
                  <Input
                    placeholder="example@email.com"
                    value={lead.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    prefix={<MailOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>טלפון</span>}
                  className="lead-input"
                >
                  <Input
                    placeholder="050-1234567"
                    value={lead.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    prefix={<PhoneOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>מקור הליד</span>}
                  className="lead-input"
                >
                  <Select
                    placeholder="בחר מקור"
                    value={lead.source}
                    onChange={(value) => handleInputChange('source', value)}
                  >
                    <Select.Option value="website">אתר אינטרנט</Select.Option>
                    <Select.Option value="facebook">פייסבוק</Select.Option>
                    <Select.Option value="google">גוגל</Select.Option>
                    <Select.Option value="referral">הפניה</Select.Option>
                    <Select.Option value="cold-call">חיוג קר</Select.Option>
                    <Select.Option value="other">אחר</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>סטטוס</span>}
                  className="lead-input"
                >
                  <Select
                    placeholder="בחר סטטוס"
                    value={lead.status}
                    onChange={(value) => handleInputChange('status', value)}
                  >
                    <Select.Option value="new">חדש</Select.Option>
                    <Select.Option value="contacted">יצר קשר</Select.Option>
                    <Select.Option value="interested">מעוניין</Select.Option>
                    <Select.Option value="meeting">פגישה קבועה</Select.Option>
                    <Select.Option value="proposal">הצעה נשלחה</Select.Option>
                    <Select.Option value="closed">נסגר</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>תקציב משוער</span>}
                  className="lead-input"
                >
                  <InputNumber
                    placeholder="0"
                    value={lead.expectedBudget}
                    onChange={(value) => handleInputChange('expectedBudget', value || 0)}
                    style={{ width: '100%' }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => {
                      const parsed = parseFloat(value!.replace(/₪\s?|(,*)/g, ''));
                      return isNaN(parsed) ? 0 : parsed;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>תאריך מעקב</span>}
                  className="lead-input"
                >
                  <DatePicker
                    placeholder="בחר תאריך"
                    style={{ width: '100%' }}
                    onChange={(_, dateString) => handleInputChange('followUpDate', Array.isArray(dateString) ? dateString[0] || '' : dateString || '')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>הערות</span>}
                  className="lead-input"
                >
                  <TextArea
                    rows={4}
                    placeholder="הערות על הליד..."
                    value={lead.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]} justify="center" style={{ marginTop: '32px' }}>
              <Col xs={24} sm={8}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    style={{
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    שמור ליד
                  </Button>
                </motion.div>
              </Col>
              <Col xs={24} sm={8}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="large"
                    block
                    icon={<ClearOutlined />}
                    onClick={handleClear}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    נקה טופס
                  </Button>
                </motion.div>
              </Col>
            </Row>
          </Form>
        </Card>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: scrollY > 300 ? 1 : 0,
          scale: scrollY > 300 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          zIndex: 1000
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(24, 144, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          ↑
        </motion.button>
      </motion.div>

      {/* Ambient Light Effect */}
      <div
        style={{
          position: 'fixed',
          top: `${40 + scrollY * 0.1}%`,
          left: `${60 + Math.sin(scrollY * 0.005) * 20}%`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: -2,
          transition: 'all 0.3s ease-out',
          transform: `scale(${1 + scrollY * 0.0005})`
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: `${70 - scrollY * 0.08}%`,
          left: `${20 + Math.cos(scrollY * 0.008) * 15}%`,
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(114, 46, 209, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: -2,
          transition: 'all 0.3s ease-out',
          transform: `scale(${0.8 + scrollY * 0.0003})`
        }}
      />
    </div>
  );
};

export default NewLead;
