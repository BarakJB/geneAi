import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Calculate,
  TrendingUp,
  Savings,
  AttachMoney,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';

const PensionDemo: React.FC = () => {
  const [demoValues, setDemoValues] = useState({
    currentAge: 35,
    grossSalary: 20000,
    currentBalance: 150000,
    retirementAge: 67
  });

  const [showResults, setShowResults] = useState(false);

  // חישובים פשוטים לדמו
  const yearsToRetirement = demoValues.retirementAge - demoValues.currentAge;
  const monthlyDeposit = Math.round(demoValues.grossSalary * 0.205); // 20.5% סך הפרשות
  const futureValue = Math.round(demoValues.currentBalance * Math.pow(1.04, yearsToRetirement) + 
    monthlyDeposit * 12 * yearsToRetirement * 1.5);
  const currentFeeCost = Math.round(futureValue * 0.015);
  const newFeeCost = Math.round(futureValue * 0.008);
  const savings = currentFeeCost - newFeeCost;

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <Box sx={{ 
      py: 12, 
      background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
      position: 'relative'
    }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '100%' }}>
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
              נסה את המחשבון החכם
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.25rem',
                direction: 'rtl'
              }}
            >
              חשב כמה כסף תוכל לחסוך עם אופטימיזציה של דמי הניהול בפנסיה
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={6} alignItems="stretch" justifyContent="center">
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 212, 170, 0.1)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 } }}>
                    <Calculate sx={{ fontSize: 32, color: 'primary.main', mr: { xs: 0, sm: 2 } }} />
                    <Typography variant="h4" sx={{ color: 'text.primary', textAlign: 'center', direction: 'rtl' }}>
                      נתונים אישיים
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="גיל נוכחי"
                        type="number"
                        value={demoValues.currentAge}
                        onChange={(e) => setDemoValues({...demoValues, currentAge: Number(e.target.value)})}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(0, 212, 170, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 212, 170, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputLabel-root': { color: 'text.secondary' },
                          '& .MuiInputBase-input': { textAlign: 'right', color: 'text.primary' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="גיל פרישה"
                        type="number"
                        value={demoValues.retirementAge}
                        onChange={(e) => setDemoValues({...demoValues, retirementAge: Number(e.target.value)})}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(0, 212, 170, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 212, 170, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputLabel-root': { color: 'text.secondary' },
                          '& .MuiInputBase-input': { textAlign: 'right', color: 'text.primary' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="שכר ברוטו חודשי"
                        type="number"
                        value={demoValues.grossSalary}
                        onChange={(e) => setDemoValues({...demoValues, grossSalary: Number(e.target.value)})}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(0, 212, 170, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 212, 170, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputLabel-root': { color: 'text.secondary' },
                          '& .MuiInputBase-input': { textAlign: 'right', color: 'text.primary' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="צבירה נוכחית בפנסיה"
                        type="number"
                        value={demoValues.currentBalance}
                        onChange={(e) => setDemoValues({...demoValues, currentBalance: Number(e.target.value)})}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(0, 212, 170, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 212, 170, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputLabel-root': { color: 'text.secondary' },
                          '& .MuiInputBase-input': { textAlign: 'right', color: 'text.primary' }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4 }}>
                    <Chip 
                      label={`הפקדה חודשית: ₪${monthlyDeposit.toLocaleString()}`}
                      sx={{ 
                        background: 'rgba(0, 212, 170, 0.1)',
                        color: 'primary.main',
                        border: '1px solid rgba(0, 212, 170, 0.3)',
                        fontSize: '1rem',
                        py: 2,
                        width: '100%',
                        height: 'auto'
                      }}
                    />
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleCalculate}
                      sx={{
                        mt: 4,
                        py: 2,
                        fontSize: '1.2rem',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
                        boxShadow: '0 8px 32px rgba(0, 212, 170, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00A082 0%, #4F46E5 100%)',
                          boxShadow: '0 12px 40px rgba(0, 212, 170, 0.4)',
                        }
                      }}
                      startIcon={<PlayArrow />}
                    >
                      חשב חיסכון
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {showResults ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card sx={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0, 212, 170, 0.2)'
                      }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <CheckCircle sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                          <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                            ₪{savings.toLocaleString()}
                          </Typography>
                          <Typography variant="h5" sx={{ color: 'text.primary', mb: 2 }}>
                            החיסכון הצפוי שלך!
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            זה החיסכון שתקבל עד הפרישה עם אופטימיזציה של דמי הניהול
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '16px'
                      }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <TrendingUp sx={{ fontSize: 32, color: '#EF4444', mb: 1 }} />
                          <Typography variant="h6" sx={{ color: '#EF4444', mb: 1 }}>
                            ₪{currentFeeCost.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            דמי ניהול נוכחיים
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '16px'
                      }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Savings sx={{ fontSize: 32, color: '#10B981', mb: 1 }} />
                          <Typography variant="h6" sx={{ color: '#10B981', mb: 1 }}>
                            ₪{newFeeCost.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            דמי ניהול מומלצים
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => window.open('http://localhost:5177', '_blank')}
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            borderColor: 'primary.light',
                            background: 'rgba(0, 212, 170, 0.1)'
                          }
                        }}
                      >
                        📈 מחשבון פנסיה
                      </Button>
                      
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => window.open('http://localhost:5177/salary', '_blank')}
                        sx={{
                          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #E55A2B 0%, #E8831A 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                          }
                        }}
                      >
                        💰 מחשבון שכר
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box sx={{
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(0, 212, 170, 0.3)',
                  borderRadius: '20px',
                  background: 'rgba(0, 212, 170, 0.05)'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Calculate sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      הזן את הנתונים ולחץ על "חשב חיסכון"
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      כדי לראות את התוצאות המרשימות
                    </Typography>
                  </Box>
                </Box>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PensionDemo;
