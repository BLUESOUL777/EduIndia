import React, { useState, useEffect } from "react";
import { Bell, Sun, Moon, LogOut, GraduationCap, X } from "lucide-react";
import { mockService, Notification } from "./services/mockService";

// Components
import OfflineToggle from "./components/OfflineToggle";
import Dashboard from "./pages/Dashboard";
import LessonsPage from "./pages/LessonsPage";
import AssignmentCenter from "./components/AssignmentCenter";
import LiveClassPage from "./pages/LiveClassPage";
import FAQPage from "./pages/FAQPage";
import ProfilePage from "./components/ProfilePage";
import TeacherPanel from "./components/TeacherPanel";
import LoginPage from "./components/LoginPage";

// Language and Theme Context
import {
    LanguageProvider,
    useLanguage,
    Language,
} from "./contexts/LanguageContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

interface User {
    id: string;
    name: string;
    role: "student" | "teacher";
    email: string;
}

// Navigation Component
const Navigation: React.FC<{
    activeTab: string;
    onTabChange: (tab: string) => void;
    userRole: "student" | "teacher";
    onLogout: () => void;
}> = ({ activeTab, onTabChange, userRole, onLogout }) => {
    const { t } = useLanguage();

    const studentTabs = [
        { id: "dashboard", label: t("nav.dashboard"), path: "/dashboard" },
        { id: "lessons", label: t("nav.lessons"), path: "/lessons" },
        {
            id: "assignments",
            label: t("nav.assignments"),
            path: "/assignments",
        },
        { id: "live", label: t("nav.live"), path: "/live" },
        { id: "faq", label: t("nav.faq"), path: "/faq" },
    ];

    const teacherTabs = [
        { id: "dashboard", label: t("nav.dashboard"), path: "/teacher" },
        { id: "lessons", label: t("nav.lessons"), path: "/lessons" },
        {
            id: "assignments",
            label: t("nav.assignments"),
            path: "/assignments",
        },
        { id: "live", label: t("nav.live"), path: "/live" },
        { id: "profile", label: t("nav.profile"), path: "/profile" },
    ];

    const tabs = userRole === "teacher" ? teacherTabs : studentTabs;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 shadow-lg">
            <div className="flex justify-around items-center h-16 px-2">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => onTabChange(id)}
                        className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 rounded-xl transition-all duration-200 ${
                            activeTab === id
                                ? "text-primary bg-accent scale-105"
                                : "text-muted-foreground hover:text-primary hover:bg-muted hover:scale-105"
                        }`}
                    >
                        <img
                            src={`/icons/${id}.svg`}
                            alt={`${label} icon`}
                            className="w-6 h-6 mb-1"
                        />
                        <span className="text-xs font-medium truncate max-w-full">
                            {label}
                        </span>
                    </button>
                ))}
                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10 hover:scale-105"
                >
                    <LogOut size={16} />
                    <span className="text-xs font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
};

// Header Component
const Header: React.FC<{
    notifications: Notification[];
    onNotificationClick: () => void;
    user: User;
}> = ({ notifications, onNotificationClick, user }) => {
    const { isDark, toggleTheme } = useTheme();
    const { language, setLanguage, availableLanguages } = useLanguage();
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl shadow-sm">
            <div className="px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/EduIndia-Logo.png"
                            alt="EduIndia Logo"
                            className="w-11 h-11 bg-gradient-to-br rounded-lg flex items-center justify-center"
                        />
                        <div>
                            <h1 className="text-lg font-semibold text-card-foreground flex items-center">
                                EduIndia
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    v1.0
                                </span>
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Welcome, {user.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Language Selector */}
                        <select
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value as Language)
                            }
                            className="bg-input text-foreground text-xs rounded-lg px-2 py-1 border-none outline-none focus:ring-2 focus:ring-ring"
                        >
                            {availableLanguages.map((lang) => (
                                <option
                                    key={lang.code}
                                    value={lang.code}
                                    className="bg-card"
                                >
                                    {lang.nativeName}
                                </option>
                            ))}
                        </select>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title={
                                isDark
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"
                            }
                        >
                            {isDark ? (
                                <Sun
                                    size={16}
                                    className="text-muted-foreground"
                                />
                            ) : (
                                <Moon
                                    size={16}
                                    className="text-muted-foreground"
                                />
                            )}
                        </button>

                        {/* Offline Toggle */}
                        <OfflineToggle />

                        {/* Notifications */}
                        <button
                            onClick={onNotificationClick}
                            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Bell size={16} className="text-muted-foreground" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Notifications Panel
const NotificationsPanel: React.FC<{
    notifications: Notification[];
    isOpen: boolean;
    onClose: () => void;
    onMarkRead: (id: string) => void;
}> = ({ notifications, isOpen, onClose, onMarkRead }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                className="fixed right-4 top-20 w-80 max-h-96 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-card-foreground">
                        Notifications
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b border-border cursor-pointer hover:bg-muted ${
                                    !notification.read ? "bg-accent" : ""
                                }`}
                                onClick={() => onMarkRead(notification.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-card-foreground">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(
                                                notification.timestamp
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notifications.some((n) => !n.read) && (
                    <div className="p-4 border-t border-border">
                        <button
                            onClick={() =>
                                notifications.forEach(
                                    (n) => !n.read && onMarkRead(n.id)
                                )
                            }
                            className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Mark All Read
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main App Component
const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem("eduindia_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Failed to parse saved user:", error);
                localStorage.removeItem("eduindia_user");
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            const loadNotifications = async () => {
                try {
                    const notifs = await mockService.getNotifications();
                    setNotifications(notifs);
                } catch (error) {
                    console.error("Failed to load notifications:", error);
                }
            };

            loadNotifications();
        }
    }, [user]);

    const handleLogin = (userData: User) => {
        setUser(userData);
        localStorage.setItem("eduindia_user", JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("eduindia_user");
        setActiveTab("dashboard");
        setNotifications([]);
    };

    const handleNotificationRead = async (id: string) => {
        try {
            await mockService.markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const sendTestNotification = async () => {
        try {
            await mockService.addNotification({
                title: "Test Notification",
                titleHi: "टेस्ट नोटिफिकेशन",
                titleMar: "टेस्ट नोटिफिकेशन",
                message: "This is a test notification sent from the demo",
                messageHi: "यह डेमो से भेजा गया एक टेस्ट नोटिफिकेशन है",
                messageMar: "हे डेमोमधून पाठवलेले टेस्ट नोटिफिकेशन आहे",
                type: "info",
                read: false,
            });

            const updatedNotifs = await mockService.getNotifications();
            setNotifications(updatedNotifs);
        } catch (error) {
            console.error("Failed to send test notification:", error);
        }
    };

    // Show login page if no user is logged in
    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderContent = () => {
        if (user.role === "teacher") {
            switch (activeTab) {
                case "dashboard":
                    return <TeacherPanel />;
                case "lessons":
                    return <LessonsPage />;
                case "assignments":
                    return <AssignmentCenter />;
                case "live":
                    return <LiveClassPage />;
                case "profile":
                    return <ProfilePage />;
                default:
                    return <TeacherPanel />;
            }
        } else {
            switch (activeTab) {
                case "dashboard":
                    return <Dashboard />;
                case "lessons":
                    return <LessonsPage />;
                case "assignments":
                    return <AssignmentCenter />;
                case "live":
                    return <LiveClassPage />;
                case "faq":
                    return <FAQPage />;
                default:
                    return <Dashboard />;
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
            <Header
                notifications={notifications}
                onNotificationClick={() => setShowNotifications(true)}
                user={user}
            />

           

            <main className="p-4">{renderContent()}</main>

            <Navigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userRole={user.role}
                onLogout={handleLogout}
            />

            <NotificationsPanel
                notifications={notifications}
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                onMarkRead={handleNotificationRead}
            />
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
