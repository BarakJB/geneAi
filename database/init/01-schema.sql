-- =====================================================
-- AgentsCalculator Database Schema
-- Created for managing clients, pension data, tasks, and insurance
-- =====================================================

USE agents_calculator;

-- Enable FOREIGN KEY checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. CUSTOMERS TABLE - מידע אישי של לקוחות
-- =====================================================
CREATE TABLE customers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(20) NOT NULL UNIQUE COMMENT 'תעודת זהות או מספר לקוח',
    first_name VARCHAR(50) NOT NULL COMMENT 'שם פרטי',
    last_name VARCHAR(50) NOT NULL COMMENT 'שם משפחה',
    birth_date DATE NOT NULL COMMENT 'תאריך לידה',
    phone_number VARCHAR(20) NOT NULL COMMENT 'מספר טלפון',
    email VARCHAR(100) NOT NULL COMMENT 'כתובת אימייל',
    address TEXT COMMENT 'כתובת מגורים',
    gender ENUM('male', 'female', 'other') DEFAULT 'other' COMMENT 'מין',
    marital_status ENUM('single', 'married', 'divorced', 'widowed') DEFAULT 'single' COMMENT 'מצב משפחתי',
    notes TEXT COMMENT 'הערות כלליות',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'תאריך יצירה',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'תאריך עדכון אחרון',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הלקוח פעיל',
    
    -- Indexes
    INDEX idx_customer_id (customer_id),
    INDEX idx_name (first_name, last_name),
    INDEX idx_phone (phone_number),
    INDEX idx_email (email),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at),
    
    -- Constraints
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_phone_format CHECK (phone_number REGEXP '^[0-9+\\-\\s()]+$'),
    CONSTRAINT chk_birth_date CHECK (birth_date <= '2030-01-01')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='טבלת לקוחות - מידע אישי בסיסי';

