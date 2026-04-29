import { useEffect } from 'react'

export default function useReveal(selector = '.reveal', threshold = 0.12) {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector, threshold])
}
