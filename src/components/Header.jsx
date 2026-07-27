import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Хедер:
 *  - слева:  кнопка "связь" -> /contact
 *  - центр:  кнопка "меню", раскрывается вниз капсулой со ссылками (GSAP)
 *  - справа: переключатель ru/en
 *
 * ВАЖНО: точный вид раскрытого меню делался без фото-референса —
 * подгоняется правкой массива links и стилей капсулы.
 */
export default function Header() {
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)   // раскрывающаяся капсула
  const linksRef = useRef(null)   // контейнер ссылок (для stagger)
  const labelRef = useRef(null)   // подпись на кнопке (меню/закрыть)
  const tlRef = useRef(null)

  const links = [
    { to: '/', key: 'nav.home' },
    { to: '/works', key: 'nav.works' },
    { to: '/about', key: 'nav.about' },
    { to: '/contact', key: 'nav.contact' },
  ]

  // Один timeline создаём заранее, дальше только play/reverse — так
  // повторные клики не ломают анимацию на середине
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, { height: 0, autoAlpha: 0 })
      gsap.set(linksRef.current.children, { y: 14, autoAlpha: 0 })

      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
        .to(panelRef.current, {
          height: 'auto',
          autoAlpha: 1,
          duration: 0.5,
        })
        .to(
          linksRef.current.children,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '-=0.25',
        )
    })
    return () => ctx.revert()
  }, [])

  const toggleMenu = () => {
    const next = !open
    setOpen(next)

    // плавная смена подписи на кнопке
    gsap.to(labelRef.current, {
      autoAlpha: 0,
      y: -6,
      duration: 0.15,
      onComplete: () => {
        labelRef.current.textContent = next ? t('header.close') : t('header.menu')
        gsap.fromTo(
          labelRef.current,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.15 },
        )
      },
    })

    next ? tlRef.current.play() : tlRef.current.reverse()
  }

  // клик по пункту меню: закрываем и переходим
  const go = (to) => {
    if (open) toggleMenu()
    navigate(to)
  }

  const toggleLang = () => setLang(lang === 'ru' ? 'en' : 'ru')

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 py-4 md:px-8 md:py-6">
      <div className="relative flex items-start justify-between text-sm lowercase">
        {/* левый угол — связь */}
        <Link
          to="/contact"
          className="border border-ink/20 rounded-full px-4 py-1.5 backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          {t('header.contact')}
        </Link>

        {/* центр — меню */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
          <button
            onClick={toggleMenu}
            aria-expanded={open}
            className="border border-ink/20 rounded-full px-5 py-1.5 backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            <span ref={labelRef} className="inline-block">
              {open ? t('header.close') : t('header.menu')}
            </span>
          </button>

          {/* раскрывающаяся капсула */}
          <div
            ref={panelRef}
            className="mt-2 w-44 overflow-hidden rounded-3xl border border-ink/20 bg-paper/90 backdrop-blur-sm"
          >
            <nav ref={linksRef} className="flex flex-col items-center gap-1 px-4 py-4">
              {links.map((l) => (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  className="w-full rounded-full px-3 py-1.5 text-center transition-colors duration-200 hover:bg-ink hover:text-paper"
                >
                  {t(l.key)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* правый угол — язык */}
        <button
          onClick={toggleLang}
          aria-label="Switch language"
          className="border border-ink/20 rounded-full px-4 py-1.5 tabular-nums transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          <span className={lang === 'ru' ? 'font-bold' : 'text-muted'}>ru</span>
          <span className="mx-1 text-muted">/</span>
          <span className={lang === 'en' ? 'font-bold' : 'text-muted'}>en</span>
        </button>
      </div>
    </header>
  )
}
