-- =====================================================
-- AgentsCalculator - Multi-Tenancy with Agencies
-- Adding agencies table and modifying existing tables for multi-tenancy
-- =====================================================

USE agents_calculator;

-- =====================================================
-- 1. AGENCIES TABLE - טבלת סוכנויות
-- =====================================================
CREATE TABLE agencies (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Basic Info
    agency_name VARCHAR(100) NOT NULL COMMENT 'שם הסוכנות',
    business_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'מספר ח.פ / עוסק מורשה',
    unique_identifier VARCHAR(50) NOT NULL UNIQUE COMMENT 'מזהה ייחודי למערכת',
    
    -- Contact Info
    address TEXT COMMENT 'כתובת הסוכנות',
    primary_email VARCHAR(100) NOT NULL COMMENT 'אימייל ראשי',
    phone_number VARCHAR(20) COMMENT 'טלפון ראשי',
    website VARCHAR(255) COMMENT 'אתר אינטרנט',
    
    -- Branding
    icon_url VARCHAR(500) COMMENT 'קישור לאייקון הסוכנות',
    logo_url VARCHAR(500) COMMENT 'קישור ללוגו הסוכנות',
    primary_color VARCHAR(7) DEFAULT '#2196F3' COMMENT 'צבע ראשי לממשק',
    secondary_color VARCHAR(7) DEFAULT '#FFC107' COMMENT 'צבע משני',
    
    -- Configuration
    max_users INT DEFAULT 10 COMMENT 'מספר משתמשים מקסימלי',
    max_clients INT DEFAULT 1000 COMMENT 'מספר לקוחות מקסימלי',
    subscription_plan ENUM('basic', 'professional', 'enterprise') DEFAULT 'basic' COMMENT 'תוכנית מנוי',
    features JSON COMMENT 'תכונות זמינות לסוכנות',
    settings JSON COMMENT 'הגדרות כלליות של הסוכנות',
    
    -- Status and Billing
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הסוכנות פעילה',
    subscription_start DATE COMMENT 'תאריך תחילת המנוי',
    subscription_end DATE COMMENT 'תאריך סיום המנוי',
    billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly' COMMENT 'מחזור חיוב',
    
    -- Contact Person
    contact_person_name VARCHAR(100) COMMENT 'איש קשר ראשי',
    contact_person_phone VARCHAR(20) COMMENT 'טלפון איש קשר',
    contact_person_email VARCHAR(100) COMMENT 'אימייל איש קשר',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'תאריך יצירה',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'תאריך עדכון אחרון',
    created_by VARCHAR(100) COMMENT 'מי יצר את הסוכנות',
    
    -- Indexes
    INDEX idx_agency_name (agency_name),
    INDEX idx_business_number (business_number),
    INDEX idx_unique_identifier (unique_identifier),
    INDEX idx_primary_email (primary_email),
    INDEX idx_active_agencies (is_active),
    INDEX idx_subscription_plan (subscription_plan),
    INDEX idx_subscription_dates (subscription_start, subscription_end),
    INDEX idx_created_date (created_at),
    
    -- Constraints
    CONSTRAINT chk_agency_email_format CHECK (primary_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_contact_email_format CHECK (contact_person_email IS NULL OR contact_person_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_agency_phone_format CHECK (phone_number IS NULL OR phone_number REGEXP '^[0-9+\\-\\s()]+$'),
    CONSTRAINT chk_max_values CHECK (max_users > 0 AND max_clients > 0),
    CONSTRAINT chk_subscription_dates CHECK (subscription_end IS NULL OR subscription_start IS NULL OR subscription_end >= subscription_start),
    CONSTRAINT chk_color_format CHECK (
        (primary_color IS NULL OR primary_color REGEXP '^#[0-9A-Fa-f]{6}$') AND
        (secondary_color IS NULL OR secondary_color REGEXP '^#[0-9A-Fa-f]{6}$')
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='טבלת סוכנויות - מולטי טננסי';

-- =====================================================
-- 2. AGENCY_USERS TABLE - משתמשי סוכנויות
-- =====================================================
CREATE TABLE agency_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id CHAR(36) NOT NULL COMMENT 'קישור לסוכנות',
    
    -- User Info
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'שם משתמש',
    email VARCHAR(100) NOT NULL COMMENT 'אימייל',
    first_name VARCHAR(50) NOT NULL COMMENT 'שם פרטי',
    last_name VARCHAR(50) NOT NULL COMMENT 'שם משפחה',
    phone_number VARCHAR(20) COMMENT 'טלפון',
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL COMMENT 'סיסמה מוצפנת',
    last_login TIMESTAMP NULL COMMENT 'כניסה אחרונה',
    login_attempts INT DEFAULT 0 COMMENT 'ניסיונות כניסה',
    is_locked BOOLEAN DEFAULT FALSE COMMENT 'האם החשבון נעול',
    
    -- Permissions
    role ENUM('admin', 'manager', 'agent', 'viewer') DEFAULT 'agent' COMMENT 'תפקיד במערכת',
    permissions JSON COMMENT 'הרשאות ספציפיות',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם המשתמש פעיל',
    email_verified BOOLEAN DEFAULT FALSE COMMENT 'האם האימייל אומת',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36) COMMENT 'מי יצר את המשתמש',
    
    -- Foreign Keys
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES agency_users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_agency_users (agency_id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active_users (agency_id, is_active),
    INDEX idx_login_attempts (login_attempts, is_locked),
    
    -- Constraints
    CONSTRAINT chk_user_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_agency_user_phone_format CHECK (phone_number IS NULL OR phone_number REGEXP '^[0-9+\\-\\s()]+$'),
    CONSTRAINT chk_login_attempts CHECK (login_attempts >= 0 AND login_attempts <= 10),
    
    -- Unique constraint within agency
    UNIQUE KEY uk_agency_username (agency_id, username),
    UNIQUE KEY uk_agency_email (agency_id, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='משתמשי סוכנויות';

-- =====================================================
-- 3. MODIFY EXISTING TABLES FOR MULTI-TENANCY
-- =====================================================

-- Add agency_id to customers table
ALTER TABLE customers 
ADD COLUMN agency_id CHAR(36) NULL COMMENT 'קישור לסוכנות' AFTER id,
ADD INDEX idx_agency_customers (agency_id),
ADD INDEX idx_agency_customer_id (agency_id, customer_id);

-- Add agency_id to tasks table  
ALTER TABLE tasks
ADD COLUMN agency_id CHAR(36) NULL COMMENT 'קישור לסוכנות' AFTER id,
ADD INDEX idx_agency_tasks (agency_id),
ADD INDEX idx_agency_task_status (agency_id, status);

-- Add created_by to tasks (which user created the task)
ALTER TABLE tasks
ADD COLUMN created_by CHAR(36) COMMENT 'מי יצר את המשימה' AFTER assigned_to,
ADD INDEX idx_task_created_by (created_by);

-- Add agency_id to task_categories table
ALTER TABLE task_categories
ADD COLUMN agency_id CHAR(36) COMMENT 'קישור לסוכנות (NULL = גלובלי)' AFTER id,
ADD INDEX idx_agency_categories (agency_id);

-- Add agency_id to pension_funds table (agencies can have custom funds)
ALTER TABLE pension_funds
ADD COLUMN agency_id CHAR(36) COMMENT 'קישור לסוכנות (NULL = גלובלי)' AFTER id,
ADD INDEX idx_agency_funds (agency_id);

-- Add agency_id to insurance_types table (agencies can have custom insurance types)
ALTER TABLE insurance_types
ADD COLUMN agency_id CHAR(36) COMMENT 'קישור לסוכנות (NULL = גלובלי)' AFTER id,
ADD INDEX idx_agency_insurance_types (agency_id);

-- =====================================================
-- 4. AGENCY-SPECIFIC VIEWS
-- =====================================================

-- View: Agency Summary
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
    
    -- User Statistics
    COUNT(DISTINCT au.id) as total_users,
    COUNT(DISTINCT CASE WHEN au.is_active = TRUE THEN au.id END) as active_users,
    
    -- Task Statistics
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as active_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    
    -- Financial Statistics
    COALESCE(SUM(pc.accumulated_balance), 0) as total_pension_balance,
    COALESCE(SUM(ci.coverage_amount), 0) as total_insurance_coverage,
    
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

-- View: Agency Customers (filtered by agency)
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
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
LEFT JOIN tasks t ON c.id = t.customer_id
WHERE c.is_active = TRUE AND a.is_active = TRUE
GROUP BY c.id;

-- View: Agency Tasks (filtered by agency)
CREATE VIEW v_agency_tasks AS
SELECT 
    t.id,
    t.agency_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.assigned_to,
    t.estimated_hours,
    t.actual_hours,
    
    -- Customer Info
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.phone_number,
    c.email,
    
    -- Category Info
    tc.category_name,
    tc.color_code,
    
    -- Agency Info
    a.agency_name,
    a.unique_identifier as agency_identifier,
    
    -- Creator Info
    CONCAT(au.first_name, ' ', au.last_name) AS created_by_name,
    au.username as created_by_username,
    
    t.created_at,
    t.updated_at
FROM tasks t
JOIN customers c ON t.customer_id = c.id
JOIN agencies a ON t.agency_id = a.id
LEFT JOIN task_categories tc ON t.category_id = tc.id
LEFT JOIN agency_users au ON t.created_by = au.id
WHERE a.is_active = TRUE
ORDER BY 
    CASE t.priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
    END,
    t.due_date ASC,
    t.created_at DESC;

-- =====================================================
-- 5. AGENCY-SPECIFIC STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Get Agency Clients
CREATE PROCEDURE sp_get_agency_clients(
    IN p_agency_id CHAR(36),
    IN p_limit INT DEFAULT 50,
    IN p_offset INT DEFAULT 0
)
BEGIN
    SELECT * FROM v_agency_customers 
    WHERE agency_id = p_agency_id
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedure: Get Agency Tasks  
CREATE PROCEDURE sp_get_agency_tasks(
    IN p_agency_id CHAR(36),
    IN p_status VARCHAR(20) DEFAULT NULL,
    IN p_limit INT DEFAULT 50,
    IN p_offset INT DEFAULT 0
)
BEGIN
    IF p_status IS NULL THEN
        SELECT * FROM v_agency_tasks 
        WHERE agency_id = p_agency_id
        ORDER BY 
            CASE priority 
                WHEN 'urgent' THEN 1 
                WHEN 'high' THEN 2 
                WHEN 'medium' THEN 3 
                WHEN 'low' THEN 4 
            END,
            due_date ASC
        LIMIT p_limit OFFSET p_offset;
    ELSE
        SELECT * FROM v_agency_tasks 
        WHERE agency_id = p_agency_id AND status = p_status
        ORDER BY 
            CASE priority 
                WHEN 'urgent' THEN 1 
                WHEN 'high' THEN 2 
                WHEN 'medium' THEN 3 
                WHEN 'low' THEN 4 
            END,
            due_date ASC
        LIMIT p_limit OFFSET p_offset;
    END IF;
END //

-- Procedure: Add Client to Agency
CREATE PROCEDURE sp_add_agency_client(
    IN p_agency_id CHAR(36),
    IN p_customer_id VARCHAR(20),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_birth_date DATE,
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_address TEXT,
    OUT p_new_customer_uuid CHAR(36)
)
BEGIN
    DECLARE v_agency_count INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if agency exists and is active
    SELECT COUNT(*) INTO v_agency_count 
    FROM agencies 
    WHERE id = p_agency_id AND is_active = TRUE;
    
    IF v_agency_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Agency not found or inactive';
    END IF;
    
    -- Insert customer
    SET p_new_customer_uuid = UUID();
    INSERT INTO customers (id, agency_id, customer_id, first_name, last_name, birth_date, phone_number, email, address)
    VALUES (p_new_customer_uuid, p_agency_id, p_customer_id, p_first_name, p_last_name, p_birth_date, p_phone, p_email, p_address);
    
    COMMIT;
END //

-- Procedure: Create Agency Task
CREATE PROCEDURE sp_create_agency_task(
    IN p_agency_id CHAR(36),
    IN p_customer_id CHAR(36),
    IN p_created_by CHAR(36),
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_priority ENUM('low', 'medium', 'high', 'urgent'),
    IN p_due_date DATE,
    IN p_category_id CHAR(36),
    OUT p_new_task_uuid CHAR(36)
)
BEGIN
    DECLARE v_customer_agency_id CHAR(36);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verify customer belongs to the agency
    SELECT agency_id INTO v_customer_agency_id 
    FROM customers 
    WHERE id = p_customer_id AND is_active = TRUE;
    
    IF v_customer_agency_id != p_agency_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer does not belong to this agency';
    END IF;
    
    -- Create task
    SET p_new_task_uuid = UUID();
    INSERT INTO tasks (id, agency_id, customer_id, title, description, priority, due_date, category_id, created_by)
    VALUES (p_new_task_uuid, p_agency_id, p_customer_id, p_title, p_description, p_priority, p_due_date, p_category_id, p_created_by);
    
    COMMIT;
END //

DELIMITER ;

-- =====================================================
-- 6. AGENCY-SPECIFIC TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger: Prevent cross-agency data access
CREATE TRIGGER tr_validate_customer_agency BEFORE INSERT ON pension_contributions
FOR EACH ROW
BEGIN
    DECLARE v_customer_agency_id CHAR(36);
    
    SELECT agency_id INTO v_customer_agency_id 
    FROM customers 
    WHERE id = NEW.customer_id;
    
    IF v_customer_agency_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found or agency mismatch';
    END IF;
END //

CREATE TRIGGER tr_validate_customer_insurance_agency BEFORE INSERT ON customer_insurance
FOR EACH ROW
BEGIN
    DECLARE v_customer_agency_id CHAR(36);
    
    SELECT agency_id INTO v_customer_agency_id 
    FROM customers 
    WHERE id = NEW.customer_id;
    
    IF v_customer_agency_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found or agency mismatch';
    END IF;
END //

-- Audit trigger for agencies
CREATE TRIGGER tr_agencies_audit_insert AFTER INSERT ON agencies
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values)
    VALUES ('agencies', NEW.id, 'INSERT', JSON_OBJECT(
        'agency_name', NEW.agency_name,
        'business_number', NEW.business_number,
        'unique_identifier', NEW.unique_identifier,
        'primary_email', NEW.primary_email,
        'subscription_plan', NEW.subscription_plan
    ));
END //

CREATE TRIGGER tr_agencies_audit_update AFTER UPDATE ON agencies
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
    VALUES ('agencies', NEW.id, 'UPDATE',
        JSON_OBJECT(
            'agency_name', OLD.agency_name,
            'business_number', OLD.business_number,
            'is_active', OLD.is_active,
            'subscription_plan', OLD.subscription_plan
        ),
        JSON_OBJECT(
            'agency_name', NEW.agency_name,
            'business_number', NEW.business_number,
            'is_active', NEW.is_active,
            'subscription_plan', NEW.subscription_plan
        )
    );
END //

DELIMITER ;

-- =====================================================
-- 7. SECURITY FUNCTIONS
-- =====================================================

DELIMITER //

-- Function: Check if user has access to customer
CREATE FUNCTION f_user_can_access_customer(
    p_user_id CHAR(36),
    p_customer_id CHAR(36)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_user_agency_id CHAR(36);
    DECLARE v_customer_agency_id CHAR(36);
    
    -- Get user's agency
    SELECT agency_id INTO v_user_agency_id 
    FROM agency_users 
    WHERE id = p_user_id AND is_active = TRUE;
    
    -- Get customer's agency
    SELECT agency_id INTO v_customer_agency_id 
    FROM customers 
    WHERE id = p_customer_id AND is_active = TRUE;
    
    RETURN (v_user_agency_id = v_customer_agency_id);
END //

-- Function: Get user's agency ID
CREATE FUNCTION f_get_user_agency(
    p_user_id CHAR(36)
) RETURNS CHAR(36)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_agency_id CHAR(36);
    
    SELECT agency_id INTO v_agency_id 
    FROM agency_users 
    WHERE id = p_user_id AND is_active = TRUE;
    
    RETURN v_agency_id;
END //

DELIMITER ;

-- =====================================================
-- 8. PERFORMANCE OPTIMIZATIONS FOR MULTI-TENANCY
-- =====================================================

-- Composite indexes for multi-tenant queries
CREATE INDEX idx_customers_agency_search ON customers(agency_id, first_name, last_name, customer_id);
CREATE INDEX idx_tasks_agency_dashboard ON tasks(agency_id, status, priority, due_date);
CREATE INDEX idx_pension_agency_customer ON pension_contributions(customer_id, accumulated_balance);
CREATE INDEX idx_insurance_agency_customer ON customer_insurance(customer_id, is_active, coverage_amount);

-- Indexes for agency management
CREATE INDEX idx_agency_users_role ON agency_users(agency_id, role, is_active);
CREATE INDEX idx_agency_subscription ON agencies(subscription_plan, subscription_end, is_active);

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

-- Add comments to modified tables
ALTER TABLE customers COMMENT = 'טבלת לקוחות - עם תמיכה במולטי-טננסי לפי סוכנויות';
ALTER TABLE tasks COMMENT = 'משימות לקוחות - מסוננות לפי סוכנות';
ALTER TABLE task_categories COMMENT = 'קטגוריות משימות - גלובליות או ספציפיות לסוכנות';
ALTER TABLE pension_funds COMMENT = 'קרנות פנסיה - גלובליות או ספציפיות לסוכנות';
ALTER TABLE insurance_types COMMENT = 'סוגי ביטוח - גלובליים או ספציפיים לסוכנות';
