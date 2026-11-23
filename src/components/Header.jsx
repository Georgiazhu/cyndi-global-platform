import { useState, useEffect } from 'react'
import { nav, PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#top" aria-label="Cyndi Global home" className="flex items-center overflow-hidden">
          <img src="/cyndi-logo-mark.png" alt="" className="h-8 w-auto shrink-0" />
          <span
            className="inline-flex items-center overflow-hidden whitespace-nowrap motion-reduce:transition-none transition-[max-width,opacity,transform] duration-[450ms] ease-[cubic-bezier(.65,0,.35,1)]"
            style={{
              maxWidth: scrolled ? '0px' : '140px',
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? 'translateX(-14px) scaleX(.55)' : 'translateX(0) scaleX(1)',
              transformOrigin: 'left center',
            }}
          >
            <img src="/cyndi-logo-word.png" alt="" className="h-8 w-auto" />
          </span>
        </a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-secondary md:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="transition-colors hover:text-oat">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <a href={PORTAL_LOGIN_URL} className="hidden font-medium text-ink transition-colors hover:text-oat sm:block">Portal login</a>
          <a href={QUOTE_URL} className="rounded-full bg-ink px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-black">Get a quote</a>
        </div>
      </div>
    </header>
  )
}
