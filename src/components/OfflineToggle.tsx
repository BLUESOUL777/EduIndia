import React, { useState, useEffect } from 'react';
import { WifiOff, SignalHigh } from 'lucide-react';
import { mockService } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';

const OfflineToggle: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Load offline mode from localStorage
    const offlineMode = localStorage.getItem('offlineMode') === 'true';
    setIsOffline(offlineMode);
    mockService.simulateOffline(offlineMode);
  }, []);

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline;
    setIsOffline(newOfflineMode);
    mockService.simulateOffline(newOfflineMode);
    localStorage.setItem('offlineMode', newOfflineMode.toString());
    
    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <button
        onClick={toggleOfflineMode}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
          isOffline
            ? 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20'
            : 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20'
        }`}
        title={isOffline ? t('offline.modeEnabled') : t('offline.modeDisabled')}
        aria-label={isOffline ? 'Currently offline' : 'Currently online'}
      >
        {isOffline ? <WifiOff size={16} /> : <SignalHigh size={16} />}
        <span className="hidden sm:inline">
          {isOffline ? t('common.offline') : t('common.online')}
        </span>
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-white border border-border rounded-lg shadow-xl p-4 max-w-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            {isOffline ? (
              <WifiOff className="text-destructive" size={20} />
            ) : (
              <SignalHigh className="text-chart-2" size={20} />
            )}
            <div>
              <p className="font-medium text-card-foreground">
                {isOffline ? t('offline.modeEnabled') : t('offline.modeDisabled')}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOffline 
                  ? t('offline.workingOffline')
                  : t('offline.connectToSync')
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineToggle;