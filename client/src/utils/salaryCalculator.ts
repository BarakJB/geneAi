import {
  SalaryInput,
  SalaryResult,
  IncomeBreakdown,
  TaxCalculation,
  TAX_BRACKETS_2025,
  SOCIAL_SECURITY_RATES_2025,
  ADDITIONAL_TAX_RATE,
  ADDITIONAL_TAX_THRESHOLD,
  CompanyRates
} from '../types/salaryCalculator';

// Default company rates - can be customized
export const DEFAULT_COMPANY_RATES: CompanyRates = {
  name: 'Default',
  pension: {
    volumeCommission: 0.06, // 6%
    ongoingCommission: 0.005, // 0.5%
    accumulationBonus: 0.0015 // 0.15%
  },
  finance: {
    volumeCommission: 4000, // 4,000 NIS per million
    ongoingCommission: 0.002, // 0.2% annual
    accumulationBonus: 0.001 // 0.1%
  },
  lifeInsurance: {
    volumeCommission: 0.85, // 85%
    ongoingCommission: 0.25 // 25%
  },
  healthInsurance: {
    volumeCommission: 0, // 0%
    ongoingCommission: 0.18 // 18%
  }
};

// Popular insurance companies rates
export const COMPANY_RATES: Record<string, CompanyRates> = {
  harel: {
    name: 'הראל',
    pension: {
      volumeCommission: 0.08,
      ongoingCommission: 0.006,
      accumulationBonus: 0.002
    },
    finance: {
      volumeCommission: 5000,
      ongoingCommission: 0.0025,
      accumulationBonus: 0.0012
    },
    lifeInsurance: {
      volumeCommission: 0.90,
      ongoingCommission: 0.28
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.20
    }
  },
  clal: {
    name: 'כלל',
    pension: {
      volumeCommission: 0.075,
      ongoingCommission: 0.0055,
      accumulationBonus: 0.0018
    },
    finance: {
      volumeCommission: 4500,
      ongoingCommission: 0.0022,
      accumulationBonus: 0.0011
    },
    lifeInsurance: {
      volumeCommission: 0.88,
      ongoingCommission: 0.26
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.19
    }
  },
  menora: {
    name: 'מנורה',
    pension: {
      volumeCommission: 0.07,
      ongoingCommission: 0.005,
      accumulationBonus: 0.0016
    },
    finance: {
      volumeCommission: 4200,
      ongoingCommission: 0.002,
      accumulationBonus: 0.001
    },
    lifeInsurance: {
      volumeCommission: 0.82,
      ongoingCommission: 0.24
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.17
    }
  },
  migdal: {
    name: 'מגדל',
    pension: {
      volumeCommission: 0.073,
      ongoingCommission: 0.0052,
      accumulationBonus: 0.0017
    },
    finance: {
      volumeCommission: 4300,
      ongoingCommission: 0.0021,
      accumulationBonus: 0.0011
    },
    lifeInsurance: {
      volumeCommission: 0.84,
      ongoingCommission: 0.25
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.18
    }
  },
  phoenix: {
    name: 'הפניקס',
    pension: {
      volumeCommission: 0.065,
      ongoingCommission: 0.0048,
      accumulationBonus: 0.0015
    },
    finance: {
      volumeCommission: 3800,
      ongoingCommission: 0.0019,
      accumulationBonus: 0.0009
    },
    lifeInsurance: {
      volumeCommission: 0.80,
      ongoingCommission: 0.23
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.16
    }
  },
  psagot: {
    name: 'פסגות',
    pension: {
      volumeCommission: 0.068,
      ongoingCommission: 0.0049,
      accumulationBonus: 0.0014
    },
    finance: {
      volumeCommission: 3900,
      ongoingCommission: 0.0018,
      accumulationBonus: 0.0008
    },
    lifeInsurance: {
      volumeCommission: 0.78,
      ongoingCommission: 0.22
    },
    healthInsurance: {
      volumeCommission: 0,
      ongoingCommission: 0.15
    }
  }
};

/**
 * Calculate pension income from deposits and accumulation
 */
function calculatePensionIncome(input: SalaryInput): IncomeBreakdown['pension'] {
  let volumeCommission = 0;
  let ongoingCommission = 0;
  let accumulationBonus = 0;

  input.pensionProducts.forEach(product => {
    const annualDeposit = product.monthlyDeposit * 12;
    
    // Volume commission - חד פעמית, מחולקת על 12 לתצוגה חודשית
    volumeCommission += (annualDeposit * product.companyRates.volumeCommission) / 12;
    
    // Ongoing commission - חודשית על דמי הניהול שהבאת
    ongoingCommission += product.managementFeesAmount * product.companyRates.ongoingCommission;
    
    // Accumulation bonus - שנתית, מחולקת על 12 לתצוגה חודשית
    accumulationBonus += (product.totalAccumulation * product.companyRates.accumulationBonus) / 12;
  });

  return {
    volumeCommission,
    ongoingCommission,
    accumulationBonus,
    total: volumeCommission + ongoingCommission + accumulationBonus
  };
}

/**
 * Calculate finance income from accumulation transfers
 */
