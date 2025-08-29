// Types for Israeli pension data based on common XML structures

export interface PersonalInfo {
  id: string; // תעודת זהות
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface EmploymentPeriod {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  salary?: number;
}

export interface PensionContribution {
  id: string;
  fundName: string;
  contributionDate: string;
  employeeAmount: number;
  employerAmount: number;
  totalAmount: number;
  accumulatedBalance?: number;
}

export interface SavingsInsurance {
  id: string;
  policyNumber: string;
  insuranceCompany: string;
  startDate: string;
  endDate?: string;
  monthlyDeposit: number;
  accumulatedAmount: number;
  isActive: boolean;
}

export interface StudyFund {
  id: string;
  fundName: string;
  fundNumber?: string;
  startDate: string;
  endDate?: string;
  monthlyDeposit: number;
  accumulatedAmount: number;
  isActive: boolean;
}

export interface DisabilityInsurance {
  id: string;
  policyNumber: string;
  insuranceCompany: string;
  startDate: string;
  endDate?: string;
  monthlyPremium: number;
  coverageAmount: number;
  isActive: boolean;
}

export interface PensionSummary {
  totalPensionBalance: number;
  totalSavingsBalance: number;
  totalStudyFundBalance: number;
  monthlyPensionContribution: number;
  monthlySavingsContribution: number;
  monthlyStudyFundContribution: number;
  lastUpdateDate: string;
}

export interface XMLParsingResult {
  fileName: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  clientData: PensionClientData | null;
}

export interface PensionClientData {
  id: string;
  personalInfo: PersonalInfo;
  employmentHistory: EmploymentPeriod[];
  pensionContributions: PensionContribution[];
  savingsInsurance: SavingsInsurance[];
  studyFunds: StudyFund[];
  disabilityInsurance: DisabilityInsurance[];
  summary: PensionSummary;
  xmlFileName: string;
  importDate: string;
}

export interface SearchFilters {
  searchTerm: string;
  ageRange?: { min: number; max: number };
  pensionBalanceRange?: { min: number; max: number };
  employmentStatus: 'all' | 'employed' | 'unemployed';
  fundNames: string[];
  sortBy: 'name' | 'age' | 'pensionBalance' | 'importDate';
  sortOrder: 'asc' | 'desc';
}

export interface XMLFieldMapping {
  personal: {
    firstName: string[];
    lastName: string[];
    idNumber: string[];
    birthDate: string[];
    phone: string[];
    email: string[];
    address: string[];
  };
  employment: {
    employerName: string[];
    startDate: string[];
    endDate: string[];
    salary: string[];
  };
  pension: {
    contributionDate: string[];
    employeeAmount: string[];
    employerAmount: string[];
    fundName: string[];
  };
}

// Explicit exports to ensure proper module resolution
export type {
  PersonalInfo,
  EmploymentPeriod,
  PensionContribution,
  SavingsInsurance,
  StudyFund,
  DisabilityInsurance,
  PensionSummary,
  XMLParsingResult,
  PensionClientData,
  SearchFilters,
  XMLFieldMapping
};