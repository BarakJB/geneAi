import React, { useState } from 'react';
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
  TimePicker,
} from 'antd';
import {
  CalendarOutlined,
  SaveOutlined,
  ClearOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;
const { TextArea } = Input;

interface Meeting {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
  duration: number;
  location: string;
  notes: string;
  status: string;
}

const ScheduleMeeting: React.FC = () => {
  const [form] = Form.useForm();
  const [meeting, setMeeting] = useState<Meeting>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    meetingType: '',
    meetingDate: '',
    meetingTime: '',
    duration: 60,
    location: '',
    notes: '',
    status: 'scheduled',
  });

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .meeting-input .ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .meeting-input .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .meeting-input .ant-input-number {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .meeting-input .ant-input-number .ant-input-number-input {
        background-color: transparent !important;
        color: white !important;
      }
      
      .meeting-input .ant-select .ant-select-selector {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .meeting-input .ant-select .ant-select-selection-item {
        color: white !important;
      }
      
      .meeting-input .ant-picker {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .meeting-input .ant-picker input {
        color: white !important;
      }

      .meeting-input .ant-form-item-label > label {
        color: white !important;
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

  const handleInputChange = (field: keyof Meeting, value: any) => {
    setMeeting(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving meeting:', meeting);
      message.success('הפגישה נקבעה בהצלחה!');
    } catch (error) {
      console.error('Error saving meeting:', error);
      message.error('שגיאה בקביעת הפגישה');
    }
  };

  const handleClear = () => {
    setMeeting({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      meetingType: '',
      meetingDate: '',
      meetingTime: '',
      duration: 60,
      location: '',
      notes: '',
      status: 'scheduled',
    });
    form.resetFields();
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          style={cardStyle}
          title={
            <div style={{ textAlign: 'center', direction: 'rtl' }}>
              <Space>
                <CalendarOutlined style={{ color: '#faad14', fontSize: '24px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  קביעת פגישה
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
                  label={<span style={{ color: 'white' }}>שם הלקוח</span>}
                  className="meeting-input"
                >
                  <Input
                    placeholder="הזן שם הלקוח"
                    value={meeting.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>אימייל הלקוח</span>}
                  className="meeting-input"
                >
                  <Input
                    placeholder="example@email.com"
                    value={meeting.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    prefix={<MailOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>טלפון הלקוח</span>}
                  className="meeting-input"
                >
                  <Input
                    placeholder="050-1234567"
                    value={meeting.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    prefix={<PhoneOutlined style={{ color: 'white' }} />}
                    style={{ textAlign: 'right' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>סוג פגישה</span>}
                  className="meeting-input"
                >
                  <Select
                    placeholder="בחר סוג פגישה"
                    value={meeting.meetingType}
                    onChange={(value) => handleInputChange('meetingType', value)}
                  >
                    <Select.Option value="initial">פגישת היכרות</Select.Option>
                    <Select.Option value="consultation">ייעוץ</Select.Option>
                    <Select.Option value="presentation">הצגת הצעה</Select.Option>
                    <Select.Option value="followup">פגישת מעקב</Select.Option>
                    <Select.Option value="closing">חתימה על הסכם</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>תאריך פגישה</span>}
                  className="meeting-input"
                >
                  <DatePicker
                    placeholder="בחר תאריך"
                    style={{ width: '100%' }}
                    onChange={(_, dateString) => handleInputChange('meetingDate', dateString)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>שעת פגישה</span>}
                  className="meeting-input"
                >
                  <TimePicker
                    placeholder="בחר שעה"
                    style={{ width: '100%' }}
                    format="HH:mm"
                    onChange={(_, timeString) => handleInputChange('meetingTime', timeString)}
                    prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>משך הפגישה (דקות)</span>}
                  className="meeting-input"
                >
                  <Select
                    placeholder="בחר משך זמן"
                    value={meeting.duration}
                    onChange={(value) => handleInputChange('duration', value)}
                  >
                    <Select.Option value={30}>30 דקות</Select.Option>
                    <Select.Option value={60}>60 דקות</Select.Option>
                    <Select.Option value={90}>90 דקות</Select.Option>
                    <Select.Option value={120}>120 דקות</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>מיקום פגישה</span>}
                  className="meeting-input"
                >
                  <Select
                    placeholder="בחר מיקום"
                    value={meeting.location}
                    onChange={(value) => handleInputChange('location', value)}
                  >
                    <Select.Option value="office">המשרד שלנו</Select.Option>
                    <Select.Option value="client">אצל הלקוח</Select.Option>
                    <Select.Option value="zoom">זום</Select.Option>
                    <Select.Option value="phone">שיחת טלפון</Select.Option>
                    <Select.Option value="other">אחר</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label={<span style={{ color: 'white' }}>הערות</span>}
                  className="meeting-input"
                >
                  <TextArea
                    rows={4}
                    placeholder="הערות נוספות על הפגישה..."
                    value={meeting.notes}
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
                      background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    קבע פגישה
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
    </div>
  );
};

export default ScheduleMeeting;
