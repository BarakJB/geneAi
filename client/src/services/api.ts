import { PensionClientData } from '../types/pension';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CustomerImportRequest {
  personalInfo: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
    id: string;
    birthDate: string;
    address?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    numberOfChildren?: number;
    gender?: 'male' | 'female';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  };
  pensionData: any;
  agencyId?: number;
}

export interface CustomerResponse {
  customer_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  id_number: string;
  birth_date: string;
  address?: string;
  city?: string;
  street?: string;
  house_number?: string;
  zip_code?: string;
  number_of_children?: number;
  gender?: string;
  marital_status?: string;
  customer_status: string;
  pension_id?: string;
  total_balance?: number;
  monthly_deposit?: number;
  employer_name?: string;
  policy_number?: string;
  pensionData?: any;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Import pension data and create/update customer
  async importPensionData(data: CustomerImportRequest): Promise<ApiResponse<{ customerId: string; pensionId: string }>> {
    return this.makeRequest('/customers/import-pension', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Find customer by phone number
  async findCustomerByPhone(phone: string, agencyId: number = 1): Promise<ApiResponse<CustomerResponse>> {
    return this.makeRequest(`/customers/by-phone/${encodeURIComponent(phone)}?agencyId=${agencyId}`);
  }

  // Get customer details by ID
  async getCustomerById(customerId: string): Promise<ApiResponse<CustomerResponse>> {
    return this.makeRequest(`/customers/${customerId}`);
  }

  // Get all customers for agency
  async getCustomersByAgency(
    agencyId: number = 1, 
    status?: string, 
    search?: string
  ): Promise<ApiResponse<CustomerResponse[]>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/customers/agency/${agencyId}?${queryString}`
      : `/customers/agency/${agencyId}`;
    
    return this.makeRequest(endpoint);
  }

  // Ask assistant with grounded customer data
  async askAssistant(params: { question: string; customerId?: string; phone?: string }): Promise<ApiResponse<{ answer: string }>> {
    return this.makeRequest('/assistant/ask', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  // Convert API customer response to PensionClientData format
  convertApiCustomerToPensionClient(apiCustomer: CustomerResponse): PensionClientData {
    return {
      id: apiCustomer.customer_id,
      personalInfo: {
        id: apiCustomer.id_number,
        firstName: apiCustomer.first_name,
        lastName: apiCustomer.last_name,
        birthDate: apiCustomer.birth_date,
        phoneNumber: apiCustomer.phone,
        email: apiCustomer.email,
        address: apiCustomer.address,
        city: apiCustomer.city,
        street: apiCustomer.street,
        houseNumber: apiCustomer.house_number,
        zipCode: apiCustomer.zip_code,
        numberOfChildren: apiCustomer.number_of_children,
        gender: apiCustomer.gender as 'male' | 'female',
        maritalStatus: apiCustomer.marital_status as 'single' | 'married' | 'divorced' | 'widowed'
      },
      employmentHistory: apiCustomer.pensionData?.employmentHistory || [],
      pensionContributions: apiCustomer.pensionData?.pensionContributions || [],
      savingsInsurance: apiCustomer.pensionData?.savingsInsurance || [],
      studyFunds: apiCustomer.pensionData?.studyFunds || [],
      disabilityInsurance: apiCustomer.pensionData?.disabilityInsurance || [],
      summary: apiCustomer.pensionData?.summary || {
        totalBalance: apiCustomer.total_balance || 0,
        monthlyDeposit: apiCustomer.monthly_deposit || 0,
        expectedRetirementAge: 67,
        yearsToRetirement: 0,
        projectedPension: 0
      },
      xmlFileName: apiCustomer.pensionData?.xmlFileName || '',
      importDate: apiCustomer.pensionData?.importDate || new Date().toISOString(),
      // Include detailed XML data if available
      xmlHeader: apiCustomer.pensionData?.xmlHeader,
      producerEntity: apiCustomer.pensionData?.producerEntity,
      employerInfo: apiCustomer.pensionData?.employerInfo,
      policyInfo: apiCustomer.pensionData?.policyInfo,
      insuranceCoverage: apiCustomer.pensionData?.insuranceCoverage,
      paymentInfo: apiCustomer.pensionData?.paymentInfo,
      lastDepositInfo: apiCustomer.pensionData?.lastDepositInfo,
      annualDeposits: apiCustomer.pensionData?.annualDeposits,
      debtsArrears: apiCustomer.pensionData?.debtsArrears,
      managementFeesStructure: apiCustomer.pensionData?.managementFeesStructure,
      expensesDetails: apiCustomer.pensionData?.expensesDetails
    };
  }

  // Convert PensionClientData to API format
  convertPensionClientToApiFormat(client: PensionClientData): CustomerImportRequest {
    return {
      personalInfo: {
        firstName: client.personalInfo.firstName,
        lastName: client.personalInfo.lastName,
        phoneNumber: client.personalInfo.phoneNumber,
        email: client.personalInfo.email,
        id: client.personalInfo.id,
        birthDate: client.personalInfo.birthDate,
        address: client.personalInfo.address,
        city: client.personalInfo.city,
        street: client.personalInfo.street,
        houseNumber: client.personalInfo.houseNumber,
        zipCode: client.personalInfo.zipCode,
        numberOfChildren: client.personalInfo.numberOfChildren,
        gender: client.personalInfo.gender,
        maritalStatus: client.personalInfo.maritalStatus
      },
      pensionData: {
        xmlFileName: client.xmlFileName,
        importDate: client.importDate,
        summary: client.summary,
        employmentHistory: client.employmentHistory,
        pensionContributions: client.pensionContributions,
        savingsInsurance: client.savingsInsurance,
        studyFunds: client.studyFunds,
        disabilityInsurance: client.disabilityInsurance,
        // Include detailed XML data
        xmlHeader: client.xmlHeader,
        producerEntity: client.producerEntity,
        employerInfo: client.employerInfo,
        policyInfo: client.policyInfo,
        insuranceCoverage: client.insuranceCoverage,
        paymentInfo: client.paymentInfo,
        lastDepositInfo: client.lastDepositInfo,
        annualDeposits: client.annualDeposits,
        debtsArrears: client.debtsArrears,
        managementFeesStructure: client.managementFeesStructure,
        expensesDetails: client.expensesDetails
      }
    };
  }
}

export const apiService = new ApiService();
export default apiService;
