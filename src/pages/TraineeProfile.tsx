import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, Video } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatCard, StatusBadge } from '@/components/SiqComponents';
import { MOCK_SUBMISSIONS } from '@/lib/mockData';

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const trainee = {
    name: 'Dr. Jamie Patel',
    year: 'PGY2',
    specialty: 'General Surgery',
    submissions: 6,
    passRate: '50%',
    avgScore: 61,
    lastActive: 'Oct 24, 2023',
  };

  const scores = [52, 48, 55, 62, 58, 61];

  return (
    <PageLayout title="Trainee Profile" activeTab="stats">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-3 shadow-lg">
          JP
        </div>
        <h2 className="text-xl font-bold text-primary">{trainee.name}</h2>
        <p className="text-muted-foreground">{trainee.year} • {trainee.specialty}</p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { label: 'Total', value: String(trainee.submissions) },
          { label: 'Pass Rate', value: trainee.passRate },
          { label: 'Avg Score', value: String(trainee.avgScore) },
          { label: 'Last Active', value: 'Oct 24' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-lg font-bold text-primary">{s.value}</div>
            <div className="text-[9px] text-muted-foreground uppercase font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Performance Trend */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Performance Trend</h3>
        <SiqCard>
          <div className="flex items-end gap-2 h-32">
            {scores.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">{v}</span>
                <div className="w-full rounded-t-md" style={{ height: `${v}%` }}>
                  <div className={`w-full h-full rounded-t-md ${v >= 60 ? 'bg-secondary' : 'bg-destructive/60'}`} />
                </div>
              </div>
            ))}
          </div>
        </SiqCard>
      </section>

      {/* Procedure Breakdown */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Procedure Breakdown</h3>
        <SiqCard>
          <div className="space-y-3">
            {[
              { proc: 'Wound Closure', avg: 68 },
              { proc: 'Burr Hole', avg: 52 },
              { proc: 'Skin Incision', avg: 64 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
                  <span>{p.proc}</span>
                  <span>{p.avg}/100</span>
                </div>
                <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${p.avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SiqCard>
      </section>

      {/* Flagged Issues */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Flagged Issues</h3>
        <div className="space-y-2">
          {[
            { issue: 'Left-edge irregularity', count: 3 },
            { issue: 'Depth control variance', count: 2 },
          ].map((f, i) => (
            <SiqCard key={i} className="flex justify-between items-center">
              <span className="text-sm font-medium text-primary">{f.issue}</span>
              <span className="text-xs font-bold text-warning">{f.count}x flagged</span>
            </SiqCard>
          ))}
        </div>
      </section>

      {/* All Submissions */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">All Submissions</h3>
        <div className="space-y-3">
          {MOCK_SUBMISSIONS.slice(0, 4).map(s => (
            <SiqCard key={s.id} onClick={() => navigate('/submission-detail')} className="flex items-center justify-between hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Video size={16} className="text-primary" />
                <div>
                  <h4 className="font-bold text-sm text-primary">{s.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">{s.score}</span>
                <StatusBadge status={s.status} />
              </div>
            </SiqCard>
          ))}
        </div>
      </section>

      <button
        onClick={() => setShowFeedback(true)}
        className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Send Feedback to Trainee
      </button>

      {showFeedback && (
        <div className="fixed inset-0 bg-foreground/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowFeedback(false)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-soft" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-primary mb-4">Send Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-primary min-h-[120px] mb-4"
              placeholder="Write your feedback for the trainee..."
            />
            <div className="flex gap-3">
              <button onClick={() => setShowFeedback(false)} className="flex-1 py-3 border border-border rounded-lg font-bold text-muted-foreground">Cancel</button>
              <button onClick={() => setShowFeedback(false)} className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-bold">Send</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default TraineeProfile;
