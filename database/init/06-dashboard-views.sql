-- =====================================================
-- Dashboard Views for Multi-Tenant System
-- Views optimized for dashboard statistics per agency
-- =====================================================

USE agents_calculator;

-- =====================================================
-- 1. DASHBOARD STATISTICS VIEWS
-- =====================================================

-- Main Dashboard Statistics View (per agency)
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT 
    a.id as agency_id,
    a.agency_name,
    a.unique_identifier,
    
    -- Customer Status Statistics
    COUNT(DISTINCT CASE WHEN c.customer_status = '0' AND c.is_active = TRUE THEN c.id END) as leads_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '1' AND c.is_active = TRUE THEN c.id END) as meetings_scheduled,
    COUNT(DISTINCT CASE WHEN c.customer_status = '2' AND c.is_active = TRUE THEN c.id END) as not_relevant_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' AND c.is_active = TRUE THEN c.id END) as active_customers,
    COUNT(DISTINCT CASE WHEN c.is_active = TRUE THEN c.id END) as total_contacts,
    
    -- Task Statistics
    COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as active_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT t.id) as total_tasks,
    
    -- Financial Statistics (only for active customers - status 4)
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance ELSE 0 END), 0) as total_pension_balance,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN ci.coverage_amount ELSE 0 END), 0) as total_insurance_coverage,
    COALESCE(AVG(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance END), 0) as avg_pension_per_customer,
    
    -- User Statistics
    COUNT(DISTINCT CASE WHEN au.is_active = TRUE THEN au.id END) as active_users,
    COUNT(DISTINCT au.id) as total_users,
    
    -- Recent Activity
    COUNT(DISTINCT CASE WHEN DATE(c.created_at) = CURDATE() THEN c.id END) as new_contacts_today,
    COUNT(DISTINCT CASE WHEN DATE(t.created_at) = CURDATE() THEN t.id END) as new_tasks_today,
    COUNT(DISTINCT CASE WHEN DATE(c.status_changed_at) = CURDATE() THEN c.id END) as status_changes_today,
    
    -- Performance Metrics
    ROUND(
        CASE 
            WHEN COUNT(DISTINCT CASE WHEN c.customer_status IN ('0', '1') THEN c.id END) > 0
            THEN (COUNT(DISTINCT CASE WHEN c.customer_status = '4' THEN c.id END) * 100.0 / 
                  COUNT(DISTINCT CASE WHEN c.customer_status IN ('0', '1', '4') THEN c.id END))
            ELSE 0 
        END, 2
    ) as conversion_rate_percentage,
    
    -- Time-based Statistics
    COUNT(DISTINCT CASE WHEN c.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN c.id END) as new_contacts_week,
    COUNT(DISTINCT CASE WHEN c.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN c.id END) as new_contacts_month
    
FROM agencies a
LEFT JOIN customers c ON a.id = c.agency_id
LEFT JOIN tasks t ON a.id = t.agency_id
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
LEFT JOIN agency_users au ON a.id = au.agency_id
WHERE a.is_active = TRUE
GROUP BY a.id;

-- =====================================================
-- 2. RECENT ACTIVITY VIEW
-- =====================================================

CREATE OR REPLACE VIEW v_recent_activity AS
SELECT 
    'customer_created' as activity_type,
    'לקוח חדש נוסף' as activity_description,
    CONCAT(c.first_name, ' ', c.last_name) as subject_name,
    c.customer_id as subject_id,
    cst.status_name as status_info,
    cst.status_color as status_color,
    c.agency_id,
    a.agency_name,
    c.created_at as activity_date,
    NULL as user_name
FROM customers c
JOIN agencies a ON c.agency_id = a.id
JOIN customer_status_types cst ON c.customer_status = cst.status_code
WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND c.is_active = TRUE

UNION ALL

SELECT 
    'status_changed' as activity_type,
    'שינוי סטטוס לקוח' as activity_description,
    CONCAT(c.first_name, ' ', c.last_name) as subject_name,
    c.customer_id as subject_id,
    cst.status_name as status_info,
    cst.status_color as status_color,
    c.agency_id,
    a.agency_name,
    c.status_changed_at as activity_date,
    CONCAT(au.first_name, ' ', au.last_name) as user_name
