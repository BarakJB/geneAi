# EmailJS Setup Guide

## 🚀 הגדרת EmailJS לטופס יצירת קשר

### שלב 1: יצירת חשבון EmailJS
1. לך לאתר: https://www.emailjs.com/
2. לחץ "Sign Up Free" 
3. צור חשבון חדש

### שלב 2: יצירת Email Service
1. במסך הראשי לחץ "Add New Service"
2. בחר "Gmail" (או ספק המייל שלך)
3. חבר את החשבון Gmail שלך (yacov131@gmail.com)
4. שמור את **Service ID** - תצטרך אותו!

### שלב 3: יצירת Email Template
1. לחץ "Email Templates" בתפריט
2. לחץ "Create New Template"  
3. העתק את התבנית הזו:

**Subject:** פניה חדשה למוצר המלא - CRM מתקדם

**Content:**
```html
שלום!

קיבלת פניה חדשה:

שם פרטי: {{firstName}}
שם משפחה: {{lastName}} 
אימייל: {{email}}
טלפון: {{phone}}
תיאור הצרכים: {{description}}
תאריך פניה: {{date}}

בברכה,
המערכת
```

4. שמור את **Template ID**

### שלב 4: קבלת User ID  
1. לך ל"Account" -> "General"
2. העתק את **User ID** (Public Key)

### שלב 5: עדכון הקוד
עדכן את הקובץ `src/config/email.ts`:

```typescript
export const EMAIL_CONFIG_DEV = {
  SERVICE_ID: 'service_xxxxxxx', // השם שקיבלת משלב 2
  TEMPLATE_ID: 'template_xxxxxxx', // השם שקיבלת משלב 3
  USER_ID: 'xxxxxxxxxxxxxxx', // השם שקיבלת משלב 4
  TO_EMAIL: 'yacov131@gmail.com'
};
```

### שלב 6: דיפלוי  
```bash
git add .
git commit -m "Fixed contact form with EmailJS"
git push
```

## 🎯 זה הכל! 
הטופס יעבוד ללא צורך בשרת backend נפרד.
