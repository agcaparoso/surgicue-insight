import { useNavigate } from 'react-router-dom';
import { Video, Microscope } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatCard, StatusBadge, SectionHeader } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';
import { MOCK_SUBMISSIONS } from '@/lib/mockData';

const DashboardResident = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user.name || 'Dr. Rivera';

  return (
    <PageLayout title="Home" showBack={false} activeTab="home">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary font-display">Welcome back, {displayName}</h2>
        <p className="text-muted-foreground text-sm mt-1">Here is your training snapshot</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Submissions" value="8" />
        <StatCard label="Passed" value="6" colorClass="text-success" />
        <StatCard label="Flagged" value="2" colorClass="text-warning" />
        <StatCard label="Avg Score" value="74%" />
      </div>

      <SectionHeader>Recent Submissions</SectionHeader>
      <div className="space-y-3 mb-2">
        {MOCK_SUBMISSIONS.slice(0, 3).map(s => (
          <SiqCard key={s.id} onClick={() => navigate('/submission-detail')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Video size={16} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">{s.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-black font-display ${s.status === 'Passed' ? 'text-secondary' : 'text-warning'}`}>{s.score}</span>
                <StatusBadge status={s.status} />
              </div>
            </div>
          </SiqCard>
        ))}
        <button onClick={() => navigate('/submissions')} className="w-full text-center text-xs font-bold text-secondary uppercase tracking-wider py-2 hover:underline">
          View All Submissions →
        </button>
      </div>

      {/* Progress Chart */}
      <SectionHeader icon="📈">Your Progress Over Time</SectionHeader>
      <SiqCard className="mb-2">
        <div className="flex items-end gap-3 h-32">
          {[61, 65, 70, 68, 74].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-muted-foreground">{v}%</span>
              <div className="w-full rounded-lg overflow-hidden" style={{ height: `${v}%` }}>
                <div className="w-full h-full bg-secondary rounded-lg" />
              </div>
              <span className="text-[9px] text-muted-foreground font-medium">#{i + 1}</span>
            </div>
          ))}
        </div>
      </SiqCard>

      <SiqCard className="bg-primary text-primary-foreground p-6 relative overflow-hidden rounded-2xl mt-6">
        <div className="relative z-10">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2 font-display">Expert Tip of the Day</h4>
          <p className="text-base font-medium leading-snug italic">
            "The surgeon who takes two extra minutes to close correctly saves two weeks of complications."
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Microscope size={100} />
        </div>
      </SiqCard>
    </PageLayout>
  );
};

export default DashboardResident;