FROM customers c
JOIN agencies a ON c.agency_id = a.id
JOIN customer_status_types cst ON c.customer_status = cst.status_code
LEFT JOIN agency_users au ON c.status_changed_by = au.id
WHERE c.status_changed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND c.status_changed_at IS NOT NULL
  AND c.is_active = TRUE

UNION ALL

SELECT 
    'task_created' as activity_type,
    'משימה חדשה נוצרה' as activity_description,
    t.title as subject_name,
    t.id as subject_id,
    t.status as status_info,
    CASE t.priority 
        WHEN 'urgent' THEN '#F44336'
        WHEN 'high' THEN '#FF9800' 
        WHEN 'medium' THEN '#2196F3'
        WHEN 'low' THEN '#4CAF50'
        ELSE '#9E9E9E'
    END as status_color,
    t.agency_id,
    a.agency_name,
    t.created_at as activity_date,
    CONCAT(au.first_name, ' ', au.last_name) as user_name
FROM tasks t
JOIN agencies a ON t.agency_id = a.id
LEFT JOIN agency_users au ON t.created_by = au.id
WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    'task_completed' as activity_type,
    'משימה הושלמה' as activity_description,
    t.title as subject_name,
    t.id as subject_id,
    'הושלמה' as status_info,
    '#4CAF50' as status_color,
    t.agency_id,
    a.agency_name,
    t.completion_date as activity_date,
    t.assigned_to as user_name
FROM tasks t
JOIN agencies a ON t.agency_id = a.id
WHERE t.completion_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND t.status = 'done'

ORDER BY activity_date DESC;

-- =====================================================
-- 3. URGENT ITEMS VIEW
-- =====================================================

CREATE OR REPLACE VIEW v_urgent_items AS
SELECT 
    'overdue_task' as item_type,
    'משימה באיחור' as item_description,
    t.title as item_name,
    t.id as item_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.customer_id,
    t.due_date,
    DATEDIFF(CURDATE(), t.due_date) as days_overdue,
    t.priority,
    CASE t.priority 
        WHEN 'urgent' THEN '#F44336'
        WHEN 'high' THEN '#FF9800' 
        WHEN 'medium' THEN '#2196F3'
        WHEN 'low' THEN '#4CAF50'
    END as priority_color,
    t.agency_id,
    a.agency_name,
    t.assigned_to
FROM tasks t
JOIN customers c ON t.customer_id = c.id
JOIN agencies a ON t.agency_id = a.id
WHERE t.status IN ('todo', 'in_progress')
  AND t.due_date < CURDATE()
  AND a.is_active = TRUE

UNION ALL

SELECT 
    'old_lead' as item_type,
    'ליד ישן' as item_description,
    CONCAT(c.first_name, ' ', c.last_name) as item_name,
    c.id as item_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.customer_id,
    c.created_at as due_date,
    DATEDIFF(CURDATE(), c.created_at) as days_overdue,
    'medium' as priority,
    '#FF9800' as priority_color,
    c.agency_id,
    a.agency_name,
    NULL as assigned_to
FROM customers c
JOIN agencies a ON c.agency_id = a.id
WHERE c.customer_status = '0'
  AND c.created_at <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  AND c.is_active = TRUE
  AND a.is_active = TRUE

UNION ALL

SELECT 
    'scheduled_meeting' as item_type,
    'פגישה מתוכננת' as item_description,
    CONCAT(c.first_name, ' ', c.last_name) as item_name,
    c.id as item_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.customer_id,
    c.status_changed_at as due_date,
    DATEDIFF(CURDATE(), c.status_changed_at) as days_overdue,
    'high' as priority,
    '#2196F3' as priority_color,
    c.agency_id,
    a.agency_name,
    NULL as assigned_to
FROM customers c
JOIN agencies a ON c.agency_id = a.id
WHERE c.customer_status = '1'
  AND c.status_changed_at <= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
  AND c.is_active = TRUE
  AND a.is_active = TRUE

ORDER BY days_overdue DESC, priority_color;

