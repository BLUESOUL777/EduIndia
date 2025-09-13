import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, ChevronRight, Upload, FileText, Radio, Presentation } from 'lucide-react';
import { mockService } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';

interface RecorderStubProps {
  onRecordingComplete?: (lessonId: string) => void;
}

const RecorderStub: React.FC<RecorderStubProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(5);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [hasRecording, setHasRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setHasRecording(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Using demo mode.');
      // Simulate recording for demo
      setIsRecording(true);
      setHasRecording(true);
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const publishLesson = async () => {
    if (!lessonTitle.trim()) {
      alert(t('teacher.lessonTitle') + ' is required');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Create a dummy audio blob for demo
      const audioBlob = audioChunksRef.current.length > 0 
        ? new Blob(audioChunksRef.current, { type: 'audio/webm' })
        : new Blob(['demo audio data'], { type: 'audio/webm' });

      const lessonId = await mockService.uploadRecording(
        lessonTitle,
        lessonDescription,
        audioBlob
      );

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        alert(t('teacher.publishLesson') + ' successful!');
        
        // Reset form
        setLessonTitle('');
        setLessonDescription('');
        setRecordingTime(0);
        setCurrentSlide(1);
        setHasRecording(false);
        
        onRecordingComplete?.(lessonId);
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground flex items-center">
          <Radio className="mr-2 text-primary" size={24} />
          {t('teacher.recordLesson')}
        </h2>
        <div className="text-sm text-muted-foreground">
          {formatTime(recordingTime)}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Mic size={20} />
            <span>{t('teacher.startRecording')}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={pauseRecording}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Square size={16} />
              <span>{t('teacher.stopRecording')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-medium">
            {isPaused ? 'Recording Paused' : 'Recording...'}
          </span>
        </div>
      )}

      {/* Slide Controls */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-foreground flex items-center">
            <Presentation className="mr-2 text-primary" size={16} />
            {t('teacher.slideControl', 'Slide Control')}
          </h3>
          <span className="text-sm text-muted-foreground">
            {currentSlide} / {totalSlides}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
            />
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide >= totalSlides || !isRecording}
            className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <span>{t('teacher.nextSlide')}</span>
            <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground">
          {t('teacher.currentSlide', 'Current')}: {t('teacher.slide', 'Slide')} {currentSlide} - "{t('teacher.introTo', 'Introduction to')} {lessonTitle || t('teacher.topic', 'Topic')}"
        </div>
      </div>

      {/* Lesson Details Form */}
      {hasRecording && (
        <div className="space-y-4 border-t border-border pt-6">
          <h3 className="font-medium text-card-foreground flex items-center">
            <FileText className="mr-2 text-primary" size={16} />
            {t('teacher.lessonDetails', 'Lesson Details')}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {t('teacher.lessonTitle')} *
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder={t('teacher.enterTitle', 'Enter lesson title')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {t('teacher.lessonDescription')}
            </label>
            <textarea
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder={t('teacher.briefDescription', 'Brief description of the lesson content')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {t('teacher.subject')}
            </label>
            <select className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
              <option>Web Development</option>
              <option>Computer Science</option>
              <option>Digital Marketing</option>
              <option>{t('teacher.basicComputer', 'Basic Computer Skills')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-card-foreground">{t('teacher.publishing', 'Publishing lesson...')}</span>
            <span className="text-muted-foreground">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Publish Button */}
      {hasRecording && !isUploading && (
        <button
          onClick={publishLesson}
          disabled={!lessonTitle.trim()}
          className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload size={20} />
          <span>{t('teacher.publishLesson')}</span>
        </button>
      )}

      {/* Recording Info */}
      <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
        <div className="flex items-start space-x-2">
          <FileText size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-card-foreground mb-1">{t('teacher.recordingTips', 'Recording Tips')}:</p>
            <ul className="space-y-1 text-xs">
              <li>• {t('teacher.tip1', 'Speak clearly and at a moderate pace')}</li>
              <li>• {t('teacher.tip2', 'Use the slide controls to sync with your presentation')}</li>
              <li>• {t('teacher.tip3', 'You can pause and resume recording as needed')}</li>
              <li>• {t('teacher.tip4', 'Ensure good audio quality for better student experience')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecorderStub;