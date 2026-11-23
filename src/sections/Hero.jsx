import { PORTAL_LOGIN_URL, QUOTE_URL } from '../content.js'

export default function Hero() {
  return (
    <section id="top" className="bg-deepbg text-white">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <p className="text-light uppercase tracking-widest text-sm">Global swag supply chain</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          Cyndi Global — Your Dedicated SWAG Team
        </h1>
        <p className="mt-6 text-xl text-light max-w-2xl">
          Luxury swag for brands, anywhere in the world. One global warehouse, door-to-door delivery to 200+ countries and regions.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href={QUOTE_URL} className="rounded bg-accent px-6 py-3 font-semibold hover:bg-secondary">Get a quote</a>
          <a href={PORTAL_LOGIN_URL} className="rounded border border-light px-6 py-3 font-semibold hover:bg-white/10">Portal login</a>
        </div>
      </div>
    </section>
  )
}
