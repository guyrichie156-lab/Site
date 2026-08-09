import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Вступительный экран.
 *
 * Фазы: load (счётчик) -> ready (кнопка) -> closing (вайп) -> done.
 * Сайт под оверлеем "наплывает": scale + blur (см. #site-root в App.jsx).
 */
const LOADER_SECONDS = 2
const REVEAL_SECONDS = 0.9
const WIPE = 'inset(50% 0 50% 0)' // из центра; вверх: 'inset(0 0 100% 0)'; вниз: 'inset(100% 0 0 0)'
const ONCE_PER_SESSION = true

const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))

export default function Intro() {
  const { t } = useLanguage()
  const seen = ONCE_PER_SESSION && sessionStorage.getItem('intro_seen') === '1'

  const [hidden, setHidden] = useState(seen)
  const [phase, setPhase] = useState(seen ? 'done' : 'load')
  const [pct, setPct] = useState(0)

  const overlayRef = useRef(null)
  const innerRef = useRef(null)
  const barRef = useRef(null)
  const closingRef = useRef(false)
  const rafRef = useRef(0)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // блокируем скролл, пока оверлей висит
  useLayoutEffect(() => {
    if (hidden) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [hidden])

  // фаза load: счётчик 000 -> 100%
  useEffect(() => {
    if (hidden || phase !== 'load') return
    if (reduced || LOADER_SECONDS <= 0) {
      setPct(100)
      setPhase('ready')
      return
    }
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / (LOADER_SECONDS * 1000))
      const eased = easeOutExpo(p)
      setPct(Math.round(eased * 100))
      if (barRef.current) gsap.set(barRef.current, { scaleX: eased })
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else setPhase('ready')
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hidden, phase, reduced])

  const enter = useCallback(() => {
    if (closingRef.current || phase !== 'ready') return
    closingRef.current = true
    setPhase('closing')
    document.body.style.overflow = ''
    if (ONCE_PER_SESSION) sessionStorage.setItem('intro_seen', '1')

    const site = document.getElementById('site-root')

    if (reduced) {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => setHidden(true),
      })
      return
    }

    const tl = gsap.timeline({ onComplete: () => setHidden(true) })

    tl.to(innerRef.current, {
      autoAlpha: 0,
      y: -10,
      duration: REVEAL_SECONDS * 0.25,
      ease: 'power2.in',
    }).to(
      overlayRef.current,
      { clipPath: WIPE, duration: REVEAL_SECONDS * 0.88, ease: 'power3.inOut' },
      '-=0.05',
    )

    if (site) {
      tl.fromTo(
        site,
        { scale: 1.04, filter: 'blur(6px)', autoAlpha: 0.4 },
        {
          scale: 1,
          filter: 'blur(0px)',
          autoAlpha: 1,
          duration: REVEAL_SECONDS * 0.8,
          ease: 'power3.out',
          clearProps: 'transform,filter,opacity,visibility',
        },
        0.1,
      )
    }
  }, [phase, reduced])

  // Enter с клавиатуры делает то же, что клик
  useEffect(() => {
    if (hidden) return
    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hidden, enter])

  if (hidden) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div ref={innerRef} className="flex flex-col items-center gap-[22px]">
        <div className="text-[11px] uppercase tracking-[0.28em] text-muted">
          {t('intro.kicker')}
        </div>

        {/* полоса прогресса */}
        <div className="relative h-px w-[min(320px,56vw)] overflow-hidden bg-ink/15">
          <div
            ref={barRef}
            className="absolute inset-0 origin-left scale-x-0"
            style={{ background: 'oklch(0.82 0.09 48)' }}
          />
        </div>

        {/* фиксированная высота, чтобы вёрстка не прыгала при смене фазы */}
        <div className="flex h-[74px] flex-col items-center justify-center gap-3.5">
          {phase === 'load' && (
            <div className="flex items-center gap-3 text-xs lowercase tracking-[0.18em] text-muted">
              <span className="tabular-nums">{String(pct).padStart(3, '0')}%</span>
              <span>{t('intro.loading')}</span>
            </div>
          )}

          {phase === 'ready' && (
            <>
              <button
                onClick={enter}
                className="rounded-full border border-ink/30 px-[30px] py-2.5 text-sm lowercase tracking-[0.16em] backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-paper hover:tracking-[0.22em]"
              >
                {t('intro.enter')}
              </button>
              <div className="text-[10px] lowercase tracking-[0.2em] text-muted">
                {t('intro.hint')}
              </div>
            </>
          )}

          {phase === 'closing' && (
            <div className="text-xs lowercase tracking-[0.24em] text-muted">
              {t('intro.entering')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
