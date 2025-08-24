import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Divider,
  Form,
  Select,
  Switch,
  InputNumber,
  Space,
  Alert,
  Collapse,
  Statistic,
} from 'antd';
import {
  DollarOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  CarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface SalaryParams {
  employeeType: string;
  baseSalary: number;
  workHours: number;
  overtimeHours: number;
  weekendHours: number;
  holidayHours: number;
  allowances: {
    health: number;
    transport: number;
    food: number;
    seniority: number;
    education: number;
  };
  seniorityYears: number;
  isPublicSector: boolean;
  standbyDays: number;
  standbyRate: number;
  standbyCalculationType: 'fixed' | 'percentage';
  standbyPercentage: number;
  hasCarAllowance: boolean;
  carAllowanceAmount: number;
  hasPhoneAllowance: boolean;
  phoneAllowanceAmount: number;
  // שדות מתקדמים לחישוב מדויק
  creditPoints: number;
  taxCreditPoints: number;
  pensionContribution: {
    employee: number;
    employer: number;
    employerCompensation: number;
  };
  studyFundContribution: {
    employee: number;
    employer: number;
  };
  disabilityInsurance: number;
  unionDues: number;
  professionalTax: number;
  hasTravelExpenses: boolean;
  travelExpensesAmount: number;
  hasChildAllowances: boolean;
  numberOfChildren: number;
  childAllowancePerChild: number;
}

interface SalaryResult {
  grossSalary: number;
  overtimePay: number;
  weekendPay: number;
  holidayPay: number;
  allowancesTotal: number;
  standbyPay: number;
  carAllowance: number;
  phoneAllowance: number;
  travelExpenses: number;
  childAllowances: number;
  totalGross: number;
  incomeTax: number;
  nationalInsurance: number;
  healthTax: number;
  pensionDeduction: number;
  studyFundDeduction: number;
  disabilityInsurance: number;
  unionDues: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
  taxCredits: number;
  effectiveTaxRate: number;
}

const SalaryCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<SalaryParams>({
    employeeType: 'regular',
    baseSalary: 12000,
    workHours: 186, // חודשיים
    overtimeHours: 0,
    weekendHours: 0,
    holidayHours: 0,
    allowances: {
      health: 0,
      transport: 0,
      food: 0,
      seniority: 0,
      education: 0,
    },
    seniorityYears: 1,
    isPublicSector: false,
    standbyDays: 0,
    standbyRate: 150,
    standbyCalculationType: 'fixed',
    standbyPercentage: 150,
    hasCarAllowance: false,
    carAllowanceAmount: 2000,
    hasPhoneAllowance: false,
    phoneAllowanceAmount: 200,
    // שדות מתקדמים חדשים
    creditPoints: 2.25,
    taxCreditPoints: 2.25,
    pensionContribution: {
      employee: 6.0,
      employer: 6.5,
      employerCompensation: 6.0,
    },
    studyFundContribution: {
      employee: 2.5,
      employer: 2.5,
    },
    disabilityInsurance: 0.0,
    unionDues: 0.0,
    professionalTax: 0.0,
    hasTravelExpenses: false,
    travelExpensesAmount: 0,
    hasChildAllowances: false,
    numberOfChildren: 0,
    childAllowancePerChild: 140,
  });

  const [result, setResult] = useState<SalaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Utility functions for calculations
  const calculateHealthAllowance = React.useCallback(() => {
    const healthAllowanceRates = {
      single: { publicSector: 300, privateSector: 250 },
      married: { publicSector: 450, privateSector: 380 },
      withChildren: { publicSector: 600, privateSector: 500 }
    };
    
    const category = params.seniorityYears >= 5 ? 'withChildren' : 
                     params.seniorityYears >= 2 ? 'married' : 'single';
    const sector = params.isPublicSector ? 'publicSector' : 'privateSector';
    
    return healthAllowanceRates[category][sector];
  }, [params.seniorityYears, params.isPublicSector]);

  React.useEffect(() => {
    const calculatedHealth = calculateHealthAllowance();
    if (params.allowances.health !== calculatedHealth) {
      setParams(prev => ({
        ...prev,
        allowances: { ...prev.allowances, health: calculatedHealth }
      }));
    }
  }, [calculateHealthAllowance, params.allowances.health]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSalary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const hourlyRate = params.baseSalary / params.workHours;
      const overtimeRate = hourlyRate * 1.25;
      const weekendRate = hourlyRate * 1.5;
      const holidayRate = hourlyRate * 2;

      const grossSalary = params.baseSalary;
      const overtimePay = params.overtimeHours * overtimeRate;
      const weekendPay = params.weekendHours * weekendRate;
      const holidayPay = params.holidayHours * holidayRate;

      const allowancesTotal = Object.values(params.allowances).reduce((sum, val) => sum + val, 0);

      let standbyPay = 0;
      if (params.standbyDays > 0) {
        if (params.standbyCalculationType === 'fixed') {
          standbyPay = params.standbyDays * params.standbyRate;
        } else {
          standbyPay = (params.baseSalary * (params.standbyPercentage / 100) / 30) * params.standbyDays;
        }
      }

      const carAllowance = params.hasCarAllowance ? params.carAllowanceAmount : 0;
      const phoneAllowance = params.hasPhoneAllowance ? params.phoneAllowanceAmount : 0;
      const travelExpenses = params.hasTravelExpenses ? params.travelExpensesAmount : 0;
      const childAllowances = params.hasChildAllowances ? params.numberOfChildren * params.childAllowancePerChild : 0;

      const totalGross = grossSalary + overtimePay + weekendPay + holidayPay + allowancesTotal + standbyPay + carAllowance + phoneAllowance + travelExpenses + childAllowances;

      // חישוב נקודות זכות מס
      const taxCredits = params.taxCreditPoints * 220; // נקודת זכות = 220 ש"ח בשנת 2024

      // חישובי מס מתקדמים
      let incomeTax = 0;
      const monthlyTaxableIncome = totalGross * 12; // הכנסה שנתית
      
      // סולם מס הכנסה מפורט (2024)
      if (monthlyTaxableIncome <= 81240) {
        incomeTax = monthlyTaxableIncome * 0.10;
      } else if (monthlyTaxableIncome <= 116760) {
        incomeTax = 81240 * 0.10 + (monthlyTaxableIncome - 81240) * 0.14;
      } else if (monthlyTaxableIncome <= 187800) {
        incomeTax = 81240 * 0.10 + 35520 * 0.14 + (monthlyTaxableIncome - 116760) * 0.20;
      } else if (monthlyTaxableIncome <= 241680) {
        incomeTax = 81240 * 0.10 + 35520 * 0.14 + 71040 * 0.20 + (monthlyTaxableIncome - 187800) * 0.31;
      } else if (monthlyTaxableIncome <= 498600) {
        incomeTax = 81240 * 0.10 + 35520 * 0.14 + 71040 * 0.20 + 53880 * 0.31 + (monthlyTaxableIncome - 241680) * 0.35;
      } else {
        incomeTax = 81240 * 0.10 + 35520 * 0.14 + 71040 * 0.20 + 53880 * 0.31 + 256920 * 0.35 + (monthlyTaxableIncome - 498600) * 0.47;
      }

      // הפחתת נקודות זכות
      incomeTax = Math.max(0, (incomeTax - taxCredits * 12) / 12); // חזרה לחישוב חודשי

      const nationalInsurance = Math.min(totalGross * 0.04, 2500); // ביטוח לאומי מוגבל
      const healthTax = totalGross * 0.031;
      
      // הפרשות פנסיה מדויקות
      const pensionDeduction = totalGross * (params.pensionContribution.employee / 100);
      const studyFundDeduction = totalGross * (params.studyFundContribution.employee / 100);
      
      // ניכויים נוספים
      const disabilityInsurance = params.disabilityInsurance;
      const unionDues = params.unionDues;
      const professionalTax = params.professionalTax;

      const totalDeductions = incomeTax + nationalInsurance + healthTax + pensionDeduction + studyFundDeduction + disabilityInsurance + unionDues + professionalTax;
      const netSalary = totalGross - totalDeductions;
      const effectiveTaxRate = (totalDeductions / totalGross) * 100;

      const calculatedResult: SalaryResult = {
        grossSalary,
        overtimePay,
        weekendPay,
        holidayPay,
        allowancesTotal,
        standbyPay,
        carAllowance,
        phoneAllowance,
        travelExpenses,
        childAllowances,
        totalGross,
        incomeTax,
        nationalInsurance,
        healthTax,
        pensionDeduction,
        studyFundDeduction,
        disabilityInsurance,
        unionDues,
        professionalTax,
        totalDeductions,
        netSalary,
        taxCredits,
        effectiveTaxRate,
      };

      setResult(calculatedResult);
            setShowResults(true);
      
    } catch (err) {
      setError('שגיאה בחישוב השכר');
      console.error('Salary calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setParams(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setParams(prev => ({
              ...prev,
      [field]: value as any,
      }));
    }
  };

  const resetCalculator = () => {
    setParams({
      employeeType: 'regular',
      baseSalary: 12000,
      workHours: 186,
      overtimeHours: 0,
      weekendHours: 0,
      holidayHours: 0,
      allowances: {
        health: 0,
        transport: 0,
        food: 0,
        seniority: 0,
        education: 0,
      },
      seniorityYears: 1,
      isPublicSector: false,
      standbyDays: 0,
      standbyRate: 150,
      standbyCalculationType: 'fixed',
      standbyPercentage: 150,
      hasCarAllowance: false,
      carAllowanceAmount: 2000,
      hasPhoneAllowance: false,
      phoneAllowanceAmount: 200,
      // שדות מתקדמים
      creditPoints: 2.25,
      taxCreditPoints: 2.25,
      pensionContribution: {
        employee: 6.0,
        employer: 6.5,
        employerCompensation: 6.0,
      },
      studyFundContribution: {
        employee: 2.5,
        employer: 2.5,
      },
      disabilityInsurance: 0.0,
      unionDues: 0.0,
      professionalTax: 0.0,
      hasTravelExpenses: false,
      travelExpensesAmount: 0,
      hasChildAllowances: false,
      numberOfChildren: 0,
      childAllowancePerChild: 140,
    });
    setResult(null);
    setShowResults(false);
    setError(null);
    form.resetFields();
  };

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
  };

  return (
    <div style={containerStyle}>
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
              <CalculatorOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </motion.div>
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              מחשבון שכר מתקדם
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
              חישוב מדויק של שכר ברוטו ונטו כולל תוספות וניכויים
            </Text>
          </Space>
        </Card>

        {error && (
          <Alert
            message="שגיאה בחישוב"
            description={error}
            type="error"
            showIcon
            style={{ 
              marginBottom: '24px',
              borderRadius: '12px',
              textAlign: 'right',
              direction: 'rtl'
            }}
          />
        )}

        {/* Main Form */}
        <Card 
          style={cardStyle}
          title={
            <Space>
              <UserOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: 'white' }}>פרטי העובד</span>
            </Space>
          }
          headStyle={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                direction: 'rtl',
          }}
          bodyStyle={{ padding: '32px', direction: 'rtl' }}
        >
          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ direction: 'rtl' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label="סוג עובד" 
                  style={{ color: 'white' }}
                >
                        <Select
                          value={params.employeeType}
                    onChange={(value) => handleInputChange('employeeType', value)}
                    style={{ borderRadius: '8px' }}
                  >
                    <Select.Option value="regular">עובד קבוע</Select.Option>
                    <Select.Option value="contractor">קבלן</Select.Option>
                    <Select.Option value="partTime">עובד חלקי</Select.Option>
                    <Select.Option value="hourly">עובד שעתי</Select.Option>
                        </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="שכר בסיס חודשי">
                  <InputNumber
                        value={params.baseSalary}
                    onChange={(value) => handleInputChange('baseSalary', value || 0)}
                    style={{ width: '100%', borderRadius: '8px' }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                    placeholder="הזן שכר בסיס"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="שנות ותק">
                  <InputNumber
                    value={params.seniorityYears}
                    onChange={(value) => handleInputChange('seniorityYears', value || 1)}
                    min={0}
                    max={50}
                    style={{ width: '100%', borderRadius: '8px' }}
                    placeholder="הזן שנות ותק"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="מגזר">
                  <Space>
                    <Switch
                      checked={params.isPublicSector}
                      onChange={(checked) => handleInputChange('isPublicSector', checked)}
                    />
                    <Text style={{ color: 'white' }}>
                      {params.isPublicSector ? 'מגזר ציבורי' : 'מגזר פרטי'}
                    </Text>
                  </Space>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '32px 0' }} />

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
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                      שעות עבודה ותוספות זמן
                    </Text>
                  </Space>
                }
                key="hours"
                style={{ direction: 'rtl' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item label="שעות עבודה חודשיות">
                      <InputNumber
                        value={params.workHours}
                        onChange={(value) => handleInputChange('workHours', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="186"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item label="שעות נוספות">
                      <InputNumber
                        value={params.overtimeHours}
                        onChange={(value) => handleInputChange('overtimeHours', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item label="שעות סוף שבוע">
                      <InputNumber
                        value={params.weekendHours}
                        onChange={(value) => handleInputChange('weekendHours', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item label="שעות חג">
                      <InputNumber
                        value={params.holidayHours}
                        onChange={(value) => handleInputChange('holidayHours', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>

              <Panel 
                header={
                  <Space>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                      תוספות ונדבות
                    </Text>
                  </Space>
                }
                key="allowances"
                style={{ direction: 'rtl' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item 
                      label="תוספת בריאות"
                      help={`לפי ותק: ${params.seniorityYears} שנים, מגזר: ${params.isPublicSector ? 'ציבורי' : 'פרטי'}`}
                    >
                      <InputNumber
                        value={params.allowances.health}
                        onChange={(value) => handleInputChange('allowances.health', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="דמי נסיעה">
                      <InputNumber
                        value={params.allowances.transport}
                        onChange={(value) => handleInputChange('allowances.transport', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="תוספת אוכל">
                      <InputNumber
                        value={params.allowances.food}
                        onChange={(value) => handleInputChange('allowances.food', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="תוספת ותק">
                      <InputNumber
                        value={params.allowances.seniority}
                        onChange={(value) => handleInputChange('allowances.seniority', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="תוספת השכלה">
                      <InputNumber
                        value={params.allowances.education}
                        onChange={(value) => handleInputChange('allowances.education', value || 0)}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>

              <Panel 
                header={
                  <Space>
                    <CarOutlined style={{ color: '#722ed1' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                      תוספות נוספות
                    </Text>
                  </Space>
                }
                key="extras"
                style={{ direction: 'rtl' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      <Space>
                          <Switch
                            checked={params.hasCarAllowance}
                          onChange={(checked) => handleInputChange('hasCarAllowance', checked)}
                        />
                        <Text style={{ color: 'white' }}>תוספת רכב</Text>
                      </Space>
                    </Form.Item>
                      {params.hasCarAllowance && (
                      <Form.Item label="סכום תוספת רכב">
                        <InputNumber
                          value={params.carAllowanceAmount}
                          onChange={(value) => handleInputChange('carAllowanceAmount', value || 0)}
                          style={{ width: '100%', borderRadius: '8px' }}
                          formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        />
                      </Form.Item>
                    )}
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      <Space>
                          <Switch
                            checked={params.hasPhoneAllowance}
                          onChange={(checked) => handleInputChange('hasPhoneAllowance', checked)}
                        />
                        <Text style={{ color: 'white' }}>תוספת טלפון</Text>
                      </Space>
                    </Form.Item>
                      {params.hasPhoneAllowance && (
                      <Form.Item label="סכום תוספת טלפון">
                        <InputNumber
                          value={params.phoneAllowanceAmount}
                          onChange={(value) => handleInputChange('phoneAllowanceAmount', value || 0)}
                          style={{ width: '100%', borderRadius: '8px' }}
                          formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        />
                      </Form.Item>
                    )}
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      <Space>
                        <Switch
                          checked={params.hasTravelExpenses}
                          onChange={(checked) => handleInputChange('hasTravelExpenses', checked)}
                        />
                        <Text style={{ color: 'white' }}>הוצאות נסיעה</Text>
                      </Space>
                    </Form.Item>
                    {params.hasTravelExpenses && (
                      <Form.Item label="סכום הוצאות נסיעה">
                        <InputNumber
                          value={params.travelExpensesAmount}
                          onChange={(value) => handleInputChange('travelExpensesAmount', value || 0)}
                          style={{ width: '100%', borderRadius: '8px' }}
                          formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                        />
                      </Form.Item>
                    )}
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      <Space>
                        <Switch
                          checked={params.hasChildAllowances}
                          onChange={(checked) => handleInputChange('hasChildAllowances', checked)}
                        />
                        <Text style={{ color: 'white' }}>תוספת ילדים</Text>
                      </Space>
                    </Form.Item>
                    {params.hasChildAllowances && (
                      <>
                        <Form.Item label="מספר ילדים">
                          <InputNumber
                            value={params.numberOfChildren}
                            onChange={(value) => handleInputChange('numberOfChildren', value || 0)}
                            min={0}
                            max={10}
                            style={{ width: '100%', borderRadius: '8px' }}
                          />
                        </Form.Item>
                        <Form.Item label="תוספת לילד">
                          <InputNumber
                            value={params.childAllowancePerChild}
                            onChange={(value) => handleInputChange('childAllowancePerChild', value || 0)}
                            style={{ width: '100%', borderRadius: '8px' }}
                            formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                          />
                        </Form.Item>
                      </>
                    )}
                  </Col>
                </Row>
              </Panel>

              {/* פאנל מתקדם - נקודות זכות ופנסיה */}
              <Panel 
                header={
                  <Space>
                    <CalculatorOutlined style={{ color: '#f5222d' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                      חישובים מתקדמים - מס ופנסיה
                    </Text>
                  </Space>
                }
                key="advanced"
                style={{ direction: 'rtl' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="נקודות זכות">
                      <InputNumber
                        value={params.creditPoints}
                        onChange={(value) => handleInputChange('creditPoints', value || 0)}
                        min={0}
                        max={20}
                        step={0.25}
                        precision={2}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="2.25"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="נקודות זכות למס">
                      <InputNumber
                        value={params.taxCreditPoints}
                        onChange={(value) => handleInputChange('taxCreditPoints', value || 0)}
                        min={0}
                        max={20}
                        step={0.25}
                        precision={2}
                        style={{ width: '100%', borderRadius: '8px' }}
                        placeholder="2.25"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="הפרשה לפנסיה - עובד (%)">
                      <InputNumber
                        value={params.pensionContribution.employee}
                        onChange={(value) => handleInputChange('pensionContribution.employee', value || 0)}
                        min={0}
                        max={15}
                        step={0.1}
                        precision={1}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `${value}%`}
                        parser={(value) => parseFloat(value!.replace('%', '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="הפרשה לפנסיה - מעביד (%)">
                      <InputNumber
                        value={params.pensionContribution.employer}
                        onChange={(value) => handleInputChange('pensionContribution.employer', value || 0)}
                        min={0}
                        max={15}
                        step={0.1}
                        precision={1}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `${value}%`}
                        parser={(value) => parseFloat(value!.replace('%', '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="פיצויים - מעביד (%)">
                      <InputNumber
                        value={params.pensionContribution.employerCompensation}
                        onChange={(value) => handleInputChange('pensionContribution.employerCompensation', value || 0)}
                        min={0}
                        max={15}
                        step={0.1}
                        precision={1}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `${value}%`}
                        parser={(value) => parseFloat(value!.replace('%', '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="קרן השתלמות - עובד (%)">
                      <InputNumber
                        value={params.studyFundContribution.employee}
                        onChange={(value) => handleInputChange('studyFundContribution.employee', value || 0)}
                        min={0}
                        max={10}
                        step={0.1}
                        precision={1}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `${value}%`}
                        parser={(value) => parseFloat(value!.replace('%', '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="ביטוח אובדן כושר עבודה">
                      <InputNumber
                        value={params.disabilityInsurance}
                        onChange={(value) => handleInputChange('disabilityInsurance', value || 0)}
                        min={0}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="דמי אגוד">
                      <InputNumber
                        value={params.unionDues}
                        onChange={(value) => handleInputChange('unionDues', value || 0)}
                        min={0}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="מס מקצועי">
                      <InputNumber
                        value={params.professionalTax}
                        onChange={(value) => handleInputChange('professionalTax', value || 0)}
                        min={0}
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => parseFloat(value!.replace(/₪\s?|(,*)/g, '')) || 0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '32px 0' }} />

              {/* Action Buttons */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={8}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                    type="primary"
                      size="large"
                    block
                    icon={<CalculatorOutlined />}
                  onClick={calculateSalary}
                    loading={loading}
                    style={{
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      border: 'none',
                        borderRadius: '12px', 
                      height: '48px',
                      fontSize: '16px',
                        fontWeight: 600,
                    }}
                  >
                    {loading ? 'מחשב...' : 'חשב שכר'}
                    </Button>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                    <Button 
                  size="large"
                  block
                  onClick={resetCalculator}
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
                  אפס
                    </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Results Card */}
        <AnimatePresence>
        {showResults && result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <Card 
                style={cardStyle}
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span style={{ color: 'white' }}>תוצאות חישוב השכר</span>
                  </Space>
                }
                headStyle={{
                  background: 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  direction: 'rtl',
                }}
                bodyStyle={{ padding: '32px', direction: 'rtl' }}
              >
                <Row gutter={[24, 24]}>
                  {/* Summary Cards */}
                  <Col xs={24} sm={8}>
                    <Card
                      style={{
                        ...cardStyle,
                        background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%)',
                        border: '1px solid rgba(24, 144, 255, 0.3)',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>שכר ברוטו</Text>}
                        value={result.totalGross}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 700 }}
                      />
                      </Card>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Card
                      style={{
                        ...cardStyle,
                        background: 'linear-gradient(135deg, rgba(255, 77, 79, 0.1) 0%, rgba(255, 77, 79, 0.05) 100%)',
                        border: '1px solid rgba(255, 77, 79, 0.3)',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>סך ניכויים</Text>}
                        value={result.totalDeductions}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#ff4d4f', fontSize: '28px', fontWeight: 700 }}
                      />
                      </Card>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Card
                      style={{
                        ...cardStyle,
                        background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.05) 100%)',
                        border: '1px solid rgba(82, 196, 26, 0.3)',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>שכר נטו</Text>}
                        value={result.netSalary}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 700 }}
                      />
                      </Card>
                  </Col>
                </Row>

                {/* שורה נוספת עם אחוז מס אפקטיבי */}
                <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
                  <Col xs={24} sm={12}>
                    <Card
                      style={{
                        ...cardStyle,
                        background: 'linear-gradient(135deg, rgba(250, 173, 20, 0.1) 0%, rgba(250, 173, 20, 0.05) 100%)',
                        border: '1px solid rgba(250, 173, 20, 0.3)',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>אחוז מס אפקטיבי</Text>}
                        value={result.effectiveTaxRate}
                        precision={1}
                        formatter={(value) => `${value}%`}
                        valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 700 }}
                      />
                    </Card>
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Card
                      style={{
                        ...cardStyle,
                        background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(114, 46, 209, 0.05) 100%)',
                        border: '1px solid rgba(114, 46, 209, 0.3)',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>זכות מס חודשית</Text>}
                        value={result.taxCredits}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 700 }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '32px 0' }} />

                {/* Detailed Breakdown */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="הכנסות"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                      }}
                      headStyle={{ 
                        background: 'transparent', 
                        color: 'white',
                        direction: 'rtl'
                      }}
                      bodyStyle={{ direction: 'rtl' }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text style={{ color: 'white' }}>שכר בסיס:</Text>
                          <Text style={{ color: 'white', fontWeight: 600 }}>
                            {formatCurrency(result.grossSalary)}
                          </Text>
                        </div>
                            {result.overtimePay > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>שעות נוספות:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.overtimePay)}
                            </Text>
                          </div>
                        )}
                            {result.weekendPay > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>שעות סוף שבוע:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.weekendPay)}
                            </Text>
                          </div>
                        )}
                            {result.holidayPay > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>שעות חג:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.holidayPay)}
                            </Text>
                          </div>
                        )}
                            {result.allowancesTotal > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>תוספות ונדבות:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.allowancesTotal)}
                            </Text>
                          </div>
                        )}
                            {result.standbyPay > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>דמי כוננות:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.standbyPay)}
                            </Text>
                          </div>
                        )}
                        {result.carAllowance > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>תוספת רכב:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.carAllowance)}
                            </Text>
                          </div>
                        )}
                        {result.phoneAllowance > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>תוספת טלפון:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.phoneAllowance)}
                            </Text>
                          </div>
                        )}
                        {result.travelExpenses > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>הוצאות נסיעה:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.travelExpenses)}
                            </Text>
                          </div>
                        )}
                        {result.childAllowances > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>תוספת ילדים:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              {formatCurrency(result.childAllowances)}
                            </Text>
                          </div>
                        )}
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
                      headStyle={{ 
                        background: 'transparent', 
                        color: 'white',
                        direction: 'rtl'
                      }}
                      bodyStyle={{ direction: 'rtl' }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text style={{ color: 'white' }}>מס הכנסה:</Text>
                          <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                            -{formatCurrency(result.incomeTax)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text style={{ color: 'white' }}>ביטוח לאומי:</Text>
                          <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                            -{formatCurrency(result.nationalInsurance)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text style={{ color: 'white' }}>מס בריאות:</Text>
                          <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                            -{formatCurrency(result.healthTax)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text style={{ color: 'white' }}>פנסיה:</Text>
                          <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                            -{formatCurrency(result.pensionDeduction)}
                          </Text>
                        </div>
                        {result.studyFundDeduction > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>קרן השתלמות:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(result.studyFundDeduction)}
                            </Text>
                          </div>
                        )}
                        {result.disabilityInsurance > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>ביטוח אובדן כושר:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(result.disabilityInsurance)}
                            </Text>
                          </div>
                        )}
                        {result.unionDues > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>דמי אגוד:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(result.unionDues)}
                            </Text>
                          </div>
                        )}
                        {result.professionalTax > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>מס מקצועי:</Text>
                            <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>
                              -{formatCurrency(result.professionalTax)}
                            </Text>
                          </div>
                        )}
                        {result.taxCredits > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white' }}>זכות מס:</Text>
                            <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                              +{formatCurrency(result.taxCredits)}
                            </Text>
                          </div>
                        )}
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SalaryCalculator;