// Mock service to simulate API calls with configurable latency and offline simulation
import coursesData from '../mock/courses.json';
import lessonsData from '../mock/lessons.json';
import assignmentsData from '../mock/assignments.json';
import studentsData from '../mock/students.json';
import accountsData from '../mock/accounts.json';

export interface Course {
  id: string;
  title: string;
  titleHi: string;
  titleMar: string;
  description: string;
  descriptionHi: string;
  descriptionMar: string;
  instructor: string;
  duration: string;
  level: string;
  enrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  category: string;
  rating: number;
  studentsEnrolled: number;
  lastAccessed: string | null;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleHi: string;
  titleMar: string;
  description: string;
  descriptionHi: string;
  descriptionMar: string;
  duration: string;
  audioUrl: string;
  slidesUrl: string;
  transcriptUrl: string;
  thumbnail: string;
  completed: boolean;
  downloaded: boolean;
  progress: number;
  fileSize: string;
  estimatedSize2G: string;
  slides: Array<{
    id: number;
    title: string;
    timestamp: string;
    thumbnail: string;
  }>;
  lastWatched: string | null;
  watchTime: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  titleHi: string;
  titleMar: string;
  description: string;
  descriptionHi: string;
  descriptionMar: string;
  dueDate: string;
  submissionDate: string | null;
  status: 'pending' | 'submitted' | 'graded';
  grade: string | null;
  score: number | null;
  maxScore: number;
  feedback: string | null;
  feedbackHi?: string;
  feedbackMar?: string;
  instructor: string;
  submittedFiles: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
  }>;
  rubric: Array<{
    criteria: string;
    points: number;
    earned: number | null;
  }>;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  enrolledCourses: string[];
  completedLessons: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  attendanceRate: number;
  learningStreak: number;
  badges: Array<{
    id: string;
    name: string;
    nameHi: string;
    nameMar: string;
    icon: string;
    earned: boolean;
    earnedDate: string | null;
  }>;
  recentActivity: Array<{
    type: string;
    title: string;
    titleHi: string;
    titleMar: string;
    timestamp: string;
    score: number | null;
  }>;
  weeklyProgress: Array<{
    week: string;
    progress: number;
  }>;
  preferences: {
    language: string;
    lowBandwidthMode: boolean;
    audioOnlyMode: boolean;
    notifications: boolean;
  };
  parentInfo: {
    name: string;
    phone: string;
    email: string;
    receiveUpdates: boolean;
  };
}

export interface Account {
  id: string;
  username: string;
  password: string;
  role: 'student' | 'teacher';
  name: string;
  nameHi: string;
  nameMar: string;
  profile: {
    avatar: string;
    email: string;
    phone: string;
    location: string;
    subjects?: string[];
  };
}

export interface Notification {
  id: string;
  title: string;
  titleHi: string;
  titleMar: string;
  message: string;
  messageHi: string;
  messageMar: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  titleHi: string;
  titleMar: string;
  instructor: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended';
  participants: number;
  maxParticipants: number;
  recordingUrl?: string;
  chatMessages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
  }>;
}

class MockService {
  private latencyMin = 200;
  private latencyMax = 1200;
  private offlineMode = false;
  private failureRate = 0.05; // 5% chance of failure

  constructor() {
    // Load offline mode from localStorage
    this.offlineMode = localStorage.getItem('offlineMode') === 'true';
  }

  // Configuration methods
  setLatency(min: number, max: number) {
    this.latencyMin = min;
    this.latencyMax = max;
  }

  simulateOffline(offline: boolean) {
    this.offlineMode = offline;
    localStorage.setItem('offlineMode', offline.toString());
  }

  setFailureRate(rate: number) {
    this.failureRate = rate;
  }

  // Utility methods
  private async delay(): Promise<void> {
    const latency = Math.random() * (this.latencyMax - this.latencyMin) + this.latencyMin;
    return new Promise(resolve => setTimeout(resolve, latency));
  }

  private shouldFail(): boolean {
    return Math.random() < this.failureRate;
  }

  private async executeWithDelay<T>(operation: () => T): Promise<T> {
    if (this.offlineMode) {
      throw new Error('Network unavailable - working offline');
    }

    await this.delay();

    if (this.shouldFail()) {
      throw new Error('Network request failed');
    }

    return operation();
  }

  // Data persistence helpers
  private getStoredData<T>(key: string, defaultData: T[]): T[] {
    try {
      const stored = localStorage.getItem(`eduindia_${key}`);
      return stored ? JSON.parse(stored) : defaultData;
    } catch {
      return defaultData;
    }
  }

  private setStoredData<T>(key: string, data: T[]): void {
    localStorage.setItem(`eduindia_${key}`, JSON.stringify(data));
  }

  // API methods
  async getCourses(): Promise<Course[]> {
    return this.executeWithDelay(() => {
      return this.getStoredData('courses', coursesData as Course[]);
    });
  }

