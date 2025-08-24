import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Chip,
  useTheme
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  AutoAwesome, 
  TrendingUp, 
  Security, 
  Speed,
  Analytics,
  SmartToy
} from '@mui/icons-material';

const Hero: React.FC = () => {
  const theme = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  
  const [typedText, setTypedText] = useState('');
  const fullText = 'המהפכה של AI בעולם הביטוח מתחילה כאן';
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <AutoAwesome />, text: 'AI מתקדם' },
    { icon: <TrendingUp />, text: 'אופטימיזציה חכמה' },
    { icon: <Security />, text: 'אבטחה מלאה' },
    { icon: <Speed />, text: 'מהירות מקסימלית' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Box sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }} />
      </motion.div>

      <motion.div
        style={{ y: useTransform(scrollY, [0, 300], [0, 30]) }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />
      </motion.div>

      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '100%' }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Floating Features */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Chip
                      icon={feature.icon}
                      label={feature.text}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        border: `1px solid rgba(255, 255, 255, 0.2)`,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  textAlign: 'center',
                  direction: 'rtl'
                }}
              >
                GeneAI
              </Typography>

              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  mb: 4, 
                  color: 'text.primary',
                  textAlign: 'center',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  minHeight: '80px',
                  direction: 'rtl'
                }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ marginLeft: '4px' }}
                >
                  |
                </motion.span>
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  direction: 'rtl'
                }}
              >
                פלטפורמת AI מתקדמת לסוכני ביטוח שמייעלת את ניהול הלקוחות,
                מזרזת תהליכים ומגדילה רווחים. התחל עם המחשבון החכם שלנו לפנסיה וקרן השתלמות.
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      minWidth: '200px',
                      py: 2,
                      fontSize: '1.1rem'
                    }}
                    onClick={() => window.open('https://my.coverai.co.il/he/home', '_blank')}
                  >
                    🚀 התחל עכשיו
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
                      minWidth: '200px',
                      py: 2,
                      fontSize: '1.1rem',
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#000000',
                        background: 'rgba(26, 26, 26, 0.1)'
                      }
                    }}
                    onClick={() => window.open('http://localhost:5177/', '_blank')}
                  >
                    📈 מחשבון פנסיה
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
                      minWidth: '200px',
                      py: 2,
                      fontSize: '1.1rem',
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#1a1a1a',
                        background: 'rgba(26, 26, 26, 0.1)'
                      }
                    }}
                    onClick={() => window.open('http://localhost:5177/salary', '_blank')}
                  >
                    💰 מחשבון שכר
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
                      minWidth: '200px',
                      py: 2,
                      fontSize: '1.1rem',
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#6b7280',
                        background: 'rgba(26, 26, 26, 0.1)'
                      }
                    }}
                    onClick={() => window.open('http://localhost:5177/payslip', '_blank')}
                  >
                    📄 ניתוח תלוש
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
              {/* Mobile AI Animation */}
              <Box sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                mt: 4,
                mb: 2
              }}>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Box sx={{
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: `0 0 40px rgba(0, 212, 170, 0.3)`
                  }}>
                    <SmartToy sx={{ 
                      fontSize: '60px', 
                      color: 'primary.main',
                      filter: 'drop-shadow(0 0 15px rgba(0, 212, 170, 0.5))'
                    }} />
                  </Box>
                </motion.div>
              </Box>

              {/* Desktop AI Animation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mt: 4 }}>
                <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px'
              }}>
                {/* AI Brain Animation */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Box sx={{
                    width: '300px',
                    height: '300px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: `0 0 60px rgba(0, 212, 170, 0.3)`
                  }}>
                    <SmartToy sx={{ 
                      fontSize: '100px', 
                      color: 'primary.main',
                      filter: 'drop-shadow(0 0 20px rgba(0, 212, 170, 0.5))'
                    }} />
                    
                    {/* Orbiting Elements */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: 'absolute',
                          width: '20px',
                          height: '20px',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          borderRadius: '50%',
                          top: '50%',
                          left: '50%',
                          originX: 0.5,
                          originY: 0.5,
                        }}
                        animate={{
                          rotate: 360,
                          x: Math.cos((i * Math.PI * 2) / 8) * 180,
                          y: Math.sin((i * Math.PI * 2) / 8) * 180,
                        }}
                        transition={{
                          rotate: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                          x: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                          y: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                        }}
                      />
                    ))}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
              </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
