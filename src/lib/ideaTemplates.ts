import type { LucideIcon } from "lucide-react";
import { BookOpen, Brain, Camera, Coffee, Dumbbell, GraduationCap, Laptop, Megaphone, PiggyBank, Plane, Rocket, Stethoscope } from "lucide-react";
import type { ScriptInput } from "@/components/ScriptForm";

export const platformLabels: Record<string, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  reels: "Reels",
  course: "Course",
  webinar: "Webinar",
};

type Localized = { en: string; ar: string };

export interface IdeaTemplate {
  id: string;
  icon: LucideIcon;
  /** Two HSL stops used for the card thumbnail gradient. */
  colors: [string, string];
  title: Localized;
  audience: Localized;
  values: Pick<ScriptInput, "platform" | "targetDuration" | "tone">;
}

export const ideaTemplates: IdeaTemplate[] = [
  {
    id: "morning-habits",
    icon: Coffee,
    colors: ["28 92% 68%", "350 85% 66%"],
    title: { en: "5 morning habits that changed my life", ar: "5 عادات صباحية غيّرت حياتي" },
    audience: { en: "Young professionals building routines", ar: "موظفون شباب يبنون روتيناً يومياً" },
    values: { platform: "youtube", targetDuration: "5min", tone: "motivational" },
  },
  {
    id: "ai-tools",
    icon: Laptop,
    colors: ["250 80% 68%", "200 85% 60%"],
    title: { en: "3 AI tools that save me 10 hours a week", ar: "3 أدوات ذكاء اصطناعي توفر لي 10 ساعات أسبوعياً" },
    audience: { en: "Freelancers and creators", ar: "المستقلون وصنّاع المحتوى" },
    values: { platform: "tiktok", targetDuration: "60s", tone: "entertaining" },
  },
  {
    id: "nurse-shift",
    icon: Stethoscope,
    colors: ["170 60% 52%", "200 70% 55%"],
    title: { en: "A night shift nurse's survival kit", ar: "عدة البقاء لممرض الشفت الليلي" },
    audience: { en: "Nursing students and new nurses", ar: "طلاب التمريض والممرضون الجدد" },
    values: { platform: "reels", targetDuration: "30s", tone: "casual" },
  },
  {
    id: "budget",
    icon: PiggyBank,
    colors: ["145 55% 52%", "80 65% 58%"],
    title: { en: "The 50/30/20 budget explained simply", ar: "شرح ميزانية 50/30/20 ببساطة" },
    audience: { en: "Students with their first income", ar: "طلاب لديهم أول دخل" },
    values: { platform: "youtube", targetDuration: "3min", tone: "educational" },
  },
  {
    id: "startup",
    icon: Rocket,
    colors: ["336 80% 62%", "280 70% 62%"],
    title: { en: "How I validated my SaaS idea in 7 days", ar: "كيف اختبرت فكرة مشروعي SaaS في 7 أيام" },
    audience: { en: "Indie hackers and founders", ar: "روّاد الأعمال والمؤسسون" },
    values: { platform: "youtube", targetDuration: "10min", tone: "dramatic" },
  },
  {
    id: "home-workout",
    icon: Dumbbell,
    colors: ["12 85% 62%", "40 90% 60%"],
    title: { en: "A 10-minute workout with zero equipment", ar: "تمرين 10 دقائق بدون أي معدات" },
    audience: { en: "Busy people who train at home", ar: "المشغولون الذين يتمرنون في المنزل" },
    values: { platform: "tiktok", targetDuration: "60s", tone: "motivational" },
  },
  {
    id: "study",
    icon: Brain,
    colors: ["265 60% 66%", "320 65% 66%"],
    title: { en: "Active recall: study less, remember more", ar: "الاسترجاع النشط: ادرس أقل وتذكّر أكثر" },
    audience: { en: "University students before exams", ar: "طلاب الجامعة قبل الامتحانات" },
    values: { platform: "course", targetDuration: "15min+", tone: "educational" },
  },
  {
    id: "travel",
    icon: Plane,
    colors: ["195 80% 58%", "160 60% 55%"],
    title: { en: "Hidden gems most tourists miss", ar: "أماكن مخفية يفوتها أغلب السيّاح" },
    audience: { en: "Budget travelers", ar: "المسافرون بميزانية محدودة" },
    values: { platform: "reels", targetDuration: "60s", tone: "entertaining" },
  },
  {
    id: "launch",
    icon: Megaphone,
    colors: ["45 92% 60%", "18 88% 62%"],
    title: { en: "Launch day: what we learned shipping v1", ar: "يوم الإطلاق: ما تعلمناه من الإصدار الأول" },
    audience: { en: "Product teams and early customers", ar: "فرق المنتجات والعملاء الأوائل" },
    values: { platform: "webinar", targetDuration: "15min+", tone: "casual" },
  },
  {
    id: "photo",
    icon: Camera,
    colors: ["220 25% 30%", "250 35% 50%"],
    title: { en: "Phone photography tricks pros use", ar: "حيل تصوير بالهاتف يستخدمها المحترفون" },
    audience: { en: "Beginner content creators", ar: "صنّاع المحتوى المبتدئون" },
    values: { platform: "tiktok", targetDuration: "30s", tone: "educational" },
  },
  {
    id: "reading",
    icon: BookOpen,
    colors: ["30 55% 60%", "10 50% 55%"],
    title: { en: "One book that rewired how I think", ar: "كتاب واحد غيّر طريقة تفكيري" },
    audience: { en: "Self-improvement readers", ar: "قرّاء تطوير الذات" },
    values: { platform: "youtube", targetDuration: "5min", tone: "dramatic" },
  },
  {
    id: "exam-course",
    icon: GraduationCap,
    colors: ["210 75% 55%", "240 65% 62%"],
    title: { en: "Exam prep module: mastering priority questions", ar: "وحدة تحضير: إتقان أسئلة الأولويات" },
    audience: { en: "Students preparing for licensing exams", ar: "طلاب يستعدون لامتحانات الترخيص" },
    values: { platform: "course", targetDuration: "10min", tone: "educational" },
  },
];
