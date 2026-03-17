import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatusBadge } from '@/components/SiqComponents';

const SubmissionDetail = () => {
  const navigate = useNavigate();

  const checkpoints = [
    { title: 'Setup & Instrument Positioning', status: 'Passed' as const, score: 85, strengths: 'Instrument positioning is correct. Angle of approach matches expert benchmark.', improvements: '' },
    { title: 'Incision Depth Control', status: 'Flagged' as const, score: 62, strengths: 'Initial depth was appropriate.', improvements: 'Left-hand stabilization could be more consistent. Depth variance detected in middle third.' },
    { title: 'Suture Technique', status: 'Passed' as const, score: 80, strengths: 'Suture spacing is consistent and meets benchmark criteria.', improvements: 'Minor tension inconsistency on the final two stitches.' },
    { title: 'Wound Edge Alignment', status: 'Flagged' as const, score: 68, strengths: 'Right-edge alignment is excellent.', improvements: 'Left-edge shows slight irregularity. Review expert reference for correction.' },
    { title: 'Final Closure & Cleanup', status: 'Passed' as const, score: 90, strengths: 'Clean closure with no debris. Excellent final presentation.', improvements: '' },
  ];

  return (
    <PageLayout title="Feedback Report" activeTab="submissions">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Wound Closure</h2>
        <p className="text-muted-foreground text-sm">Oct 24, 2023 • Video Submission</p>
      </div>

      {/* Overall Banner */}
      <SiqCard className="mb-8 p-6 flex items-center justify-between border-l-4 border-l-success">
        <div>
          <StatusBadge status="Passed" />
          <p className="text-sm text-muted-foreground mt-3 pr-4">Strong technique overall. Left-edge alignment needs minor improvement.</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-primary">78</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ 100</div>
        </div>
      </SiqCard>

      {/* Checkpoint Analysis */}
      <section className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Checkpoint Analysis</h3>
        <div className="space-y-4">
          {checkpoints.map((cp, i) => (
            <SiqCard key={i} className="overflow-hidden p-0">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h4 className="font-bold text-sm text-primary">Checkpoint {i + 1} — {cp.title}</h4>
                <StatusBadge status={cp.status} />
              </div>
              <div className="p-4 bg-card-alt">
                <div className="flex gap-4 mb-3">
                  <div className="w-24 h-16 bg-border rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    <Camera size={20} className="opacity-20" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                      <span className="text-sm font-bold text-primary">{cp.score}/100</span>
                    </div>
                    {cp.strengths && (
                      <div>
                        <span className="text-[10px] font-bold text-success uppercase">✅ Strengths</span>
                        <p className="text-xs text-foreground leading-relaxed">{cp.strengths}</p>
                      </div>
                    )}
                    {cp.improvements && (
                      <div>
                        <span className="text-[10px] font-bold text-warning uppercase">⚠️ Improvements</span>
                        <p className="text-xs text-foreground leading-relaxed">{cp.improvements}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button className="w-full py-2 bg-card border border-border rounded-lg text-[11px] font-bold text-primary uppercase tracking-wider hover:bg-accent transition-colors">
                  Compare to Expert →
                </button>
              </div>
            </SiqCard>
          ))}
        </div>
      </section>

      {/* Timing Insights */}
      <section className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Timing Insights</h3>
        <SiqCard>
          <div className="space-y-4">
            {[
              { label: 'Setup', trainee: '2:10', expert: '1:45', percent: 80 },
              { label: 'Execution', trainee: '5:45', expert: '6:00', percent: 95 },
              { label: 'Closure', trainee: '3:20', expert: '2:50', percent: 85 },
            ].map((t, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  <span>{t.label}</span>
                  <span>{t.trainee} <span className="opacity-50">/ {t.expert}</span></span>
                </div>
                <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${t.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SiqCard>
      </section>

      {/* Recommendations */}
      <section className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Overall Recommendations</h3>
        <SiqCard>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm">
              <span className="text-secondary font-bold">•</span>
              <span>Practice left-edge alignment on the simulation model before next submission</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-secondary font-bold">•</span>
              <span>Review expert video on burr hole depth control</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-success font-bold">•</span>
              <span>Your setup and instrument selection were excellent — maintain this consistency</span>
            </li>
          </ul>
        </SiqCard>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/new-submission')} className="py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 active:scale-[0.98] transition-all">
          Submit Another
        </button>
        <button className="py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
          Share Report
        </button>
      </div>
    </PageLayout>
  );
};

export default SubmissionDetail;
