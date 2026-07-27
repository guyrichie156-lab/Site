# yeqq-site — hero + меню

Стек: Vite 6 + React 19 + Tailwind CSS v4 (@tailwindcss/vite) + GSAP 3 + react-router-dom 7.

## Запуск

```bash
npm install
npm run dev
```

## Что заменить под себя

| Где | Что |
|---|---|
| `public/hero.mp4` | положи своё видео (сейчас файла нет — виден плейсхолдер-рамка) |
| `public/hero-poster.jpg` | постер для видео (опционально) |
| `src/i18n/translations.js` | псевдоним (`hero.alias`), страна, текст бегущей строки, пункты меню |
| `index.html` | `<title>` |

## Как устроено

- **Header** (`src/components/Header.jsx`)
  - слева кнопка «связь» → маршрут `/contact`
  - в центре кнопка «меню» — раскрывается капсулой вниз (GSAP timeline:
    height + stagger ссылок, play/reverse — повторные клики не ломают анимацию)
  - справа переключатель `ru/en`, выбор хранится в localStorage
- **Hero** (`src/components/Hero.jsx`)
  - над видео: живые часы (HH:MM:SS) + страна
  - видео по центру (autoplay/muted/loop)
  - под видео псевдоним автора
- **MarqueeLine** (`src/components/MarqueeLine.jsx`)
  - бесшовная бегущая строка на `gsap.ticker` + `gsap.utils.wrap`
  - направление зависит от стороны курсора относительно центра видео
  - скорость меняется плавно (экспоненциальный lerp, независимый от FPS) —
    без рывков при пересечении центра

## Роуты-заглушки

`/contact`, `/works`, `/about` — заглушки в `App.jsx`, кнопки меню уже рабочие.

## Примечание по Tailwind v4

Конфиг — прямо в `src/index.css` через `@theme` (цвета `paper`, `ink`, `muted`).
Файлы `tailwind.config.js` и `postcss.config.js` не нужны — это штатная схема v4
с плагином `@tailwindcss/vite` (см. tailwindcss.com/docs/installation/using-vite).
