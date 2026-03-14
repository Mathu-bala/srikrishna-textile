import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getPreferences, updatePreferences, getSettings, updateSettings } from '@/services/api';

type ThemeMode = 'dark' | 'light';
type ThemeColor = 'purple' | 'blue' | 'green' | 'pink' | 'orange';

interface ThemeContextType {
    mode: ThemeMode;
    theme: ThemeColor;
    setMode: (mode: ThemeMode) => void;
    setTheme: (theme: ThemeColor) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [mode, setModeState] = useState<ThemeMode>('dark');
    const [theme, setThemeState] = useState<ThemeColor>('purple');

    // Load initial preferences
    useEffect(() => {
        const loadPreferences = async () => {
            // 1. Check LocalStorage first for instant load
            const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
            const savedTheme = localStorage.getItem('theme-color') as ThemeColor;

            if (savedMode) setModeState(savedMode);
            if (savedTheme) setThemeState(savedTheme);

            // 2. Fetch Global Settings (Theme Color) - Applies to everyone
            try {
                const settings = await getSettings();
                if (settings.themeColor) {
                    setThemeState(settings.themeColor as ThemeColor);
                    localStorage.setItem('theme-color', settings.themeColor);
                }
            } catch (err) {
                console.error('Failed to fetch global settings', err);
            }

            // 3. If authenticated, fetch user's personal mode preference
            if (isAuthenticated) {
                try {
                    const prefs = await getPreferences();
                    if (prefs.mode) {
                        setModeState(prefs.mode);
                        localStorage.setItem('theme-mode', prefs.mode);
                    }
                } catch (err) {
                    console.error('Failed to load DB preferences', err);
                }
            }
        };

        loadPreferences();
    }, [isAuthenticated]);

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old classes
        root.classList.remove('dark', 'light');
        root.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-pink', 'theme-orange');

        // Add new ones
        root.classList.add(mode);
        root.classList.add(`theme-${theme}`);

        // Style body transition
        root.style.transition = 'all 0.5s ease-in-out';
    }, [mode, theme]);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
        if (isAuthenticated) {
            try {
                await updatePreferences({ mode: newMode });
            } catch (err) {
                console.error('Failed to sync mode to DB', err);
            }
        }
    };

    const setTheme = async (newTheme: ThemeColor) => {
        // Update local state immediately for UI responsiveness
        setThemeState(newTheme);
        localStorage.setItem('theme-color', newTheme);
        
        // Only Admins can update the global theme
        if (user?.isAdmin) {
            try {
                await updateSettings({ themeColor: newTheme });
            } catch (err) {
                console.error('Failed to update global theme', err);
            }
        }
    };

    const toggleMode = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ mode, theme, setMode, setTheme, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
