import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function About() {
  const { t } = useLanguage()
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
        </div>
      </div>
    </main>
  )
}
