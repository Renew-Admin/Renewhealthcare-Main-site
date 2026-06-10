import './PageStub.css'

export default function PageStub({ title }) {
  return (
    <main className="page-stub">
      <section className="page-stub-inner">
        <span className="page-stub-eyebrow">Renew Healthcare</span>
        <h1>{title}</h1>
      </section>
    </main>
  )
}
