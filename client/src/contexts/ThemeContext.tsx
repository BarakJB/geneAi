import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme interface
export interface Theme {
  mode: 'dark' | 'light';
  colors: {
    // Background colors
    primary: string;
    secondary: string;
    surface: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Border and divider colors
    border: string;
    divider: string;
    
    // Interactive colors
    accent: string;
    accentHover: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Component specific colors
    cardBackground: string;
    sidebarBackground: string;
    headerBackground: string;
    inputBackground: string;
    
    // Shadows
    shadow: string;
    shadowHover: string;
  };
}

// Dark theme
const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // Background colors
    primary: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    secondary: 'rgba(10, 10, 16, 0.95)',
    surface: '#222',
    
    // Text colors
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    
    // Border and divider colors
    border: 'rgba(255, 255, 255, 0.15)',
    divider: 'rgba(255, 255, 255, 0.1)',
    
    // Interactive colors
    accent: '#2196F3',
    accentHover: '#1976D2',
    
    // Status colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Component specific colors
    cardBackground: 'rgba(0, 0, 0, 0.4)',
    sidebarBackground: 'rgba(10, 10, 16, 0.95)',
    headerBackground: 'rgba(10, 10, 16, 0.95)',
    inputBackground: '#333',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.5)',
  }
};

// Light theme
const lightTheme: Theme = {
  mode: 'light',
  colors: {
    // Background colors
    primary: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    secondary: '#ffffff',
    surface: '#f1f3f4',
    
    // Text colors
    text: '#212529',
    textSecondary: '#495057',
    textMuted: '#6c757d',
    
    // Border and divider colors
    border: '#dee2e6',
    divider: '#e9ecef',
    
    // Interactive colors
    accent: '#007bff',
    accentHover: '#0056b3',
    
    // Status colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    
    // Component specific colors
    cardBackground: '#ffffff',
    sidebarBackground: '#ffffff',
    headerBackground: '#ffffff',
    inputBackground: '#ffffff',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
  }
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('agentsCalculator-theme') as 'dark' | 'light';
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('agentsCalculator-theme', currentTheme);
    
    // Update document class for CSS variables
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Get current theme object
    const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
    
    // Update CSS Variables
    updateCSSVariables(theme);
    
    // Update body background
    document.body.style.background = currentTheme === 'dark' 
      ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
      
    // Update body text color to ensure it's correct
    document.body.style.color = theme.colors.text;
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (mode: 'dark' | 'light') => {
    setCurrentTheme(mode);
  };

  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const value: ThemeContextType = React.useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// CSS Variables helper
export const updateCSSVariables = (theme: Theme) => {
  const root = document.documentElement;
  
  // Set CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-divider', theme.colors.divider);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-accent-hover', theme.colors.accentHover);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-info', theme.colors.info);
  root.style.setProperty('--color-card-bg', theme.colors.cardBackground);
  root.style.setProperty('--color-sidebar-bg', theme.colors.sidebarBackground);
  root.style.setProperty('--color-header-bg', theme.colors.headerBackground);
  root.style.setProperty('--color-input-bg', theme.colors.inputBackground);
  root.style.setProperty('--shadow', theme.colors.shadow);
  root.style.setProperty('--shadow-hover', theme.colors.shadowHover);
};

// Higher-order component for theme injection
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} />;
  };
};
