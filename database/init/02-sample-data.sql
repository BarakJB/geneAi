-- =====================================================
-- Sample Data for AgentsCalculator Database
-- =====================================================

USE agents_calculator;

-- =====================================================
-- 1. PENSION FUNDS DATA
-- =====================================================
INSERT INTO pension_funds (id, fund_name, fund_code, fund_type, management_company) VALUES
(UUID(), 'מגדל מקפת', 'MGD001', 'pension', 'מגדל'),
(UUID(), 'הראל פנסיה וגמל', 'HRL001', 'pension', 'הראל'),
(UUID(), 'מנורה מבטחים פנסיה', 'MNR001', 'pension', 'מנורה מבטחים'),
(UUID(), 'אלטשולר שחם גמל ופנסיה', 'ALS001', 'pension', 'אלטשולר שחם'),
(UUID(), 'פסגות גמל ופנסיה', 'PSG001', 'pension', 'פסגות'),
(UUID(), 'הפניקס גמל ופנסיה', 'PNX001', 'pension', 'הפניקס'),
(UUID(), 'כלל ביטוח גמל ופנסיה', 'KLL001', 'pension', 'כלל'),
(UUID(), 'מיטב דש גמל ופנסיה', 'MTD001', 'pension', 'מיטב דש');

-- =====================================================
-- 2. INSURANCE TYPES DATA
-- =====================================================
INSERT INTO insurance_types (id, type_name, type_code, description) VALUES
(UUID(), 'ביטוח חיים', 'LIFE', 'ביטוח חיים בסיסי'),
(UUID(), 'ביטוח נכות', 'DISABILITY', 'ביטוח נכות מעבודה ומחוץ לעבודה'),
(UUID(), 'ביטוח בריאות', 'HEALTH', 'ביטוח בריאות השלמתי'),
(UUID(), 'ביטוח רכב', 'AUTO', 'ביטוח חובה וביטוח מקיף לרכב'),
(UUID(), 'ביטוח דירה', 'HOME', 'ביטוח דירה ותכולה'),
(UUID(), 'ביטוח נסיעות', 'TRAVEL', 'ביטוח נסיעות לחו"ל'),
(UUID(), 'ביטוח אחריות מקצועית', 'PROFESSIONAL', 'ביטוח אחריות מקצועית'),
(UUID(), 'ביטוח סייבר', 'CYBER', 'ביטוח סייבר ואבטחת מידע');

-- =====================================================
-- 3. TASK CATEGORIES DATA
-- =====================================================
INSERT INTO task_categories (id, category_name, category_code, description, color_code) VALUES
(UUID(), 'ייעוץ פנסיוני', 'PENSION_ADV', 'ייעוץ ותכנון פנסיוני', '#4CAF50'),
(UUID(), 'ביטוח', 'INSURANCE', 'משימות הקשורות לביטוח', '#2196F3'),
(UUID(), 'דיווחים', 'REPORTS', 'הכנת דוחות ומסמכים', '#FF9800'),
(UUID(), 'שירות לקוחות', 'CUSTOMER_SRV', 'שירות ותמיכה ללקוחות', '#9C27B0'),
(UUID(), 'פגישה', 'MEETING', 'פגישות עם לקוחות', '#F44336'),
(UUID(), 'מעקב', 'FOLLOW_UP', 'מעקב אחר תהליכים', '#607D8B'),
(UUID(), 'אדמיניסטרציה', 'ADMIN', 'משימות אדמיניסטרטיביות', '#795548');

-- =====================================================
-- 4. CUSTOMERS DATA
-- =====================================================

-- Customer 1: ישראל ישראלי
SET @customer1_id = UUID();
INSERT INTO customers (id, customer_id, first_name, last_name, birth_date, phone_number, email, address, gender, marital_status) VALUES
(@customer1_id, '123456789', 'ישראל', 'ישראלי', '1985-06-15', '052-1234567', 'israel.israeli@example.com', 'רחוב הרצל 123, תל אביב', 'male', 'married');

-- Customer 2: שרה כהן
SET @customer2_id = UUID();
INSERT INTO customers (id, customer_id, first_name, last_name, birth_date, phone_number, email, address, gender, marital_status) VALUES
(@customer2_id, '987654321', 'שרה', 'כהן', '1990-03-22', '054-9876543', 'sarah.cohen@example.com', 'רחוב בן גוריון 456, ירושלים', 'female', 'single');

