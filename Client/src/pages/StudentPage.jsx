import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStudentStore from '../store/useStudentStore';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { startOfYear, endOfYear } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentPage = () => {
  const { id } = useParams();
  const { selectedStudent, getStudentById, contestHistory, fetchContestHistory, problemStats, fetchProblemStats, heatmapData, fetchHeatmap } = useStudentStore();
  const [contestFilter, setContestFilter] = useState('90');
  const [problemFilter, setProblemFilter] = useState('30');
  const [heatmapYear, setHeatmapYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (id) {
      getStudentById(id);
      fetchContestHistory(id, contestFilter);
      fetchProblemStats(id, problemFilter);
    }
  }, [id, getStudentById, fetchContestHistory, contestFilter, fetchProblemStats, problemFilter]);

  useEffect(() => {
    if (id) {
      fetchHeatmap(id, heatmapYear);
    }
  }, [id, heatmapYear, fetchHeatmap]);

  if (!selectedStudent) return <p className="p-4">Loading student data...</p>;

  return (
    <div className="p-4 space-y-8">
      <div className="border-b pb-2">
        <h1 className="text-2xl font-bold">{selectedStudent.name}</h1>
        <p className="text-gray-600">Codeforces: @{selectedStudent.codeforcesHandle}</p>
      </div>

      {/* Contest History Section */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Contest History</h2>
          <select
            className="border p-1 rounded"
            value={contestFilter}
            onChange={(e) => setContestFilter(Number(e.target.value))}
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
        </div>

        {contestHistory.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
            <p>No contests in the last {contestFilter} days.</p>
            <p className="mt-2 text-sm">
              Encourage the student to participate in upcoming contests!
            </p>
          </div>
          
        ) : ( 
          <>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={contestHistory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={label => new Date(label).toLocaleString()} />
                  <Line type="monotone" dataKey="newRating" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Contest</th>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Rating Change</th>
                    <th className="px-4 py-2">Unsolved</th>
                  </tr>
                </thead>
                <tbody>
                  {contestHistory.map(c => (
                    <tr key={c._id} className="border-b even:bg-gray-50">
                      <td className="px-4 py-2">{new Date(c.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{c.contestName}</td>
                      <td className="px-4 py-2">{c.rank}</td>
                      <td className="px-4 py-2">{c.ratingChange}</td>
                      <td className="px-4 py-2">{c.problemsUnsolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Problem Solving Data</h2>
          <select
            className="border p-1 rounded"
            value={problemFilter}
            onChange={(e) => setProblemFilter(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {!problemStats || problemStats.totalProblemsSolved === 0 ? (
          <div className="p-4 bg-blue-50 text-blue-800 rounded">
            <p>No problems solved in the last {problemFilter} days.</p>
            <p className="mt-2 text-sm">
              Get coding! Try solving a problem today to build momentum.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-medium">Total Solved</h3>
                <p className="text-2xl">{problemStats.totalProblemsSolved}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-medium">Avg. Rating</h3>
                <p className="text-2xl">{problemStats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-medium">Avg. per Day</h3>
                <p className="text-2xl">{problemStats.averageProblemsPerDay.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-medium">Hardest Problem</h3>
                <p className="text-xl">
                  {problemStats.mostDifficultProblem.name} ({problemStats.mostDifficultProblem.rating})
                </p>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer>
                <BarChart
                  data={Object.entries(problemStats.ratingDistribution).map(([rating, count]) => ({ rating, count }))}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Submission Heatmap</h3>
          <select
            value={heatmapYear}
            onChange={(e) => setHeatmapYear(Number(e.target.value))}
            className="border p-1 rounded"
          >
            {[2025, 2024, 2023].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <CalendarHeatmap
            startDate={startOfYear(new Date(heatmapYear, 0, 1))}
            endDate={endOfYear(new Date(heatmapYear, 11, 31))}
            values={heatmapData}
            classForValue={value => {
              if (!value) return 'color-empty';
              if (value.count >= 10) return 'color-github-4';
              if (value.count >= 7) return 'color-github-3';
              if (value.count >= 4) return 'color-github-2';
              if (value.count >= 1) return 'color-github-1';
              return 'color-empty';
            }}
            tooltipDataAttrs={value =>
              value.date
                ? { 'data-tip': `${value.date}: ${value.count} submissions` }
                : { 'data-tip': 'No submissions' }
            }
            showWeekdayLabels
          />
        </div>
      </section>
    </div>
  );
};

export default StudentPage;
