import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Tabs,
  Divider,
  Alert,
  Form,
  Select,
  Tag,
  List,
  Space,
  Typography,
  DatePicker,
  InputNumber,
  Upload as AntUpload,
  message,
} from 'antd';
import {
  UserAddOutlined,
  UploadOutlined,
  SaveOutlined,
  ClearOutlined,

  CloudUploadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dateOfBirth: string;
  idNumber: string;
  occupation: string;
  monthlyIncome: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  hasChildren: boolean;
  numberOfChildren: number;
  notes: string;
  tags: string[];
  documents: FileList | null;
  insuranceTypes: string[];
}

interface FileUpload {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

const AddClient: React.FC = () => {
  const [form] = Form.useForm();
  const [client, setClient] = useState<Client>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    dateOfBirth: '',
    idNumber: '',
    occupation: '',
    monthlyIncome: 0,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: 0,
    notes: '',
    tags: [],
    documents: null,
    insuranceTypes: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [newTag, setNewTag] = useState('');

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

  const handleInputChange = (field: keyof Client, value: string | number | boolean | string[]) => {
    setClient(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !client.tags.includes(newTag.trim())) {
      setClient(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setClient(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      const newFile: FileUpload = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      };
      setUploadedFiles(prev => [...prev, newFile]);
      return false; // Prevent automatic upload
    },
    onRemove: (file) => {
      setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
    },
  };

  const validateClient = (clientData: Client): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (!clientData.firstName.trim()) {
      validationErrors.firstName = 'שם פרטי נדרש';
    }

    if (!clientData.lastName.trim()) {
      validationErrors.lastName = 'שם משפחה נדרש';
    }

    if (!clientData.email.trim()) {
      validationErrors.email = 'אימייל נדרש';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      validationErrors.email = 'פורמט אימייל לא תקין';
    }

    if (!clientData.phone.trim()) {
      validationErrors.phone = 'מספר טלפון נדרש';
    } else if (!/^[0-9-+\s()]+$/.test(clientData.phone)) {
      validationErrors.phone = 'מספר טלפון לא תקין';
    }

    if (!clientData.idNumber.trim()) {
      validationErrors.idNumber = 'מספר ת.ז נדרש';
    } else if (!/^\d{9}$/.test(clientData.idNumber)) {
      validationErrors.idNumber = 'מספר ת.ז חייב להכיל 9 ספרות';
    }

    return validationErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateClient(client);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      message.error('נא תקן את השגיאות בטופס');
      return;
    }

    try {
      // Here you would typically send the data to your API
      console.log('Saving client:', client);
      console.log('Uploaded files:', uploadedFiles);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      message.success('הלקוח נשמר בהצלחה!');
      
      // Reset form after successful save
      setTimeout(() => {
        handleClear();
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving client:', error);
      message.error('שגיאה בשמירת הלקוח');
    }
  };

  const handleClear = () => {
        setClient({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          dateOfBirth: '',
          idNumber: '',
          occupation: '',
          monthlyIncome: 0,
      maritalStatus: 'single',
      hasChildren: false,
      numberOfChildren: 0,
          notes: '',
          tags: [],
      documents: null,
      insuranceTypes: [],
    });
    setUploadedFiles([]);
    setErrors({});
    setActiveTab('1');
    form.resetFields();
  };

  const maritalStatusOptions = [
    { value: 'single', label: 'רווק/ה' },
    { value: 'married', label: 'נשוי/ה' },
    { value: 'divorced', label: 'גרוש/ה' },
    { value: 'widowed', label: 'אלמן/ה' },
  ];

  const insuranceTypeOptions = [
    { value: 'life', label: 'ביטוח חיים' },
    { value: 'health', label: 'ביטוח בריאות' },
    { value: 'car', label: 'ביטוח רכב' },
    { value: 'home', label: 'ביטוח דירה' },
    { value: 'travel', label: 'ביטוח נסיעות' },
    { value: 'disability', label: 'ביטוח אובדן כושר עבודה' },
  ];

  const occupationOptions = [
    'רופא', 'עורך דין', 'מהנדס', 'מורה', 'אחות', 'מנהל', 'עובד משרד', 'טכנאי',
    'מכירות', 'שירות לקוחות', 'פיתוח תוכנה', 'שיווק', 'כספים וחשבונאות', 'אחר'
  ];

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
                <UserAddOutlined style={{ color: '#52c41a', fontSize: '24px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  הוספת לקוח חדש
                </Title>
              </Space>
            </div>
          }
          headStyle={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            textAlign: 'center',
            direction: 'rtl',
          }}
          bodyStyle={{ padding: '32px', direction: 'rtl' }}
        >
        <AnimatePresence>
          {success && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ marginBottom: '24px' }}
            >
              <Alert 
                  message="הלקוח נשמר בהצלחה!"
                  type="success"
                  showIcon
                  style={{
                    borderRadius: '12px',
                    textAlign: 'right',
                  direction: 'rtl',
                }}
                />
            </motion.div>
          )}
        </AnimatePresence>

          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ direction: 'rtl' }}
          >
              <Tabs 
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              size="large"
              style={{
                marginBottom: '32px',
              }}
              items={[
                {
                  key: '1',
                  label: (
                    <Space>
                      <UserAddOutlined />
                      <span>פרטים אישיים</span>
                    </Space>
                  ),
                  children: (
                <motion.div
                      initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                      <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="שם פרטי"
                            validateStatus={errors.firstName ? 'error' : ''}
                            help={errors.firstName}
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="הזן שם פרטי"
                        value={client.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="שם משפחה"
                            validateStatus={errors.lastName ? 'error' : ''}
                            help={errors.lastName}
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="הזן שם משפחה"
                        value={client.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="מספר ת.ז"
                            validateStatus={errors.idNumber ? 'error' : ''}
                            help={errors.idNumber}
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="123456789"
                              value={client.idNumber}
                              onChange={(e) => handleInputChange('idNumber', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                              maxLength={9}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="תאריך לידה"
                            style={{ textAlign: 'right' }}
                          >
                            <DatePicker
                              placeholder="בחר תאריך"
                              style={{ width: '100%', borderRadius: '8px' }}
                              onChange={(date, dateString) => handleInputChange('dateOfBirth', dateString)}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="אימייל"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="example@email.com"
                        value={client.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="טלפון"
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone}
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="050-1234567"
                        value={client.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24}>
                          <Form.Item
                        label="כתובת"
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="הזן כתובת מלאה"
                        value={client.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="עיר"
                            style={{ textAlign: 'right' }}
                          >
                            <Input
                              placeholder="הזן עיר"
                        value={client.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="מקצוע"
                            style={{ textAlign: 'right' }}
                          >
                            <Select
                              placeholder="בחר מקצוע"
                        value={client.occupation}
                              onChange={(value) => handleInputChange('occupation', value)}
                              style={{ borderRadius: '8px' }}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                              }
                            >
                              {occupationOptions.map((occupation) => (
                                <Select.Option key={occupation} value={occupation}>
                                  {occupation}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </motion.div>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <Space>
                      <EditOutlined />
                      <span>פרטים נוספים</span>
                    </Space>
                  ),
                  children: (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="מצב משפחתי"
                            style={{ textAlign: 'right' }}
                          >
                            <Select
                              placeholder="בחר מצב משפחתי"
                              value={client.maritalStatus}
                              onChange={(value) => handleInputChange('maritalStatus', value)}
                              style={{ borderRadius: '8px' }}
                            >
                              {maritalStatusOptions.map((status) => (
                                <Select.Option key={status.value} value={status.value}>
                                  {status.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                        label="הכנסה חודשית"
                            style={{ textAlign: 'right' }}
                          >
                            <InputNumber
                              placeholder="0"
                        value={client.monthlyIncome}
                              onChange={(value) => handleInputChange('monthlyIncome', value || 0)}
                              style={{ width: '100%', borderRadius: '8px' }}
                              formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => value!.replace(/₪\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="מספר ילדים"
                            style={{ textAlign: 'right' }}
                          >
                            <InputNumber
                              placeholder="0"
                              value={client.numberOfChildren}
                              onChange={(value) => {
                                handleInputChange('numberOfChildren', value || 0);
                                handleInputChange('hasChildren', (value || 0) > 0);
                              }}
                              min={0}
                              max={10}
                              style={{ width: '100%', borderRadius: '8px' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="סוגי ביטוח מעניינים"
                            style={{ textAlign: 'right' }}
                          >
                        <Select
                              mode="multiple"
                              placeholder="בחר סוגי ביטוח"
                              value={client.insuranceTypes}
                              onChange={(value) => handleInputChange('insuranceTypes', value)}
                              style={{ borderRadius: '8px' }}
                            >
                              {insuranceTypeOptions.map((type) => (
                                <Select.Option key={type.value} value={type.value}>
                                  {type.label}
                                </Select.Option>
                              ))}
                        </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24}>
                          <Form.Item
                            label="תגיות"
                            style={{ textAlign: 'right' }}
                          >
                            <Row gutter={[8, 8]}>
                              <Col flex="auto">
                                <Input
                                  placeholder="הוסף תגית"
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  onPressEnter={addTag}
                                  style={{ borderRadius: '8px', textAlign: 'right' }}
                                />
                              </Col>
                              <Col>
                        <Button 
                                  type="primary"
                          onClick={addTag}
                                  style={{ borderRadius: '8px' }}
                        >
                          הוסף
                        </Button>
                              </Col>
                            </Row>
                            <div style={{ marginTop: '16px' }}>
                              {client.tags.map((tag) => (
                                <Tag
                                  key={tag}
                                  closable
                                  onClose={() => removeTag(tag)}
                                  style={{ 
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                  }}
                                >
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          </Form.Item>
                        </Col>

                        <Col xs={24}>
                          <Form.Item
                        label="הערות"
                            style={{ textAlign: 'right' }}
                          >
                            <TextArea
                        rows={4}
                              placeholder="הערות נוספות על הלקוח..."
                        value={client.notes}
                              onChange={(e) => handleInputChange('notes', e.target.value)}
                              style={{ borderRadius: '8px', textAlign: 'right' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                </motion.div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <Space>
                      <UploadOutlined />
                      <span>מסמכים</span>
                    </Space>
                  ),
                  children: (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                      <div style={{ textAlign: 'center', direction: 'rtl' }}>
                        <AntUpload.Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                          </p>
                          <p style={{ fontSize: '18px', color: 'white' }}>
                            גרור קבצים לכאן או לחץ להעלאה
                          </p>
                          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            תמיכה בקבצי PDF, DOC, DOCX, JPG, PNG
                          </p>
                        </AntUpload.Dragger>

                        {uploadedFiles.length > 0 && (
                          <div style={{ marginTop: '24px' }}>
                            <Title level={4} style={{ color: 'white', textAlign: 'right' }}>
                              קבצים שהועלו:
                            </Title>
                            <List
                              dataSource={uploadedFiles}
                              renderItem={(file) => (
                                <List.Item>
                                  <List.Item.Meta
                                    title={<Text style={{ color: 'white' }}>{file.name}</Text>}
                                    description={
                                      <Text type="secondary">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </Text>
                                    }
                                  />
                                </List.Item>
                              )}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                padding: '16px',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ),
                },
              ]}
            />
          </Form>

          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }} />

          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                  type="primary"
                  size="large"
                  block
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  שמור לקוח
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
          </Card>
        </motion.div>
    </div>
  );
};

export default AddClient;