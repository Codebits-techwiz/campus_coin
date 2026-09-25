import { useState, useEffect } from 'react';
import { Download, Image as ImageIcon, Mail } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatPkr } from '../../utils/currency';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43', '#62b375'];

export default function Reports() {
  const { showToast } = useApp();
  
  const [range, setRange] = useState('2026-09'); // Assuming September 2026 for now
  
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [trend6Months, setTrend6Months] = useState([]);
  const [dailyWeekly, setDailyWeekly] = useState({ dailyAverage: 0, weeklyAverage: 0 });
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [catRes, trendRes, dwRes] = await Promise.all([
          api.get(`/api/reports/category-breakdown?month=${range}`),
          api.get(`/api/reports/trend-6months?month=${range}`),
          api.get(`/api/reports/daily-weekly?month=${range}`)
        ]);
        
        if (catRes.data.success && catRes.data.data && catRes.data.data.categories) {
          // Format for PieChart: name, value
          setCategoryBreakdown(catRes.data.data.categories.map(d => ({ name: d.name || d.categoryId, value: d.total })));
        }
        if (trendRes.data.success) {
          // Format for BarChart: month, income, expense
          setTrend6Months(trendRes.data.data.map(d => ({ month: d._id, income: d.income, expense: d.expense })));
        }
        if (dwRes.data.success) {
          setDailyWeekly(dwRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
      setLoading(false);
    };
    
    fetchReports();
  }, [range]);

  const handleExportPdf = async () => {
    try {
      showToast('Generating PDF...', 'success');
      const res = await api.get(`/api/reports/export-pdf?month=${range}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campus-coin-report-${range}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('Failed to export PDF', 'error');
    }
  };

  const handleShareEmail = async () => {
    const email = prompt("Enter parent's email address:");
    if (!email) return;
    setSharing(true);
    try {
      const res = await api.post('/api/reports/share-email', { recipientEmail: email, month: range });
      if (res.data.success) showToast('Email sent successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send email', 'error');
    }
    setSharing(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Monthly Reports</h1>
          <p className="text-sm text-cc-muted">Category breakdown · trends · export</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleExportPdf}
          >
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleShareEmail}
            disabled={sharing}
          >
            <Mail className="w-4 h-4" /> Share Email
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="2026-09">September 2026</option>
          <option value="2026-08">August 2026</option>
          <option value="2026-07">July 2026</option>
        </select>
      </div>
      
      {loading ? (
         <div className="text-center py-10 text-cc-muted text-sm">Loading reports...</div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-cc-forest mb-4">Category-wise Spending</h2>
              <div className="h-64">
                {categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                        {categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPkr(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">No spending data for this month.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-cc-forest mb-4">Income vs Expense (6 months)</h2>
              <div className="h-64">
                {trend6Months.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend6Months}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPkr(value)} />
                      <Bar dataKey="income" fill="#5CB85C" name="Income" />
                      <Bar dataKey="expense" fill="#0B3D2E" name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">No trend data available.</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-cc-forest mb-4">Averages</h2>
            <div className="flex gap-10">
               <div>
                  <p className="text-xs text-cc-muted uppercase font-bold mb-1">Daily Average Spending</p>
                  <p className="text-2xl font-extrabold text-cc-ink">{formatPkr(dailyWeekly.dailyAverage)}</p>
               </div>
               <div>
                  <p className="text-xs text-cc-muted uppercase font-bold mb-1">Weekly Average Spending</p>
                  <p className="text-2xl font-extrabold text-cc-ink">{formatPkr(dailyWeekly.weeklyAverage)}</p>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
