-- =====================================================
-- Adding Customer Status Column
-- Adding lead tracking status to customers table
-- =====================================================

USE agents_calculator;

-- =====================================================
-- 1. ADD CUSTOMER STATUS COLUMN
-- =====================================================

-- Add customer_status column to customers table
ALTER TABLE customers 
ADD COLUMN customer_status ENUM('0', '1', '2', '4') DEFAULT '0' COMMENT 'סטטוס לקוח: 0=ליד, 1=נקבעה פגישה, 2=לא רלוונטי, 4=לקוח' AFTER is_active,
ADD INDEX idx_customer_status (customer_status),
ADD INDEX idx_agency_status (agency_id, customer_status),
ADD INDEX idx_agency_active_status (agency_id, is_active, customer_status);

-- Add status change tracking fields
ALTER TABLE customers
ADD COLUMN status_changed_at TIMESTAMP NULL COMMENT 'מתי השתנה הסטטוס' AFTER customer_status,
ADD COLUMN status_changed_by CHAR(36) NULL COMMENT 'מי שינה את הסטטוס' AFTER status_changed_at,
ADD COLUMN status_notes TEXT COMMENT 'הערות על שינוי הסטטוס' AFTER status_changed_by,
ADD FOREIGN KEY (status_changed_by) REFERENCES agency_users(id) ON DELETE SET NULL ON UPDATE CASCADE,
ADD INDEX idx_status_changed (status_changed_at);

-- =====================================================
-- 2. CREATE STATUS HISTORY TABLE
-- =====================================================

