import { nav, PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#top" aria-label="Cyndi Global home">
          <img src="/cyndi-logo-full.png" alt="Cyndi Global" className="h-8 w-auto" style={{ filter: 'brightness(0)' }} />
        </a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-secondary md:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="transition-colors hover:text-oat">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <a href={PORTAL_LOGIN_URL} className="hidden font-medium text-ink transition-colors hover:text-oat sm:block">Portal login</a>
          <a href={QUOTE_URL} className="rounded-full bg-fire px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-fire-dark">Get a quote</a>
        </div>
      </div>
    </header>
  )
}
