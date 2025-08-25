import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,

  Upload,
  Spin,
  Tag,
  List,
  Divider,
  Progress,
  Collapse,
  Space,
  Alert,
  Statistic,
} from 'antd';
import {
  CloudUploadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { UploadProps } from 'antd';
import GoogleAd from './GoogleAd';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;

interface PayslipData {
  grossSalary: number;
  netSalary: number;
  incomeTax: number;
  nationalInsurance: number;
  healthTax: number;
  pensionDeduction: number;
  healthAllowance: number;
  transportAllowance: number;
  totalDeductions: number;
  workHours: number;
  overtimeHours: number;
}

interface DiscrepancyItem {
  type: 'error' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  currentValue: number;
  expectedValue: number;
  difference: number;
  impact: 'high' | 'medium' | 'low';
}

const PayslipAnalyzer: React.FC = () => {
  // Add custom styles for inputs to match CRM
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .payslip-analyzer .ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .payslip-analyzer .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .payslip-analyzer .ant-upload.ant-upload-drag {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        border-radius: 12px !important;
      }

      .payslip-analyzer .ant-upload.ant-upload-drag:hover {
        border-color: rgba(255, 255, 255, 0.8) !important;
      }

      .payslip-analyzer .ant-upload.ant-upload-drag .ant-upload-text {
        color: white !important;
      }

      .payslip-analyzer .ant-upload.ant-upload-drag .ant-upload-hint {
        color: rgba(255, 255, 255, 0.65) !important;
      }

      .payslip-analyzer .ant-form-item-label > label {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const analyzePayslip = async () => {
    setAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate file processing and OCR
    setTimeout(() => {
      // Mock extracted data from payslip
      const extractedData: PayslipData = {
        grossSalary: 15000,
        netSalary: 11500,
        incomeTax: 1800,
        nationalInsurance: 1050,
        healthTax: 465,
        pensionDeduction: 900,
        healthAllowance: 200,
        transportAllowance: 400,
        totalDeductions: 4215,
        workHours: 186,
        overtimeHours: 8,
      };

      setPayslipData(extractedData);
      
      // Calculate expected values and find discrepancies
      const foundDiscrepancies = findDiscrepancies(extractedData);
      setDiscrepancies(foundDiscrepancies);
      
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const findDiscrepancies = (data: PayslipData): DiscrepancyItem[] => {
    const issues: DiscrepancyItem[] = [];

    // Expected tax calculation (simplified)
    const expectedIncomeTax = data.grossSalary * 0.14;
    if (Math.abs(data.incomeTax - expectedIncomeTax) > 50) {
      issues.push({
        type: 'warning',
        category: 'מיסוי',
        title: 'חישוב מס הכנסה',
        description: 'יש הבדל בין מס הכנסה המחושב למס הכנסה בתלוש',
        currentValue: data.incomeTax,
        expectedValue: expectedIncomeTax,
        difference: data.incomeTax - expectedIncomeTax,
        impact: 'medium',
      });
    }

    // National Insurance calculation
    const expectedNationalInsurance = Math.min(data.grossSalary * 0.07, 2000);
    if (Math.abs(data.nationalInsurance - expectedNationalInsurance) > 50) {
      issues.push({
        type: 'error',
        category: 'ביטוח לאומי',
        title: 'חישוב ביטוח לאומי',
        description: 'יש שגיאה בחישוב הביטוח הלאומי',
        currentValue: data.nationalInsurance,
        expectedValue: expectedNationalInsurance,
        difference: data.nationalInsurance - expectedNationalInsurance,
        impact: 'high',
      });
    }

    // Health tax calculation
    const expectedHealthTax = data.grossSalary * 0.031;
    if (Math.abs(data.healthTax - expectedHealthTax) > 30) {
      issues.push({
        type: 'info',
        category: 'מס בריאות',
        title: 'חישוב מס בריאות',
        description: 'הבדל קל במס בריאות',
        currentValue: data.healthTax,
        expectedValue: expectedHealthTax,
        difference: data.healthTax - expectedHealthTax,
        impact: 'low',
      });
    }

    return issues;
  };

  const uploadProps: UploadProps = {
    name: 'payslip',
    multiple: false,
    accept: '.pdf,.jpg,.jpeg,.png',
    beforeUpload: (file) => {
      setUploadedFile(file);
      analyzePayslip();
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setUploadedFile(null);
      setPayslipData(null);
      setDiscrepancies([]);
      setAnalysisComplete(false);
    },
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDiscrepancyColor = (type: string) => {
    switch (type) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'info': return '#1890ff';
      default: return '#52c41a';
    }
  };

  const getDiscrepancyIcon = (type: string) => {
    switch (type) {
      case 'error': return <ExclamationCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'info': return <InfoCircleOutlined />;
      default: return <CheckCircleOutlined />;
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    minHeight: 'calc(100vh - 140px)',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    marginBottom: '24px',
  };

  return (
    <div style={containerStyle} className="payslip-analyzer">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        {/* Header Card */}
        <Card 
          style={cardStyle}
          bodyStyle={{ padding: '32px', textAlign: 'center', direction: 'rtl' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <CalculatorOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
            </motion.div>
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              מנתח תלושי שכר
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
              בדיקה אוטומטית של תלושי שכר ואיתור שגיאות בחישובים
            </Text>
          </Space>
        </Card>

        {/* Upload Card */}
        <Card 
          style={cardStyle}
          title={
            <Space>
              <CloudUploadOutlined style={{ color: '#1890ff' }} />
              <span style={{ color: 'white' }}>העלאת תלוש שכר</span>
            </Space>
          }
          headStyle={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            direction: 'rtl',
          }}
          bodyStyle={{ padding: '32px', direction: 'rtl' }}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </p>
            <p style={{ fontSize: '18px', color: 'white' }}>
              גרור תלוש שכר לכאן או לחץ להעלאה
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              תמיכה בקבצי PDF, JPG, PNG
            </p>
          </Dragger>

                {uploadedFile && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Tag 
                color="processing" 
                style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '12px' }}
              >
                {uploadedFile.name}
              </Tag>
            </div>
          )}
        </Card>

        {/* Analysis Loading */}
                {analyzing && (
          <Card 
            style={cardStyle}
            bodyStyle={{ padding: '32px', textAlign: 'center', direction: 'rtl' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Spin size="large" />
              <Title level={3} style={{ color: 'white' }}>
                מנתח תלוש שכר...
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                מעבד את הקובץ ובודק חישובים
              </Text>
              <Progress percent={Math.random() * 100} showInfo={false} strokeColor="#1890ff" />
            </Space>
          </Card>
      )}

      {/* Analysis Results */}
      {analysisComplete && payslipData && (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <Card 
              style={cardStyle}
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span style={{ color: 'white' }}>תוצאות הניתוח</span>
                </Space>
              }
              headStyle={{
                background: 'transparent',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                direction: 'rtl',
              }}
              bodyStyle={{ padding: '32px', direction: 'rtl' }}
            >
              {/* Summary Statistics */}
              <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%)',
                      border: '1px solid rgba(24, 144, 255, 0.3)',
                      borderRadius: '12px',
                    }}
                    bodyStyle={{ padding: '24px', textAlign: 'center' }}
                  >
                    <Statistic
                      title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>שכר ברוטו</Text>}
                      value={payslipData.grossSalary}
                      formatter={(value) => formatCurrency(Number(value))}
                      valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 77, 79, 0.1) 0%, rgba(255, 77, 79, 0.05) 100%)',
                      border: '1px solid rgba(255, 77, 79, 0.3)',
                      borderRadius: '12px',
                    }}
                    bodyStyle={{ padding: '24px', textAlign: 'center' }}
                  >
                    <Statistic
                      title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>סך ניכויים</Text>}
                      value={payslipData.totalDeductions}
                      formatter={(value) => formatCurrency(Number(value))}
                      valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.05) 100%)',
                      border: '1px solid rgba(82, 196, 26, 0.3)',
                      borderRadius: '12px',
                    }}
                    bodyStyle={{ padding: '24px', textAlign: 'center' }}
                  >
                    <Statistic
                      title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>שכר נטו</Text>}
                      value={payslipData.netSalary}
                      formatter={(value) => formatCurrency(Number(value))}
                      valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }} />

            {/* Discrepancies */}
              {discrepancies.length > 0 ? (
                <div>
                  <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                    🔍 בדיקות שנמצאו
                  </Title>
                  <List
                    dataSource={discrepancies}
                    renderItem={(item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <List.Item style={{ padding: '16px 0' }}>
                          <Alert
                            type={item.type as 'success' | 'info' | 'warning' | 'error'}
                            showIcon
                            icon={getDiscrepancyIcon(item.type)}
                            style={{ 
                              width: '100%',
                              borderRadius: '12px',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            message={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <Text strong style={{ fontSize: '16px' }}>{item.title}</Text>
                                  <br />
                                  <Text style={{ fontSize: '14px' }}>{item.description}</Text>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                  <Text style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>נוכחי: {formatCurrency(item.currentValue)}</Text>
                                  <br />
                                  <Text style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>צפוי: {formatCurrency(item.expectedValue)}</Text>
                                  <br />
                                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: getDiscrepancyColor(item.type) }}>
                                    הפרש: {formatCurrency(Math.abs(item.difference))}
                                  </Text>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      </motion.div>
                    )}
                  />
                </div>
              ) : (
                <Alert
                  type="success"
                  showIcon
                  message="כל החישובים נראים תקינים!"
                  description="לא נמצאו שגיאות או חריגות בתלוש השכר"
                  style={{ 
                    borderRadius: '12px',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              )}

              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '32px 0' }} />

              {/* Detailed Breakdown */}
              <Collapse
                ghost
                style={{ 
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px'
                }}
              >
                <Panel 
                  header={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                        פרוט מפורט של התלוש
                      </Text>
                    </Space>
                  }
                  key="details"
                  style={{ direction: 'rtl' }}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card
                        title="הכנסות"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                        headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
                        bodyStyle={{ direction: 'rtl' }}
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>שכר בסיס:</Text>
                            <Text style={{ color: 'white', fontWeight: 600 }}>
                              {formatCurrency(payslipData.grossSalary)}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>תוספת בריאות:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(payslipData.healthAllowance)}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>דמי נסיעה:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(payslipData.transportAllowance)}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Card
                        title="ניכויים"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                        }}
                        headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
                        bodyStyle={{ direction: 'rtl' }}
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>מס הכנסה:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(payslipData.incomeTax)}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>ביטוח לאומי:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(payslipData.nationalInsurance)}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>מס בריאות:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(payslipData.healthTax)}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>פנסיה:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(payslipData.pensionDeduction)}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Card>
        </motion.div>
      )}

      {/* פרסומת בתחתית */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <GoogleAd 
          adSlot="5544332211"
          adFormat="horizontal"
          style={{ marginTop: '32px' }}
        />
      </motion.div>
      </motion.div>
    </div>
  );
};

export default PayslipAnalyzer;