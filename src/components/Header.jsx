import { nav, PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="text-xl font-bold text-ink">Cyndi Global</a>
        <nav className="hidden md:flex gap-8 text-sm text-secondary">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-accent">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <a href={PORTAL_LOGIN_URL} className="text-secondary hover:text-accent">Portal login</a>
          <a href={QUOTE_URL} className="rounded bg-accent px-4 py-2 font-semibold text-white hover:bg-secondary">Get a quote</a>
        </div>
      </div>
    </header>
  )
}
