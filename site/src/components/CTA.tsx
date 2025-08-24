import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  RocketLaunch,
  Phone,
  Email,
  WhatsApp,
  Schedule,
  CheckCircle,
  Calculate
} from '@mui/icons-material';

const CTA: React.FC = () => {
  const benefits = [
    'מחשבון פנסיה חכם',
    'אופטימיזציה של דמי ניהול',
    'ניתוח נתונים מתקדם',
    'תמיכה צמודה',
    'עדכונים שוטפים',
    'ממשק ידידותי למשתמש'
  ];

  const contactMethods = [
    {
      icon: <WhatsApp />,
      title: 'WhatsApp',
      description: 'שליחת הודעה מהירה',
      action: 'שלח הודעה',
      color: '#25D366',
      link: 'https://wa.me/972501234567'
    },
    {
      icon: <Phone />,
      title: 'שיחת טלפון',
      description: 'יעוץ אישי מיידי',
      action: 'התקשר עכשיו',
      color: '#00D4AA',
      link: 'tel:+972501234567'
    },
    {
      icon: <Email />,
      title: 'אימייל',
      description: 'קבלת מידע מפורט',
      action: 'שלח מייל',
      color: '#6366F1',
      link: 'mailto:info@geneai.co.il'
    }
  ];

  return (
    <Box sx={{ 
      py: 12, 
      background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 1) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <Box sx={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '120%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(100, 100, 100, 0.1) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      }} />

      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '100%' }}>
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                direction: 'rtl'
              }}
            >
              מוכן לשנות את הדרך שבה אתה עובד?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.primary',
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                direction: 'rtl'
              }}
            >
              הצטרף לסוכני הביטוח המובילים שכבר משתמשים ב-GeneAI
              ורואים תוצאות מרשימות
            </Typography>

            {/* Benefits Grid */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              justifyContent: 'center',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Chip
                    icon={<CheckCircle />}
                    label={benefit}
                    sx={{
                      background: 'rgba(0, 212, 170, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(0, 212, 170, 0.3)',
                      fontWeight: 500,
                      '&:hover': {
                        background: 'rgba(0, 212, 170, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {/* Main CTA Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              mb: 8
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.open('http://localhost:5177', '_blank')}
                  sx={{
                    minWidth: '250px',
                    py: 2.5,
                    px: 4,
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                    boxShadow: '0 12px 40px rgba(0, 212, 170, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00A082 0%, #4F46E5 100%)',
                      boxShadow: '0 16px 50px rgba(0, 212, 170, 0.5)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<RocketLaunch />}
                >
                  התחל עכשיו - חינם!
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: '250px',
                    py: 2.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '16px',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.light',
                      background: 'rgba(0, 212, 170, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<Schedule />}
                >
                  קבע פגישת הדגמה
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    minWidth: '250px',
                    py: 2.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E55A2B 0%, #E8831A 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<Calculate />}
                  onClick={() => window.open('http://localhost:5177/salary', '_blank')}
                >
                  💰 מחשבון שכר
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'text.primary',
                mb: 2,
                direction: 'rtl'
              }}
            >
              או צור קשר איתנו ישירות
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem',
                direction: 'rtl'
              }}
            >
              הצוות שלנו זמין לעזור לך בכל שאלה
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {contactMethods.map((method, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${method.color}40`,
                  borderRadius: '20px',
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: { xs: '280px', sm: '320px' },
                  '&:hover': {
                    borderColor: method.color,
                    boxShadow: `0 12px 40px ${method.color}30`,
                    transform: 'translateY(-5px)',
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      background: `linear-gradient(135deg, ${method.color} 0%, ${method.color}CC 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: `0 8px 32px ${method.color}40`
                    }}>
                      {React.cloneElement(method.icon, { 
                        sx: { fontSize: 32, color: 'white' } 
                      })}
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      {method.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 3
                      }}
                    >
                      {method.description}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => window.open(method.link, '_blank')}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${method.color} 0%, ${method.color}CC 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${method.color}DD 0%, ${method.color}AA 100%)`,
                        }
                      }}
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1rem',
                fontStyle: 'italic'
              }}
            >
              "הטכנולוגיה הטובה ביותר היא זו שעוזרת לאנשים להיות טובים יותר במה שהם כבר עושים"
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'primary.main',
                mt: 1,
                fontWeight: 600
              }}
            >
              — צוות GeneAI
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTA;
