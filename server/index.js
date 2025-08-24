const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Pension calculation logic
class PensionCalculator {
  static calculatePension(params) {
    const {
      currentAge,
      retirementAge,
      currentBalance,
      grossSalary,
      monthlyDeposit,
      annualReturn,
      employerCompensation,
      employerContribution,
      employeeContribution,
      currentManagementFeeDeposit,
      currentManagementFeeBalance,
      coverManagementFeeDeposit,
      coverManagementFeeBalance
    } = params;

    const monthsToRetirement = (retirementAge - currentAge) * 12;
    const monthlyReturn = annualReturn / 100 / 12;

    // Calculate future value with current fees
    const futureValueCurrent = this.calculateFutureValue(
      currentBalance,
      monthlyDeposit,
      monthlyReturn,
      monthsToRetirement,
      currentManagementFeeBalance / 100,
      currentManagementFeeDeposit / 100
    );

    // Calculate future value with Cover fees
    const futureValueCover = this.calculateFutureValue(
      currentBalance,
      monthlyDeposit,
      monthlyReturn,
      monthsToRetirement,
      coverManagementFeeBalance / 100,
      coverManagementFeeDeposit / 100
    );

    // Calculate management fee costs
    const totalDeposits = monthlyDeposit * monthsToRetirement;
    const currentFeeCost = this.calculateManagementFeeCost(
      currentBalance,
      totalDeposits,
      currentManagementFeeBalance / 100,
      currentManagementFeeDeposit / 100,
      monthsToRetirement
    );

    const coverFeeCost = this.calculateManagementFeeCost(
      currentBalance,
      totalDeposits,
      coverManagementFeeBalance / 100,
      coverManagementFeeDeposit / 100,
      monthsToRetirement
    );

    const savings = currentFeeCost - coverFeeCost;

    return {
      futureValueCurrent: Math.round(futureValueCurrent),
      futureValueCover: Math.round(futureValueCover),
      currentFeeCost: Math.round(currentFeeCost),
      coverFeeCost: Math.round(coverFeeCost),
      savings: Math.round(savings),
      monthsToRetirement,
      totalDeposits: Math.round(totalDeposits)
    };
  }

  static calculateFutureValue(presentValue, monthlyPayment, monthlyRate, months, balanceFee, depositFee) {
    // Calculate future value considering management fees
    let balance = presentValue;
    
    for (let month = 0; month < months; month++) {
      // Add monthly deposit minus deposit fee
      const netDeposit = monthlyPayment * (1 - depositFee);
      balance += netDeposit;
      
      // Apply monthly return
      balance *= (1 + monthlyRate);
      
      // Subtract balance management fee (monthly)
      balance *= (1 - balanceFee / 12);
    }
    
    return balance;
  }

  static calculateManagementFeeCost(initialBalance, totalDeposits, balanceFee, depositFee, months) {
    // Simplified calculation of total management fees over the period
    const depositFees = totalDeposits * depositFee;
    const averageBalance = initialBalance + (totalDeposits / 2);
    const balanceFees = averageBalance * balanceFee * (months / 12);
    
    return depositFees + balanceFees;
  }
}

