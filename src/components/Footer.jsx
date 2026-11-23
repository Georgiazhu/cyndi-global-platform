import { PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row justify-between gap-8 text-xs">
        <div className="flex flex-col items-start gap-3">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-stone-900"><span className="text-sm font-semibold leading-none">C</span></span>
            <span className="text-base font-semibold tracking-tight text-white">Cyndi</span>
          </a>
          <p className="max-w-sm leading-relaxed">Global Swag &amp; Brand Management — Empowering Brands. Engaging People.</p>
          <p className="text-stone-500">info@cyndiglobal.com &nbsp;·&nbsp; Hong Kong</p>
        </div>
        <div className="flex gap-10 uppercase tracking-widest">
          <a href={PORTAL_LOGIN_URL} className="hover:text-white">Portal login</a>
          <a href={QUOTE_URL} className="hover:text-white">Get a quote</a>
          <a href="/catalog/logistics.html" className="hover:text-white">Track a shipment</a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-[11px] text-stone-600">© 2026 Cyndi Global Limited. All rights reserved.</div>
      </div>
    </footer>
  )
}
