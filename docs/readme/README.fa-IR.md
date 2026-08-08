# Pic Smaller (图小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — نسخه پرچمدار
> **قدرت بومی بی‌چون‌و‌چرا، فراتر از مرورگر.**
>
> گردش کار خود را با نسخه پرچمدار Pic Smaller Desktop ارتقا دهید. یک برنامه بومی اختصاصی که برای حرفه‌ای‌هایی ساخته شده که به کمتر از بهترین رضایت نمی‌دهند — فایل‌های حجیم و کتابخانه‌های کامل پوشه‌ها را به آسانی پردازش می‌کند، بیش از ۱۶ فرمت تصویری را پشتیبانی کرده و عملکرد پردازشی برتری ارائه می‌دهد. مجموعه پیشرفته‌ای از ابزارهای هوش مصنوعی — حذف پس‌زمینه، حذف واترمارک و بزرگ‌نمایی با کیفیت بالا — تجربه را کامل می‌کند.
>
> [![کاوش Pic Smaller Desktop](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller یک فشرده‌ساز تصاویر دسته‌ای رایگان و متن‌باز است که کاملاً در مرورگر
اجرا می‌شود. تصاویر به صورت محلی با Web Workers، WebAssembly، Canvas و کدک‌های
مرورگر پردازش می‌شوند. فایل‌ها هرگز به سرور برنامه آپلود نمی‌شوند.

از نسخه میزبانی‌شده در [picsmaller.com](https://picsmaller.com/) یا
[www.picsmaller.com](https://www.picsmaller.com/) استفاده کنید.

## ویژگی‌ها

- فشرده‌سازی دسته‌ای تصاویر JPEG، PNG، WebP، GIF، SVG و AVIF.
- رمزگشایی محلی فایل‌های HEIC و HEIF و خروجی به JPEG، PNG، WebP یا AVIF.
- تبدیل فرمت، تغییر اندازه، برش و کنترل گزینه‌های کیفیت مخصوص هر کدک.
- افزودن فایل از طریق انتخاب‌گر فایل، انتخاب‌گر پوشه، کشیدن و رها کردن یا چسباندن.
- مقایسه تصویر اصلی و فشرده‌شده با نمای تقسیم‌شده تعاملی.
- دانلود نتایج تکی یا ذخیره کل دسته به صورت آرشیو ZIP.
- حریم خصوصی شما محفوظ است: تمام پردازش‌ها روی دستگاه شما باقی می‌ماند.

## تصویر

![فضای کاری Pic Smaller](../demo1.png)

فضای کاری اصلی، ورودی دسته‌ای، نتایج فشرده‌سازی، تنظیمات خروجی و اقدامات
دانلود را در یک نما ادغام می‌کند.

## توسعه

نیازمندی‌ها:

- Node.js 22 LTS یا جدیدتر
- npm 10 یا جدیدتر

```bash
git clone https://github.com/joye61/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

دستورات مفید:

```bash
npm test            # اجرای مجموعه تست
npm run lint        # اجرای ESLint
npm run build       # ساخت سرور مستقل Node.js
npm run build:pages # خروجی سایت استاتیک Cloudflare Pages در out/
```

## استقرار

### Cloudflare Pages

سایت عمومی از Cloudflare Pages با یکپارچه‌سازی مخزن GitHub استفاده می‌کند.
Cloudflare سایت را به طور خودکار با تنظیمات زیر می‌سازد و مستقر می‌کند:

| تنظیم | مقدار |
| --- | --- |
| شاخه تولید | `master` |
| شاخه پیش‌نمایش | `develop` |
| دستور ساخت | `npm run build:pages` |
| پوشه خروجی | `out` |
| نسخه Node.js | `22` |

push به `master` محیط تولید را به‌روز می‌کند. push به `develop` استقرار
پیش‌نمایش ایجاد می‌کند. شاخه‌های دیگر به طور خودکار مستقر نمی‌شوند.

ساخت Pages فایل `404.html` سطح بالای تولیدشده توسط Next.js را حذف می‌کند
تا Cloudflare Pages بتواند بازگشت بومی برنامه تک‌صفحه‌ای خود را اعمال کند.

### Docker

تصویر Docker جایگزینی برای استقرارهای خصوصی یا خودمیزبان است.
از خروجی مستقل Next.js استفاده می‌کند، به عنوان کاربر غیرممتاز `node` اجرا
می‌شود، سیگنال‌ها را از طریق `tini` مدیریت کرده و شامل بررسی سلامت کانتینر است.

```bash
docker build --pull -t pic-smaller:latest .

docker run -d \
  --name pic-smaller \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 127.0.0.1:3000:3000 \
  pic-smaller:latest
```

`http://127.0.0.1:3000` را باز کنید. برای دسترسی عمومی، کانتینر را پشت یک
پراکسی معکوس پایان‌دهنده TLS مانند Caddy، nginx یا Traefik قرار دهید.
پیشوند `127.0.0.1:` را تنها زمانی حذف کنید که نمایش مستقیم شبکه عمدی باشد.

### رمزها و پیکربندی

این برنامه وب به کلید API نیاز ندارد. هرگز اعتبارنامه‌ها،
توکن‌های Cloudflare، فایل‌های `.env`، `.dev.vars`، کلیدهای خصوصی یا
وضعیت محلی Wrangler را commit نکنید. قوانین نادیده‌گیری مخزن این فایل‌ها
را مستثنی می‌کند. اگر ویژگی آینده به رمز نیاز داشت، آن را در مدیر رمز
پلتفرم استقرار ذخیره کرده و تنها نام‌های جایگزین مستندشده را در
فایل `.env.example` ارائه دهید.

## ساختار پروژه

- `src/app/`: نقاط ورودی برنامه Next.js.
- `src/components/`: اجزای رابط کاربری قابل استفاده مجدد.
- `src/engines/`: کدک‌های مرورگر، workerها، تبدیل‌ها و صف فشرده‌سازی.
- `src/locales/`: ترجمه‌ها.
- `src/views/`: نماهای برنامه.
- `public/`: کدک‌های مرورگر و دارایی‌های WebAssembly آماده‌شده در حین ساخت.
- `scripts/`: آماده‌سازی کدک‌ها و اسکریپت‌های کمکی استقرار.
- `tests/`: مجموعه تست Node.js.

## مشارکت

1. یک شاخه از `develop` ایجاد کنید.
2. `npm test`، `npm run lint` و ساخت تولید مربوطه را اجرا کنید.
3. در صورت تغییر رفتار یا رابط، مستندات و تصاویر را به‌روز کنید.
4. یک Pull Request متمرکز با توضیحات شفاف و یادداشت‌های تأیید ارسال کنید.

## مجوز

Pic Smaller تحت [مجوز MIT](./LICENSE) در دسترس است.

## قدردانی

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) برای کدک‌های AVIF، ImageQuant و OxiPNG.
- [heic-to](https://github.com/hoppergee/heic-to) برای رمزگشایی HEIC و HEIF در سمت مرورگر.
- [SVGO](https://github.com/svg/svgo) برای بهینه‌سازی SVG.
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) برای فشرده‌سازی GIF.
