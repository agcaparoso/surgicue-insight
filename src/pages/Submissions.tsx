import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Camera, Microscope } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatusBadge, SectionHeader, SegmentedBar } from '@/components/SiqComponents';
import { MOCK_SUBMISSIONS } from '@/lib/mockData';

const sourceIcons: Record<string, React.ReactNode> = {
  video: <Video size={16} className="text-secondary" />,
  photo: <Camera size={16} className="text-secondary" />,
  scope: <Microscope size={16} className="text-secondary" />,
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
      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${f === filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-secondary/50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mb-5">
            <Camera size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-primary text-lg mb-2 font-display">No submissions yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Upload your first procedure to get started.</p>
          <button onClick={() => navigate('/new-submission')} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all">
            Make First Submission →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const scoreNormalized = s.score / 20; // Convert 0-100 to 0-5 scale
            return (
              <SiqCard key={s.id} onClick={() => navigate('/submission-detail')} className="hover:border-secondary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                      {sourceIcons[s.source]}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">{s.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-xl font-black font-display ${s.status === 'Passed' ? 'text-secondary' : s.status === 'Flagged' ? 'text-warning' : 'text-destructive'}`}>{s.score}</div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              </SiqCard>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default Submissions;
