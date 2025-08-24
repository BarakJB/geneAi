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

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .lead-input .ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .lead-input .ant-input-number {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-input-number .ant-input-number-input {
        background-color: transparent !important;
        color: white !important;
      }
      
      .lead-input .ant-select .ant-select-selector {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-select .ant-select-selection-item {
        color: white !important;
      }
      
      .lead-input .ant-picker {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .lead-input .ant-picker input {
        color: white !important;
      }

      .lead-input .ant-form-item-label > label {
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

  const handleInputChange = (field: keyof Lead, value: any) => {
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
                    style={{ textAlign: 'right' }}
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
                    style={{ textAlign: 'right' }}
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
                    onChange={(_, dateString) => handleInputChange('followUpDate', dateString)}
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
    </div>
  );
};

export default NewLead;
