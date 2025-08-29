import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Badge,
  InputAdornment,
  Pagination,
  Divider,
  Stack,

  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonDetailIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { PensionClientData, SearchFilters } from '../../types/pension';
import { formatCurrency, formatDate, calculateAge } from '../../utils/xmlParser';

// Mock data for demonstration
const mockClients: PensionClientData[] = [
  {
    id: 'client-1',
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
    savingsInsurance: [],
    studyFunds: [],
    disabilityInsurance: [],
    summary: {
      totalPensionBalance: 150000,
      totalSavingsBalance: 0,
      totalStudyFundBalance: 0,
      monthlyPensionContribution: 3812.5,
      monthlySavingsContribution: 0,
      monthlyStudyFundContribution: 0,
      lastUpdateDate: '2024-01-01'
    },
    xmlFileName: 'israel_israeli.xml',
    importDate: '2024-01-01T10:00:00Z'
  },
  {
    id: 'client-2',
    personalInfo: {
      id: '987654321',
      firstName: 'שרה',
      lastName: 'כהן',
      birthDate: '1990-03-20',
      phoneNumber: '054-9876543',
      email: 'sarah@example.com',
      address: 'ירושלים'
    },
    employmentHistory: [
      {
        id: 'emp-2',
        companyName: 'משרד החינוך',
        position: 'מורה',
        startDate: '2018-09-01',
        endDate: '2024-01-01',
        salary: 18000
      }
    ],
    pensionContributions: [
      {
        id: 'pension-2',
        fundName: 'הפניקס קופת גמל',
        contributionDate: '2024-01-01',
        employeeAmount: 1260,
        employerAmount: 1485,
        totalAmount: 2745,
        accumulatedBalance: 95000
      }
    ],
    savingsInsurance: [],
    studyFunds: [],
    disabilityInsurance: [],
    summary: {
      totalPensionBalance: 95000,
      totalSavingsBalance: 0,
      totalStudyFundBalance: 0,
      monthlyPensionContribution: 2745,
      monthlySavingsContribution: 0,
      monthlyStudyFundContribution: 0,
      lastUpdateDate: '2024-01-01'
    },
    xmlFileName: 'sarah_cohen.xml',
    importDate: '2024-01-01T11:00:00Z'
  }
];

