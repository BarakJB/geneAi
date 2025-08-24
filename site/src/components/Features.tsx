import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Calculate,
  Analytics,
  TrendingUp,
  Security,
  Speed,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Calculate />,
      title: 'מחשבון פנסיה חכם',
      description: 'מחשבון מתקדם לפנסיה וקרן השתלמות עם אופטימיזציה של דמי ניהול וחישובי רווח מדויקים',
      color: '#007AFF',
      gradient: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
      isPrimary: true
    },
    {
      icon: <Analytics />,
      title: 'ניתוח תלוש שכר AI',
      description: 'העלאת תלוש שכר וזיהוי אוטומטי של פערים, טעויות וזכויות חסרות באמצעות בינה מלאכותית',
      color: '#1a1a1a',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
      isPrimary: false
    },
    {
      icon: <TrendingUp />,
      title: 'אופטימיזציה אוטומטית',
      description: 'מערכת שמזהה הזדמנויות לשיפור תיקי הביטוח ומגדילה רווחים',
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      isPrimary: false
    },
    {
      icon: <Security />,
      title: 'אבטחה ופרטיות',
      description: 'הגנה מלאה על נתוני לקוחות עם תקני אבטחה בנקאיים',
      color: '#9ca3af',
      gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      isPrimary: false
    },
    {
      icon: <Speed />,
      title: 'עיבוד מהיר',
      description: 'תוצאות מיידיות ועיבוד מהיר של חישובים מורכבים',
      color: '#d1d5db',
      gradient: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
      isPrimary: false
    },
    {
      icon: <AutoAwesome />,
      title: 'ממשק חכם',
      description: 'ממשק משתמש מתקדם עם UX מותאם לסוכני ביטוח ופעולות מהירות',
      color: '#e5e7eb',
      gradient: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
      isPrimary: false
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #374151 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                direction: 'rtl',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              🚀 יכולות מתקדמות
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                direction: 'rtl'
              }}
            >
              טכנולוגיה חדשנית שמביאה את העתיד של ניהול הביטוח
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '24px',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: feature.isPrimary 
                        ? '0 25px 50px rgba(0, 122, 255, 0.25)'
                        : '0 25px 50px rgba(0, 0, 0, 0.15)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .feature-gradient': {
                        opacity: 0.8,
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.isPrimary ? feature.gradient : '#e5e7eb',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          background: feature.isPrimary ? feature.gradient : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: feature.isPrimary ? '0 8px 32px rgba(0, 122, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { 
                            fontSize: 32, 
                            color: feature.isPrimary ? 'white' : '#1a1a1a' 
                          }
                        })}
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.mode === 'dark' ? 'white' : '#1a1a1a',
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                        lineHeight: 1.6,
                        flex: 1,
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                    >
                      {feature.description}
                    </Typography>

                    <Box
                      className="feature-gradient"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: feature.isPrimary ? feature.gradient : 'transparent',
                        opacity: feature.isPrimary ? 0.6 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? 'white' : '#1a1a1a',
                direction: 'rtl'
              }}
            >
              מוכן להתחיל?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                mb: 4,
                direction: 'rtl'
              }}
            >
              גלה איך AI יכול לשפר את העסק שלך עוד היום
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features;