import { Ban, CheckCircle, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminUsers() {
  const { users, toggleUserStatus, resetUserPassword } = useApp();

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">User Accounts</h1>
        <p className="text-sm text-cc-muted">View, disable, or reset student accounts</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cc-mint-soft">
              <tr className="text-left text-xs text-cc-muted">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Txns</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-cc-forest">{u.name}</p>
                    <p className="text-xs text-cc-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-cc-muted">{u.year}</td>
                  <td className="px-4 py-3 font-medium">{u.transactions}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.status === 'active' ? 'bg-cc-mint text-cc-lime-dark' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-cc-lime"
                      title={u.status === 'active' ? 'Disable' : 'Enable'}
                    >
                      {u.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {u.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetUserPassword(u.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-cc-lime"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
