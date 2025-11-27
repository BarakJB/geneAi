import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Divider,
  Badge,
  Tooltip,
  message,
  Empty,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RiseOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  platforms: string[];
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  leads: number;
  conversions: number;
  cpl: number; // Cost Per Lead
  roi: number;
  coverCollaboration: {
    status: 'pending' | 'approved' | 'rejected' | 'in-review';
    marketingContact: string;
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CampaignManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - זה יוחלף באפליקציה אמיתית ב-API calls
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'קמפיין פנסיה - רבעון 1',
        description: 'קמפיין לגיוס לקוחות חדשים לביטוח פנסיה',
        budget: 15000,
        spent: 12500,
        platforms: ['Facebook', 'Google Ads', 'LinkedIn'],
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        leads: 85,
        conversions: 23,
        cpl: 147,
        roi: 2.3,
        coverCollaboration: {
          status: 'approved',
          marketingContact: 'דנה כהן',
          notes: 'קמפיין מאושר עם תמיכה מלאה'
        },
        createdAt: '2024-01-10',
        updatedAt: '2024-02-20'
      },
      {
        id: '2',
        name: 'ביטוח בריאות - קיץ 2024',
        description: 'קמפיין עונתי לביטוח בריאות למשפחות',
        budget: 8000,
        spent: 6200,
        platforms: ['Instagram', 'Facebook'],
        status: 'active',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        leads: 42,
        conversions: 18,
        cpl: 148,
        roi: 1.8,
        coverCollaboration: {
          status: 'in-review',
          marketingContact: 'יוסי לוי',
          notes: 'בבדיקה לאישור תקציב נוסף'
        },
        createdAt: '2024-05-25',
        updatedAt: '2024-07-15'
      },
      {
        id: '3',
        name: 'קרן השתלמות לצעירים',
        description: 'מיקוד לגילאי 25-35 לפתיחת קרן השתלמות',
        budget: 5000,
        spent: 5000,
        platforms: ['TikTok', 'Instagram'],
        status: 'completed',
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        leads: 67,
        conversions: 31,
        cpl: 75,
        roi: 3.1,
        coverCollaboration: {
          status: 'approved',
          marketingContact: 'מיכל גולן',
          notes: 'קמפיין מוצלח - המשך מתוכנן'
        },
        createdAt: '2024-02-20',
        updatedAt: '2024-05-01'
      }
    ];
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'orange';
      case 'completed': return 'blue';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'paused': return 'מושהה';
      case 'completed': return 'הושלם';
      case 'draft': return 'טיוטה';
      default: return status;
    }
  };

  const getCoverStatusColor = (status: Campaign['coverCollaboration']['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'in-review': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getCoverStatusText = (status: Campaign['coverCollaboration']['status']) => {
    switch (status) {
      case 'approved': return 'מאושר';
      case 'rejected': return 'נדחה';
      case 'in-review': return 'בבדיקה';
      case 'pending': return 'ממתין';
      default: return status;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return '📘';
      case 'Instagram': return '📷';
      case 'Google Ads': return '🔍';
      case 'LinkedIn': return '💼';
      case 'TikTok': return '🎵';
      default: return '📢';
    }
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    form.setFieldsValue({
      ...campaign,
      dateRange: [dayjs(campaign.startDate), dayjs(campaign.endDate)]
    });
    setIsModalVisible(true);
  };

  const handleSaveCampaign = async (values: any) => {
    setLoading(true);
    try {
      const campaignData = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        id: editingCampaign?.id || Date.now().toString(),
        leads: editingCampaign?.leads || 0,
        conversions: editingCampaign?.conversions || 0,
        spent: editingCampaign?.spent || 0,
        cpl: 0,
        roi: 0,
        createdAt: editingCampaign?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingCampaign) {
        setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? campaignData : c));
        message.success('הקמפיין עודכן בהצלחה');
      } else {
        setCampaigns(prev => [...prev, campaignData]);
        message.success('הקמפיין נוצר בהצלחה');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('שגיאה בשמירת הקמפיין');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    Modal.confirm({
      title: 'האם אתה בטוח שברצונך למחוק את הקמפיין?',
      content: 'פעולה זו לא ניתנת לביטול',
      okText: 'מחק',
      cancelText: 'ביטול',
      onOk: () => {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        message.success('הקמפיין נמחק בהצלחה');
      }
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.status === activeTab;
  });

  const totalStats = {
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    avgROI: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length : 0
  };

  const columns = [
    {
      title: 'שם הקמפיין',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Campaign) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'פלטפורמות',
      dataIndex: 'platforms',
      key: 'platforms',
      render: (platforms: string[]) => (
        <Space wrap>
          {platforms.map(platform => (
            <Tag key={platform} icon={getPlatformIcon(platform)}>
              {platform}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'תקציב / הוצאה',
      key: 'budget',
      render: (_, record: Campaign) => (
        <div>
          <Text strong>₪{record.spent.toLocaleString()}</Text>
          <Text type="secondary"> / ₪{record.budget.toLocaleString()}</Text>
          <br />
          <Progress 
            percent={Math.round((record.spent / record.budget) * 100)} 
            size="small" 
            status={record.spent > record.budget ? 'exception' : 'normal'}
          />
        </div>
      ),
    },
    {
      title: 'לידים / המרות',
      key: 'performance',
      render: (_, record: Campaign) => (
        <div>
          <Statistic 
            value={record.leads} 
            suffix="לידים" 
            valueStyle={{ fontSize: 14 }}
          />
          <Statistic 
            value={record.conversions} 
            suffix="המרות" 
            valueStyle={{ fontSize: 14, color: '#52c41a' }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            שיעור המרה: {record.leads > 0 ? Math.round((record.conversions / record.leads) * 100) : 0}%
          </Text>
        </div>
      ),
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (roi: number) => (
        <Statistic
          value={roi}
          precision={1}
          suffix="x"
          valueStyle={{ 
            color: roi >= 2 ? '#3f8600' : roi >= 1 ? '#faad14' : '#cf1322',
            fontSize: 16
          }}
          prefix={<RiseOutlined />}
        />
      ),
    },
    {
      title: 'סטטוס',
      dataIndex: 'status',
      key: 'status',
      render: (status: Campaign['status']) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Cover',
      key: 'cover',
      render: (_, record: Campaign) => (
        <div>
          <Badge 
            status={getCoverStatusColor(record.coverCollaboration.status)}
            text={getCoverStatusText(record.coverCollaboration.status)}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.coverCollaboration.marketingContact}
          </Text>
        </div>
      ),
    },
    {
      title: 'פעולות',
      key: 'actions',
      render: (_, record: Campaign) => (
        <Space>
          <Tooltip title="צפייה">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="עריכה">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditCampaign(record)}
            />
          </Tooltip>
          <Tooltip title="מחיקה">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDeleteCampaign(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const containerStyle: React.CSSProperties = {
    background: 'transparent',
    minHeight: 'calc(100vh - 88px)',
    padding: '24px',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    marginBottom: '24px',
  };

  // Dynamic CSS injection for dark theme
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .campaign-management .ant-table {
        background: transparent !important;
      }
      .campaign-management .ant-table-thead > tr > th {
        background: rgba(255, 255, 255, 0.1) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: white !important;
      }
      .campaign-management .ant-table-tbody > tr > td {
        background: transparent !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        color: white !important;
      }
      .campaign-management .ant-table-tbody > tr:hover > td {
        background: rgba(255, 255, 255, 0.05) !important;
      }
      .campaign-management .ant-input {
        background: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
      }
      .campaign-management .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.6) !important;
      }
      .campaign-management .ant-select-selector {
        background: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
      }
      .campaign-management .ant-picker {
        background: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
      }
      .campaign-management .ant-form-item-label > label {
        color: white !important;
      }
      .campaign-management .ant-tabs-tab {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      .campaign-management .ant-tabs-tab-active {
        color: white !important;
      }
      .campaign-management .ant-tabs-ink-bar {
        background: #007AFF !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={containerStyle} className="campaign-management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <ShareAltOutlined style={{ marginLeft: '12px' }} />
              ניהול קמפיינים
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              מעקב ובקרה על כל הקמפיינים השיווקיים
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCampaign}
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '40px',
                fontWeight: 600,
              }}
            >
              קמפיין חדש
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={cardStyle} styles={{ body: { padding: '20px' } }}>
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>סה"כ תקציב</span>}
                value={totalStats.totalBudget}
                prefix="₪"
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={cardStyle} styles={{ body: { padding: '20px' } }}>
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>סה"כ הוצאה</span>}
                value={totalStats.totalSpent}
                prefix="₪"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={cardStyle} styles={{ body: { padding: '20px' } }}>
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>סה"כ לידים</span>}
                value={totalStats.totalLeads}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={cardStyle} styles={{ body: { padding: '20px' } }}>
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ROI ממוצע</span>}
                value={totalStats.avgROI}
                precision={1}
                suffix="x"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card style={cardStyle}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            style={{ marginBottom: '16px' }}
          >
            <TabPane tab="כל הקמפיינים" key="all" />
            <TabPane tab="פעילים" key="active" />
            <TabPane tab="הושלמו" key="completed" />
            <TabPane tab="מושהים" key="paused" />
            <TabPane tab="טיוטות" key="draft" />
          </Tabs>

          <Table
            columns={columns}
            dataSource={filteredCampaigns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: (
                <Empty
                  description="אין קמפיינים במצב זה"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              )
            }}
          />
        </Card>

        {/* Campaign Modal */}
        <Modal
          title={editingCampaign ? 'עריכת קמפיין' : 'קמפיין חדש'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="campaign-management"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveCampaign}
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="שם הקמפיין"
                  rules={[{ required: true, message: 'אנא הזן שם לקמפיין' }]}
                >
                  <Input placeholder="שם הקמפיין" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="budget"
                  label="תקציב (₪)"
                  rules={[{ required: true, message: 'אנא הזן תקציב' }]}
                >
                  <InputNumber
                    placeholder="15000"
                    style={{ width: '100%' }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/₪\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="תיאור"
              rules={[{ required: true, message: 'אנא הזן תיאור' }]}
            >
              <TextArea rows={3} placeholder="תיאור הקמפיין..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="platforms"
                  label="פלטפורמות"
                  rules={[{ required: true, message: 'אנא בחר פלטפורמות' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="בחר פלטפורמות"
                    options={[
                      { label: '📘 Facebook', value: 'Facebook' },
                      { label: '📷 Instagram', value: 'Instagram' },
                      { label: '🔍 Google Ads', value: 'Google Ads' },
                      { label: '💼 LinkedIn', value: 'LinkedIn' },
                      { label: '🎵 TikTok', value: 'TikTok' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="סטטוס"
                  rules={[{ required: true, message: 'אנא בחר סטטוס' }]}
                >
                  <Select placeholder="בחר סטטוס">
                    <Option value="draft">טיוטה</Option>
                    <Option value="active">פעיל</Option>
                    <Option value="paused">מושהה</Option>
                    <Option value="completed">הושלם</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="dateRange"
              label="תאריכי הקמפיין"
              rules={[{ required: true, message: 'אנא בחר תאריכים' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            <Title level={5} style={{ color: 'white' }}>שיתוף פעולה עם Cover</Title>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['coverCollaboration', 'status']}
                  label="סטטוס שיתוף פעולה"
                >
                  <Select placeholder="בחר סטטוס">
                    <Option value="pending">ממתין</Option>
                    <Option value="in-review">בבדיקה</Option>
                    <Option value="approved">מאושר</Option>
                    <Option value="rejected">נדחה</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['coverCollaboration', 'marketingContact']}
                  label="איש קשר שיווק"
                >
                  <Input placeholder="שם איש הקשר" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['coverCollaboration', 'notes']}
              label="הערות"
            >
              <TextArea rows={2} placeholder="הערות לגבי השיתוף פעולה..." />
            </Form.Item>

            <div style={{ textAlign: 'left', marginTop: '24px' }}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  ביטול
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCampaign ? 'עדכן' : 'צור קמפיין'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default CampaignManagement;
