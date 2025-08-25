import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Avatar,
  Badge,
  Tag,
  Button,
  Space,
  Divider,
  Progress,
  Timeline,
} from 'antd';
import {
  TeamOutlined,
  TrophyOutlined,
  BarChartOutlined,
  DollarOutlined,
  BellOutlined,
  SettingOutlined,
  ShopOutlined,
  CalendarOutlined,
  UserAddOutlined,
  FileTextOutlined,
  StarOutlined,
  ArrowUpOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    totalClients: 1247,
    monthlyRevenue: 185420,
    activePolicies: 892,
    pendingLeads: 34,
    completionRate: 87.5,
    customerSatisfaction: 4.8,
    monthlyGrowth: 12.3,
    averageDealValue: 15800,
    conversion_rate: 23.5,
    total_meetings: 145,
    closed_deals: 67,
    pipeline_value: 2450000,
    response_time: 2.4,
    retention_rate: 94.2,
  };



  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const topCards = [
    {
      title: 'סך הכל לקוחות',
      value: stats.totalClients.toLocaleString(),
      icon: <TeamOutlined style={{ color: '#52c41a' }} />,
      trend: '+12.5%',
      trendUp: true,
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)',
    },
    {
      title: 'הכנסות החודש',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <DollarOutlined style={{ color: '#1890ff' }} />,
      trend: '+8.3%',
      trendUp: true,
      color: '#1890ff',
      bgColor: 'rgba(24, 144, 255, 0.1)',
    },
    {
      title: 'פוליסות פעילות',
      value: stats.activePolicies.toLocaleString(),
      icon: <FileTextOutlined style={{ color: '#722ed1' }} />,
      trend: '+5.7%',
      trendUp: true,
      color: '#722ed1',
      bgColor: 'rgba(114, 46, 209, 0.1)',
    },
    {
      title: 'לידים ממתינים',
      value: stats.pendingLeads.toLocaleString(),
      icon: <UserAddOutlined style={{ color: '#fa541c' }} />,
      trend: '-3.2%',
      trendUp: false,
      color: '#fa541c',
      bgColor: 'rgba(250, 84, 28, 0.1)',
    },
  ];

  const recentActivities = [
    { type: 'call', client: 'דוד כהן', action: 'שיחה טלפונית', time: '10:30', status: 'completed' },
    { type: 'meeting', client: 'שרה לוי', action: 'פגישת ייעוץ', time: '14:00', status: 'scheduled' },
    { type: 'email', client: 'משה אברהם', action: 'שליחת הצעה', time: '16:45', status: 'sent' },
    { type: 'deal', client: 'רחל גולד', action: 'סגירת עסקה', time: '09:15', status: 'closed' },
  ];

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    background: 'transparent',
    minHeight: 'calc(100vh - 140px)',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
  };

  const welcomeCardStyle: React.CSSProperties = {
    ...cardStyle,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section */}
        <Card style={welcomeCardStyle} styles={{ body: { padding: '32px' } }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space align="center" size="large">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Avatar 
                    size={64}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                    }}
                    icon={<ShopOutlined style={{ fontSize: '28px' }} />}
                  />
                </motion.div>
                <div style={{ direction: 'rtl' }}>
                  <Title level={2} style={{ color: 'white', margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                    הבית לסוכן
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                    {currentTime.toLocaleDateString('he-IL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Badge count={5}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    size="large"
                    style={{ 
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '12px',
                    }}
                  />
                </Badge>
                <Button 
                  type="text" 
                  icon={<SettingOutlined />} 
                  size="large"
                  style={{ 
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {topCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card 
                  style={{
                    ...cardStyle,
                    background: card.bgColor,
                    border: `1px solid ${card.color}40`,
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div style={{ marginBottom: '8px' }}>
                        <Text style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                          {card.title}
                        </Text>
                      </div>
                      <Title level={2} style={{ color: 'white', margin: 0 }}>
                        {card.value}
                      </Title>
                      <div style={{ marginTop: '8px' }}>
                        <Tag 
                          color={card.trendUp ? 'success' : 'error'}
                          style={{ borderRadius: '12px' }}
                        >
                          {card.trendUp ? <ArrowUpOutlined /> : <ArrowUpOutlined style={{ transform: 'rotate(180deg)' }} />}
                          {card.trend}
                        </Tag>
                      </div>
                    </Col>
                    <Col>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}
                      >
                        {card.icon}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Performance & Activities */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {/* Performance Chart */}
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card 
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#1890ff' }} />
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                      ביצועים חודשיים
                    </span>
                  </Space>
                }
                style={cardStyle}
                styles={{ 
                  header: { 
                    background: 'transparent', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    direction: 'rtl'
                  },
                  body: { padding: '24px', direction: 'rtl' }
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>אחוז השלמה</span>}
                      value={stats.completionRate} 
                      suffix="%"
                      valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 700 }}
                    />
                    <Progress 
                      percent={stats.completionRate} 
                      showInfo={false} 
                      strokeColor="#52c41a"
                      trailColor="rgba(255, 255, 255, 0.1)"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>שביעות רצון לקוחות</span>}
                      value={stats.customerSatisfaction}
                      suffix={<StarOutlined style={{ color: '#faad14' }} />}
                      valueStyle={{ color: '#faad14', fontSize: '32px', fontWeight: 700 }}
                    />
                    <Progress 
                      percent={(stats.customerSatisfaction / 5) * 100} 
                      showInfo={false} 
                      strokeColor="#faad14"
                      trailColor="rgba(255, 255, 255, 0.1)"
                    />
                  </Col>
                </Row>
                
                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '24px 0' }} />
                
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic 
                      title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>צמיחה חודשית</span>}
                      value={stats.monthlyGrowth} 
                      suffix="%"
                      valueStyle={{ color: '#1890ff', fontSize: '20px', fontWeight: 600 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ממוצע עסקה</span>}
                      value={formatCurrency(stats.averageDealValue)}
                      valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 600 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>קצב המרה</span>}
                      value={stats.conversion_rate} 
                      suffix="%"
                      valueStyle={{ color: '#fa541c', fontSize: '20px', fontWeight: 600 }}
                    />
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>

          {/* Recent Activities */}
          <Col xs={24} lg={10}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card 
                title={
                  <Space>
                    <CalendarOutlined style={{ color: '#52c41a' }} />
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                      פעילות אחרונה
                    </span>
                  </Space>
                }
                style={cardStyle}
                styles={{ 
                  header: { 
                    background: 'transparent', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    direction: 'rtl'
                  },
                  body: { padding: '24px', direction: 'rtl' }
                }}
              >
                <Timeline
                  items={recentActivities.map((activity) => ({
                    dot: activity.type === 'call' ? <PhoneOutlined style={{ color: '#1890ff' }} />
                       : activity.type === 'meeting' ? <CalendarOutlined style={{ color: '#52c41a' }} />
                       : activity.type === 'email' ? <MailOutlined style={{ color: '#722ed1' }} />
                       : <DollarOutlined style={{ color: '#fa541c' }} />,
                    children: (
                      <div style={{ direction: 'rtl', textAlign: 'right' }}>
                        <Text strong style={{ color: 'white', fontSize: '16px' }}>
                          {activity.client}
                        </Text>
                        <br />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {activity.action}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                          {activity.time}
                        </Text>
                        <Tag 
                          color={
                            activity.status === 'completed' ? 'success' :
                            activity.status === 'scheduled' ? 'processing' :
                            activity.status === 'sent' ? 'warning' : 'error'
                          }
                          style={{ marginRight: '8px', fontSize: '11px' }}
                        >
                          {activity.status === 'completed' ? 'הושלם' :
                           activity.status === 'scheduled' ? 'מתוכנן' :
                           activity.status === 'sent' ? 'נשלח' : 'סגור'}
                        </Tag>
                      </div>
                    ),
                  }))}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card 
                title={
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                      פעולות מהירות
                    </span>
                  </Space>
                }
                style={cardStyle}
                styles={{ 
                  header: { 
                    background: 'transparent', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    direction: 'rtl'
                  },
                  body: { padding: '24px', direction: 'rtl' }
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      block 
                      size="large"
                      icon={<UserAddOutlined style={{ color: 'white' }} />}
                      style={{ 
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(0, 0, 0, 0.4)';
                        (e.target as HTMLElement).style.transform = 'translateY(0px)';
                      }}
                    >
                      לקוח חדש
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      block 
                      size="large"
                      icon={<CalendarOutlined style={{ color: 'white' }} />}
                      style={{ 
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(0, 0, 0, 0.4)';
                        (e.target as HTMLElement).style.transform = 'translateY(0px)';
                      }}
                    >
                      קביעת פגישה
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      block 
                      size="large"
                      icon={<FileTextOutlined style={{ color: 'white' }} />}
                      style={{ 
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(0, 0, 0, 0.4)';
                        (e.target as HTMLElement).style.transform = 'translateY(0px)';
                      }}
                    >
                      הצעה חדשה
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      block 
                      size="large"
                      icon={<BarChartOutlined style={{ color: 'white' }} />}
                      style={{ 
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'rgba(0, 0, 0, 0.4)';
                        (e.target as HTMLElement).style.transform = 'translateY(0px)';
                      }}
                    >
                      דוחות
                    </Button>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default Dashboard;