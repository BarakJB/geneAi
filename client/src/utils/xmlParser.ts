import { 
  PensionClientData, 
  PersonalInfo, 
  EmploymentPeriod, 
  PensionContribution, 
  PensionSummary, 
  XmlHeader,
  ProducerEntity,
  EmployerInfo,
  PolicyInfo,
  InsuranceCoverage,
  PaymentInfo,
  LastDepositInfo,
  AnnualDeposits,
  DebtsArrears,
  ManagementFeesStructure,
  ExpensesDetails
} from '../types/pension';

export class PensionXMLParser {
  static parseXML(_xmlDoc: Document, fileName: string): PensionClientData | null {
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

// Enhanced XML Parser for detailed pension clearing house data
export class EnhancedPensionXMLParser {
  static parseDetailedXML(xmlDoc: Document, fileName: string): PensionClientData | null {
    try {
      // Parse all sections of the pension XML
      const xmlHeader = this.parseXmlHeader(xmlDoc);
      const producerEntity = this.parseProducerEntity(xmlDoc);
      const employerInfo = this.parseEmployerInfo(xmlDoc);
      const personalInfo = this.parsePersonalInfoFromXML(xmlDoc);
      const policyInfo = this.parsePolicyInfo(xmlDoc);
      const insuranceCoverage = this.parseInsuranceCoverage(xmlDoc);
      const paymentInfo = this.parsePaymentInfo(xmlDoc);
      const lastDepositInfo = this.parseLastDepositInfo(xmlDoc);
      const annualDeposits = this.parseAnnualDeposits(xmlDoc);
      const debtsArrears = this.parseDebtsArrears(xmlDoc);
      const managementFeesStructure = this.parseManagementFeesStructure(xmlDoc);
      const expensesDetails = this.parseExpensesDetails(xmlDoc);
      
      // Create summary from parsed data
      const summary = this.calculateSummaryFromXML(lastDepositInfo, annualDeposits);

      return {
        id: `client-${personalInfo.id}-${Date.now()}`,
        personalInfo,
        employmentHistory: employerInfo ? [this.createEmploymentFromEmployer(employerInfo)] : [],
        pensionContributions: this.createPensionContributionsFromXML(lastDepositInfo),
        disabilityInsurance: [],
        savingsInsurance: [],
        studyFunds: [],
        summary,
        xmlFileName: fileName,
        importDate: new Date().toISOString(),
        // New detailed XML data
        xmlHeader,
        producerEntity,
        employerInfo,
        policyInfo,
        insuranceCoverage,
        paymentInfo,
        lastDepositInfo,
        annualDeposits,
        debtsArrears,
        managementFeesStructure,
        expensesDetails
      };
    } catch (error) {
      console.error('Error parsing detailed XML:', error);
      return null;
    }
  }

  private static parsePersonalInfoFromXML(xmlDoc: Document): PersonalInfo {
    const customer = xmlDoc.querySelector('YeshutLakoach');
    
    return {
      id: this.getTextContent(customer, 'MISPAR-ZIHUY-LAKOACH') || '',
      firstName: this.getTextContent(customer, 'SHEM-PRATI') || '',
      lastName: this.getTextContent(customer, 'SHEM-MISHPACHA') || '',
      birthDate: this.formatDate(this.getTextContent(customer, 'TAARICH-LEYDA') || ''),
      phoneNumber: this.getTextContent(customer, 'MISPAR-TELEPHONE-KAVI') || this.getTextContent(customer, 'MISPAR-CELLULARI') || undefined,
      email: this.getTextContent(customer, 'E-MAIL') || undefined,
      address: this.buildAddress(customer),
      city: this.getTextContent(customer, 'SHEM-YISHUV') || undefined,
      street: this.getTextContent(customer, 'SHEM-RECHOV') || undefined,
      houseNumber: this.getTextContent(customer, 'MISPAR-BAIT') || undefined,
      zipCode: this.getTextContent(customer, 'MIKUD') || undefined,
      numberOfChildren: parseInt(this.getTextContent(customer, 'MISPAR-YELADIM') || '0'),
      gender: this.getTextContent(customer, 'MIN') === '1' ? 'male' : 'female',
      maritalStatus: this.parseMaritalStatus(this.getTextContent(customer, 'MATZAV-MISHPACHTI') || '')
    };
  }

  private static buildAddress(customer: Element | null): string {
    if (!customer) return '';
    
    const parts = [
      this.getTextContent(customer, 'SHEM-RECHOV'),
      this.getTextContent(customer, 'MISPAR-BAIT'),
      this.getTextContent(customer, 'SHEM-YISHUV'),
      this.getTextContent(customer, 'MIKUD')
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  private static parseMaritalStatus(status: string): 'single' | 'married' | 'divorced' | 'widowed' {
    switch (status) {
      case '1': return 'single';
      case '2': return 'married';
      case '3': return 'divorced';
      case '4': return 'widowed';
      default: return 'single';
    }
  }

  private static formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  }

  private static createEmploymentFromEmployer(employerInfo: EmployerInfo): EmploymentPeriod {
    return {
      id: `emp-${employerInfo.employerId}`,
      companyName: employerInfo.employerName,
      position: 'עובד',
      startDate: new Date().toISOString().split('T')[0],
      salary: 0
    };
  }

  private static createPensionContributionsFromXML(
    lastDeposit: LastDepositInfo | undefined
  ): PensionContribution[] {
    const contributions: PensionContribution[] = [];
    
    if (lastDeposit) {
      contributions.push({
        id: `contrib-${Date.now()}`,
        fundName: 'קרן פנסיה',
        contributionDate: this.formatDate(lastDeposit.lastDepositDate),
        employeeAmount: lastDeposit.totalDeposit * 0.6, // Estimate employee portion
        employerAmount: lastDeposit.totalDeposit * 0.4, // Estimate employer portion
        totalAmount: lastDeposit.totalDeposit,
        accumulatedBalance: lastDeposit.totalDeposit
      });
    }
    
    return contributions;
  }

  private static calculateSummaryFromXML(
    lastDeposit: LastDepositInfo | undefined,
    annualDeposits: AnnualDeposits | undefined
  ): PensionSummary {
    const totalPensionBalance = lastDeposit?.totalDeposit || 0;
    const monthlyContribution = annualDeposits ? 
      (annualDeposits.totalEmployeeDeposits + annualDeposits.totalEmployerDeposits) / 12 : 0;

    return {
      totalPensionBalance,
      totalSavingsBalance: 0,
      totalStudyFundBalance: 0,
      monthlyPensionContribution: monthlyContribution,
      monthlySavingsContribution: 0,
      monthlyStudyFundContribution: 0,
      lastUpdateDate: new Date().toISOString()
    };
  }

  // All the detailed parsing methods from the previous implementation
  private static parseXmlHeader(xmlDoc: Document): XmlHeader | undefined {
    const header = xmlDoc.querySelector('KoteretKovetz');
    if (!header) return undefined;

    return {
      documentType: this.getTextContent(header, 'SUG-MIMSHAK') || '',
      xmlVersion: this.getTextContent(header, 'MISPAR-GIRSAT-XML') || '',
      executionDate: this.getTextContent(header, 'TAARICH-BITZUA') || '',
      workEnvironmentCode: this.getTextContent(header, 'KOD-SVIVAT-AVODA') || '',
      senderCode: this.getTextContent(header, 'KOD-SHOLEACH') || '',
      senderName: this.getTextContent(header, 'SHEM-SHOLEACH') || '',
      handlerCode: this.getTextContent(header, 'KOD-MEZAHE-METAFEL') || '',
      handlerName: this.getTextContent(header, 'SHEM-METAFEL') || '',
      transferId: this.getTextContent(header, 'MEZAHE-HAAVARA') || '',
      fileNumber: this.getTextContent(header, 'MISPAR-HAKOVETZ') || ''
    };
  }

  private static parseProducerEntity(xmlDoc: Document): ProducerEntity | undefined {
    const producer = xmlDoc.querySelector('YeshutYatzran');
    if (!producer) return undefined;

    const contactPerson = producer.querySelector('IshKesherYeshutYatzran');

    return {
      producerCode: this.getTextContent(producer, 'KOD-MEZAHE-YATZRAN') || '',
      producerName: this.getTextContent(producer, 'SHEM-YATZRAN') || '',
      clearingCustomerId: this.getTextContent(producer, 'MEZAHE-LAKOACH-MISLAKA') || '',
      contactPerson: {
        firstName: this.getTextContent(contactPerson, 'SHEM-PRATI') || '',
        lastName: this.getTextContent(contactPerson, 'SHEM-MISHPACHA') || '',
        phone: this.getTextContent(contactPerson, 'MISPAR-TELEPHONE-KAVI') || '',
        email: this.getTextContent(contactPerson, 'E-MAIL') || ''
      }
    };
  }

  private static parseEmployerInfo(xmlDoc: Document): EmployerInfo | undefined {
    const employer = xmlDoc.querySelector('YeshutMaasik');
    if (!employer) return undefined;

    const contactPerson = employer.querySelector('IshKesherYeshutMaasik');

    return {
      employerNumber: this.getTextContent(employer, 'MPR-MAASIK-BE-YATZRAN') || '',
      employerIdType: this.getTextContent(employer, 'SUG-MEZAHE-MAASIK') || '',
      employerId: this.getTextContent(employer, 'MISPAR-MEZAHE-MAASIK') || '',
      employerName: this.getTextContent(employer, 'SHEM-MAASIK') || '',
      address: {
        city: this.getTextContent(employer, 'SHEM-YISHUV') || '',
        cityCode: this.getTextContent(employer, 'SEMEL-YESHUV') || '',
        street: this.getTextContent(employer, 'SHEM-RECHOV') || '',
        houseNumber: this.getTextContent(employer, 'MISPAR-BAIT') || '',
        zipCode: this.getTextContent(employer, 'MIKUD') || ''
      },
      phone: this.getTextContent(employer, 'MISPAR-TELEPHONE-KAVI') || '',
      mobile: this.getTextContent(employer, 'MISPAR-CELLULARI') || '',
      email: this.getTextContent(employer, 'E-MAIL') || '',
      contactPerson: {
        firstName: this.getTextContent(contactPerson, 'SHEM-PRATI') || '',
        lastName: this.getTextContent(contactPerson, 'SHEM-MISHPACHA') || '',
        phone: this.getTextContent(contactPerson, 'MISPAR-TELEPHONE-KAVI') || '',
        mobile: this.getTextContent(contactPerson, 'MISPAR-CELLULARI') || '',
        email: this.getTextContent(contactPerson, 'E-MAIL') || ''
      }
    };
  }

  private static parsePolicyInfo(xmlDoc: Document): PolicyInfo | undefined {
    const policy = xmlDoc.querySelector('HeshbonOPolisa');
    if (!policy) return undefined;

    return {
      originalReference: this.getTextContent(policy, 'ASMACHTA-MEKORIT') || '',
      policyNumber: this.getTextContent(policy, 'MISPAR-POLISA-O-HESHBON') || '',
      programName: this.getTextContent(policy, 'SHEM-TOCHNIT') || '',
      uniqueCode: this.getTextContent(policy, 'KIDOD-ACHID') || '',
      distributorNumber: this.getTextContent(policy, 'MPR-MEFITZ-BE-YATZRAN') || '',
      effectiveDate: this.formatDate(this.getTextContent(policy, 'TAARICH-NECHONUT') || ''),
      joinDate: this.formatDate(this.getTextContent(policy, 'TAARICH-HITZTARFUT-MUTZAR') || ''),
      firstJoinDate: this.formatDate(this.getTextContent(policy, 'TAARICH-HITZTARFUT-RISHON') || ''),
      pensionFundType: this.getTextContent(policy, 'SUG-KEREN-PENSIA') ?? undefined,
      oldOrNewPension: this.getTextContent(policy, 'PENSIA-VATIKA-O-HADASHA') ?? undefined,
      statusUpdateDate: this.formatDate(this.getTextContent(policy, 'TAARICH-IDKUN-STATUS') || ''),
      policyStatus: this.getTextContent(policy, 'STATUS-POLISA-O-CHESHBON') || '',
      insured: this.getTextContent(policy, 'MEVUTACH') ?? undefined,
      policyType: this.getTextContent(policy, 'SUG-POLISA') || '',
      programType: this.getTextContent(policy, 'SUG-TOCHNIT-O-CHESHBON') || '',
      baseIndex: parseFloat(this.getTextContent(policy, 'MADAD-BASIS') || '0'),
      indexLinking: this.getTextContent(policy, 'AZMADA-LEALVAHA') || '',
      lastPaymentDate: this.formatDate(this.getTextContent(policy, 'TAARICH-ACHRON-MOTAV-MUVET') || ''),
      includesDisabilityRights: this.getTextContent(policy, 'KOLEL-ZAKAUT-AGACH') || '',
      disabilityPercentage: parseFloat(this.getTextContent(policy, 'SHIOR-AGACH-MEUADOT') || '0'),
      correction190: this.getTextContent(policy, 'TIKUN-190') || '',
      externalCoverage: this.getTextContent(policy, 'KAYAM-KISUY-HIZONI') ?? undefined,
      personalOrGroup: this.getTextContent(policy, 'KISUY-ISHY-KVOZATI') ?? undefined
    };
  }

  private static parseInsuranceCoverage(xmlDoc: Document): InsuranceCoverage[] {
    const coverages = xmlDoc.querySelectorAll('ZihuiKisui');
    const result: InsuranceCoverage[] = [];

    coverages.forEach(coverage => {
      const basicAmounts = coverage.querySelector('SchumeiBituahYesodi');
      const coverageDetails = coverage.querySelector('PirteiKisuiBeMutzar');
      const premiumDev = coverage.querySelectorAll('hitpatchutpremia');
      const amountDev = coverage.querySelectorAll('hitpatchutschusheurmbituh');
      const discounts = coverage.querySelectorAll('hanachmedureget');

      const insuranceCoverage: InsuranceCoverage = {
        coverageNumber: this.getTextContent(coverage, 'MISPAR-KISUI-BE-YATZRAN') || '',
        coverageName: this.getTextContent(coverage, 'SHEM-KISUI-YATZRAN') || '',
        coverageType: this.getTextContent(coverage, 'SUG-KISUI-ETZEL-YATZRAN') || '',
        oppositePolicy: this.getTextContent(coverage, 'MISPAR-POLISA-O-HESHBON-NEGDI') ?? undefined,
        insuredInfo: {
          idType: this.getTextContent(coverage.querySelector('PirteiMevutach'), 'SUG-TEUDA') || '',
          idNumber: this.getTextContent(coverage.querySelector('PirteiMevutach'), 'MISPAR-ZIHUY-LAKOACH') || ''
        },
        basicInsuranceAmounts: {
          productCode: this.getTextContent(basicAmounts, 'KOD-MUTZAR-LEFI-KIDUD-ACHID-LAYESODI') || '',
          amountIndexingType: this.getTextContent(basicAmounts, 'SUG-HATZMADA-SCHUM-BITUAH') || '',
          premiumIndexingType: this.getTextContent(basicAmounts, 'SUG-HATZMADA-DMEI-BITUAH') || '',
          insuranceTrack: this.getTextContent(basicAmounts, 'SUG-MASLUL-LEBITUAH') ?? undefined,
          includesSavings: this.getTextContent(basicAmounts, 'IND-SCHUM-BITUAH-KOLEL-CHISACHON') || '',
          trackInsuranceAmount: parseFloat(this.getTextContent(basicAmounts, 'SCHUM-BITUACH-LEMASLUL') || '0'),
          numberOfSources: parseInt(this.getTextContent(basicAmounts, 'MISPAR-MASKOROT') || '0'),
          savingsAllocationPercentage: parseFloat(this.getTextContent(basicAmounts, 'ACHUZ-HAKTZAA-LE-CHISACHON') || '0'),
          deathCoverageLimit: parseFloat(this.getTextContent(basicAmounts, 'TIKRAT-GAG-HATAM-LEMIKRE-MAVET') || '0'),
          deathInsuranceAmount: parseFloat(this.getTextContent(basicAmounts, 'SCHUM-BITUAH-LEMAVET') || '0')
        },
        coverageDetails: {
          productCode: this.getTextContent(coverageDetails, 'KOD-MIUTZAR-LAKISUY') || '',
          insuredType: this.getTextContent(coverageDetails, 'SUG-MEVUTACH') || '',
          insuranceCoverageType: this.getTextContent(coverageDetails, 'SUG-KISUY-BITOCHI') || '',
          coverageStartDate: this.formatDate(this.getTextContent(coverageDetails, 'TAARICH-TCHILAT-KISUY') || ''),
          coverageEndDate: this.formatDate(this.getTextContent(coverageDetails, 'TAARICH-TOM-KISUY') || ''),
          appendixCode: this.getTextContent(coverageDetails, 'KOD-NISPACH-KISUY') || '',
          paymentMethod: this.getTextContent(coverageDetails, 'OFEN-TASHLUM-SCHUM-BITUACH') || '',
          insuranceAmount: parseFloat(this.getTextContent(coverageDetails, 'SCHUM-BITUACH') || '0'),
          paymentFrequency: this.getTextContent(coverageDetails, 'MESHALEM-HAKISUY') || '',
          premiumAmount: parseFloat(this.getTextContent(coverageDetails, 'DMEI-BITUAH-LETASHLUM-BAPOAL') || '0')
        },
        premiumDevelopment: Array.from(premiumDev).map(dev => ({
          startPeriod: this.getTextContent(dev, 'TCHILAT-TKUFA') || '',
          endPeriod: this.getTextContent(dev, 'TOM-TKUFA') || '',
          expectedPremium: parseFloat(this.getTextContent(dev, 'PREMIA-ZFOYA') || '0')
        })),
        insuranceAmountDevelopment: Array.from(amountDev).map(dev => ({
          startPeriod: this.getTextContent(dev, 'TCHILAT-TKUFA') || '',
          endPeriod: this.getTextContent(dev, 'TOM-TKUFA') || '',
          expectedRate: parseFloat(this.getTextContent(dev, 'SHEUR-BITUH-ZFOY') || '0'),
          expectedAmount: parseFloat(this.getTextContent(dev, 'SCHUM-BITUH-ZFOY') || '0')
        })),
        discountDetails: Array.from(discounts).map(discount => ({
          startPeriod: this.getTextContent(discount, 'TCHILAT-TKUFA') || '',
          endPeriod: this.getTextContent(discount, 'TOM-TKUFA') || '',
          discountRate: parseFloat(this.getTextContent(discount, 'SHEUR-HANACHA') || '0'),
          discountAmount: parseFloat(this.getTextContent(discount, 'SCHUM-HANACHA') || '0')
        }))
      };

      result.push(insuranceCoverage);
    });

    return result;
  }

  private static parsePaymentInfo(xmlDoc: Document): PaymentInfo | undefined {
    const payment = xmlDoc.querySelector('NetuneiGvia');
    if (!payment) return undefined;

    return {
      payerName: this.getTextContent(payment, 'SHEM-MESHALEM') || '',
      payerIdType: this.getTextContent(payment, 'SUG-TEUDA-MESHALEM') || '',
      payerId: this.getTextContent(payment, 'MISPAR-ZIHUY-MESHALEM') || '',
      paymentMethod: this.getTextContent(payment, 'KOD-EMTZAEI-TASHLUM') || '',
      paymentFrequency: this.getTextContent(payment, 'TADIRUT-TASHLUM') || '',
      referenceMonth: this.getTextContent(payment, 'CHODESH-YECHUS') || '',
      collectionDay: this.getTextContent(payment, 'YOM-GVIYA-BECHODESH') || '',
      collectionIndexing: this.getTextContent(payment, 'OFEN-HATZMADAT-GVIA') || '',
      annualSubsidyPercentage: parseFloat(this.getTextContent(payment, 'ACHUZ-TAT-SHNATIYOT') || '0')
    };
  }

  private static parseLastDepositInfo(xmlDoc: Document): LastDepositInfo | undefined {
    const deposit = xmlDoc.querySelector('PerutPirteiHafkadaAchrona');
    if (!deposit) return undefined;

    return {
      lastDepositDate: this.getTextContent(deposit, 'TAARICH-HAFKADA-ACHARON') || '',
      totalDeposit: parseFloat(this.getTextContent(deposit, 'TOTAL-HAFKADA') || '0'),
      depositToAccountA: parseFloat(this.getTextContent(deposit, 'HAFKADA-LEHISCHON-A') || '0'),
      depositToAccountB: parseFloat(this.getTextContent(deposit, 'HAFKADA-LEHISCHON-B') || '0'),
      depositValueDate: this.formatDate(this.getTextContent(deposit, 'TAARICH-ERECH-HAFKADA') || ''),
      depositType: this.getTextContent(deposit, 'SUG-HAFKADA') || '',
      totalLastDeposit: parseFloat(this.getTextContent(deposit, 'TOTAL-HAFKADA-ACHRONA') || '0')
    };
  }

  private static parseAnnualDeposits(xmlDoc: Document): AnnualDeposits | undefined {
    const annual = xmlDoc.querySelector('HafkadotShnatiyot');
    if (!annual) return undefined;

    return {
      totalEmployeeDeposits: parseFloat(this.getTextContent(annual, 'TOTAL-HAFKADOT-OVED-TAGMULIM-SHANA-NOCHECHIT') || '0'),
      totalEmployerDeposits: parseFloat(this.getTextContent(annual, 'TOTAL-HAFKADOT-MAAVID-TAGMULIM-SHANA-NOCHECHIT') || '0'),
      totalCompensationDeposits: parseFloat(this.getTextContent(annual, 'TOTAL-HAFKADOT-PITZUIM-SHANA-NOCHECHIT') || '0')
    };
  }

  private static parseDebtsArrears(xmlDoc: Document): DebtsArrears | undefined {
    const debt = xmlDoc.querySelector('ChovPigur');
    if (!debt) return undefined;

    return {
      hasDebtOrArrears: this.getTextContent(debt, 'KAYAM-CHOV-O-PIGUR') || '',
      arrearsStartDate: this.formatDate(this.getTextContent(debt, 'TAARICH-TECHILAT-PIGUR') || ''),
      currentArrearsStartDate: this.formatDate(this.getTextContent(debt, 'TAARICH-TECHILAT-PIGUR-NOCHECHI') || ''),
      monthsOfArrears: parseInt(this.getTextContent(debt, 'MISPAR-CHODSHEI-PIGUR') || '0'),
      debtType: this.getTextContent(debt, 'SUG-HOV') || '',
      totalDebtsOrArrears: parseFloat(this.getTextContent(debt, 'TOTAL-CHOVOT-O-PIGURIM') || '0'),
      unallocatedEmployerFunds: this.getTextContent(debt, 'KSAFIM-LO-MESHUYACHIM-MAASIK') || ''
    };
  }

  private static parseManagementFeesStructure(xmlDoc: Document): ManagementFeesStructure[] {
    const fees = xmlDoc.querySelectorAll('PerutMivneDmeiNihul');
    const result: ManagementFeesStructure[] = [];

    fees.forEach(fee => {
      const managementFee: ManagementFeesStructure = {
        feeCalculationBasedOnActualExpenses: this.getTextContent(fee, 'GOVA-DMEI-NIHUL-NIKBA-AL-PI-HOTZAOT-BAPOAL') || '',
        expenseType: this.getTextContent(fee, 'SUG-HOTZAA') || '',
        feeTrackCode: this.getTextContent(fee, 'KOD-MASLUL-DMEI-NIHUL') || '',
        trackCharacteristics: this.getTextContent(fee, 'MEAFYENEI-MASLUL-DMEI-NIHUL') || '',
        managementFeeRate: parseFloat(this.getTextContent(fee, 'SHEUR-DMEI-NIHUL') || '0'),
        feeUpdateDate: this.formatDate(this.getTextContent(fee, 'TAARICH-IDKUN-SHEUR-DNHL') || ''),
        fixedManagementFees: parseFloat(this.getTextContent(fee, 'DMEI-NIHUL-ACHIDIM') || '0'),
        investmentTrackCode: this.getTextContent(fee, 'KOD-MASLUL-HASHKAA-BAAL-DMEI-NIHUL-YECHUDIIM') ?? undefined,
        allocationMethod: this.getTextContent(fee, 'OFEN-HAFRASHA') || '',
        maxDepositFee: parseFloat(this.getTextContent(fee, 'SCHUM-MAX-DNHL-HAFKADA') || '0'),
        totalTrackFees: parseFloat(this.getTextContent(fee, 'SACH-DMEI-NIHUL-MASLUL') || '0'),
        otherManagementFees: parseFloat(this.getTextContent(fee, 'DMEI-NIHUL-ACHERIM') || '0'),
        withdrawalPenalty: this.getTextContent(fee, 'KENAS-MESHICHAT-KESAFIM') || ''
      };

      result.push(managementFee);
    });

    return result;
  }

  private static parseExpensesDetails(xmlDoc: Document): ExpensesDetails | undefined {
    const expenses = xmlDoc.querySelector('HotzaotBafoalLehodeshDivoach');
    if (!expenses) return undefined;

    return {
      depositManagementFeeRate: parseFloat(this.getTextContent(expenses, 'SHEUR-DMEI-NIHUL-HAFKADA') || '0'),
      totalDepositManagementFees: parseFloat(this.getTextContent(expenses, 'TOTAL-DMEI-NIHUL-HAFKADA') || '0'),
      accumulationManagementFeeRate: parseFloat(this.getTextContent(expenses, 'SHEUR-DMEI-NIHUL-TZVIRA') || '0'),
      totalAccumulationManagementFees: parseFloat(this.getTextContent(expenses, 'TOTAL-DMEI-NIHUL-TZVIRA') || '0'),
      otherManagementFeesTotal: parseFloat(this.getTextContent(expenses, 'SACH-DMEI-NIHUL-ACHERIM') || '0'),
      investmentManagementExpenses: parseFloat(this.getTextContent(expenses, 'HOTZOT-NIHUL-ASHKAOT') || '0'),
      totalPolicyManagementFees: parseFloat(this.getTextContent(expenses, 'TOTAL-DMEI-NIHUL-POLISA-O-HESHBON') || '0'),
      trackTransferFees: parseFloat(this.getTextContent(expenses, 'DEMI-AAVARAT-MASLOL') || '0'),
      portfolioManagementFees: parseFloat(this.getTextContent(expenses, 'DMEI-NIUL-MENAEL-TIKIM') || '0'),
      averageDepositManagementFeeRate: parseFloat(this.getTextContent(expenses, 'MEMOTZA-SHEUR-DMEI-NIHUL-HAFKADA') || '0'),
      averageTotalDepositManagementFees: parseFloat(this.getTextContent(expenses, 'MEMOTZA-TOTAL-DMEI-NIHUL-HAFKADA') || '0'),
      insurancePremiumCollectionMethod: this.getTextContent(expenses, 'OFEN-GEVIAT-DMEI-BITUACH') || '',
      totalInsurancePremiumsCollected: parseFloat(this.getTextContent(expenses, 'SACH-DMEI-BITUAH-SHENIGBOO') || '0')
    };
  }

  private static getTextContent(parent: Element | null, tagName: string): string | null {
    if (!parent) return null;
    const element = parent.querySelector(tagName);
    return element ? element.textContent?.trim() || null : null;
  }
}