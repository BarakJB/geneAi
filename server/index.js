const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const pool = require('./config/database');

// Import routes
const customersRoutes = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
// Ensure required tables exist (idempotent)
const ensureTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS white_labels_customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(64) NOT NULL UNIQUE,
        agency_name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(512) NOT NULL,
        hero_image_url VARCHAR(512) NULL,
        lead_email VARCHAR(255) NULL,
        primary_color VARCHAR(32) DEFAULT '#007AFF',
        gradient VARCHAR(256) DEFAULT 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
        cta_text VARCHAR(128) DEFAULT 'לתיאום פגישת זום',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await pool.query(
      `INSERT INTO white_labels_customers (slug, agency_name, logo_url, hero_image_url, lead_email)
       VALUES ('demo', 'Demo Agency', '/minimal-logo/logo-full.svg', '/minimal-assets/illustrations/illustration_marketing.webp', 'demo@example.com')
       ON DUPLICATE KEY UPDATE agency_name=VALUES(agency_name)`
    );
    // Provide a generic fallback slug 'lead' if someone hits /lead without brand
    await pool.query(
      `INSERT INTO white_labels_customers (slug, agency_name, logo_url, hero_image_url, lead_email)
       VALUES ('lead', 'Generic Landing', '/minimal-logo/logo-full.svg', '/minimal-assets/illustrations/illustration_marketing.webp', 'lead@example.com')
       ON DUPLICATE KEY UPDATE agency_name=VALUES(agency_name)`
    );
    console.log('✅ ensured white_labels_customers table exists');
  } catch (e) {
    console.error('Failed ensuring tables:', e);
  }
};

ensureTables();

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

