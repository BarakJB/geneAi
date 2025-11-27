import { SalaryInput } from '../types/salaryCalculator';
import { COMPANY_RATES } from './salaryCalculator';

/**
 * Example salary calculation scenarios for demonstration
 */

// Example 1: Basic portfolio - low amounts
export const EXAMPLE_BASIC_PORTFOLIO: SalaryInput = {
  pensionProducts: [
    {
      monthlyDeposit: 3000,
      managementFeesAmount: 2000, // מתוך 3000₪ - 2000₪ דמי ניהול שהבאת
      totalAccumulation: 50000,
      companyRates: COMPANY_RATES.harel.pension
    },
    {
      monthlyDeposit: 2500,
      managementFeesAmount: 1800, // מתוך 2500₪ - 1800₪ דמי ניהול שהבאת
      totalAccumulation: 30000,
      companyRates: COMPANY_RATES.clal.pension
    }
  ],
  financeProducts: [
    {
      totalAccumulation: 300000,
      companyRates: COMPANY_RATES.harel.finance
    },
    {
      totalAccumulation: 200000,
      companyRates: COMPANY_RATES.migdal.finance
    }
  ],
  lifeInsuranceProducts: [
    {
      monthlyPremium: 250,
      companyRates: COMPANY_RATES.harel.lifeInsurance
    },
    {
      monthlyPremium: 180,
      companyRates: COMPANY_RATES.clal.lifeInsurance
    }
  ],
  healthInsuranceProducts: [
    {
      monthlyPremium: 300,
      companyRates: COMPANY_RATES.harel.healthInsurance
    },
    {
      monthlyPremium: 250,
      companyRates: COMPANY_RATES.menora.healthInsurance
    }
  ],
  agentAppointments: [
    {
      type: 'pension',
      monthlyValue: 2000,
      accumulationValue: 100000,
      ongoingRate: 0.005,
      hasOneTimeCommission: true,
      oneTimeCommissionRate: 0.02 // 2% עמלה חד-פעמית על הצבירה
    }
  ]
};

// Example 2: Medium portfolio - medium amounts
export const EXAMPLE_MEDIUM_PORTFOLIO: SalaryInput = {
  pensionProducts: [
    {
      monthlyDeposit: 8000,
      managementFeesAmount: 6000, // מתוך 8000₪ - 6000₪ דמי ניהול שהבאת
      totalAccumulation: 400000,
      companyRates: COMPANY_RATES.harel.pension
    },
    {
      monthlyDeposit: 6500,
      managementFeesAmount: 5000, // מתוך 6500₪ - 5000₪ דמי ניהול שהבאת
      totalAccumulation: 300000,
      companyRates: COMPANY_RATES.clal.pension
    },
    {
      monthlyDeposit: 5000,
      managementFeesAmount: 3500, // מתוך 5000₪ - 3500₪ דמי ניהול שהבאת
      totalAccumulation: 250000,
      companyRates: COMPANY_RATES.menora.pension
    }
  ],
  financeProducts: [
    {
      totalAccumulation: 1200000,
      companyRates: COMPANY_RATES.harel.finance
    },
    {
      totalAccumulation: 800000,
      companyRates: COMPANY_RATES.clal.finance
    },
    {
      totalAccumulation: 600000,
      companyRates: COMPANY_RATES.migdal.finance
    }
  ],
  lifeInsuranceProducts: [
    {
      monthlyPremium: 500,
      companyRates: COMPANY_RATES.harel.lifeInsurance
    },
    {
      monthlyPremium: 400,
      companyRates: COMPANY_RATES.clal.lifeInsurance
    },
    {
      monthlyPremium: 350,
      companyRates: COMPANY_RATES.menora.lifeInsurance
    }
  ],
  healthInsuranceProducts: [
    {
      monthlyPremium: 450,
      companyRates: COMPANY_RATES.harel.healthInsurance
    },
    {
      monthlyPremium: 380,
      companyRates: COMPANY_RATES.clal.healthInsurance
    },
    {
      monthlyPremium: 320,
      companyRates: COMPANY_RATES.phoenix.healthInsurance
    }
  ],
  agentAppointments: [
    {
      type: 'pension',
      monthlyValue: 4000,
      accumulationValue: 200000,
      ongoingRate: 0.006
    },
    {
      type: 'finance',
      monthlyValue: 0,
      accumulationValue: 500000,
      ongoingRate: 0.002
    },
    {
      type: 'lifeInsurance',
      monthlyValue: 250,
      ongoingRate: 0.22
    }
  ]
};

