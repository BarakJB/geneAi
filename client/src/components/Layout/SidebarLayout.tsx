import React, { useState, useEffect } from 'react';
import GlobalSearch from '../CRM/GlobalSearch';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import CalculateIcon from '@mui/icons-material/CalculateOutlined';
import MoneyIcon from '@mui/icons-material/AttachMoneyOutlined';
import ReceiptIcon from '@mui/icons-material/DescriptionOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAddOutlined';
import SecurityIcon from '@mui/icons-material/SecurityOutlined';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import SearchIcon from '@mui/icons-material/ManageSearchOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import TicketIcon from '@mui/icons-material/AssignmentOutlined';
import UploadIcon from '@mui/icons-material/CloudUploadOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';

type SidebarLayoutProps = Readonly<{
  title?: string;
  children: React.ReactNode;
}>;

const EXPANDED_WIDTH = 180; // Reduced from 220 for laptop screens
const COLLAPSED_WIDTH = 48; // Reduced from 56 for laptop screens

export default function SidebarLayout({ title = 'Dashboard', children }: SidebarLayoutProps) {
  const [open, setOpen] = React.useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const appTheme = useAppTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Global search keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  

  const navItems = [
    { label: 'דאשבורד', icon: <DashboardIcon />, path: '/crm/dashboard' },
    { label: 'מחשבון פנסיה', icon: <CalculateIcon />, path: '/crm/pension' },
    { label: 'מחשבון שכר', icon: <MoneyIcon />, path: '/crm/salary' },
    { label: 'ניתוח תלוש', icon: <ReceiptIcon />, path: '/crm/payslip' },
    { label: 'הוספת לקוח', icon: <PersonAddIcon />, path: '/crm/add-client' },
    { label: 'הר הביטוח', icon: <SecurityIcon />, path: '/crm/insurance' },
    { label: 'אינטגרציות', icon: <LinkIcon />, path: '/crm/integrations' },
    { label: 'ניהול משימות', icon: <TicketIcon />, path: '/crm/tasks' },
    { divider: true },
    { label: 'ייבוא XML פנסיה', icon: <UploadIcon />, path: '/crm/xml-import' },
    { label: 'ניהול לקוחות', icon: <GroupIcon />, path: '/crm/client-management' },
    { label: 'רשימת לקוחות', icon: <GroupIcon />, path: '/crm/clients' },
    { divider: true },
    { label: 'ליד חדש', icon: <SearchIcon />, path: '/crm/new-lead' },
    { label: 'קבע פגישה', icon: <EventIcon />, path: '/crm/schedule-meeting' },
    { label: 'דוחות', icon: <BarChartIcon />, path: '/crm/reports' },
    { divider: true },
    { label: 'יציאה', icon: <LogoutIcon />, path: '/crm/login' },
  ] as const;

  const drawerWidth = open ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: appTheme.theme.colors.headerBackground,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${appTheme.theme.colors.border}`,
          left: 0,
          right: 0,
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, // Reduced gap
          minHeight: { xs: 56, sm: 64 }, // Smaller toolbar on mobile
          px: { xs: 1, sm: 2 } // Responsive padding
        }}>
          <Tooltip title={open ? 'סגור תפריט' : 'פתח תפריט'}>
            <IconButton 
              onClick={() => setOpen(!open)}
              sx={{ 
                color: appTheme.theme.colors.text,
                bgcolor: appTheme.theme.colors.accent,
                border: `1px solid ${appTheme.theme.colors.border}`,
                p: { xs: 0.5, sm: 1 }, // Smaller on mobile
                '&:hover': { 
                  bgcolor: appTheme.theme.colors.accentHover,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MenuOpenIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Tooltip>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: appTheme.theme.colors.text,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }, // Responsive font size
              flex: 1
            }}
          >
            {title}
          </Typography>
          
          {/* Theme Toggle Button */}
          <Tooltip title={appTheme.theme.mode === 'dark' ? 'מצב בהיר' : 'מצב כהה'}>
            <IconButton
              onClick={appTheme.toggleTheme}
              sx={{ 
                color: appTheme.theme.colors.text,
                bgcolor: `${appTheme.theme.colors.accent}15`,
                border: `1px solid ${appTheme.theme.colors.border}`,
                p: { xs: 0.5, sm: 1 },
                mr: 1,
                '&:hover': { 
                  bgcolor: `${appTheme.theme.colors.accent}25`,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {appTheme.theme.mode === 'dark' ? 
                <LightModeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : 
                <DarkModeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              }
            </IconButton>
          </Tooltip>
          
          {/* Global Search Button */}
          <Tooltip title="חיפוש גלובלי (Ctrl+K)">
            <IconButton
              onClick={() => setSearchOpen(true)}
              sx={{ 
                color: appTheme.theme.colors.text,
                bgcolor: `${appTheme.theme.colors.accent}15`,
                border: `1px solid ${appTheme.theme.colors.border}`,
                p: { xs: 0.5, sm: 1 },
                mr: 1,
                '&:hover': { 
                  bgcolor: `${appTheme.theme.colors.accent}25`,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <SearchIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMdUp ? 'permanent' : 'temporary'}
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            width: drawerWidth,
            overflowX: 'hidden',
            borderRight: `1px solid ${appTheme.theme.colors.border}`,
            bgcolor: appTheme.theme.colors.sidebarBackground,
            backdropFilter: 'blur(12px)',
          },
        }}
        ModalProps={{ keepMounted: true }}
        onClose={() => setOpen(false)}
      >
        <Toolbar />
        <List sx={{ px: 0.5, py: 1 }}>
          {navItems.map((item, idx) => {
            if ((item as any).divider) {
              return <Divider key={`div-${(item as any).label || idx}`} sx={{ my: 1, borderColor: appTheme.theme.colors.divider }} />;
            }
            const active = location.pathname === (item as any).path;
            return (
              <ListItem key={(item as any).path} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate((item as any).path)}
                  selected={active}
                  sx={{
                    minHeight: 38, // Reduced from 44
                    justifyContent: open ? 'initial' : 'center',
                    px: 1.5, // Reduced from 2
                    borderRadius: 1,
                    my: 0.15, // Reduced from 0.25
                    bgcolor: active ? appTheme.theme.colors.accent : 'transparent',
                    '&:hover': {
                      bgcolor: active ? appTheme.theme.colors.accentHover : `${appTheme.theme.colors.accent}15`,
                    },
                    '&.Mui-selected': {
                      bgcolor: appTheme.theme.colors.accent,
                      '&:hover': {
                        bgcolor: appTheme.theme.colors.accentHover,
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, 
                    mr: open ? 1 : 0, // Reduced from 1.5
                    justifyContent: 'center', 
                    color: active ? 'white' : appTheme.theme.colors.textSecondary,
                    '& svg': { fontSize: 20 } // Smaller icons
                  }}>
                    {(item as any).icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={(item as any).label}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: active ? 'white' : appTheme.theme.colors.text,
                      '& .MuiListItemText-primary': { 
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.875rem' // Smaller text
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 7, // Reduced from 8
          minHeight: '100vh',
          background: appTheme.theme.colors.primary,
          px: { xs: 1, sm: 1.5, md: 2, lg: 3 }, // Reduced padding for laptop
          ml: { xs: 0, md: isMdUp ? `${drawerWidth}px` : 0 },
          width: { xs: '100%', md: isMdUp ? `calc(100% - ${drawerWidth}px)` : '100%' },
        }}
      >
        {children}
      </Box>
      
      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </Box>
  );
}