  async getCourse(id: string): Promise<Course | null> {
    return this.executeWithDelay(() => {
      const courses = this.getStoredData('courses', coursesData as Course[]);
      return courses.find(course => course.id === id) || null;
    });
  }

  async getLessons(courseId?: string): Promise<Lesson[]> {
    return this.executeWithDelay(() => {
      const lessons = this.getStoredData('lessons', lessonsData as Lesson[]);
      return courseId ? lessons.filter(lesson => lesson.courseId === courseId) : lessons;
    });
  }

  async getLesson(id: string): Promise<Lesson | null> {
    return this.executeWithDelay(() => {
      const lessons = this.getStoredData('lessons', lessonsData as Lesson[]);
      return lessons.find(lesson => lesson.id === id) || null;
    });
  }

  async updateLessonProgress(id: string, progress: number, watchTime: number): Promise<void> {
    return this.executeWithDelay(() => {
      const lessons = this.getStoredData('lessons', lessonsData as Lesson[]);
      const lessonIndex = lessons.findIndex(lesson => lesson.id === id);
      if (lessonIndex !== -1) {
        lessons[lessonIndex].progress = progress;
        lessons[lessonIndex].watchTime = watchTime;
        lessons[lessonIndex].lastWatched = new Date().toISOString();
        if (progress >= 100) {
          lessons[lessonIndex].completed = true;
        }
        this.setStoredData('lessons', lessons);
      }
    });
  }

  async downloadLesson(id: string): Promise<void> {
    return this.executeWithDelay(() => {
      const lessons = this.getStoredData('lessons', lessonsData as Lesson[]);
      const lessonIndex = lessons.findIndex(lesson => lesson.id === id);
      if (lessonIndex !== -1) {
        lessons[lessonIndex].downloaded = true;
        this.setStoredData('lessons', lessons);
      }
    });
  }

  async getAssignments(courseId?: string): Promise<Assignment[]> {
    return this.executeWithDelay(() => {
      const assignments = this.getStoredData('assignments', assignmentsData as Assignment[]);
      return courseId ? assignments.filter(assignment => assignment.courseId === courseId) : assignments;
    });
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    return this.executeWithDelay(() => {
      const assignments = this.getStoredData('assignments', assignmentsData as Assignment[]);
      return assignments.find(assignment => assignment.id === id) || null;
    });
  }

