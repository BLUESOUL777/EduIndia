import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, FileText, Award, Calendar, Star, Printer, BarChart3, Target, Trophy } from 'lucide-react';
import { mockService, Student, Course } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const Dashboard: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showParentView, setShowParentView] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [studentData, coursesData] = await Promise.all([
          mockService.getStudent('student-1'),
          mockService.getCourses()
        ]);
        
        if (studentData) {
          setStudent(studentData);
        }
        if (coursesData) {
          setCourses(coursesData.filter(course => course.enrolled));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set empty state instead of failing completely
        setStudent(null);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const generateWeeklyDigest = () => {
    if (!student) return;
    
    const digest = `
EduIndia Weekly Progress Report
Student: ${student.name}
Week of: ${new Date().toLocaleDateString()}

📊 PROGRESS SUMMARY
• Lessons Completed: ${student.completedLessons}/${student.totalLessons}
• Assignments Submitted: ${student.assignmentsSubmitted}/${student.totalAssignments}
• Attendance Rate: ${student.attendanceRate}%
• Learning Streak: ${student.learningStreak} days

🏆 ACHIEVEMENTS THIS WEEK
${student.badges.filter(badge => badge.earned).map(badge => `• ${badge.name}`).join('\n')}

📚 RECENT ACTIVITY
${student.recentActivity.slice(0, 3).map(activity => 
  `• ${activity.title} - ${new Date(activity.timestamp).toLocaleDateString()}`
).join('\n')}

📈 WEEKLY PROGRESS TREND
${student.weeklyProgress.map(week => `${week.week}: ${week.progress}%`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Weekly Progress Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${digest}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const progressPercentage = (student.completedLessons / student.totalLessons) * 100;
  const assignmentProgress = (student.assignmentsSubmitted / student.totalAssignments) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Trophy className="mr-2" size={28} />
              {t('dashboard.welcome')}
            </h1>
            <p className="text-primary-foreground/70">{t('dashboard.greeting')}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{student.learningStreak}</div>
            <div className="text-sm text-primary-foreground/70">{t('dashboard.streakDays')}</div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground flex items-center">
          <BarChart3 className="mr-2 text-primary" size={24} />
          {t('dashboard.myProgress')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParentView(!showParentView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showParentView
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t('dashboard.parentView')}
          </button>
          <button
            onClick={generateWeeklyDigest}
            className="flex items-center space-x-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-all shadow-sm"
          >
            <Printer size={16} />
            <span>{t('dashboard.weeklyDigest')}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-chart-2">{student.completedLessons}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.lessonsCompleted')}</p>
            </div>
            <BookOpen className="text-chart-2" size={24} />
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-chart-2 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-chart-1">{student.assignmentsSubmitted}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.assignmentsSubmitted')}</p>
            </div>
            <FileText className="text-chart-1" size={24} />
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-chart-1 h-2 rounded-full transition-all duration-300"
              style={{ width: `${assignmentProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-chart-2">{student.attendanceRate}%</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.attendanceRate')}</p>
            </div>
            <Calendar className="text-chart-2" size={24} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-chart-1">{student.badges.filter(b => b.earned).length}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.badges')}</p>
            </div>
            <Award className="text-chart-1" size={24} />
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary" size={20} />
          {t('dashboard.weeklyProgress', 'Weekly Progress')}
        </h3>
        <div className="space-y-3">
          {student.weeklyProgress.map((week, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-muted-foreground">{week.week}</div>
              <div className="flex-1 bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${week.progress}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-card-foreground">{week.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Target className="mr-2 text-primary" size={20} />
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-4">
            {student.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                    {activity.score && (
                      <span className="text-xs bg-chart-2/10 text-chart-2 px-2 py-1 rounded-full">
                        {activity.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Award className="mr-2 text-primary" size={20} />
            {t('dashboard.achievements')}
          </h3>
          <div className="space-y-3">
            {student.badges.map((badge, index) => (
              <div 
                key={badge.id} 
                className={`flex items-center p-3 rounded-lg transition-all shadow-sm ${
                  badge.earned 
                    ? 'bg-chart-1/10 border border-chart-1/20' 
                    : 'bg-muted/50 opacity-60'
                }`}
              >
                <div className="text-2xl mr-3">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${
                    badge.earned ? 'text-card-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {badge.name}
                  </h4>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {badge.earned && (
                  <Star className="text-chart-1" size={16} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <BookOpen className="mr-2 text-primary" size={20} />
          {t('dashboard.coursesEnrolled')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all bg-card">
              <div className="flex items-start space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground mb-1">{course.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="text-xs font-medium text-chart-2">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-chart-2 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent View */}
      {showParentView && (
        <div className="bg-chart-2/5 border border-chart-2/20 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Parent Dashboard - {student.name}
            </h3>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Academic Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Overall Progress:</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Assignment Completion:</span>
                  <span className="font-medium">{Math.round(assignmentProgress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance Rate:</span>
                  <span className="font-medium">{student.attendanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Streak:</span>
                  <span className="font-medium">{student.learningStreak} days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Parent:</span> {student.parentInfo.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span> {student.parentInfo.phone}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span> {student.parentInfo.email}
                </div>
                <div className="mt-3">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={student.parentInfo.receiveUpdates}
                      readOnly
                      className="rounded"
                    />
                    <span className="text-muted-foreground">Receive weekly updates</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;