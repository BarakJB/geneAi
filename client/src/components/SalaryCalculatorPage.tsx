import React, { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  InputNumber,
  Table,
  Tabs,
  Alert,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CalculatorOutlined,
  DollarOutlined,
  BankOutlined,
  SafetyOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import {
  SalaryInput,
  SalaryResult,
  PensionProduct,
  FinanceProduct,
  LifeInsuranceProduct,
  HealthInsuranceProduct,
  AgentAppointment
} from '../types/salaryCalculator';
import {
  calculateSalary,
  formatCurrency,
  formatPercentage,
  COMPANY_RATES,
  DEFAULT_COMPANY_RATES
} from '../utils/salaryCalculator';
import { EXAMPLE_SCENARIOS } from '../utils/salaryCalculatorExamples';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const SalaryCalculatorPage: React.FC = () => {
  const { theme } = useTheme();
  
  // State for all product inputs
  const [pensionProducts, setPensionProducts] = useState<PensionProduct[]>([]);
  const [financeProducts, setFinanceProducts] = useState<FinanceProduct[]>([]);
  const [lifeInsuranceProducts, setLifeInsuranceProducts] = useState<LifeInsuranceProduct[]>([]);
  const [healthInsuranceProducts, setHealthInsuranceProducts] = useState<HealthInsuranceProduct[]>([]);
  const [agentAppointments] = useState<AgentAppointment[]>([]);
  
  // Calculation result
  const [result, setResult] = useState<SalaryResult | null>(null);


  // Add new pension product
  const addPensionProduct = () => {
    const newProduct: PensionProduct = {
      monthlyDeposit: 0,
      managementFeesAmount: 0,
      totalAccumulation: 0,
      companyRates: COMPANY_RATES.harel.pension
    };
    setPensionProducts([...pensionProducts, newProduct]);
  };

  // Update pension product
  const updatePensionProduct = (index: number, field: keyof PensionProduct | 'company', value: any) => {
    const updated = [...pensionProducts];
    if (field === 'monthlyDeposit' || field === 'managementFeesAmount' || field === 'totalAccumulation') {
      updated[index][field] = value || 0;
    } else if (field === 'company') {
      // Update company rates when company is changed
      const companyRates = COMPANY_RATES[value] || DEFAULT_COMPANY_RATES;
      updated[index].companyRates = companyRates.pension;
    }
    setPensionProducts(updated);
  };

  // Remove pension product
  const removePensionProduct = (index: number) => {
    setPensionProducts(pensionProducts.filter((_, i) => i !== index));
  };

  // Add new finance product
  const addFinanceProduct = () => {
    const newProduct: FinanceProduct = {
      totalAccumulation: 0,
      companyRates: COMPANY_RATES.harel.finance
    };
    setFinanceProducts([...financeProducts, newProduct]);
  };

  // Update finance product
  const updateFinanceProduct = (index: number, field: keyof FinanceProduct | 'company', value: any) => {
    const updated = [...financeProducts];
    if (field === 'totalAccumulation') {
      updated[index][field] = value || 0;
    } else if (field === 'company') {
      const companyRates = COMPANY_RATES[value] || DEFAULT_COMPANY_RATES;
      updated[index].companyRates = companyRates.finance;
    }
    setFinanceProducts(updated);
  };

  // Remove finance product
  const removeFinanceProduct = (index: number) => {
    setFinanceProducts(financeProducts.filter((_, i) => i !== index));
  };

  // Add new life insurance product
  const addLifeInsuranceProduct = () => {
    const newProduct: LifeInsuranceProduct = {
      monthlyPremium: 0,
      companyRates: COMPANY_RATES.harel.lifeInsurance
    };
    setLifeInsuranceProducts([...lifeInsuranceProducts, newProduct]);
  };

  // Update life insurance product
  const updateLifeInsuranceProduct = (index: number, field: keyof LifeInsuranceProduct | 'company', value: any) => {
    const updated = [...lifeInsuranceProducts];
    if (field === 'monthlyPremium') {
      updated[index][field] = value || 0;
    } else if (field === 'company') {
      const companyRates = COMPANY_RATES[value] || DEFAULT_COMPANY_RATES;
      updated[index].companyRates = companyRates.lifeInsurance;
    }
    setLifeInsuranceProducts(updated);
  };

  // Remove life insurance product
  const removeLifeInsuranceProduct = (index: number) => {
    setLifeInsuranceProducts(lifeInsuranceProducts.filter((_, i) => i !== index));
  };

  // Add new health insurance product
  const addHealthInsuranceProduct = () => {
    const newProduct: HealthInsuranceProduct = {
      monthlyPremium: 0,
      companyRates: COMPANY_RATES.harel.healthInsurance
    };
    setHealthInsuranceProducts([...healthInsuranceProducts, newProduct]);
  };

  // Update health insurance product
  const updateHealthInsuranceProduct = (index: number, field: keyof HealthInsuranceProduct | 'company', value: any) => {
    const updated = [...healthInsuranceProducts];
    if (field === 'monthlyPremium') {
      updated[index][field] = value || 0;
    } else if (field === 'company') {
      const companyRates = COMPANY_RATES[value] || DEFAULT_COMPANY_RATES;
      updated[index].companyRates = companyRates.healthInsurance;
    }
    setHealthInsuranceProducts(updated);
  };

  // Remove health insurance product
  const removeHealthInsuranceProduct = (index: number) => {
    setHealthInsuranceProducts(healthInsuranceProducts.filter((_, i) => i !== index));
  };


  // Calculate salary
  const handleCalculate = () => {
    const input: SalaryInput = {
      pensionProducts,
      financeProducts,
      lifeInsuranceProducts,
      healthInsuranceProducts,
      agentAppointments
    };

    const calculationResult = calculateSalary(input);
    setResult(calculationResult);
  };


  // Load example scenario
  const loadExample = (scenarioKey: string) => {
    const scenario = EXAMPLE_SCENARIOS[scenarioKey as keyof typeof EXAMPLE_SCENARIOS];
    if (scenario) {
      setPensionProducts(scenario.data.pensionProducts);
      setFinanceProducts(scenario.data.financeProducts);
      setLifeInsuranceProducts(scenario.data.lifeInsuranceProducts);
      setHealthInsuranceProducts(scenario.data.healthInsuranceProducts);
      
      // Calculate immediately after loading example
      const calculationResult = calculateSalary(scenario.data);
      setResult(calculationResult);
    }
  };

  // Clear all data
  const clearAllData = () => {
    setPensionProducts([]);
    setFinanceProducts([]);
    setLifeInsuranceProducts([]);
    setHealthInsuranceProducts([]);
    setResult(null);
  };

  // Get company name from rates
  const getCompanyKeyFromRates = (rates: any, type: 'pension' | 'finance' | 'lifeInsurance' | 'healthInsurance'): string => {
    for (const [key, company] of Object.entries(COMPANY_RATES)) {
      if (JSON.stringify(company[type]) === JSON.stringify(rates)) {
        return key;
      }
    }
    return 'harel'; // default
  };

  const renderPensionProducts = () => (
    <Card 
      title={
        <Space>
          <BankOutlined />
          מוצרים פנסיוניים
        </Space>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addPensionProduct}>
          הוסף מוצר
        </Button>
      }
      style={{ 
        marginBottom: 16,
        background: theme.colors.cardBackground,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {pensionProducts.map((product, index) => (
        <Card key={`pension-${index}-${product.monthlyDeposit}-${product.totalAccumulation}`} size="small" style={{ marginBottom: 8 }}>
          <Row gutter={6} align="middle">
            <Col span={4}>
              <Form.Item label="חברה" style={{ marginBottom: 0 }}>
                <Select
                  value={getCompanyKeyFromRates(product.companyRates, 'pension')}
                  onChange={(value) => updatePensionProduct(index, 'company', value)}
                  style={{ width: '100%' }}
                  size="small"
                >
                  {Object.entries(COMPANY_RATES).map(([key, company]) => (
                    <Option key={key} value={key}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="הפקדה חודשית (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.monthlyDeposit}
                  onChange={(value) => updatePensionProduct(index, 'monthlyDeposit', value)}
                  style={{ width: '100%' }}
                  min={0}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="דמי ניהול שהבאת (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.managementFeesAmount}
                  onChange={(value) => updatePensionProduct(index, 'managementFeesAmount', value)}
                  style={{ width: '100%' }}
                  min={0}
                  max={product.monthlyDeposit}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="צבירה כוללת (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.totalAccumulation}
                  onChange={(value) => updatePensionProduct(index, 'totalAccumulation', value)}
                  style={{ width: '100%' }}
                  min={0}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  היקף: {formatPercentage(product.companyRates.volumeCommission)}
                </Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  נפרעים: {formatPercentage(product.companyRates.ongoingCommission)}
                </Text>
              </Space>
            </Col>
            <Col span={2}>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => removePensionProduct(index)}
                size="small"
              />
            </Col>
          </Row>
        </Card>
      ))}
      {pensionProducts.length === 0 && (
        <Alert message="לא הוספו מוצרים פנסיוניים" type="info" showIcon />
      )}
    </Card>
  );

  const renderFinanceProducts = () => (
    <Card 
      title={
        <Space>
          <DollarOutlined />
          מוצרים פיננסיים
        </Space>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addFinanceProduct}>
          הוסף מוצר
        </Button>
      }
      style={{ 
        marginBottom: 16,
        background: theme.colors.cardBackground,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {financeProducts.map((product, index) => (
        <Card key={`finance-${index}-${product.totalAccumulation}`} size="small" style={{ marginBottom: 8 }}>
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item label="חברה" style={{ marginBottom: 0 }}>
                <Select
                  value={getCompanyKeyFromRates(product.companyRates, 'finance')}
                  onChange={(value) => updateFinanceProduct(index, 'company', value)}
                  style={{ width: '100%' }}
                  size="small"
                >
                  {Object.entries(COMPANY_RATES).map(([key, company]) => (
                    <Option key={key} value={key}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="צבירה שהועברה (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.totalAccumulation}
                  onChange={(value) => updateFinanceProduct(index, 'totalAccumulation', value)}
                  style={{ width: '100%' }}
                  min={0}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  היקף: {formatCurrency(product.companyRates.volumeCommission)} למיליון
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  נפרעים: {formatPercentage(product.companyRates.ongoingCommission)} שנתי
                </Text>
              </Space>
            </Col>
            <Col span={2}>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => removeFinanceProduct(index)}
                size="small"
              />
            </Col>
          </Row>
        </Card>
      ))}
      {financeProducts.length === 0 && (
        <Alert message="לא הוספו מוצרים פיננסיים" type="info" showIcon />
      )}
    </Card>
  );

  const renderLifeInsuranceProducts = () => (
    <Card 
      title={
        <Space>
          <SafetyOutlined />
          ביטוח חיים / משכנתא
        </Space>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addLifeInsuranceProduct}>
          הוסף פוליסה
        </Button>
      }
      style={{ 
        marginBottom: 16,
        background: theme.colors.cardBackground,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {lifeInsuranceProducts.map((product, index) => (
        <Card key={`life-${index}-${product.monthlyPremium}`} size="small" style={{ marginBottom: 8 }}>
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item label="חברה" style={{ marginBottom: 0 }}>
                <Select
                  value={getCompanyKeyFromRates(product.companyRates, 'lifeInsurance')}
                  onChange={(value) => updateLifeInsuranceProduct(index, 'company', value)}
                  style={{ width: '100%' }}
                  size="small"
                >
                  {Object.entries(COMPANY_RATES).map(([key, company]) => (
                    <Option key={key} value={key}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="פרמיה חודשית (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.monthlyPremium}
                  onChange={(value) => updateLifeInsuranceProduct(index, 'monthlyPremium', value)}
                  style={{ width: '100%' }}
                  min={0}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  היקף: {formatPercentage(product.companyRates.volumeCommission)}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  נפרעים: {formatPercentage(product.companyRates.ongoingCommission)}
                </Text>
              </Space>
            </Col>
            <Col span={2}>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => removeLifeInsuranceProduct(index)}
                size="small"
              />
            </Col>
          </Row>
        </Card>
      ))}
      {lifeInsuranceProducts.length === 0 && (
        <Alert message="לא הוספו פוליסות ביטוח חיים" type="info" showIcon />
      )}
    </Card>
  );

  const renderHealthInsuranceProducts = () => (
    <Card 
      title={
        <Space>
          <HeartOutlined />
          ביטוח בריאות
        </Space>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addHealthInsuranceProduct}>
          הוסף פוליסה
        </Button>
      }
      style={{ 
        marginBottom: 16,
        background: theme.colors.cardBackground,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {healthInsuranceProducts.map((product, index) => (
        <Card key={`health-${index}-${product.monthlyPremium}`} size="small" style={{ marginBottom: 8 }}>
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item label="חברה" style={{ marginBottom: 0 }}>
                <Select
                  value={getCompanyKeyFromRates(product.companyRates, 'healthInsurance')}
                  onChange={(value) => updateHealthInsuranceProduct(index, 'company', value)}
                  style={{ width: '100%' }}
                  size="small"
                >
                  {Object.entries(COMPANY_RATES).map(([key, company]) => (
                    <Option key={key} value={key}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="פרמיה חודשית (₪)" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={product.monthlyPremium}
                  onChange={(value) => updateHealthInsuranceProduct(index, 'monthlyPremium', value)}
                  style={{ width: '100%' }}
                  min={0}
                  size="small"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  היקף: {formatPercentage(product.companyRates.volumeCommission)}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  נפרעים: {formatPercentage(product.companyRates.ongoingCommission)}
                </Text>
              </Space>
            </Col>
            <Col span={2}>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => removeHealthInsuranceProduct(index)}
                size="small"
              />
            </Col>
          </Row>
        </Card>
      ))}
      {healthInsuranceProducts.length === 0 && (
        <Alert message="לא הוספו פוליסות ביטוח בריאות" type="info" showIcon />
      )}
    </Card>
  );

  const renderResults = () => {
    if (!result) return null;

    const { income, taxes, grossIncome, netIncome } = result;

    return (
      <Card 
        title={
          <Space>
            <CalculatorOutlined />
            תוצאות החישוב
          </Space>
        }
        style={{ 
          background: theme.colors.cardBackground,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic
              title="הכנסה ברוטו"
              value={grossIncome}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: theme.colors.accent }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="סה״כ ניכויים"
              value={taxes.totalDeductions}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="הכנסה נטו"
              value={netIncome}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#52c41a', fontSize: '1.5em', fontWeight: 'bold' }}
            />
          </Col>
        </Row>

        <Divider />

        {/* Detailed Breakdown */}
        <Tabs defaultActiveKey="income">
          <TabPane tab="פירוט הכנסות" key="income">
            <Table
              dataSource={[
                {
                  key: 'pension',
                  category: 'פנסיוני',
                  volume: income.pension.volumeCommission,
                  ongoing: income.pension.ongoingCommission,
                  accumulation: income.pension.accumulationBonus,
                  total: income.pension.total
                },
                {
                  key: 'finance',
                  category: 'פיננסי',
                  volume: income.finance.volumeCommission,
                  ongoing: income.finance.ongoingCommission,
                  accumulation: income.finance.accumulationBonus,
                  total: income.finance.total
                },
                {
                  key: 'life',
                  category: 'ביטוח חיים',
                  volume: income.lifeInsurance.volumeCommission,
                  ongoing: income.lifeInsurance.ongoingCommission,
                  accumulation: 0,
                  total: income.lifeInsurance.total
                },
                {
                  key: 'health',
                  category: 'ביטוח בריאות',
                  volume: income.healthInsurance.volumeCommission,
                  ongoing: income.healthInsurance.ongoingCommission,
                  accumulation: 0,
                  total: income.healthInsurance.total
                },
                {
                  key: 'appointments',
                  category: 'מינוי סוכן',
                  volume: 0,
                  ongoing: income.agentAppointments.total,
                  accumulation: 0,
                  total: income.agentAppointments.total
                }
              ]}
              columns={[
                { title: 'קטגוריה', dataIndex: 'category', key: 'category' },
                { 
                  title: 'עמלת היקף (חד פעמי)', 
                  dataIndex: 'volume', 
                  key: 'volume',
                  render: (value) => formatCurrency(value)
                },
                { 
                  title: 'נפרעים (חודשי)', 
                  dataIndex: 'ongoing', 
                  key: 'ongoing',
                  render: (value) => formatCurrency(value)
                },
                { 
                  title: 'תגמול צבירה (שנתי)', 
                  dataIndex: 'accumulation', 
                  key: 'accumulation',
                  render: (value) => formatCurrency(value)
                },
                { 
                  title: 'סה״כ', 
                  dataIndex: 'total', 
                  key: 'total',
                  render: (value) => <strong>{formatCurrency(value)}</strong>
                }
              ]}
              pagination={false}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="פירוט ניכויים" key="taxes">
            <Table
              dataSource={[
                {
                  key: 'social',
                  type: 'ביטוח לאומי + בריאות',
                  amount: taxes.socialSecurity,
                  percentage: ((taxes.socialSecurity / grossIncome) * 100).toFixed(1) + '%'
                },
                {
                  key: 'income',
                  type: 'מס הכנסה',
                  amount: taxes.incomeTax,
                  percentage: ((taxes.incomeTax / grossIncome) * 100).toFixed(1) + '%'
                }
              ]}
              columns={[
                { title: 'סוג ניכוי', dataIndex: 'type', key: 'type' },
                { 
                  title: 'סכום', 
                  dataIndex: 'amount', 
                  key: 'amount',
                  render: (value) => formatCurrency(value)
                },
                { title: 'אחוז מברוטו', dataIndex: 'percentage', key: 'percentage' }
              ]}
              pagination={false}
              size="small"
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.primary,
        backgroundAttachment: 'fixed',
        padding: '24px',
        direction: 'rtl',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card
          style={{
            marginBottom: 24,
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 12px 40px ${theme.colors.shadow}`,
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
            מחשבון שכר סוכן ביטוח עצמאי
          </Title>
          <Paragraph style={{ textAlign: 'center', color: theme.colors.textSecondary, marginBottom: 16 }}>
            חשב את ההכנסה החודשית הצפויה שלך כסוכן ביטוח עצמאי על בסיס כל מקורות ההכנסה
          </Paragraph>
          
          <Alert
            message="איך להשתמש במחשבון"
            description={
              <ul style={{ marginBottom: 0, paddingInlineStart: 20 }}>
                <li>טען דוגמה (כל דוגמה כוללת את כל סוגי המוצרים) ומחק מה שלא רלוונטי</li>
                <li>או התחל להוסיף מוצרים - כל מוצר עם החברה שלו</li>
                <li><strong>עמלות היקף</strong> - חד פעמיות (מוצגות כחלק חודשי)</li>
                <li><strong>עמלות נפרעים</strong> - חודשיות קבועות</li>
                <li><strong>תגמול צבירה</strong> - שנתי (מוצג כחלק חודשי)</li>
                <li>התוצאה כוללת חישוב מס הכנסה וביטוח לאומי מעודכן ל-2025</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24, textAlign: 'right' }}
          />
          
          {/* Examples */}
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Form.Item label="טען דוגמה להדגמה">
                <Select
                  placeholder="בחר דוגמה..."
                  onChange={loadExample}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {Object.entries(EXAMPLE_SCENARIOS).map(([key, scenario]) => (
                    <Option key={key} value={key}>
                      {scenario.name} - {scenario.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row justify="center" style={{ marginBottom: 16 }}>
            <Space size="middle">
              <Button
                type="primary"
                size="large"
                icon={<CalculatorOutlined />}
                onClick={handleCalculate}
                style={{
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontWeight: 'bold',
                }}
              >
                חשב שכר
              </Button>
              <Button
                size="large"
                onClick={clearAllData}
                style={{
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                }}
              >
                נקה הכל
              </Button>
            </Space>
          </Row>
        </Card>

        {/* Portfolio Summary */}
        {(pensionProducts.length > 0 || financeProducts.length > 0 || lifeInsuranceProducts.length > 0 || healthInsuranceProducts.length > 0) && (
          <Card
            title="סיכום פורטפוליו"
            style={{
              marginBottom: 24,
              background: theme.colors.cardBackground,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="מוצרים פנסיוניים"
                  value={pensionProducts.length}
                  suffix="מוצרים"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="מוצרים פיננסיים"
                  value={financeProducts.length}
                  suffix="מוצרים"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="פוליסות חיים"
                  value={lifeInsuranceProducts.length}
                  suffix="פוליסות"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="פוליסות בריאות"
                  value={healthInsuranceProducts.length}
                  suffix="פוליסות"
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Product Input Forms */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {renderPensionProducts()}
          </Col>
          <Col span={24}>
            {renderFinanceProducts()}
          </Col>
          <Col span={24}>
            {renderLifeInsuranceProducts()}
          </Col>
          <Col span={24}>
            {renderHealthInsuranceProducts()}
          </Col>
        </Row>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 24 }}>
            {renderResults()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryCalculatorPage;
