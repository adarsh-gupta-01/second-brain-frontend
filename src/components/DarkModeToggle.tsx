import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/useTheme';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  console.log('🔘 DarkModeToggle rendered, isDarkMode:', isDarkMode);

  const handleClick = () => {
    console.log('🖱️ Button clicked!');
    toggleDarkMode();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative p-2 rounded-xl transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300 shadow-lg hover:shadow-blue-500/20 border border-gray-600 hover:border-blue-500' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg hover:shadow-blue-200/40 border border-gray-200 hover:border-blue-300'
        }
        transform hover:scale-105 active:scale-95
      `}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
            isDarkMode 
              ? 'opacity-0 rotate-180 scale-75' 
              : 'opacity-100 rotate-0 scale-100'
          }`} 
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-75'
          }`} 
        />
      </div>
      
      {/* Active indicator */}
      <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
        isDarkMode ? 'bg-yellow-400' : 'bg-blue-500'
      }`} />
    </button>
  );
};