import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

const PHONE_DISPLAY = '+375 44 790-06-61'
const PHONE_COPY = '+375447900661'

const CONTACTS = [
  { key: 'phone', icon: 'phone', value: PHONE_DISPLAY, copy: PHONE_COPY },
  { key: 'whatsapp', icon: 'whatsapp', value: PHONE_DISPLAY, copy: PHONE_COPY },
  { key: 'viber', icon: 'viber', value: PHONE_DISPLAY, copy: PHONE_COPY },
  { key: 'telegram', icon: 'telegram', value: '@yato101', copy: '@yato101' },
  { key: 'instagram', icon: 'instagram', value: '@darkklra', copy: '@darkklra' },
]

export default function Contact() {
  const { t } = useLanguage()
  const scopeRef = useRef(null)
  const [copiedKey, setCopiedKey] = useState(null)

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

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // буфер обмена недоступен (например, без https) — просто не показываем галочку
      return
    }
    setCopiedKey(key)
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1400)
  }

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
          {CONTACTS.map((c) => (
            <div
              key={c.key}
              data-reveal
              className="flex items-center justify-between gap-4 rounded-full border border-ink/20 px-5 py-3 backdrop-blur-sm"
            >
              <div className="flex min-w-0 shrink-0 items-center gap-3 text-sm lowercase tracking-wide">
                <span className="shrink-0 text-muted">
                  <ContactIcon name={c.icon} />
                </span>
                <span className="shrink-0 text-muted">{t(`contact.${c.key}`)}</span>
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <span className="truncate text-sm tabular-nums">{c.value}</span>
                <button
                  onClick={() => copy(c.key, c.copy)}
                  aria-label="copy"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink"
                >
                  {copiedKey === c.key ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function ContactIcon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }
  switch (name) {
    case 'phone':
      return (
        <svg {...common}>
          <path
            d="M6 3h3l1.5 4-2 1.3c1.1 2.6 3.1 4.6 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A15 15 0 0 1 4 6.2 2 2 0 0 1 6 3z"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M12 4a8 8 0 1 0 6.9 12l2.6.9-.9-2.5A8 8 0 0 0 12 4z" strokeLinejoin="round" />
          <path d="M9 10c0 3 2.5 5.5 5.5 5.5" strokeLinecap="round" />
        </svg>
      )
    case 'viber':
      return (
        <svg {...common}>
          <path d="M12 4a8 8 0 0 0-6.9 12l-.9 3.5 3.4-1.2A8 8 0 1 0 12 4z" strokeLinejoin="round" />
          <circle cx="9.3" cy="12" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="14.7" cy="12" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'telegram':
      return (
        <svg {...common}>
          <path
            d="M20 4 3.5 10.8l5.7 1.9M20 4l-3.3 14.8-6.5-5.3M20 4 9.2 12.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="16.3" cy="7.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M6 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12.5l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
