-- =====================================================
-- Sample Data for Agencies - Multi-Tenancy
-- =====================================================

USE agents_calculator;

-- =====================================================
-- 1. SAMPLE AGENCIES DATA
-- =====================================================

-- Agency 1: ביטוח וייעוץ המרכז
SET @agency1_id = UUID();
INSERT INTO agencies (
    id, agency_name, business_number, unique_identifier, 
    address, primary_email, phone_number, website,
    icon_url, logo_url, primary_color, secondary_color,
    max_users, max_clients, subscription_plan,
    features, settings,
    is_active, subscription_start, subscription_end, billing_cycle,
    contact_person_name, contact_person_phone, contact_person_email,
    created_by
) VALUES (
    @agency1_id,
    'ביטוח וייעוץ המרכז',
    '514567890',
    'center_insurance',
    'רחוב דיזנגוף 50, תל אביב',
    'info@center-insurance.co.il',
    '03-5555555',
    'https://center-insurance.co.il',
    'https://via.placeholder.com/64/2196F3/white?text=CI',
    'https://via.placeholder.com/200x80/2196F3/white?text=CENTER+INSURANCE',
    '#2196F3',
    '#FFC107',
    15,
    500,
    'professional',
    JSON_OBJECT(
        'pension_management', true,
        'insurance_management', true,
        'reports', true,
        'api_access', true,
        'custom_branding', true,
        'bulk_operations', true
    ),
    JSON_OBJECT(
        'currency', 'ILS',
        'date_format', 'DD/MM/YYYY',
        'language', 'he',
        'timezone', 'Asia/Jerusalem',
        'notifications_enabled', true,
        'auto_backup', true
    ),
    TRUE,
    '2024-01-01',
    '2024-12-31',
    'yearly',
    'דוד כהן',
    '050-1234567',
    'david.cohen@center-insurance.co.il',
    'system'
);

-- Agency 2: פנסיה ופיננסים דרור
SET @agency2_id = UUID();
INSERT INTO agencies (
    id, agency_name, business_number, unique_identifier,
    address, primary_email, phone_number, website,
    icon_url, logo_url, primary_color, secondary_color,
    max_users, max_clients, subscription_plan,
    features, settings,
    is_active, subscription_start, subscription_end, billing_cycle,
    contact_person_name, contact_person_phone, contact_person_email,
    created_by
) VALUES (
    @agency2_id,
    'פנסיה ופיננסים דרור',
    '520987654',
    'dror_pension',
    'שדרות רוטשילד 120, תל אביב',
    'office@dror-pension.co.il',
    '03-7777777',
    'https://dror-pension.co.il',
    'https://via.placeholder.com/64/4CAF50/white?text=DP',
    'https://via.placeholder.com/200x80/4CAF50/white?text=DROR+PENSION',
    '#4CAF50',
    '#FF9800',
    10,
    300,
    'professional',
    JSON_OBJECT(
        'pension_management', true,
        'insurance_management', false,
        'reports', true,
        'api_access', false,
        'custom_branding', true,
        'bulk_operations', false
    ),
    JSON_OBJECT(
        'currency', 'ILS',
        'date_format', 'DD/MM/YYYY',
        'language', 'he',
        'timezone', 'Asia/Jerusalem',
        'notifications_enabled', true,
        'auto_backup', false
    ),
    TRUE,
    '2024-01-15',
    '2025-01-15',
    'yearly',
    'רחל דרור',
    '054-9876543',
    'rachel.dror@dror-pension.co.il',
    'system'
);

