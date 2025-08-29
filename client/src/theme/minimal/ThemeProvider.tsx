import type { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from './createTheme';
import { Rtl } from './rtl';

export function ThemeProvider({ children }: Readonly<PropsWithChildren>) {
  const theme = createTheme();
  return (
    <MuiThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      <Rtl direction="rtl">{children}</Rtl>
    </MuiThemeProvider>
  );
}