// OpenAI-backed assistant endpoint (grounded on customer pension data)
app.post('/api/assistant/ask', async (req, res) => {
  try {
    const { question, customerId, phone } = req.body || {};
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Missing OPENAI_API_KEY' });
    }
    if (!question || (!customerId && !phone)) {
      return res.status(400).json({ success: false, error: 'question and customerId/phone are required' });
    }

    // Fetch customer data for grounding
    let customer;
    if (customerId) {
      const [rows] = await pool.query(`
        SELECT c.*, p.pension_id, p.xml_file_name, p.import_date,
               p.total_balance, p.monthly_deposit, p.employer_name,
               p.policy_number, p.last_deposit_amount, p.last_deposit_date,
               p.annual_employee_deposits, p.annual_employer_deposits,
               p.insurance_coverages_count, p.has_debts_arrears,
               p.program_name, p.xml_data
        FROM customers c
        LEFT JOIN pension_info p ON c.customer_id = p.customer_id
        WHERE c.customer_id = ?
        LIMIT 1
      `, [customerId]);
      customer = rows && rows[0];
    } else if (phone) {
      const [rows] = await pool.query(`
        SELECT c.*, 
               GROUP_CONCAT(DISTINCT pf.fund_name) as pension_funds,
               SUM(pc.accumulated_balance) as total_pension_balance,
               GROUP_CONCAT(DISTINCT it.type_name) as insurance_types,
               p.xml_data
        FROM customers c
        LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
        LEFT JOIN pension_funds pf ON pc.fund_id = pf.id
        LEFT JOIN customer_insurance ci ON c.id = ci.customer_id
        LEFT JOIN insurance_types it ON ci.insurance_type_id = it.id
        LEFT JOIN pension_info p ON c.customer_id = p.customer_id
        WHERE c.phone_number = ?
        GROUP BY c.id
        LIMIT 1
      `, [phone]);
      customer = rows && rows[0];
    }

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Prepare grounding data
    let pensionData = null;
    if (customer.xml_data) {
      try { pensionData = JSON.parse(customer.xml_data); } catch {}
    }

    const grounded = {
      personalInfo: {
        firstName: customer.first_name,
        lastName: customer.last_name,
        idNumber: customer.customer_id || customer.id_number,
        phone: customer.phone_number,
        email: customer.email,
        birthDate: customer.birth_date,
        address: customer.address,
        gender: customer.gender,
        maritalStatus: customer.marital_status
      },
      summary: {
        totalBalance: customer.total_balance || customer.total_pension_balance || 0,
        monthlyDeposit: customer.monthly_deposit || 0,
      },
      funds: customer.pension_funds ? String(customer.pension_funds).split(',') : undefined,
      insuranceTypes: customer.insurance_types ? String(customer.insurance_types).split(',') : undefined,
      xmlExtract: pensionData ? {
        policyInfo: pensionData.policyInfo,
        lastDepositInfo: pensionData.lastDepositInfo,
        annualDeposits: pensionData.annualDeposits,
        insuranceCoverage: pensionData.insuranceCoverage,
        managementFeesStructure: pensionData.managementFeesStructure
      } : undefined
    };

    const systemPrompt = [
      'You are an Israeli pension and insurance assistant for a licensed agent.',
      'Answer in Hebrew clearly and concisely. Use only the provided customer context.',
      'If data is missing, state what is missing and suggest next steps.',
      'Do not hallucinate values.'
    ].join(' ');

    // Call OpenAI responses API (JSON mode)
    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: [
            { type: 'text', text: 'שאלה:' },
            { type: 'text', text: question },
            { type: 'text', text: 'נתוני לקוח:' },
            { type: 'input_text', text: JSON.stringify(grounded).slice(0, 15000) }
          ] }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(500).json({ success: false, error: 'OpenAI error', details: err });
    }

    const data = await resp.json();
    // Extract text output (responses API returns output_text)
    const answer = Array.isArray(data.output_text) ? data.output_text.join('\n') : (data.output_text || '');
    return res.json({ success: true, answer, context: grounded });
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, description } = req.body;
    
    const mailOptions = {
      from: email,
      to: 'yacov131@gmail.com',
      subject: 'פניה חדשה למוצר המלא - CRM מתקדם',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <h2>פניה חדשה למוצר המלא</h2>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <tr>
              <td><strong>שם פרטי:</strong></td>
              <td>${firstName}</td>
            </tr>
            <tr>
              <td><strong>שם משפחה:</strong></td>
              <td>${lastName}</td>
            </tr>
            <tr>
              <td><strong>אימייל:</strong></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><strong>טלפון:</strong></td>
              <td>${phone}</td>
            </tr>
            <tr>
              <td><strong>תיאור הצרכים:</strong></td>
              <td>${description}</td>
            </tr>
            <tr>
              <td><strong>תאריך פניה:</strong></td>
              <td>${new Date().toLocaleDateString('he-IL')} ${new Date().toLocaleTimeString('he-IL')}</td>
            </tr>
          </table>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'הפניה נשלחה בהצלחה!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'שגיאה בשליחת המייל' });
  }
});

// Use routes
app.use('/api/customers', customersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Branding endpoint - fetch white label by slug
app.get('/api/branding/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      'SELECT slug, agency_name AS name, logo_url AS logoUrl, hero_image_url AS heroImageUrl, primary_color AS primaryColor, gradient, cta_text AS ctaText, lead_email AS leadEmail FROM white_labels_customers WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Branding fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Lead intake endpoint - send email to per-brand address
app.post('/api/leads', async (req, res) => {
  try {
    const { slug, firstName, lastName, email, phone } = req.body;
    if (!slug || !firstName || !lastName || !phone || !email) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const [rows] = await pool.query(
      'SELECT agency_name AS agencyName, lead_email AS leadEmail FROM white_labels_customers WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const { agencyName, leadEmail } = rows[0];
    const to = leadEmail || process.env.DEFAULT_LEAD_EMAIL || 'yacov131@gmail.com';

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to,
      subject: `Lead חדש מהדף של ${agencyName}`,
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <h2>ליד חדש</h2>
          <p><strong>שם:</strong> ${firstName} ${lastName}</p>
          <p><strong>טלפון:</strong> ${phone}</p>
          <p><strong>אימייל:</strong> ${email}</p>
          <p><strong>מותג:</strong> ${slug}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Lead sent' });
  } catch (error) {
    console.error('Lead submit error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