-- Agency 3: ייעוץ ביטוח הצפון (Basic Plan)
SET @agency3_id = UUID();
INSERT INTO agencies (
    id, agency_name, business_number, unique_identifier,
    address, primary_email, phone_number,
    icon_url, primary_color, secondary_color,
    max_users, max_clients, subscription_plan,
    features, settings,
    is_active, subscription_start, subscription_end, billing_cycle,
    contact_person_name, contact_person_phone, contact_person_email,
    created_by
) VALUES (
    @agency3_id,
    'ייעוץ ביטוח הצפון',
    '516123456',
    'north_insurance',
    'רחוב הגליל 25, חיפה',
    'info@north-insurance.co.il',
    '04-8888888',
    'https://via.placeholder.com/64/9C27B0/white?text=NI',
    '#9C27B0',
    '#607D8B',
    5,
    100,
    'basic',
    JSON_OBJECT(
        'pension_management', true,
        'insurance_management', true,
        'reports', false,
        'api_access', false,
        'custom_branding', false,
        'bulk_operations', false
    ),
    JSON_OBJECT(
        'currency', 'ILS',
        'date_format', 'DD/MM/YYYY',
        'language', 'he',
        'timezone', 'Asia/Jerusalem',
        'notifications_enabled', false,
        'auto_backup', false
    ),
    TRUE,
    '2024-02-01',
    '2024-08-01',
    'monthly',
    'משה לוי',
    '052-5555555',
    'moshe.levy@north-insurance.co.il',
    'system'
);

-- =====================================================
-- 2. AGENCY USERS DATA
-- =====================================================

-- Users for Agency 1 (ביטוח וייעוץ המרכז)
SET @user1_id = UUID();
INSERT INTO agency_users (
    id, agency_id, username, email, first_name, last_name, phone_number,
    password_hash, role, permissions, is_active, email_verified, created_by
) VALUES 
(@user1_id, @agency1_id, 'david.cohen', 'david.cohen@center-insurance.co.il', 'דוד', 'כהן', '050-1234567',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'admin',
 JSON_OBJECT('manage_users', true, 'manage_clients', true, 'manage_settings', true, 'view_reports', true),
 TRUE, TRUE, NULL),

(UUID(), @agency1_id, 'sarah.israeli', 'sarah.israeli@center-insurance.co.il', 'שרה', 'ישראלי', '051-2345678',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'manager',
 JSON_OBJECT('manage_clients', true, 'create_tasks', true, 'view_reports', true),
 TRUE, TRUE, @user1_id),

(UUID(), @agency1_id, 'agent1', 'agent1@center-insurance.co.il', 'יוסי', 'מנהל', '052-3456789',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'agent',
 JSON_OBJECT('manage_clients', true, 'create_tasks', true),
 TRUE, TRUE, @user1_id);

-- Users for Agency 2 (פנסיה ופיננסים דרור)
SET @user2_id = UUID();
INSERT INTO agency_users (
    id, agency_id, username, email, first_name, last_name, phone_number,
    password_hash, role, permissions, is_active, email_verified, created_by
) VALUES 
(@user2_id, @agency2_id, 'rachel.dror', 'rachel.dror@dror-pension.co.il', 'רחל', 'דרור', '054-9876543',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'admin',
 JSON_OBJECT('manage_users', true, 'manage_clients', true, 'manage_settings', true, 'view_reports', true),
 TRUE, TRUE, NULL),

(UUID(), @agency2_id, 'pension.expert', 'expert@dror-pension.co.il', 'אבי', 'פנסיוני', '053-4567890',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'agent',
 JSON_OBJECT('manage_clients', true, 'create_tasks', true),
 TRUE, TRUE, @user2_id);

-- Users for Agency 3 (ייעוץ ביטוח הצפון)
SET @user3_id = UUID();
INSERT INTO agency_users (
    id, agency_id, username, email, first_name, last_name, phone_number,
    password_hash, role, permissions, is_active, email_verified, created_by
) VALUES 
(@user3_id, @agency3_id, 'moshe.levy', 'moshe.levy@north-insurance.co.il', 'משה', 'לוי', '052-5555555',
 '$2b$12$LQv3c1yqBwx8NuMEy8rl1OyBKPT9TZw8k7m9L6K5C2F3Q4W5E6R7', 'admin',
 JSON_OBJECT('manage_users', true, 'manage_clients', true, 'manage_settings', true),
 TRUE, TRUE, NULL);

