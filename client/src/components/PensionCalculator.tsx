import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Spin,
  InputNumber,
  Space,
  Alert,
  Statistic,
  Form,
  Divider,
} from 'antd';
import {
  CalculatorOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleAd from './GoogleAd';

const { Title, Text } = Typography;

interface CalculationParams {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  grossSalary: number;
  monthlyDeposit: number;
  annualReturn: number;
  employerCompensation: number;
  employerContribution: number;
  employeeContribution: number;
  studyFundContribution: number;
  currentManagementFeeDeposit: number;
  currentManagementFeeBalance: number;
  coverManagementFeeDeposit: number;
  coverManagementFeeBalance: number;
}

interface CalculationResult {
  futureValueCurrent: number;
  futureValueCover: number;
  currentFeeCost: number;
  coverFeeCost: number;
  savings: number;
  monthsToRetirement: number;
  totalDeposits: number;
}

const PensionCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<CalculationParams>({
    currentAge: 35,
    retirementAge: 67,
    currentBalance: 150000,
    grossSalary: 20000,
    monthlyDeposit: 4100,
    annualReturn: 4.38,
    employerCompensation: 6.00,
    employerContribution: 6.50,
    employeeContribution: 6.00,
    studyFundContribution: 2.50,
    currentManagementFeeDeposit: 1.50,
    currentManagementFeeBalance: 0.50,
    coverManagementFeeDeposit: 0.90,
    coverManagementFeeBalance: 0.20,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Calculate monthly deposit based on salary and contribution percentages
  const calculateMonthlyDeposit = (salary: number, employerComp: number, employerCont: number, employeeCont: number, studyFund: number) => {
    const totalPercentage = employerComp + employerCont + employeeCont + studyFund;
    return Math.round((salary * totalPercentage) / 100);
  };

  // Update monthly deposit when salary or percentages change
  React.useEffect(() => {
    const newMonthlyDeposit = calculateMonthlyDeposit(
      params.grossSalary,
      params.employerCompensation,
      params.employerContribution,
      params.employeeContribution,
      params.studyFundContribution
    );
    if (newMonthlyDeposit !== params.monthlyDeposit) {
      setParams(prev => ({ ...prev, monthlyDeposit: newMonthlyDeposit }));
    }
  }, [params.grossSalary, params.employerCompensation, params.employerContribution, params.employeeContribution, params.studyFundContribution]);

  // Helper function for annual to monthly interest conversion
  const annualToMonthlyInterest = (annualRate: number): number => {
    return Math.pow(1 + annualRate, 1/12) - 1;
  };

  const calculatePension = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false); // Hide previous results first
    
    try {
      // Input validation
      if (params.currentAge < 18 || params.currentAge > 67) {
        setError('גיל נוכחי לא תקין (18-67)');
        setLoading(false);
        return;
      }
      
      if (params.retirementAge < params.currentAge || params.retirementAge > 67) {
        setError('גיל פרישה לא תקין');
        setLoading(false);
        return;
      }
      
      const yearsDifference = params.retirementAge - params.currentAge;
      if (yearsDifference > 50) {
        setError('תקופה ארוכה מדי');
        setLoading(false);
        return;
      }

      const monthsToRetirement = Math.max(0, yearsDifference * 12);
      const annualReturnDecimal = params.annualReturn / 100;
      const monthlyInterestRate = annualToMonthlyInterest(annualReturnDecimal);

      console.log('Starting calculation with params:', {
        currentAge: params.currentAge,
        retirementAge: params.retirementAge,
        currentBalance: params.currentBalance,
        monthlyDeposit: params.monthlyDeposit,
        annualReturn: params.annualReturn,
        monthsToRetirement,
        monthlyInterestRate,
        fees: {
          currentSavings: params.currentManagementFeeBalance,
          currentDeposit: params.currentManagementFeeDeposit,
          coverSavings: params.coverManagementFeeBalance,
          coverDeposit: params.coverManagementFeeDeposit
        }
      });

      // Initialize totals
      let currentTotal = params.currentBalance;
      let coverTotal = params.currentBalance;
      let currentManagementTotal = 0;
      let coverManagementTotal = 0;

      const currentSavingsFee = params.currentManagementFeeBalance;
      const currentDepositFee = params.currentManagementFeeDeposit;
      const coverSavingsFee = params.coverManagementFeeBalance;
      const coverDepositFee = params.coverManagementFeeDeposit;

      // Process calculation month by month for accuracy
      const chunkSize = 12;
      let processedMonths = 0;

      const processChunk = () => {
        return new Promise<void>((resolve) => {
          const endMonth = Math.min(processedMonths + chunkSize, monthsToRetirement);
          
          for (let month = processedMonths; month < endMonth; month++) {
            // Current scenario calculation
            const currentMonthlyReturn = currentTotal * monthlyInterestRate;
            const currentMonthlyManagementFee = (currentTotal * (currentSavingsFee / 100)) / 12;
            const currentDepositManagementFee = params.monthlyDeposit * (currentDepositFee / 100);

            currentManagementTotal += currentMonthlyManagementFee + currentDepositManagementFee;
            currentTotal = currentTotal + params.monthlyDeposit + currentMonthlyReturn - currentMonthlyManagementFee - currentDepositManagementFee;

            // Cover scenario calculation
            const coverMonthlyReturn = coverTotal * monthlyInterestRate;
            const coverMonthlyManagementFee = (coverTotal * (coverSavingsFee / 100)) / 12;
            const coverDepositManagementFee = params.monthlyDeposit * (coverDepositFee / 100);

            coverManagementTotal += coverMonthlyManagementFee + coverDepositManagementFee;
            coverTotal = coverTotal + params.monthlyDeposit + coverMonthlyReturn - coverMonthlyManagementFee - coverDepositManagementFee;
          }

          processedMonths = endMonth;
          setTimeout(resolve, 0);
        });
      };

      // Process all chunks
      while (processedMonths < monthsToRetirement) {
        await processChunk();
        
        // Log progress every 5 years
        if (processedMonths % 60 === 0 && processedMonths > 0) {
          console.log(`Progress after ${processedMonths/12} years:`, {
            currentTotal: Math.round(currentTotal),
            coverTotal: Math.round(coverTotal),
            currentManagementTotal: Math.round(currentManagementTotal),
            coverManagementTotal: Math.round(coverManagementTotal),
            difference: Math.round(coverTotal - currentTotal)
          });
        }
      }

      const savings = coverTotal - currentTotal;
      const totalDeposits = params.monthlyDeposit * monthsToRetirement;
      const managementFeeSavings = currentManagementTotal - coverManagementTotal;

      const calculatedResult: CalculationResult = {
        futureValueCurrent: Math.round(currentTotal),
        futureValueCover: Math.round(coverTotal),
        currentFeeCost: Math.round(currentManagementTotal),
        coverFeeCost: Math.round(coverManagementTotal),
        savings: Math.round(savings),
        monthsToRetirement,
        totalDeposits: Math.round(totalDeposits),
      };

      console.log('Final calculation result:', {
        ...calculatedResult,
        managementFeeSavings: Math.round(managementFeeSavings),
        differenceInResults: {
          futureValueDiff: calculatedResult.futureValueCover - calculatedResult.futureValueCurrent,
          managementCostDiff: calculatedResult.currentFeeCost - calculatedResult.coverFeeCost
        }
      });

      setResult(calculatedResult);
      setShowResults(true);

    } catch (err) {
      setError('שגיאה בחישוב הפנסיה');
      console.error('Pension calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    console.log('Resetting calculator...');
      setParams({
        currentAge: 35,
        retirementAge: 67,
        currentBalance: 150000,
        grossSalary: 20000,
        monthlyDeposit: 4100,
      annualReturn: 4.38,
      employerCompensation: 6.00,
      employerContribution: 6.50,
      employeeContribution: 6.00,
      studyFundContribution: 2.50,
      currentManagementFeeDeposit: 1.50,
      currentManagementFeeBalance: 0.50,
      coverManagementFeeDeposit: 0.90,
      coverManagementFeeBalance: 0.20,
      });
      setResult(null);
    setShowResults(false);
      setError(null);
    form.resetFields();
    console.log('Calculator reset completed');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
    <div style={containerStyle} className="pension-calculator">
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
              <TrophyOutlined style={{ fontSize: '48px', color: '#faad14' }} />
            </motion.div>
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              מחשבון פנסיה וקרן השתלמות
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
              השוואת תוכניות פנסיוניות וחישוב חיסכון
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
              <CalculatorOutlined style={{ color: '#1890ff' }} />
              <span style={{ color: 'white' }}>פרטי החישוב</span>
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
              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>גיל נוכחי</span>}
                >
                  <InputNumber
                      value={params.currentAge}
                    onChange={(value) => setParams(prev => ({ ...prev, currentAge: value ?? 0 }))}
                    min={18}
                    max={70}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    placeholder="35"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>גיל פרישה</span>}
                >
                  <InputNumber
                      value={params.retirementAge}
                    onChange={(value) => setParams(prev => ({ ...prev, retirementAge: value ?? 0 }))}
                    min={60}
                    max={70}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    placeholder="67"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>יתרה נוכחית</span>}
                >
                  <InputNumber
                    value={params.currentBalance}
                    onChange={(value) => setParams(prev => ({ ...prev, currentBalance: value ?? 0 }))}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => {
                      const parsed = parseFloat(value!.replace(/₪\s?|(,*)/g, ''));
                      return isNaN(parsed) ? 0 : parsed;
                    }}
                    placeholder="150,000"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>שכר ברוטו חודשי</span>}
                >
                  <InputNumber
                    value={params.grossSalary}
                    onChange={(value) => setParams(prev => ({ ...prev, grossSalary: value ?? 0 }))}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => {
                      const parsed = parseFloat(value!.replace(/₪\s?|(,*)/g, ''));
                      return isNaN(parsed) ? 0 : parsed;
                    }}
                    placeholder="20,000"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>תשלום חודשי מחושב</span>}
                >
                  <InputNumber
                    value={params.monthlyDeposit}
                    disabled
                    style={{ 
                      width: '100%',
                      maxWidth: '200px',
                      borderRadius: '8px',
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>תשואה שנתית (%)</span>}
                >
                  <InputNumber
                    value={params.annualReturn}
                    onChange={(value) => setParams(prev => ({ ...prev, annualReturn: value ?? 0 }))}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%',
                      maxWidth: '150px',
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="4.38"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* הפרשות ואחוזים */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24}>
                <Title level={4} style={{ color: 'white', margin: '0 0 16px 0' }}>
                  אחוזי הפרשה
                </Title>
              </Col>
              
                            <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>הפרשת מעביד - פיצויים (%)</span>}
                >
                                    <InputNumber
                      value={params.employerCompensation}
                    onChange={(value) => setParams(prev => ({ ...prev, employerCompensation: value ?? 0 }))}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="6.00"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>הפרשת מעביד - פנסיה (%)</span>}
                >
                                    <InputNumber
                      value={params.employerContribution}
                    onChange={(value) => setParams(prev => ({ ...prev, employerContribution: value ?? 0 }))}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="6.50"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>הפרשת עובד - פנסיה (%)</span>}
                >
                  <InputNumber
                    value={params.employeeContribution}
                    onChange={(value) => setParams(prev => ({ ...prev, employeeContribution: value ?? 0 }))}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="6.00"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>קרן השתלמות (%)</span>}
                >
                  <InputNumber
                    value={params.studyFundContribution}
                    onChange={(value) => setParams(prev => ({ ...prev, studyFundContribution: value ?? 0 }))}
                    min={0}
                    max={10}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="2.50"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* דמי ניהול */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24}>
                <Title level={4} style={{ color: 'white', margin: '0 0 16px 0' }}>
                  דמי ניהול - ספק נוכחי
                </Title>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>דמי ניהול על הפקדות נוכחי (%)</span>}
                >
                  <InputNumber
                    value={params.currentManagementFeeDeposit}
                    onChange={(value) => setParams(prev => ({ ...prev, currentManagementFeeDeposit: value ?? 0 }))}
                    min={0}
                    max={5}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%',
                      maxWidth: '150px',
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="1.50"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>דמי ניהול על צבירה נוכחי (%)</span>}
                >
                  <InputNumber
                    value={params.currentManagementFeeBalance}
                    onChange={(value) => setParams(prev => ({ ...prev, currentManagementFeeBalance: value ?? 0 }))}
                    min={0}
                    max={5}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%',
                      maxWidth: '150px',
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="0.50"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
              <Col xs={24}>
                <Title level={4} style={{ color: 'white', margin: '0 0 16px 0' }}>
                  דמי ניהול - חדשים (השוואה)
                </Title>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>דמי ניהול על הפקדות חדשים (%)</span>}
                >
                  <InputNumber
                    value={params.coverManagementFeeDeposit}
                    onChange={(value) => setParams(prev => ({ ...prev, coverManagementFeeDeposit: value ?? 0 }))}
                    min={0}
                    max={5}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%',
                      maxWidth: '150px',
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="0.90"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Form.Item 
                  label={<span style={{ color: 'white' }}>דמי ניהול על צבירה חדשים (%)</span>}
                >
                  <InputNumber
                    value={params.coverManagementFeeBalance}
                    onChange={(value) => setParams(prev => ({ ...prev, coverManagementFeeBalance: value ?? 0 }))}
                    min={0}
                    max={5}
                    step={0.01}
                    precision={2}
                    style={{ 
                      width: '100%',
                      maxWidth: '150px',
                      borderRadius: '8px', 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'white'
                    }}
                    addonAfter="%"
                    placeholder="0.20"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '32px 0' }} />

            {/* Action Buttons */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={8}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                    type="primary"
                    size="large"
                    block
                    icon={loading ? <Spin size="small" /> : <CalculatorOutlined />}
                    onClick={calculatePension}
                    loading={loading}
                    style={{
                      background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
                      border: 'none',
                    borderRadius: '12px', 
                      height: '48px',
                      fontSize: '16px',
                    fontWeight: 600,
                    }}
                  >
                    {loading ? 'מחשב נתונים חדשים...' : 'חשב פנסיה'}
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
        <AnimatePresence mode="wait">
          {showResults && result && (
            <motion.div
              key={`pension-results-${result.futureValueCurrent}-${result.savings}`}
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
                    <span style={{ color: 'white' }}>תוצאות השוואת הפנסיה</span>
                  </Space>
                }
                headStyle={{
                  background: 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  direction: 'rtl',
                }}
                bodyStyle={{ padding: '32px', direction: 'rtl' }}
              >
                {/* Savings Highlight */}
                <Card
                  style={{
                    ...cardStyle,
                    background: result.savings > 0 
                      ? 'linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(82, 196, 26, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 77, 79, 0.15) 0%, rgba(255, 77, 79, 0.05) 100%)',
                    border: result.savings > 0 
                      ? '2px solid rgba(82, 196, 26, 0.4)'
                      : '2px solid rgba(255, 77, 79, 0.4)',
                    marginBottom: '32px',
                  }}
                  bodyStyle={{ padding: '32px', textAlign: 'center' }}
                >
                  <Title level={2} style={{ color: 'white', margin: 0 }}>
                    {result.savings > 0 ? 'חיסכון צפוי!' : 'הפסד צפוי'}
                  </Title>
                  
                  <Statistic
                    value={Math.abs(result.savings)}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ 
                      color: result.savings > 0 ? '#52c41a' : '#ff4d4f', 
                      fontSize: '36px', 
                      fontWeight: 700 
                    }}
                  />
                  
                  <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                    {result.savings > 0 
                      ? 'על ידי מעבר לחדשים תחסוך סכום זה עד הפרישה'
                      : 'הספק הנוכחי עדיף במקרה זה'
                    }
                  </Text>

                  {/* פרסומת בתוך התוצאות */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{ marginTop: '24px' }}
                  >
                    <GoogleAd 
                      adSlot="7777888899"
                      adFormat="rectangle"
                      style={{ marginBottom: '16px' }}
                    />
                  </motion.div>
                </Card>

                {/* Comparison Cards */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="הספק הנוכחי"
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
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>צבירה עד הפרישה</Text>}
                        value={result.futureValueCurrent}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#ff9c00', fontSize: '24px', fontWeight: 700 }}
                      />
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card
                      title="חדשים"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(82, 196, 26, 0.3)',
                        borderRadius: '12px',
                      }}
                      headStyle={{ 
                        background: 'transparent', 
                        color: 'white',
                        direction: 'rtl'
                      }}
                      bodyStyle={{ direction: 'rtl' }}
                    >
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>צבירה עד הפרישה</Text>}
                        value={result.futureValueCover}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 700 }}
                      />
                    </Card>
                  </Col>
                </Row>
                    </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* פרסומת בתחתית */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <GoogleAd 
            adSlot="0987654321"
            adFormat="horizontal"
            style={{ marginTop: '32px' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PensionCalculator;