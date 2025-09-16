import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Star, Camera, Paperclip } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const AssignmentCenter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const uploadIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { t } = useI18n();

  const assignments = [
    {
      id: 1,
      title: 'Desert Ecosystem Research Report',
      subject: 'Environmental Science',
      submittedDate: '2024-01-15',
      dueDate: '2024-01-25',
      status: 'graded',
      grade: 'A',
      aiScore: 92,
      feedback: 'Excellent work! Your research shows a deep understanding of desert ecosystems. The report is thorough and well-structured.',
      instructor: 'Dr. Priya Sharma'
    },
    {
      id: 2,
      title: 'Water Conservation Action Plan',
      subject: 'Environmental Science',
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
      title: 'Local Biodiversity Survey',
      subject: 'Environmental Science',
      submittedDate: null,
      dueDate: '2024-01-30',
      status: 'pending',
      grade: null,
      aiScore: null,
      feedback: null,
      instructor: 'Dr. Priya Sharma'
    }
  ];

  // Helper: clear any existing simulated upload interval
  const clearUploadInterval = () => {
    if (uploadIntervalRef.current !== null) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
  };

  // Simulate file upload with progress (keeps original behavior but tied to an actual File)
  const simulateUploadForFile = (file: File | null) => {
    clearUploadInterval();
    setIsUploading(true);
    setUploadProgress(0);

    // show file name if provided
    if (file) {
      setSelectedFileName(file.name);
    }

    uploadIntervalRef.current = window.setInterval(() => {
      setUploadProgress(prev => {
        // make progress speed slightly related to size (bigger file => slightly slower increments)
        const sizeFactor = file ? Math.min(4, Math.max(1, file.size / (1024 * 1024))) : 1; // 1..4
        const increment = Math.random() * (12 / sizeFactor) + 6; // dynamic increment

        const next = prev + increment;
        if (next >= 100) {
          clearUploadInterval();
          setUploadProgress(100);
          setIsUploading(false);
          // reset file input so same file can be chosen again later
          if (fileInputRef.current) fileInputRef.current.value = '';
          setTimeout(() => {
            alert('Assignment uploaded successfully! AI review has started.');
            // Optionally, you could also update assignments state here to mark pending submission, etc.
          }, 400);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  // existing simulateUpload preserved for "Take Photo" button (no file)
  const simulateUpload = () => {
    // clear selected file name when simulated camera upload used
    setSelectedFileName(null);
    simulateUploadForFile(null);
  };

  // handle file input change (browse)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // validate file type + size (max 10MB)
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      alert('Unsupported file type. Allowed: PDF, DOC, DOCX, JPG, PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > maxSize) {
      alert('File too large. Maximum allowed size is 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    simulateUploadForFile(file);
  };

  // trigger native file picker when "Browse Files" clicked
  const handleBrowseClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
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

    const dt = e.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) {
      // no files -> fallback to original simulateUpload
      simulateUpload();
      return;
    }

    const file = dt.files[0];

    // same validation as browse
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      alert('Unsupported file type. Allowed: PDF, DOC, DOCX, JPG, PNG.');
      return;
    }
    if (file.size > maxSize) {
      alert('File too large. Maximum allowed size is 10MB.');
      return;
    }

    simulateUploadForFile(file);
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-0">
      {/* invisible/native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload Assignment */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center">
          <Upload className="mr-2" size={18} />
          {t('assignments.uploadFile')}
        </h2>

        <div
          className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all shadow-sm ${
            dragActive
              ? 'border-primary bg-accent'
              : 'border-border hover:border-muted-foreground'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="button"
          aria-label="Upload area"
        >
          <FileText className="mx-auto mb-3 sm:mb-4 text-muted-foreground" size={36} />
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
            {t('assignments.dropFile', 'Drop your assignment file here, or choose an option below')}
          </p>

          {/* show selected file name */}
          {selectedFileName && (
            <p className="text-xs sm:text-sm text-foreground mb-3 sm:mb-4">
              <strong>Selected:</strong> {selectedFileName}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button
              onClick={handleBrowseClick}
              disabled={isUploading}
              className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 font-medium flex items-center justify-center text-sm sm:text-base"
            >
              <Paperclip size={16} className="mr-2" />
              {isUploading ? t('common.uploading', 'Uploading...') : t('assignments.browseFiles', 'Browse Files')}
            </button>

            <button
              onClick={simulateUpload}
              disabled={isUploading}
              className="bg-chart-2 text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-chart-2/90 transition-all shadow-sm disabled:opacity-50 font-medium flex items-center justify-center text-sm sm:text-base"
            >
              <Camera size={16} className="mr-2" />
              {t('assignments.takePhoto')}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
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
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-chart-2/10 rounded-xl border border-chart-2/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <h3 className="text-sm sm:text-base font-medium text-card-foreground">{t('assignments.aiReview', 'AI Review System')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('assignments.instantFeedback', 'Get instant feedback and grading within minutes')}
              </p>
            </div>
            <div className="text-chart-2">
              <Star size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment History */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6">
          {t('assignments.mySubmissions')}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 sm:p-6 bg-muted rounded-xl border border-border hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedAssignment(selectedAssignment === assignment.id.toString() ? null : assignment.id.toString())}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-2">
                    <h4 className="font-medium text-card-foreground text-base sm:text-lg">{assignment.title}</h4>
                    {assignment.grade && (
                      <span className="w-fit sm:ml-3 px-3 py-1 bg-chart-2/10 text-chart-2 text-xs sm:text-sm font-medium rounded-full">
                        {t('assignments.grade')}: {assignment.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                    <span>{assignment.subject}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{t('assignments.dueDate')}: {assignment.dueDate}</span>
                    {assignment.submittedDate && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>{t('assignments.submissionDate')}: {assignment.submittedDate}</span>
                      </>
                    )}
                  </div>

                  {assignment.aiScore && (
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-muted-foreground min-w-[60px]">{t('assignments.aiScore', 'AI Score')}:</span>
                      <div className="flex items-center flex-1 max-w-[200px]">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-chart-2 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${assignment.aiScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-card-foreground ml-3 min-w-[45px]">
                          {assignment.aiScore}/100
                        </span>
                      </div>
                    </div>
                  )}

                  {assignment.feedback && selectedAssignment === assignment.id.toString() && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-chart-2/10 rounded-lg border-l-4 border-chart-2">
                      <p className="text-xs sm:text-sm text-card-foreground">
                        <strong>{t('assignments.feedback')}:</strong> {assignment.feedback}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('assignments.reviewedBy', 'Reviewed by')}: {assignment.instructor}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center sm:ml-4">
                  {getStatusIcon(assignment.status)}
                  <span className={`ml-2 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full shadow-sm ${getStatusColor(assignment.status)}`}>
                    {getStatusText(assignment.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Better Submissions */}
      <div className="bg-chart-2/5 rounded-xl border border-chart-2/20 p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-2 sm:mb-3">💡 {t('assignments.submissionTips', 'Tips for Better Submissions')}</h3>
        <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
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