-- =====================================================
-- 2. EMPLOYMENT_HISTORY TABLE - היסטוריית תעסוקה
-- =====================================================
CREATE TABLE employment_history (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL COMMENT 'קישור ללקוח',
    company_name VARCHAR(100) NOT NULL COMMENT 'שם החברה',
    position VARCHAR(100) NOT NULL COMMENT 'תפקיד',
    start_date DATE NOT NULL COMMENT 'תאריך התחלה',
    end_date DATE NULL COMMENT 'תאריך סיום (NULL = עובד כיום)',
    monthly_salary DECIMAL(10,2) NULL COMMENT 'משכורת חודשית',
    employment_type ENUM('full_time', 'part_time', 'contractor', 'freelance') DEFAULT 'full_time' COMMENT 'סוג העסקה',
    notes TEXT COMMENT 'הערות על התעסוקה',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_customer_employment (customer_id),
    INDEX idx_company (company_name),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_current_job (customer_id, end_date),
    
    -- Constraints
    CONSTRAINT chk_employment_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_salary_positive CHECK (monthly_salary IS NULL OR monthly_salary > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='היסטוריית תעסוקה של לקוחות';

-- =====================================================
-- 3. PENSION_FUNDS TABLE - קרנות פנסיה (справочник)
-- =====================================================
CREATE TABLE pension_funds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    fund_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'שם הקרן',
    fund_code VARCHAR(20) UNIQUE COMMENT 'קוד הקרן',
    fund_type ENUM('pension', 'provident', 'study', 'training') DEFAULT 'pension' COMMENT 'סוג הקרן',
    management_company VARCHAR(100) COMMENT 'חברת הניהול',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הקרן פעילה',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_fund_name (fund_name),
    INDEX idx_fund_code (fund_code),
    INDEX idx_active_funds (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='מאגר קרנות פנסיה';

-- =====================================================
-- 4. PENSION_CONTRIBUTIONS TABLE - הפקדות פנסיוניות
-- =====================================================
CREATE TABLE pension_contributions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL COMMENT 'קישור ללקוח',
    fund_id CHAR(36) NOT NULL COMMENT 'קישור לקרן פנסיה',
    
    -- Contribution Details
    contribution_date DATE NOT NULL COMMENT 'תאריך ההפקדה',
    employee_amount DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'הפקדת עובד',
    employer_amount DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'הפקדת מעביד',
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (employee_amount + employer_amount) STORED COMMENT 'סה"כ הפקדה',
    accumulated_balance DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'יתרה צבורה',
    
    -- Percentages
    employee_percentage DECIMAL(5,2) DEFAULT 6.50 COMMENT 'אחוז הפקדת עובד',
    employer_percentage DECIMAL(5,2) DEFAULT 7.50 COMMENT 'אחוז הפקדת מעביד',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fund_id) REFERENCES pension_funds(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_customer_pension (customer_id),
    INDEX idx_fund_contributions (fund_id),
    INDEX idx_contribution_date (contribution_date),
    INDEX idx_customer_fund (customer_id, fund_id),
    INDEX idx_balance (accumulated_balance),
    
    -- Constraints
    CONSTRAINT chk_amounts_positive CHECK (employee_amount >= 0 AND employer_amount >= 0 AND accumulated_balance >= 0),
    CONSTRAINT chk_percentages CHECK (employee_percentage >= 0 AND employer_percentage >= 0),
    CONSTRAINT chk_contribution_date CHECK (contribution_date <= '2030-01-01')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='הפקדות פנסיוניות של לקוחות';

-- =====================================================
-- 5. INSURANCE_TYPES TABLE - סוגי ביטוח (справочник)
-- =====================================================
CREATE TABLE insurance_types (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'שם סוג הביטוח',
    type_code VARCHAR(20) UNIQUE COMMENT 'קוד סוג הביטוח',
    description TEXT COMMENT 'תיאור הביטוח',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם סוג הביטוח פעיל',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_type_name (type_name),
    INDEX idx_type_code (type_code),
    INDEX idx_active_types (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='סוגי ביטוח';

-- =====================================================
-- 6. CUSTOMER_INSURANCE TABLE - ביטוחים של לקוחות
-- =====================================================
CREATE TABLE customer_insurance (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL COMMENT 'קישור ללקוח',
    insurance_type_id CHAR(36) NOT NULL COMMENT 'קישור לסוג ביטוח',
    
    -- Insurance Details
    provider_name VARCHAR(100) NOT NULL COMMENT 'שם חברת הביטוח',
    policy_number VARCHAR(50) COMMENT 'מספר פוליסה',
    coverage_amount DECIMAL(12,2) NOT NULL COMMENT 'סכום כיסוי',
    monthly_premium DECIMAL(10,2) NOT NULL COMMENT 'דמי ביטוח חודשיים',
    start_date DATE NOT NULL COMMENT 'תאריך תחילת הביטוח',
    end_date DATE NULL COMMENT 'תאריך סיום הביטוח',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הביטוח פעיל',
    
    -- Additional Details
    beneficiaries TEXT COMMENT 'מוטבים',
    notes TEXT COMMENT 'הערות על הביטוח',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (insurance_type_id) REFERENCES insurance_types(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_customer_insurance (customer_id),
    INDEX idx_insurance_type (insurance_type_id),
    INDEX idx_provider (provider_name),
    INDEX idx_policy (policy_number),
    INDEX idx_active_insurance (customer_id, is_active),
    INDEX idx_coverage (coverage_amount),
    INDEX idx_dates (start_date, end_date),
    
    -- Constraints
    CONSTRAINT chk_insurance_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_insurance_amounts CHECK (coverage_amount > 0 AND monthly_premium > 0),
    CONSTRAINT chk_insurance_start_date CHECK (start_date >= '1900-01-01')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='ביטוחים של לקוחות';

-- =====================================================
-- 7. TASK_CATEGORIES TABLE - קטגוריות משימות (справочник)
-- =====================================================
CREATE TABLE task_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'שם הקטגוריה',
    category_code VARCHAR(20) UNIQUE COMMENT 'קוד הקטגוריה',
    description TEXT COMMENT 'תיאור הקטגוריה',
    color_code VARCHAR(7) DEFAULT '#6366f1' COMMENT 'קוד צבע לתצוגה',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'האם הקטגוריה פעילה',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_category_name (category_name),
    INDEX idx_category_code (category_code),
    INDEX idx_active_categories (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='קטגוריות משימות';

-- =====================================================
-- 8. TASKS TABLE - משימות
-- =====================================================
CREATE TABLE tasks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL COMMENT 'קישור ללקוח',
    category_id CHAR(36) NULL COMMENT 'קישור לקטגוריית המשימה',
    
    -- Task Details
    title VARCHAR(200) NOT NULL COMMENT 'כותרת המשימה',
    description TEXT COMMENT 'תיאור המשימה',
    task_request TEXT COMMENT 'בקשת המשימה המקורית',
    
    -- Status and Priority
    status ENUM('todo', 'in_progress', 'done', 'cancelled') DEFAULT 'todo' COMMENT 'סטטוס המשימה',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT 'עדיפות המשימה',
    
    -- Dates and Time
    due_date DATE NULL COMMENT 'תאריך יעד לסיום',
    start_date DATE NULL COMMENT 'תאריך התחלה',
    completion_date DATE NULL COMMENT 'תאריך סיום בפועל',
    estimated_hours DECIMAL(5,2) NULL COMMENT 'שעות עבודה משוערות',
    actual_hours DECIMAL(5,2) NULL COMMENT 'שעות עבודה בפועל',
    
    -- Assignment
    assigned_to VARCHAR(100) COMMENT 'מי מטפל במשימה',
    assigned_by VARCHAR(100) COMMENT 'מי הקצה את המשימה',
    
    -- Additional Info
    tags JSON COMMENT 'תגיות המשימה',
    attachments JSON COMMENT 'קבצים מצורפים',
    notes TEXT COMMENT 'הערות נוספות',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES task_categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_customer_tasks (customer_id),
    INDEX idx_task_status (status),
    INDEX idx_task_priority (priority),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_due_date (due_date),
    INDEX idx_completion_date (completion_date),
    INDEX idx_category_tasks (category_id),
    INDEX idx_customer_status (customer_id, status),
    INDEX idx_active_tasks (status, due_date),
    INDEX idx_title_search (title),
    
    -- Constraints
    CONSTRAINT chk_task_dates CHECK (
        (due_date IS NULL OR start_date IS NULL OR due_date >= start_date) AND
        (completion_date IS NULL OR start_date IS NULL OR completion_date >= start_date)
    ),
    CONSTRAINT chk_task_hours CHECK (
        (estimated_hours IS NULL OR estimated_hours > 0) AND
        (actual_hours IS NULL OR actual_hours >= 0)
    ),
    CONSTRAINT chk_completion_status CHECK (
        (status = 'done' AND completion_date IS NOT NULL) OR
        (status != 'done' AND completion_date IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='משימות לקוחות';

-- =====================================================
-- 9. TASK_COMMENTS TABLE - הערות על משימות
-- =====================================================
CREATE TABLE task_comments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    task_id CHAR(36) NOT NULL COMMENT 'קישור למשימה',
    
    -- Comment Details
    comment_text TEXT NOT NULL COMMENT 'תוכן ההערה',
    author VARCHAR(100) NOT NULL COMMENT 'מחבר ההערה',
    comment_type ENUM('note', 'status_change', 'progress_update') DEFAULT 'note' COMMENT 'סוג ההערה',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_task_comments (task_id),
    INDEX idx_comment_author (author),
    INDEX idx_comment_date (created_at),
    INDEX idx_comment_type (comment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='הערות על משימות';

-- =====================================================
-- 10. AUDIT_LOG TABLE - לוג שינויים
-- =====================================================
CREATE TABLE audit_log (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- What was changed
    table_name VARCHAR(50) NOT NULL COMMENT 'שם הטבלה',
    record_id CHAR(36) NOT NULL COMMENT 'מזהה הרשומה',
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL COMMENT 'סוג הפעולה',
    
    -- Who and When
    user_name VARCHAR(100) COMMENT 'שם המשתמש',
    user_ip VARCHAR(45) COMMENT 'כתובת IP',
    
    -- What changed
    old_values JSON COMMENT 'ערכים לפני השינוי',
    new_values JSON COMMENT 'ערכים אחרי השינוי',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_user (user_name),
    INDEX idx_created_date (created_at),
    INDEX idx_table_action (table_name, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='לוג ביקורת שינויים';

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Customer Summary
CREATE VIEW v_customer_summary AS
SELECT 
    c.id,
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    c.phone_number,
    c.email,
    c.birth_date,
    TIMESTAMPDIFF(YEAR, c.birth_date, CURDATE()) AS age,
    
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
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
LEFT JOIN tasks t ON c.id = t.customer_id
WHERE c.is_active = TRUE
GROUP BY c.id;

-- View: Active Tasks with Customer Info
CREATE VIEW v_active_tasks AS
SELECT 
    t.id,
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
    
    t.created_at,
    t.updated_at
FROM tasks t
JOIN customers c ON t.customer_id = c.id
LEFT JOIN task_categories tc ON t.category_id = tc.id
WHERE t.status IN ('todo', 'in_progress')
  AND c.is_active = TRUE
ORDER BY 
    CASE t.priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
    END,
    t.due_date ASC,
    t.created_at DESC;

-- View: Pension Fund Performance
CREATE VIEW v_pension_performance AS
SELECT 
    pf.fund_name,
    pf.fund_code,
    pf.management_company,
    COUNT(DISTINCT pc.customer_id) AS customers_count,
    SUM(pc.accumulated_balance) AS total_balance,
    AVG(pc.accumulated_balance) AS avg_balance_per_customer,
    SUM(pc.employee_amount) AS total_employee_contributions,
    SUM(pc.employer_amount) AS total_employer_contributions,
    SUM(pc.total_amount) AS total_monthly_contributions
FROM pension_funds pf
LEFT JOIN pension_contributions pc ON pf.id = pc.fund_id
WHERE pf.is_active = TRUE
GROUP BY pf.id
ORDER BY total_balance DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Add New Customer with Employment
CREATE PROCEDURE sp_add_customer_with_employment(
    IN p_customer_id VARCHAR(20),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_birth_date DATE,
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_address TEXT,
    IN p_company_name VARCHAR(100),
    IN p_position VARCHAR(100),
    IN p_start_date DATE,
    IN p_monthly_salary DECIMAL(10,2),
    OUT p_new_customer_uuid CHAR(36)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert customer
    SET p_new_customer_uuid = UUID();
    INSERT INTO customers (id, customer_id, first_name, last_name, birth_date, phone_number, email, address)
    VALUES (p_new_customer_uuid, p_customer_id, p_first_name, p_last_name, p_birth_date, p_phone, p_email, p_address);
    
    -- Insert employment if provided
    IF p_company_name IS NOT NULL THEN
        INSERT INTO employment_history (customer_id, company_name, position, start_date, monthly_salary)
        VALUES (p_new_customer_uuid, p_company_name, p_position, p_start_date, p_monthly_salary);
    END IF;
    
    COMMIT;
END //

-- Procedure: Calculate Customer Pension Summary
CREATE PROCEDURE sp_customer_pension_summary(
    IN p_customer_uuid CHAR(36),
    OUT p_total_balance DECIMAL(12,2),
    OUT p_monthly_contributions DECIMAL(10,2),
    OUT p_funds_count INT,
    OUT p_estimated_monthly_pension DECIMAL(10,2)
)
BEGIN
    SELECT 
        COALESCE(SUM(accumulated_balance), 0),
        COALESCE(SUM(total_amount), 0),
        COUNT(*),
        COALESCE(SUM(accumulated_balance) * 0.045, 0) -- 4.5% withdrawal rate
    INTO p_total_balance, p_monthly_contributions, p_funds_count, p_estimated_monthly_pension
    FROM pension_contributions 
    WHERE customer_id = p_customer_uuid;
END //

-- Procedure: Update Task Status with Comment
CREATE PROCEDURE sp_update_task_status(
    IN p_task_id CHAR(36),
    IN p_new_status ENUM('todo', 'in_progress', 'done', 'cancelled'),
    IN p_comment TEXT,
    IN p_author VARCHAR(100),
    IN p_actual_hours DECIMAL(5,2)
)
BEGIN
    DECLARE v_old_status VARCHAR(20);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Get current status
    SELECT status INTO v_old_status FROM tasks WHERE id = p_task_id;
    
    -- Update task
    UPDATE tasks 
    SET 
        status = p_new_status,
        actual_hours = COALESCE(p_actual_hours, actual_hours),
        completion_date = CASE WHEN p_new_status = 'done' THEN CURDATE() ELSE completion_date END
    WHERE id = p_task_id;
    
    -- Add comment
    INSERT INTO task_comments (task_id, comment_text, author, comment_type)
    VALUES (p_task_id, 
            CONCAT('Status changed from ', v_old_status, ' to ', p_new_status, 
                   CASE WHEN p_comment IS NOT NULL THEN CONCAT('\n\nComment: ', p_comment) ELSE '' END),
            p_author, 'status_change');
    
    COMMIT;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR AUDIT LOG
-- =====================================================

DELIMITER //

-- Trigger for customers table
CREATE TRIGGER tr_customers_audit_insert AFTER INSERT ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values)
    VALUES ('customers', NEW.id, 'INSERT', JSON_OBJECT(
        'customer_id', NEW.customer_id,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'email', NEW.email,
        'phone_number', NEW.phone_number
    ));
END //

CREATE TRIGGER tr_customers_audit_update AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
    VALUES ('customers', NEW.id, 'UPDATE',
        JSON_OBJECT(
            'customer_id', OLD.customer_id,
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'email', OLD.email,
            'phone_number', OLD.phone_number
        ),
        JSON_OBJECT(
            'customer_id', NEW.customer_id,
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'email', NEW.email,
            'phone_number', NEW.phone_number
        )
    );
END //

-- Trigger for tasks table
CREATE TRIGGER tr_tasks_audit_update AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES ('tasks', NEW.id, 'UPDATE',
            JSON_OBJECT('status', OLD.status, 'updated_at', OLD.updated_at),
            JSON_OBJECT('status', NEW.status, 'updated_at', NEW.updated_at)
        );
    END IF;
END //

DELIMITER ;

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Optimize for common search queries
CREATE INDEX idx_customers_search ON customers(first_name, last_name, customer_id, phone_number);
CREATE INDEX idx_tasks_dashboard ON tasks(status, priority, due_date, customer_id);
CREATE INDEX idx_pension_customer_balance ON pension_contributions(customer_id, accumulated_balance);

-- Optimize for reporting queries
CREATE INDEX idx_customers_created_month ON customers(YEAR(created_at), MONTH(created_at));
CREATE INDEX idx_tasks_completed_month ON tasks(YEAR(completion_date), MONTH(completion_date));

-- =====================================================
-- SECURITY SETTINGS
-- =====================================================

-- Ensure proper charset and collation
ALTER DATABASE agents_calculator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
