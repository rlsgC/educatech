import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return undefined
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

// Cuenta desde 0 hasta el valor final con una curva suave.
export function useCountUp(target, { duration = 900, delay = 0 } = {}) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (reduced) return undefined
    let frame
    let start
    const timer = setTimeout(() => {
      const step = time => {
        start ??= time
        const progress = Math.min(1, (time - start) / duration)
        const eased = 1 - (1 - progress) ** 3
        setValue(Math.round(target * eased))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [target, duration, delay, reduced])
  return reduced ? target : value
}

// Escribe el texto letra por letra, como si el robot estuviera hablando.
// Para reiniciar con otro texto, el componente que lo usa debe montarse de nuevo (prop key).
export function useTypewriter(text, { speed = 24 } = {}) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (reduced) return undefined
    const interval = setInterval(() => {
      setCount(current => {
        if (current >= text.length) {
          clearInterval(interval)
          return current
        }
        return current + 1
      })
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, reduced])
  const visible = reduced ? text.length : count
  return { text: text.slice(0, visible), done: visible >= text.length }
}