CREATE TABLE customer_status_history (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL COMMENT 'קישור ללקוח',
    agency_id CHAR(36) NOT NULL COMMENT 'קישור לסוכנות',
    
    -- Status Change Info
    old_status ENUM('0', '1', '2', '4') COMMENT 'סטטוס קודם',
    new_status ENUM('0', '1', '2', '4') NOT NULL COMMENT 'סטטוס חדש',
    change_reason VARCHAR(200) COMMENT 'סיבת השינוי',
    notes TEXT COMMENT 'הערות על השינוי',
    
    -- Who and When
    changed_by CHAR(36) COMMENT 'מי ביצע את השינוי',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'מתי בוצע השינוי',
    
    -- Additional Context
    source ENUM('manual', 'system', 'import', 'api') DEFAULT 'manual' COMMENT 'מקור השינוי',
    ip_address VARCHAR(45) COMMENT 'כתובת IP',
    user_agent TEXT COMMENT 'דפדפן/אפליקציה',
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES agency_users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_customer_history (customer_id),
    INDEX idx_agency_history (agency_id),
    INDEX idx_status_timeline (changed_at),
    INDEX idx_changed_by (changed_by),
    INDEX idx_status_changes (old_status, new_status),
    INDEX idx_agency_status_history (agency_id, new_status, changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='היסטוריית שינויי סטטוס לקוחות';

-- =====================================================
-- 3. CREATE STATUS LOOKUP TABLE
-- =====================================================

CREATE TABLE customer_status_types (
    status_code ENUM('0', '1', '2', '4') PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL COMMENT 'שם הסטטוס',
    status_description TEXT COMMENT 'תיאור הסטטוס',
    status_color VARCHAR(7) NOT NULL COMMENT 'צבע לתצוגה',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הסטטוס פעיל',
    sort_order INT DEFAULT 0 COMMENT 'סדר הצגה',
    
    INDEX idx_active_status (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='הגדרות סטטוסים של לקוחות';

-- Insert status definitions
INSERT INTO customer_status_types (status_code, status_name, status_description, status_color, sort_order) VALUES
('0', 'ליד', 'לקוח פוטנציאלי שעדיין לא נקבעה איתו פגישה', '#FFC107', 1),
('1', 'נקבעה פגישה', 'נקבעה פגישה עם הלקוח הפוטנציאלי', '#2196F3', 2),
('2', 'לא רלוונטי', 'לקוח שאינו רלוונטי או לא מעוניין', '#9E9E9E', 4),
('4', 'לקוח', 'לקוח פעיל במערכת', '#4CAF50', 3);

-- =====================================================
-- 4. UPDATE VIEWS FOR STATUS SUPPORT
-- =====================================================

-- Drop existing view and recreate with status
DROP VIEW IF EXISTS v_agency_customers;

CREATE VIEW v_agency_customers AS
SELECT 
    c.id,
    c.agency_id,
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    c.phone_number,
    c.email,
    c.birth_date,
    TIMESTAMPDIFF(YEAR, c.birth_date, CURDATE()) AS age,
    
    -- Status Info
    c.customer_status,
    cst.status_name,
    cst.status_description,
    cst.status_color,
    c.status_changed_at,
    CONCAT(au.first_name, ' ', au.last_name) AS status_changed_by_name,
    c.status_notes,
    
    -- Agency Info
    a.agency_name,
    a.unique_identifier as agency_identifier,
    
    -- Pension Summary
    COALESCE(SUM(pc.accumulated_balance), 0) AS total_pension_balance,
    COUNT(DISTINCT pc.fund_id) AS pension_funds_count,
    
    -- Insurance Summary
    COUNT(DISTINCT ci.id) AS active_insurance_count,
    COALESCE(SUM(ci.coverage_amount), 0) AS total_insurance_coverage,
    
    -- Tasks Summary
    COUNT(DISTINCT t.id) AS total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) AS pending_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) AS active_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) AS completed_tasks,
    
    c.created_at,
    c.is_active
FROM customers c
JOIN agencies a ON c.agency_id = a.id
LEFT JOIN customer_status_types cst ON c.customer_status = cst.status_code
LEFT JOIN agency_users au ON c.status_changed_by = au.id
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
LEFT JOIN tasks t ON c.id = t.customer_id
WHERE c.is_active = TRUE AND a.is_active = TRUE
GROUP BY c.id;

-- Update agency summary view to include status statistics
DROP VIEW IF EXISTS v_agency_summary;

CREATE VIEW v_agency_summary AS
SELECT 
    a.id,
    a.agency_name,
    a.business_number,
    a.unique_identifier,
    a.primary_email,
    a.subscription_plan,
    a.is_active,
    
    -- Client Statistics
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT CASE WHEN c.is_active = TRUE THEN c.id END) as active_clients,
    
    -- Status Statistics
    COUNT(DISTINCT CASE WHEN c.customer_status = '0' THEN c.id END) as leads_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '1' THEN c.id END) as meetings_scheduled_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '2' THEN c.id END) as not_relevant_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' THEN c.id END) as active_customers_count,
    
    -- User Statistics
    COUNT(DISTINCT au.id) as total_users,
    COUNT(DISTINCT CASE WHEN au.is_active = TRUE THEN au.id END) as active_users,
    
    -- Task Statistics
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as active_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    
    -- Financial Statistics (only for actual customers, status = '4')
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance ELSE 0 END), 0) as total_pension_balance,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN ci.coverage_amount ELSE 0 END), 0) as total_insurance_coverage,
    
    a.created_at,
    a.subscription_start,
    a.subscription_end
FROM agencies a
LEFT JOIN customers c ON a.id = c.agency_id
LEFT JOIN agency_users au ON a.id = au.agency_id
LEFT JOIN tasks t ON a.id = t.agency_id
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
WHERE a.is_active = TRUE
GROUP BY a.id;

-- =====================================================
-- 5. STATUS-SPECIFIC VIEWS
-- =====================================================

-- View: Leads Dashboard (Status 0)
CREATE VIEW v_agency_leads AS
SELECT 
    c.*,
    cst.status_name,
    cst.status_color,
    a.agency_name,
    DATEDIFF(CURDATE(), c.created_at) as days_as_lead,
    COUNT(t.id) as follow_up_tasks
