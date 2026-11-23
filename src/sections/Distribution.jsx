import Section from '../components/Section.jsx'
import { distribution } from '../content.js'

export default function Distribution() {
  return (
    <Section title="Four ways to get swag to your people" intro="All four draw from the same inventory, so stock always adds up.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {distribution.map((d) => (
          <div key={d.tag} className="rounded-lg bg-surface p-6">
            <div className="text-sm font-bold text-accent">{d.tag}</div>
            <h3 className="mt-1 text-lg font-semibold text-ink">{d.title}</h3>
            <p className="mt-2 text-body">{d.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
