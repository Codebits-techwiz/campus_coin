import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43'];

const weeklyActive = [
  { week: 'W1', users: 42 },
  { week: 'W2', users: 58 },
  { week: 'W3', users: 71 },
  { week: 'W4', users: 65 },
];

export default function AdminStats() {
  const { users, transactions, categories } = useApp();

  const catUsage = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catUsage[t.category] = (catUsage[t.category] || 0) + 1;
    });
  const pieData = Object.entries(catUsage).map(([name, value]) => ({ name, value }));

  const totalTx = users.reduce((s, u) => s + u.transactions, 0);

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">Usage Statistics</h1>
        <p className="text-sm text-cc-muted">Active users, transactions logged, most-used categories</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Registered Users</p>
          <p className="text-3xl font-extrabold text-cc-forest mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Transactions Logged</p>
          <p className="text-3xl font-extrabold text-cc-lime mt-1">{totalTx}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Default Categories</p>
          <p className="text-3xl font-extrabold text-cc-forest mt-1">
            {categories.filter((c) => c.isDefault).length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">Weekly Active Users</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActive}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#5CB85C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">Most-Used Categories</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
