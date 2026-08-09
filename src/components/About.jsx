import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

const ACCENT = 'oklch(0.82 0.09 48)'

// часы наиграно в steam, по убыванию
const GAMES = [
  { name: 'Counter-Strike 2', hours: 1694.6 },
  { name: 'Rust', hours: 1218.6 },
  { name: 'STALZONE', hours: 1191.8 },
  { name: 'Apex Legends', hours: 516.8 },
  { name: 'PUBG: BATTLEGROUNDS', hours: 316.4 },
]

export default function About() {
  const { t, lang } = useLanguage()
  const groups = t('about.groups')
  const scopeRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 16,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, scopeRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={scopeRef} className="min-h-svh px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 data-reveal className="font-display text-2xl font-semibold lowercase tracking-tight md:text-3xl">
          {t('nav.about')}
        </h1>

        <p data-reveal className="mt-6 text-sm leading-relaxed text-muted md:text-base">
          {t('about.bio')}
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {groups.map((group) => (
            <div key={group.title} data-reveal>
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{group.title}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-ink/20 px-3 py-1 text-xs lowercase tracking-wide backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div data-reveal>
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{t('about.gamesTitle')}</div>
            <GamesChart lang={lang} unit={t('about.hoursUnit')} />
          </div>
        </div>
      </div>
    </main>
  )
}

function GamesChart({ lang, unit }) {
  const max = Math.max(...GAMES.map((g) => g.hours))
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US'

  return (
    <div className="mt-4 flex flex-col gap-3">
      {GAMES.map((g) => (
        <div key={g.name} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs lowercase tracking-wide text-muted md:w-40">
            {g.name}
          </span>
          <div className="h-[10px] flex-1 overflow-hidden rounded-r-[4px] bg-ink/10">
            <div
              className="h-full rounded-r-[4px]"
              style={{ width: `${(g.hours / max) * 100}%`, background: ACCENT }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted">
            {Math.round(g.hours).toLocaleString(locale)} {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
