import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1800ad',
            light: '#3d2bbd',
            dark: '#11007a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ffd966',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
        },
        error: {
            main: '#d32f2f',
        },
    },
    typography: {
        fontFamily: 'var(--font-figtree), "Arial", "Helvetica", "sans-serif"',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                },
                containedPrimary: {
                    background: 'linear-gradient(90deg, #1800ad 0%, #3d2bbd 100%)',
                    color: '#ffffff',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #11007a 0%, #1800ad 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: 14,
                    border: '1px solid #eeeeee',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #eeeeee',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
    },
});

export default theme;
