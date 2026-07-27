import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n/translations.js'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'site-lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' || saved === 'ru' ? saved : 'ru'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  // t('header.contact') -> строка из словаря текущего языка
  const t = (key) => {
    const parts = key.split('.')
    let node = translations[lang]
    for (const p of parts) {
      node = node?.[p]
      if (node === undefined) return key // ключ не найден — показываем сам ключ
    }
    return node
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
