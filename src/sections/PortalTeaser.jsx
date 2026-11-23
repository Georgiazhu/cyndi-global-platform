import Section from '../components/Section.jsx'
import { portalFeatures, PORTAL_LOGIN_URL } from '../content.js'

export default function PortalTeaser() {
  return (
    <Section id="portal" title="Everything your brand needs, in one portal" intro="Sign in once to manage orders, inventory and deliveries.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {portalFeatures.map((f) => (
          <div key={f.title} className="rounded-lg bg-surface p-6">
            <div className="text-sm font-bold text-accent">✓</div>
            <h3 className="mt-1 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-body">{f.text}</p>
          </div>
        ))}
      </div>
      <a href={PORTAL_LOGIN_URL} className="mt-8 inline-block rounded bg-accent px-6 py-3 font-semibold text-white hover:bg-secondary">Portal login</a>
    </Section>
  )
}
