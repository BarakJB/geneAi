import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  DatePicker,
  Select,
  Button,
  Statistic,
  Progress,
} from 'antd';
import {
  BarChartOutlined,
  TrophyOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ReportData {
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  averageDealSize: number;
  meetingsScheduled: number;
  callsMade: number;
  conversionRate: number;
}

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [reportType, setReportType] = useState('monthly');
  
  // Mock data - בייצור אמיתי זה יבוא מהשרת
  const [reportData] = useState<ReportData>({
    totalLeads: 156,
    convertedLeads: 23,
    totalRevenue: 485000,
    averageDealSize: 21087,
    meetingsScheduled: 45,
    callsMade: 234,
    conversionRate: 14.7,
  });

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
    marginBottom: '24px',
    width: '60%',
    maxWidth: '1200px',
    minWidth: '800px',
    margin: '0 auto 24px auto',
  };

  const statCardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    textAlign: 'center',
    padding: '20px',
  };

  const generateReport = () => {
    console.log('Generating report for:', { dateRange, reportType });
    // כאן תהיה הלוגיקה לייצור הדוח
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Card
          style={cardStyle}
          title={
            <div style={{ textAlign: 'center', direction: 'rtl' }}>
              <Space>
                <BarChartOutlined style={{ color: '#722ed1', fontSize: '24px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  דוחות ואנליטיקה
                </Title>
              </Space>
            </div>
          }
          styles={{
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            },
            body: { padding: '24px', direction: 'rtl' }
          }}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={{ color: 'white' }}>טווח תאריכים:</Text>
                <RangePicker
                  style={{ width: '100%' }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={['תאריך התחלה', 'תאריך סיום']}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={{ color: 'white' }}>סוג דוח:</Text>
                <Select
                  style={{ width: '100%' }}
                  value={reportType}
                  onChange={(value) => setReportType(value)}
                  placeholder="בחר סוג דוח"
                >
                  <Select.Option value="daily">יומי</Select.Option>
                  <Select.Option value="weekly">שבועי</Select.Option>
                  <Select.Option value="monthly">חודשי</Select.Option>
                  <Select.Option value="quarterly">רבעוני</Select.Option>
                  <Select.Option value="yearly">שנתי</Select.Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ height: '22px' }}></div>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<BarChartOutlined />}
                  onClick={generateReport}
                  style={{
                    background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                >
                  צור דוח
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={statCardStyle}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>סה"כ לידים</span>}
                  value={reportData.totalLeads}
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px' }}
                />
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={12} sm={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={statCardStyle}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>לידים שהומרו</span>}
                  value={reportData.convertedLeads}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px' }}
                />
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={12} sm={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={statCardStyle}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>פגישות</span>}
                  value={reportData.meetingsScheduled}
                  prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px' }}
                />
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={12} sm={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={statCardStyle}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>שיחות</span>}
                  value={reportData.callsMade}
                  prefix={<PhoneOutlined style={{ color: '#f759ab' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Revenue & Performance */}
        <div style={{ maxWidth: '1200px', width: '60%', margin: '24px auto 0', minWidth: '800px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card style={statCardStyle} styles={{ body: { padding: '32px', textAlign: 'center' } }}>
                  <Space direction="vertical" size="large">
                    <DollarOutlined style={{ color: '#52c41a', fontSize: '48px' }} />
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>סה"כ הכנסות</span>}
                      value={reportData.totalRevenue}
                      prefix="₪"
                      valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 'bold' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                      עסקה ממוצעת: ₪{reportData.averageDealSize.toLocaleString()}
                    </Text>
                  </Space>
                </Card>
              </motion.div>
            </Col>
            
            <Col xs={24} sm={12}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card style={statCardStyle} styles={{ body: { padding: '32px', textAlign: 'center' } }}>
                  <Space direction="vertical" size="large">
                    <TrophyOutlined style={{ color: '#faad14', fontSize: '48px' }} />
                    <div>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
                        אחוז המרה
                      </Text>
                      <div style={{ marginTop: '16px' }}>
                        <Progress
                          type="circle"
                          percent={reportData.conversionRate}
                          format={percent => (
                            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                              {percent}%
                            </span>
                          )}
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          size={120}
                        />
                      </div>
                    </div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>

        {/* Coming Soon Features */}
        <Card style={cardStyle} styles={{ body: { padding: '32px', textAlign: 'center' } }}>
          <Space direction="vertical" size="large">
            <ClockCircleOutlined style={{ color: '#d48806', fontSize: '48px' }} />
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              תכונות נוספות בפיתוח
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              גרפים מתקדמים • דוחות מפורטים • ניתוח טרנדים • השוואות תקופתיות
            </Text>
          </Space>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
