const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create or update customer with pension info
router.post('/import-pension', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    // Set UTF8MB4 for Hebrew support
    await connection.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    await connection.execute("SET CHARACTER SET utf8mb4");
    
    await connection.beginTransaction();
    
    const { personalInfo, pensionData, agencyId = 1 } = req.body;
    
    // Check if customer exists by phone
    let customerId;
    const [existingCustomers] = await connection.execute(
      'SELECT id FROM customers WHERE phone_number = ?',
      [personalInfo.phoneNumber]
    );
    
    if (existingCustomers.length > 0) {
      // Customer exists - update
      customerId = existingCustomers[0].id;
      
      await connection.execute(`
        UPDATE customers 
        SET first_name = ?, last_name = ?, email = ?, customer_id = ?, 
            birth_date = ?, address = ?, gender = ?, marital_status = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        personalInfo.firstName || '',
        personalInfo.lastName || '',
        personalInfo.email || '',
        personalInfo.id || '',
        personalInfo.birthDate || '1990-01-01',
        personalInfo.address || '',
        personalInfo.gender || 'other',
        personalInfo.maritalStatus || 'single',
        customerId
      ]);
    } else {
      // Create new customer
      customerId = uuidv4();
      
      await connection.execute(`
        INSERT INTO customers (
          id, customer_id, first_name, last_name, phone_number, email, 
          birth_date, address, gender, marital_status, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        customerId,
        personalInfo.id || '',
        personalInfo.firstName || '',
        personalInfo.lastName || '',
        personalInfo.phoneNumber || '',
        personalInfo.email || '',
        personalInfo.birthDate || '1990-01-01',
        personalInfo.address || '',
        personalInfo.gender || 'other',
        personalInfo.maritalStatus || 'single'
      ]);
    }
    
    // Delete existing data for this customer
    await connection.execute('DELETE FROM pension_contributions WHERE customer_id = ?', [customerId]);
    await connection.execute('DELETE FROM customer_insurance WHERE customer_id = ?', [customerId]);

    // Insert pension funds data
    if (pensionData.pensionContributions && pensionData.pensionContributions.length > 0) {
      for (const contribution of pensionData.pensionContributions) {
        // Check if pension fund exists, if not create it
        let [fundResults] = await connection.execute(
          'SELECT id FROM pension_funds WHERE fund_name = ?',
          [contribution.fundName]
        );
        
        let fundId;
        if (fundResults.length === 0) {
          // Create new pension fund
          fundId = uuidv4();
          await connection.execute(`
            INSERT INTO pension_funds (
              id, fund_name, fund_type, management_company, 
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, NOW(), NOW())
          `, [
            fundId,
            contribution.fundName,
            contribution.fundType || 'pension',
            contribution.managementCompany || ''
          ]);
        } else {
          fundId = fundResults[0].id;
        }

        // Insert pension contribution
        const contributionId = uuidv4();
        await connection.execute(`
          INSERT INTO pension_contributions (
            id, customer_id, fund_id, contribution_date,
            employee_amount, employer_amount, accumulated_balance,
            employee_percentage, employer_percentage, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          contributionId,
          customerId,
          fundId,
          contribution.contributionDate || new Date().toISOString().split('T')[0],
          contribution.employeeContribution || 0,
          contribution.employerContribution || 0,
          contribution.accumulatedBalance || 0,
          contribution.employeePercentage || 6.5,
          contribution.employerPercentage || 7.5
        ]);
      }
    }

    // Insert insurance coverage data
    if (pensionData.insuranceCoverage && pensionData.insuranceCoverage.length > 0) {
      for (const coverage of pensionData.insuranceCoverage) {
        // Check if insurance type exists, if not create it
        let [typeResults] = await connection.execute(
          'SELECT id FROM insurance_types WHERE type_name = ?',
          [coverage.coverageType || coverage.insuranceType || 'unknown']
        );
        
        let insuranceTypeId;
        if (typeResults.length === 0) {
          // Create new insurance type
          insuranceTypeId = uuidv4();
          await connection.execute(`
            INSERT INTO insurance_types (
              id, type_name, description, 
              created_at, updated_at
            ) VALUES (?, ?, ?, NOW(), NOW())
          `, [
            insuranceTypeId,
            coverage.coverageType || coverage.insuranceType || 'unknown',
            coverage.description || ''
          ]);
        } else {
          insuranceTypeId = typeResults[0].id;
        }

        // Insert customer insurance
        const customerInsuranceId = uuidv4();
        await connection.execute(`
          INSERT INTO customer_insurance (
            id, customer_id, insurance_type_id, provider_name,
            coverage_amount, monthly_premium, start_date, end_date,
            policy_number, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          customerInsuranceId,
          customerId,
          insuranceTypeId,
          coverage.providerName || 'Unknown Provider',
          coverage.coverageAmount || 0,
          coverage.premiumAmount || coverage.monthlyPremium || 0,
          coverage.startDate || new Date().toISOString().split('T')[0],
          coverage.endDate || null,
          coverage.policyNumber || '',
          coverage.status === 'active' ? 1 : 0
        ]);
      }
    }

    // Insert disability insurance data if available
    if (pensionData.disabilityInsurance && pensionData.disabilityInsurance.length > 0) {
      for (const disability of pensionData.disabilityInsurance) {
        // Check if disability insurance type exists
        let [typeResults] = await connection.execute(
          'SELECT id FROM insurance_types WHERE type_name = ?',
          ['disability_insurance']
        );
        
        let insuranceTypeId;
        if (typeResults.length === 0) {
          // Create disability insurance type
          insuranceTypeId = uuidv4();
          await connection.execute(`
            INSERT INTO insurance_types (
              id, type_name, description, 
              created_at, updated_at
            ) VALUES (?, ?, ?, NOW(), NOW())
          `, [
            insuranceTypeId,
            'disability_insurance',
            'ביטוח אובדן כושר עבודה'
          ]);
        } else {
          insuranceTypeId = typeResults[0].id;
        }

        // Insert customer disability insurance
        const customerInsuranceId = uuidv4();
        await connection.execute(`
          INSERT INTO customer_insurance (
            id, customer_id, insurance_type_id, provider_name,
            coverage_amount, monthly_premium, start_date, end_date,
            policy_number, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          customerInsuranceId,
          customerId,
          insuranceTypeId,
          disability.providerName || 'Unknown Provider',
          disability.coverageAmount || 0,
          disability.monthlyPremium || 0,
          disability.startDate || new Date().toISOString().split('T')[0],
          disability.endDate || null,
          disability.policyNumber || '',
          disability.status === 'active' ? 1 : 0
        ]);
      }
    }
    
    await connection.commit();
    
    res.json({
      success: true,
      customerId,
      message: existingCustomers.length > 0 ? 'Customer updated successfully' : 'Customer created successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error importing pension data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import pension data',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

// Get customer by phone
router.get('/by-phone/:phone', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    // Set UTF8MB4 for Hebrew support
    await connection.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    await connection.execute("SET CHARACTER SET utf8mb4");
    
    const { phone } = req.params;
    
    const [customers] = await connection.execute(`
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT pf.fund_name) as pension_funds,
             SUM(pc.accumulated_balance) as total_pension_balance,
             GROUP_CONCAT(DISTINCT it.type_name) as insurance_types
      FROM customers c
      LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
      LEFT JOIN pension_funds pf ON pc.fund_id = pf.id
      LEFT JOIN customer_insurance ci ON c.id = ci.customer_id
      LEFT JOIN insurance_types it ON ci.insurance_type_id = it.id
      WHERE c.phone_number = ?
      GROUP BY c.id
    `, [phone]);
    
    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const customer = customers[0];
    
    // Parse XML data if exists
    if (customer.xml_data) {
      try {
        customer.pensionData = JSON.parse(customer.xml_data);
      } catch (e) {
        customer.pensionData = null;
      }
    }
    
    res.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error('Error fetching customer by phone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

// Get all customers for agency
router.get('/agency/:agencyId', async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { status, search } = req.query;
    
    let query = `
      SELECT c.*, p.pension_id, p.total_balance, p.monthly_deposit, 
             p.employer_name, p.policy_number
      FROM customers c
      LEFT JOIN pension_info p ON c.customer_id = p.customer_id
      WHERE c.agency_id = ?
    `;
    
    const params = [agencyId];
    
    if (status) {
      query += ' AND c.customer_status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ` AND (
        c.first_name LIKE ? OR 
        c.last_name LIKE ? OR 
        c.phone LIKE ? OR 
        c.email LIKE ? OR 
        c.id_number LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const [customers] = await db.execute(query, params);
    
    res.json({
      success: true,
      customers
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
      details: error.message
    });
  }
});

// Get customer details by ID
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const [customers] = await db.execute(`
      SELECT c.*, p.pension_id, p.xml_file_name, p.import_date,
             p.total_balance, p.monthly_deposit, p.employer_name, 
             p.policy_number, p.last_deposit_amount, p.last_deposit_date,
             p.annual_employee_deposits, p.annual_employer_deposits,
             p.insurance_coverages_count, p.has_debts_arrears,
             p.program_name, p.xml_data
      FROM customers c
      LEFT JOIN pension_info p ON c.customer_id = p.customer_id
      WHERE c.customer_id = ?
    `, [customerId]);
    
    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const customer = customers[0];
    
    // Parse XML data if exists
    if (customer.xml_data) {
      try {
        customer.pensionData = JSON.parse(customer.xml_data);
      } catch (e) {
        customer.pensionData = null;
      }
    }
    
    res.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer details',
      details: error.message
    });
  }
});

module.exports = router;
