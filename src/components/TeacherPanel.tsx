import React, { useState } from "react";
import {
    Upload,
    Video,
    FileText,
    CheckCircle,
    Clock,
    Users,
    BarChart3,
    BookOpen,
    GraduationCap,
    TrendingUp,
} from "lucide-react";
import { useI18n } from "../hooks/useI18n";
import RecorderStub from "./RecorderStub";

const TeacherPanel: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [lectureForm, setLectureForm] = useState({
        title: "",
        subject: "",
        description: "",
        optimizeForLowBandwidth: true,
    });
    const { t } = useI18n();

    const uploadedLectures = [
        {
            id: 1,
            title: "Introduction to React",
            subject: "Web Development",
            status: "published",
            date: "2024-01-15",
            views: 245,
        },
        {
            id: 2,
            title: "State Management",
            subject: "Web Development",
            status: "processing",
            date: "2024-01-16",
            views: 0,
        },
        {
            id: 3,
            title: "Component Lifecycle",
            subject: "Web Development",
            status: "published",
            date: "2024-01-17",
            views: 189,
        },
    ];

    const studentStats = [
        {
            name: "Total Students",
            value: "156",
            change: "+12",
            color: "text-blue-600",
        },
        {
            name: "Active This Week",
            value: "142",
            change: "+8",
            color: "text-green-600",
        },
        {
            name: "Assignments Submitted",
            value: "89%",
            change: "+5%",
            color: "text-purple-600",
        },
        {
            name: "Average Score",
            value: "85%",
            change: "+2%",
            color: "text-orange-600",
        },
    ];

    const recentSubmissions = [
        {
            student: "Priya Sharma",
            assignment: "React Hooks",
            score: 95,
            status: "graded",
            time: "2 hours ago",
        },
        {
            student: "Rahul Meena",
            assignment: "CSS Grid",
            score: null,
            status: "pending",
            time: "4 hours ago",
        },
        {
            student: "Kavita Rajput",
            assignment: "JavaScript Arrays",
            score: 88,
            status: "graded",
            time: "1 day ago",
        },
    ];

    // Simulate lecture upload with progress
    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev: number) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setTimeout(() => {
                        alert(
                            "Lecture uploaded successfully! Processing has started."
                        );
                    }, 500);
                    setLectureForm({
                        title: "",
                        subject: "",
                        description: "",
                        optimizeForLowBandwidth: true,
                    });
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 300);
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studentStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className={`text-2xl font-bold ${stat.color}`}
                                >
                                    {stat.value}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {stat.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-chart-2 font-medium">
                                    {stat.change}
                                </span>
                                <TrendingUp
                                    size={16}
                                    className="text-chart-2 ml-1"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                        <FileText className="mr-2 text-primary" size={20} />
                        {t("teacher.recentSubmissions", "Recent Submissions")}
                    </h3>
                    <div className="space-y-3">
                        {recentSubmissions.map((submission, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg shadow-sm"
                            >
                                <div>
                                    <p className="font-medium text-card-foreground text-sm">
                                        {submission.student}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {submission.assignment} •{" "}
                                        {submission.time}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {submission.status === "graded" ? (
                                        <span className="text-chart-2 font-medium">
                                            {submission.score}%
                                        </span>
                                    ) : (
                                        <span className="text-chart-1 text-sm">
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                        <BarChart3 className="mr-2 text-primary" size={20} />
                        {t("teacher.quickActions", "Quick Actions")}
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setActiveTab("upload")}
                            className="w-full flex items-center p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all shadow-sm"
                        >
                            <Video className="mr-3" size={20} />
                            {t("teacher.uploadLecture", "Upload New Lecture")}
                        </button>
                        <button className="w-full flex items-center p-3 bg-chart-2/10 text-chart-2 rounded-lg hover:bg-chart-2/20 transition-all shadow-sm">
                            <FileText className="mr-3" size={20} />
                            {t("teacher.gradeAssignments")}
                        </button>
                        <button className="w-full flex items-center p-3 bg-chart-1/10 text-chart-1 rounded-lg hover:bg-chart-1/20 transition-all shadow-sm">
                            <BarChart3 className="mr-3" size={20} />
                            {t("teacher.viewAnalytics", "View Analytics")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUpload = () => (
        <div className="space-y-6">
            {/* Recording Interface */}
            <RecorderStub
                onRecordingComplete={(lessonId) => {
                    console.log("Lesson recorded:", lessonId);
                    setActiveTab("lectures");
                }}
            />
        </div>
    );

    const renderLectures = () => (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                <Video className="mr-2 text-primary" size={20} />
                {t("teacher.recentUploads", "Recent Uploads")}
            </h3>
            <div className="space-y-3">
                {uploadedLectures.map((lecture) => (
                    <div
                        key={lecture.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border shadow-sm"
                    >
                        <div className="flex-1">
                            <h4 className="font-medium text-card-foreground">
                                {lecture.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {lecture.subject} • {lecture.date}
                            </p>
                            {lecture.views > 0 && (
                                <p className="text-xs text-chart-2 flex items-center">
                                    <Users size={12} className="mr-1" />
                                    {lecture.views}{" "}
                                    {t("teacher.views", "views")}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center">
                            {lecture.status === "published" ? (
                                <CheckCircle
                                    className="text-chart-2"
                                    size={20}
                                />
                            ) : (
                                <Clock className="text-chart-1" size={20} />
                            )}
                            <span
                                className={`ml-2 text-sm font-medium ${
                                    lecture.status === "published"
                                        ? "text-chart-2"
                                        : "text-chart-1"
                                }`}
                            >
                                {lecture.status === "published"
                                    ? t("teacher.published", "Published")
                                    : t("teacher.processing", "Processing")}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-card-foreground mb-2 flex items-center">
                    <GraduationCap className="mr-3 text-primary" size={28} />
                    {t("teacher.dashboard", "Teacher Dashboard")}
                </h1>
                <p className="text-muted-foreground">
                    {t(
                        "teacher.manageContent",
                        "Manage your courses, students, and content"
                    )}
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
                <div className="flex space-x-1">
                    {[
                        {
                            id: "overview",
                            label: t("teacher.overview", "Overview"),
                            icon: BarChart3,
                        },
                        {
                            id: "upload",
                            label: t("teacher.recordLesson"),
                            icon: Upload,
                        },
                        {
                            id: "lectures",
                            label: t("teacher.myLectures", "My Lectures"),
                            icon: BookOpen,
                        },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${
                                activeTab === id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
                            }`}
                        >
                            <Icon size={16} className="mr-2" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && renderOverview()}
            {activeTab === "upload" && renderUpload()}
            {activeTab === "lectures" && renderLectures()}
        </div>
    );
};

export default TeacherPanel;