FROM customers c
JOIN agencies a ON c.agency_id = a.id
JOIN customer_status_types cst ON c.customer_status = cst.status_code
LEFT JOIN tasks t ON c.id = t.customer_id AND t.status IN ('todo', 'in_progress')
WHERE c.customer_status = '0' 
  AND c.is_active = TRUE 
  AND a.is_active = TRUE
GROUP BY c.id
ORDER BY c.created_at DESC;

-- View: Scheduled Meetings (Status 1)
CREATE VIEW v_agency_meetings AS
SELECT 
    c.*,
    cst.status_name,
    cst.status_color,
    a.agency_name,
    DATEDIFF(CURDATE(), c.status_changed_at) as days_since_meeting_scheduled,
    COUNT(t.id) as meeting_tasks
FROM customers c
JOIN agencies a ON c.agency_id = a.id
JOIN customer_status_types cst ON c.customer_status = cst.status_code
LEFT JOIN tasks t ON c.id = t.customer_id 
WHERE c.customer_status = '1' 
  AND c.is_active = TRUE 
  AND a.is_active = TRUE
GROUP BY c.id
ORDER BY c.status_changed_at DESC;

-- View: Active Customers (Status 4)
CREATE VIEW v_agency_active_customers AS
SELECT * FROM v_agency_customers 
WHERE customer_status = '4'
ORDER BY created_at DESC;

-- =====================================================
-- 6. STATUS MANAGEMENT STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Change Customer Status
CREATE PROCEDURE sp_change_customer_status(
    IN p_customer_id CHAR(36),
    IN p_new_status ENUM('0', '1', '2', '4'),
    IN p_changed_by CHAR(36),
    IN p_reason VARCHAR(200),
    IN p_notes TEXT,
    IN p_source ENUM('manual', 'system', 'import', 'api'),
    IN p_ip_address VARCHAR(45)
)
BEGIN
    DECLARE v_old_status ENUM('0', '1', '2', '4');
    DECLARE v_agency_id CHAR(36);
    DECLARE v_user_agency CHAR(36);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Get current status and agency
    SELECT customer_status, agency_id INTO v_old_status, v_agency_id 
    FROM customers 
    WHERE id = p_customer_id AND is_active = TRUE;
    
    IF v_agency_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found or inactive';
    END IF;
    
    -- Verify user belongs to same agency
    SELECT agency_id INTO v_user_agency 
    FROM agency_users 
    WHERE id = p_changed_by AND is_active = TRUE;
    
    IF v_user_agency != v_agency_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to change this customer status';
    END IF;
    
    -- Update customer status
    UPDATE customers 
    SET 
        customer_status = p_new_status,
        status_changed_at = CURRENT_TIMESTAMP,
        status_changed_by = p_changed_by,
        status_notes = p_notes
    WHERE id = p_customer_id;
    
    -- Add to history
    INSERT INTO customer_status_history (
        customer_id, agency_id, old_status, new_status, 
        change_reason, notes, changed_by, source, ip_address
    ) VALUES (
        p_customer_id, v_agency_id, v_old_status, p_new_status,
        p_reason, p_notes, p_changed_by, p_source, p_ip_address
    );
    
    COMMIT;
END //

-- Procedure: Get Status Statistics for Agency
CREATE PROCEDURE sp_get_agency_status_stats(
    IN p_agency_id CHAR(36),
    IN p_date_from DATE,
    IN p_date_to DATE
)
BEGIN
    IF p_date_from IS NULL THEN
        SET p_date_from = DATE_SUB(CURDATE(), INTERVAL 30 DAY);
    END IF;
    
    IF p_date_to IS NULL THEN
        SET p_date_to = CURDATE();
    END IF;
    
    SELECT 
        cst.status_code,
        cst.status_name,
        cst.status_color,
        COUNT(c.id) as current_count,
        COUNT(csh.id) as changes_in_period,
        AVG(DATEDIFF(CURDATE(), c.status_changed_at)) as avg_days_in_status
    FROM customer_status_types cst
    LEFT JOIN customers c ON cst.status_code = c.customer_status 
        AND c.agency_id = p_agency_id 
        AND c.is_active = TRUE
    LEFT JOIN customer_status_history csh ON cst.status_code = csh.new_status 
        AND csh.agency_id = p_agency_id
        AND csh.changed_at BETWEEN p_date_from AND DATE_ADD(p_date_to, INTERVAL 1 DAY)
    GROUP BY cst.status_code
    ORDER BY cst.sort_order;
