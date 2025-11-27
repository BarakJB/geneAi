import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import barakImage from '../assets/barak_image.png';
import coverBusi from '../assets/cover_busi.png';

type MarketingConfig = {
  siteName: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  showTestimonials: boolean;
  showServices: boolean;
};

const getSavedConfig = (): MarketingConfig | null => {
  try {
    const raw = localStorage.getItem('websiteConfig');
    if (!raw) return null;
    return JSON.parse(raw) as MarketingConfig;
  } catch {
    return null;
  }
};

const Section: React.FC<{ id?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ id, style, children }) => (
  <section id={id} style={{ width: '100%', maxWidth: 1200, padding: '32px 24px', margin: '0 auto', ...style }}>
    {children}
  </section>
);

const MarketingSite: React.FC = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = React.useState(0);
  const [config, setConfig] = React.useState<MarketingConfig | null>(() => getSavedConfig());

  React.useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to websiteConfig changes (from builder) and update live preview
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'websiteConfig') {
        try {
          const next = e.newValue ? (JSON.parse(e.newValue) as MarketingConfig) : null;
          setConfig(next);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const primary = config?.primaryColor || '#0F62FE';
  const secondary = config?.secondaryColor || '#A6C8FF';
  const text = config?.textColor || '#0B0B0B';
  const bg = config?.backgroundColor || '#ffffff';

  const isMono = (config?.paletteId === 'mono');
  const heroFallback = 'https://picsum.photos/1600/900?grayscale&random=101';
  const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/80?grayscale`;
  const showcase = [
    'https://picsum.photos/seed/show1/800/600?grayscale',
    'https://picsum.photos/seed/show2/800/600?grayscale',
    'https://picsum.photos/seed/show3/800/600?grayscale',
    'https://picsum.photos/seed/show4/800/600?grayscale',
    'https://picsum.photos/seed/show5/800/600?grayscale',
    'https://picsum.photos/seed/show6/800/600?grayscale',
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, direction: 'rtl', overflowX: 'hidden' }}>
      {/* Sticky Header simplified (monochrome) */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: isMono ? '#ffffff' : bg, borderBottom: isMono ? '1px solid #e5e7eb' : 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={config?.logo || coverBusi} alt="logo" style={{ height: 28 }} />
            <span style={{ fontWeight: 800 }}>{config?.siteName || 'המותג שלך'}</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#services" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600 }}>שירותים</a>
            <a href="#about" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600 }}>אודות</a>
            <a href="#contact" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600 }}>צור קשר</a>
          </div>
        </div>
      </div>
      {/* HERO with Parallax */}
      <div
        style={{
          position: 'relative',
          minHeight: '86vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background:
            config?.heroImage
              ? `linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${config.heroImage}) center/cover no-repeat`
              : (isMono ? '#ffffff' : `radial-gradient(circle at 20% 20%, ${secondary}33 0 25%, transparent 25%), linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`),
        }}
      >
        {/* Floating shapes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: `${10 + i * 7}%`,
              left: `${(i * 13) % 100}%`,
              width: 14 + (i % 3) * 8,
              height: 14 + (i % 3) * 8,
              borderRadius: i % 2 === 0 ? '50%' : '12px',
              background: `rgba(255,255,255,${0.15 + (i % 5) * 0.08})`,
              backdropFilter: 'blur(6px)',
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}

        <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>
          {config?.logo && (
            <motion.img
              src={config.logo}
              alt="logo"
              style={{ height: 56, width: 'auto', marginBottom: 16, borderRadius: 12 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <motion.h1
            style={{
              color: config?.heroImage ? '#fff' : (isMono ? '#111827' : text),
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: 0,
              transform: `translateY(${Math.sin(scrollY * 0.005) * 4}px)`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {config?.heroTitle || 'אתר תדמית מודרני ללקוחותיך'}
          </motion.h1>
          <motion.p
            style={{
              color: config?.heroImage ? 'rgba(255,255,255,0.9)' : text,
              fontSize: 'clamp(1rem, 2.8vw, 1.5rem)',
              maxWidth: 800,
              margin: '16px auto 24px',
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {config?.heroSubtitle || 'עיצוב רספונסיבי, אנימציות חלקות ותוכן מותאם – כמו Wix, אצלך במערכת'}
          </motion.p>
          <motion.a
            href="#contact"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              borderRadius: 999,
              background: config?.heroImage ? 'rgba(0,0,0,0.35)' : (isMono ? '#111827' : '#111827'),
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: config?.heroImage ? '1px solid rgba(255,255,255,0.35)' : 'none',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            דברו איתנו
          </motion.a>

          {/* Inline hero image fallback to visualize design if none provided */}
          {!config?.heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginTop: 24 }}
            >
              <img
                src={heroFallback}
                alt="Hero placeholder"
                style={{
                  maxWidth: '920px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: 16,
                  border: isMono ? '1px solid #e5e7eb' : 'none',
                  boxShadow: isMono ? '0 12px 30px rgba(0,0,0,0.08)' : `0 8px 32px rgba(0,0,0,0.15)`,
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Services */}
      {(config?.showServices ?? true) && (
        <Section id="services">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', margin: 0, marginBottom: 24, fontSize: '2.25rem', fontWeight: 800, color: isMono ? '#111827' : undefined }}>
            השירותים שלנו
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            {[
              { title: 'ביטוח בריאות', desc: 'כיסויים רחבים ונגישים לפי הצורך' },
              { title: 'פנסיה', desc: 'מסלולים מותאמים לצרכים וליעדים' },
              { title: 'ביטוח חיים', desc: 'הגנה כלכלית למשפחה' },
              { title: 'ייעוץ פיננסי', desc: 'תכנון תזרים ונכסים חכם' },
            ].map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: false }}
                style={{
                  gridColumn: 'span 12',
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid #e5e7eb`,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <img src={`https://picsum.photos/seed/svc${i+1}/600/360?grayscale`} alt={s.title} style={{ width: '100%', height: 'auto', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                </div>
                <h3 style={{ margin: 0, marginBottom: 6, color: '#111827', fontWeight: 700 }}>{s.title}</h3>
                <p style={{ margin: 0, color: '#4b5563' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Showcase grid - six images to demonstrate look & feel */}
      <Section>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', margin: 0, marginBottom: 16, fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
          תצוגה
        </motion.h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 16,
        }}>
          {showcase.map((src, idx) => (
            <motion.div key={src} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: idx * 0.05 }}
              style={{ gridColumn: 'span 12', position: 'relative' }}>
              <img src={src} alt={`showcase-${idx+1}`} style={{ width: '100%', borderRadius: 16, border: '1px solid #e5e7eb' }} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', margin: 0, marginBottom: 16, fontSize: '2.25rem', fontWeight: 800 }}>
          אודותינו
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto', lineHeight: 1.8, color: '#374151' }}>
          {config?.aboutText || 'אנו מספקים חוויית אתר תדמית מודרנית עם מהירות, עיצוב נקי ואנימציות אלגנטיות. אפשרות התאמה מלאה לתוכן, תמונות ומיתוג מותאם לכל לקוח.'}
        </motion.p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <img
            src={barakImage}
            alt="ברק יעקב"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #e5e7eb'
            }}
          />
        </div>
      </Section>

      {/* Testimonials (simple carousel-like fade) */}
      {(config?.showTestimonials ?? true) && (
        <Section>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', margin: 0, marginBottom: 16, fontSize: '2.25rem', fontWeight: 800 }}>
            המלצות לקוחות
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            {[
              { name: 'דנה', text: 'שירות מקצועי ומהיר, אתר מרשים ונוח לעדכון.', seed: 'face1' },
              { name: 'יוסי', text: 'קל לייצר דף נחיתה לכל קמפיין, חוסך זמן וכסף.', seed: 'face2' },
              { name: 'תמר', text: 'התאמה מלאה למיתוג, נראה מצוין בנייד ובדסקטופ.', seed: 'face3' },
            ].map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ gridColumn: 'span 12', background: '#ffffff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <img src={avatar(t.seed)} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e5e7eb' }} />
                  <span style={{ color: '#111827', fontWeight: 700 }}>{t.name}</span>
                </div>
                <p style={{ margin: 0, color: '#4b5563' }}>{`“${t.text}”`}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Contact */}
      <Section id="contact">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', margin: 0, marginBottom: 16, fontSize: '2.25rem', fontWeight: 800 }}>
          יצירת קשר
        </motion.h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${config?.contactEmail || 'info@example.com'}`} style={{ color: '#111827', fontWeight: 700, textDecoration: 'underline' }}>📧 {config?.contactEmail || 'info@example.com'}</a>
          <a href={`tel:${config?.contactPhone || '050-0000000'}`} style={{ color: '#111827', fontWeight: 700, textDecoration: 'underline' }}>📱 {config?.contactPhone || '050-0000000'}</a>
        </div>
      </Section>
    </div>
  );
};

export default MarketingSite;


