import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Star, Camera, Paperclip } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const AssignmentCenter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { t } = useI18n();

  const assignments = [
    {
      id: 1,
      title: 'React Hooks Implementation',
      subject: 'Web Development',
      submittedDate: '2024-01-15',
      dueDate: '2024-01-25',
      status: 'graded',
      grade: 'A',
      aiScore: 92,
      feedback: 'Excellent work! Your implementation shows a deep understanding of React hooks. The code is clean and well-structured.',
      instructor: 'Dr. Priya Sharma'
    },
    {
      id: 2,
      title: 'Component Design Patterns',
      subject: 'Web Development',
      submittedDate: '2024-01-16',
      dueDate: '2024-01-28',
      status: 'reviewing',
      grade: null,
      aiScore: null,
      feedback: null,
      instructor: 'Dr. Priya Sharma'
    },
    {
      id: 3,
      title: 'State Management Analysis',
      subject: 'Web Development',
      submittedDate: null,
      dueDate: '2024-01-30',
      status: 'pending',
      grade: null,
      aiScore: null,
      feedback: null,
      instructor: 'Dr. Priya Sharma'
    }
  ];

  // Simulate file upload with progress
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTimeout(() => {
            alert('Assignment uploaded successfully! AI review has started.');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    simulateUpload();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'reviewing':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'graded':
        return 'Completed';
      case 'reviewing':
        return 'AI Reviewing...';
      default:
        return 'Not Submitted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'text-chart-2 bg-chart-2/10';
      case 'reviewing':
        return 'text-chart-1 bg-chart-1/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upload Assignment */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground mb-6 flex items-center">
          <Upload className="mr-2" size={20} />
          {t('assignments.uploadFile')}
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all shadow-sm ${
            dragActive
              ? 'border-primary bg-accent'
              : 'border-border hover:border-muted-foreground'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground mb-4">
            {t('assignments.dropFile', 'Drop your assignment file here, or choose an option below')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={simulateUpload}
              disabled={isUploading}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 font-medium flex items-center justify-center"
            >
              <Paperclip size={16} className="mr-2" />
              {isUploading ? t('common.uploading', 'Uploading...') : t('assignments.browseFiles', 'Browse Files')}
            </button>
            
            <button 
              onClick={simulateUpload}
              disabled={isUploading}
              className="bg-chart-2 text-primary-foreground px-6 py-3 rounded-lg hover:bg-chart-2/90 transition-all shadow-sm disabled:opacity-50 font-medium flex items-center justify-center"
            >
              <Camera size={16} className="mr-2" />
              {t('assignments.takePhoto')}
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            {t('assignments.supportedFormats', 'Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB)')}
          </p>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('common.uploading')} {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>

        {/* AI Review Status */}
        <div className="mt-6 p-4 bg-chart-2/10 rounded-xl border border-chart-2/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground">{t('assignments.aiReview', 'AI Review System')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('assignments.instantFeedback', 'Get instant feedback and grading within minutes')}
              </p>
            </div>
            <div className="text-chart-2">
              <Star size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment History */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">
          {t('assignments.mySubmissions')}
        </h3>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="p-6 bg-muted rounded-xl border border-border hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedAssignment(selectedAssignment === assignment.id.toString() ? null : assignment.id.toString())}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-card-foreground text-lg">{assignment.title}</h4>
                    {assignment.grade && (
                      <span className="ml-3 px-3 py-1 bg-chart-2/10 text-chart-2 text-sm font-medium rounded-full">
                        {t('assignments.grade')}: {assignment.grade}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>{assignment.subject}</span>
                    <span>•</span>
                    <span>{t('assignments.dueDate')}: {assignment.dueDate}</span>
                    {assignment.submittedDate && (
                      <>
                        <span>•</span>
                        <span>{t('assignments.submissionDate')}: {assignment.submittedDate}</span>
                      </>
                    )}
                  </div>
                  
                  {assignment.aiScore && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-muted-foreground mr-3">{t('assignments.aiScore', 'AI Score')}:</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-muted rounded-full h-2 mr-3">
                          <div
                            className="bg-chart-2 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${assignment.aiScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-card-foreground">
                          {assignment.aiScore}/100
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {assignment.feedback && selectedAssignment === assignment.id.toString() && (
                    <div className="mt-4 p-4 bg-chart-2/10 rounded-lg border-l-4 border-chart-2">
                      <p className="text-sm text-card-foreground">
                        <strong>{t('assignments.feedback')}:</strong> {assignment.feedback}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('assignments.reviewedBy', 'Reviewed by')}: {assignment.instructor}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center ml-4">
                  {getStatusIcon(assignment.status)}
                  <span className={`ml-2 text-sm font-medium px-3 py-1 rounded-full shadow-sm ${getStatusColor(assignment.status)}`}>
                    {getStatusText(assignment.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Better Submissions */}
      <div className="bg-chart-2/5 rounded-xl border border-chart-2/20 p-6 shadow-sm">
        <h3 className="font-semibold text-card-foreground mb-3">💡 {t('assignments.submissionTips', 'Tips for Better Submissions')}</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• {t('assignments.tip1', 'Take clear, well-lit photos of handwritten work')}</li>
          <li>• {t('assignments.tip2', 'Ensure all text is readable and properly oriented')}</li>
          <li>• {t('assignments.tip3', 'Include your name and assignment title')}</li>
          <li>• {t('assignments.tip4', 'Submit before the deadline for best results')}</li>
          <li>• {t('assignments.tip5', 'Use PDF format for typed assignments')}</li>
        </ul>
      </div>
    </div>
  );
};

export default AssignmentCenter;