  async submitAssignment(id: string, files: File[]): Promise<void> {
    return this.executeWithDelay(() => {
      const assignments = this.getStoredData('assignments', assignmentsData as Assignment[]);
      const assignmentIndex = assignments.findIndex(assignment => assignment.id === id);
      if (assignmentIndex !== -1) {
        assignments[assignmentIndex].status = 'submitted';
        assignments[assignmentIndex].submissionDate = new Date().toISOString();
        assignments[assignmentIndex].submittedFiles = files.map(file => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          url: `/mock-files/${file.name}`
        }));
        this.setStoredData('assignments', assignments);
      }
    });
  }

  async gradeAssignment(id: string, grade: string, score: number, feedback: string): Promise<void> {
    return this.executeWithDelay(() => {
      const assignments = this.getStoredData('assignments', assignmentsData as Assignment[]);
      const assignmentIndex = assignments.findIndex(assignment => assignment.id === id);
      if (assignmentIndex !== -1) {
        assignments[assignmentIndex].status = 'graded';
        assignments[assignmentIndex].grade = grade;
        assignments[assignmentIndex].score = score;
        assignments[assignmentIndex].feedback = feedback;
        this.setStoredData('assignments', assignments);
      }
    });
  }

  async getStudent(id: string): Promise<Student | null> {
    return this.executeWithDelay(() => {
      const students = this.getStoredData('students', studentsData as Student[]);
      return students.find(student => student.id === id) || null;
    });
  }

  async updateStudentProgress(id: string, updates: Partial<Student>): Promise<void> {
    return this.executeWithDelay(() => {
      const students = this.getStoredData('students', studentsData as Student[]);
      const studentIndex = students.findIndex(student => student.id === id);
      if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...updates };
        this.setStoredData('students', students);
      }
    });
  }

  async authenticate(username: string, password: string): Promise<Account | null> {
    return this.executeWithDelay(() => {
      const accounts = accountsData as Account[];
      return accounts.find(account => 
        account.username === username && account.password === password
      ) || null;
    });
  }

  async getCurrentUser(): Promise<Account | null> {
    const savedUser = localStorage.getItem('eduindia_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return userData;
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('eduindia_user');
      }
    }
    return null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('eduindia_user');
    // Clear other user-specific data if needed
  }

  async getNotifications(): Promise<Notification[]> {
    return this.executeWithDelay(() => {
      const defaultNotifications: Notification[] = [
        {
          id: 'notif-1',
          title: 'New Assignment Posted',
          titleHi: 'नया असाइनमेंट पोस्ट किया गया',
          titleMar: 'नवीन असाइनमेंट पोस्ट केले',
          message: 'Water Conservation assignment is now available',
          messageHi: 'जल संरक्षण असाइनमेंट अब उपलब्ध है',
          messageMar: 'पाणी संरक्षण असाइनमेंट आता उपलब्ध आहे',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/assignments'
        },
        {
          id: 'notif-2',
          title: 'Grade Received',
          titleHi: 'ग्रेड प्राप्त हुआ',
          titleMar: 'ग्रेड मिळाले',
          message: 'You received an A grade on your Desert Ecosystem assignment',
          messageHi: 'आपको अपने रेगिस्तानी पारिस्थितिकी असाइनमेंट पर A ग्रेड मिला',
          messageMar: 'तुम्हाला तुमच्या वाळवंटी परिसंस्था असाइनमेंटवर A ग्रेड मिळाले',
          type: 'success',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/assignments'
        }
      ];
      return this.getStoredData('notifications', defaultNotifications);
    });
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.executeWithDelay(() => {
      const notifications = this.getStoredData('notifications', [] as Notification[]);
      const notificationIndex = notifications.findIndex(notif => notif.id === id);
      if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        this.setStoredData('notifications', notifications);
      }
    });
  }

  async addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<void> {
    return this.executeWithDelay(() => {
      const notifications = this.getStoredData('notifications', [] as Notification[]);
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      notifications.unshift(newNotification);
      this.setStoredData('notifications', notifications);
    });
  }

  async getLiveClasses(): Promise<LiveClass[]> {
    return this.executeWithDelay(() => {
      const defaultClasses: LiveClass[] = [
        {
          id: 'live-1',
          title: 'Advanced Water Conservation',
          titleHi: 'उन्नत जल संरक्षण तकनीकें',
          titleMar: 'प्रगत पाणी संरक्षण तंत्रे',
          instructor: 'Dr. Priya Sharma',
          startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
          endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 minutes from now
          status: 'scheduled',
          participants: 0,
          maxParticipants: 50,
          chatMessages: []
        },
        {
          id: 'live-2',
          title: 'Biodiversity Conservation',
          titleHi: 'जैव विविधता संरक्षण की बुनियादी बातें',
          titleMar: 'जैवविविधता संरक्षण मूलभूत गोष्टी',
          instructor: 'Prof. Rajesh Kumar',
          startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Started 30 minutes ago
          endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Ends in 30 minutes
          status: 'live',
          participants: 23,
          maxParticipants: 50,
          chatMessages: []
        }
      ];
      return this.getStoredData('liveClasses', defaultClasses);
    });
  }

  async joinLiveClass(id: string): Promise<void> {
    return this.executeWithDelay(() => {
      const classes = this.getStoredData('liveClasses', [] as LiveClass[]);
      const classIndex = classes.findIndex(cls => cls.id === id);
      if (classIndex !== -1) {
        classes[classIndex].participants += 1;
        if (classes[classIndex].status === 'scheduled') {
          classes[classIndex].status = 'live';
        }
        this.setStoredData('liveClasses', classes);
      }
    });
  }

  async uploadRecording(title: string, description: string, audioBlob: Blob): Promise<string> {
    return this.executeWithDelay(() => {
      // Simulate recording upload and return a lesson ID
      const lessons = this.getStoredData('lessons', lessonsData as Lesson[]);
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        courseId: 'course-1',
        title,
        titleHi: title,
        titleMar: title,
        description,
        descriptionHi: description,
        descriptionMar: description,
        duration: '00:00',
        audioUrl: URL.createObjectURL(audioBlob),
        slidesUrl: '',
        transcriptUrl: '',
        thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        completed: false,
        downloaded: false,
        progress: 0,
        fileSize: `${(audioBlob.size / (1024 * 1024)).toFixed(1)} MB`,
        estimatedSize2G: `${(audioBlob.size / (1024 * 1024) * 0.3).toFixed(1)} MB`,
        slides: [],
        lastWatched: null,
        watchTime: 0
      };
      lessons.push(newLesson);
      this.setStoredData('lessons', lessons);
      return newLesson.id;
    });
  }

  // Debug methods
  resetMockData(): void {
    // Don't clear user session data
    const userData = localStorage.getItem('eduindia_user');
    const themeData = localStorage.getItem('eduindia_theme');
    
    localStorage.removeItem('eduindia_courses');
    localStorage.removeItem('eduindia_lessons');
    localStorage.removeItem('eduindia_assignments');
    localStorage.removeItem('eduindia_students');
    localStorage.removeItem('eduindia_notifications');
    localStorage.removeItem('eduindia_liveClasses');
    
    // Restore user session and theme
    if (userData) localStorage.setItem('eduindia_user', userData);
    if (themeData) localStorage.setItem('eduindia_theme', themeData);
  }

  getCacheSize(): string {
    let totalSize = 0;
    for (let key in localStorage) {
      if (key.startsWith('eduindia_')) {
        totalSize += localStorage[key].length;
      }
    }
    return `${(totalSize / 1024).toFixed(1)} KB`;
  }
}

export const mockService = new MockService();
export default mockService;