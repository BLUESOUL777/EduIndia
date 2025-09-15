import React, { useState } from 'react';
import { User, Settings, Award, BarChart3, Bell, LogOut, Edit, Save, X, Camera, Shield, Globe } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    location: 'Rural Maharashtra, India',
    bio: 'Passionate learner interested in web development and technology.',
    notifications: true,
    lowBandwidth: true
  });
  const { t } = useI18n();
  const { language, setLanguage, availableLanguages } = useLanguage();

  const achievements = [
    { id: 1, title: 'First Assignment', description: 'Completed your first assignment', earned: true, icon: '🎯' },
    { id: 2, title: 'Perfect Score', description: 'Achieved 100% on an assignment', earned: true, icon: '🏆' },
    { id: 3, title: 'Consistent Learner', description: 'Completed 7 days in a row', earned: false, icon: '🔥' },
    { id: 4, title: 'Question Master', description: 'Asked 50 questions in AI chat', earned: true, icon: '❓' },
  ];

  const stats = [
    { label: 'Lessons Completed', value: '24', color: 'text-blue-600' },
    { label: 'Assignments Submitted', value: '18', color: 'text-green-600' },
    { label: 'Average Score', value: '88%', color: 'text-purple-600' },
    { label: 'Learning Streak', value: '12 days', color: 'text-orange-600' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="text-white" size={32} />
              </div>
              <button className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-full hover:bg-orange-600 transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div className="ml-6 flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-semibold bg-transparent border-b border-input text-card-foreground focus:outline-none focus:border-primary"
                  />
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={2}
                    className="w-full text-sm bg-transparent border border-input rounded-lg p-2 text-muted-foreground focus:outline-none focus:border-primary resize-none"
                    placeholder={t('profile.tellAbout', 'Tell us about yourself...')}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{profile.name}</h2>
                  <p className="text-muted-foreground">{t('profile.studentRole', 'Computer Science Student')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('common.email', 'Email')}</label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <p className="text-card-foreground">{profile.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('common.phone', 'Phone')}</label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <p className="text-card-foreground">{profile.phone}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('common.location', 'Location')}</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <p className="text-card-foreground">{profile.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Award className="mr-2 text-primary" size={20} />
          {t('dashboard.achievements')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`flex items-center p-4 rounded-lg transition-all ${
              achievement.earned 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700' 
                : 'bg-gray-50 dark:bg-gray-900 opacity-60'
            }`}>
              <div className="text-2xl mr-3">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${
                  achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
              {achievement.earned && (
                <div className="text-yellow-500">
                  <Award size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Settings className="mr-2 text-primary" size={20} />
          {t('profile.preferences', 'Preferences')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-card-foreground flex items-center">
                <Globe className="mr-2" size={16} />
                {t('profile.language', 'Language')}
              </h4>
              <p className="text-sm text-muted-foreground">{t('profile.chooseLanguage', 'Choose your preferred language')}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-card-foreground flex items-center">
                <Bell className="mr-2" size={16} />
                {t('profile.notifications', 'Notifications')}
              </h4>
              <p className="text-sm text-muted-foreground">{t('profile.receiveUpdates', 'Receive updates about assignments and classes')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifications}
                onChange={(e) => setProfile(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-card-foreground flex items-center">
                <Shield className="mr-2" size={16} />
                {t('profile.lowBandwidth', 'Low Bandwidth Mode')}
              </h4>
              <p className="text-sm text-muted-foreground">{t('profile.optimizeConnection', 'Optimize for slower internet connections')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.lowBandwidth}
                onChange={(e) => setProfile(prev => ({ ...prev, lowBandwidth: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Settings className="mr-2 text-primary" size={20} />
          {t('profile.quickActions', 'Quick Actions')}
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center p-3 text-left hover:bg-muted rounded-lg transition-colors">
            <BarChart3 className="mr-3 text-muted-foreground" size={20} />
            <span className="text-card-foreground">{t('profile.viewProgress', 'View Progress Report')}</span>
          </button>
          <button className="w-full flex items-center p-3 text-left hover:bg-muted rounded-lg transition-colors">
            <Bell className="mr-3 text-muted-foreground" size={20} />
            <span className="text-card-foreground">{t('profile.notificationSettings', 'Notification Settings')}</span>
          </button>
          <button className="w-full flex items-center p-3 text-left hover:bg-muted rounded-lg transition-colors">
            <Settings className="mr-3 text-muted-foreground" size={20} />
            <span className="text-card-foreground">{t('profile.accountSettings', 'Account Settings')}</span>
          </button>
          <button className="w-full flex items-center p-3 text-left hover:bg-muted rounded-lg transition-colors text-destructive">
            <LogOut className="mr-3" size={20} />
            <span>{t('profile.signOut', 'Sign Out')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;