END //

-- Procedure: Get Customer Status Timeline
CREATE PROCEDURE sp_get_customer_status_timeline(
    IN p_customer_id CHAR(36)
)
BEGIN
    SELECT 
        csh.id,
        csh.old_status,
        old_st.status_name as old_status_name,
        csh.new_status,
        new_st.status_name as new_status_name,
        csh.change_reason,
        csh.notes,
        csh.changed_at,
        CONCAT(au.first_name, ' ', au.last_name) as changed_by_name,
        au.username as changed_by_username,
        csh.source
    FROM customer_status_history csh
    LEFT JOIN customer_status_types old_st ON csh.old_status = old_st.status_code
    LEFT JOIN customer_status_types new_st ON csh.new_status = new_st.status_code
    LEFT JOIN agency_users au ON csh.changed_by = au.id
    WHERE csh.customer_id = p_customer_id
    ORDER BY csh.changed_at DESC;
END //

DELIMITER ;

-- =====================================================
-- 7. STATUS CHANGE TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger: Auto-create status history on customer insert
CREATE TRIGGER tr_customer_status_insert AFTER INSERT ON customers
FOR EACH ROW
BEGIN
    INSERT INTO customer_status_history (
        customer_id, agency_id, old_status, new_status,
        change_reason, changed_by, source
    ) VALUES (
        NEW.id, NEW.agency_id, NULL, NEW.customer_status,
        'Initial customer creation', NEW.status_changed_by, 'system'
    );
END //

-- Trigger: Auto-create status history on status change
CREATE TRIGGER tr_customer_status_update AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    IF OLD.customer_status != NEW.customer_status THEN
        INSERT INTO customer_status_history (
            customer_id, agency_id, old_status, new_status,
            change_reason, notes, changed_by, source
        ) VALUES (
            NEW.id, NEW.agency_id, OLD.customer_status, NEW.customer_status,
            'Status updated', NEW.status_notes, NEW.status_changed_by, 'manual'
        );
    END IF;
END //

DELIMITER ;

-- =====================================================
-- 8. UPDATE EXISTING DATA
-- =====================================================

-- Set default status for existing customers (assume they are active customers)
UPDATE customers 
SET customer_status = '4', 
    status_changed_at = created_at,
    status_notes = 'Migrated existing customer'
WHERE customer_status IS NULL;

-- =====================================================
-- 9. PERFORMANCE INDEXES FOR STATUS QUERIES
-- =====================================================

-- Additional indexes for common status queries
CREATE INDEX idx_customers_status_agency ON customers(agency_id, customer_status, is_active);
CREATE INDEX idx_customers_status_timeline ON customers(customer_status, status_changed_at);
CREATE INDEX idx_status_history_timeline ON customer_status_history(agency_id, changed_at, new_status);

-- Index for lead conversion analysis
CREATE INDEX idx_lead_conversion ON customer_status_history(agency_id, old_status, new_status, changed_at);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify status types
SELECT 'Status Types' as verification_type;
SELECT * FROM customer_status_types ORDER BY sort_order;

-- Verify customers with status
SELECT 'Customer Status Distribution' as verification_type;
SELECT 
    cst.status_name,
    COUNT(c.id) as customer_count,
    a.agency_name
FROM customer_status_types cst
LEFT JOIN customers c ON cst.status_code = c.customer_status
LEFT JOIN agencies a ON c.agency_id = a.id
GROUP BY cst.status_code, a.id
ORDER BY a.agency_name, cst.sort_order;
