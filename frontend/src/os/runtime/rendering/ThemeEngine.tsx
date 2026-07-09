// Theme Engine
// Generation III Runtime

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';

interface ThemeContextValue {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'SYSTEM', setMode: () => {} });

export const ThemeEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('SYSTEM');

    useEffect(() => {
        const root = document.documentElement;
        if (mode === 'DARK' || (mode === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
