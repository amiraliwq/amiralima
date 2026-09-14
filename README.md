# امیرعلی | AmirAli Academy

پلتفرم فارسی RTL برای فروشگاه، آموزش آنلاین (LMS) و آکادمی رباتیک.

## معماری
- Frontend: React + Vite + Tailwind CSS + Lucide
- Backend: Node.js + Express REST API
- Database: PostgreSQL + Drizzle ORM
- Auth: HttpOnly session/JWT cookie + bcrypt
- LMS: دوره‌ها، جلسات زمان‌بندی‌شده، کلاس آنلاین، تکالیف
- Store: محصولات دیجیتال و سخت‌افزار، سبد خرید و سفارش
- Payment: کارت‌به‌کارت + آپلود فیش + بررسی OCR/AI + تأیید مدیر

## امنیت
- ویدئوها و فایل‌های خریداری‌شده URL عمومی ندارند و از route محافظت‌شده سرو می‌شوند.
- دسترسی LMS فقط با enrollment فعال و پس از unlock_date امکان‌پذیر است.
- اطلاعات حساس پرداخت و حساب مدیر باید در Environment/Secrets نگهداری شوند.
- رمز عبور فقط به‌صورت bcrypt hash ذخیره می‌شود.

## نقش‌ها
- `admin`: مدیریت سفارش‌ها، دوره‌ها، جلسات، کلاس‌ها، تکالیف، محصولات و کاربران
- `user`: خرید، مشاهده دوره‌های فعال، کلاس آنلاین و ارسال تکلیف

## توسعه
فایل `.env.example` را به `.env` تبدیل کنید و مقادیر PostgreSQL، session secret و سرویس OCR را تنظیم کنید.