function calculateFinanceIncome(input: SalaryInput): IncomeBreakdown['finance'] {
  let volumeCommission = 0;
  let ongoingCommission = 0;
  let accumulationBonus = 0;

  input.financeProducts.forEach(product => {
    const accumulationInMillions = product.totalAccumulation / 1000000;
    
    // Volume commission - חד פעמית, מחולקת על 12 לתצוגה חודשית
    volumeCommission += (accumulationInMillions * product.companyRates.volumeCommission) / 12;
    
    // Ongoing commission - חודשית
    ongoingCommission += product.totalAccumulation * (product.companyRates.ongoingCommission / 12);
    
    // Accumulation bonus - שנתית, מחולקת על 12 לתצוגה חודשית
    accumulationBonus += (product.totalAccumulation * product.companyRates.accumulationBonus) / 12;
  });

  return {
    volumeCommission,
    ongoingCommission,
    accumulationBonus,
    total: volumeCommission + ongoingCommission + accumulationBonus
  };
}

/**
 * Calculate life insurance income
 */
function calculateLifeInsuranceIncome(input: SalaryInput): IncomeBreakdown['lifeInsurance'] {
  let volumeCommission = 0;
  let ongoingCommission = 0;

  input.lifeInsuranceProducts.forEach(product => {
    const annualPremium = product.monthlyPremium * 12;
    
    // Volume commission - חד פעמית, מחולקת על 12 לתצוגה חודשית
    volumeCommission += (annualPremium * product.companyRates.volumeCommission) / 12;
    
    // Ongoing commission - חודשית
    ongoingCommission += product.monthlyPremium * product.companyRates.ongoingCommission;
  });

  return {
    volumeCommission,
    ongoingCommission,
    total: volumeCommission + ongoingCommission
  };
}

/**
 * Calculate health insurance income
 */
function calculateHealthInsuranceIncome(input: SalaryInput): IncomeBreakdown['healthInsurance'] {
  let volumeCommission = 0;
  let ongoingCommission = 0;

  input.healthInsuranceProducts.forEach(product => {
    const annualPremium = product.monthlyPremium * 12;
    
    // Volume commission (usually 0 for health insurance)
    volumeCommission += annualPremium * product.companyRates.volumeCommission;
    
    // Ongoing commission on monthly premium
    ongoingCommission += product.monthlyPremium * product.companyRates.ongoingCommission;
  });

  return {
    volumeCommission,
    ongoingCommission,
    total: volumeCommission + ongoingCommission
  };
}

/**
 * Calculate income from agent appointments
 */
function calculateAgentAppointmentsIncome(input: SalaryInput): IncomeBreakdown['agentAppointments'] {
  let total = 0;

  input.agentAppointments.forEach(appointment => {
    // Calculate ongoing commission from appointed clients
    total += appointment.monthlyValue * appointment.ongoingRate;
    
    // If there's accumulation value and one-time commission - spread over 12 months
    if (appointment.accumulationValue && appointment.hasOneTimeCommission && appointment.oneTimeCommissionRate) {
      const oneTimeCommission = appointment.accumulationValue * appointment.oneTimeCommissionRate;
      total += oneTimeCommission / 12; // מחלק על 12 חודשים להצגה חודשית
    }
  });

  return { total };
}

/**
 * Calculate social security (Bituach Leumi) for self-employed
 */
function calculateSocialSecurity(grossIncome: number): number {
  const { lowRate, highRate, threshold, ceiling } = SOCIAL_SECURITY_RATES_2025;
  
  // Cap income at ceiling
  const taxableIncome = Math.min(grossIncome, ceiling);
  
  if (taxableIncome <= threshold) {
    return taxableIncome * lowRate;
  } else {
    return (threshold * lowRate) + ((taxableIncome - threshold) * highRate);
  }
}

/**
 * Calculate income tax using progressive tax brackets
 */
function calculateIncomeTax(grossIncome: number): number {
  let tax = 0;
  let remainingIncome = grossIncome;

  for (const bracket of TAX_BRACKETS_2025) {
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min + 1);
    
    if (taxableInBracket <= 0) break;
    
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
    
    if (remainingIncome <= 0) break;
  }

  // Add additional 5% tax above threshold
  if (grossIncome > ADDITIONAL_TAX_THRESHOLD) {
    tax += (grossIncome - ADDITIONAL_TAX_THRESHOLD) * ADDITIONAL_TAX_RATE;
  }

  return tax;
}

/**
 * Main function to calculate salary
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
  // Calculate income from all sources
  const pension = calculatePensionIncome(input);
  const finance = calculateFinanceIncome(input);
  const lifeInsurance = calculateLifeInsuranceIncome(input);
  const healthInsurance = calculateHealthInsuranceIncome(input);
  const agentAppointments = calculateAgentAppointmentsIncome(input);

  const grossTotal = pension.total + finance.total + lifeInsurance.total + 
                    healthInsurance.total + agentAppointments.total;

  const income: IncomeBreakdown = {
    pension,
    finance,
    lifeInsurance,
    healthInsurance,
    agentAppointments,
    grossTotal
  };

  // Calculate taxes and deductions
  const socialSecurity = calculateSocialSecurity(grossTotal);
  const incomeTax = calculateIncomeTax(grossTotal - socialSecurity); // Tax after social security
  const totalDeductions = socialSecurity + incomeTax;
  const netIncome = grossTotal - totalDeductions;

  const taxes: TaxCalculation = {
    socialSecurity,
    incomeTax,
    totalDeductions,
    netIncome
  };

  return {
    income,
    taxes,
    grossIncome: grossTotal,
    netIncome
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}