// ClientCard Component
const ClientCard: React.FC<{ 
  client: PensionClientData;
  onView: (client: PensionClientData) => void;
  onEdit?: (client: PensionClientData) => void;
  onDelete?: (clientId: string) => void;
}> = ({ client, onView, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const age = calculateAge(client.personalInfo.birthDate);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.cardBackground,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 300px' }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {client.personalInfo.firstName.charAt(0)}{client.personalInfo.lastName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      mb: 0.5
                    }}
                  >
                    {client.personalInfo.firstName} {client.personalInfo.lastName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.colors.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 16 }} />
                    גיל {age} • ת.ז {client.personalInfo.id}
                  </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ color: theme.colors.textMuted, display: 'block' }}
                >
                  יתרת פנסיה כוללת
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.colors.success,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  {formatCurrency(client.summary?.totalPensionBalance || 0)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ color: theme.colors.textMuted, display: 'block' }}
                >
                  הפקדה חודשית
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.colors.info,
                    fontWeight: 600
                  }}
                >
                  {formatCurrency(client.summary?.monthlyPensionContribution || 0)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: '0 0 auto' }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="איזור אישי">
                  <IconButton
                    onClick={() => navigate(`/crm/client/${client.personalInfo.id}`)}
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                      color: theme.colors.success,
                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.3)' }
                    }}
                  >
                    <PersonDetailIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="צפייה בפרטים">
                  <IconButton
                    onClick={() => onView(client)}
                    sx={{
                      bgcolor: 'rgba(33, 150, 243, 0.2)',
                      color: theme.colors.info,
                      '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.3)' }
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {onEdit && (
                  <Tooltip title="עריכה">
                    <IconButton
                      onClick={() => onEdit(client)}
                      sx={{
                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                        color: theme.colors.warning,
                        '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.3)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="מחיקה">
                    <IconButton
                      onClick={() => onDelete(client.id)}
                      sx={{
                        bgcolor: 'rgba(244, 67, 54, 0.2)',
                        color: theme.colors.error,
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.3)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ClientManagement: React.FC = () => {
  const { clients, searchClients } = useClientStore();
  const { theme } = useTheme();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    ageRange: { min: 0, max: 100 },
    pensionBalanceRange: { min: 0, max: 1000000 },
    employmentStatus: 'all',
    fundNames: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(6);
  const [selectedClient, setSelectedClient] = useState<PensionClientData | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    // Search by name, ID, or phone
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.personalInfo.firstName.toLowerCase().includes(term) ||
        client.personalInfo.lastName.toLowerCase().includes(term) ||
        client.personalInfo.id.includes(term) ||
        client.personalInfo.phoneNumber?.includes(term)
      );
    }

    // Filter by age range
    if (searchFilters.ageRange) {
      filtered = filtered.filter(client => {
        const age = calculateAge(client.personalInfo.birthDate);
        return age >= searchFilters.ageRange!.min && age <= searchFilters.ageRange!.max;
      });
    }

    // Filter by pension balance range
    if (searchFilters.pensionBalanceRange) {
      filtered = filtered.filter(client =>
        client.summary && 
        client.summary.totalPensionBalance >= searchFilters.pensionBalanceRange!.min &&
        client.summary.totalPensionBalance <= searchFilters.pensionBalanceRange!.max
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (searchFilters.sortBy) {
        case 'name':
          valueA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`;
          valueB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`;
          break;
        case 'age':
          valueA = calculateAge(a.personalInfo.birthDate);
          valueB = calculateAge(b.personalInfo.birthDate);
          break;
        case 'pensionBalance':
          valueA = a.summary?.totalPensionBalance || 0;
          valueB = b.summary?.totalPensionBalance || 0;
          break;
        case 'importDate':
          valueA = new Date(a.importDate).getTime();
          valueB = new Date(b.importDate).getTime();
          break;
        default:
          valueA = a.personalInfo.firstName;
          valueB = b.personalInfo.firstName;
      }

      if (valueA < valueB) return searchFilters.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return searchFilters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchFilters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * clientsPerPage;
    return filteredClients.slice(startIndex, startIndex + clientsPerPage);
  }, [filteredClients, currentPage, clientsPerPage]);

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handleViewClient = (client: PensionClientData) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      ageRange: { min: 0, max: 100 },
      pensionBalanceRange: { min: 0, max: 1000000 },
      employmentStatus: 'all',
      fundNames: [],
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  };

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
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 4px 12px ${theme.colors.shadow}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: theme.colors.text,
                  fontWeight: 700,
                  mb: 1
                }}
              >
                ניהול לקוחות
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.colors.textSecondary
                }}
              >
                חיפוש וניהול נתוני לקוחות שיובאו מקבצי XML
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: theme.colors.border,
                  color: 'white',
                  '&:hover': {
                    borderColor: theme.colors.accent,
                    bgcolor: theme.colors.surface
                  }
                }}
              >
                רענן
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  background: theme.colors.info,
                  '&:hover': {
                    background: theme.colors.accentHover,
                  }
                }}
              >
                ייצוא נתונים
              </Button>
            </Box>
          </Box>

          {/* Statistics */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: theme.colors.success,
                  color: 'white'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {clients.length}
                </Typography>
                <Typography variant="body2">
                  סך הכל לקוחות
                </Typography>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: theme.colors.accent,
                  color: 'white'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(clients.reduce((sum, client) => sum + (client.summary?.totalPensionBalance || 0), 0))}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  סך יתרות פנסיה
                </Typography>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: theme.colors.warning,
                  color: 'white'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(clients.reduce((sum, client) => sum + (client.summary?.monthlyPensionContribution || 0), 0))}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  הפקדה חודשית כוללת
                </Typography>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: theme.colors.accent,
                  color: 'white'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {Math.round(clients.reduce((sum, client) => sum + calculateAge(client.personalInfo.birthDate), 0) / clients.length) || 0}
                </Typography>
                <Typography variant="body2">
                  גיל ממוצע
                </Typography>
              </Card>
            </Box>
          </Box>
        </Paper>

        {/* Search and Filters */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: theme.colors.cardBackground,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="חיפוש לפי שם, תעודת זהות או טלפון..."
                value={searchFilters.searchTerm}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.colors.textSecondary }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: theme.colors.surface,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.border,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.accent,
                    },
                    color: 'white',
                    '& input::placeholder': {
                      color: theme.colors.textSecondary,
                      opacity: 1,
                    },
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: '0 0 200px' }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.colors.textSecondary }}>מיון לפי</InputLabel>
                <Select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  sx={{
                    bgcolor: theme.colors.surface,
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.border,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.accent,
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="name">שם</MenuItem>
                  <MenuItem value="age">גיל</MenuItem>
                  <MenuItem value="pensionBalance">יתרת פנסיה</MenuItem>
                  <MenuItem value="importDate">תאריך ייבוא</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '0 0 200px' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'white',
                    '&:hover': {
                      borderColor: theme.colors.accent,
                      bgcolor: theme.colors.surface
                    }
                  }}
                >
                  סינון
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'white',
                    '&:hover': {
                      borderColor: theme.colors.accent,
                      bgcolor: theme.colors.surface
                    }
                  }}
                >
                  נקה
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: 1 }}>
                      טווח גילאים
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="מ-"
                        value={searchFilters.ageRange?.min || ''}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          ageRange: { ...prev.ageRange!, min: parseInt(e.target.value) || 0 }
                        }))}
                        InputProps={{
                          sx: {
                            bgcolor: theme.colors.surface,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.colors.border,
                            },
                          }
                        }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        placeholder="עד"
                        value={searchFilters.ageRange?.max || ''}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          ageRange: { ...prev.ageRange!, max: parseInt(e.target.value) || 100 }
                        }))}
                        InputProps={{
                          sx: {
                            bgcolor: theme.colors.surface,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.colors.border,
                            },
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: 1 }}>
                      טווח יתרת פנסיה
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="מ-"
                        value={searchFilters.pensionBalanceRange?.min || ''}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          pensionBalanceRange: { ...prev.pensionBalanceRange!, min: parseInt(e.target.value) || 0 }
                        }))}
                        InputProps={{
                          sx: {
                            bgcolor: theme.colors.surface,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.colors.border,
                            },
                          }
                        }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        placeholder="עד"
                        value={searchFilters.pensionBalanceRange?.max || ''}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          pensionBalanceRange: { ...prev.pensionBalanceRange!, max: parseInt(e.target.value) || 1000000 }
                        }))}
                        InputProps={{
                          sx: {
                            bgcolor: theme.colors.surface,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.colors.border,
                            },
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: theme.colors.textSecondary }}>סטטוס תעסוקה</InputLabel>
                      <Select
                        value={searchFilters.employmentStatus}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, employmentStatus: e.target.value as any }))}
                        sx={{
                          bgcolor: theme.colors.surface,
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.colors.border,
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        }}
                      >
                        <MenuItem value="all">הכל</MenuItem>
                        <MenuItem value="employed">מועסק</MenuItem>
                        <MenuItem value="unemployed">לא מועסק</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        {/* Results */}
        <Box sx={{ mb: 3 }}>
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
            <Badge badgeContent={filteredClients.length} color="primary">
              <PersonIcon />
            </Badge>
            תוצאות חיפוש
          </Typography>

          {filteredClients.length > 0 ? (
            <AnimatePresence>
              {paginatedClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onView={handleViewClient}
                />
              ))}
            </AnimatePresence>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                background: theme.colors.cardBackground,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 3,
              }}
            >
              <PersonIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                לא נמצאו לקוחות
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                נסה לשנות את קריטריוני החיפוש או לייבא קבצי XML חדשים
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  borderColor: theme.colors.border,
                  '&:hover': {
                    bgcolor: theme.colors.surface,
                  },
                  '&.Mui-selected': {
                    bgcolor: theme.colors.accent,
                    '&:hover': {
                      bgcolor: theme.colors.accentHover,
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Client Details Dialog */}
        <Dialog
          open={showClientDetails}
          onClose={() => setShowClientDetails(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(10, 10, 16, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 3,
            }
          }}
        >
          {selectedClient && (
            <>
              <DialogTitle sx={{ color: 'white', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {selectedClient.personalInfo.firstName.charAt(0)}{selectedClient.personalInfo.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {selectedClient.personalInfo.firstName} {selectedClient.personalInfo.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      ת.ז: {selectedClient.personalInfo.id}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.colors.info }}>
                      פרטים אישיים
                    </Typography>
                    <Stack spacing={1}>
                      <Typography><strong>גיל:</strong> {calculateAge(selectedClient.personalInfo.birthDate)}</Typography>
                      <Typography><strong>טלפון:</strong> {selectedClient.personalInfo.phoneNumber}</Typography>
                      <Typography><strong>כתובת:</strong> {selectedClient.personalInfo.address}</Typography>
                      <Typography><strong>תאריך ייבוא:</strong> {formatDate(selectedClient.importDate)}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.colors.success }}>
                      סיכום פנסיוני
                    </Typography>
                    <Stack spacing={1}>
                      <Typography><strong>יתרה כוללת:</strong> {formatCurrency(selectedClient.summary?.totalPensionBalance || 0)}</Typography>
                      <Typography><strong>הפקדה חודשית:</strong> {formatCurrency(selectedClient.summary?.monthlyPensionContribution || 0)}</Typography>
                      <Typography><strong>עדכון אחרון:</strong> {formatDate(selectedClient.summary?.lastUpdateDate || '')}</Typography>
                    </Stack>
                  </Box>
                </Box>

                {/* Employment History */}
                {selectedClient.employmentHistory.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.colors.warning }}>
                      היסטוריית תעסוקה
                    </Typography>
                    {selectedClient.employmentHistory.map((emp, index) => (
                      <Card
                        key={emp.id}
                        sx={{
                          mb: 2,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            {emp.companyName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                            {emp.position} • {formatCurrency(emp.salary)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.colors.textMuted }}>
                            {formatDate(emp.startDate)} - {emp.endDate ? formatDate(emp.endDate) : 'נוכחי'}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={() => setShowClientDetails(false)}
                  variant="outlined"
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'white',
                    '&:hover': {
                      borderColor: theme.colors.accent,
                      bgcolor: theme.colors.surface
                    }
                  }}
                >
                  סגור
                </Button>
                <Button 
                  variant="contained"
                  sx={{
                    background: theme.colors.info,
                  }}
                >
                  עריכה
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: theme.colors.info,
            '&:hover': {
              background: theme.colors.accentHover,
            }
          }}
          onClick={() => window.location.href = '/crm/xml-import'}
        >
          <AddIcon />
        </Fab>
      </motion.div>
    </Box>
  );
};

export default ClientManagement;