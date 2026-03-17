import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatusBadge, SectionHeader, SegmentedBar, ScoreDot } from '@/components/SiqComponents';

interface Phase {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'Passed' | 'Flagged' | 'Failed';
  rubrics: { label: string; score: number; maxScore: number }[];
  startTime: string;
  endTime: string;
  duration: string;
  framesAnalyzed: number;
  observation: string;
  rubricAssessment: string;
  additionalNotes?: string;
}

const phases: Phase[] = [
  {
    id: 'P1', name: 'Preparation', score: 4.2, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.5, maxScore: 5 },
      { label: 'Field Clarity', score: 4.2, maxScore: 5 },
      { label: 'Instrument Control', score: 4.0, maxScore: 5 },
    ],
    startTime: '00:00', endTime: '03:05', duration: '03:05', framesAnalyzed: 3,
    observation: 'Trocar placement appears systematic. Port positioning is appropriate for standard four-port technique.',
    rubricAssessment: 'Port placement was systematic and safe. Trocar triangulation appropriate for standard four-port technique. Pneumoperitoneum achieved efficiently. Competent performance with minor areas for refinement.',
  },
  {
    id: 'P2', name: "Calot's Triangle Dissection", score: 3.3, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 3.5, maxScore: 5 },
      { label: 'Field Clarity', score: 3.2, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '03:05', endTime: '10:20', duration: '07:15', framesAnalyzed: 8,
    observation: "Calot's dissection duration of 07:15 is within acceptable range. However, field clarity was periodically suboptimal — consider improved irrigation or retraction technique.",
    rubricAssessment: 'Verify Critical View of Safety was fully achieved before clipping. Developing technique. Continued supervised practice recommended.',
  },
  {
    id: 'P3', name: 'Clipping & Cutting', score: 4.5, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.5, maxScore: 5 },
      { label: 'Field Clarity', score: 4.6, maxScore: 5 },
      { label: 'Instrument Control', score: 4.4, maxScore: 5 },
    ],
    startTime: '10:20', endTime: '12:00', duration: '01:40', framesAnalyzed: 4,
    observation: 'Clip application visible on cystic duct. Clip orientation appears perpendicular. At least two clips on patient-side confirmed before division.',
    rubricAssessment: 'Clip application was precise and methodical. Clip orientation perpendicular to duct axis. At least two clips visible on patient-side structures. Clean transection. Excellent execution. Performance at expert level.',
  },
  {
    id: 'P4', name: 'Gallbladder Dissection', score: 2.8, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 2.8, maxScore: 5 },
      { label: 'Field Clarity', score: 2.5, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '12:00', endTime: '18:00', duration: '06:00', framesAnalyzed: 10,
    observation: 'Electrocautery dissection of gallbladder from liver bed. Dissection plane appears slightly close to liver in one sequence — risk of bile duct injury if disoriented.',
    rubricAssessment: 'Dissection plane occasionally strayed slightly toward the liver bed rather than hugging the gallbladder wall. Tissue handling requires improvement — excess thermal application noted in mid-dissection. Focus on plane identification early in the phase. Developing technique. Continued supervised practice recommended.',
    additionalNotes: 'Hook used for most of the dissection. Periodic coagulation used for small bleeders. Grasper counter-traction is adequate.',
  },
  {
    id: 'P5', name: 'Gallbladder Packaging', score: 4.0, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.0, maxScore: 5 },
      { label: 'Field Clarity', score: 4.1, maxScore: 5 },
      { label: 'Instrument Control', score: 3.9, maxScore: 5 },
    ],
    startTime: '18:00', endTime: '19:30', duration: '01:30', framesAnalyzed: 3,
    observation: 'Gallbladder packaging in progress. Technique appears controlled, bag opening maintained well.',
    rubricAssessment: 'Gallbladder placed into retrieval bag cleanly. No spillage observed. Bag secured prior to retraction. Competent performance.',
  },
  {
    id: 'P6', name: 'Cleaning & Coagulation', score: 3.8, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 3.8, maxScore: 5 },
      { label: 'Field Clarity', score: 3.7, maxScore: 5 },
      { label: 'Instrument Control', score: 3.9, maxScore: 5 },
    ],
    startTime: '19:30', endTime: '21:30', duration: '02:00', framesAnalyzed: 4,
    observation: 'Irrigation and suction visible. Hemostasis appears adequate at gallbladder fossa.',
    rubricAssessment: 'Cleaning was thorough with adequate irrigation. Coagulation applied appropriately. No residual bleeding observed. Competent technique.',
  },
  {
    id: 'P7', name: 'Gallbladder Retraction', score: 4.1, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.2, maxScore: 5 },
      { label: 'Field Clarity', score: 4.0, maxScore: 5 },
      { label: 'Instrument Control', score: 4.1, maxScore: 5 },
    ],
    startTime: '21:30', endTime: '23:00', duration: '01:30', framesAnalyzed: 2,
    observation: 'Bag extraction through umbilical port. Controlled retraction without tearing.',
    rubricAssessment: 'Extraction was smooth and controlled. Port site closure adequate. Clean completion of procedure.',
  },
];

