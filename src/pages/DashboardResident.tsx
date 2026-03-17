import { useNavigate } from 'react-router-dom';
import { Video, Microscope } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatCard, StatusBadge } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';
import { MOCK_SUBMISSIONS } from '@/lib/mockData';

const DashboardResident = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user.name || 'Dr. Rivera';

  return (
    <PageLayout title="Home" showBack={false} activeTab="home">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Welcome back, {displayName}</h2>
        <p className="text-muted-foreground">Here is your training snapshot</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Submissions" value="8" />
        <StatCard label="Passed" value="6" colorClass="text-success" />
        <StatCard label="Flagged" value="2" colorClass="text-warning" />
        <StatCard label="Avg Score" value="74%" />
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-primary">Recent Submissions</h3>
          <button onClick={() => navigate('/submissions')} className="text-xs font-bold text-secondary uppercase tracking-wider">View All</button>
        </div>
        <div className="space-y-3">
          {MOCK_SUBMISSIONS.slice(0, 3).map(s => (
            <SiqCard key={s.id} onClick={() => navigate('/submission-detail')} className="flex items-center justify-between hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Video size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">{s.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{s.score}</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Score</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            </SiqCard>
          ))}
        </div>
      </section>

      {/* Progress Chart */}
      <section className="mb-8">
        <h3 className="font-bold text-primary mb-4">Your Progress Over Time</h3>
        <SiqCard>
          <div className="flex items-end gap-2 h-32">
            {[61, 65, 70, 68, 74].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">{v}%</span>
                <div className="w-full bg-secondary/20 rounded-t-md" style={{ height: `${v}%` }}>
                  <div className="w-full h-full bg-secondary rounded-t-md" />
                </div>
                <span className="text-[9px] text-muted-foreground">#{i + 1}</span>
              </div>
            ))}
          </div>
        </SiqCard>
      </section>

      <SiqCard className="bg-primary text-primary-foreground p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Expert Tip of the Day</h4>
          <p className="text-lg font-medium leading-snug italic">
            "The surgeon who takes two extra minutes to close correctly saves two weeks of complications."
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Microscope size={120} />
        </div>
      </SiqCard>
    </PageLayout>
  );
};

export default DashboardResident;