-- =====================================================
-- 3. UPDATE EXISTING DATA WITH AGENCY ASSIGNMENTS
-- =====================================================

-- Assign existing customers to agencies
UPDATE customers SET agency_id = @agency1_id WHERE customer_id = '123456789'; -- ישראל ישראלי
UPDATE customers SET agency_id = @agency2_id WHERE customer_id = '987654321'; -- שרה כהן
UPDATE customers SET agency_id = @agency1_id WHERE customer_id = '456789123'; -- דוד לוי
UPDATE customers SET agency_id = @agency3_id WHERE customer_id = '789123456'; -- מיכל בן דוד

-- Assign existing tasks to agencies (based on customer's agency)
UPDATE tasks t 
JOIN customers c ON t.customer_id = c.id 
SET t.agency_id = c.agency_id;

-- Set created_by for existing tasks
UPDATE tasks SET created_by = @user1_id WHERE customer_id IN (
    SELECT id FROM customers WHERE agency_id = @agency1_id
);
UPDATE tasks SET created_by = @user2_id WHERE customer_id IN (
    SELECT id FROM customers WHERE agency_id = @agency2_id
);
UPDATE tasks SET created_by = @user3_id WHERE customer_id IN (
    SELECT id FROM customers WHERE agency_id = @agency3_id
);

-- =====================================================
-- 4. AGENCY-SPECIFIC CUSTOM DATA
-- =====================================================

-- Custom task categories for Agency 1
INSERT INTO task_categories (id, agency_id, category_name, category_code, description, color_code) VALUES
(UUID(), @agency1_id, 'ביטוח רכב', 'AUTO_INS', 'משימות הקשורות לביטוח רכב', '#FF5722'),
(UUID(), @agency1_id, 'ביטוח דירה', 'HOME_INS', 'משימות הקשורות לביטוח דירה', '#795548'),
(UUID(), @agency1_id, 'מעקב תביעות', 'CLAIMS', 'מעקב אחר תביעות ביטוח', '#E91E63');

-- Custom task categories for Agency 2  
INSERT INTO task_categories (id, agency_id, category_name, category_code, description, color_code) VALUES
(UUID(), @agency2_id, 'תכנון פרישה', 'RETIREMENT', 'תכנון פרישה וייעוץ פנסיוני', '#3F51B5'),
(UUID(), @agency2_id, 'קרנות השתלמות', 'TRAINING_FUND', 'ניהול קרנות השתלמות', '#009688');

-- Custom pension fund for Agency 2
INSERT INTO pension_funds (id, agency_id, fund_name, fund_code, fund_type, management_company) VALUES
(UUID(), @agency2_id, 'קרן פנסיה דרור', 'DROR001', 'pension', 'דרור פיננסים');

-- Custom insurance type for Agency 1
INSERT INTO insurance_types (id, agency_id, type_name, type_code, description) VALUES
(UUID(), @agency1_id, 'ביטוח פרטי מורחב', 'PRIVATE_EXT', 'ביטוח פרטי מורחב של הסוכנות');

-- =====================================================
-- 5. ADDITIONAL SAMPLE CLIENTS PER AGENCY
-- =====================================================

-- Additional clients for Agency 1 (ביטוח וייעוץ המרכז)
SET @new_customer1 = UUID();
INSERT INTO customers (id, agency_id, customer_id, first_name, last_name, birth_date, phone_number, email, address) VALUES
(@new_customer1, @agency1_id, '111222333', 'עמי', 'שמעון', '1982-09-15', '050-1111111', 'ami.shimon@example.com', 'נתניה'),
(UUID(), @agency1_id, '444555666', 'טליה', 'אברהם', '1987-12-03', '051-2222222', 'talia.abraham@example.com', 'רמת גן');

-- Additional clients for Agency 2 (פנסיה ופיננסים דרור)
INSERT INTO customers (id, agency_id, customer_id, first_name, last_name, birth_date, phone_number, email, address) VALUES
(UUID(), @agency2_id, '777888999', 'אורן', 'זכריה', '1975-04-20', '052-3333333', 'oren.zechariah@example.com', 'הרצליה'),
(UUID(), @agency2_id, '000111222', 'נועה', 'ברק', '1990-07-08', '054-4444444', 'noa.barak@example.com', 'כפר סבא');

-- Additional client for Agency 3 (ייעוץ ביטוח הצפון)
INSERT INTO customers (id, agency_id, customer_id, first_name, last_name, birth_date, phone_number, email, address) VALUES
(UUID(), @agency3_id, '333444555', 'רון', 'גולן', '1984-11-25', '055-5555555', 'ron.golan@example.com', 'חיפה');

-- =====================================================
-- 6. AGENCY-SPECIFIC TASKS
-- =====================================================

-- Get category IDs for agency-specific tasks
SET @auto_category_id = (SELECT id FROM task_categories WHERE agency_id = @agency1_id AND category_code = 'AUTO_INS' LIMIT 1);
SET @retirement_category_id = (SELECT id FROM task_categories WHERE agency_id = @agency2_id AND category_code = 'RETIREMENT' LIMIT 1);

-- Tasks for Agency 1
INSERT INTO tasks (agency_id, customer_id, category_id, title, description, status, priority, due_date, assigned_to, created_by, estimated_hours) VALUES
(@agency1_id, @new_customer1, @auto_category_id, 'הוצאת ביטוח רכב חדש', 'עמי קנה רכב חדש וצריך ביטוח', 'todo', 'high', '2024-02-10', 'שרה ישראלי', @user1_id, 2.0),
(@agency1_id, (SELECT id FROM customers WHERE customer_id = '456789123'), NULL, 'עדכון פרטי ביטוח חיים', 'עדכון מוטבים בביטוח חיים', 'in_progress', 'medium', '2024-02-15', 'יוסי מנהל', @user1_id, 1.5);

-- Tasks for Agency 2  
INSERT INTO tasks (agency_id, customer_id, category_id, title, description, status, priority, due_date, assigned_to, created_by, estimated_hours) VALUES
(@agency2_id, (SELECT id FROM customers WHERE customer_id = '987654321'), @retirement_category_id, 'תכנון פרישה לגיל 60', 'חישוב זכויות פנסיוניות לפרישה מוקדמת', 'todo', 'high', '2024-02-20', 'אבי פנסיוני', @user2_id, 4.0);

-- =====================================================
-- 7. VERIFY MULTI-TENANCY DATA
-- =====================================================

-- Check agencies summary
SELECT 'Agencies Summary' as report_type;
SELECT * FROM v_agency_summary;

-- Check agency separation
SELECT 'Agency 1 Customers' as report_type;
SELECT customer_id, full_name, agency_name FROM v_agency_customers WHERE agency_identifier = 'center_insurance';

SELECT 'Agency 2 Customers' as report_type;
SELECT customer_id, full_name, agency_name FROM v_agency_customers WHERE agency_identifier = 'dror_pension';

SELECT 'Agency 3 Customers' as report_type;
SELECT customer_id, full_name, agency_name FROM v_agency_customers WHERE agency_identifier = 'north_insurance';

-- Check task separation
SELECT 'Tasks by Agency' as report_type;
SELECT agency_identifier, COUNT(*) as task_count, status 
FROM v_agency_tasks 
GROUP BY agency_identifier, status
ORDER BY agency_identifier, status;

-- Verify data counts
SELECT 'Data Verification' as report_type;
SELECT 
    'agencies' as table_name, COUNT(*) as record_count FROM agencies
UNION ALL
SELECT 'agency_users', COUNT(*) FROM agency_users  
UNION ALL
SELECT 'customers_with_agency', COUNT(*) FROM customers WHERE agency_id IS NOT NULL
UNION ALL
SELECT 'tasks_with_agency', COUNT(*) FROM tasks WHERE agency_id IS NOT NULL;
