// Types for Israeli pension data based on common XML structures

export interface PersonalInfo {
  id: string; // תעודת זהות
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  zipCode?: string;
  numberOfChildren?: number;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
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
  // New fields for detailed XML data
  xmlHeader?: XmlHeader;
  producerEntity?: ProducerEntity;
  employerInfo?: EmployerInfo;
  policyInfo?: PolicyInfo;
  insuranceCoverage?: InsuranceCoverage[];
  paymentInfo?: PaymentInfo;
  lastDepositInfo?: LastDepositInfo;
  annualDeposits?: AnnualDeposits;
  debtsArrears?: DebtsArrears;
  managementFeesStructure?: ManagementFeesStructure[];
  expensesDetails?: ExpensesDetails;
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

// XML Header Information
export interface XmlHeader {
  documentType: string;
  xmlVersion: string;
  executionDate: string;
  workEnvironmentCode: string;
  senderCode: string;
  senderName: string;
  handlerCode: string;
  handlerName: string;
  transferId: string;
  fileNumber: string;
}

// Producer Entity Information
export interface ProducerEntity {
  producerCode: string;
  producerName: string;
  clearingCustomerId: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

// Employer Information
export interface EmployerInfo {
  employerNumber: string;
  employerIdType: string;
  employerId: string;
  employerName: string;
  address: {
    city: string;
    cityCode: string;
    street: string;
    houseNumber: string;
    zipCode: string;
  };
  phone: string;
  mobile: string;
  email: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    phone: string;
    mobile: string;
    email: string;
  };
}

// Policy/Account Information
export interface PolicyInfo {
  originalReference: string;
  policyNumber: string;
  programName: string;
  uniqueCode: string;
  distributorNumber: string;
  effectiveDate: string;
  joinDate: string;
  firstJoinDate: string;
  pensionFundType?: string;
  oldOrNewPension?: string;
  statusUpdateDate: string;
  policyStatus: string;
  insured?: string;
  policyType: string;
  programType: string;
  baseIndex: number;
  indexLinking: string;
  lastPaymentDate: string;
  includesDisabilityRights: string;
  disabilityPercentage?: number;
  correction190: string;
  externalCoverage?: string;
  personalOrGroup?: string;
}

// Insurance Coverage Information
export interface InsuranceCoverage {
  coverageNumber: string;
  coverageName: string;
  coverageType: string;
  oppositePolicy?: string;
  insuredInfo: {
    idType: string;
    idNumber: string;
  };
  basicInsuranceAmounts: {
    productCode: string;
    amountIndexingType: string;
    premiumIndexingType: string;
    insuranceTrack?: string;
    includesSavings: string;
    trackInsuranceAmount: number;
    numberOfSources: number;
    savingsAllocationPercentage: number;
    deathCoverageLimit: number;
    deathInsuranceAmount: number;
  };
  coverageDetails: {
    productCode: string;
    insuredType: string;
    insuranceCoverageType: string;
    coverageStartDate: string;
    coverageEndDate: string;
    appendixCode: string;
    paymentMethod: string;
    insuranceAmount: number;
    paymentFrequency: string;
    premiumAmount: number;
  };
  premiumDevelopment: Array<{
    startPeriod: string;
    endPeriod: string;
    expectedPremium: number;
  }>;
  insuranceAmountDevelopment: Array<{
    startPeriod: string;
    endPeriod: string;
    expectedRate: number;
    expectedAmount: number;
  }>;
  discountDetails: Array<{
    startPeriod: string;
    endPeriod: string;
    discountRate: number;
    discountAmount: number;
  }>;
}

// Payment Information
export interface PaymentInfo {
  payerName: string;
  payerIdType: string;
  payerId: string;
  paymentMethod: string;
  paymentFrequency: string;
  referenceMonth: string;
  collectionDay: string;
  collectionIndexing: string;
  annualSubsidyPercentage: number;
}

// Last Deposit Information
export interface LastDepositInfo {
  lastDepositDate: string;
  totalDeposit: number;
  depositToAccountA: number;
  depositToAccountB: number;
  depositValueDate: string;
  depositType: string;
  totalLastDeposit: number;
}

// Annual Deposits
export interface AnnualDeposits {
  totalEmployeeDeposits: number;
  totalEmployerDeposits: number;
  totalCompensationDeposits: number;
}

// Debts and Arrears
export interface DebtsArrears {
  hasDebtOrArrears: string;
  arrearsStartDate: string;
  currentArrearsStartDate?: string;
  monthsOfArrears: number;
  debtType: string;
  totalDebtsOrArrears: number;
  unallocatedEmployerFunds: string;
}

// Management Fees Structure
export interface ManagementFeesStructure {
  feeCalculationBasedOnActualExpenses: string;
  expenseType: string;
  feeTrackCode: string;
  trackCharacteristics: string;
  managementFeeRate: number;
  feeUpdateDate: string;
  fixedManagementFees: number;
  investmentTrackCode?: string;
  allocationMethod: string;
  maxDepositFee?: number;
  totalTrackFees?: number;
  otherManagementFees: number;
  withdrawalPenalty: string;
}

// Expenses Details
export interface ExpensesDetails {
  depositManagementFeeRate: number;
  totalDepositManagementFees: number;
  accumulationManagementFeeRate: number;
  totalAccumulationManagementFees: number;
  otherManagementFeesTotal: number;
  investmentManagementExpenses?: number;
  totalPolicyManagementFees: number;
  trackTransferFees?: number;
  portfolioManagementFees?: number;
  averageDepositManagementFeeRate: number;
  averageTotalDepositManagementFees: number;
  insurancePremiumCollectionMethod: string;
  totalInsurancePremiumsCollected: number;
}

// All interfaces are already exported above, no need for duplicate exports