// Types for the Insurance Agent Salary Calculator

export interface CompanyRates {
  name: string;
  pension: {
    volumeCommission: number; // 2%-12% of annual deposits
    ongoingCommission: number; // 0.25%-0.8% monthly
    accumulationBonus: number; // 0.1%-0.2% annual
  };
  finance: {
    volumeCommission: number; // 2,250-6,500 NIS per million
    ongoingCommission: number; // 0.1%-0.3% annual
    accumulationBonus: number; // percentage of accumulation
  };
  lifeInsurance: {
    volumeCommission: number; // 70%-100% of annual premium
    ongoingCommission: number; // 20%-30% monthly
  };
  healthInsurance: {
    volumeCommission: number; // usually 0% or very low
    ongoingCommission: number; // 15%-22% monthly
  };
}

export interface PensionProduct {
  monthlyDeposit: number;
  managementFeesAmount: number; // מתוך ההפקדה החודשית - כמה הוא דמי ניהול (מזכה לנפרעים)
  totalAccumulation: number;
  companyRates: CompanyRates['pension'];
}

export interface FinanceProduct {
  totalAccumulation: number;
  companyRates: CompanyRates['finance'];
}

export interface LifeInsuranceProduct {
  monthlyPremium: number;
  companyRates: CompanyRates['lifeInsurance'];
}

export interface HealthInsuranceProduct {
  monthlyPremium: number;
  companyRates: CompanyRates['healthInsurance'];
}

export interface AgentAppointment {
  type: 'pension' | 'finance' | 'lifeInsurance' | 'healthInsurance';
  monthlyValue: number; // premium or deposit
  accumulationValue?: number; // for pension/finance
  ongoingRate: number; // the ongoing commission rate
  oneTimeCommissionRate?: number; // עמלה חד-פעמית על הצבירה (במינוי)
  hasOneTimeCommission?: boolean; // האם זה מינוי עם עמלה חד-פעמית
}

export interface SalaryInput {
  pensionProducts: PensionProduct[];
  financeProducts: FinanceProduct[];
  lifeInsuranceProducts: LifeInsuranceProduct[];
  healthInsuranceProducts: HealthInsuranceProduct[];
  agentAppointments: AgentAppointment[];
}

export interface IncomeBreakdown {
  pension: {
    volumeCommission: number;
    ongoingCommission: number;
    accumulationBonus: number;
    total: number;
  };
  finance: {
    volumeCommission: number;
    ongoingCommission: number;
    accumulationBonus: number;
    total: number;
  };
  lifeInsurance: {
    volumeCommission: number;
    ongoingCommission: number;
    total: number;
  };
  healthInsurance: {
    volumeCommission: number;
    ongoingCommission: number;
    total: number;
  };
  agentAppointments: {
    total: number;
  };
  grossTotal: number;
}

export interface TaxCalculation {
  socialSecurity: number;
  incomeTax: number;
  totalDeductions: number;
  netIncome: number;
}

export interface SalaryResult {
  income: IncomeBreakdown;
  taxes: TaxCalculation;
  grossIncome: number;
  netIncome: number;
}

// Tax brackets for 2025
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export const TAX_BRACKETS_2025: TaxBracket[] = [
  { min: 0, max: 7010, rate: 0.10 },
  { min: 7011, max: 10060, rate: 0.14 },
  { min: 10061, max: 16150, rate: 0.20 },
  { min: 16151, max: 22440, rate: 0.31 },
  { min: 22441, max: 46690, rate: 0.35 },
  { min: 46691, max: Infinity, rate: 0.47 }
];

export const SOCIAL_SECURITY_RATES_2025 = {
  lowRate: 0.077, // 7.7% up to 7,522 NIS
  highRate: 0.18, // 18% above 7,522 NIS
  threshold: 7522,
  ceiling: 62680
};

export const ADDITIONAL_TAX_RATE = 0.05; // 5% above 60,130 NIS
export const ADDITIONAL_TAX_THRESHOLD = 60130;
