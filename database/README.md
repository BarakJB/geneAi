# AgentsCalculator Database

מסד נתונים MySQL בדוקר עבור מערכת ניהול לקוחות של יועצי פנסיה וביטוח.

## 🚀 התקנה והפעלה

### דרישות מקדימות
- Docker Desktop מותקן ופועל
- 3GB שטח פנוי לפחות

### הפעלת המסד
```bash
# הפעלת הדאטה בייס
./database/start-database.sh

# או באופן ידני
docker-compose up -d
```

### עצירת המסד
```bash
docker-compose down

# למחיקת הנתונים גם כן
docker-compose down -v
```

## 📊 מבנה הדאטה בייס

### טבלאות ראשיות

#### 1. 👥 `customers` - לקוחות
- **מטרה**: מידע אישי בסיסי של לקוחות
- **שדות עיקריים**:
  - `id` (UUID) - מזהה ייחודי
  - `customer_id` - תעודת זהות/מספר לקוח
  - `first_name`, `last_name` - שם מלא
  - `birth_date` - תאריך לידה
  - `phone_number`, `email` - פרטי יצירת קשר
  - `address` - כתובת מגורים
  - `gender`, `marital_status` - מידע דמוגרפי

#### 2. 💼 `employment_history` - היסטוריית תעסוקה
- **מטרה**: מעקב אחר מקומות עבודה ושכר
- **קשר**: One-to-Many עם `customers`
- **שדות עיקריים**:
  - `company_name`, `position` - פרטי התעסוקה
  - `start_date`, `end_date` - תקופת העבודה
  - `monthly_salary` - שכר חודשי
  - `employment_type` - סוג העסקה

#### 3. 🏦 `pension_funds` - קרנות פנסיה
- **מטרה**: רשימת קרנות פנסיה זמינות
- **שדות עיקריים**:
  - `fund_name` - שם הקרן
  - `fund_code` - קוד הקרן
  - `management_company` - חברת הניהול
  - `fund_type` - סוג הקרן

#### 4. 💰 `pension_contributions` - הפקדות פנסיוניות
- **מטרה**: מעקב אחר הפקדות ויתרות פנסיוניות
- **קשר**: Many-to-Many בין `customers` ו-`pension_funds`
- **שדות עיקריים**:
  - `employee_amount`, `employer_amount` - הפקדות
  - `accumulated_balance` - יתרה צבורה
  - `contribution_date` - תאריך ההפקדה

#### 5. 🛡️ `insurance_types` - סוגי ביטוח
- **מטרה**: הגדרת סוגי ביטוח זמינים
- **דוגמאות**: ביטוח חיים, נכות, בריאות, רכב, דירה

#### 6. 🏥 `customer_insurance` - ביטוחים של לקוחות
- **מטרה**: מעקב אחר פוליסות ביטוח
- **קשר**: Many-to-Many בין `customers` ו-`insurance_types`
- **שדות עיקריים**:
  - `provider_name` - חברת הביטוח
  - `coverage_amount` - סכום כיסוי
  - `monthly_premium` - דמי ביטוח
  - `policy_number` - מספר פוליסה

#### 7. 📋 `tasks` - משימות
- **מטרה**: ניהול משימות לקוחות
- **קשר**: One-to-Many עם `customers`
- **שדות עיקריים**:
  - `title`, `description` - פרטי המשימה
  - `status` - סטטוס (todo/in_progress/done/cancelled)
  - `priority` - עדיפות (low/medium/high/urgent)
  - `due_date` - תאריך יעד
  - `assigned_to` - מי מטפל

#### 8. 💬 `task_comments` - הערות על משימות
- **מטרה**: מעקב אחר התקדמות והערות
- **קשר**: One-to-Many עם `tasks`

### טבלאות עזר
- `task_categories` - קטגוריות משימות
- `audit_log` - לוג שינויים
- `task_comments` - הערות על משימות

## 🔗 פרטי התחברות

### MySQL Database
- **Host**: localhost
- **Port**: 3308
- **Database**: agents_calculator
- **Username**: barak
- **Password**: jronaldo1991

### PhpMyAdmin (ממשק ווב)
- **URL**: http://localhost:8081
- **Username**: barak
- **Password**: jronaldo1991

## 📈 Views מוכנים

