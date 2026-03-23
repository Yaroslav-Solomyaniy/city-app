# СітіЧЕ — Черкаська міська громада

> Цифровий портал міських послуг та ресурсів Черкаської міської громади.  
> Розроблено КП «Інститут розвитку міста та цифрової трансформації» ЧМР.

---

## Зміст

- [Про проєкт](#про-проєкт)
- [Технологічний стек](#технологічний-стек)
- [Структура проєкту](#структура-проєкту)
- [Бази даних та моделі](#бази-даних-та-моделі)
- [Встановлення та запуск](#встановлення-та-запуск)
- [Змінні середовища](#змінні-середовища)
- [Адміністрування](#адміністрування)
- [API](#api)
- [Скрипти](#скрипти)

---

## Про проєкт

**СітіЧЕ** — це публічний портал міських послуг для мешканців Черкас. Портал дозволяє:

- Переглядати каталог категорій міських послуг та ресурсів
- Шукати ресурси за назвою, описом та тегами
- Фільтрувати ресурси за категоріями та підкатегоріями
- Перемикатись між трьома режимами перегляду: список, сітка, таблиця
- Надсилати зворотній зв'язок та пропозиції щодо ресурсів

**Адмін-панель** дозволяє авторизованим адміністраторам:

- Керувати категоріями, підкатегоріями та ресурсами
- Переглядати та опрацьовувати зворотній зв'язок від користувачів
- Запрошувати нових адміністраторів через email
- Переглядати журнал активності (логи всіх дій)

---

## Технологічний стек

### Фронтенд
| Технологія | Версія | Призначення |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | App Router, SSR, Server Actions |
| [React](https://react.dev) | 19 | UI |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Типізація |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Стилізація |
| [shadcn/ui](https://ui.shadcn.com) | 4 | UI компоненти (Button, Dialog, Table, Tabs, Badge, etc.) |
| [Radix UI](https://radix-ui.com) | 1.4 | Headless UI primitives |
| [Lucide React](https://lucide.dev) | 0.577 | Іконки |
| [nuqs](https://nuqs.47ng.com) | 2.8 | URL state management (search params) |
| [Motion](https://motion.dev) | 12 | Анімації |
| [Sonner](https://sonner.emilkowal.ski) | 2 | Toast сповіщення |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Dark/light mode |

### Бекенд
| Технологія | Версія | Призначення |
|---|---|---|
| [Prisma](https://prisma.io) | 7.5 | ORM, міграції |
| [@prisma/adapter-pg](https://github.com/prisma/prisma) | 7.4 | PostgreSQL адаптер |
| [PostgreSQL](https://postgresql.org) | — | База даних |
| [better-auth](https://better-auth.com) | 1.5 | Автентифікація (сесії, акаунти) |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6 | Хешування паролів |
| [Nodemailer](https://nodemailer.com) | 7 | Відправка email (запрошення) |
| [Zod](https://zod.dev) | 4 | Валідація даних |
| [Slugify](https://github.com/simov/slugify) | 1.6 | Генерація slug |

### Інструменти розробки
| Інструмент | Призначення |
|---|---|
| ESLint | Лінтинг |
| Prettier | Форматування |
| Turbopack | Dev сервер (швидкий білд) |

---

## Структура проєкту

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Головна сторінка
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Глобальні стилі
│   │
│   ├── about/                    # Сторінка "Про портал"
│   │   └── _components/          # Форма зворотного зв'язку
│   │
│   ├── resources/                # Перелік всіх ресурсів
│   │   └── client-page.tsx       # Клієнтська частина з пошуком/фільтрами
│   │
│   ├── categories/               # Каталог категорій
│   │   ├── client-page.tsx       # Список категорій
│   │   ├── [slug]/               # Сторінка категорії
│   │   │   ├── client-page.tsx
│   │   │   └── [subSlug]/        # Сторінка підкатегорії
│   │   └── _components/          # Grid, List, Table для категорій
│   │
│   ├── admin/                    # Адмін-панель (захищена)
│   │   ├── layout.tsx            # Layout з sidebar
│   │   ├── page.tsx              # Дашборд
│   │   ├── categories/           # Управління категоріями
│   │   │   └── [id]/             # Детальна сторінка категорії
│   │   ├── resources/            # Управління ресурсами
│   │   ├── feedback/             # Зворотній зв'язок
│   │   ├── logs/                 # Журнал активності
│   │   └── administrators/       # Управління адміністраторами
│   │
│   ├── auth/                     # Автентифікація
│   │   ├── sign-in/              # Сторінка входу
│   │   └── register/[token]/     # Реєстрація за запрошенням
│   │
│   └── api/                      # API роути
│       ├── auth/                 # better-auth handlers + invite/register
│       └── upload/               # Завантаження зображень
│
├── actions/                      # Server Actions
│   ├── category/                 # CRUD категорій + get з фільтрами
│   ├── resource/                 # CRUD ресурсів + get з фільтрами
│   ├── sub-category/             # CRUD підкатегорій
│   ├── feedback/                 # Отримання та оновлення feedback
│   ├── logs/                     # Отримання логів
│   ├── administrators/           # Управління адмінами (invite, delete)
│   └── auth/                     # sign-up, verify-token
│
├── components/                   # Компоненти
│   ├── ui/                       # shadcn/ui компоненти
│   ├── page-sidebar/             # PageLayout, SidebarViewToggle, Search
│   ├── admin/                    # Компоненти адмін-панелі
│   ├── active-filters.tsx        # Активні фільтри з кнопками скидання
│   ├── categories-count-list.tsx # Список категорій з лічильниками
│   ├── empty-state.tsx           # Empty state (search/empty variants)
│   ├── mobile-fab.tsx            # Floating кнопка "вгору" на мобільному
│   ├── results-count.tsx         # Лічильник результатів з plural
│   ├── sidebar-card.tsx          # Картка сайдбару з заголовком
│   ├── sidebar-stats.tsx         # Статистичні показники в сайдбарі
│   ├── image-upload.tsx          # Завантаження зображень
│   ├── header.tsx                # Хедер сайту
│   ├── admin-sidebar.tsx         # Сайдбар адмін-панелі
│   └── hero.tsx                  # Hero секція головної
│
├── prisma/
│   └── schema.prisma             # Схема БД
│
├── lib/
│   ├── auth.ts                   # better-auth конфігурація
│   ├── prisma.ts                 # Prisma клієнт
│   ├── format-date.ts            # Форматування дат (date-fns)
│   ├── plural.ts                 # Українська множина слів
│   └── slug.ts                   # Генерація slug
│
├── constants/
│   ├── view-mode.ts              # ViewMode enum (list/grid/table)
│   ├── icon-map.ts               # Маппінг іконок Lucide
│   ├── nav.ts                    # Навігаційні посилання
│   └── routes.ts                 # Роути додатку
│
└── types/
    ├── action.ts                 # TypeScript типи для Server Actions
    └── feedback.ts               # Типи для feedback
```

---

## Бази даних та моделі

### Схема PostgreSQL (Prisma)

#### `User` — Адміністратори
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastSeenAt    DateTime?
}
```

#### `Category` — Категорії послуг
```prisma
model Category {
  id          String   @id @default(cuid())
  title       String   // "Здоров'я"
  titleEn     String   // "Health"
  slug        String   @unique
  iconName    String   // "Heart" — назва Lucide іконки
  photo       String   // URL фото
  description String
  accent      String   @default("#3b82f6")  // HEX акцент
  bg          String   @default("#eff6ff")  // HEX фон іконки
  order       Int      @default(0)
  services    String[]                       // Теги послуг
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### `Subcategory` — Підкатегорії
```prisma
model Subcategory {
  id          String   @id @default(cuid())
  title       String
  titleEn     String
  description String
  slug        String   @unique
  order       Int      @default(0)
  categoryId  String   // FK → Category
  createdAt   DateTime @default(now())
}
```

#### `Resource` — Ресурси (посилання)
```prisma
model Resource {
  id            String   @id @default(cuid())
  title         String
  icon          String
  description   String?
  url           String
  tags          String[]
  order         Int      @default(0)
  categoryId    String   // FK → Category
  subcategoryId String?  // FK → Subcategory (опціонально)
  createdAt     DateTime @default(now())
}
```

#### `Feedback` — Зворотній зв'язок
```prisma
enum FeedbackType   { FEEDBACK | ADD_RESOURCE | REMOVE_RESOURCE | ADD_CATEGORY }
enum FeedbackStatus { NEW | REVIEWED | RESOLVED }

model Feedback {
  id      String         @id @default(cuid())
  type    FeedbackType   @default(FEEDBACK)
  status  FeedbackStatus @default(NEW)
  subject String
  message String
  author  String
  email   String
  createdAt DateTime @default(now())
}
```

#### `ActivityLog` — Журнал активності
```prisma
enum LogAction { CREATE | EDIT | DELETE | LOGIN | LOGOUT | INVITE }
enum LogEntity { CATEGORY | SUBCATEGORY | RESOURCE | ADMIN | SETTINGS }

model ActivityLog {
  id         String    @id @default(cuid())
  action     LogAction
  entity     LogEntity
  entityName String    // snapshot назви
  details    String?
  userId     String?
  userName   String    // snapshot імені
  createdAt  DateTime  @default(now())
}
```

#### `InviteToken` — Токени запрошень
```prisma
model InviteToken {
  id        String   @id @default(cuid())
  token     String   @unique @default(cuid())
  email     String
  used      Boolean  @default(false)
  expires   DateTime
  createdBy String   // FK → User
  createdAt DateTime @default(now())
}
```

---

## Встановлення та запуск

### Вимоги
- Node.js >= 18
- PostgreSQL >= 14
- npm або yarn

### 1. Клонування репозиторію
```bash
git clone <repo-url>
cd city_next_app
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування змінних середовища
```bash
cp .env.example .env
# Відредагуйте .env (див. розділ нижче)
```

### 4. Генерація Prisma клієнта
```bash
npx prisma generate
```

### 5. Застосування міграцій
```bash
npx prisma migrate deploy
# або для розробки:
npx prisma migrate dev
```

### 6. Запуск dev сервера
```bash
npm run dev
```

Додаток буде доступний за адресою [http://localhost:3000](http://localhost:3000)

### 7. Білд для продакшн
```bash
npm run build
npm run start
```

---

## Змінні середовища

Створіть файл `.env` в корені проєкту:

```env
# База даних PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# better-auth
BETTER_AUTH_SECRET=           # Випадковий рядок (мін. 32 символи)
BETTER_AUTH_URL=              # URL додатку (напр. http://localhost:3000)
BETTER_AUTH_TRUSTED_ORIGINS=  # Дозволені origins (через кому)

# Email (SMTP для запрошень)
EMAIL_SERVER_USER=            # SMTP логін
EMAIL_SERVER_PASSWORD=        # SMTP пароль
EMAIL_SERVER_HOST=            # SMTP хост (напр. smtp.gmail.com)
EMAIL_SERVER_PORT=            # SMTP порт (напр. 465)
EMAIL_FROM=                   # Адреса відправника
```

---

## Адміністрування

### Перший адміністратор

Перший адміністратор створюється через пряму реєстрацію або через seed скрипт. Всі наступні — виключно через систему запрошень.

### Запрошення адміністратора

1. Увійдіть в адмін-панель → **Адміністратори**
2. Натисніть **Запросити адміністратора**
3. Введіть email — на нього прийде лист із посиланням
4. Посилання діє **24 години** і одноразове

### Доступ до адмін-панелі

Адмін-панель доступна за адресою `/admin`. Вимагає автентифікації.

---

## API

### `POST /api/upload`
Завантаження зображення (категорії).  
**Body:** `FormData` з полем `file`  
**Response:** `{ url: string }`

### `DELETE /api/upload`
Видалення зображення.  
**Body:** `{ url: string }`

### `GET/POST /api/auth/[...all]`
better-auth обробники (сесії, вихід, тощо).

### `POST /api/auth/invite`
Відправка запрошення на email.

### `GET /api/auth/invite/verify?token=...`
Перевірка токену запрошення.

### `POST /api/auth/register`
Реєстрація за токеном запрошення.

---

## Скрипти

```bash
npm run dev          # Dev сервер з Turbopack
npm run build        # Продакшн білд
npm run start        # Запуск продакшн сервера
npm run lint         # ESLint перевірка
npm run format       # Prettier форматування
npm run typecheck    # TypeScript перевірка типів
```

```bash
npx prisma studio    # GUI для БД
npx prisma generate  # Генерація клієнта
npx prisma migrate dev --name <name>  # Нова міграція
```

---

## shadcn/ui компоненти

Встановлення нових компонентів:

```bash
npx shadcn@latest add button dialog card input separator table toggle-group dropdown-menu badge select tabs
```

---

## Ліцензія

Приватний проєкт. КП «Інститут розвитку міста та цифрової трансформації» ЧМР © 2026