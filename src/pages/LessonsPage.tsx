import React, { useState, useEffect } from 'react';
import { Play, Download, Clock, Search, Filter, CheckCircle, Wifi, WifiOff, BookOpen, Headphones } from 'lucide-react';
import { mockService, Lesson, Course } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';
import LessonPlayer from '../components/LessonPlayer';

interface LessonsPageProps {
  isOnline?: boolean;
}

const LessonsPage: React.FC<LessonsPageProps> = ({ isOnline = true }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [bandwidthMode, setBandwidthMode] = useState<'high' | 'low'>('low');
  const [downloadingLesson, setDownloadingLesson] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [lessonsData, coursesData] = await Promise.all([
          mockService.getLessons(),
          mockService.getCourses()
        ]);
        setLessons(lessonsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const subjects = [
    'all',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Computer Science',
    'Environmental Science',
    'Literature'
  ];

  const filteredAndGroupedLessons = lessons.reduce((acc: { [key: string]: Lesson[] }, lesson) => {
    const course = courses.find(c => c.id === lesson.courseId);
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.titleHi.includes(searchTerm) ||
                         lesson.titleMar.includes(searchTerm);
    const matchesSubject = selectedSubject === 'all' || course?.category === selectedSubject;

    if (matchesSearch && matchesSubject) {
      if (!acc[lesson.courseId]) {
        acc[lesson.courseId] = [];
      }
      acc[lesson.courseId].push(lesson);
    }
    return acc;
  }, {});

  // Simulate download with progress
  const simulateDownload = (lessonId: string) => {
    setDownloadingLesson(lessonId);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingLesson(null);
          // Update lesson as downloaded
          setLessons(prevLessons => 
            prevLessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, downloaded: true } : lesson
            )
          );
          setTimeout(() => {
            alert('Lesson downloaded successfully!');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 250);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show lesson player if a lesson is selected
  if (selectedLesson) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {t('common.back', 'Back to Lessons')}
          </button>
        </div>
        <LessonPlayer 
          lesson={selectedLesson}
          onProgressUpdate={(progress, watchTime) => {
            mockService.updateLessonProgress(selectedLesson.id, progress, watchTime);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground flex items-center">
              <BookOpen className="mr-2 text-primary" size={24} />
              {t('lessons.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {Object.values(filteredAndGroupedLessons).reduce((total, courseLessons) => total + courseLessons.length, 0)} {t('lessons.available', 'lessons available')}
            </p>
          </div>
          
          {/* Bandwidth Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{t('lessons.quality', 'Quality')}:</span>
            <button
              onClick={() => setBandwidthMode(prev => prev === 'low' ? 'high' : 'low')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                bandwidthMode === 'low'
                  ? 'bg-chart-2 text-primary-foreground'
                  : 'bg-chart-1 text-primary-foreground'
              }`}
            >
              {bandwidthMode === 'low' ? (
                <>
                  <Headphones size={14} className="mr-1" />
                  {t('lessons.dataSaver', 'Data Saver')}
                </>
              ) : (
                <>
                  🎥 {t('lessons.highQuality', 'High Quality')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={t('lessons.searchLessons', 'Search lessons...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-muted-foreground" size={18} />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-black"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? t('lessons.allSubjects', 'All Subjects') : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!isOnline && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <div className="flex items-center">
            <WifiOff className="text-destructive mr-3" size={20} />
            <div>
              <p className="font-medium text-card-foreground">{t('offline.modeEnabled')}</p>
              <p className="text-sm text-muted-foreground">
                {t('offline.workingOffline')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Network Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <div className="flex items-center">
            <WifiOff className="text-destructive mr-3" size={20} />
            <div>
              <p className="font-medium text-card-foreground">{t('lessons.networkError', 'Network Error')}</p>
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
            </div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                const loadLessons = async () => {
                  try {
                    const lessonsData = await mockService.getLessons();
                    setLessons(lessonsData);
                  } catch (error) {
                    console.error('Failed to load lessons:', error);
                    setError(error instanceof Error ? error.message : 'Failed to load lessons');
                  } finally {
                    setLoading(false);
                  }
                };
                loadLessons();
              }}
              className="ml-auto px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
            >
              {t('common.retry', 'Retry')}
            </button>
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      <div className="space-y-8">
        {Object.entries(filteredAndGroupedLessons).map(([courseId, courseLessons]) => {
          const course = courses.find(c => c.id === courseId);
          return (
            <div key={courseId}>
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                <BookOpen className="mr-2 text-primary" size={20} />
                {course?.title || 'Course'}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courseLessons.map((lesson: Lesson) => (
                    <div key={lesson.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay Icons */}
              <div className="absolute top-3 left-3 flex space-x-2">
                {lesson.completed && (
                  <span className="bg-chart-2 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    {t('lessons.completed')}
                  </span>
                )}
                {lesson.downloaded && (
                  <span className="bg-chart-1 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    {t('lessons.downloaded', 'Downloaded')}
                  </span>
                )}
              </div>
              
              <div className="absolute top-3 right-3">
                {isOnline ? (
                  <Wifi className="text-primary-foreground bg-primary/50 rounded-full p-1" size={24} />
                ) : (
                  <WifiOff className="text-destructive-foreground bg-destructive/80 rounded-full p-1" size={24} />
                )}
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-card/90 text-card-foreground rounded-full p-4 hover:bg-card transition-colors shadow-lg">
                  <Play size={24} />
                </button>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-primary/80 text-primary-foreground px-2 py-1 rounded text-xs">
                {lesson.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground text-lg mb-1 line-clamp-2">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {lesson.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {lesson.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {lesson.duration}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bandwidthMode === 'low' 
                      ? 'bg-chart-2/10 text-chart-2'
                      : 'bg-chart-1/10 text-chart-1'
                  }`}>
                    {bandwidthMode === 'low' ? lesson.estimatedSize2G : lesson.fileSize}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => setSelectedLesson(lesson)}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center"
                  disabled={!isOnline && !lesson.downloaded}
                >
                  <Play size={18} className="mr-2" />
                  {!isOnline && !lesson.downloaded ? t('common.offline') : t('lessons.playAudio')}
                </button>
                
                {!lesson.downloaded && isOnline && (
                  <button 
                    onClick={() => simulateDownload(lesson.id)}
                    disabled={downloadingLesson === lesson.id}
                    className="px-4 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all shadow-sm disabled:opacity-50"
                  >
                    {downloadingLesson === lesson.id ? (
                      <div className="w-5 h-5 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download size={18} />
                    )}
                  </button>
                )}
              </div>

              {/* Download Progress */}
              {downloadingLesson === lesson.id && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>{t('lessons.downloadProgress')}...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
      {Object.keys(filteredAndGroupedLessons).length === 0 && !error && (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">{t('lessons.noLessons', 'No lessons found')}</h3>
          <p className="text-muted-foreground">{t('lessons.adjustSearch', 'Try adjusting your search or filter criteria')}</p>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;