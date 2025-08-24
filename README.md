# GeneAI - פלטפורמת AI לסוכני ביטוח 🚀

![GeneAI Logo](https://img.shields.io/badge/GeneAI-v1.0.0-00D4AA?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 📋 תוכן עניינים

- [אודות הפרויקט](#אודות-הפרויקט)
- [תכונות עיקריות](#תכונות-עיקריות)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [התקנה](#התקנה)
- [הפעלה](#הפעלה)
- [טכנולוגיות](#טכנולוגיות)
- [פריסה](#פריסה)
- [תרומה לפרויקט](#תרומה-לפרויקט)
- [רישיון](#רישיון)

## 🎯 אודות הפרויקט

GeneAI היא פלטפורמת AI מתקדמת שנועדה לסוכני ביטוח המשלבת בינה מלאכותית וטכנולוגיות חדשניות לאופטימיזציה של ניהול לקוחות. הפלטפורמה מספקת כלים חכמים שמייעלים תהליכים, מזרזים חישובים ומגדילים רווחים.

### 🎨 דמיון חכם לדומיינים

הפרויקט בנוי כמונו-רפו עם הפרדה חכמה בין:

- **אתר תדמיתי** (`geneai.co.il`) - אתר סטטי מהיר עם מטמון אגרסיבי
- **אפליקציה** (`app.geneai.co.il`) - האפליקציה הראשית עם כל הכלים
- **API** (`api.geneai.co.il`) - שרת ה-API המבוסס Node.js

## ✨ תכונות עיקריות

### 🧮 מחשבון פנסיה חכם
- חישוב מדויק של פנסיה וקרן השתלמות
- אופטימיזציה של דמי ניהול
- השוואת תוכניות פנסיוניות
- חישוב חיסכון צפוי

### 🤖 בינה מלאכותית
- ניתוח נתונים מתקדם
- המלצות מותאמות אישית
- אופטימיזציה אוטומטית של תיקי ביטוח
- למידת מכונה לשיפור ביצועים

### 🔐 אבטחה ואמינות
- הגנה מלאה על נתוני לקוחות
- תקני אבטחה בנקאיים
- גיבוי אוטומטי של נתונים
- זמינות גבוהה (99.9%)

### ⚡ ביצועים מעולים
- תוצאות מיידיות
- עיבוד מהיר של חישובים מורכבים
- ממשק משתמש רספונסיבי
- זמן תגובה מתחת ל-2 שניות

## 📁 מבנה הפרויקט

\`\`\`
agentsCalculator/
├── client/                 # אפליקציה ראשית (app.geneai.co.il)
│   ├── src/
│   │   ├── components/
│   │   │   └── PensionCalculator.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/                 # API שרת (api.geneai.co.il)
│   ├── index.js
│   └── package.json
├── site/                   # אתר תדמיתי (geneai.co.il)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── PensionDemo.tsx
│   │   │   ├── About.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json            # Root package.json
└── README.md
\`\`\`

## 🚀 התקנה

### דרישות מערכת
- Node.js 18+ 
- npm 8+
- Git

### שלבי ההתקנה

1. **שכפול הפרויקט**
\`\`\`bash
git clone https://github.com/yourusername/agentsCalculator.git
cd agentsCalculator
\`\`\`

2. **התקנת כל החבילות**
\`\`\`bash
npm run install-all
\`\`\`

## 🏃‍♂️ הפעלה

### הפעלת הפרויקט המלא (כל הרכיבים)
\`\`\`bash
npm run dev:all
\`\`\`

### הפעלה נפרדת של רכיבים

**שרת API + אפליקציה**
\`\`\`bash
npm run dev
\`\`\`

**רק האתר התדמיתי**
\`\`\`bash
npm run site
\`\`\`

**רק השרת**
\`\`\`bash
npm run server
\`\`\`

**רק האפליקציה**
\`\`\`bash
npm run client
\`\`\`

### כתובות לפיתוח
- 🌐 **אתר תדמיתי**: http://localhost:5173
- 💼 **אפליקציה**: http://localhost:5174
- 🔧 **API**: http://localhost:8000

## 🛠️ טכנולוגיות

### Frontend
- **React 18** - ספריית UI מודרנית
- **TypeScript** - פיתוח מסוג בטוח
- **Vite** - כלי build מהיר
- **Material-UI (MUI)** - רכיבי UI מתקדמים
- **Framer Motion** - אנימציות חלקות
- **Recharts** - גרפים אינטראקטיביים

### Backend
- **Node.js** - סביבת runtime לשרת
- **Express.js** - framework לשרת
- **CORS** - אבטחת cross-origin
- **Helmet** - אבטחת headers
- **Morgan** - logging של בקשות

### DevOps & Tools
- **Concurrently** - הפעלה מקבילה של תהליכים
- **Nodemon** - hot reload לשרת
- **ESLint** - בדיקת קוד
- **Prettier** - עיצוב קוד

## 🌐 פריסה

### AWS Amplify (מומלץ)

**אתר תדמיתי (geneai.co.il)**
\`\`\`bash
# Build
cd site && npm run build

# Deploy to Amplify App #1
# Domain: geneai.co.il + www.geneai.co.il
\`\`\`

**אפליקציה (app.geneai.co.il)**
\`\`\`bash
# Build
cd client && npm run build

# Deploy to Amplify App #2
# Domain: app.geneai.co.il
\`\`\`

**API שרת**
- AWS Elastic Beanstalk
- AWS App Runner
- או כל שירות hosting אחר

### כלי Build
\`\`\`bash
# Build האפליקציה
npm run build

# Build האתר התדמיתי
npm run build:site

# Build הכל
npm run build:all
\`\`\`

## 🎨 תכונות UI/UX

### עיצוב מתקדם
- **Dark Theme** - עיצוב מודרני ואלגנטי
- **RTL Support** - תמיכה מלאה בעברית
- **Responsive Design** - מותאם לכל המכשירים
- **Smooth Animations** - אנימציות חלקות ומקצועיות

### אנימציות מתקדמות
- **Hero Section** - אנימציות AI מרשימות
- **Scroll Animations** - אפקטים בגלילה
- **Hover Effects** - אינטראקציות חכמות
- **Loading States** - מצבי טעינה מעוצבים

## 🧪 בדיקות ופיתוח

### הפעלת בדיקות
\`\`\`bash
# Test האפליקציה
cd client && npm test

# Test השרת
cd server && npm test

# Test האתר התדמיתי
cd site && npm test
\`\`\`

### Linting
\`\`\`bash
# בדיקת קוד באפליקציה
cd client && npm run lint

# תיקון אוטומטי
cd client && npm run lint:fix
\`\`\`

## 📈 מדדי ביצועים

- ⚡ **זמן טעינה**: < 2 שניות
- 🎯 **זמן תגובה API**: < 500ms
- 📱 **מובייל ביצועים**: 95+ (Lighthouse)
- 🖥️ **דסקטופ ביצועים**: 98+ (Lighthouse)
- ♿ **נגישות**: 100 (WCAG 2.1 AA)

## 🤝 תרומה לפרויקט

אנו מזמינים אותך לתרום לפרויקט! 

### איך לתרום?

1. **Fork** את הפרויקט
2. צור **branch** חדש (\`git checkout -b feature/amazing-feature\`)
3. **Commit** את השינויים (\`git commit -m 'Add amazing feature'\`)
4. **Push** לbranch (\`git push origin feature/amazing-feature\`)
5. פתח **Pull Request**

### הנחיות תרומה
- עקוב אחר סגנון הקוד הקיים
- כתוב בדיקות לקוד חדש
- עדכן את התיעוד
- וודא שכל הבדיקות עוברות

## 📞 צור קשר

- 📧 **אימייל**: info@geneai.co.il
- 📱 **טלפון**: +972-50-123-4567
- 💬 **WhatsApp**: [שלח הודעה](https://wa.me/972501234567)
- 🌐 **אתר**: [geneai.co.il](https://geneai.co.il)

## 📄 רישיון

הפרויקט הזה מופץ תחת רישיון MIT. ראה את הקובץ [LICENSE](LICENSE) לפרטים נוספים.

## 🙏 תודות

תודה מיוחדת לכל הקהילה הטכנולוגית הישראלית ולסוכני הביטוח שעוזרים לנו לשפר את המוצר.

---

<div align="center">
  <strong>🚀 Made with ❤️ in Israel 🇮🇱</strong><br>
  <sub>© 2024 GeneAI. כל הזכויות שמורות.</sub>
</div>