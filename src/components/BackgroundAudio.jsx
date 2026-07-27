import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const STORAGE_KEY = 'site-sound-volume'
const DEFAULT_VOLUME = 0.35

/**
 * Фоновая музыка на весь сайт.
 *
 * Браузеры блокируют autoplay со звуком без жеста пользователя — поэтому
 * сначала пробуем play() сразу, а если он отклонён политикой браузера,
 * подписываемся на первый клик/тап/клавишу и запускаем по нему (клик по
 * кнопке "войти" в Intro тоже считается).
 *
 * Громкость плавно нарастает от 0 до комфортного уровня при старте
 * воспроизведения — резкий полный звук на весь экран неприятен.
 *
 * Файл /theme.mp3 в public/ нужно положить свой (лицензионный) —
 * здесь только плеер и логика запуска.
 */
export default function BackgroundAudio() {
  const audioRef = useRef(null)
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_VOLUME
  })
  const lastVolumeRef = useRef(volume)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const tryPlay = () => {
      if (startedRef.current) return
      audio.volume = 0
      audio
        .play()
        .then(() => {
          startedRef.current = true
          gsap.to(audio, { volume: lastVolumeRef.current || DEFAULT_VOLUME, duration: 1.4, ease: 'power1.out' })
        })
        .catch(() => {})
    }
    tryPlay()

    const onFirstGesture = () => tryPlay()
    window.addEventListener('pointerdown', onFirstGesture, { once: true })
    window.addEventListener('keydown', onFirstGesture, { once: true })

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && startedRef.current) audioRef.current.volume = volume
    if (volume > 0) lastVolumeRef.current = volume
    localStorage.setItem(STORAGE_KEY, String(volume))
  }, [volume])

  const toggleMute = () => setVolume((v) => (v > 0 ? 0 : lastVolumeRef.current || DEFAULT_VOLUME))

  return (
    <>
      <audio ref={audioRef} src="/theme.mp3" loop preload="auto" />
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-ink/20 bg-paper/80 px-3 py-2 backdrop-blur-sm">
        <button
          onClick={toggleMute}
          aria-label={volume > 0 ? 'mute' : 'unmute'}
          aria-pressed={volume === 0}
          className="flex h-5 w-5 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-60"
        >
          <SoundIcon muted={volume === 0} />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="volume"
          className="sound-range w-20"
        />
      </div>
    </>
  )
}

function SoundIcon({ muted }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />
      ) : (
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12" strokeLinecap="round" />
      )}
    </svg>
  )
}