-- Customer 3: דוד לוי
SET @customer3_id = UUID();
INSERT INTO customers (id, customer_id, first_name, last_name, birth_date, phone_number, email, address, gender, marital_status) VALUES
(@customer3_id, '456789123', 'דוד', 'לוי', '1978-11-08', '053-5555555', 'david.levy@example.com', 'שדרות רוטשילד 789, חיפה', 'male', 'divorced');

-- Customer 4: מיכל בן דוד
SET @customer4_id = UUID();
INSERT INTO customers (id, customer_id, first_name, last_name, birth_date, phone_number, email, address, gender, marital_status) VALUES
(@customer4_id, '789123456', 'מיכל', 'בן דוד', '1995-07-12', '050-7777777', 'michal.bendavid@example.com', 'רחוב יפו 321, באר שבע', 'female', 'married');

-- =====================================================
-- 5. EMPLOYMENT HISTORY DATA
-- =====================================================

-- Employment for Customer 1 (ישראל ישראלי)
INSERT INTO employment_history (customer_id, company_name, position, start_date, end_date, monthly_salary, employment_type) VALUES
(@customer1_id, 'חברת היי-טק בע"מ', 'מהנדס תוכנה בכיר', '2020-01-01', NULL, 25000.00, 'full_time'),
(@customer1_id, 'סטארט-אפ חדשני', 'מפתח Full Stack', '2018-01-01', '2019-12-31', 18000.00, 'full_time');

-- Employment for Customer 2 (שרה כהן)
INSERT INTO employment_history (customer_id, company_name, position, start_date, end_date, monthly_salary, employment_type) VALUES
(@customer2_id, 'בנק הפועלים', 'יועצת כלכלית', '2018-06-01', '2023-12-31', 18000.00, 'full_time'),
(@customer2_id, 'חברת ייעוץ כלכלי', 'יועצת עצמאית', '2024-01-01', NULL, 22000.00, 'contractor');

-- Employment for Customer 3 (דוד לוי)
INSERT INTO employment_history (customer_id, company_name, position, start_date, end_date, monthly_salary, employment_type) VALUES
(@customer3_id, 'משרד עורכי דין גדול', 'מנהל משאבי אנוש', '2015-03-01', NULL, 20000.00, 'full_time');

-- Employment for Customer 4 (מיכל בן דוד)
INSERT INTO employment_history (customer_id, company_name, position, start_date, end_date, monthly_salary, employment_type) VALUES
(@customer4_id, 'חברת שיווק דיגיטלי', 'מנהלת פרויקטים', '2022-01-01', NULL, 16000.00, 'full_time'),
(@customer4_id, 'חברת גרפיקה', 'מעצבת גרפית', '2020-01-01', '2021-12-31', 12000.00, 'part_time');

-- =====================================================
-- 6. PENSION CONTRIBUTIONS DATA
-- =====================================================

-- Get fund IDs
SET @mgd_fund_id = (SELECT id FROM pension_funds WHERE fund_code = 'MGD001' LIMIT 1);
SET @hrl_fund_id = (SELECT id FROM pension_funds WHERE fund_code = 'HRL001' LIMIT 1);
SET @mnr_fund_id = (SELECT id FROM pension_funds WHERE fund_code = 'MNR001' LIMIT 1);
SET @als_fund_id = (SELECT id FROM pension_funds WHERE fund_code = 'ALS001' LIMIT 1);

-- Pension contributions for Customer 1 (ישראל ישראלי)
INSERT INTO pension_contributions (customer_id, fund_id, contribution_date, employee_amount, employer_amount, accumulated_balance) VALUES
(@customer1_id, @mgd_fund_id, '2024-01-01', 1625.00, 1875.00, 150000.00),
(@customer1_id, @hrl_fund_id, '2024-01-01', 500.00, 750.00, 45000.00);

-- Pension contributions for Customer 2 (שרה כהן)
INSERT INTO pension_contributions (customer_id, fund_id, contribution_date, employee_amount, employer_amount, accumulated_balance) VALUES
(@customer2_id, @hrl_fund_id, '2023-12-01', 1170.00, 1350.00, 95000.00);

-- Pension contributions for Customer 3 (דוד לוי)
INSERT INTO pension_contributions (customer_id, fund_id, contribution_date, employee_amount, employer_amount, accumulated_balance) VALUES
(@customer3_id, @mnr_fund_id, '2024-01-01', 1300.00, 1500.00, 180000.00);

-- Pension contributions for Customer 4 (מיכל בן דוד)
INSERT INTO pension_contributions (customer_id, fund_id, contribution_date, employee_amount, employer_amount, accumulated_balance) VALUES
(@customer4_id, @als_fund_id, '2024-01-01', 1040.00, 1200.00, 65000.00);

