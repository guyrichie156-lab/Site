import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Вступительный экран-заглушка.
 *
 * Зачем нужен, помимо эстетики: браузеры блокируют autoplay со звуком без
 * жеста пользователя. Клик по "войти" — тот самый жест, который разрешает
 * BackgroundAudio запустить трек (он сам слушает первый pointerdown/keydown
 * на window, отдельная синхронизация не нужна).
 */
export default function Intro() {
  const { t } = useLanguage()
  const [hidden, setHidden] = useState(false)
  const closingRef = useRef(false)
  const overlayRef = useRef(null)
  const btnRef = useRef(null)

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const enter = () => {
    if (closingRef.current) return
    closingRef.current = true
    document.body.style.overflow = ''

    gsap
      .timeline({ onComplete: () => setHidden(true) })
      .to(btnRef.current, { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' })
      .to(
        overlayRef.current,
        { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power3.inOut' },
        '-=0.05',
      )
  }

  if (hidden) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <button
        ref={btnRef}
        onClick={enter}
        className="border border-ink/20 rounded-full px-7 py-2 text-sm lowercase tracking-widest transition-colors duration-300 hover:bg-ink hover:text-paper"
      >
        {t('intro.enter')}
      </button>
    </div>
  )
}
