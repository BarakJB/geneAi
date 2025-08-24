import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Avatar,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Psychology,
  TrendingUp,
  Security,
  Speed,
  AutoAwesome,
  Lightbulb
} from '@mui/icons-material';

const About: React.FC = () => {
  const values = [
    {
      icon: <Psychology />,
      title: 'חדשנות בAI',
      description: 'פיתוח טכנולוגיות AI מתקדמות שמייעלות תהליכים עסקיים'
    },
    {
      icon: <Security />,
      title: 'אמינות ואבטחה',
      description: 'הגנה מלאה על נתוני לקוחות עם תקני אבטחה הגבוהים ביותר'
    },
    {
      icon: <TrendingUp />,
      title: 'צמיחה משותפת',
      description: 'הצלחת הלקוחות שלנו היא ההצלחה שלנו - גדלים יחד'
    },
    {
      icon: <Speed />,
      title: 'מהירות ויעילות',
      description: 'פתרונות מהירים ויעילים שחוסכים זמן יקר'
    }
  ];

  const story = [
    {
      year: '2024',
      title: 'התחלת המסע',
      description: 'זיהינו את הצורך בפתרונות AI לתחום הביטוח והחלטנו לפתור את הבעיה',
      icon: <Lightbulb />
    },
    {
      year: 'Q1 2024',
      title: 'פיתוח המחשבון החכם',
      description: 'הושק המחשבון הראשון שלנו לפנסיה וקרן השתלמות',
      icon: <AutoAwesome />
    },
    {
      year: 'עכשיו',
      title: 'הרחבת הפלטפורמה',
      description: 'פיתוח כלים נוספים ומערכות אופטימיזציה מתקדמות',
      icon: <TrendingUp />
    }
  ];

  return (
    <Box sx={{ 
      py: 12, 
      background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.8) 100%)',
      position: 'relative'
    }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '100%' }}>
        {/* Header */}
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
                fontSize: { xs: '2rem', md: '3rem' },
                direction: 'rtl'
              }}
            >
              הסיפור שלנו
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.25rem',
                direction: 'rtl'
              }}
            >
              GeneAI נוסדה מתוך חזון ברור: להביא את כוח הבינה המלאכותית לעולם הביטוח,
              ולאפשר לסוכני ביטוח להציע שירות טוב יותר ללקוחותיהם
            </Typography>
          </Box>
        </motion.div>

        {/* Mission */}
        <Grid container spacing={6} sx={{ mb: 8 }} justifyContent="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card sx={{
                background: 'rgba(0, 212, 170, 0.05)',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                borderRadius: '20px',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3, 
                      color: 'primary.main',
                      textAlign: 'center',
                      fontWeight: 600,
                      direction: 'rtl'
                    }}
                  >
                    המשימה שלנו
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      direction: 'rtl'
                    }}
                  >
                    אנחנו מאמינים שכל סוכן ביטוח מגיע לו כלים מתקדמים שיעזרו לו לספק שירות מעולה ללקוחותיו.
                    אנו פיתחנו פלטפורמה שמשלבת AI וטכנולוגיה מתקדמת כדי להפוך כל חישוב מורכב לפשוט,
                    כל תהליך ארוך למהיר, וכל החלטה עסקית לחכמה יותר.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card sx={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '20px',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3, 
                      color: 'secondary.main',
                      textAlign: 'center',
                      fontWeight: 600
                    }}
                  >
                    החזון שלנו
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      direction: 'rtl'
                    }}
                  >
                    להיות הפלטפורמה המובילה בישראל לסוכני ביטוח, שמשנה את האופן שבו הם עובדים
                    ומתקשרים עם לקוחותיהם. אנו רואים עתיד שבו כל סוכן ביטוח מצויד בכלי AI מתקדמים
                    שמאפשרים לו להתמקד במה שהוא הכי טוב בו - לדאוג ללקוחותיו.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h3" 
              sx={{ 
                mb: 3,
                color: 'text.primary'
              }}
            >
              הערכים שלנו
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card sx={{
                  height: '100%',
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 40px rgba(0, 212, 170, 0.2)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 32px rgba(0, 212, 170, 0.3)'
                    }}>
                      {React.cloneElement(value.icon, { 
                        sx: { fontSize: 28, color: 'white' } 
                      })}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      {value.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        textAlign: 'center'
                      }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h3" 
              sx={{ 
                mb: 3,
                color: 'text.primary'
              }}
            >
              המסע שלנו
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'stretch',
          justifyContent: 'center'
        }}>
          {story.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Card sx={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                borderRadius: '20px',
                textAlign: 'center',
                position: 'relative',
                minHeight: { xs: '250px', md: '280px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: { xs: '100%', md: '300px' },
                mx: 'auto'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${
                      index === 0 ? '#F59E0B, #D97706' : 
                      index === 1 ? '#00D4AA, #00A082' : 
                      '#6366F1, #4F46E5'
                    })`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    {React.cloneElement(item.icon, { 
                      sx: { fontSize: 28, color: 'white' } 
                    })}
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 1, 
                      color: 'primary.main',
                      fontWeight: 700
                    }}
                  >
                    {item.year}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      color: 'text.primary',
                      fontWeight: 600
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>

                {/* Connector Line */}
                {index < story.length - 1 && (
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    right: { xs: '50%', md: '-2px' },
                    bottom: { xs: '-2px', md: 'auto' },
                    left: { xs: '50%', md: 'auto' },
                    width: { xs: '2px', md: '20px' },
                    height: { xs: '20px', md: '2px' },
                    background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                    transform: { xs: 'translateX(-50%)', md: 'translateY(-50%)' },
                    zIndex: 10
                  }} />
                )}
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Call to Action after timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.primary',
                mb: 3
              }}
            >
              מוכן להצטרף למהפכה?
            </Typography>
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
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                  boxShadow: '0 8px 24px rgba(0, 212, 170, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00A082 0%, #4F46E5 100%)',
                    boxShadow: '0 12px 32px rgba(0, 212, 170, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🧮 התחל עם המחשבון החכם
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
