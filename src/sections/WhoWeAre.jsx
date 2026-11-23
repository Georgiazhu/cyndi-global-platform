import Section from '../components/Section.jsx'
import { capabilities } from '../content.js'

export default function WhoWeAre() {
  return (
    <Section id="why" title="Your swag shop and global supply-chain hub." intro="We plan, source, store, ship and distribute your brand's swag worldwide, as your external product team.">
      <div className="grid md:grid-cols-3 gap-6">
        {capabilities.map((c) => (
          <div key={c.title} className="rounded-lg border border-line bg-surface p-6">
            <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-body">{c.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