-- =====================================================
-- 4. PERFORMANCE METRICS VIEW
-- =====================================================

CREATE OR REPLACE VIEW v_performance_metrics AS
SELECT 
    a.id as agency_id,
    a.agency_name,
    
    -- Conversion Funnel
    COUNT(CASE WHEN c.customer_status = '0' THEN 1 END) as leads,
    COUNT(CASE WHEN c.customer_status = '1' THEN 1 END) as meetings,
    COUNT(CASE WHEN c.customer_status = '4' THEN 1 END) as customers,
    COUNT(CASE WHEN c.customer_status = '2' THEN 1 END) as not_relevant,
    
    -- Conversion Rates
    ROUND(
        CASE WHEN COUNT(CASE WHEN c.customer_status = '0' THEN 1 END) > 0
        THEN COUNT(CASE WHEN c.customer_status = '1' THEN 1 END) * 100.0 / 
             COUNT(CASE WHEN c.customer_status = '0' THEN 1 END)
        ELSE 0 END, 2
    ) as lead_to_meeting_rate,
    
    ROUND(
        CASE WHEN COUNT(CASE WHEN c.customer_status = '1' THEN 1 END) > 0
        THEN COUNT(CASE WHEN c.customer_status = '4' THEN 1 END) * 100.0 / 
             COUNT(CASE WHEN c.customer_status = '1' THEN 1 END)
        ELSE 0 END, 2
    ) as meeting_to_customer_rate,
    
    ROUND(
        CASE WHEN COUNT(CASE WHEN c.customer_status IN ('0','1') THEN 1 END) > 0
        THEN COUNT(CASE WHEN c.customer_status = '4' THEN 1 END) * 100.0 / 
             COUNT(CASE WHEN c.customer_status IN ('0','1','4') THEN 1 END)
        ELSE 0 END, 2
    ) as overall_conversion_rate,
    
    -- Task Performance
    COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'done' AND t.completion_date <= t.due_date THEN 1 END) as on_time_tasks,
    
    ROUND(
        CASE WHEN COUNT(CASE WHEN t.status = 'done' AND t.due_date IS NOT NULL THEN 1 END) > 0
        THEN COUNT(CASE WHEN t.status = 'done' AND t.completion_date <= t.due_date THEN 1 END) * 100.0 /
             COUNT(CASE WHEN t.status = 'done' AND t.due_date IS NOT NULL THEN 1 END)
        ELSE 0 END, 2
    ) as task_completion_rate,
    
    -- Financial Metrics (for active customers only)
    COALESCE(AVG(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance END), 0) as avg_pension_balance,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.total_amount END), 0) as monthly_contributions,
    COALESCE(AVG(CASE WHEN c.customer_status = '4' THEN ci.coverage_amount END), 0) as avg_insurance_coverage,
    
    -- Time Metrics
    AVG(CASE 
        WHEN c.customer_status = '4' AND c.status_changed_at IS NOT NULL 
        THEN DATEDIFF(c.status_changed_at, c.created_at) 
    END) as avg_days_to_conversion
    
FROM agencies a
LEFT JOIN customers c ON a.id = c.agency_id AND c.is_active = TRUE
LEFT JOIN tasks t ON a.id = t.agency_id
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
WHERE a.is_active = TRUE
GROUP BY a.id;

-- =====================================================
-- 5. TOP PERFORMERS VIEW
-- =====================================================

