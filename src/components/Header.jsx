import { nav, PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-white">
            <span className="text-sm font-semibold leading-none">C</span>
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">Cyndi</span>
        </a>
        <nav className="hidden md:flex gap-9 text-xs uppercase tracking-widest text-secondary">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-ink">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-5 text-xs uppercase tracking-widest">
          <a href={PORTAL_LOGIN_URL} className="text-secondary hover:text-ink">Portal login</a>
          <a href={QUOTE_URL} className="border border-stone-900 px-5 py-2.5 font-medium text-stone-900 hover:bg-stone-900 hover:text-white transition-colors">Get a quote</a>
        </div>
      </div>
    </header>
  )
}
