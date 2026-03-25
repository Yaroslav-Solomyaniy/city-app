# Деплой СітіЧЕ на VM

## Vercel vs VM — що обрати?

| | Vercel | VM (самостійно) |
|---|---|---|
| 1000 одночасних юзерів | ✅ Витримає (serverless scale) | ✅ Витримає (Node.js + nginx) |
| БД на VM | ⚠️ Затримка Vercel→VM ~20-50ms | ✅ Все локально, <1ms |
| SSL / домен | ✅ Автоматично | Треба налаштувати nginx + certbot |
| Деплой | ✅ Автоматично при push | Ручний або скрипт |
| Вартість | Free tier / Pro $20/міс | Тільки VM |

**Висновок:** якщо БД на VM — краще тримати додаток там само. Latency між Vercel і твоєю VM може бути помітна під навантаженням.

---

## Структура на сервері

```
/srv/sites/city-app/
├── .env                    ← секрети (НЕ в git)
├── Dockerfile              ← production збірка
├── docker-compose.prod.yml
└── deploy.sh               ← одна команда для редеплою
```

---

## Перший запуск

### 1. Клонувати репо

```bash
cd /srv/sites
git clone https://github.com/Yaroslav-Solomyaniy/city-app.git city-app
cd city-app
```

### 2. Створити `.env`

```bash
nano .env
```

Мінімальний вміст:

```env
DATABASE_URL=postgresql://city:zR8mK3vPqT5sL1dX9@localhost:16743/citydb
NEXT_PUBLIC_APP_URL=https://city-che.ck.ua

# Better Auth
BETTER_AUTH_SECRET=<згенеруй: openssl rand -hex 32>
BETTER_AUTH_URL=https://city-che.ck.ua

# UploadThing
UPLOADTHING_TOKEN=<з uploadthing.com>
```

### 3. Збудувати і запустити

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 4. Міграції БД

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

---

## Nginx — налаштування для city-che.ck.ua

### Встановити certbot (якщо ще немає)

```bash
apt install certbot python3-certbot-nginx -y
```

### Конфіг `/etc/nginx/sites-available/city-che`

```nginx
server {
    listen 80;
    server_name city-che.ck.ua;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name city-che.ck.ua;

    ssl_certificate     /etc/letsencrypt/live/city-che.ck.ua/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/city-che.ck.ua/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    client_max_body_size 50M;

    location / {
        proxy_pass         http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/city-che /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# SSL сертифікат
certbot --nginx -d city-che.ck.ua
```

---

## Ручний редеплой

```bash
bash /srv/sites/city-app/deploy.sh
```

Скрипт виконує:
1. `git pull origin master`
2. Збирає новий Docker образ
3. Перезапускає лише `app` контейнер (postgres не чіпає)
4. Запускає `prisma migrate deploy`

---

## Автоматичний редеплой (GitHub Actions)

Створи файл `.github/workflows/deploy.yml` у репо:

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VM_HOST }}
          username: root
          key: ${{ secrets.VM_SSH_KEY }}
          script: bash /srv/sites/city-app/deploy.sh
```

У налаштуваннях GitHub репо → Settings → Secrets додай:
- `VM_HOST` — IP або домен VM
- `VM_SSH_KEY` — приватний SSH ключ (`cat ~/.ssh/id_rsa`)

Після цього кожен `git push` в `master` → автоматичний деплой.

---

## Корисні команди

```bash
# Логи додатку
docker logs cityche_app -f

# Статус контейнерів
docker compose -f docker-compose.prod.yml ps

# Перезапустити тільки app
docker compose -f docker-compose.prod.yml restart app

# Зайти в контейнер
docker compose -f docker-compose.prod.yml exec app sh

# Prisma Studio (підключитись до БД)
docker compose -f docker-compose.prod.yml exec app npx prisma studio
```
