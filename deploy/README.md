# Деплой ADASTRA (Timeweb / VPS)

## Требования

- Node.js 20+
- npm
- домен с DNS на сервер (A-запись)

## Шаги

1. Скопируйте проект на сервер.
2. Создайте `.env` из `.env.example` и заполните:
   - `DATABASE_URL="file:./prod.db"`
   - `NEXT_PUBLIC_SITE_URL="https://adastrashop.com"`
   - **Демо:** `NEXT_PUBLIC_ALLOW_INDEXING=false` (robots Disallow, пустой sitemap, `X-Robots-Tag: noindex`). Не добавлять демо в Яндекс.Вебмастер.
   - **Прод:** `NEXT_PUBLIC_ALLOW_INDEXING=true` только после SSL и проверки контента.
   - ключи ЮKassa
   - `MANAGER_EMAIL`
3. Установите зависимости и соберите:

```bash
npm ci
npx prisma db push
npm run build
npm run start
```

4. Поставьте reverse-proxy (nginx) на порт Next.js (3000) с SSL (Let's Encrypt).
5. Webhook ЮKassa: `https://adastrashop.com/api/yookassa/webhook`

## systemd (пример)

```ini
[Unit]
Description=ADASTRA Next.js
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/adastrashop
ExecStart=/usr/bin/npm run start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Пока нет доступа к Timeweb — локально: `npm run dev`.

## GitHub Pages (демо-витрина)

Публичное демо: https://simka1999999-sudo.github.io/adastra-demo/

Сборка: `npm run build:pages` (статический export, `noindex`, без API).
CI: `.github/workflows/pages.yml` на ветке `main`.

Не добавлять демо в Яндекс.Вебмастер. Оплата и webhook ЮKassa на Pages не работают.