// Routes
app.post('/api/calculate', (req, res) => {
  try {
    const result = PensionCalculator.calculatePension(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Salary Calculator class
class SalaryCalculator {
  static calculateSalary(params) {
    const {
      employeeType,
      baseSalary,
      workHours,
      overtimeHours,
      weekendHours,
      holidayHours,
      allowances,
      standbyDays,
      standbyRate,
      standbyCalculationType,
      standbyPercentage,
      seniorityYears,
      isPublicSector,
      hasCarAllowance,
      carAllowanceAmount,
      hasPhoneAllowance,
      phoneAllowanceAmount,
    } = params;

    // Calculate hourly rate
    const hourlyRate = baseSalary / workHours;

    // Calculate overtime pay (125% for regular, 150% for nights/special)
    const overtimeRate = hourlyRate * 1.25;
    const overtimePay = overtimeHours * overtimeRate;

    // Calculate weekend pay (150%)
    const weekendRate = hourlyRate * 1.5;
    const weekendPay = weekendHours * weekendRate;

    // Calculate holiday pay (200%)
    const holidayRate = hourlyRate * 2.0;
    const holidayPay = holidayHours * holidayRate;

    // Calculate allowances total
    const allowancesTotal = Object.values(allowances).reduce((sum, amount) => sum + amount, 0);

    // Calculate standby pay
    let standbyPay = 0;
    if (standbyDays > 0) {
      if (standbyCalculationType === 'percentage') {
        // Calculate daily salary from base salary
        const dailySalary = baseSalary / 30; // Assuming 30 working days per month
        const standbyDailyRate = (dailySalary * standbyPercentage) / 100;
        standbyPay = standbyDays * standbyDailyRate;
      } else {
        // Fixed amount per day
        standbyPay = standbyDays * standbyRate;
      }
    }

    // Calculate car allowance
    const carAllowance = hasCarAllowance ? carAllowanceAmount : 0;

    // Calculate phone allowance
    const phoneAllowance = hasPhoneAllowance ? phoneAllowanceAmount : 0;

    // Total gross salary
    const totalGross = baseSalary + overtimePay + weekendPay + holidayPay + 
                      allowancesTotal + standbyPay + carAllowance + phoneAllowance;

    // Calculate taxes and deductions based on Israeli tax brackets
    const { incomeTax, nationalInsurance, healthTax, pensionDeduction } = 
      this.calculateDeductions(totalGross, employeeType);

    const totalDeductions = incomeTax + nationalInsurance + healthTax + pensionDeduction;
    const netSalary = totalGross - totalDeductions;

    return {
      grossSalary: Math.round(baseSalary),
      overtimePay: Math.round(overtimePay),
      weekendPay: Math.round(weekendPay),
      holidayPay: Math.round(holidayPay),
      allowancesTotal: Math.round(allowancesTotal),
      standbyPay: Math.round(standbyPay),
      carAllowance: Math.round(carAllowance),
      phoneAllowance: Math.round(phoneAllowance),
      totalGross: Math.round(totalGross),
      incomeTax: Math.round(incomeTax),
      nationalInsurance: Math.round(nationalInsurance),
      healthTax: Math.round(healthTax),
      pensionDeduction: Math.round(pensionDeduction),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
    };
  }

  static calculateDeductions(grossSalary, employeeType) {
    // Income tax brackets for 2024 (simplified)
    let incomeTax = 0;
    const monthlyGross = grossSalary;
    const annualGross = monthlyGross * 12;

    // Tax brackets (annual)
    if (annualGross <= 75960) {
      incomeTax = 0;
    } else if (annualGross <= 108960) {
      incomeTax = (annualGross - 75960) * 0.10;
    } else if (annualGross <= 174960) {
      incomeTax = 3300 + (annualGross - 108960) * 0.14;
    } else if (annualGross <= 243120) {
      incomeTax = 12540 + (annualGross - 174960) * 0.20;
    } else if (annualGross <= 521280) {
      incomeTax = 26172 + (annualGross - 243120) * 0.31;
    } else if (annualGross <= 663240) {
      incomeTax = 112401.6 + (annualGross - 521280) * 0.35;
    } else {
      incomeTax = 162087.6 + (annualGross - 663240) * 0.47;
    }

    // Convert to monthly
    incomeTax = incomeTax / 12;

    // National Insurance (Bituach Leumi) - up to ceiling
    const niCeiling = 47030; // Monthly ceiling for 2024
    const niBase = Math.min(monthlyGross, niCeiling);
    const nationalInsurance = niBase * 0.07; // 7%

    // Health tax - up to ceiling  
    const healthCeiling = 47030; // Monthly ceiling for 2024
    const healthBase = Math.min(monthlyGross, healthCeiling);
    const healthTax = healthBase * 0.031; // 3.1%

    // Pension deduction (employee part) - 6%
    const pensionDeduction = monthlyGross * 0.06;

    return {
      incomeTax: Math.max(0, incomeTax),
      nationalInsurance,
      healthTax,
      pensionDeduction,
    };
  }
}

// Salary calculation endpoint
app.post('/api/calculate-salary', (req, res) => {
  try {
    const result = SalaryCalculator.calculateSalary(req.body);
    res.json(result);
  } catch (error) {
    console.error('Salary calculation error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
