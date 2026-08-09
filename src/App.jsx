import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Intro from './components/Intro.jsx'
import { useLanguage } from './context/LanguageContext.jsx'

/** Заглушка страницы — заменим на реальные страницы позже */
function Stub({ textKey }) {
  const { t } = useLanguage()
  return (
    <main className="flex min-h-svh items-center justify-center pt-24 text-sm lowercase text-muted">
      {t(textKey)}
    </main>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Intro />
      <div id="site-root">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/works" element={<Stub textKey="pages.worksStub" />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  )
}
