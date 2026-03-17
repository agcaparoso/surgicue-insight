import { useNavigate } from 'react-router-dom';
import { TrendingDown, Video } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatCard, StatusBadge, SectionHeader } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';
import { MOCK_TRAINEES, MOCK_SUBMISSIONS } from '@/lib/mockData';

const DashboardEducator = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user.name || 'Dr. Chen';

  return (
    <PageLayout title="Educator Dashboard" showBack={false} activeTab="stats">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary font-display">Welcome, {displayName}</h2>
        <p className="text-muted-foreground text-sm mt-1">Cohort performance — Spring 2026</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Active Trainees" value="12" />
        <StatCard label="Submissions/Mo" value="47" />
        <StatCard label="Pass Rate" value="72%" colorClass="text-success" />
        <StatCard label="Need Attention" value="3" colorClass="text-warning" />
      </div>

      <SectionHeader icon="📊">Cohort Quality Score Trend</SectionHeader>
      <SiqCard className="mb-2">
        <div className="flex items-end gap-3 h-32">
          {[58, 61, 64, 67, 70, 72].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-muted-foreground">{v}%</span>
              <div className="w-full rounded-lg overflow-hidden" style={{ height: `${v}%` }}>
                <div className="w-full h-full bg-secondary rounded-lg" />
              </div>
              <span className="text-[9px] text-muted-foreground font-medium">M{i + 1}</span>
            </div>
          ))}
        </div>
      </SiqCard>

      <SectionHeader icon="⚠️">Common Flagged Issues This Month</SectionHeader>
      <div className="space-y-3 mb-2">
        {[
          { issue: 'Left-edge irregularity', count: 8 },
          { issue: 'Inconsistent suture spacing', count: 6 },
          { issue: 'Incision depth variance', count: 5 },
        ].map((item, i) => (
          <SiqCard key={i} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-primary">{i + 1}. {item.issue}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Flagged in {item.count} submissions</p>
            </div>
            <button onClick={() => navigate('/submissions')} className="text-xs font-bold text-secondary hover:underline">Review →</button>
          </SiqCard>
        ))}
      </div>

      <SectionHeader icon="👥">Trainees Needing Attention</SectionHeader>
      <div className="space-y-3 mb-2">
        {MOCK_TRAINEES.map((t, i) => (
          <SiqCard key={i} onClick={() => navigate('/trainee-profile')}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{t.year} • {t.specialty}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-black font-display text-destructive flex items-center gap-1">{t.lastScore} <TrendingDown size={14} /></div>
                </div>
              </div>
            </div>
          </SiqCard>
        ))}
      </div>

      <SectionHeader>Recent Submissions Across Cohort</SectionHeader>
      <div className="space-y-3">
        {MOCK_SUBMISSIONS.map(s => (
          <SiqCard key={s.id} onClick={() => navigate('/submission-detail')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video size={16} className="text-secondary" />
                <div>
                  <h4 className="font-bold text-sm text-primary">{s.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-black font-display ${s.status === 'Passed' ? 'text-secondary' : s.status === 'Flagged' ? 'text-warning' : 'text-destructive'}`}>{s.score}</span>
                <StatusBadge status={s.status} />
              </div>
            </div>
          </SiqCard>
        ))}
      </div>
    </PageLayout>
  );
};

export default DashboardEducator;
