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
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo agency ID - in real app this would come from user context
  const currentAgencyId = 'b7faffec-8453-11f0-a626-0242ac140002'; // ביטוח וייעוץ המרכז
  
  const [dashboardStats, setDashboardStats] = useState({
    active_customers: 0,
    leads_count: 0,
    meetings_scheduled: 0,
    not_relevant_count: 0,
    total_contacts: 0,
    pending_tasks: 0,
    active_tasks: 0,
    completed_tasks: 0,
    total_tasks: 0,
    total_pension_balance: 0,
    total_insurance_coverage: 0,
    conversion_rate_percentage: 0,
    new_contacts_today: 0,
    new_tasks_today: 0,
    new_contacts_week: 0,
    new_contacts_month: 0,
    agency_name: '',
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [urgentItems, setUrgentItems] = useState([]);

  useEffect(() => {
    // Simulate API call to get dashboard stats
    // In real app: fetch(`/api/dashboard/stats?agency_id=${currentAgencyId}`)
    const fetchDashboardData = async () => {
      try {
        // This would be replaced with actual API calls to the views we created
        // SELECT * FROM v_dashboard_stats WHERE agency_id = ?
        const mockStats = {
          active_customers: 1,
          leads_count: 1,
          meetings_scheduled: 0,
          not_relevant_count: 0,
          total_contacts: 2,
          pending_tasks: 2,
          active_tasks: 1,
          completed_tasks: 1,
          total_tasks: 4,
          total_pension_balance: 1755000,
          total_insurance_coverage: 4260000,
          conversion_rate_percentage: 50.0,
          new_contacts_today: 0,
          new_tasks_today: 0,
          new_contacts_week: 2,
          new_contacts_month: 2,
          agency_name: 'ביטוח וייעוץ המרכז',
        };
        
        setDashboardStats(mockStats);
        
        // Mock recent activity - from v_recent_activity
        setRecentActivity([
          {
            type: 'customer_created',
            description: 'לקוח חדש נוסף',
            name: 'ישראל ישראלי',
            time: '10 דקות',
            status: 'לקוח',
            color: theme.colors.success
          },
          {
            type: 'status_changed',
            description: 'שינוי סטטוס לקוח',
            name: 'דוד לוי',
            time: '30 דקות',
            status: 'ליד',
            color: theme.colors.warning
          }
        ]);
        
        // Mock urgent items - from v_urgent_items
        setUrgentItems([
          {
            type: 'old_lead',
            description: 'ליד ישן - דוד לוי',
            days: 1,
            priority: 'medium'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchDashboardData();
  }, [currentAgencyId]);



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
      title: 'לקוחות פעילים',
      value: dashboardStats.active_customers.toLocaleString(),
      subtitle: `מתוך ${dashboardStats.total_contacts} איש קשר`,
      icon: <TeamOutlined style={{ color: theme.colors.success }} />,
      trend: dashboardStats.new_contacts_week > 0 ? `+${dashboardStats.new_contacts_week} השבוע` : 'ללא שינוי',
      trendUp: dashboardStats.new_contacts_week > 0,
      color: theme.colors.success,
      bgColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'לידים פעילים',
      value: dashboardStats.leads_count.toLocaleString(),
      subtitle: `+ ${dashboardStats.meetings_scheduled} פגישות מתוכננות`,
      icon: <UserAddOutlined style={{ color: theme.colors.warning }} />,
      trend: dashboardStats.new_contacts_month > 0 ? `+${dashboardStats.new_contacts_month} החודש` : 'ללא שינוי',
      trendUp: dashboardStats.new_contacts_month > 0,
      color: theme.colors.warning,
      bgColor: theme.mode === 'dark' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 193, 7, 0.1)',
    },
    {
      title: 'יתרת פנסיה כוללת',
      value: formatCurrency(dashboardStats.total_pension_balance),
      subtitle: 'מלקוחות פעילים בלבד',
      icon: <DollarOutlined style={{ color: theme.colors.info }} />,
      trend: `שיעור המרה: ${dashboardStats.conversion_rate_percentage}%`,
      trendUp: dashboardStats.conversion_rate_percentage > 25,
      color: theme.colors.info,
      bgColor: theme.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
    },
    {
      title: 'משימות פעילות',
      value: (dashboardStats.pending_tasks + dashboardStats.active_tasks).toLocaleString(),
      subtitle: `${dashboardStats.completed_tasks} הושלמו מתוך ${dashboardStats.total_tasks}`,
      icon: <FileTextOutlined style={{ color: theme.colors.warning }} />,
      trend: dashboardStats.new_tasks_today > 0 ? `+${dashboardStats.new_tasks_today} היום` : 'ללא חדשות',
      trendUp: dashboardStats.total_tasks > dashboardStats.pending_tasks,
      color: theme.colors.warning,
      bgColor: theme.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
    },
  ];

  // recentActivities is now managed by state from the API
  // This gets populated in the useEffect above

  const containerStyle: React.CSSProperties = {
    padding: '8px',
    background: 'transparent',
    minHeight: 'calc(100vh - 140px)',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: `0 8px 32px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.cardBackground,
    backdropFilter: 'blur(20px)',
    color: theme.colors.text,
  };

  const welcomeCardStyle: React.CSSProperties = {
    ...cardStyle,
    background: theme.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
    border: `1px solid ${theme.colors.border}`,
  };

  return (
    <div style={{
      ...containerStyle,
      maxWidth: '100%',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section */}
        <Card style={welcomeCardStyle} styles={{ body: { padding: '12px' } }}>
          <Row align="middle" justify="space-between" style={{ width: '100%' }}>
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
        <Row gutter={[16, 16]} style={{ marginTop: '16px', width: '100%' }}>
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
                  <Row justify="space-between" align="middle" style={{ width: '100%' }}>
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
        <Row gutter={[16, 16]} style={{ marginTop: '16px', width: '100%' }}>
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
                    <BarChartOutlined style={{ color: theme.colors.info }} />
                    <span style={{ color: theme.colors.text, fontSize: '18px', fontWeight: 600 }}>
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
                <Row gutter={[12, 12]} style={{ width: '100%' }}>
                  <Col xs={24} sm={12}>
                    <div style={{ 
                      background: 'transparent',
                      padding: '16px',
                      borderRadius: '8px'
                    }}>
                      <Statistic 
                        title={<span style={{ color: theme.colors.textSecondary }}>אחוז השלמה</span>}
                        value={dashboardStats.completion_rate || 85} 
                        suffix="%"
                        valueStyle={{ color: theme.colors.success, fontSize: '32px', fontWeight: 700 }}
                        className="custom-statistic-success"
                      />
                      <Progress 
                        percent={dashboardStats.completion_rate || 85} 
                        showInfo={false} 
                        strokeColor={theme.colors.success}
                        trailColor={theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ 
                      background: 'transparent',
                      padding: '16px',
                      borderRadius: '8px'
                    }}>
                      <Statistic 
                        title={<span style={{ color: theme.colors.textSecondary }}>שביעות רצון לקוחות</span>}
                        value={4.5}
                        suffix={<StarOutlined style={{ color: theme.colors.warning }} />}
                        valueStyle={{ color: theme.colors.warning, fontSize: '32px', fontWeight: 700 }}
                        className="custom-statistic-warning"
                      />
                      <Progress 
                        percent={(4.5 / 5) * 100} 
                        showInfo={false} 
                        strokeColor={theme.colors.warning}
                        trailColor={theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                      />
                    </div>
                  </Col>
                </Row>
                
                <Divider style={{ borderColor: theme.colors.border, margin: '24px 0' }} />
                
                <Row gutter={[12, 12]} style={{ width: '100%' }}>
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: 'transparent',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <Statistic 
                        title={<span style={{ color: theme.colors.textSecondary }}>צמיחה חודשית</span>}
                        value={12.5} 
                        suffix="%"
                        valueStyle={{ color: theme.colors.info, fontSize: '20px', fontWeight: 600 }}
                        className="custom-statistic-info"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: 'transparent',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <Statistic 
                        title={<span style={{ color: theme.colors.textSecondary }}>ממוצע עסקה</span>}
                        value={formatCurrency(50000)}
                        valueStyle={{ color: theme.colors.accent, fontSize: '20px', fontWeight: 600 }}
                        className="custom-statistic-accent"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: 'transparent',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <Statistic 
                        title={<span style={{ color: theme.colors.textSecondary }}>קצב המרה</span>}
                        value={dashboardStats.conversion_rate} 
                        suffix="%"
                        valueStyle={{ color: theme.colors.warning, fontSize: '20px', fontWeight: 600 }}
                        className="custom-statistic-warning-small"
                      />
                    </div>
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
                  items={recentActivity.map((activity, index) => ({
                    dot: activity.type === 'customer_created' ? <UserAddOutlined style={{ color: activity.color }} />
                       : activity.type === 'status_changed' ? <TeamOutlined style={{ color: activity.color }} />
                       : activity.type === 'task_created' ? <FileTextOutlined style={{ color: activity.color }} />
                       : <CalendarOutlined style={{ color: activity.color }} />,
                    children: (
                      <div key={index} style={{ direction: 'rtl', textAlign: 'right' }}>
                        <Text strong style={{ color: 'white', fontSize: '16px' }}>
                          {activity.name}
                        </Text>
                        <br />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {activity.description}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                          לפני {activity.time}
                        </Text>
                        <Tag 
                          color={activity.color}
                          style={{ 
                            marginRight: '8px', 
                            fontSize: '11px',
                            backgroundColor: activity.color,
                            borderColor: activity.color,
                            color: 'white'
                          }}
                        >
                          {activity.status}
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
        <Row gutter={[12, 12]} style={{ marginTop: '16px', width: '100%' }}>
          <Col span={24} style={{ width: '100%' }}>
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
                <Row gutter={[12, 12]} style={{ width: '100%' }}>
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