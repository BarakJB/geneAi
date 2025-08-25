// סקריפט לבדיקת פרסומות - הדבק ב-Console

console.log('🔍 בדיקת פרסומות AdSense:');
console.log('================================');

// 1. בדיקה שהסקריפט נטען
if (window.adsbygoogle) {
  console.log('✅ AdSense Script נטען בהצלחה');
  console.log('📊 מספר פרסומות במערך:', window.adsbygoogle.length);
} else {
  console.log('❌ AdSense Script לא נטען - בדוק את index.html');
}

// 2. בדיקת elements
const adElements = document.querySelectorAll('.adsbygoogle');
console.log('📍 מספר אלמנטי פרסומת בדף:', adElements.length);

if (adElements.length > 0) {
  console.log('🎯 פרטי הפרסומות:');
  adElements.forEach((ad, index) => {
    console.log(`  פרסומת ${index + 1}:`);
    console.log(`    Client: ${ad.getAttribute('data-ad-client')}`);
    console.log(`    Slot: ${ad.getAttribute('data-ad-slot')}`);
    console.log(`    Format: ${ad.getAttribute('data-ad-format')}`);
    console.log(`    Loaded: ${ad.getAttribute('data-adsbygoogle-status') || 'לא נטען עדיין'}`);
  });
} else {
  console.log('❌ לא נמצאו אלמנטי פרסומת');
}

// 3. בדיקת network requests
console.log('🌐 לבדיקת Network:');
console.log('   פתח Network tab ב-DevTools');
console.log('   רענן את הדף');
console.log('   חפש: pagead2.googlesyndication.com');

// 4. בדיקת שגיאות
window.addEventListener('error', (e) => {
  if (e.message.includes('adsbygoogle')) {
    console.error('❌ שגיאת AdSense:', e.message);
  }
});

console.log('================================');
console.log('ℹ️  אם אין פרסומות - בדוק:');
console.log('   1. Publisher ID ב-index.html');
console.log('   2. Ad Slot IDs בקומפוננטים');
console.log('   3. סטטוס אישור ב-AdSense Dashboard');
console.log('   4. AdBlocker כבוי');
console.log('================================');
