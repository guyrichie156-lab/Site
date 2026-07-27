import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Бесшовная бегущая строка.
 *
 * Логика направления:
 *   курсор ЛЕВЕЕ центра видео  -> строка едет влево
 *   курсор ПРАВЕЕ центра видео -> строка едет вправо
 *
 * Плавность без заломов достигается так:
 *   1) скорость не переключается мгновенно, а "догоняет" целевую (lerp)
 *   2) позиция считается в gsap.ticker каждый кадр и заворачивается
 *      через gsap.utils.wrap — шов между копиями текста не виден
 *   3) скорость пропорциональна расстоянию от центра: у центра медленно,
 *      у краёв быстро — переход через ноль получается мягким
 *
 * anchorRef — ref на элемент видео: от его центра считаем сторону курсора.
 */
const MIN_REPEATS = 2 // минимум для бесшовного wrap, дальше досчитывается под экран

export default function MarqueeLine({ anchorRef }) {
  const { t } = useLanguage()
  const trackRef = useRef(null)
  const segRef = useRef(null) // первая копия текста — по ней меряем ширину сегмента

  // копий должно хватать на ширину экрана + запас на wrap, иначе на широких
  // экранах или с короткой фразой в бегущей строке будет виден разрыв
  const [repeats, setRepeats] = useState(MIN_REPEATS)

  const text = t('hero.marquee')

  useLayoutEffect(() => {
    const recalcRepeats = () => {
      const seg = segRef.current
      if (!seg?.offsetWidth) return
      const needed = Math.ceil(window.innerWidth / seg.offsetWidth) + 2
      setRepeats((prev) => Math.max(prev, needed))
    }

    recalcRepeats()
    window.addEventListener('resize', recalcRepeats)
    return () => window.removeEventListener('resize', recalcRepeats)
  }, [text])

  useLayoutEffect(() => {
    const track = trackRef.current
    const seg = segRef.current
    if (!track || !seg) return

    let segWidth = seg.offsetWidth
    let pos = 0
    let velocity = 0
    let targetVelocity = 40 // px/сек, лёгкий дрейф пока мышь не двигали

    const MAX_SPEED = 260 // px/сек на краю экрана

    const onResize = () => {
      segWidth = seg.offsetWidth
    }

    const onMouseMove = (e) => {
      // центр якоря (видео); если якоря нет — центр окна
      const rect = anchorRef?.current?.getBoundingClientRect()
      const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2

      // -1..1: знак = сторона, модуль = как далеко от центра
      const half = Math.max(centerX, window.innerWidth - centerX)
      const norm = gsap.utils.clamp(-1, 1, (e.clientX - centerX) / half)

      targetVelocity = norm * MAX_SPEED
    }

    const tick = (_time, deltaMS) => {
      const dt = deltaMS / 1000
      // независимый от FPS lerp: за ~0.4с скорость догоняет целевую
      const k = 1 - Math.exp(-dt / 0.15)
      velocity += (targetVelocity - velocity) * k

      pos = gsap.utils.wrap(-segWidth, 0, pos + velocity * dt)
      gsap.set(track, { x: pos })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      gsap.ticker.remove(tick)
    }
  }, [anchorRef])

  return (
    <div className="w-full overflow-hidden select-none" aria-hidden="true">
      <div ref={trackRef} className="flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: repeats }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? segRef : null}
            className="font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold uppercase tracking-tight text-ink/90 pr-2"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
