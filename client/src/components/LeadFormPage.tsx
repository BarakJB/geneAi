import React from 'react';
import { Button, Card, Col, Collapse, Divider, Form, Input, Row, Typography, message, List, Avatar, Carousel, Space } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, TrophyOutlined, CheckCircleOutlined, StarOutlined, ThunderboltOutlined, RocketOutlined, HeartOutlined } from '@ant-design/icons';
import { getBranding, type Branding } from '../config/branding';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import barakImage from '../assets/barak_image.png';

const { Title, Paragraph, Text } = Typography;

type LeadFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const phoneRegex = /^(?:\+972|0)(?:[23489]-?\d{7}|5\d-?\d{7})$/; // basic IL phone validation

const LeadFormPage: React.FC = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm<LeadFormValues>();
  const { theme } = useTheme();
  const [branding, setBranding] = React.useState<Branding>({
    name: 'ברק יעקב',
    primaryColor: '#007AFF',
    gradient: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
    logoUrl: '/cover-logo.png',
    heroImageUrl: barakImage,
    ctaText: 'לתיאום פגישה אישית',
  });

  React.useEffect(() => {
    (async () => {
      const b = await getBranding();
      setBranding(b);
    })();
  }, []);

  const onFinish = async (values: LeadFormValues) => {
    setSubmitting(true);
    try {
      const slug = window.location.pathname.split('/').filter(Boolean)[0] || 'lead';
      const apiBase = import.meta.env.PROD
        ? 'https://your-api-domain.com/api'
        : 'http://localhost:8000/api';
      const resp = await fetch(`${apiBase}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...values }),
      });
      if (!resp.ok) throw new Error('Failed to submit');
      const json = await resp.json();
      if (!json.success) throw new Error(json.error || 'Failed');
      message.success('הפרטים נשלחו בהצלחה!');
      form.resetFields();
    } catch (e) {
      // Log the error for diagnostics while showing a friendly message
      console.error('Lead submit failed', e);
      message.error('אירעה שגיאה בשליחה. נסה שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #7b68ee 50%, #9370db 75%, #8a2be2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite',
        direction: 'rtl',
      }}
    >
      {/* Floating Elements with Scroll Effects */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          fontSize: `${40 + scrollY * 0.02}px`,
          color: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
          transform: `translateY(${scrollY * 0.3}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.2})`,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
      >
        <StarOutlined />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          fontSize: `${30 + scrollY * 0.015}px`,
          color: 'rgba(255, 255, 255, 0.6)',
          zIndex: 1,
          transform: `translateY(${scrollY * 0.2}px) translateX(${Math.cos(scrollY * 0.005) * 20}px)`,
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
      >
        <ThunderboltOutlined />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          fontSize: `${35 + scrollY * 0.025}px`,
          color: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,
          transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.5}deg)`,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: false }}
      >
        <RocketOutlined />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          fontSize: `${25 + scrollY * 0.01}px`,
          color: 'rgba(255, 255, 255, 0.5)',
          zIndex: 1,
          transform: `translateY(${scrollY * 0.1}px) scale(${1 + Math.sin(scrollY * 0.008) * 0.3})`,
        }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.4, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 0.5, y: 0 }}
        viewport={{ once: false }}
      >
        <HeartOutlined />
      </motion.div>

      {/* Enhanced Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`enhanced-particle-${i}`}
          style={{
            position: 'absolute',
            width: `${8 + i * 2}px`,
            height: `${8 + i * 2}px`,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.4})`,
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            zIndex: 1,
            transform: `translateY(${scrollY * (0.1 + i * 0.02)}px) scale(${1 + Math.sin(scrollY * 0.005 + i) * 0.3})`,
            boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: false }}
        />
      ))}

      {/* Additional Floating Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`geometric-shape-${i}`}
          style={{
            position: 'absolute',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            width: `${15 + Math.random() * 25}px`,
            height: `${15 + Math.random() * 25}px`,
            borderRadius: (() => {
              if (i % 3 === 0) return '50%';
              if (i % 3 === 1) return '0%';
              return '20%';
            })(),
            background: i % 2 === 0 
              ? `linear-gradient(45deg, rgba(255,255,255,0.1), rgba(124,58,237,0.2))`
              : `linear-gradient(45deg, rgba(59,130,246,0.2), rgba(255,255,255,0.1))`,
            zIndex: 0,
            transform: `translateY(${scrollY * (0.2 + i * 0.03)}px) rotate(${scrollY * (0.5 + i * 0.1)}deg)`,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 0.2, scale: 0.8, rotate: 0 }}
          viewport={{ once: false }}
        />
      ))}

      {/* Top navbar-like quick anchors */}
      <div style={{ position: 'absolute', top: 12, right: 24, left: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <Space size={16}>
          <a href="#about" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>אודות</a>
          <a href="#services" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>שירותים</a>
          <a href="#faq" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>שאלות נפוצות</a>
          <a href="#contact" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>יצירת קשר</a>
        </Space>
        <img src={branding.logoUrl} alt="logo" style={{ height: 32 }} />
      </div>

      {/* Hero Section */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        padding: '100px 40px 60px', 
        zIndex: 2,
        textAlign: 'center',
        marginBottom: '80px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            transform: `translateY(${scrollY * 0.2}px) scale(${1 - scrollY * 0.0002})`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '18px', 
              fontWeight: 500, 
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '20px',
              display: 'block'
            }}>
              ביטוח ופיננסים מתקדמים
            </Text>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.4 }}
          >
            <Title style={{ 
              color: '#ffffff', 
              fontSize: `${72 + Math.sin(scrollY * 0.01) * 8}px`, 
              fontWeight: 900, 
              margin: 0, 
              lineHeight: 1.1,
              textShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,${0.2 + Math.sin(scrollY * 0.005) * 0.2})`,
              marginBottom: '30px',
              letterSpacing: '-2px',
              transform: `translateY(${Math.sin(scrollY * 0.008) * 5}px)`,
            }}>
              ברק יעקב
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Title level={2} style={{ 
              color: '#ffffff', 
              fontSize: '48px', 
              fontWeight: 700, 
              margin: 0, 
              lineHeight: 1.2,
              textShadow: '0 3px 15px rgba(0,0,0,0.2)',
              marginBottom: '40px',
              transform: `translateX(${Math.cos(scrollY * 0.006) * 3}px)`,
            }}>
              סוכן הביטוח שלכם
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Paragraph style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '24px', 
              maxWidth: '600px', 
              margin: '0 auto 50px auto',
              lineHeight: 1.6,
              fontWeight: 400,
              transform: `translateY(${Math.sin(scrollY * 0.004) * 2}px)`,
            }}>
              החיים החשובים ביותר הם לא דברים, אז אנחנו נעצב חוויות מושלמות עבורכם.
            </Paragraph>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4, type: "spring", bounce: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 50px rgba(0, 212, 170, 0.6)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="large"
              style={{
                background: `linear-gradient(135deg, #00d4aa 0%, #00b894 100%)`,
                border: 'none',
                borderRadius: '50px',
                height: '60px',
                padding: '0 40px',
                fontSize: '18px',
                fontWeight: 700,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: `0 10px 30px rgba(0, 212, 170, ${0.3 + Math.sin(scrollY * 0.01) * 0.2})`,
                transform: `translateY(${Math.sin(scrollY * 0.003) * 3}px) scale(${1 + Math.sin(scrollY * 0.005) * 0.02})`,
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              התחל איתנו
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <Row gutter={[48, 48]} style={{ width: '100%', maxWidth: 1400, padding: '0 40px 80px', zIndex: 2 }} id="contact-form">
          <Col xs={24} lg={10}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card
              style={{
                borderRadius: 20,
                background: '#ffffff',
                border: 'none',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                position: 'relative',
              }}
              styles={{ body: { padding: 48 } }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #00d4aa 0%, #00b894 100%)',
                }}
              />
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-block', position: 'relative', marginBottom: 24 }}>
                <img 
                  src={barakImage} 
                  alt="ברק יעקב" 
                  style={{ 
                    height: 80, 
                    width: 80, 
                    borderRadius: '50%', 
                    objectFit: 'contain',
                    objectPosition: 'center top',
                    padding: '6px',
                    backgroundColor: '#f8f9fa',
                    border: '3px solid #00d4aa'
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#00d4aa',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid white'
                }}>
                  <CheckCircleOutlined style={{ color: 'white', fontSize: 12 }} />
                </div>
              </div>
              
              <Title level={3} style={{ marginBottom: 8, color: '#2d3748', fontWeight: 700 }}>
                יצירת קשר מהירה
              </Title>
              <Text style={{ color: '#718096', fontSize: 16, lineHeight: 1.6 }}>
                מלאו את הפרטים ונחזור אליכם תוך 24 שעות עם הצעה מותאמת אישית
              </Text>
            </div>

            <Form<LeadFormValues>
              layout="vertical"
              form={form}
              onFinish={onFinish}
              requiredMark={false}
              className="lead-form"
            >
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="שם פרטי"
                    rules={[{ required: true, message: 'אנא הזינו שם פרטי' }]}
                  >
                    <Input placeholder="ישראל" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="שם משפחה"
                    rules={[{ required: true, message: 'אנא הזינו שם משפחה' }]}
                  >
                    <Input placeholder="ישראלי" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="phone"
                label="טלפון"
                rules={[
                  { required: true, message: 'אנא הזינו מספר טלפון' },
                  { pattern: phoneRegex, message: 'מספר טלפון לא תקין' },
                ]}
              >
                <Input placeholder="05X-XXXXXXX" size="large" inputMode="tel" />
              </Form.Item>

              <Form.Item
                name="email"
                label="אימייל"
                rules={[
                  { type: 'email', message: 'כתובת אימייל לא תקינה' },
                  { required: true, message: 'אנא הזינו אימייל' },
                ]}
              >
                <Input placeholder="name@example.com" size="large" inputMode="email" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: branding.gradient,
                  border: 'none',
                  fontWeight: 700,
                }}
              >
                {branding.ctaText || 'שליחה'}
              </Button>
            </Form>
          </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={14}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            style={{ padding: '60px 40px' }}
          >
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 60 }}
            >
              <Text style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '16px', 
                fontWeight: 600, 
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                display: 'block'
              }}>
                אנחנו סוכנות ביטוח מעולה
              </Text>
              
              <Title level={2} style={{ 
                color: '#ffffff', 
                fontSize: '36px', 
                fontWeight: 800, 
                lineHeight: 1.3,
                textShadow: '0 3px 15px rgba(0,0,0,0.3)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                ההבדל בין מעצב למפתח כשזה מגיע לכישורי עיצוב
              </Title>
            </motion.div>

            {/* Features Grid */}
            <Row gutter={[40, 40]}>
              {[
                {
                  icon: '🎯',
                  title: 'מתמחים בפנסיה',
                  description: 'ייעוץ מקצועי לקראת פרישה עם תוכנית מותאמת אישית'
                },
                {
                  icon: '🛡️',
                  title: 'ביטוח מקיף',
                  description: 'כיסוי ביטוחי מלא לכל המשפחה עם תנאים מעולים'
                },
                {
                  icon: '💼',
                  title: 'שירות VIP',
                  description: 'זמינות מלאה ומעקב אישי לכל לקוח לאורך כל הדרך'
                }
              ].map((feature, index) => (
                <Col xs={24} sm={8} key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                    whileHover={{ y: -10 }}
                    style={{ textAlign: 'center' }}
                  >
                    <motion.div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        border: '2px solid rgba(0, 212, 170, 0.3)',
                        fontSize: '28px'
                      }}
                      whileHover={{ scale: 1.1, borderColor: 'rgba(0, 212, 170, 0.8)' }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <Title level={4} style={{ 
                      color: '#ffffff', 
                      marginBottom: 12, 
                      fontWeight: 600,
                      textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {feature.title}
                    </Title>
                    
                    <Text style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: 14, 
                      lineHeight: 1.6 
                    }}>
                      {feature.description}
                    </Text>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              style={{ 
                marginTop: 80, 
                padding: '40px', 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
                <Col xs={12} sm={6}>
                  <Title level={2} style={{ color: '#00d4aa', margin: 0, fontSize: '32px', fontWeight: 800 }}>
                    500+
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                    לקוחות מרוצים
                  </Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={2} style={{ color: '#00d4aa', margin: 0, fontSize: '32px', fontWeight: 800 }}>
                    5+
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                    שנות ניסיון
                  </Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={2} style={{ color: '#00d4aa', margin: 0, fontSize: '32px', fontWeight: 800 }}>
                    24/7
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                    זמינות
                  </Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={2} style={{ color: '#00d4aa', margin: 0, fontSize: '32px', fontWeight: 800 }}>
                    100%
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                    שקיפות
                  </Text>
                </Col>
              </Row>
            </motion.div>
          </motion.div>
        </Col>
      </Row>
      </motion.div>

      {/* Decorative wave bottom */}
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 120, opacity: 0.8 }}>
        <path fill="#ffffff" fillOpacity="0.08" d="M0,288L60,266.7C120,245,240,203,360,186.7C480,171,600,181,720,181.3C840,181,960,171,1080,186.7C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
      </svg>

      {/* About Section */}
      <motion.section 
        id="about" 
        style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
          style={{ 
            borderRadius: 20, 
            background: theme.colors.cardBackground, 
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 8px 24px ${theme.colors.shadow}` 
          }} 
          styles={{ body: { padding: 28 } }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={barakImage}
                  alt="ברק יעקב"
                  style={{ 
                    width: 160, 
                    height: 160, 
                    borderRadius: '50%', 
                    objectFit: 'contain',
                    objectPosition: 'center top',
                    padding: '12px',
                    backgroundColor: theme.colors.cardBackground,
                    border: `3px solid ${theme.colors.border}`,
                    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
                    marginBottom: 16
                  }}
                />
                <Title level={4} style={{ marginBottom: 8 }}>ברק יעקב</Title>
                <Text style={{ color: theme.colors.textSecondary }}>סוכן ביטוח ופיננסים מוסמך</Text>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Title level={3} style={{ marginBottom: 16 }}>אודותיי</Title>
              <Paragraph style={{ color: theme.colors.textSecondary, fontSize: 16, lineHeight: 1.6 }}>
                שלום, אני ברק יעקב, סוכן ביטוח ופיננסים מוסמך עם ניסיון של מעל 5 שנים בתחום. 
                אני מתמחה במתן פתרונות מותאמים אישית בתחומי הביטוח, הפנסיה והפיננסים.
              </Paragraph>
              <Paragraph style={{ color: theme.colors.textSecondary, fontSize: 16, lineHeight: 1.6 }}>
                המטרה שלי היא לעזור לכם לחסוך כסף, למצוא את התנאים הטובים ביותר ולהבטיח שאתם מקבלים 
                בדיוק את מה שאתם צריכים - ללא עמלות מיותרות וללא הפתעות.
              </Paragraph>
              <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserOutlined style={{ color: theme.colors.accent }} />
                  <Text style={{ color: theme.colors.text }}>+500 לקוחות מרוצים</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrophyOutlined style={{ color: '#ffd700' }} />
                  <Text style={{ color: theme.colors.text }}>מומחה מוסמך</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        </motion.div>
      </motion.section>

      {/* Services */}
      <motion.section 
        id="services" 
        style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title level={3} style={{ color: '#fff', marginBottom: 16 }}>שירותים</Title>
        </motion.div>
        <Row gutter={[16, 16]}>
          {[
            { title: 'ביטוח בריאות', desc: 'כיסוי רחב ונגישות לשירותי רפואה מתקדמים.' },
            { title: 'פנסיה', desc: 'ניהול והתאמת המסלול לגיל, הכנסות ויעדים.' },
            { title: 'קרן השתלמות', desc: 'מינוף הטבות המס לחיסכון אפקטיבי.' },
            { title: 'ביטוח חיים', desc: 'שמירה על היציבות הכלכלית של המשפחה.' },
            { title: 'חיסכון לכל ילד', desc: 'פתרונות השקעה מותאמים למשפחה.' },
            { title: 'ייעוץ פיננסי', desc: 'תכנון ותזרים נכון לשקט כלכלי.' },
          ].map((s, index) => (
            <Col xs={24} sm={12} md={8} key={s.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <Card 
                  hoverable 
                  style={{ 
                    borderRadius: 16,
                    background: theme.colors.cardBackground,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: `0 4px 12px ${theme.colors.shadow}`,
                    height: '100%',
                  }}
                >
                  <Title level={4} style={{ marginBottom: 8, color: theme.colors.text }}>{s.title}</Title>
                  <Text style={{ color: theme.colors.textSecondary }}>{s.desc}</Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
          style={{ 
            borderRadius: 20,
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 8px 24px ${theme.colors.shadow}`,
          }}
        >
          <Title level={3} style={{ marginBottom: 16 }}>מה הלקוחות אומרים</Title>
          <Carousel autoplay rtl>
            {[
              { name: 'דנה', text: 'שירות מהיר ומקצועי. חסכנו עמלות משמעותיות.' },
              { name: 'יוסי', text: 'ליווי אישי וסבלני. ממליץ בחום!' },
              { name: 'מור', text: 'ניתוח מדויק ושקוף של כל האפשרויות.' },
            ].map((t) => (
              <div key={t.name}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                  <Card 
                    style={{ 
                      maxWidth: 680, 
                      textAlign: 'center',
                      background: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <Paragraph>“{t.text}”</Paragraph>
                    <Text strong>{t.name}</Text>
                  </Card>
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
        </motion.div>
      </motion.section>

      {/* FAQ */}
      <motion.section 
        id="faq" 
        style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
          style={{ 
            borderRadius: 20,
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 8px 24px ${theme.colors.shadow}`,
          }}
        >
          <Title level={3} style={{ marginBottom: 16 }}>שאלות נפוצות</Title>
          <Collapse accordion>
            <Collapse.Panel header="למה צריך ביטוח בריאות פרטי אם יש קופת חולים?" key="1">
              <Paragraph>קופת חולים היא בסיס חשובה אך לעיתים לא מספיקה. ביטוח פרטי מוסיף כיסוי וזמינות.</Paragraph>
            </Collapse.Panel>
            <Collapse.Panel header="איך נדע מה המסלול הפנסיוני המתאים?" key="2">
              <Paragraph>אנחנו מנתחים את הנתונים האישיים ומתאימים מסלול לצרכים שלך.</Paragraph>
            </Collapse.Panel>
            <Collapse.Panel header="תוך כמה זמן חוזרים אליי?" key="3">
              <Paragraph>בדרך כלל תוך 48 שעות מרגע שליחת הפרטים.</Paragraph>
            </Collapse.Panel>
          </Collapse>
        </Card>
        </motion.div>
      </motion.section>

      {/* Contact / Footer */}
      <motion.section 
        id="contact" 
        style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
          style={{ 
            borderRadius: 20,
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 8px 24px ${theme.colors.shadow}`,
          }}
        >
          <Title level={3} style={{ marginBottom: 16 }}>יצירת קשר</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <img
                  src={barakImage}
                  alt="ברק יעקב"
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    objectFit: 'contain',
                    objectPosition: 'center top',
                    padding: '6px',
                    backgroundColor: theme.colors.cardBackground,
                    border: `2px solid ${theme.colors.border}`
                  }}
                />
                <div>
                  <Title level={4} style={{ margin: 0 }}>ברק יעקב</Title>
                  <Text style={{ color: theme.colors.textSecondary }}>סוכן ביטוח ופיננסים מוסמך</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <List
                itemLayout="horizontal"
                dataSource={[
                  { title: 'טלפון', desc: '050-1234567', icon: <PhoneOutlined style={{ color: theme.colors.accent }} /> },
                  { title: 'אימייל', desc: 'barak@example.com', icon: <MailOutlined style={{ color: theme.colors.accent }} /> },
                  { title: 'כתובת', desc: 'תל אביב-יפו', icon: <UserOutlined style={{ color: theme.colors.accent }} /> },
                ]}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: 'none', paddingBottom: 8 }}>
                    <List.Item.Meta 
                      avatar={<Avatar style={{ background: 'transparent' }}>{item.icon}</Avatar>} 
                      title={<Text style={{ color: theme.colors.text }}>{item.title}</Text>} 
                      description={<Text style={{ color: theme.colors.textSecondary }}>{item.desc}</Text>} 
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          <Divider />
          <Text type="secondary">© {new Date().getFullYear()} {branding.name}. כל הזכויות שמורות.</Text>
        </Card>
        </motion.div>
      </motion.section>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        /* Modern Input Styles */
        .lead-form .ant-form-item-label > label {
          color: #4a5568 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        
        .lead-form .ant-input, .lead-form .ant-input:focus {
          border: 2px solid #e2e8f0 !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          font-size: 16px !important;
          background: #f7fafc !important;
          transition: all 0.3s ease !important;
        }
        
        .lead-form .ant-input:focus {
          border-color: #00d4aa !important;
          box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1) !important;
          background: #ffffff !important;
        }
        
        .lead-form .ant-btn-primary {
          background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          height: 48px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          box-shadow: 0 8px 25px rgba(0, 212, 170, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        .lead-form .ant-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 35px rgba(0, 212, 170, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default LeadFormPage;


