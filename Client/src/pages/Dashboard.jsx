import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

const COLORS = ['#4CAF50', '#F44336']; 

const Dashboard = () => {
  const stats = useAuthStore(state => state.stats);
  const getDashboardStats = useAuthStore(state => state.getDashboardStats);
  const manualSync = useAuthStore(state => state.manualSync);
  const sendReminder = useAuthStore(state => state.sendReminder);
  const navigate = useNavigate();
  const theme = useTheme();

  const [syncing, setSyncing] = useState(false);

  const isDark = theme.palette.mode === 'dark';
  const cardBg = isDark ? 'bg-stone-800' : 'bg-stone-50';
  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const subTextColor = isDark ? 'text-gray-300' : 'text-gray-600';

  useEffect(() => {
    getDashboardStats();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    await manualSync();
    await getDashboardStats();
    setSyncing(false);
  };

  return (
    <div className="p-8 space-y-10 min-h-screen">
      <h1 className="text-4xl font-bold">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Students" value={stats.totalStudents} color="bg-indigo-600" />
        <Card title="Avg Rating" value={stats.avgRating != null ? stats.avgRating.toFixed(1) : '—'} color="bg-purple-600" />
        <Card title="Inactive Students" value={stats.inactiveCount} color="bg-red-600" />
        <Card title="Last Synced" value={stats.lastSync ? new Date(stats.lastSync).toLocaleString() : '—'} color="bg-green-600" />
      </div>

      <div className={`${cardBg} p-6 shadow-md rounded-lg mb-8`}>
        <h2 className={`text-2xl font-bold ${textColor}`}>🧠 Problems Solved Today</h2>
        <p className="mt-4 text-5xl font-extrabold text-indigo-600 tracking-wider">
          {stats.solvedToday}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className={`${cardBg} p-6 shadow rounded-xl`}>
          <h2 className={`text-xl font-semibold mb-3 ${textColor}`}>
            📅 Problems Solved (Last 30 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={stats.problemsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fill: isDark ? '#ccc' : '#555' }} />
                <YAxis tick={{ fill: isDark ? '#ccc' : '#555' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={`${cardBg} p-6 shadow rounded-xl`}>
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>
            🧑‍💻 Active vs Inactive
          </h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.activePie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: isDark ? '#eee' : '#333', fontSize: 12 }}
                >
                  {stats.activePie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className={`${cardBg} p-6 shadow rounded-xl`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>📝 Recent Activity</h2>
        <ul className={`list-disc list-inside space-y-2 ${subTextColor}`}>
          {stats.recentLogs.length > 0 ? (
            stats.recentLogs.map((log) => (
              <li key={log._id}>
                <span className="font-medium">{log.message}</span>{' '}
                <span className="text-sm text-gray-500">
                  ({new Date(log.date).toLocaleString()})
                </span>
              </li>
            ))
          ) : (
            <li className="italic text-gray-400">No recent activity.</li>
          )}
        </ul>
      </section>

      <div className="flex space-x-4">
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className={`px-4 py-2 ${syncing ? 'bg-blue-400' : 'bg-blue-600'} text-white rounded hover:bg-blue-700`}
        >
          {syncing ? '🔄 Syncing...' : '🔄 Manual Sync'}
        </button>
        <button
          onClick={sendReminder}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          📩 Send Reminders
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`${color} text-white p-4 shadow-lg rounded-lg`}>
      <h3 className="text-sm uppercase tracking-wide">{title}</h3>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default Dashboard;