const timingData = [
  { phase: 'P1', name: 'Preparation', start: '00:00', end: '03:05', duration: '03:05', status: 'On Target' },
  { phase: 'P2', name: "Calot's Triangle Dissection", start: '03:05', end: '10:20', duration: '07:15', status: 'On Target' },
  { phase: 'P3', name: 'Clipping & Cutting', start: '10:20', end: '12:00', duration: '01:40', status: 'On Target' },
  { phase: 'P4', name: 'Gallbladder Dissection', start: '12:00', end: '18:00', duration: '06:00', status: 'On Target' },
  { phase: 'P5', name: 'Gallbladder Packaging', start: '18:00', end: '19:30', duration: '01:30', status: 'On Target' },
  { phase: 'P6', name: 'Cleaning & Coagulation', start: '19:30', end: '21:30', duration: '02:00', status: 'On Target' },
  { phase: 'P7', name: 'Gallbladder Retraction', start: '21:30', end: '23:00', duration: '01:30', status: 'On Target' },
];

const SubmissionDetail = () => {
  const navigate = useNavigate();
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['P1']);

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const overallScore = 3.7;
  const totalPhases = phases.length;

  return (
    <PageLayout title="Feedback Report" activeTab="submissions">
      {/* Summary Banner */}
      <SectionHeader icon="📊">Summary</SectionHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        <SiqCard className="text-center py-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Overall Score</div>
          <div className="text-3xl font-black font-display text-secondary">{overallScore} <span className="text-lg text-muted-foreground font-normal">/ 5</span></div>
        </SiqCard>
        <SiqCard className="text-center py-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Phases Detected</div>
          <div className="text-3xl font-black font-display text-primary">{totalPhases} <span className="text-lg text-muted-foreground font-normal">/ {totalPhases}</span></div>
        </SiqCard>
        <SiqCard className="text-center py-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Duration</div>
          <div className="text-3xl font-black font-display text-primary">23:00</div>
        </SiqCard>
        <SiqCard className="text-center py-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Competency Level</div>
          <div className="text-lg font-bold font-display text-secondary leading-tight">Intermediate — Ready for Practice</div>
        </SiqCard>
      </div>

      {/* Phase-by-Phase Scorecard */}
      <SectionHeader icon="🎯">Phase-by-Phase Scorecard</SectionHeader>
      <div className="space-y-3">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.includes(phase.id);
          return (
            <div key={phase.id} className="rounded-xl overflow-hidden border border-border/50 shadow-card bg-card">
              {/* Phase Header Row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="font-display font-bold text-secondary text-sm shrink-0 w-8">{phase.id}</span>
                <span className="font-semibold text-sm text-primary flex-1">{phase.name}</span>
                <div className="hidden sm:flex flex-1 max-w-[200px]">
                  <SegmentedBar score={phase.score} maxScore={phase.maxScore} />
                </div>
                <span className={`font-display font-black text-xl ${phase.score >= 4 ? 'text-secondary' : phase.score >= 3 ? 'text-warning' : 'text-destructive'}`}>
                  {phase.score}
                </span>
                <StatusBadge status={phase.status} />
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => togglePhase(phase.id)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-accent/60 text-muted-foreground hover:bg-accent'}`}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>↳ {phase.id} details & rubric notes</span>
              </button>

              {isExpanded && (
                <div className={`px-4 py-5 ${phase.status === 'Flagged' ? 'bg-warning/5' : phase.status === 'Passed' ? 'bg-success/5' : 'bg-destructive/5'}`}>
                  {/* Rubric Scores */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {phase.rubrics.map((r, i) => (
                      <SiqCard key={i} className="py-3 px-3 text-center">
                        <div className="text-xs text-muted-foreground font-medium mb-2">{r.label}</div>
                        <ScoreDot score={r.score} maxScore={r.maxScore} />
                      </SiqCard>
                    ))}
                  </div>

                  {/* Timing Info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>⏱ Start: <strong className="text-foreground">{phase.startTime}</strong></span>
                    <span>| End: <strong className="text-foreground">{phase.endTime}</strong></span>
                    <span>| Duration: <strong className="text-secondary">{phase.duration}</strong></span>
                    <span>| Frames analyzed: <strong className="text-foreground">{phase.framesAnalyzed}</strong></span>
                  </div>

                  {/* AI Observation */}
                  <div className="border-l-3 border-l-secondary pl-4 py-2 mb-4 bg-card rounded-r-lg">
                    <p className="text-sm text-foreground leading-relaxed">{phase.observation}</p>
                  </div>

                  {phase.additionalNotes && (
                    <div className="border-l-3 border-l-warning pl-4 py-2 mb-4 bg-card rounded-r-lg">
                      <p className="text-sm text-foreground leading-relaxed">{phase.additionalNotes}</p>
                    </div>
                  )}

                  {/* Rubric Assessment */}
                  <div className="mt-3">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Rubric Assessment:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{phase.rubricAssessment}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Holistic Evaluation */}
      <SectionHeader icon="🧠">Holistic Evaluation</SectionHeader>
      <SiqCard className="mb-2">
        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p>
            Overall assessment: <strong>Intermediate — Ready for Supervised Practice</strong> (score {overallScore}/5.0). The trainee demonstrated strong
            performance across {phases.filter(p => p.score >= 3.5).length} of the evaluated phases, with {phases.filter(p => p.score < 3.5).length} phases requiring improvement.
          </p>
          <p>
            The strongest performance was observed during <strong>Clipping & Cutting</strong> (score 4.5/5.0), where technique, instrument control,
            and pacing were consistent with competent practice. Clip application was methodical, with correct orientation and adequate
            patient-side placement before division.
          </p>
          <p>
            The area most requiring attention is <strong>Gallbladder Dissection</strong> (score 2.8/5.0). The dissection plane periodically approached
            the liver bed rather than tracking along the gallbladder wall, which elevates the risk of inadvertent bile duct injury. Thermal
            application was slightly excessive in the mid-phase. Structured simulation practice on dissection plane identification is recommended.
          </p>
          <p>
            <strong>Recommendation:</strong> The trainee demonstrates solid foundational technique. Supervised practice on 5–10 additional
            standard cases is recommended before independent practice. Specific simulation drills for the gallbladder dissection phase
            would accelerate progression.
          </p>
        </div>
      </SiqCard>

      {/* Phase Timing Summary */}
      <SectionHeader icon="📋">Phase Timing Summary</SectionHeader>
      <SiqCard className="overflow-x-auto mb-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left py-2 pr-4">Phase</th>
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-left py-2 pr-4">Start</th>
              <th className="text-left py-2 pr-4">End</th>
              <th className="text-left py-2 pr-4">Duration</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {timingData.map((t) => (
              <tr key={t.phase} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 pr-4 font-bold text-secondary">{t.phase}</td>
                <td className="py-2.5 pr-4 text-foreground">{t.name}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{t.start}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{t.end}</td>
                <td className="py-2.5 pr-4 font-medium text-foreground">{t.duration}</td>
                <td className="py-2.5 text-success font-medium">✓ {t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SiqCard>

      {/* Phase-by-Phase Observations */}
      <SectionHeader icon="📝">Phase-by-Phase Observations</SectionHeader>
      <div className="space-y-3 mb-8">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.includes(`obs-${phase.id}`);
          return (
            <div key={`obs-${phase.id}`} className="rounded-xl overflow-hidden border border-border/50 shadow-soft">
              <button
                onClick={() => togglePhase(`obs-${phase.id}`)}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-card text-primary hover:bg-accent/50'}`}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {phase.id} — {phase.name} | Score {phase.score}/{phase.maxScore}
              </button>
              {isExpanded && (
                <div className="bg-card p-4 space-y-3">
                  <div className="border-l-3 border-l-secondary pl-4 py-2">
                    <p className="text-sm text-foreground leading-relaxed">{phase.observation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary mb-1">Rubric Assessment:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{phase.rubricAssessment}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/new-submission')} className="py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 active:scale-[0.98] transition-all">
          Submit Another
        </button>
        <button className="py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all">
          Share Report
        </button>
      </div>
    </PageLayout>
  );
};

export default SubmissionDetail;