// Example 3: Large portfolio - high amounts
export const EXAMPLE_LARGE_PORTFOLIO: SalaryInput = {
  pensionProducts: [
    {
      monthlyDeposit: 15000,
      managementFeesAmount: 12000, // מתוך 15000₪ - 12000₪ דמי ניהול שהבאת
      totalAccumulation: 1200000,
      companyRates: COMPANY_RATES.harel.pension
    },
    {
      monthlyDeposit: 12000,
      managementFeesAmount: 9000, // מתוך 12000₪ - 9000₪ דמי ניהול שהבאת
      totalAccumulation: 900000,
      companyRates: COMPANY_RATES.clal.pension
    },
    {
      monthlyDeposit: 10000,
      managementFeesAmount: 7000, // מתוך 10000₪ - 7000₪ דמי ניהול שהבאת
      totalAccumulation: 700000,
      companyRates: COMPANY_RATES.menora.pension
    },
    {
      monthlyDeposit: 8000,
      managementFeesAmount: 5500, // מתוך 8000₪ - 5500₪ דמי ניהול שהבאת
      totalAccumulation: 500000,
      companyRates: COMPANY_RATES.migdal.pension
    }
  ],
  financeProducts: [
    {
      totalAccumulation: 3000000,
      companyRates: COMPANY_RATES.harel.finance
    },
    {
      totalAccumulation: 2200000,
      companyRates: COMPANY_RATES.clal.finance
    },
    {
      totalAccumulation: 1800000,
      companyRates: COMPANY_RATES.menora.finance
    },
    {
      totalAccumulation: 1500000,
      companyRates: COMPANY_RATES.migdal.finance
    }
  ],
  lifeInsuranceProducts: [
    {
      monthlyPremium: 900,
      companyRates: COMPANY_RATES.harel.lifeInsurance
    },
    {
      monthlyPremium: 750,
      companyRates: COMPANY_RATES.clal.lifeInsurance
    },
    {
      monthlyPremium: 600,
      companyRates: COMPANY_RATES.menora.lifeInsurance
    },
    {
      monthlyPremium: 500,
      companyRates: COMPANY_RATES.migdal.lifeInsurance
    }
  ],
  healthInsuranceProducts: [
    {
      monthlyPremium: 650,
      companyRates: COMPANY_RATES.harel.healthInsurance
    },
    {
      monthlyPremium: 550,
      companyRates: COMPANY_RATES.clal.healthInsurance
    },
    {
      monthlyPremium: 450,
      companyRates: COMPANY_RATES.menora.healthInsurance
    },
    {
      monthlyPremium: 400,
      companyRates: COMPANY_RATES.phoenix.healthInsurance
    }
  ],
  agentAppointments: [
    {
      type: 'pension',
      monthlyValue: 8000,
      accumulationValue: 600000,
      ongoingRate: 0.006
    },
    {
      type: 'pension',
      monthlyValue: 6000,
      accumulationValue: 450000,
      ongoingRate: 0.0055
    },
    {
      type: 'finance',
      monthlyValue: 0,
      accumulationValue: 800000,
      ongoingRate: 0.002
    },
    {
      type: 'lifeInsurance',
      monthlyValue: 450,
      ongoingRate: 0.25
    },
    {
      type: 'healthInsurance',
      monthlyValue: 350,
      ongoingRate: 0.19
    }
  ]
};

export const EXAMPLE_SCENARIOS = {
  'basic-portfolio': {
    name: 'פורטפוליו בסיסי',
    description: 'דוגמה עם כל סוגי המוצרים - סכומים נמוכים',
    data: EXAMPLE_BASIC_PORTFOLIO
  },
  'medium-portfolio': {
    name: 'פורטפוליו בינוני',
    description: 'דוגמה עם כל סוגי המוצרים - סכומים בינוניים',
    data: EXAMPLE_MEDIUM_PORTFOLIO
  },
  'large-portfolio': {
    name: 'פורטפוליו גדול',
    description: 'דוגמה עם כל סוגי המוצרים - סכומים גבוהים',
    data: EXAMPLE_LARGE_PORTFOLIO
  }
};
