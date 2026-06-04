import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { discoveryItems, getDiscoveryItem } from '@/constants/discovery';

export function DiscoveryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = getDiscoveryItem(id);

  const handleBack = () => {
    navigate(-1);
  };

  if (!item) {
    return (
      <main className="min-h-screen bg-bg-default px-5 pb-24 pt-4">
        <button type="button" className="text-sm font-semibold text-text-brand-default" onClick={handleBack}>
          Back
        </button>
        <section className="mt-10 rounded-lg bg-white p-5 text-center shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold text-text-strong">Discovery not found</h1>
          <p className="mt-2 text-sm leading-5 text-text-default">This guide may have moved or expired.</p>
          <button
            type="button"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-bg-brand-default px-4 text-sm font-semibold text-white"
            onClick={() => navigate('/home')}
          >
            Go home
          </button>
        </section>
      </main>
    );
  }

  const relatedItems = discoveryItems.filter((relatedItem) => relatedItem.id !== item.id).slice(0, 2);

  return (
    <main className="min-h-screen bg-bg-default pb-24">
      <header className="border-b border-border-weak2 bg-white px-5 py-4">
        <button type="button" className="text-sm font-semibold text-text-brand-default" onClick={handleBack}>
          Back
        </button>
        <div className="mt-5">
          <span className="inline-flex rounded-full bg-bg-brand-weak px-2.5 py-1 text-xs font-semibold text-text-brand-default">
            {item.type}
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-8 text-text-strong">{item.title}</h1>
          <p className="mt-2 text-sm text-text-weak">Updated {item.updatedAt}</p>
        </div>
      </header>

      <section className="px-5 py-5">
        <div className="rounded-lg bg-white p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
          <h2 className="text-base font-bold text-text-strong">What you need to know</h2>
          <ul className="mt-3 grid gap-2">
            {item.summary.map((summary) => (
              <li key={summary} className="flex gap-2 text-sm leading-5 text-text-default">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bg-brand-default" aria-hidden="true" />
                <span>{summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <article className="space-y-4 px-5 text-sm leading-6 text-text-default">
        {item.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="px-5 py-5">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-bg-brand-default px-4 text-sm font-semibold text-white"
          onClick={() => navigate(item.ctaHref)}
        >
          {item.ctaLabel}
          <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </section>

      <section className="px-5">
        <h2 className="text-lg font-bold text-text-strong">Related Discovery</h2>
        <div className="mt-3 grid gap-3">
          {relatedItems.map((relatedItem) => (
            <button
              key={relatedItem.id}
              type="button"
              className="rounded-lg border border-border-weak2 bg-white p-4 text-left shadow-[0px_2px_8px_rgba(0,0,0,0.06)]"
              onClick={() => navigate(`/discovery/${relatedItem.id}`)}
            >
              <span className="text-xs font-semibold uppercase text-text-brand-default">{relatedItem.type}</span>
              <span className="mt-1 block text-sm font-semibold text-text-strong">{relatedItem.title}</span>
              <span className="mt-1 block text-xs leading-4 text-text-default">{relatedItem.description}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
