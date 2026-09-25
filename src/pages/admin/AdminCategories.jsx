import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';

export default function AdminCategories() {
  const { categories, adminUpsertCategory, adminDeleteCategory } = useApp();
  const defaults = categories.filter((c) => c.isDefault);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', type: 'expense' });

  const openAdd = () => {
    setForm({ id: null, name: '', type: 'expense' });
    setShow(true);
  };
  const openEdit = (c) => {
    setForm({ id: c.id, name: c.name, type: c.type });
    setShow(true);
  };
  const submit = (e) => {
    e.preventDefault();
    adminUpsertCategory({ ...form, isDefault: true });
    setShow(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Default Categories</h1>
          <p className="text-sm text-cc-muted">Available to all students system-wide</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> Add Default
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border p-5 flex flex-wrap gap-3 items-end relative">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-semibold text-cc-muted uppercase">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <div className="w-36">
            <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <Button type="submit" className="!rounded-xl">
            Save
          </Button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {defaults.map((c) => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold text-cc-forest">{c.name}</p>
              <p className="text-xs text-cc-muted capitalize">{c.type}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => openEdit(c)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => adminDeleteCategory(c.id)} className="p-1.5 text-cc-muted hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
