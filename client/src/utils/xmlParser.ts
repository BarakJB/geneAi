import { 
  PensionClientData, 
  PersonalInfo, 
  EmploymentPeriod, 
  PensionContribution, 
  SavingsInsurance,
  StudyFund,
  DisabilityInsurance,
  PensionSummary,
  XMLParsingResult 
} from '../types/pension';

export class PensionXMLParser {
  static parseXML(xmlDoc: Document, fileName: string): PensionClientData | null {
    try {
      // Mock implementation for demonstration
      const personalInfo: PersonalInfo = {
        id: '123456789',
        firstName: 'מוק',
        lastName: 'דאטה',
        birthDate: '1990-01-01',
        phoneNumber: '050-1234567',
        email: 'mock@example.com',
        address: 'תל אביב'
      };

      const summary: PensionSummary = {
        totalPensionBalance: 100000,
        totalSavingsBalance: 0,
        totalStudyFundBalance: 0,
        monthlyPensionContribution: 2500,
        monthlySavingsContribution: 0,
        monthlyStudyFundContribution: 0,
        lastUpdateDate: new Date().toISOString()
      };

      return {
        id: `client-${Date.now()}`,
        personalInfo,
        employmentHistory: [],
        pensionContributions: [],
        savingsInsurance: [],
        studyFunds: [],
        disabilityInsurance: [],
        summary,
        xmlFileName: fileName,
        importDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing XML:', error);
      return null;
    }
  }

  private static parseDate(dateString: string): string | undefined {
    if (!dateString) return undefined;
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
    } catch {
      return undefined;
    }
  }

  private static parseNumber(numberString: string): number {
    if (!numberString) return 0;
    const cleaned = numberString.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}

// Utility functions for formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL').format(date);
  } catch {
    return dateString;
  }
}

export function calculateAge(birthDate: string): number {
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch {
    return 0;
  }
}