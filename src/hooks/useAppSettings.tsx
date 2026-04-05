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

  // Pricing page
  "simple_pricing": { en: "Simple Pricing", ar: "أسعار بسيطة" },
  "pricing_subtitle": { en: "Start free, upgrade when you need more power.", ar: "ابدأ مجانًا، وقم بالترقية عندما تحتاج المزيد." },
  "save": { en: "Save", ar: "وفّر" },
  "start_free": { en: "Start Free", ar: "ابدأ مجانًا" },
  "most_popular": { en: "Most Popular", ar: "الأكثر شيوعًا" },
  "best_value": { en: "Best Value", ar: "أفضل قيمة" },
  "upgrade_to_pro_btn": { en: "Upgrade to Pro", ar: "الترقية إلى Pro" },
  "loading": { en: "Loading...", ar: "جارٍ التحميل..." },
  "mastercard_visa": { en: "Mastercard & Visa", ar: "Mastercard و Visa" },
  "faq_title": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  "just": { en: "Just", ar: "فقط" },
  "mo": { en: "/mo", ar: "/شهر" },
  "yr": { en: "/yr", ar: "/سنة" },

  // Plan features - Free
  "feat_5_scripts": { en: "5 scripts per month", ar: "5 نصوص شهريًا" },
  "feat_yt_tt_reels": { en: "YouTube, TikTok, Reels", ar: "YouTube و TikTok و Reels" },
  "feat_basic_hooks": { en: "Basic hooks and CTAs", ar: "خطافات ودعوات عمل أساسية" },
  "feat_3_titles": { en: "3 title suggestions", ar: "3 اقتراحات للعنوان" },
  "feat_course_webinar": { en: "Course & Webinar platforms", ar: "منصات الدورات والندوات" },
  "feat_multi_lang": { en: "Multi-language support", ar: "دعم متعدد اللغات" },
  "feat_export": { en: "Export as PDF/JSON", ar: "تصدير كـ PDF/JSON" },
  "feat_retention": { en: "Retention strategy analysis", ar: "تحليل استراتيجية الاحتفاظ" },

  // Plan features - Pro
  "feat_unlimited": { en: "Unlimited scripts", ar: "نصوص غير محدودة" },
  "feat_all_platforms": { en: "All platforms including Course & Webinar", ar: "جميع المنصات بما فيها الدورات والندوات" },
  "feat_advanced_hooks": { en: "Advanced hook types", ar: "أنواع خطافات متقدمة" },
  "feat_broll": { en: "B-roll & visual direction", ar: "B-roll وتوجيه بصري" },
  "feat_seo": { en: "SEO tags & descriptions", ar: "وسوم SEO والأوصاف" },
  "feat_en_ar": { en: "English + Arabic support", ar: "دعم الإنجليزية + العربية" },

  // FAQ
  "faq_cancel_q": { en: "Can I cancel anytime?", ar: "هل يمكنني الإلغاء في أي وقت؟" },
  "faq_cancel_a": { en: "Yes, cancel anytime from your account settings.", ar: "نعم، يمكنك الإلغاء في أي وقت من إعدادات حسابك." },
  "faq_payment_q": { en: "What payment methods do you accept?", ar: "ما طرق الدفع المقبولة؟" },
  "faq_payment_a": { en: "Mastercard, Visa, and all major credit/debit cards worldwide.", ar: "Mastercard و Visa وجميع بطاقات الائتمان/الخصم الرئيسية حول العالم." },
  "faq_billing_q": { en: "When does my billing cycle reset?", ar: "متى تتم إعادة تعيين دورة الفوترة؟" },
  "faq_billing_a": { en: "Your free script count resets on the 1st of each month.", ar: "يتم إعادة تعيين عدد النصوص المجانية في الأول من كل شهر." },
  "faq_downgrade_q": { en: "Do I lose my scripts if I downgrade?", ar: "هل أفقد نصوصي إذا خفّضت الخطة؟" },
  "faq_downgrade_a": { en: "No, all your previously generated scripts remain in your history.", ar: "لا، جميع النصوص التي أنشأتها سابقًا تبقى في سجلك." },

  // Auth page
  "welcome_back": { en: "Welcome Back", ar: "مرحبًا بعودتك" },
  "join_scriptforge": { en: "Join ScriptForge AI today", ar: "انضم إلى ScriptForge AI اليوم" },
  "sign_in_continue": { en: "Sign in to continue generating scripts", ar: "سجّل الدخول لمتابعة إنشاء النصوص" },
  "continue_google": { en: "Continue with Google", ar: "المتابعة مع Google" },
  "or": { en: "or", ar: "أو" },
  "full_name": { en: "Full name", ar: "الاسم الكامل" },
  "email_address": { en: "Email address", ar: "البريد الإلكتروني" },
  "please_wait": { en: "Please wait...", ar: "يرجى الانتظار..." },
  "back_to_home": { en: "Back to home", ar: "العودة للرئيسية" },
  "check_email": { en: "Check your email to verify your account!", ar: "تحقق من بريدك الإلكتروني لتأكيد حسابك!" },
  "welcome_back_toast": { en: "Welcome back!", ar: "مرحبًا بعودتك!" },

  // Payment Success
  "pro_member": { en: "You are now a Pro member! 🎉", ar: "أنت الآن عضو Pro! 🎉" },
  "enjoy_unlimited": { en: "Enjoy unlimited script generation, all platforms, and advanced features.", ar: "استمتع بإنشاء نصوص غير محدودة وجميع المنصات والميزات المتقدمة." },
  "start_creating": { en: "Start Creating Scripts", ar: "ابدأ بإنشاء النصوص" },

  // Payment Cancel
  "payment_cancelled": { en: "Payment Cancelled", ar: "تم إلغاء الدفع" },
  "no_worries": { en: "No worries! You can upgrade anytime.", ar: "لا تقلق! يمكنك الترقية في أي وقت." },
  "try_again": { en: "Try Again", ar: "حاول مرة أخرى" },
  "continue_free": { en: "Continue with Free", ar: "المتابعة بالخطة المجانية" },
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
