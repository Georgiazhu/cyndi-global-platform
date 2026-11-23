import Section from '../components/Section.jsx'
import { steps } from '../content.js'

// Paired rows: each row is one client step (left) → one Cyndi step (right).
// A dashed return line loops from the right card back down to the next left card.
function Card({ s }) {
  const client = s.side === 'client'
  return (
    <div className={'rounded-lg px-5 py-4 text-sm ' + (client ? 'border border-[#C9D6EE] bg-[#EAF0FA] text-body' : 'bg-deepbg text-light')}>
      <div className="md:hidden text-xs uppercase tracking-wide">{client ? 'You' : 'Cyndi Global'}</div>
      <div className={'text-2xl font-bold ' + (client ? 'text-accent' : 'text-light')}>{String(s.n).padStart(2, '0')}</div>
      <h3 className={'mt-0.5 text-base font-semibold ' + (client ? 'text-ink' : 'text-white')}>{s.title}</h3>
      <p className="mt-1">{s.text}</p>
      {s.gate && <span className="mt-2 inline-block rounded bg-[#FDECEA] px-2 py-0.5 text-xs text-[#C0392B]">{s.gate}</span>}
    </div>
  )
}

function ReturnLine() {
  // Down from the centre of the right card, across to the left, down into the next left card.
  return (
    <div className="relative hidden h-11 md:block">
      <span className="absolute top-0 h-[22px] border-b-2 border-r-2 border-dashed border-accent" style={{ left: 'calc((100% - 56px) / 4)', right: 'calc((100% - 56px) / 4)' }} />
      <span className="absolute top-[22px] h-[22px] border-l-2 border-dashed border-accent" style={{ left: 'calc((100% - 56px) / 4)' }} />
      <span className="absolute -bottom-2.5 text-xs text-accent" style={{ left: 'calc((100% - 56px) / 4 - 6px)' }}>▼</span>
    </div>
  )
}

export default function SixSteps() {
  const pairs = [0, 2, 4].map((i) => [steps[i], steps[i + 1]])
  return (
    <Section id="how" title="From brief to delivery in six steps" intro="Every order follows the same locked sequence, with two approval gates, so nothing ships that you have not signed off.">
      <div className="hidden md:grid grid-cols-[1fr_56px_1fr] mb-3">
        <div className="rounded-lg bg-[#EAF0FA] px-5 py-3 text-sm font-bold uppercase tracking-wide text-accent">
          You<span className="block text-xs font-normal normal-case tracking-normal">Your admin</span>
        </div>
        <div />
        <div className="rounded-lg bg-deepbg px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
          Cyndi Global<span className="block text-xs font-normal normal-case tracking-normal text-light">Your SWAG team</span>
        </div>
      </div>
      {pairs.map(([left, right], i) => (
        <div key={left.n}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_56px_1fr]">
            <Card s={left} />
            <div className="flex h-9 items-center justify-center text-2xl font-bold text-accent md:h-auto">
              <span className="rotate-90 md:rotate-0">→</span>
            </div>
            <Card s={right} />
          </div>
          {i < pairs.length - 1 && <ReturnLine />}
          {i < pairs.length - 1 && <div className="h-4 md:hidden" />}
        </div>
      ))}
      <div className="mt-3 text-right text-sm font-semibold text-[#2E8B6F]">✓ Delivered to your door</div>
      <p className="mt-5 text-sm text-muted">Read left to right, then follow the line back to the next step. Your three decisions on the left, what we deliver on the right.</p>
    </Section>
  )
}
