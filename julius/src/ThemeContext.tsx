import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Constantes de cores
const primaryGreen = '#0e6a5d';
const primaryGreenLight = '#1c9684';
const darkBg = '#041c19';
const darkPaper = '#0a3a33'; // verde mais claro para as caixas no tema escuro
const neonGreenAccent = '#00e676'; // verde brilhante

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

export const ColorModeContext = createContext<ColorModeContextType>({ toggleColorMode: () => {}, mode: 'light' });

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Tenta recuperar a preferência salva no localStorage
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as 'light' | 'dark') || 'light';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const nextMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', nextMode);
                    return nextMode;
                });
            },
            mode,
        }),
        [mode],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === 'light' ? primaryGreen : primaryGreenLight,
                    },
                    secondary: {
                        main: neonGreenAccent,
                    },
                    background: {
                        default: mode === 'light' ? '#f0f2f5' : darkBg,
                        paper: mode === 'light' ? '#ffffff' : darkPaper,
                    },
                },
                typography: {
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: () => ({
                                overflow: 'visible',
                                ...(mode === 'dark' && {
                                    borderColor: 'rgba(0, 230, 118, 0.4)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                }),
                            }),
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? primaryGreen : darkPaper,
                                backgroundImage: mode === 'dark' ? 'none' : 'none',
                                ...(mode === 'dark' && {
                                    borderBottom: '1px solid rgba(28, 150, 132, 0.2)',
                                }),
                            }
                        }
                    }
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
