import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  Fab,
  Badge,
  Stack,
  Autocomplete,

  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Done as DoneIcon,
  Assignment as TaskIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

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
  tags: string[];
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients] = useState<Client[]>([
    { id: '1', name: 'ישראל ישראלי', email: 'israel@example.com', phone: '052-1234567' },
    { id: '2', name: 'שרה כהן', email: 'sarah@example.com', phone: '054-9876543' },
    { id: '3', name: 'דוד לוי', email: 'david@example.com', phone: '053-5555555' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    clientId: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    tags: [] as string[],
  });

  // Mock clients data
  const mockClients = [
    { id: '123456789', name: 'ישראל ישראלי' },
    { id: '987654321', name: 'שרה כהן' },
    { id: '456789123', name: 'דוד לוי' },
    { id: '789123456', name: 'מיכל בן דוד' }
  ];

  // Mock initial data
  useEffect(() => {
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
        assignedTo: 'רחל רואת חשבון',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        dueDate: new Date('2024-01-30'),
        estimatedHours: 5,
        tags: ['מס', 'דוח']
      },
      {
        id: '3',
        title: 'ייעוץ השקעות',
        description: 'פגישת ייעוץ בנושא השקעות ותיק ניירות ערך',
        status: 'done',
        priority: 'low',
        clientId: '987654321',
        assignedTo: 'משה יועץ',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18'),
        dueDate: new Date('2024-01-20'),
        estimatedHours: 2,
        actualHours: 2,
        tags: ['השקעות', 'ייעוץ']
      }
    ];
    setTasks(mockTasks);
  }, []);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '#6c757d';
      case 'in-progress': return '#007bff';
      case 'done': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'urgent': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'לביצוע';
      case 'in-progress': return 'בביצוע';
      case 'done': return 'הושלם';
      default: return status;
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'נמוכה';
      case 'medium': return 'בינונית';
      case 'high': return 'גבוהה';
      case 'urgent': return 'דחופה';
      default: return priority;
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.clientId) return;

    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      clientId: formData.clientId,
      assignedTo: formData.assignedTo,
      createdAt: editingTask?.createdAt || new Date(),
      updatedAt: new Date(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      actualHours: editingTask?.actualHours,
      tags: formData.tags,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task));
    } else {
      setTasks([...tasks, taskData]);
    }

    handleCloseDialog();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      clientId: task.clientId,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      estimatedHours: task.estimatedHours?.toString() || '',
      tags: task.tags,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    ));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      clientId: '',
      assignedTo: '',
      dueDate: '',
      estimatedHours: '',
      tags: [],
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mockClients.find(c => c.id === task.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusStats = () => {
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    
    return { todo, inProgress, done, total, completionRate };
  };

  const stats = getStatusStats();

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const client = mockClients.find(c => c.id === task.clientId);
    
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
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255,255,255,0.1)',
              borderColor: '#555',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              gap: 2,
              mb: 2 
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    mb: 1,
                    fontSize: '1.1rem'
                  }}
                >
                  {task.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ccc',
                    mb: 2,
                    lineHeight: 1.5
                  }}
                >
                  {task.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Tooltip title="עריכה">
                  <IconButton
                    onClick={() => handleEdit(task)}
                    sx={{
                      bgcolor: '#333',
                      color: '#fff',
                      '&:hover': { bgcolor: '#444' },
                      width: 36,
                      height: 36
                    }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="מחיקה">
                  <IconButton
                    onClick={() => handleDelete(task.id)}
                    sx={{
                      bgcolor: '#333',
                      color: '#fff',
                      '&:hover': { bgcolor: '#d32f2f' },
                      width: 36,
                      height: 36
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip
                label={getStatusText(task.status)}
                sx={{
                  bgcolor: getStatusColor(task.status),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
              <Chip
                label={getPriorityText(task.priority)}
                sx={{
                  bgcolor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
              {task.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{
                    borderColor: '#666',
                    color: '#ccc',
                    fontSize: '0.75rem'
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#888', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {client?.name || 'לא נבחר לקוח'}
                </Typography>
              </Box>
              {task.assignedTo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#333', fontSize: '0.75rem' }}>
                    {task.assignedTo.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    {task.assignedTo}
                  </Typography>
                </Box>
              )}
            </Box>

            {task.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarIcon sx={{ color: '#888', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  תאריך יעד: {task.dueDate.toLocaleDateString('he-IL')}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {task.status !== 'todo' && (
                  <Button
                    size="small"
                    onClick={() => handleStatusChange(task.id, 'todo')}
                    sx={{
                      color: '#ccc',
                      borderColor: '#666',
                      '&:hover': { borderColor: '#999', bgcolor: '#333' }
                    }}
                    variant="outlined"
                  >
                    לביצוע
                  </Button>
                )}
                {task.status !== 'in-progress' && (
                  <Button
                    size="small"
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    sx={{
                      color: '#007bff',
                      borderColor: '#007bff',
                      '&:hover': { bgcolor: 'rgba(0,123,255,0.1)' }
                    }}
                    variant="outlined"
                    startIcon={<StartIcon />}
                  >
                    התחל
                  </Button>
                )}
                {task.status !== 'done' && (
                  <Button
                    size="small"
                    onClick={() => handleStatusChange(task.id, 'done')}
                    sx={{
                      color: '#28a745',
                      borderColor: '#28a745',
                      '&:hover': { bgcolor: 'rgba(40,167,69,0.1)' }
                    }}
                    variant="outlined"
                    startIcon={<DoneIcon />}
                  >
                    הושלם
                  </Button>
                )}
              </Box>
              
              {task.estimatedHours && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ color: '#888', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    {task.actualHours || 0}/{task.estimatedHours}ש'
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ 
      py: 1, 
      px: 1, 
      bgcolor: '#000', 
      minHeight: '100vh',
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
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                ניהול משימות
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#ccc'
                }}
              >
                ניהול ומעקב אחר משימות ופרויקטים של הלקוחות
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
              sx={{
                bgcolor: '#fff',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f0f0f0'
                }
              }}
            >
              משימה חדשה
            </Button>
          </Box>

          {/* Statistics */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(5, 1fr)' 
            },
            gap: 2,
            width: '100%'
          }}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#333',
                color: 'white',
                minWidth: { xs: '100%', sm: 120 },
                border: '1px solid #555'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                סך הכל משימות
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#6c757d',
                color: 'white',
                minWidth: 120
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.todo}
              </Typography>
              <Typography variant="body2">
                לביצוע
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#007bff',
                color: 'white',
                minWidth: 120
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.inProgress}
              </Typography>
              <Typography variant="body2">
                בביצוע
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#28a745',
                color: 'white',
                minWidth: 120
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.done}
              </Typography>
              <Typography variant="body2">
                הושלם
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#333',
                color: 'white',
                minWidth: { xs: '100%', sm: 120 },
                border: '1px solid #555'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                {stats.completionRate}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                הושלמו
              </Typography>
            </Card>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
              התקדמות כללית: {stats.completionRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.completionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#333',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#28a745',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Paper>

        {/* Filters */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2, 
            alignItems: 'stretch',
            width: '100%'
          }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="חיפוש משימות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: '#333',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                    color: 'white',
                    '& input::placeholder': {
                      color: '#888',
                      opacity: 1,
                    },
                  }
                }}
              />
            </Box>
            <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
              <InputLabel sx={{ color: '#888' }}>סטטוס</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  bgcolor: '#333',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="all">הכל</MenuItem>
                <MenuItem value="todo">לביצוע</MenuItem>
                <MenuItem value="in-progress">בביצוע</MenuItem>
                <MenuItem value="done">הושלם</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
              <InputLabel sx={{ color: '#888' }}>עדיפות</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{
                  bgcolor: '#333',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="all">הכל</MenuItem>
                <MenuItem value="low">נמוכה</MenuItem>
                <MenuItem value="medium">בינונית</MenuItem>
                <MenuItem value="high">גבוהה</MenuItem>
                <MenuItem value="urgent">דחופה</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              sx={{
                borderColor: '#555',
                color: '#ccc',
                '&:hover': {
                  borderColor: '#777',
                  bgcolor: '#333'
                }
              }}
            >
              נקה
            </Button>
          </Box>
        </Paper>

        {/* Tasks List */}
        <Paper
          sx={{
            p: 3,
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
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
            <Badge badgeContent={filteredTasks.length} color="primary">
              <TaskIcon />
            </Badge>
            רשימת משימות
          </Typography>

          {filteredTasks.length > 0 ? (
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: '#333',
                border: '1px solid #555',
                borderRadius: 2,
              }}
            >
              <TaskIcon sx={{ fontSize: 64, color: '#666', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                לא נמצאו משימות
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'נסה לשנות את קריטריוני החיפוש'
                  : 'צור משימה חדשה כדי להתחיל'
                }
              </Typography>
            </Paper>
          )}
        </Paper>

        {/* Dialog for Add/Edit Task */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #333' }}>
            {editingTask ? 'עריכת משימה' : 'משימה חדשה'}
          </DialogTitle>
          <DialogContent sx={{ color: 'white', pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="כותרת המשימה"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                InputLabelProps={{ sx: { color: '#888' } }}
                InputProps={{
                  sx: {
                    bgcolor: '#333',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                  }
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="תיאור המשימה"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                InputLabelProps={{ sx: { color: '#888' } }}
                InputProps={{
                  sx: {
                    bgcolor: '#333',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#888' }}>לקוח</InputLabel>
                <Select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  sx={{
                    bgcolor: '#333',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .MuiSelect-icon': {
                      color: 'white',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#333',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#555',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#555',
                            '&:hover': {
                              bgcolor: '#777',
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">בחר לקוח</MenuItem>
                  {mockClients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>סטטוס</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    sx={{
                      bgcolor: '#333',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem value="todo">לביצוע</MenuItem>
                    <MenuItem value="in-progress">בביצוע</MenuItem>
                    <MenuItem value="done">הושלם</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>עדיפות</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    sx={{
                      bgcolor: '#333',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem value="low">נמוכה</MenuItem>
                    <MenuItem value="medium">בינונית</MenuItem>
                    <MenuItem value="high">גבוהה</MenuItem>
                    <MenuItem value="urgent">דחופה</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#888' }}>לקוח</InputLabel>
                <Select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  sx={{
                    bgcolor: '#333',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  {mockClients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="אחראי למשימה"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  InputLabelProps={{ sx: { color: '#888' } }}
                  InputProps={{
                    sx: {
                      bgcolor: '#333',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                    }
                  }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="תאריך יעד"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true, sx: { color: '#888' } }}
                  InputProps={{
                    sx: {
                      bgcolor: '#333',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                    }
                  }}
                />
              </Box>
              <TextField
                fullWidth
                type="number"
                label="אומדן שעות"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                InputLabelProps={{ sx: { color: '#888' } }}
                InputProps={{
                  sx: {
                    bgcolor: '#333',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                  }
                }}
              />
              <Autocomplete
                multiple
                freeSolo
                options={['פנסיה', 'מס', 'ייעוץ', 'השקעות', 'ביטוח', 'דוח']}
                value={formData.tags}
                onChange={(_, newValue) => setFormData({ ...formData, tags: newValue })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      sx={{
                        bgcolor: '#555',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: '#ccc',
                          '&:hover': {
                            color: 'white'
                          }
                        }
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="תגיות"
                    placeholder="הוסף תגיות..."
                    InputLabelProps={{ sx: { color: '#888' } }}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        bgcolor: '#333',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#555',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#777',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                        },
                        '& input::placeholder': {
                          color: '#888',
                          opacity: 1,
                        },
                      }
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    color: 'white',
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    color: 'white',
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                color: '#ccc',
                borderColor: '#555',
                '&:hover': {
                  borderColor: '#777',
                  bgcolor: '#333'
                }
              }}
              variant="outlined"
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#fff',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f0f0f0'
                }
              }}
            >
              {editingTask ? 'עדכן' : 'צור'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#fff',
            color: '#000',
            '&:hover': {
              bgcolor: '#f0f0f0'
            }
          }}
          onClick={() => setIsDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </motion.div>
    </Box>
  );
};

export default TaskManagement;
