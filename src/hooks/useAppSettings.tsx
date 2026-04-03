import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Language = "en" | "ar";

interface AppSettings {
  theme: Theme;
  language: Language;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "pricing": { en: "Pricing", ar: "الأسعار" },
  "sign_in": { en: "Sign In", ar: "تسجيل الدخول" },
  "sign_out": { en: "Sign Out", ar: "تسجيل الخروج" },
  "settings": { en: "Settings", ar: "الإعدادات" },
  "pro_plan": { en: "Pro Plan", ar: "الخطة الاحترافية" },
  "free_plan": { en: "Free Plan", ar: "الخطة المجانية" },

  // Index
  "craft_scripts": { en: "Craft Scripts", ar: "اصنع نصوصاً" },
  "that_go_viral": { en: "That Go Viral", ar: "تنتشر بسرعة" },
  "hero_subtitle": {
    en: "Platform-optimized scripts with hooks, retention strategies, and calls to action — built for YouTube, TikTok, Reels, and more.",
    ar: "نصوص محسّنة للمنصات مع خطافات واستراتيجيات احتفاظ ودعوات للعمل — مُصممة لـ YouTube و TikTok و Reels والمزيد."
  },
  "generate": { en: "Generate", ar: "إنشاء" },
  "fill_prompt": {
    en: "Fill in your parameters and hit",
    ar: "أدخل المعلومات واضغط"
  },
  "to_create": { en: "to create your script.", ar: "لإنشاء النص الخاص بك." },

  // ScriptForm
  "topic": { en: "Topic / Idea", ar: "الموضوع / الفكرة" },
  "topic_placeholder": { en: "e.g. 5 morning habits that changed my life", ar: "مثال: 5 عادات صباحية غيّرت حياتي" },
  "platform": { en: "Platform", ar: "المنصة" },
  "duration": { en: "Duration", ar: "المدة" },
  "tone": { en: "Tone", ar: "النبرة" },
  "language": { en: "Language", ar: "اللغة" },
  "generate_script": { en: "Generate Script", ar: "إنشاء النص" },
  "generating": { en: "Generating…", ar: "جارٍ الإنشاء…" },

  // Settings
  "account": { en: "Account", ar: "الحساب" },
  "email": { en: "Email", ar: "البريد الإلكتروني" },
  "name": { en: "Name", ar: "الاسم" },
  "subscription": { en: "Subscription", ar: "الاشتراك" },
  "active_until": { en: "Active until", ar: "نشط حتى" },
  "scripts_generated": { en: "scripts generated this month", ar: "نصوص تم إنشاؤها هذا الشهر" },
  "upgrade_to_pro": { en: "Upgrade to Pro", ar: "الترقية إلى Pro" },
  "script_history": { en: "Script History", ar: "سجل النصوص" },
  "no_scripts": { en: "No scripts generated yet.", ar: "لم يتم إنشاء أي نصوص بعد." },
  "preferences": { en: "Preferences", ar: "التفضيلات" },
  "theme": { en: "Theme", ar: "المظهر" },
  "light": { en: "Light", ar: "فاتح" },
  "dark": { en: "Dark", ar: "داكن" },
  "app_language": { en: "Language", ar: "اللغة" },
  "english": { en: "English", ar: "English" },
  "arabic": { en: "العربية", ar: "العربية" },

  // ScriptOutput
  "hook": { en: "Hook", ar: "الخطاف" },
  "body": { en: "Body", ar: "المحتوى" },
  "cta": { en: "Call to Action", ar: "دعوة للعمل" },
  "retention_tips": { en: "Retention Tips", ar: "نصائح الاحتفاظ" },
  "copy_script": { en: "Copy Script", ar: "نسخ النص" },
  "copied": { en: "Copied!", ar: "تم النسخ!" },

  // Pricing
  "choose_plan": { en: "Choose Your Plan", ar: "اختر خطتك" },
  "monthly": { en: "Monthly", ar: "شهري" },
  "yearly": { en: "Yearly", ar: "سنوي" },
  "free": { en: "Free", ar: "مجاني" },
  "pro": { en: "Pro", ar: "احترافي" },
  "per_month": { en: "/month", ar: "/شهر" },
  "per_year": { en: "/year", ar: "/سنة" },
  "current_plan": { en: "Current Plan", ar: "الخطة الحالية" },
  "get_started": { en: "Get Started", ar: "ابدأ الآن" },

  // Auth
  "create_account": { en: "Create Account", ar: "إنشاء حساب" },
  "sign_in_account": { en: "Sign in to your account", ar: "سجّل دخولك" },
  "password": { en: "Password", ar: "كلمة المرور" },
  "no_account": { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  "have_account": { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  "sign_up": { en: "Sign Up", ar: "إنشاء حساب" },

  // Usage
  "scripts_left": { en: "left", ar: "متبقي" },
  "unlimited": { en: "Unlimited", ar: "غير محدود" },
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sf-theme") as Theme) || "light";
    }
    return "light";
  });

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sf-language") as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sf-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("sf-language", language);
  }, [language]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setLanguage = (l: Language) => setLanguageState(l);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <AppSettingsContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}