CREATE OR REPLACE VIEW v_top_performers AS
SELECT 
    au.id as user_id,
    au.agency_id,
    a.agency_name,
    CONCAT(au.first_name, ' ', au.last_name) as user_name,
    au.username,
    au.role,
    
    -- Task Performance
    COUNT(CASE WHEN t.status = 'done' AND t.completion_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as tasks_completed_month,
    COUNT(CASE WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as tasks_created_month,
    
    -- Customer Conversions
    COUNT(CASE WHEN c.status_changed_by = au.id AND c.customer_status = '4' 
               AND c.status_changed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as conversions_month,
    
    -- Recent Activity
    GREATEST(
        COALESCE(MAX(t.updated_at), '1900-01-01'),
        COALESCE(MAX(c.status_changed_at), '1900-01-01')
    ) as last_activity,
    
    -- Performance Score (weighted)
    (
        COUNT(CASE WHEN t.status = 'done' AND t.completion_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) * 2 +
        COUNT(CASE WHEN c.status_changed_by = au.id AND c.customer_status = '4' 
                   AND c.status_changed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) * 5 +
        COUNT(CASE WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) * 1
    ) as performance_score
    
FROM agency_users au
JOIN agencies a ON au.agency_id = a.id
LEFT JOIN tasks t ON (t.created_by = au.id OR t.assigned_to = au.username)
LEFT JOIN customers c ON c.status_changed_by = au.id
WHERE au.is_active = TRUE AND a.is_active = TRUE
GROUP BY au.id
ORDER BY performance_score DESC;

-- =====================================================
-- 6. FINANCIAL OVERVIEW VIEW
-- =====================================================

CREATE OR REPLACE VIEW v_financial_overview AS
SELECT 
    a.id as agency_id,
    a.agency_name,
    
    -- Pension Statistics (active customers only)
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' AND pc.id IS NOT NULL THEN c.id END) as customers_with_pension,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance END), 0) as total_pension_balance,
    COALESCE(AVG(CASE WHEN c.customer_status = '4' THEN pc.accumulated_balance END), 0) as avg_pension_balance,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.employee_amount END), 0) as total_employee_contributions,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.employer_amount END), 0) as total_employer_contributions,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.total_amount END), 0) as total_monthly_contributions,
    
    -- Insurance Statistics (active customers only)
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' AND ci.id IS NOT NULL THEN c.id END) as customers_with_insurance,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN ci.coverage_amount END), 0) as total_insurance_coverage,
    COALESCE(AVG(CASE WHEN c.customer_status = '4' THEN ci.coverage_amount END), 0) as avg_insurance_coverage,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN ci.monthly_premium END), 0) as total_monthly_premiums,
    
    -- Portfolio Distribution
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' THEN pf.id END) as pension_funds_count,
    COUNT(DISTINCT CASE WHEN c.customer_status = '4' THEN it.id END) as insurance_types_count,
    
    -- Revenue Potential (estimation)
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN pc.total_amount END), 0) * 0.01 as estimated_monthly_commission_pension,
    COALESCE(SUM(CASE WHEN c.customer_status = '4' THEN ci.monthly_premium END), 0) * 0.05 as estimated_monthly_commission_insurance
    
FROM agencies a
LEFT JOIN customers c ON a.id = c.agency_id AND c.is_active = TRUE
LEFT JOIN pension_contributions pc ON c.id = pc.customer_id
LEFT JOIN pension_funds pf ON pc.fund_id = pf.id
LEFT JOIN customer_insurance ci ON c.id = ci.customer_id AND ci.is_active = TRUE
LEFT JOIN insurance_types it ON ci.insurance_type_id = it.id
WHERE a.is_active = TRUE
GROUP BY a.id;

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Optimize dashboard queries
CREATE INDEX idx_customers_dashboard_new ON customers(agency_id, customer_status, is_active, created_at);
CREATE INDEX idx_tasks_dashboard_new ON tasks(agency_id, status, created_at, completion_date, due_date);
CREATE INDEX idx_status_changes_new ON customers(agency_id, status_changed_at, status_changed_by);
CREATE INDEX idx_pension_dashboard_new ON pension_contributions(customer_id, accumulated_balance, total_amount);
CREATE INDEX idx_insurance_dashboard_new ON customer_insurance(customer_id, is_active, coverage_amount, monthly_premium);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Test the dashboard views
SELECT 'Dashboard Stats Test' as test_name;
SELECT agency_name, active_customers, leads_count, total_pension_balance, pending_tasks 
FROM v_dashboard_stats 
LIMIT 3;

SELECT 'Performance Metrics Test' as test_name;
SELECT agency_name, leads, customers, overall_conversion_rate, task_completion_rate 
FROM v_performance_metrics 
LIMIT 3;

SELECT 'Recent Activity Test' as test_name;
SELECT activity_type, activity_description, subject_name, status_info, activity_date 
FROM v_recent_activity 
LIMIT 5;
