export default function Section({ id, title, intro, dark = false, children }) {
  return (
    <section id={id} className={dark ? 'bg-deepbg text-white' : 'bg-white'}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        {title && <h2 className={'text-3xl md:text-4xl font-bold ' + (dark ? 'text-white' : 'text-ink')}>{title}</h2>}
        {intro && <p className={'mt-4 max-w-2xl text-lg ' + (dark ? 'text-light' : 'text-body')}>{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
