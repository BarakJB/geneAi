import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AccountBalance as PensionIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,

} from '@mui/icons-material';
import { PensionClientData } from '../../types/pension';
import { useTheme } from '../../contexts/ThemeContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

const ClientPersonalArea: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { getClientById } = useClientStore();
  const { theme } = useTheme();
  const [client, setClient] = useState<PensionClientData | null>(null);
  const [clientTasks, setClientTasks] = useState<Task[]>([]);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    estimatedHours: 0
  });

  // Mock data - בפרויקט אמיתי זה יגיע מ-API
  const mockClients: PensionClientData[] = [
    {
      personalInfo: {
        id: '123456789',
        firstName: 'ישראל',
        lastName: 'ישראלי',
        birthDate: '1985-06-15',
        phoneNumber: '052-1234567',
        email: 'israel@example.com',
        address: 'תל אביב'
      },
      employmentHistory: [
        {
          id: 'emp-1',
          companyName: 'חברת היי-טק',
          position: 'מהנדס תוכנה',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          salary: 25000
        }
      ],
      pensionContributions: [
        {
          id: 'pension-1',
          fundName: 'מגדל מקפת',
          contributionDate: '2024-01-01',
          employeeAmount: 1750,
          employerAmount: 2062.5,
          totalAmount: 3812.5,
          accumulatedBalance: 150000
        }
      ],
      disabilityInsurance: {
        provider: 'הפניקס',
        coverageAmount: 15000,
        monthlyPremium: 250,
        isActive: true
      }
    },
    {
      personalInfo: {
        id: '987654321',
        firstName: 'שרה',
        lastName: 'כהן',
        birthDate: '1990-03-22',
        phoneNumber: '054-9876543',
        email: 'sarah@example.com',
        address: 'ירושלים'
      },
      employmentHistory: [
        {
          id: 'emp-2',
          companyName: 'בנק ישראל',
          position: 'יועצת כלכלית',
          startDate: '2018-06-01',
          endDate: '2023-12-31',
          salary: 18000
        }
      ],
      pensionContributions: [
        {
          id: 'pension-2',
          fundName: 'הראל פנסיה',
          contributionDate: '2023-12-01',
          employeeAmount: 1260,
          employerAmount: 1485,
          totalAmount: 2745,
          accumulatedBalance: 95000
        }
      ],
      disabilityInsurance: {
        provider: 'מגדל',
        coverageAmount: 12000,
        monthlyPremium: 180,
        isActive: true
      }
    }
  ];

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'בדיקת תיק פנסיה',
      description: 'סקירה מלאה של תיק הפנסיה ועדכון נתונים',
      status: 'in-progress',
      priority: 'high',
      clientId: '123456789',
      assignedTo: 'יוסי מנהל',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      dueDate: new Date('2024-01-25'),
      estimatedHours: 3,
      actualHours: 1.5,
      tags: ['פנסיה', 'בדיקה']
    },
    {
      id: '2',
      title: 'הכנת דוח שנתי',
      description: 'הכנת דוח מס שנתי ללקוח',
      status: 'todo',
      priority: 'medium',
      clientId: '123456789',
      assignedTo: 'דנה רואת חשבון',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      dueDate: new Date('2024-02-01'),
      estimatedHours: 5,
      tags: ['מס', 'דוח']
    },
    {
      id: '3',
      title: 'ייעוץ פנסיוני',
      description: 'פגישת ייעוץ לתכנון פנסיוני',
      status: 'done',
      priority: 'medium',
      clientId: '987654321',
      assignedTo: 'רחל יועצת',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18'),
      dueDate: new Date('2024-01-18'),
      estimatedHours: 2,
      actualHours: 2.5,
      tags: ['ייעוץ', 'פנסיה']
    }
  ];

  useEffect(() => {
    if (clientId) {
      const foundClient = getClientById(clientId);
      setClient(foundClient || null);
      
      const tasks = mockTasks.filter(task => task.clientId === clientId);
      setClientTasks(tasks);
    }
  }, [clientId, getClientById]);

  const handleAddTask = () => {
    if (newTask.title && clientId) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        priority: newTask.priority,
        clientId: clientId,
        assignedTo: 'מערכת',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        estimatedHours: newTask.estimatedHours,
        tags: []
      };
      
      setClientTasks(prev => [...prev, task]);
      setOpenTaskDialog(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: 0
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return theme.colors.warning;
      case 'in-progress': return theme.colors.info;
      case 'done': return theme.colors.success;
      default: return theme.colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'לביצוע';
      case 'in-progress': return 'בביצוע';
      case 'done': return 'הושלם';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return theme.colors.error;
      case 'high': return '#e67e22';
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textMuted;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'דחוף';
      case 'high': return 'גבוהה';
      case 'medium': return 'בינונית';
      case 'low': return 'נמוכה';
      default: return priority;
    }
  };

  if (!client) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          לקוח לא נמצא
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/crm/clients')}
          sx={{ mt: 2 }}
        >
          חזרה לרשימת לקוחות
        </Button>
      </Box>
    );
  }

  const totalBalance = client.pensionContributions.reduce((sum, contribution) => 
    sum + contribution.accumulatedBalance, 0
  );

  return (
    <Box sx={{ 
      py: 1, 
      px: 1, 
      maxWidth: '100%', 
      width: '100%', 
      overflow: 'hidden',
      bgcolor: theme.colors.primary,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton 
          onClick={() => navigate('/crm/clients')}
          sx={{ color: theme.colors.text }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: theme.colors.surface,
            color: theme.colors.text,
            fontSize: '1.5rem',
            border: '2px solid #555'
          }}
        >
          {client.personalInfo.firstName.charAt(0)}{client.personalInfo.lastName.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: theme.colors.text }}>
            {client.personalInfo.firstName} {client.personalInfo.lastName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: theme.colors.textSecondary }}>
            ת.ז: {client.personalInfo.id}
          </Typography>
        </Box>
      </Box>

      {/* Summary Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
        <Card sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h5" fontWeight="bold">₪{totalBalance.toLocaleString()}</Typography>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>סה"כ צבירה פנסיונית</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h5" fontWeight="bold">{client.pensionContributions.length}</Typography>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>קרנות פנסיה</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h5" fontWeight="bold">{client.employmentHistory.length}</Typography>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>מקומות עבודה</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h5" fontWeight="bold">₪{client.disabilityInsurance?.[0]?.coverageAmount?.toLocaleString() || 0}</Typography>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>כיסוי ביטוח</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h5" fontWeight="bold">
            {client.employmentHistory.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}₪
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>סה"כ משכורות</Typography>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Personal Info */}
        <Card sx={{ 
          flex: '1 1 300px', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.colors.text }}>
              <PhoneIcon sx={{ color: theme.colors.text }} />
              פרטים אישיים
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>שם מלא:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.firstName} {client.personalInfo.lastName}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>תעודת זהות:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.id}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>תאריך לידה:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.birthDate}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>טלפון:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.phoneNumber}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>אימייל:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.email}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
                <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>כתובת:</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>{client.personalInfo.address}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Pension Summary */}
        <Card sx={{ 
          flex: '1 1 300px', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.colors.text }}>
              <PensionIcon sx={{ color: theme.colors.text }} />
              קרנות פנסיה
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {client.pensionContributions.map((contribution) => (
                <Box key={contribution.id} sx={{ 
                  p: 2,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 2,
                  bgcolor: theme.colors.cardBackground
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.colors.text }} gutterBottom>
                    {contribution.fundName}
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>הפקדת עובד:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>₪{contribution.employeeAmount.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>הפקדת מעביד:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>₪{contribution.employerAmount.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>סה"כ הפקדה:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: theme.colors.text }}>₪{contribution.totalAmount.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>יתרה צבורה:</Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: theme.colors.text }}>
                        ₪{contribution.accumulatedBalance.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary, mt: 1, display: 'block' }}>
                    תאריך עדכון אחרון: {contribution.contributionDate}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Disability Insurance */}
        <Card sx={{ 
          flex: '1 1 300px', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.colors.text }}>
              <WorkIcon sx={{ color: theme.colors.text }} />
              ביטוח נכות
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 2,
              bgcolor: theme.colors.cardBackground
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.colors.text }}>
                  {client.disabilityInsurance?.[0]?.insuranceCompany || 'ללא ביטוח'}
                </Typography>
                <Chip 
                  label={client.disabilityInsurance?.[0]?.isActive ? 'פעיל' : 'לא פעיל'}
                  sx={{
                    bgcolor: client.disabilityInsurance?.[0]?.isActive ? '#333' : '#555',
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`
                  }}
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>סכום כיסוי חודשי:</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: theme.colors.text }}>
                    ₪{client.disabilityInsurance?.[0]?.coverageAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>דמי ביטוח חודשיים:</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: theme.colors.text }}>
                    ₪{client.disabilityInsurance?.[0]?.monthlyPremium?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card sx={{ 
          flex: '1 1 100%', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.colors.text }}>משימות</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setOpenTaskDialog(true)}
                sx={{
                  bgcolor: '#555',
                  color: theme.colors.text,
                  '&:hover': { bgcolor: '#666' },
                  border: '1px solid #777'
                }}
              >
                הוסף משימה
              </Button>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            {clientTasks.length === 0 ? (
              <Typography variant="body2" sx={{ color: theme.colors.textSecondary }} textAlign="center" py={4}>
                אין משימות ללקוח זה
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {clientTasks.map(task => (
                  <Card key={task.id} sx={{ 
                    p: 2, 
                    bgcolor: theme.colors.cardBackground, 
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.text
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.colors.text }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={getStatusText(task.status)}
                          size="small"
                          sx={{ 
                            bgcolor: '#555',
                            color: theme.colors.text,
                            fontWeight: 'bold',
                            border: `1px solid ${theme.colors.border}`
                          }}
                        />
                        <Chip
                          label={getPriorityText(task.priority)}
                          size="small"
                          sx={{ 
                            bgcolor: '#444',
                            color: theme.colors.text,
                            border: `1px solid ${theme.colors.border}`
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary, mb: 2 }}>
                      {task.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        נוצר: {task.createdAt.toLocaleDateString('he-IL')}
                      </Typography>
                      {task.dueDate && (
                        <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>
                          יעד: {task.dueDate.toLocaleDateString('he-IL')}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Employment History */}
        <Card sx={{ 
          flex: '1 1 100%', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.colors.text }}>
              <WorkIcon sx={{ color: theme.colors.text }} />
              היסטוריית תעסוקה
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            <TableContainer sx={{ border: `1px solid ${theme.colors.border}`, borderRadius: 1, bgcolor: theme.colors.cardBackground }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#444' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>חברה</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תפקיד</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תאריך התחלה</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תאריך סיום</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>משכורת חודשית</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תקופת עבודה</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.employmentHistory.map((job) => {
                    const startDate = new Date(job.startDate);
                    const endDate = job.endDate ? new Date(job.endDate) : new Date();
                    const monthsWorked = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                    
                    return (
                      <TableRow key={job.id} sx={{ '&:nth-of-type(even)': { bgcolor: theme.colors.surface } }}>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>{job.companyName}</TableCell>
                        <TableCell sx={{ color: theme.colors.textSecondary }}>{job.position}</TableCell>
                        <TableCell sx={{ color: theme.colors.textSecondary }}>{job.startDate}</TableCell>
                        <TableCell sx={{ color: job.endDate ? '#ccc' : 'white', fontWeight: job.endDate ? 'normal' : 'bold' }}>
                          {job.endDate || 'עובד כיום'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>
                          ₪{job.salary.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: theme.colors.textSecondary }}>
                          {monthsWorked} חודשים
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Detailed Pension Analysis */}
        <Card sx={{ 
          flex: '1 1 100%', 
          minWidth: 300, 
          bgcolor: theme.colors.surface, 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.colors.text }}>
              <TrendingUpIcon sx={{ color: theme.colors.text }} />
              פירוט הפקדות פנסיוניות
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            
            <TableContainer sx={{ border: `1px solid ${theme.colors.border}`, borderRadius: 1, bgcolor: theme.colors.cardBackground }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#444' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>קרן פנסיה</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תאריך עדכון</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>הפקדת עובד (6.5%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>הפקדת מעביד (7.5%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>סה"כ הפקדה חודשית</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>יתרה צבורה</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>תשואה משוערת</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.pensionContributions.map((contribution) => {
                    const expectedReturn = ((contribution.accumulatedBalance - (contribution.totalAmount * 12)) / (contribution.totalAmount * 12) * 100).toFixed(1);
                    
                    return (
                      <TableRow key={contribution.id} sx={{ '&:nth-of-type(even)': { bgcolor: theme.colors.surface } }}>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>
                          {contribution.fundName}
                        </TableCell>
                        <TableCell sx={{ color: theme.colors.textSecondary }}>{contribution.contributionDate}</TableCell>
                        <TableCell sx={{ color: theme.colors.text, fontWeight: 'bold' }}>
                          ₪{contribution.employeeAmount.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: theme.colors.text, fontWeight: 'bold' }}>
                          ₪{contribution.employerAmount.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text }}>
                          ₪{contribution.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.colors.text, fontSize: '1.1rem' }}>
                          ₪{contribution.accumulatedBalance.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          color: parseFloat(expectedReturn) > 0 ? 'white' : '#ccc'
                        }}>
                          {expectedReturn}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Summary Row */}
            <Box sx={{ mt: 2, p: 2, bgcolor: theme.colors.cardBackground, borderRadius: 1, border: `1px solid ${theme.colors.border}` }}>
              <Typography variant="h6" sx={{ color: theme.colors.text }} gutterBottom>
                סיכום כללי
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>סה"כ הפקדות חודשיות:</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: theme.colors.text }}>
                    ₪{client.pensionContributions.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>סה"כ יתרה צבורה:</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: theme.colors.text }}>
                    ₪{totalBalance.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.colors.textSecondary }}>פנסיה צפויה (גיל 67):</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: theme.colors.text }}>
                    ₪{Math.round(totalBalance * 0.045).toLocaleString()}/חודש
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Add Task Dialog */}
      <Dialog 
        open={openTaskDialog} 
        onClose={() => setOpenTaskDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.colors.surface,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`
          }
        }}
      >
        <DialogTitle sx={{ color: theme.colors.text, borderBottom: '1px solid #555' }}>
          הוסף משימה חדשה
        </DialogTitle>
        <DialogContent sx={{ color: theme.colors.text }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="כותרת משימה"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: theme.colors.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.colors.text }
              }}
            />
            
            <TextField
              label="תיאור"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: theme.colors.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.colors.text }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.colors.textSecondary, '&.Mui-focused': { color: theme.colors.text } }}>עדיפות</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                label="עדיפות"
                sx={{
                  bgcolor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: theme.colors.text }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: theme.colors.surface,
                      '& .MuiMenuItem-root': {
                        color: theme.colors.text,
                        '&:hover': { bgcolor: '#555' },
                        '&.Mui-selected': { bgcolor: '#555' }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="low">נמוכה</MenuItem>
                <MenuItem value="medium">בינונית</MenuItem>
                <MenuItem value="high">גבוהה</MenuItem>
                <MenuItem value="urgent">דחוף</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="תאריך יעד"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: theme.colors.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.colors.text }
              }}
            />
            
            <TextField
              label="שעות משוערות"
              type="number"
              value={newTask.estimatedHours}
              onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: theme.colors.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.colors.text }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #555', p: 2 }}>
          <Button 
            onClick={() => setOpenTaskDialog(false)}
            sx={{ color: theme.colors.textSecondary, '&:hover': { bgcolor: '#555' } }}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleAddTask} 
            variant="contained"
            sx={{
              bgcolor: '#555',
              color: theme.colors.text,
              '&:hover': { bgcolor: '#666' },
              border: '1px solid #777'
            }}
          >
            הוסף משימה
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientPersonalArea;
