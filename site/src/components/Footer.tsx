import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Email,
  Phone,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  LocationOn,
  Schedule,
  Security,
  Support
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: 'המוצר',
      links: [
        { name: 'מחשבון פנסיה', url: 'http://localhost:5177' },
        { name: 'תכונות', url: '#features' },
        { name: 'דמו', url: '#demo' },
        { name: 'מחירים', url: '#pricing' }
      ]
    },
    {
      title: 'החברה',
      links: [
        { name: 'אודות', url: '#about' },
        { name: 'הצוות', url: '#team' },
        { name: 'קריירה', url: '#careers' },
        { name: 'חדשות', url: '#news' }
      ]
    },
    {
      title: 'תמיכה',
      links: [
        { name: 'מרכז עזרה', url: '#help' },
        { name: 'צור קשר', url: '#contact' },
        { name: 'FAQ', url: '#faq' },
        { name: 'הדרכות', url: '#tutorials' }
      ]
    },
    {
      title: 'משפטי',
      links: [
        { name: 'תנאי שימוש', url: '#terms' },
        { name: 'מדיניות פרטיות', url: '#privacy' },
        { name: 'עוגיות', url: '#cookies' },
        { name: 'GDPR', url: '#gdpr' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <LinkedIn />, url: '#', color: '#0077B5' },
    { icon: <Twitter />, url: '#', color: '#1DA1F2' },
    { icon: <Facebook />, url: '#', color: '#1877F2' },
    { icon: <Instagram />, url: '#', color: '#E4405F' }
  ];

  const contactInfo = [
    {
      icon: <Email />,
      title: 'אימייל',
      value: 'info@geneai.co.il',
      link: 'mailto:info@geneai.co.il'
    },
    {
      icon: <Phone />,
      title: 'טלפון',
      value: '+972-50-123-4567',
      link: 'tel:+972501234567'
    },
    {
      icon: <LocationOn />,
      title: 'כתובת',
      value: 'תל אביב, ישראל',
      link: '#'
    },
    {
      icon: <Schedule />,
      title: 'שעות פעילות',
      value: 'א׳-ה׳ 9:00-18:00',
      link: '#'
    }
  ];

  const features = [
    { icon: <Security />, text: 'אבטחה מתקדמת' },
    { icon: <Support />, text: 'תמיכה 24/7' },
    { icon: <Schedule />, text: 'זמינות גבוהה' }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(10, 10, 10, 1) 100%)',
      pt: 8,
      pb: 2
    }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '100%' }}>
        {/* Main Footer Content */}
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  direction: 'rtl'
                }}
              >
                GeneAI
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  direction: 'rtl',
                  mb: 4,
                  lineHeight: 1.6,
                  textAlign: 'right'
                }}
              >
                פלטפורמת AI מתקדמת לסוכני ביטוח שמייעלת תהליכים,
                מזרזת חישובים ומגדילה רווחים.
                המהפכה של הבינה המלאכותית בעולם הביטוח.
              </Typography>

              {/* Features */}
              <Box sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mr: 2
                      }}
                    >
                      {feature.text}
                    </Typography>
                    {React.cloneElement(feature.icon, { 
                      sx: { color: 'primary.main', fontSize: 20 } 
                    })}
                  </Box>
                ))}
              </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      component={Link}
                      href={social.url}
                      sx={{
                        color: social.color,
                        background: `${social.color}20`,
                        border: `1px solid ${social.color}40`,
                        '&:hover': {
                          background: `${social.color}30`,
                          borderColor: social.color,
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Links */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              {footerLinks.map((section, sectionIndex) => (
                <Grid item xs={6} sm={3} key={sectionIndex}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: 'text.primary',
                        fontWeight: 600,
                        textAlign: 'right'
                      }}
                    >
                      {section.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          sx={{
                            color: 'text.secondary',
                            textDecoration: 'none',
                            textAlign: 'right',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: 'primary.main',
                            }
                          }}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  color: 'text.primary',
                  fontWeight: 600,
                  textAlign: 'right'
                }}
              >
                צור קשר
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 0.5 
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          mr: 1,
                          fontWeight: 500
                        }}
                      >
                        {info.title}
                      </Typography>
                      {React.cloneElement(info.icon, { 
                        sx: { color: 'primary.main', fontSize: 16 } 
                      })}
                    </Box>
                    
                    <Link
                      href={info.link}
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {info.value}
                    </Link>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              © 2024 GeneAI. כל הזכויות שמורות.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                🚀 Made with ❤️ in Israel
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                background: 'rgba(0, 212, 170, 0.1)',
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                border: '1px solid rgba(0, 212, 170, 0.2)'
              }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  v1.0.0
                </Typography>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'primary.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 }
                  }
                }} />
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
