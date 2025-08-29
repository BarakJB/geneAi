import { PensionClientData } from '../types/pension';

// Global clients store
class ClientStore {
  private clients: PensionClientData[] = [];
  private listeners: (() => void)[] = [];

  // Mock initial data
  constructor() {
    this.clients = [
      {
        id: 'client-1',
        personalInfo: {
          id: '123456789',
          firstName: 'ישראל',
          lastName: 'ישראלי',
          birthDate: '1985-06-15',
          phoneNumber: '052-1234567',
          email: 'israel@example.com',
          address: 'תל אביב'
        },
        employmentHistory: [
          {
            id: 'emp-1',
            companyName: 'חברת היי-טק',
            position: 'מהנדס תוכנה',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
            salary: 25000
          }
        ],
        pensionContributions: [
          {
            id: 'pension-1',
            fundName: 'מגדל מקפת',
            contributionDate: '2024-01-01',
            employeeAmount: 1750,
            employerAmount: 2062.5,
            totalAmount: 3812.5,
            accumulatedBalance: 150000
          }
        ],
        savingsInsurance: [],
        studyFunds: [],
        disabilityInsurance: [
          {
            id: 'disability-1',
            policyNumber: 'POL123456',
            insuranceCompany: 'הפניקס',
            startDate: '2020-01-01',
            monthlyPremium: 250,
            coverageAmount: 15000,
            isActive: true
          }
        ],
        summary: {
          totalPensionBalance: 150000,
          totalSavingsBalance: 0,
          totalStudyFundBalance: 0,
          monthlyPensionContribution: 3812.5,
          monthlySavingsContribution: 0,
          monthlyStudyFundContribution: 0,
          lastUpdateDate: '2024-01-01'
        },
        xmlFileName: 'israel_pension_data.xml',
        importDate: '2024-01-15'
      },
      {
        id: 'client-2',
        personalInfo: {
          id: '987654321',
          firstName: 'שרה',
          lastName: 'כהן',
          birthDate: '1990-03-22',
          phoneNumber: '054-9876543',
          email: 'sarah@example.com',
          address: 'ירושלים'
        },
        employmentHistory: [
          {
            id: 'emp-2',
            companyName: 'בנק ישראל',
            position: 'יועצת כלכלית',
            startDate: '2018-06-01',
            endDate: '2023-12-31',
            salary: 18000
          }
        ],
        pensionContributions: [
          {
            id: 'pension-2',
            fundName: 'הראל פנסיה',
            contributionDate: '2023-12-01',
            employeeAmount: 1260,
            employerAmount: 1485,
            totalAmount: 2745,
            accumulatedBalance: 95000
          }
        ],
        savingsInsurance: [],
        studyFunds: [],
        disabilityInsurance: [
          {
            id: 'disability-2',
            policyNumber: 'POL789012',
            insuranceCompany: 'מגדל',
            startDate: '2018-06-01',
            monthlyPremium: 180,
            coverageAmount: 12000,
            isActive: true
          }
        ],
        summary: {
          totalPensionBalance: 95000,
          totalSavingsBalance: 0,
          totalStudyFundBalance: 0,
          monthlyPensionContribution: 2745,
          monthlySavingsContribution: 0,
          monthlyStudyFundContribution: 0,
          lastUpdateDate: '2023-12-01'
        },
        xmlFileName: 'sarah_pension_data.xml',
        importDate: '2024-01-10'
      }
    ];
  }

  // Get all clients
  getClients(): PensionClientData[] {
    return [...this.clients];
  }

  // Get client by ID
  getClientById(id: string): PensionClientData | undefined {
    return this.clients.find(client => client.personalInfo.id === id);
  }

  // Add new client
  addClient(client: PensionClientData): void {
    // Check if client already exists
    const existingIndex = this.clients.findIndex(c => c.personalInfo.id === client.personalInfo.id);
    
    if (existingIndex !== -1) {
      // Update existing client
      this.clients[existingIndex] = client;
    } else {
      // Add new client
      this.clients.push(client);
    }
    
    this.notifyListeners();
  }

  // Remove client
  removeClient(id: string): void {
    this.clients = this.clients.filter(client => client.personalInfo.id !== id);
    this.notifyListeners();
  }

  // Search clients
  searchClients(query: string): PensionClientData[] {
    if (!query.trim()) return this.clients;
    
    const lowerQuery = query.toLowerCase();
    return this.clients.filter(client => 
      client.personalInfo.firstName.toLowerCase().includes(lowerQuery) ||
      client.personalInfo.lastName.toLowerCase().includes(lowerQuery) ||
      client.personalInfo.id.includes(lowerQuery) ||
      client.personalInfo.phoneNumber.includes(lowerQuery) ||
      client.personalInfo.email.toLowerCase().includes(lowerQuery) ||
      client.employmentHistory.some(emp => 
        emp.companyName.toLowerCase().includes(lowerQuery) ||
        emp.position.toLowerCase().includes(lowerQuery)
      ) ||
      client.pensionContributions.some(pension => 
        pension.fundName.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create global instance
export const clientStore = new ClientStore();

// React hook for using the store
import { useState, useEffect } from 'react';

export const useClientStore = () => {
  const [clients, setClients] = useState<PensionClientData[]>(clientStore.getClients());

  useEffect(() => {
    const unsubscribe = clientStore.subscribe(() => {
      setClients(clientStore.getClients());
    });

    return unsubscribe;
  }, []);

  return {
    clients,
    addClient: (client: PensionClientData) => clientStore.addClient(client),
    removeClient: (id: string) => clientStore.removeClient(id),
    getClientById: (id: string) => clientStore.getClientById(id),
    searchClients: (query: string) => clientStore.searchClients(query)
  };
};
