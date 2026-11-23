import Section from '../components/Section.jsx'
import { compare } from '../content.js'

export default function WhyOneWarehouse() {
  return (
    <Section title="Why one global warehouse" dark>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-white/10 p-6">
          <h3 className="font-semibold text-light">Without Cyndi</h3>
          <ul className="mt-4 space-y-2 text-light">{compare.without.map((t) => <li key={t}>– {t}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-accent p-6">
          <h3 className="font-semibold">With Cyndi Global</h3>
          <ul className="mt-4 space-y-2">{compare.withCyndi.map((t) => <li key={t}>✓ {t}</li>)}</ul>
        </div>
      </div>
    </Section>
  )
}
