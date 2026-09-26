import { useMemo, useState } from 'react';
import {
  Database,
  Workflow,
  MousePointerClick,
  ChevronDown,
  Search,
  Layers,
} from 'lucide-react';
import { blueprintSections, coreTablesOverview } from '../../data/backendBlueprint';

function MethodBadge({ method }) {
  const m = (method || '—').split(' ')[0].toUpperCase();
  const color =
    m === 'GET'
      ? 'bg-sky-50 text-sky-700 border-sky-200'
      : m === 'POST'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : m === 'PUT' || m === 'PATCH'
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : m === 'DELETE'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${color}`}
    >
      {method}
    </span>
  );
}

function BlueprintCard({ item, open, onToggle }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 hover:bg-cc-mint-soft/50 transition"
        aria-expanded={open}
      >
        <span className="mt-0.5 w-9 h-9 rounded-xl bg-cc-forest/5 text-cc-forest flex items-center justify-center shrink-0">
          <MousePointerClick className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-cc-ink text-sm sm:text-base">{item.button}</p>
          <p className="text-xs text-cc-muted mt-0.5 truncate">{item.page}</p>
          <p className="text-sm text-cc-ink/80 mt-2 line-clamp-2">{item.purpose}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-cc-muted shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-gray-50 pt-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Workflow className="w-4 h-4 text-cc-lime" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cc-forest">
                Backend flow
              </h4>
            </div>
            <p className="text-sm text-cc-ink/85 leading-relaxed">{item.howItWorks}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <MethodBadge method={item.api.method} />
              <code className="text-xs sm:text-sm bg-cc-mint-soft text-cc-forest px-2.5 py-1 rounded-lg break-all">
                {item.api.path}
              </code>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-cc-lime" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cc-forest">
                DB tables & columns
              </h4>
            </div>
            {item.tables.length === 0 ? (
              <p className="text-sm text-cc-muted">Koi DB write nahi — sirf UI navigation.</p>
            ) : (
              <div className="space-y-3">
                {item.tables.map((table) => (
                  <div
                    key={table.name}
                    className="rounded-xl border border-cc-forest/10 bg-cc-mint-soft/40 p-3"
                  >
                    <p className="font-mono text-sm font-bold text-cc-forest mb-2">
                      {table.name}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {table.columns.map((col) => (
                        <li
                          key={col}
                          className="text-[11px] sm:text-xs font-medium px-2 py-1 rounded-md bg-white border border-gray-100 text-cc-ink"
                        >
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function BackendBlueprint() {
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blueprintSections
      .filter((sec) => activeSection === 'all' || sec.id === activeSection)
      .map((sec) => ({
        ...sec,
        items: sec.items.filter((item) => {
          if (!q) return true;
          const hay = [
            item.button,
            item.page,
            item.purpose,
            item.howItWorks,
            item.api.method,
            item.api.path,
            ...item.tables.flatMap((t) => [t.name, ...t.columns]),
          ]
            .join(' ')
            .toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [query, activeSection]);

  const totalButtons = blueprintSections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="animate-fade-in min-h-[70vh] bg-cc-cream">
      <div className="relative overflow-hidden bg-gradient-to-br from-cc-forest via-[#0f4a38] to-cc-forest-light text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cc-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <span className="inline-flex text-cc-lime text-xs font-bold tracking-widest uppercase mb-3">
            Backend planning
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Dynamic button → API → DB layout
          </h1>
          <p className="mt-3 text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed">
            Har UI button ka purpose, backend flow, aur database tables/columns — ek jagah.
            Abhi UI hai; ye map batata hai backend me kya banana hai.
          </p>
          <p className="mt-4 text-sm text-white/55">
            {totalButtons} actions · {blueprintSections.length} sections · {coreTablesOverview.length}{' '}
            core tables
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-cc-lime" />
            <h2 className="font-bold text-cc-forest text-lg">Core DB tables (overview)</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {coreTablesOverview.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-cc-forest/10 bg-cc-mint-soft/50 p-3"
              >
                <p className="font-mono text-sm font-bold text-cc-forest">{t.name}</p>
                <p className="text-xs text-cc-muted mt-1">{t.why}</p>
                <p className="text-[11px] text-cc-ink/70 mt-2 font-medium leading-snug">
                  {t.keyColumns}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search button, API, table…"
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm text-cc-ink placeholder:text-cc-muted focus:outline-none focus:ring-2 focus:ring-cc-lime/40 focus:border-cc-lime"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`text-xs font-bold px-3 py-2 rounded-full border transition ${
                activeSection === 'all'
                  ? 'bg-cc-forest text-white border-cc-forest'
                  : 'bg-white text-cc-forest border-cc-forest/15 hover:bg-cc-mint'
              }`}
            >
              All
            </button>
            {blueprintSections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`text-xs font-bold px-3 py-2 rounded-full border transition ${
                  activeSection === sec.id
                    ? 'bg-cc-forest text-white border-cc-forest'
                    : 'bg-white text-cc-forest border-cc-forest/15 hover:bg-cc-mint'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-cc-muted py-16">Koi match nahi mila — search clear karke try karo.</p>
        ) : (
          filtered.map((sec) => (
            <section key={sec.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
                <div>
                  <h2 className="text-xl font-extrabold text-cc-forest">{sec.title}</h2>
                  <p className="text-sm text-cc-muted">
                    {sec.page} — {sec.description}
                  </p>
                </div>
                <span className="text-xs font-bold text-cc-muted">{sec.items.length} buttons</span>
              </div>
              <div className="grid gap-3">
                {sec.items.map((item) => (
                  <BlueprintCard
                    key={item.id}
                    item={item}
                    open={openId === item.id}
                    onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
