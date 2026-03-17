import { useNavigate } from 'react-router-dom';
import { TrendingDown, Video } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatCard, StatusBadge } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';
import { MOCK_TRAINEES, MOCK_SUBMISSIONS } from '@/lib/mockData';

const DashboardEducator = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user.name || 'Dr. Chen';

  return (
    <PageLayout title="Educator Dashboard" showBack={false} activeTab="stats">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Welcome, {displayName}</h2>
        <p className="text-muted-foreground">Cohort performance — Spring 2026</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Active Trainees" value="12" />
        <StatCard label="Submissions/Mo" value="47" />
        <StatCard label="Pass Rate" value="72%" colorClass="text-success" />
        <StatCard label="Need Attention" value="3" colorClass="text-warning" />
      </div>

      {/* Cohort Trend */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Cohort Quality Score Trend</h3>
        <SiqCard>
          <div className="flex items-end gap-2 h-32">
            {[58, 61, 64, 67, 70, 72].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">{v}%</span>
                <div className="w-full rounded-t-md" style={{ height: `${v}%` }}>
                  <div className="w-full h-full bg-secondary rounded-t-md" />
                </div>
                <span className="text-[9px] text-muted-foreground">M{i + 1}</span>
              </div>
            ))}
          </div>
        </SiqCard>
      </section>

      {/* Common Flagged Issues */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Common Flagged Issues This Month</h3>
        <div className="space-y-3">
          {[
            { issue: 'Left-edge irregularity', count: 8 },
            { issue: 'Inconsistent suture spacing', count: 6 },
            { issue: 'Incision depth variance', count: 5 },
          ].map((item, i) => (
            <SiqCard key={i} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-primary">{i + 1}. {item.issue}</p>
                <p className="text-xs text-muted-foreground">Flagged in {item.count} submissions</p>
              </div>
              <button onClick={() => navigate('/submissions')} className="text-xs font-bold text-secondary">Review →</button>
            </SiqCard>
          ))}
        </div>
      </section>

      {/* Trainees Needing Attention */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Trainees Needing Attention</h3>
        <div className="space-y-3">
          {MOCK_TRAINEES.map((t, i) => (
            <SiqCard key={i} onClick={() => navigate('/trainee-profile')} className="flex items-center justify-between hover:bg-accent/50">
              <div>
                <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.year} • {t.specialty}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-destructive flex items-center gap-1">{t.lastScore} <TrendingDown size={14} /></div>
                  <div className="text-[9px] text-muted-foreground uppercase">Last Score</div>
                </div>
              </div>
            </SiqCard>
          ))}
        </div>
      </section>

      {/* Recent Across Cohort */}
      <section>
        <h3 className="font-bold text-primary mb-4">Recent Submissions Across Cohort</h3>
        <div className="space-y-3">
          {MOCK_SUBMISSIONS.map(s => (
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
    </PageLayout>
  );
};

export default DashboardEducator;