-- =====================================================
-- 7. CUSTOMER INSURANCE DATA
-- =====================================================

-- Get insurance type IDs
SET @life_insurance_id = (SELECT id FROM insurance_types WHERE type_code = 'LIFE' LIMIT 1);
SET @disability_insurance_id = (SELECT id FROM insurance_types WHERE type_code = 'DISABILITY' LIMIT 1);
SET @health_insurance_id = (SELECT id FROM insurance_types WHERE type_code = 'HEALTH' LIMIT 1);
SET @auto_insurance_id = (SELECT id FROM insurance_types WHERE type_code = 'AUTO' LIMIT 1);
SET @home_insurance_id = (SELECT id FROM insurance_types WHERE type_code = 'HOME' LIMIT 1);

-- Insurance for Customer 1 (ישראל ישראלי)
INSERT INTO customer_insurance (customer_id, insurance_type_id, provider_name, policy_number, coverage_amount, monthly_premium, start_date, is_active) VALUES
(@customer1_id, @life_insurance_id, 'הפניקס', 'LIFE-123456', 1000000.00, 350.00, '2020-01-01', TRUE),
(@customer1_id, @disability_insurance_id, 'הפניקס', 'DISABILITY-123456', 15000.00, 250.00, '2020-01-01', TRUE),
(@customer1_id, @auto_insurance_id, 'מנורה מבטחים', 'AUTO-789123', 50000.00, 180.00, '2024-01-01', TRUE);

-- Insurance for Customer 2 (שרה כהן)
INSERT INTO customer_insurance (customer_id, insurance_type_id, provider_name, policy_number, coverage_amount, monthly_premium, start_date, is_active) VALUES
(@customer2_id, @disability_insurance_id, 'מגדל', 'DISABILITY-987654', 12000.00, 180.00, '2018-06-01', TRUE),
(@customer2_id, @health_insurance_id, 'כלל', 'HEALTH-987654', 25000.00, 120.00, '2019-01-01', TRUE);

-- Insurance for Customer 3 (דוד לוי)
INSERT INTO customer_insurance (customer_id, insurance_type_id, provider_name, policy_number, coverage_amount, monthly_premium, start_date, is_active) VALUES
(@customer3_id, @life_insurance_id, 'אלטשולר שחם', 'LIFE-456789', 800000.00, 280.00, '2015-03-01', TRUE),
(@customer3_id, @home_insurance_id, 'הראל', 'HOME-456789', 150000.00, 95.00, '2016-01-01', TRUE);

-- Insurance for Customer 4 (מיכל בן דוד)
INSERT INTO customer_insurance (customer_id, insurance_type_id, provider_name, policy_number, coverage_amount, monthly_premium, start_date, is_active) VALUES
(@customer4_id, @disability_insurance_id, 'כלל', 'DISABILITY-789123', 10000.00, 150.00, '2022-01-01', TRUE),
(@customer4_id, @auto_insurance_id, 'הפניקס', 'AUTO-789123', 45000.00, 165.00, '2023-01-01', TRUE);

-- =====================================================
-- 8. TASKS DATA
-- =====================================================

-- Get category IDs
SET @pension_category_id = (SELECT id FROM task_categories WHERE category_code = 'PENSION_ADV' LIMIT 1);
SET @insurance_category_id = (SELECT id FROM task_categories WHERE category_code = 'INSURANCE' LIMIT 1);
SET @reports_category_id = (SELECT id FROM task_categories WHERE category_code = 'REPORTS' LIMIT 1);
SET @meeting_category_id = (SELECT id FROM task_categories WHERE category_code = 'MEETING' LIMIT 1);
SET @followup_category_id = (SELECT id FROM task_categories WHERE category_code = 'FOLLOW_UP' LIMIT 1);

-- Tasks for Customer 1 (ישראל ישראלי)
INSERT INTO tasks (customer_id, category_id, title, description, task_request, status, priority, due_date, start_date, assigned_to, estimated_hours, tags) VALUES
(@customer1_id, @pension_category_id, 'בדיקת תיק פנסיה', 'סקירה מלאה של תיק הפנסיה ועדכון נתונים', 'הלקוח ביקש לבדוק את מצב הפנסיה שלו', 'in_progress', 'high', '2024-01-25', '2024-01-15', 'יוסי מנהל', 3.0, '["פנסיה", "בדיקה", "עדכון"]'),
(@customer1_id, @reports_category_id, 'הכנת דוח שנתי', 'הכנת דוח מס שנתי ללקוח', 'צריך דוח לשנת 2023', 'todo', 'medium', '2024-02-01', NULL, 'דנה רואת חשבון', 5.0, '["מס", "דוח", "2023"]');

