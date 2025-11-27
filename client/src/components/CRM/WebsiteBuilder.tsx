import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Card,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Alert,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Preview as PreviewIcon,
  Save as SaveIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
  ViewModule as LayoutIcon,
  Public as PublishIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';

// Types for website configuration
interface WebsiteConfig {
  siteName: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  showCalculator: boolean;
  showTestimonials: boolean;
  showServices: boolean;
  customCSS: string;
  isPublished: boolean;
  subdomain: string;
  customDomain: string;
  useCustomDomain: boolean;
  agentName: string;
  paletteId?: string;
  template?: 'clean' | 'gradient' | 'imageHero';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`website-tabpanel-${index}`}
    aria-labelledby={`website-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const WebsiteBuilder: React.FC = () => {
  const [config, setConfig] = useState<WebsiteConfig>({
    siteName: 'סוכנות הביטוח שלי',
    tagline: 'השותף הביטוחי המקצועי שלך',
    logo: '',
    primaryColor: '#000000',
    secondaryColor: '#111827',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    heroTitle: 'ברוכים הבאים לסוכנות הביטוח שלי',
    heroSubtitle: 'מספקים פתרונות ביטוח מותאמים אישית עם שירות מקצועי ואמין',
    heroImage: '',
    aboutText: 'אנחנו סוכנות ביטוח מקצועית עם ניסיון רב שנים בתחום. אנו מתמחים במתן פתרונות ביטוח מותאמים אישית ושירות מעולה ללקוחותינו.',
    contactEmail: 'info@insurance-agency.co.il',
    contactPhone: '050-123-4567',
    showCalculator: true,
    showTestimonials: true,
    showServices: true,
    customCSS: '',
    isPublished: false,
    subdomain: 'my-agency',
    customDomain: '',
    useCustomDomain: false,
    agentName: 'ברק',
    paletteId: 'mono',
    template: 'clean'
  });

  const [activeTab, setActiveTab] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'primary' | 'secondary' | 'background' | 'text'>('primary');
  const [saved, setSaved] = useState(false);
  const [template, setTemplate] = useState<'clean' | 'gradient' | 'imageHero'>('clean');
  const [copiedPublished, setCopiedPublished] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('websiteConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (field: keyof WebsiteConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  // Auto-persist config so external previews (/site/preview) reflect immediately
  useEffect(() => {
    try {
      localStorage.setItem('websiteConfig', JSON.stringify(config));
    } catch {
      // ignore storage errors
    }
  }, [config]);

  // Curated palette presets
  const palettePresets = [
    {
      id: 'mono',
      name: 'Monochrome',
      primary: '#000000',
      secondary: '#111827',
      bg: '#FFFFFF',
      text: '#000000',
    },
    {
      id: 'classic',
      name: 'Classic Blue',
      primary: '#0F62FE',
      secondary: '#A6C8FF',
      bg: '#FFFFFF',
      text: '#0B0B0B',
    },
    {
      id: 'emerald',
      name: 'Emerald',
      primary: '#10B981',
      secondary: '#A7F3D0',
      bg: '#FFFFFF',
      text: '#0B0B0B',
    },
    {
      id: 'rose',
      name: 'Rose',
      primary: '#E11D48',
      secondary: '#FBCFE8',
      bg: '#FFFFFF',
      text: '#0B0B0B',
    },
    {
      id: 'slate',
      name: 'Slate',
      primary: '#334155',
      secondary: '#CBD5E1',
      bg: '#FFFFFF',
      text: '#111827',
    },
  ] as const;

  const applyPalette = (id: string) => {
    const p = palettePresets.find(x => x.id === id);
    if (!p) return;
    setConfig(prev => ({
      ...prev,
      paletteId: id,
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      backgroundColor: p.bg,
      textColor: p.text,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('websiteConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePublish = () => {
    handleSave();
    setConfig(prev => ({ ...prev, isPublished: true }));
    // Publishing logic: This will be implemented in future versions to deploy to CDN
  };

  const openColorPicker = (type: 'primary' | 'secondary' | 'background' | 'text') => {
    setColorPickerType(type);
    setColorPickerOpen(true);
  };

  const handleColorChange = (color: string) => {
    const colorMap = {
      primary: 'primaryColor',
      secondary: 'secondaryColor',
      background: 'backgroundColor',
      text: 'textColor'
    };
    handleConfigChange(colorMap[colorPickerType] as keyof WebsiteConfig, color);
  };

  const siteUrl = React.useMemo(() => (
    config.useCustomDomain && config.customDomain
      ? `https://${config.customDomain}`
      : `https://agent.${config.agentName}.co.il`
  ), [config.useCustomDomain, config.customDomain, config.agentName]);

  const copyToClipboard = async (text: string, setFlag: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlag(true);
      setTimeout(() => setFlag(false), 2000);
    } catch {
      // noop
    }
  };

  const PreviewWebsite = () => (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: config.backgroundColor,
      color: config.textColor,
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: config.primaryColor, 
        color: 'white',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {config.logo && (
            <Avatar src={config.logo} sx={{ width: 40, height: 40 }} />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {config.siteName}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          {config.tagline}
        </Typography>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.secondaryColor}15 100%)`,
        py: 8,
        textAlign: 'center'
      }}>
        {config.heroImage && (
          <Box sx={{ mb: 4 }}>
            <img 
              src={config.heroImage} 
              alt="Hero" 
              style={{ 
                maxWidth: '400px', 
                width: '100%', 
                height: 'auto',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }} 
            />
          </Box>
        )}
        <Typography variant="h2" sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          color: config.textColor,
          fontSize: { xs: '2rem', md: '3rem' }
        }}>
          {config.heroTitle}
        </Typography>
        <Typography variant="h5" sx={{ 
          mb: 4,
          color: config.textColor,
          opacity: 0.8,
          maxWidth: '600px',
          mx: 'auto'
        }}>
          {config.heroSubtitle}
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            bgcolor: config.primaryColor,
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          צור קשר עכשיו
        </Button>
      </Box>

      {/* Services Section */}
      {config.showServices && (
        <Box sx={{ py: 6, px: 4, bgcolor: config.backgroundColor }}>
          <Typography variant="h3" sx={{ 
            textAlign: 'center', 
            mb: 4,
            color: config.textColor,
            fontWeight: 'bold'
          }}>
            השירותים שלנו
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {['ביטוח רכב', 'ביטוח דירה', 'ביטוח חיים', 'פנסיה וחיסכון'].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  border: `2px solid ${config.primaryColor}20`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${config.primaryColor}30`
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <Typography variant="h6" sx={{ 
                    color: config.primaryColor,
                    fontWeight: 'bold',
                    mb: 2 
                  }}>
                    {service}
                  </Typography>
                  <Typography variant="body2" sx={{ color: config.textColor }}>
                    פתרונות מותאמים אישית עם השירות הטוב ביותר
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Calculator Section */}
      {config.showCalculator && (
        <Box sx={{ 
          py: 6, 
          px: 4,
          bgcolor: `${config.primaryColor}08`
        }}>
          <Typography variant="h3" sx={{ 
            textAlign: 'center', 
            mb: 4,
            color: config.textColor,
            fontWeight: 'bold'
          }}>
            מחשבון ביטוח
          </Typography>
          <Card sx={{ 
            maxWidth: '600px', 
            mx: 'auto', 
            p: 4,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 3,
              color: config.primaryColor,
              fontWeight: 'bold'
            }}>
              חשב את דמי הביטוח שלך
            </Typography>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: config.primaryColor,
                color: config.primaryColor,
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              פתח מחשבון
            </Button>
          </Card>
        </Box>
      )}

      {/* About Section */}
      <Box sx={{ py: 6, px: 4, bgcolor: config.backgroundColor }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          mb: 4,
          color: config.textColor,
          fontWeight: 'bold'
        }}>
          אודותינו
        </Typography>
        <Typography variant="body1" sx={{ 
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
          fontSize: '1.1rem',
          lineHeight: 1.8,
          color: config.textColor
        }}>
          {config.aboutText}
        </Typography>
      </Box>

      {/* Contact Section */}
      <Box sx={{ 
        py: 6, 
        px: 4,
        bgcolor: config.primaryColor,
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{ 
          mb: 4,
          fontWeight: 'bold'
        }}>
          צור קשר
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📧 {config.contactEmail}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📱 {config.contactPhone}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            🌐 בונה אתרי תדמית
          </Typography>
          <Typography variant="body1" color="text.secondary">
            עצב ובנה את אתר התדמית המקצועי שלך בקלות
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
            size="large"
          >
            תצוגה מקדימה
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saved}
            size="large"
          >
            {saved ? 'נשמר!' : 'שמור'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
            size="large"
          >
            פרסם אתר
          </Button>
        </Box>
      </Box>

      {/* Status Alerts */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              השינויים נשמרו בהצלחה!
            </Alert>
          </motion.div>
        )}
        
        {config.isPublished && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body1">האתר שלך זמין בכתובת:</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {siteUrl}
                </a>
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CopyIcon fontSize="small" />}
                onClick={() => copyToClipboard(siteUrl, setCopiedPublished)}
              >
                {copiedPublished ? 'הועתק!' : 'העתק קישור'}
              </Button>
            </Box>
          </Alert>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<EditIcon />} label="תוכן בסיסי" />
          <Tab icon={<PaletteIcon />} label="עיצוב וצבעים" />
          <Tab icon={<ImageIcon />} label="תמונות" />
          <Tab icon={<LayoutIcon />} label="תכונות" />
          <Tab icon={<TextIcon />} label="CSS מותאם" />
          <Tab icon={<PublishIcon />} label="הגדרות מתקדמות" />
        </Tabs>

        {/* Basic Content Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="template-label">תבנית</InputLabel>
                <Select
                  labelId="template-label"
                  label="תבנית"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as any)}
                >
                  <MenuItem value="clean">נקי ומינימלי</MenuItem>
                  <MenuItem value="gradient">גרדיינט מודרני</MenuItem>
                  <MenuItem value="imageHero">Hero עם תמונה</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם האתר"
                value={config.siteName}
                onChange={(e) => handleConfigChange('siteName', e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="סלוגן"
                value={config.tagline}
                onChange={(e) => handleConfigChange('tagline', e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="שם הסוכן"
                value={config.agentName}
                onChange={(e) => handleConfigChange('agentName', e.target.value)}
                margin="normal"
                variant="outlined"
                helperText="שם הסוכן ישמש ליצירת כתובת האתר"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="כותרת ראשית"
                value={config.heroTitle}
                onChange={(e) => handleConfigChange('heroTitle', e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="תת-כותרת"
                value={config.heroSubtitle}
                onChange={(e) => handleConfigChange('heroSubtitle', e.target.value)}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="טקסט אודות"
                value={config.aboutText}
                onChange={(e) => handleConfigChange('aboutText', e.target.value)}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="אימייל ליצירת קשר"
                type="email"
                value={config.contactEmail}
                onChange={(e) => handleConfigChange('contactEmail', e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון ליצירת קשר"
                value={config.contactPhone}
                onChange={(e) => handleConfigChange('contactPhone', e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            
            {/* Domain Configuration Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                הגדרת כתובת האתר
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.useCustomDomain}
                    onChange={(e) => handleConfigChange('useCustomDomain', e.target.checked)}
                    color="primary"
                  />
                }
                label="השתמש בדומיין מותאם אישית"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {config.useCustomDomain ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="דומיין מותאם אישית"
                  value={config.customDomain}
                  onChange={(e) => handleConfigChange('customDomain', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  placeholder="www.my-agency.co.il"
                  helperText="הזן את הדומיין המלא שלך (כולל www אם נדרש)"
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Card sx={{ p: 3, bgcolor: 'background.default', border: '2px dashed', borderColor: 'primary.main' }}>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                    <strong>כתובת האתר שלך תהיה:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center',
                        color: 'primary.main',
                        fontFamily: 'monospace',
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2
                      }}
                    >
                      {siteUrl}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CopyIcon fontSize="small" />}
                      onClick={() => copyToClipboard(siteUrl, setCopiedDomain)}
                    >
                      {copiedDomain ? 'הועתק!' : 'העתק'}
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                    כתובת מקצועית ומותאמת אישית עם שם הסוכן שלך
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Design & Colors Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ערכת צבעים
              </Typography>
            </Grid>

            {/* Palette Presets */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {palettePresets.map((p) => (
                  <Card key={p.id} sx={{ p: 2, borderRadius: 2, cursor: 'pointer', minWidth: 220, border: (config.paletteId === p.id) ? '2px solid' : '1px solid', borderColor: (config.paletteId === p.id) ? 'primary.main' : 'divider' }} onClick={() => applyPalette(p.id)}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{p.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 36, height: 24, bgcolor: p.primary, borderRadius: 1, boxShadow: 1 }} />
                      <Box sx={{ width: 36, height: 24, bgcolor: p.secondary, borderRadius: 1, boxShadow: 1 }} />
                      <Box sx={{ width: 36, height: 24, bgcolor: p.bg, border: '1px solid #e5e7eb', borderRadius: 1 }} />
                      <Box sx={{ width: 36, height: 24, bgcolor: p.text, borderRadius: 1, boxShadow: 1 }} />
                    </Box>
                  </Card>
                ))}
              </Box>
            </Grid>
            
            {[
              { key: 'primary', label: 'צבע ראשי', value: config.primaryColor },
              { key: 'secondary', label: 'צבע משני', value: config.secondaryColor },
              { key: 'background', label: 'צבע רקע', value: config.backgroundColor },
              { key: 'text', label: 'צבע טקסט', value: config.textColor }
            ].map(({ key, label, value }) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 60,
                      bgcolor: value,
                      borderRadius: 2,
                      mb: 2,
                      cursor: 'pointer',
                      border: '2px solid #e0e0e0'
                    }}
                    onClick={() => openColorPicker(key as any)}
                  />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {label}
                  </Typography>
                  <Chip 
                    label={value} 
                    size="small" 
                    onClick={() => openColorPicker(key as any)}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Images Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  לוגו
                </Typography>
                <TextField
                  fullWidth
                  label="URL של הלוגו"
                  value={config.logo}
                  onChange={(e) => handleConfigChange('logo', e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => handleConfigChange('logo', String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                  style={{ marginTop: 8 }}
                />
                {config.logo && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={config.logo} 
                      alt="Logo preview" 
                      style={{ maxWidth: '200px', maxHeight: '100px' }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  תמונת Hero
                </Typography>
                <TextField
                  fullWidth
                  label="URL של תמונת Hero"
                  value={config.heroImage}
                  onChange={(e) => handleConfigChange('heroImage', e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => handleConfigChange('heroImage', String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                  style={{ marginTop: 8 }}
                />
                {config.heroImage && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={config.heroImage} 
                      alt="Hero preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Features Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                תכונות האתר
              </Typography>
            </Grid>
            
            {[
              { key: 'showCalculator', label: 'הצג מחשבון ביטוח', desc: 'אפשר ללקוחות לחשב דמי ביטוח' },
              { key: 'showServices', label: 'הצג שירותים', desc: 'הצג את השירותים שאתה מספק' },
              { key: 'showTestimonials', label: 'הצג המלצות', desc: 'הצג המלצות לקוחות' }
            ].map(({ key, label, desc }) => (
              <Grid item xs={12} md={4} key={key}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config[key as keyof WebsiteConfig] as boolean}
                        onChange={(e) => handleConfigChange(key as keyof WebsiteConfig, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={label}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Custom CSS Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            CSS מותאם אישית
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={config.customCSS}
            onChange={(e) => handleConfigChange('customCSS', e.target.value)}
            placeholder="/* הכנס כאן CSS מותאם אישית */
.custom-button {
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
}"
            variant="outlined"
            sx={{ 
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace'
              }
            }}
          />
        </TabPanel>

        {/* Advanced Settings Tab */}
        <TabPanel value={activeTab} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                הגדרות מתקדמות
              </Typography>
            </Grid>
            
            {/* SEO Settings */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🔍 אופטימיזציה למנועי חיפוש (SEO)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="כותרת SEO"
                      value={config.siteName}
                      onChange={(e) => handleConfigChange('siteName', e.target.value)}
                      margin="normal"
                      variant="outlined"
                      helperText="כותרת שתופיע בתוצאות החיפוש של גוגל"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="תיאור SEO"
                      value={config.tagline}
                      onChange={(e) => handleConfigChange('tagline', e.target.value)}
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={2}
                      helperText="תיאור קצר שיופיע בתוצאות החיפוש"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Analytics */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📊 אנליטיקה ומעקב
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    בקרוב: אינטגרציה עם Google Analytics ו-Facebook Pixel לניטור ביצועי האתר
                  </Typography>
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Google Analytics ID"
                      placeholder="G-XXXXXXXXXX"
                      margin="normal"
                      variant="outlined"
                      disabled
                      helperText="מזהה Google Analytics (בקרוב)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Facebook Pixel ID"
                      placeholder="1234567890123456"
                      margin="normal"
                      variant="outlined"
                      disabled
                      helperText="מזהה Facebook Pixel (בקרוב)"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Domain & SSL */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🔒 אבטחה ודומיין
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip 
                        label="SSL מופעל" 
                        color="success" 
                        icon={<span>🔒</span>}
                      />
                      <Typography variant="body2" color="text.secondary">
                        האתר שלך מאובטח עם הצפנת SSL
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip 
                        label="גיבוי יומי" 
                        color="primary" 
                        icon={<span>💾</span>}
                      />
                      <Typography variant="body2" color="text.secondary">
                        האתר מגובה באופן יומי
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {config.useCustomDomain && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>שימוש בדומיין מותאם:</strong> תצטרך להפנות את הדומיין שלך לשרתים שלנו. 
                      נשלח לך הוראות מפורטות לאחר הפרסום.
                    </Typography>
                  </Alert>
                )}
              </Card>
            </Grid>

            {/* Performance */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚡ ביצועים
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                        98
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ציון ביצועים
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                        &lt;2s
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        זמן טעינה
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                        99.9%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        זמינות
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            minHeight: '90vh',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6">
            תצוגה מקדימה - {config.siteName}
          </Typography>
          <Button 
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
          >
            סגור
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <PreviewWebsite />
        </DialogContent>
      </Dialog>

      {/* Color Picker Dialog */}
      <Dialog 
        open={colorPickerOpen} 
        onClose={() => setColorPickerOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>
          בחר צבע
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <HexColorPicker
              color={
                colorPickerType === 'primary' ? config.primaryColor :
                colorPickerType === 'secondary' ? config.secondaryColor :
                colorPickerType === 'background' ? config.backgroundColor :
                config.textColor
              }
              onChange={handleColorChange}
            />
            <TextField
              fullWidth
              label="קוד צבע"
              value={
                colorPickerType === 'primary' ? config.primaryColor :
                colorPickerType === 'secondary' ? config.secondaryColor :
                colorPickerType === 'background' ? config.backgroundColor :
                config.textColor
              }
              onChange={(e) => handleColorChange(e.target.value)}
              margin="normal"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorPickerOpen(false)}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Preview */}
      <Tooltip title="תצוגה מקדימה מהירה">
        <Fab
          color="primary"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            zIndex: 1000
          }}
          onClick={() => setPreviewOpen(true)}
        >
          <PreviewIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default WebsiteBuilder;
