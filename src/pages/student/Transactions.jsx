import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Sparkles, X, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatPkr } from '../../utils/currency';

const empty = {
  type: 'expense',
  categoryId: '',
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
};

export default function Transactions() {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [aiHint, setAiHint] = useState(null);


  const getId = (t) => t._id || t.id;
  const getCatId = (t) => t.category?._id || t.category;
  const getCatName = (t) => t.category?.name || t.category || '-';


  useEffect(() => {
    if (form.type === 'expense' && form.description.length > 2) {
      const lower = form.description.toLowerCase();
      const match = categories.find((c) =>
        c.type === 'expense' && c.name.toLowerCase().split(' ').some((w) => lower.includes(w))
      );
      setAiHint(match || null);
    } else {
      setAiHint(null);
    }
  }, [form.description, form.type, categories]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditing(getId(t));
    setForm({
      type: t.type,
      categoryId: getCatId(t) || '',
      amount: String(t.amount),
      description: t.description,
      date: t.date ? t.date.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const applyAi = () => {
    if (!aiHint) return;
    setForm((f) => ({ ...f, categoryId: aiHint._id || aiHint.id }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, amount: Number(form.amount) };
    let ok = false;
    if (editing) {
      await updateTransaction(editing, payload);
      ok = true;
    } else {
      ok = await addTransaction(payload);
    }
    setSubmitting(false);
    if (ok) {
      setShowForm(false);
      setForm(empty);
      setEditing(null);
    }
  };


  const typeCats = categories.filter((c) => c.type === form.type);


  const filtered = transactions.filter((t) => {
    const matchType = filter === 'all' || t.type === filter;
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Transactions</h1>
          <p className="text-sm text-cc-muted">Log income and expenses with AI category suggestions</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </div>


      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition ${filter === f ? 'bg-cc-forest text-white' : 'bg-white text-cc-muted border border-gray-200'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-gray-200 text-sm outline-none focus:border-cc-lime"
          />
        </div>
      </div>


      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 relative animate-fade-in">
          <button type="button" className="absolute right-4 top-4 text-cc-muted hover:text-cc-forest" onClick={() => setShowForm(false)}>
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-cc-forest mb-4">{editing ? 'Edit' : 'Quick Add'} Transaction</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value, categoryId: '' })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Amount (PKR)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-cc-muted uppercase">Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Campus Cafe lunch"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
              {aiHint && (
                <button
                  type="button"
                  onClick={applyAi}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-cc-mint text-cc-forest px-3 py-1.5 rounded-full hover:bg-cc-lime hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI suggests: {aiHint.name}. Apply
                </button>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Category</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              >
                <option value="">Select...</option>
                {typeCats.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} className="!rounded-xl">
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </div>
      )}


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-cc-muted text-center p-8">
            {transactions.length === 0 ? 'No transactions yet. Add your first one!' : 'No results found.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cc-mint-soft">
                <tr className="text-left text-xs text-cc-muted">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={getId(t)} className="border-t border-gray-50 hover:bg-cc-mint-soft/50">
                    <td className="px-4 py-3 text-cc-muted whitespace-nowrap">
                      {t.date ? new Date(t.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium">{t.description}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-cc-mint text-cc-forest px-2 py-0.5 rounded-full">
                        {getCatName(t)}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs font-semibold text-cc-muted">{t.type}</td>
                    <td className={`px-4 py-3 text-right font-bold ${t.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '−'}
                      {formatPkr(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(t)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteTransaction(getId(t))} className="p-1.5 text-cc-muted hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
