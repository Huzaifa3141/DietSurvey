import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SurveyForm from './pages/SurveyForm';
import AdminPage from './pages/AdminPage';
import { Moon, Sun } from 'lucide-react';

// Theme context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

function App() {
  const [currentPage, setCurrentPage] = useState<'survey' | 'admin'>('survey');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Navigation */}
        <nav className={`shadow-sm border-b transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  🍽️ Diet Survey
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-yellow-400 hover:bg-gray-700 hover:text-yellow-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Navigation Buttons */}
                <button
                  onClick={() => setCurrentPage('survey')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === 'survey'
                      ? theme === 'dark'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📝 Take Survey
                </button>
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === 'admin'
                      ? theme === 'dark'
                        ? 'bg-green-900 text-green-100'
                        : 'bg-green-100 text-green-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📊 Admin View
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {currentPage === 'survey' ? <SurveyForm /> : <AdminPage />}
        </main>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#363636',
              color: theme === 'dark' ? '#ffffff' : '#fff',
              border: theme === 'dark' ? '1px solid #374151' : 'none',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
