import axios from 'axios';
import Student from '../models/student.model.js';
import Contest from '../models/contest.model.js';
import Submission from '../models/submission.model.js';
import ProblemStats from '../models/problemStats.model.js';

async function upsertContest(studentId, contest) {
  const { contestId, contestName, rank, oldRating, newRating, ratingUpdateTimeSeconds } = contest;
  const date = new Date(ratingUpdateTimeSeconds * 1000);
  await Contest.findOneAndUpdate(
    { studentId, contestId },
    {
      studentId,
      contestId,
      contestName,
      rank,
      ratingChange: newRating-oldRating,
      newRating,
      problemsUnsolved: 0, 
      date
    },
    { upsert: true }
  );
}

async function storeSubmissions(studentId, submissions) {
  const accepted = submissions.filter(s => s.verdict === 'OK');

  if (accepted.length > 0) {
    const latest = accepted.reduce((latest, s) =>
      s.creationTimeSeconds > latest.creationTimeSeconds ? s : latest
    );
    const latestDate = new Date(latest.creationTimeSeconds * 1000);

    await Student.findByIdAndUpdate(studentId, {
      lastSubmissionDate: latestDate
    });
  }
  
  const docs = accepted.map(s => ({
    studentId,
    problemId: `${s.problem.contestId}-${s.problem.index}`,
    contestId: s.problem.contestId,
    index: s.problem.index,
    problemName: s.problem.name,
    rating: s.problem.rating,
    verdict: s.verdict,
    creationTimeSeconds: s.creationTimeSeconds
  }));
  await Submission.insertMany(docs, { ordered: false }).catch(() => {});

}

async function generateProblemStats(studentId, fromDate, toDate, rangeLabel) {
  const subs = await Submission.find({
    studentId,
    creationTimeSeconds: {
      $gte: Math.floor(fromDate.getTime() / 1000),
      $lte: Math.floor(toDate.getTime() / 1000)
    }
  });

  if (!subs.length) return;

  const total = subs.length;
  const sumRatings = subs.reduce((sum, s) => sum + (s.rating || 0), 0);
  const avgRating = sumRatings / total;
  const days = (toDate - fromDate) / (1000 * 60 * 60 * 24);
  const avgPerDay = total / (days || 1);

  const hardest = subs.reduce((max, s) => (s.rating > (max.rating || 0) ? s : max), { rating: 0 });

  const dist = subs.reduce((map, s) => {
    const key = String(s.rating || 'unrated');
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});

  await ProblemStats.findOneAndUpdate(
    { studentId, range: rangeLabel },
    {
      studentId,
      range: rangeLabel,
      fromDate,
      toDate,
      totalProblemsSolved: total,
      averageRating: avgRating,
      averageProblemsPerDay: avgPerDay,
      mostDifficultProblem: { problemName: hardest.problemName, rating: hardest.rating },
      ratingDistribution: dist
    },
    { upsert: true }
  );
}

export async function runCodeforcesSync(targetStudentId = null) {
  const filter = targetStudentId
    ? { _id: targetStudentId, codeforcesHandle: { $exists: true, $ne: '' } }
    : { codeforcesHandle: { $exists: true, $ne: '' } };

  const students = await Student.find(filter);
  console.log("🔍 Students to sync:", students.map(s => s.codeforcesHandle));

  for (const stu of students) {
    try {
      const handle = stu.codeforcesHandle;

      const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
      const user = infoRes.data.result[0];
      await Student.findByIdAndUpdate(stu._id, {
        currentRating: user.rating,
        maxRating: user.maxRating,
        lastSynced: new Date()
      });


      const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
      for (const c of ratingRes.data.result) {
        await upsertContest(stu._id, c);
      }

      const statusRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
      await storeSubmissions(stu._id, statusRes.data.result);

      const now = new Date();
      await generateProblemStats(stu._id, new Date(now - 7*86400*1000), now, '7d');
      await generateProblemStats(stu._id, new Date(now - 30*86400*1000), now, '30d');
      await generateProblemStats(stu._id, new Date(now - 90*86400*1000), now, '90d');

    } catch (err) {
      console.error(`Sync failed for ${stu.codeforcesHandle}:`, err.message);
    }
  }
}
