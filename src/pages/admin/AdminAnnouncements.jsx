import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';

export default function AdminAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', body: '', active: true });

  const openAdd = () => {
    setForm({ id: null, title: '', body: '', active: true });
    setShow(true);
  };
  const openEdit = (a) => {
    setForm({ id: a.id, title: a.title, body: a.body, active: a.active });
    setShow(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (form.id) updateAnnouncement(form.id, form);
    else addAnnouncement(form);
    setShow(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Announcements & Tip Templates</h1>
          <p className="text-sm text-cc-muted">System-wide messages shown on student dashboards</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border p-5 space-y-3 relative">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4" />
          </button>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Body / tip template</label>
            <textarea
              required
              rows={3}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-cc-lime"
            />
            Active
          </label>
          <Button type="submit" className="!rounded-xl">
            Save
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-cc-forest">{a.title}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      a.active ? 'bg-cc-mint text-cc-lime-dark' : 'bg-gray-100 text-cc-muted'
                    }`}
                  >
                    {a.active ? 'Active' : 'Off'}
                  </span>
                </div>
                <p className="text-sm text-cc-muted">{a.body}</p>
                <p className="text-[11px] text-cc-muted mt-2">{a.createdAt}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(a)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                  <Pencil className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => deleteAnnouncement(a.id)} className="p-1.5 text-cc-muted hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
