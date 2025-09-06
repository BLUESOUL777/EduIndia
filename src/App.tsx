import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import CulturalHeader from './components/CulturalHeader';
import CulturalNavigation from './components/CulturalNavigation';
import HomePage from './components/HomePage';
import LecturesPage from './components/LecturesPage';
import TeacherPanel from './components/TeacherPanel';
import AssignmentCenter from './components/AssignmentCenter';
import DiscussionPage from './components/DiscussionPage';
import ProfilePage from './components/ProfilePage';
import HowToUsePage from './components/HowToUsePage';
import CallSupportPage from './components/CallSupportPage';
import OfflineMode from './components/OfflineMode';
import CulturalChatbot from './components/CulturalChatbot';
import AnimatedLoader from './components/AnimatedLoader';


function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 2000); // show loader for 2 seconds
  return () => clearTimeout(timer);
}, []);


  // Simulate network connectivity changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate connectivity changes for demo purposes
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        setIsOnline(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (activeTab === 'support') {
      return <CallSupportPage />;
    }

    if (activeTab === 'tutorial') {
      return <HowToUsePage />;
    }

    if (activeTab === 'offline') {
      return <OfflineMode />;
    }

    if (userRole === 'teacher') {
      switch (activeTab) {
        case 'home':
          return <TeacherPanel />;
        case 'lectures':
          return <LecturesPage isOnline={isOnline} />;
        case 'assignments':
          return <AssignmentCenter />;
        case 'discussions':
          return <DiscussionPage />;
        case 'profile':
          return <ProfilePage />;
        default:
          return <TeacherPanel />;
      }
    } else {
      switch (activeTab) {
        case 'home':
          return <HomePage isOnline={isOnline} />;
        case 'lectures':
          return <LecturesPage isOnline={isOnline} />;
        case 'assignments':
          return <AssignmentCenter />;
        case 'discussions':
          return <DiscussionPage />;
        case 'profile':
          return <ProfilePage />;
        default:
          return <HomePage isOnline={isOnline} />;
      }
    }
  };

  return (
  <ThemeProvider>
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300 relative">
        
        {loading && <AnimatedLoader />} {/* Show loader when loading is true */}

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <CulturalHeader isOnline={isOnline} />
          
          {/* Demo Controls */}
          <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                <button
                  onClick={() => setUserRole('student')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userRole === 'student'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserRole('teacher')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userRole === 'teacher'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Teacher
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Network:</span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isOnline
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-red-500 text-white shadow-md'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('tutorial')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Tutorial
                </button>
                <button
                  onClick={() => setActiveTab('offline')}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Offline Mode
                </button>
              </div>
            </div>
          </div>

          <main className="p-4">
            {renderContent()}
          </main>

          <CulturalNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <CulturalChatbot />
        </div>
      </div>
    </LanguageProvider>
  </ThemeProvider>
);

}

export default App;
