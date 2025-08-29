import { createTheme as createMuiTheme } from '@mui/material/styles';
import type { ThemeOptions, Direction } from '@mui/material/styles';
import { themeConfig } from './theme-config';

export function createTheme(themeOverrides: ThemeOptions = {}) {
  const base: ThemeOptions = {
    direction: themeConfig.direction as Direction,
    typography: {
      fontFamily: themeConfig.fontFamily.primary,
    },
    palette: {
      primary: themeConfig.palette.primary,
      secondary: themeConfig.palette.secondary,
      info: themeConfig.palette.info,
      success: themeConfig.palette.success,
      warning: themeConfig.palette.warning,
      error: themeConfig.palette.error,
      common: themeConfig.palette.common,
      grey: themeConfig.palette.grey as any,
      background: { default: '#FFFFFF', paper: '#FFFFFF' },
      text: { primary: '#1C252E', secondary: '#637381' },
    },
    shape: { borderRadius: 8 },
  };

  return createMuiTheme(base, themeOverrides);
}