-- Tasks for Customer 2 (שרה כהן)
INSERT INTO tasks (customer_id, category_id, title, description, task_request, status, priority, due_date, start_date, completion_date, assigned_to, estimated_hours, actual_hours, tags) VALUES
(@customer2_id, @meeting_category_id, 'ייעוץ פנסיוני', 'פגישת ייעוץ לתכנון פנסיוני', 'לקוחה מעוניינת בייעוץ לקראת הפרישה', 'done', 'medium', '2024-01-18', '2024-01-05', '2024-01-18', 'רחל יועצת', 2.0, 2.5, '["ייעוץ", "פנסיה", "פרישה"]');

-- Tasks for Customer 3 (דוד לוי)
INSERT INTO tasks (customer_id, category_id, title, description, task_request, status, priority, due_date, assigned_to, estimated_hours, tags) VALUES
(@customer3_id, @insurance_category_id, 'עדכון ביטוח חיים', 'עדכון סכום ביטוח חיים בהתאם לשינוי שכר', 'לקוח קיבל העלאת שכר ורוצה לעדכן ביטוח', 'todo', 'low', '2024-02-15', 'מיכל ביטוח', 1.5, '["ביטוח", "עדכון", "שכר"]'),
(@customer3_id, @followup_category_id, 'מעקב אחר תביעת ביטוח', 'מעקב אחר תביעת ביטוח דירה', 'תביעה בגין נזק מים בדירה', 'in_progress', 'high', '2024-01-30', 'אורי תביעות', 2.0, '["תביעה", "ביטוח", "נזק"]');

-- Tasks for Customer 4 (מיכל בן דוד)
INSERT INTO tasks (customer_id, category_id, title, description, task_request, status, priority, assigned_to, estimated_hours, tags) VALUES
(@customer4_id, @pension_category_id, 'בדיקת אפשרויות קרן פנסיה', 'בדיקת קרנות פנסיה חלופיות ללקוחה', 'לקוחה לא מרוצה מהקרן הנוכחית', 'todo', 'medium', 'שירה ייעוץ', 4.0, '["פנסיה", "השוואה", "קרנות"]');

-- =====================================================
-- 9. TASK COMMENTS DATA
-- =====================================================

-- Get task IDs
SET @task1_id = (SELECT id FROM tasks WHERE title = 'בדיקת תיק פנסיה' AND customer_id = @customer1_id LIMIT 1);
SET @task2_id = (SELECT id FROM tasks WHERE title = 'מעקב אחר תביעת ביטוח' AND customer_id = @customer3_id LIMIT 1);

-- Comments for tasks
INSERT INTO task_comments (task_id, comment_text, author, comment_type) VALUES
(@task1_id, 'התחלתי לעבוד על המשימה. בדקתי את היתרות בקרנות הפנסיה', 'יוסי מנהל', 'progress_update'),
(@task1_id, 'מצאתי בעיה קטנה בנתונים - צריך לברר עם הלקוח', 'יוסי מנהל', 'note'),
(@task2_id, 'יצרתי קשר עם חברת הביטוח, הם אמרו שהתביעה בבדיקה', 'אורי תביעות', 'progress_update');

-- =====================================================
-- VERIFY DATA INTEGRITY
-- =====================================================

-- Check data counts
SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 'employment_history', COUNT(*) FROM employment_history
UNION ALL
SELECT 'pension_funds', COUNT(*) FROM pension_funds
UNION ALL
SELECT 'pension_contributions', COUNT(*) FROM pension_contributions
UNION ALL
SELECT 'insurance_types', COUNT(*) FROM insurance_types
UNION ALL
SELECT 'customer_insurance', COUNT(*) FROM customer_insurance
UNION ALL
SELECT 'task_categories', COUNT(*) FROM task_categories
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'task_comments', COUNT(*) FROM task_comments;

-- Test views
SELECT 'Customer Summary View Test' as test_name;
SELECT * FROM v_customer_summary LIMIT 3;

SELECT 'Active Tasks View Test' as test_name;
SELECT * FROM v_active_tasks LIMIT 3;

SELECT 'Pension Performance View Test' as test_name;
SELECT * FROM v_pension_performance LIMIT 3;
