import React, { useState } from "react";
import {
    User,
    GraduationCap,
    Eye,
    EyeOff,
    LogIn,
    BookOpen,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage, Language } from "../contexts/LanguageContext";

interface User {
    id: string;
    name: string;
    role: "student" | "teacher";
    email: string;
}

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<"student" | "teacher">(
        "student"
    );
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { isDark, toggleTheme } = useTheme();
    const { t, language, setLanguage, availableLanguages } = useLanguage();

    // Demo credentials
    const demoCredentials = {
        student: { username: "student", password: "demo123" },
        teacher: { username: "teacher", password: "demo123" },
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const demo = demoCredentials[selectedRole];

        if (
            credentials.username === demo.username &&
            credentials.password === demo.password
        ) {
            const user: User = {
                id: `${selectedRole}-1`,
                name:
                    selectedRole === "student"
                        ? "Demo Student"
                        : "Demo Teacher",
                role: selectedRole,
                email: `${selectedRole}@demo.eduindia.com`,
            };
            onLogin(user);
        } else {
            setError("Invalid credentials. Use demo credentials shown below.");
        }

        setIsLoading(false);
    };

    const handleDemoLogin = () => {
        const demo = demoCredentials[selectedRole];
        setCredentials({
            username: demo.username,
            password: demo.password,
        });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="/WhatsApp Image 2025-09-14 at 15.35.03.jpeg"
                        alt="EduIndia Logo"
                        className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    />
                    <h1 className="text-3xl font-bold text-card-foreground mb-2 flex items-center justify-center">
                        EduIndia
                        <BookOpen className="ml-2 text-orange-500" size={24} />
                    </h1>
                    <p className="text-muted-foreground">{t("app.tagline")}</p>
                </div>

                {/* Language Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-card-foreground mb-2 text-center">
                        Choose Language / भाषा चुनें
                    </label>
                    <select
                        value={language}
                        onChange={(e) =>
                            setLanguage(e.target.value as Language)
                        }
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
                </div>

                {/* Role Selection */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-card-foreground mb-4 text-center">
                        {t("common.selectRole")}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => setSelectedRole("student")}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedRole === "student"
                                    ? "border-primary bg-accent text-primary"
                                    : "border-border hover:border-muted-foreground text-muted-foreground"
                            }`}
                        >
                            <User size={32} className="mx-auto mb-2" />
                            <div className="text-sm font-medium">
                                {t("common.student")}
                            </div>
                            <div className="text-xs opacity-70">
                                {t("common.learnStudy")}
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedRole("teacher")}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedRole === "teacher"
                                    ? "border-primary bg-accent text-primary"
                                    : "border-border hover:border-muted-foreground text-muted-foreground"
                            }`}
                        >
                            <GraduationCap size={32} className="mx-auto mb-2" />
                            <div className="text-sm font-medium">
                                {t("common.teacher")}
                            </div>
                            <div className="text-xs opacity-70">
                                {t("common.teachManage")}
                            </div>
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-2">
                                {t("common.username")}
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials((prev) => ({
                                        ...prev,
                                        username: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                placeholder={t("common.enterUsername")}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-2">
                                {t("common.password")}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-3 pr-12 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder={t("common.enterPassword")}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={20} className="mr-2" />
                                    {t("common.loginAs")}{" "}
                                    {selectedRole === "student"
                                        ? t("common.student")
                                        : t("common.teacher")}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="text-sm font-medium text-card-foreground mb-2">
                            {t("common.demoCredentials")}:
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                                {t("common.username")}:{" "}
                                <code className="bg-background px-1 rounded">
                                    {demoCredentials[selectedRole].username}
                                </code>
                            </div>
                            <div>
                                {t("common.password")}:{" "}
                                <code className="bg-background px-1 rounded">
                                    {demoCredentials[selectedRole].password}
                                </code>
                            </div>
                        </div>
                        <button
                            onClick={handleDemoLogin}
                            className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                            {t("common.fillDemo")}
                        </button>
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex justify-center">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        title={
                            isDark
                                ? t("common.lightMode")
                                : t("common.darkMode")
                        }
                    >
                        {isDark ? (
                            <>
                                <Sun size={16} className="mr-2" />
                                <span>{t("common.lightMode")}</span>
                            </>
                        ) : (
                            <>
                                <Moon size={16} className="mr-2" />
                                <span>{t("common.darkMode")}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-muted-foreground">
                    <p>© 2025 EduIndia. Build to provide better Education.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
