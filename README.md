# ADASTRA Shop

Новый интернет-магазин бренда ADASTRA на Next.js: каталог, корзина, оформление, ЮKassa, SEO под Яндекс.

**Рабочая витрина (VPS Beget, индекс закрыт):**
https://gatidopike.beget.app/

GitHub Pages отключён. Боевой `adastrashop.com` пока не переключали.

## Стек

- Next.js (App Router) + TypeScript + Tailwind CSS
- Товары: `content/products`
- Заказы: SQLite + Prisma
- Оплата: ЮKassa
- Аналитика: Яндекс.Метрика

## Локальный запуск

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Основные URL

- `/` — главная
- `/catalog` — каталог
- `/catalog/[slug]` — карточка
- `/cart`, `/checkout` — корзина и заказ
- `/lookbook`, `/size-guide`, `/delivery`, `/partners`
- `/sitemap.xml`, `/robots.txt`

## Деплой

См. [deploy/README.md](deploy/README.md).
