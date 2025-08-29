import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Box as Grid,
  Alert,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  Stack,

  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  Person as PersonIcon,
  AccountBalance as PensionIcon,
  Work as WorkIcon,
  TrendingUp as TrendingIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

import { PensionXMLParser, formatCurrency, formatDate, calculateAge } from '../../utils/xmlParser';
import { PensionClientData, XMLParsingResult } from '../../types/pension';

interface ImportStep {
  id: number;
  label: string;
  description: string;
  completed: boolean;
}

const PensionXMLImport: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addClient } = useClientStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [parsingResults, setParsingResults] = useState<XMLParsingResult[]>([]);
  const [parsedClients, setParsedClients] = useState<PensionClientData[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [savedClients, setSavedClients] = useState<number>(0);

  const steps: ImportStep[] = [
    {
      id: 0,
      label: 'העלאת קבצים',
      description: 'בחר קבצי XML לייבוא',
      completed: selectedFiles.length > 0
    },
    {
      id: 1,
      label: 'עיבוד נתונים',
      description: 'ניתוח וחילוץ המידע מהקבצים',
      completed: parsingResults.length > 0
    },
    {
      id: 2,
      label: 'בדיקת תוצאות',
      description: 'סקירה ואישור הנתונים שחולצו',
      completed: false
    },
    {
      id: 3,
      label: 'שמירה',
      description: 'שמירת הלקוחות במערכת',
      completed: false
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const xmlFiles = acceptedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.xml')
    );
    
    if (xmlFiles.length !== acceptedFiles.length) {
      // Some files were not XML - could show warning
    }
    
    setSelectedFiles(xmlFiles);
    if (xmlFiles.length > 0 && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [currentStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml']
    },
    multiple: true
  });

  const processFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    
    const results: XMLParsingResult[] = [];
    const clients: PensionClientData[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setProcessingProgress((i / selectedFiles.length) * 100);

      try {
        const text = await file.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          results.push({
            fileName: file.name,
            success: false,
            errors: ['קובץ XML לא תקין'],
            warnings: [],
            clientData: null
          });
          continue;
        }

        const clientData = PensionXMLParser.parseXML(xmlDoc, file.name);
        
        if (clientData) {
          clients.push(clientData);
          results.push({
            fileName: file.name,
            success: true,
            errors: [],
            warnings: [],
            clientData
          });
        } else {
          results.push({
            fileName: file.name,
            success: false,
            errors: ['שגיאה בעיבוד הקובץ'],
            warnings: [],
            clientData: null
          });
        }
      } catch (error) {
        results.push({
          fileName: file.name,
          success: false,
          errors: [`שגיאה: ${error}`],
          warnings: [],
          clientData: null
        });
      }
    }

    setProcessingProgress(100);
    setParsingResults(results);
    setParsedClients(clients);
    setIsProcessing(false);
    setCurrentStep(2);
  };

  const saveClients = async () => {
    // Save clients to global store
    setIsProcessing(true);
    setProcessingProgress(0);

    let savedCount = 0;
    for (let i = 0; i < parsedClients.length; i++) {
      setProcessingProgress(((i + 1) / parsedClients.length) * 100);
      
      try {
        // Add client to global store
        addClient(parsedClients[i]);
        savedCount++;
        
        // Simulate API call delay for UI feedback
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('שגיאה בשמירת לקוח:', error);
      }
    }

    setSavedClients(savedCount);
    setIsProcessing(false);
    setCurrentStep(3);
    setShowSuccessDialog(true);
  };

  const resetImport = () => {
    setCurrentStep(0);
    setSelectedFiles([]);
    setParsingResults([]);
    setParsedClients([]);
    setSavedClients(0);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const successfulResults = parsingResults.filter(r => r.success);
  const failedResults = parsingResults.filter(r => !r.success);

  return (
    <Box sx={{ 
      py: 1, 
      px: 1,
      maxWidth: '100%',
      width: '100%',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                ייבוא קבצי XML פנסיה
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.colors.textSecondary
                }}
              >
                העלה וייבא נתוני פנסיה מקבצי XML של בתי הסליקה הפנסיוניים
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetImport}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              התחל מחדש
            </Button>
          </Box>
        </Paper>

        {/* Progress Stepper */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.id} completed={step.completed}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'white',
                      fontWeight: 600,
                    },
                    '& .MuiStepLabel-label.Mui-completed': {
                      color: '#4CAF50',
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color: '#2196F3',
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(255,255,255,0.3)',
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#4CAF50',
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#2196F3',
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {isProcessing && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={processingProgress}
                sx={{
                  borderRadius: 2,
                  height: 8,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                  },
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  mt: 1
                }}
              >
                {Math.round(processingProgress)}% הושלם
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: File Upload */}
          {currentStep === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box
                  {...getRootProps()}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    border: `2px dashed ${isDragActive ? '#2196F3' : 'rgba(255,255,255,0.3)'}`,
                    borderRadius: 3,
                    bgcolor: isDragActive ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.05)',
                      borderColor: '#2196F3',
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: isDragActive ? '#2196F3' : 'rgba(255,255,255,0.5)',
                      mb: 2 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {isDragActive ? 'שחרר את הקבצים כאן' : 'גרור קבצי XML או לחץ לבחירה'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      mb: 3
                    }}
                  >
                    תומך בקבצי XML מבתי סליקה פנסיוניים בישראל
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Chip 
                      icon={<FileIcon />} 
                      label="XML בלבד" 
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }} 
                    />
                    <Chip 
                      icon={<InfoIcon />} 
                      label="עד 10 קבצים" 
                      sx={{ 
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        color: '#2196F3',
                        border: '1px solid rgba(33, 150, 243, 0.3)'
                      }} 
                    />
                  </Stack>
                </Box>

                {selectedFiles.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FileIcon />
                      קבצים שנבחרו ({selectedFiles.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {selectedFiles.map((file, index) => (
                        <Box key={index} sx={{ flex: '1 1 250px' }}>
                          <Card
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FileIcon sx={{ color: '#2196F3' }} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'white',
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                                  >
                                    {(file.size / 1024).toFixed(1)} KB
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={processFiles}
                        disabled={isProcessing}
                        sx={{
                          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1976D2 0%, #0288D1 100%)',
                          }
                        }}
                      >
                        התחל עיבוד
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}

          {/* Step 2: Processing Results */}
          {currentStep === 1 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <UploadIcon sx={{ fontSize: 64, color: '#2196F3' }} />
                  </motion.div>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    מעבד קבצים...
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    מחלץ נתוני פנסיה ויוצר כרטיסי לקוח
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentStep(0)}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    חזור לבחירת קבצים
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* Step 3: Review Results */}
          {currentStep === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Summary Cards */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {successfulResults.length}
                        </Typography>
                        <Typography variant="body2">
                          קבצים עובדו בהצלחה
                        </Typography>
                      </Card>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: failedResults.length > 0 
                            ? 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                          color: 'white',
                          border: failedResults.length === 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {failedResults.length}
                        </Typography>
                        <Typography variant="body2">
                          קבצים שנכשלו
                        </Typography>
                      </Card>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {parsedClients.length}
                        </Typography>
                        <Typography variant="body2">
                          לקוחות חדשים
                        </Typography>
                      </Card>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {formatCurrency(parsedClients.reduce((sum, client) => sum + client.summary.totalPensionBalance, 0))}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          סך יתרות פנסיה
                        </Typography>
                      </Card>
                    </Box>
                  </Box>
                </Box>

                {/* Client Preview */}
                {parsedClients.length > 0 && (
                  <Box sx={{ width: '100%' }}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'white',
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <PersonIcon />
                        לקוחות שיתווספו למערכת
                      </Typography>
                      
                      <Stack spacing={2}>
                        {parsedClients.map((client, index) => (
                          <Card
                            key={client.id}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                <Box sx={{ flex: '1 1 200px' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: 'primary.main',
                                        width: 48,
                                        height: 48,
                                      }}
                                    >
                                      {client.personalInfo.firstName.charAt(0)}{client.personalInfo.lastName.charAt(0)}
                                    </Avatar>
                                    <Box>
                                      <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                          color: 'white',
                                          fontWeight: 600
                                        }}
                                      >
                                        {client.personalInfo.firstName} {client.personalInfo.lastName}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: 'rgba(255,255,255,0.6)'
                                        }}
                                      >
                                        ת.ז: {client.personalInfo.id}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ flex: '1 1 200px' }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}
                                  >
                                    יתרת פנסיה
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: '#4CAF50',
                                      fontWeight: 600
                                    }}
                                  >
                                    {formatCurrency(client.summary.totalPensionBalance)}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 200px' }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}
                                  >
                                    הפקדה חודשית
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: '#2196F3',
                                      fontWeight: 600
                                    }}
                                  >
                                    {formatCurrency(client.summary.monthlyPensionContribution)}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 200px' }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}
                                  >
                                    קובץ מקור
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'rgba(255,255,255,0.8)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {client.xmlFileName}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Paper>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentStep(0)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.5)',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      חזור לבחירת קבצים
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<SaveIcon />}
                      onClick={saveClients}
                      disabled={parsedClients.length === 0 || isProcessing}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                        }
                      }}
                    >
                      שמור לקוחות במערכת
                    </Button>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {currentStep === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 6,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}
              >
                <CheckIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: '#4CAF50',
                    mb: 3
                  }} 
                />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  הייבוא הושלם בהצלחה!
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#4CAF50',
                    mb: 4
                  }}
                >
                  {savedClients} לקוחות נשמרו במערכת
                </Typography>
                
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={resetImport}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    ייבוא נוסף
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/crm/clients')}
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976D2 0%, #0288D1 100%)',
                      }
                    }}
                  >
                    צפה בלקוחות
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(10, 10, 16, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', color: 'white' }}>
            <CheckIcon sx={{ fontSize: 48, color: '#4CAF50', display: 'block', mx: 'auto', mb: 1 }} />
            הייבוא הושלם בהצלחה!
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
              {savedClients} לקוחות נשמרו במערכת
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              ניתן כעת לצפות ולנהל את הלקוחות החדשים במערכת הניהול
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              סגור
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/crm/clients')}
              sx={{
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              }}
            >
              צפה בלקוחות
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default PensionXMLImport;