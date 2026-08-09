import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

const PHONE_INTL = '+375447900661'
const PHONE_DIGITS = '375447900661'
const PHONE_DISPLAY = '+375 44 790-06-61'

const LINKS = [
  { key: 'phone', href: `tel:${PHONE_INTL}`, label: PHONE_DISPLAY },
  { key: 'whatsapp', href: `https://wa.me/${PHONE_DIGITS}`, label: PHONE_DISPLAY },
  { key: 'viber', href: `viber://chat?number=%2B${PHONE_DIGITS}`, label: PHONE_DISPLAY },
  { key: 'telegram', href: 'https://t.me/Yato101', label: '@yato101' },
  { key: 'instagram', href: 'https://instagram.com/darkklra', label: '@darkklra' },
]

export default function Contact() {
  const { t } = useLanguage()
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
          {t('nav.contact')}
        </h1>

        <p data-reveal className="mt-6 text-sm leading-relaxed text-muted md:text-base">
          {t('contact.note')}
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              data-reveal
              className="flex items-center justify-between rounded-full border border-ink/20 px-5 py-3 text-sm lowercase tracking-wide backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              <span className="text-muted">{t(`contact.${l.key}`)}</span>
              <span className="tabular-nums">{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