### `v_customer_summary`
סיכום מידע לקוח כולל יתרות פנסיה, ביטוחים ומשימות:
```sql
SELECT * FROM v_customer_summary;
```

### `v_active_tasks`
משימות פעילות עם פרטי לקוח:
```sql
SELECT * FROM v_active_tasks;
```

### `v_pension_performance`
ביצועי קרנות פנסיה:
```sql
SELECT * FROM v_pension_performance;
```

## 🛠️ Stored Procedures

### הוספת לקוח חדש עם תעסוקה
```sql
CALL sp_add_customer_with_employment(
    '123456789',           -- customer_id
    'ישראל',               -- first_name
    'ישראלי',              -- last_name
    '1985-06-15',          -- birth_date
    '052-1234567',         -- phone
    'israel@example.com',  -- email
    'תל אביב',             -- address
    'חברת היי-טק',         -- company_name
    'מהנדס תוכנה',         -- position
    '2020-01-01',          -- start_date
    25000.00,              -- monthly_salary
    @new_customer_id       -- OUT parameter
);
```

### חישוב סיכום פנסיוני
```sql
CALL sp_customer_pension_summary(
    @customer_id,
    @total_balance,
    @monthly_contributions,
    @funds_count,
    @estimated_monthly_pension
);
```

### עדכון סטטוס משימה עם הערה
```sql
CALL sp_update_task_status(
    @task_id,
    'done',
    'המשימה הושלמה בהצלחה',
    'יוסי מנהל',
    3.5  -- actual hours
);
```

## 🔍 שאילתות שימושיות

### לקוחות עם יתרת פנסיה הגבוהה ביותר
```sql
SELECT 
    CONCAT(c.first_name, ' ', c.last_name) as full_name,
    c.customer_id,
    cs.total_pension_balance
FROM v_customer_summary cs
JOIN customers c ON cs.id = c.id
ORDER BY cs.total_pension_balance DESC
LIMIT 10;
```

### משימות שפג תוקפן
```sql
SELECT * FROM v_active_tasks 
WHERE due_date < CURDATE()
ORDER BY due_date ASC;
```

### דוח ביטוחים פעילים
```sql
SELECT 
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    it.type_name,
    ci.provider_name,
    ci.coverage_amount,
    ci.monthly_premium
FROM customer_insurance ci
JOIN customers c ON ci.customer_id = c.id
JOIN insurance_types it ON ci.insurance_type_id = it.id
WHERE ci.is_active = TRUE
ORDER BY ci.coverage_amount DESC;
```

## 🔒 אבטחה ו-Best Practices

### Features מוטמעים:
✅ **Foreign Key Constraints** - שמירה על שלמות הנתונים  
✅ **Indexes מותאמים** - ביצועים מהירים  
✅ **Data Validation** - בדיקות תקינות נתונים  
✅ **Audit Trail** - מעקב אחר שינויים  
✅ **UTF8MB4 Support** - תמיכה מלאה בעברית ואמוג'י  
✅ **Stored Procedures** - לוגיקה עסקית במסד  
✅ **Views** - שאילתות מותאמות  
✅ **Auto-generated UUIDs** - מזהים ייחודיים  

### אינדקסים מותאמים:
- חיפוש לקוחות (שם, ת"ז, טלפון)
- סינון משימות (סטטוס, עדיפות, תאריך)
- איחוד נתוני פנסיה ובטוחים
- דוחות ואנליטיקס

## 🧪 בדיקת הנתונים

הדאטה בייס מגיע עם נתוני דוגמה:
- 4 לקוחות דמה
- 8 קרנות פנסיה ישראליות
- 8 סוגי ביטוח
- 7 קטגוריות משימות
- משימות לדוגמה עם תגובות

## 🔧 פתרון בעיות

### הדאטה בייס לא עולה
```bash
# בדיקת לוגים
docker logs agents_calculator_mysql

# אתחול מחדש
docker-compose down
docker-compose up -d
```

### בעיות חיבור
```bash
# בדיקת סטטוס הקונטיינר
docker ps

# חיבור ישיר למסד
docker exec -it agents_calculator_mysql mysql -u barak -p
```

### מחיקת הכל והתחלה מחדש
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## 📞 תמיכה

לבעיות או שאלות, ניתן לפנות דרך:
- GitHub Issues
- בדיקת הלוגים: `docker logs agents_calculator_mysql`
- PhpMyAdmin: http://localhost:8080
