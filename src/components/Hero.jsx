import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import MarqueeLine from './MarqueeLine.jsx'

/** Живые часы. Формат HH:MM:SS по локальному времени посетителя. */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function Hero() {
  const { t } = useLanguage()
  const time = useClock()
  const videoRef = useRef(null)

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden pt-24">
      {/* время + страна над видео */}
      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
        <span className="tabular-nums">{time}</span>
        <span aria-hidden="true">·</span>
        <span>{t('hero.country')}</span>
      </div>

      {/* видео по центру.
          Положи свой ролик в public/hero.mp4 (и постер public/hero-poster.jpg).
          Пока файла нет — блок остаётся как рамка-плейсхолдер. */}
      <div
        ref={videoRef}
        className="relative z-10 aspect-video h-[min(44vh,405px)] w-auto max-w-[min(72vw,720px)] overflow-hidden rounded-2xl border border-ink/15 bg-ink/5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]"
      >
        <video
          className="h-full w-full object-cover"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* псевдоним автора под видео */}
      <p className="mt-5 text-sm lowercase tracking-wide">{t('hero.alias')}</p>

      {/* бегущая строка; направление зависит от стороны курсора
          относительно видео (anchorRef) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 md:bottom-14">
        <MarqueeLine anchorRef={videoRef} />
      </div>
    </section>
  )
}
