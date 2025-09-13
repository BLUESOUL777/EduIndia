import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, FileText, Image, Headphones } from 'lucide-react';
import { mockService, Lesson } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';

interface LessonPlayerProps {
  lesson: Lesson;
  onProgressUpdate?: (progress: number, watchTime: number) => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onProgressUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onProgressUpdate?.(100, audio.currentTime);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onProgressUpdate]);

  useEffect(() => {
    // Update slide based on current time
    if (lesson.slides && lesson.slides.length > 0) {
      const currentSlideIndex = lesson.slides.findIndex((slide, index) => {
        const slideTime = parseTimeToSeconds(slide.timestamp);
        const nextSlideTime = index < lesson.slides.length - 1 
          ? parseTimeToSeconds(lesson.slides[index + 1].timestamp)
          : duration;
        return currentTime >= slideTime && currentTime < nextSlideTime;
      });
      
      if (currentSlideIndex !== -1 && currentSlideIndex !== currentSlide) {
        setCurrentSlide(currentSlideIndex);
      }
    }
  }, [currentTime, lesson.slides, duration, currentSlide]);

  const parseTimeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const skipBackward = () => {
    seekTo(Math.max(0, currentTime - 10));
  };

  const skipForward = () => {
    seekTo(Math.min(duration, currentTime + 10));
  };

  const changePlaybackSpeed = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const jumpToSlide = (slideIndex: number) => {
    if (lesson.slides && lesson.slides[slideIndex]) {
      const slideTime = parseTimeToSeconds(lesson.slides[slideIndex].timestamp);
      seekTo(slideTime);
    }
  };

  const downloadLesson = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      await mockService.downloadLesson(lesson.id);
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        alert(t('lessons.downloadProgress') + ' complete!');
      }, 2000);
    } catch (error) {
      setIsDownloading(false);
      setDownloadProgress(0);
      alert('Download failed: ' + (error as Error).message);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={lesson.audioUrl}
        preload="metadata"
      />

      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-card-foreground mb-2 flex items-center">
              <Headphones className="mr-2 text-primary" size={24} />
              {lesson.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {lesson.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{lesson.duration}</span>
              <span>•</span>
              <span>{lesson.fileSize}</span>
              {!lesson.downloaded && (
                <>
                  <span>•</span>
                  <span className="text-green-600">{lesson.estimatedSize2G} {t('lessons.goodFor2G')}</span>
                </>
              )}
            </div>
          </div>
          
          {!lesson.downloaded && (
            <button
              onClick={downloadLesson}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Download size={16} />
              <span>{isDownloading ? `${Math.round(downloadProgress)}%` : t('common.download')}</span>
            </button>
          )}
        </div>

        {/* Download Progress */}
        {isDownloading && (
          <div className="mt-4">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Player Controls */}
      <div className="p-6 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div 
            className="w-full bg-secondary rounded-full h-2 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              seekTo(duration * percentage);
            }}
          >
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={skipBackward}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Skip back 10s"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={skipForward}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Skip forward 10s"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2 size={16} />
              <select 
                value={playbackSpeed}
                onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                className="text-sm bg-background border border-input rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                showTranscript 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <FileText size={14} />
              <span>{t('lessons.readTranscript')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slides Section */}
      {lesson.slides && lesson.slides.length > 0 && (
        <div className="border-t border-border p-6">
          <h3 className="font-medium text-card-foreground mb-4 flex items-center">
            <Image size={16} className="mr-2 text-primary" />
            {t('lessons.viewSlides')} ({lesson.slides.length})
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lesson.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => jumpToSlide(index)}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentSlide 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image size={24} className="text-muted-foreground" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play size={20} className="text-white" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-card-foreground truncate">
                    {slide.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {slide.timestamp}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Section */}
      {showTranscript && (
        <div className="border-t border-border p-6">
          <h3 className="font-medium text-card-foreground mb-4 flex items-center">
            <FileText size={16} className="mr-2 text-primary" />
            {t('lessons.readTranscript')}
          </h3>
          <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to this lesson on {lesson.title}. In this session, we'll cover the fundamental concepts 
              and practical applications. Let's start with the basics and build our understanding step by step.
              
              <br /><br />
              
              First, let's understand what we're trying to achieve. The main objectives of this lesson are to 
              provide you with a solid foundation and practical skills that you can apply immediately.
              
              <br /><br />
              
              As we progress through the slides, you'll notice how each concept builds upon the previous one. 
              This structured approach ensures that you develop a comprehensive understanding of the topic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlayer;