import { PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

// Restored original design: brand-blue final call-to-action band.
export default function FinalCta() {
  return (
    <section id="quote" className="bg-brand-blue text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-5 text-base tracking-wide text-brand-light">Empowering Brands,Engaging People</p>
        <h2 className="text-3xl md:text-4xl font-bold">Let's build your global swag program.</h2>
        <div className="mt-8 flex justify-center gap-4">
          <a href={QUOTE_URL} className="rounded bg-white px-6 py-3 font-semibold text-brand-blue hover:bg-white/90">Get a quote</a>
          <a href={PORTAL_LOGIN_URL} className="rounded border border-white px-6 py-3 font-semibold hover:bg-white/10">Portal login</a>
        </div>
      </div>
    </section>
  )
}
