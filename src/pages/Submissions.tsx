import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Camera, Microscope } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatusBadge } from '@/components/SiqComponents';
import { MOCK_SUBMISSIONS } from '@/lib/mockData';

const sourceIcons: Record<string, React.ReactNode> = {
  video: <Video size={16} className="text-primary" />,
  photo: <Camera size={16} className="text-primary" />,
  scope: <Microscope size={16} className="text-primary" />,
};

const Submissions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Passed', 'Flagged', 'Needs Work'];

  const filtered = MOCK_SUBMISSIONS.filter(s => {
    if (filter === 'All') return true;
    if (filter === 'Needs Work') return s.status === 'Failed';
    return s.status === filter;
  });

  return (
    <PageLayout title="My Submissions" activeTab="submissions">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${f === filter ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <Camera size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-primary mb-2">No submissions yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Upload your first procedure to get started.</p>
          <button onClick={() => navigate('/new-submission')} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all">
            Make First Submission →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <SiqCard key={s.id} onClick={() => navigate('/submission-detail')} className="flex items-center justify-between hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  {sourceIcons[s.source]}
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
      )}
    </PageLayout>
  );
};

export default Submissions;
