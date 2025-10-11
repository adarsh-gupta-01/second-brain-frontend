import React, { useEffect, useState } from 'react';
import { ThemeContext } from './useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Start with light mode

  useEffect(() => {
    // Initialize from localStorage after component mounts
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        const savedValue = JSON.parse(saved);
        setIsDarkMode(savedValue);
        return;
      }
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
    }
    
    // If no saved value, use system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPreference);
  }, []);

  useEffect(() => {
    console.log('🎨 Theme changed to:', isDarkMode ? 'DARK' : 'LIGHT');
    
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      console.log('✅ Added "dark" class to html element');
    } else {
      htmlElement.classList.remove('dark');
      console.log('✅ Removed "dark" class from html element');
    }
    
    console.log('📋 Current html classes:', htmlElement.className);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('🔄 Toggle clicked! Current mode:', isDarkMode ? 'DARK' : 'LIGHT');
    setIsDarkMode(prev => {
      const newValue = !prev;
      console.log('🔄 Changing to:', newValue ? 'DARK' : 'LIGHT');
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};