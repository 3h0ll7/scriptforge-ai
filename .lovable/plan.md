# تفعيل دفعات Paddle وحصّة التجربة المجانية

## الملاحظات الحالية
- مساحة العمل على خطة **Free** في Lovable.
- Lovable Payments (Paddle/Stripe) يتطلب خطة **Pro** أو أعلى.
- صفحات المصادقة والتسجيل (`/auth`, `/settings`, `/pricing`) موجودة ومتصلة بـ `AuthProvider`.
- عداد الاستخدام `UsageBadge` موجود في الـ Navbar لكنه يعرض نصوصًا إنجليزية غير مترجمة.
- دالة `generate-script` لا تتحقق حاليًا من JWT ولا تحسب الحد الشهري (`verify_jwt = false`).
- `create-checkout` و `payment-webhook` ما زالتا تستخدمان Gammal Tech.
- الجداول `profiles` و `usage_tracking` و `generation_history` موجودة مع RLS.

## الخطة

### 1. شرط مسبق: الترقية إلى Pro
- يجب رفع اشتراك مساحة العمل إلى **Pro** من Settings → Plans & credits قبل تفعيل أي مدفوعات مدمجة.
- لا يمكن للعميل تنفيذ هذه الخطوة نيابة عن المستخدم.

### 2. اختيار مزوّد الدفع
- التحقق من الأهلية أوصى بـ **Paddle** كأفضل مزوّد لتطبيق SaaS رقمي (توليد نصوص فيديو) لأنه يتولى الضرائب والامتثال تلقائيًا.
- بعد الترقية إلى Pro، تفعيل Paddle Payments عبر `enable_paddle_payments`.

### 3. إنشاء منتجات Paddle
- إنشاء منتجين:
  - **Pro Monthly** — $3/شهر.
  - **Pro Yearly** — $24/سنة (وفر 33%).
- ربط السعرين بزر الترقية في الواجهة.

### 4. استبدال بوابة الدفع الحالية
- استبدال دالة `create-checkout` لتستخدم Paddle checkout بدل Gammal Tech.
- تحديث دالة `payment-webhook` لتستجيب لأحداث Paddle (أو استخدام الـ webhook المدمج إن توفر).
- إزالة/تنظيف أسرار Gammal Tech (`GAMMAL_TECH_CHECKOUT_URL`) والكود المرتبط.
- إزالة ملف `public/gammal-tech.html` بعد التأكد من أنه لم يعد مطلوبًا.

### 5. حماية التوليد من السيرفر
- في `supabase/config.toml`: إعادة تعيين `verify_jwt = true` لـ `generate-script`.
- في دالة `generate-script`:
  - التحقق من المستخدم عبر JWT.
  - قراءة/زيادة `usage_tracking` بعد كل توليد ناجح.
  - رفض الطلب بحالة 402 إذا وصل المستخدم المجاني إلى 5 نصوص هذا الشهر.
  - حفظ معاينة النص في `generation_history`.

### 6. بوابة التوليد في الواجهة
- في `src/pages/Index.tsx`:
  - غير مسجّل → توجيه إلى `/auth`.
  - مسجّل + مجاني + وصل 5/5 → عرض `PaywallModal`.
  - غير ذلك → استدعاء `generateScript`.
- تحديث `UsageBadge` لاستخدام مفاتيح الترجمة بدلاً من النص الإنجليزي المكتوب يدويًا.
- تحديث `PaywallModal` ليعرض السعرين ويؤدي إلى `/pricing`.

### 7. صفحة الأسعار
- تحديث `src/pages/Pricing.tsx`:
  - استخدام Paddle checkout بدل `supabase.functions.invoke("create-checkout")` القديم.
  - إبقاء التبديل بين شهري/سنوي والترجمة العربية/الإنجليزية.
  - تحديث الـ FAQ إذا لزم الأمر لتعكس Paddle.

### 8. تحديث الذاكرة والتوثيق
- تحديث `mem://index.md` لإزالة قاعدة "Gammal Tech فقط".
- إضافة/تحديث ملف ذاكرة المدفوعات لتسجيل أن Paddle هو المزوّد المعتمد حاليًا.

## خارج النطاق
- لا تغيير في منطق كتابة النص أو تصميم الواجهة الأساسي.
- لا تغيير في نظام الثيم/اللغة.

## ما سيتطلب موافقتك
1. الموافقة على هذه الخطة.
2. الترقية إلى Pro في Lovable قبل تفعيل Paddle.
