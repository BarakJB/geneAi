import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Assignment as TaskIcon,
  AccountBalance as PensionIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchResult {
  type: 'client' | 'task' | 'pension' | 'employment';
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  data: any;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients } = useClientStore();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Mock tasks data - in real app this would come from a global tasks store
  const mockTasks = [
    {
      id: '1',
      title: 'בדיקת תיק פנסיה',
      description: 'סקירה מלאה של תיק הפנסיה ועדכון נתונים',
      clientId: '123456789',
      clientName: 'ישראל ישראלי'
    },
    {
      id: '2',
      title: 'הכנת דוח שנתי',
      description: 'הכנת דוח מס שנתי ללקוח',
      clientId: '123456789',
      clientName: 'ישראל ישראלי'
    },
    {
      id: '3',
      title: 'ייעוץ השקעות',
      description: 'פגישת ייעוץ בנושא השקעות ותיק ניירות ערך',
      clientId: '987654321',
      clientName: 'שרה כהן'
    }
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search in clients
    clients.forEach(client => {
      const fullName = `${client.personalInfo.firstName} ${client.personalInfo.lastName}`;
      
      if (
        fullName.toLowerCase().includes(query) ||
        client.personalInfo.id.includes(query) ||
        client.personalInfo.phoneNumber.includes(query) ||
        client.personalInfo.email.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'client',
          id: client.personalInfo.id,
          title: fullName,
          subtitle: `ת.ז: ${client.personalInfo.id}`,
          description: `טלפון: ${client.personalInfo.phoneNumber}`,
          data: client
        });
      }

      // Search in employment history
      client.employmentHistory.forEach(emp => {
        if (
          emp.companyName.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'employment',
            id: `${client.personalInfo.id}-${emp.id}`,
            title: `${emp.position} ב${emp.companyName}`,
            subtitle: fullName,
            description: `משכורת: ₪${emp.salary.toLocaleString()}`,
            data: { client, employment: emp }
          });
        }
      });

      // Search in pension funds
      client.pensionContributions.forEach(pension => {
        if (pension.fundName.toLowerCase().includes(query)) {
          results.push({
            type: 'pension',
            id: `${client.personalInfo.id}-${pension.id}`,
            title: pension.fundName,
            subtitle: fullName,
            description: `יתרה: ₪${pension.accumulatedBalance.toLocaleString()}`,
            data: { client, pension }
          });
        }
      });
    });

    // Search in tasks
    mockTasks.forEach(task => {
      if (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.clientName.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: `לקוח: ${task.clientName}`,
          description: task.description,
          data: task
        });
      }
    });

    return results.slice(0, 20); // Limit results
  }, [searchQuery, clients]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'client':
        navigate(`/crm/client/${result.id}`);
        break;
      case 'task':
        navigate('/crm/tasks');
        break;
      case 'pension':
      case 'employment':
        navigate(`/crm/client/${result.data.client.personalInfo.id}`);
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <PersonIcon />;
      case 'task':
        return <TaskIcon />;
      case 'pension':
        return <PensionIcon />;
      case 'employment':
        return <WorkIcon />;
      default:
        return <SearchIcon />;
    }
  };

  const getResultTypeText = (type: string) => {
    switch (type) {
      case 'client':
        return 'לקוח';
      case 'task':
        return 'משימה';
      case 'pension':
        return 'קרן פנסיה';
      case 'employment':
        return 'מקום עבודה';
      default:
        return '';
    }
  };

  const getResultTypeColor = (type: string) => {
    if (theme.mode === 'dark') {
      switch (type) {
        case 'client':
          return theme.colors.success;
        case 'task':
          return theme.colors.info;
        case 'pension':
          return theme.colors.warning;
        case 'employment':
          return theme.colors.accent;
        default:
          return theme.colors.textMuted;
      }
    } else {
      switch (type) {
        case 'client':
          return '#4CAF50';
        case 'task':
          return '#2196F3';
        case 'pension':
          return '#FF9800';
        case 'employment':
          return '#9C27B0';
        default:
          return '#666';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: '10vh'
      }}
      onClick={onClose}
    >
      <Card
        sx={{
          width: '90%',
          maxWidth: 600,
          maxHeight: '70vh',
          bgcolor: theme.colors.cardBackground,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 8px 32px ${theme.colors.shadowHover}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Search Input */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.colors.border}` }}>
            <TextField
              fullWidth
              placeholder="חפש לקוחות, משימות, קרנות פנסיה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  '& fieldset': { borderColor: theme.colors.border },
                  '&:hover fieldset': { borderColor: theme.colors.accent },
                  '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                },
                '& .MuiInputLabel-root': { color: theme.colors.textSecondary }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.colors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setSearchQuery('')}
                      sx={{ color: theme.colors.textSecondary }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Search Results */}
          <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            {searchQuery.trim() === '' ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 48, color: theme.colors.textMuted, mb: 1 }} />
                <Typography variant="body1" sx={{ color: theme.colors.textSecondary }}>
                  התחל להקליד כדי לחפש...
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.textMuted, mt: 1 }}>
                  ניתן לחפש לקוחות, משימות, קרנות פנסיה ומקומות עבודה
                </Typography>
              </Box>
            ) : searchResults.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: theme.colors.textSecondary }}>
                  לא נמצאו תוצאות עבור "{searchQuery}"
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {searchResults.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <ListItem
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: theme.colors.surface },
                        py: 2
                      }}
                      onClick={() => handleResultClick(result)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: getResultTypeColor(result.type),
                            color: 'white'
                          }}
                        >
                          {getResultIcon(result.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: theme.colors.text }}>
                              {result.title}
                            </Typography>
                            <Chip
                              label={getResultTypeText(result.type)}
                              size="small"
                              sx={{
                                bgcolor: getResultTypeColor(result.type),
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                              {result.subtitle}
                            </Typography>
                            {result.description && (
                              <Typography variant="caption" sx={{ color: theme.colors.textMuted }}>
                                {result.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < searchResults.length - 1 && (
                      <Divider sx={{ borderColor: theme.colors.divider }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: theme.colors.textMuted }}>
              ESC כדי לסגור • Enter כדי לעבור לתוצאה הראשונה
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GlobalSearch;
