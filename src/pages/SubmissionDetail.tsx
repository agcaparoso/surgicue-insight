import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Clock, Activity, Layers, Target, Eye, MessageSquare, Image } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, StatusBadge, SegmentedBar } from '@/components/SiqComponents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// --- Data ---

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
    rubricAssessment: 'Port placement was systematic and safe. Trocar triangulation appropriate for standard four-port technique. Pneumoperitoneum achieved efficiently.',
  },
  {
    id: 'P2', name: "Calot's Triangle Dissection", score: 3.3, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 3.5, maxScore: 5 },
      { label: 'Field Clarity', score: 3.2, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '03:05', endTime: '10:20', duration: '07:15', framesAnalyzed: 8,
    observation: "Calot's dissection duration of 07:15 is within acceptable range. Field clarity was periodically suboptimal.",
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
    observation: 'Clip application visible on cystic duct. Clip orientation appears perpendicular. At least two clips on patient-side confirmed.',
    rubricAssessment: 'Clip application was precise and methodical. Excellent execution at expert level.',
  },
  {
    id: 'P4', name: 'Gallbladder Dissection', score: 2.8, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 2.8, maxScore: 5 },
      { label: 'Field Clarity', score: 2.5, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '12:00', endTime: '18:00', duration: '06:00', framesAnalyzed: 10,
    observation: 'Dissection plane appears slightly close to liver in one sequence — risk of bile duct injury if disoriented.',
    rubricAssessment: 'Dissection plane occasionally strayed toward the liver bed. Tissue handling requires improvement — excess thermal application noted.',
    additionalNotes: 'Hook used for most of dissection. Periodic coagulation for small bleeders. Grasper counter-traction adequate.',
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
    rubricAssessment: 'Gallbladder placed into retrieval bag cleanly. No spillage observed. Competent performance.',
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
    rubricAssessment: 'Cleaning was thorough with adequate irrigation. Coagulation applied appropriately. Competent technique.',
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
    rubricAssessment: 'Extraction was smooth and controlled. Port site closure adequate. Clean completion.',
  },
];

const timingData = [
  { phase: 'P1', name: 'Preparation', duration: '03:05', status: 'On Target' },
  { phase: 'P2', name: "Calot's Triangle", duration: '07:15', status: 'On Target' },
  { phase: 'P3', name: 'Clipping & Cutting', duration: '01:40', status: 'On Target' },
  { phase: 'P4', name: 'GB Dissection', duration: '06:00', status: 'On Target' },
  { phase: 'P5', name: 'GB Packaging', duration: '01:30', status: 'On Target' },
  { phase: 'P6', name: 'Clean & Coag', duration: '02:00', status: 'On Target' },
  { phase: 'P7', name: 'GB Retraction', duration: '01:30', status: 'On Target' },
];

const keyFrames = [
  { id: 1, label: 'Port Placement', confidence: 94 },
  { id: 2, label: 'CVS Achieved', confidence: 78 },
  { id: 3, label: 'Clip Application', confidence: 96 },
  { id: 4, label: 'Dissection Plane', confidence: 62 },
  { id: 5, label: 'Bag Insertion', confidence: 91 },
  { id: 6, label: 'Final Hemostasis', confidence: 88 },
];

// --- Helpers ---

const scoreColor = (score: number) =>
  score >= 4 ? 'text-success' : score >= 3 ? 'text-warning' : 'text-destructive';

const MetricPill = ({ label, score, max = 5 }: { label: string; score: number; max?: number }) => (
  <div className="flex items-center justify-between gap-2 text-xs">
    <span className="text-muted-foreground truncate">{label}</span>
    <span className={`font-bold font-display ${scoreColor(score)}`}>{score}/{max}</span>
  </div>
);

// --- Component ---

const SubmissionDetail = () => {
  const navigate = useNavigate();
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [selectedStudent] = useState('Dr. Sarah Chen');
  const [selectedDate] = useState('March 15, 2026');

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const overallScore = 3.7;

  return (
    <PageLayout title="Feedback Report" activeTab="submissions">
      {/* 1. Header Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 text-sm">
          <Activity size={14} className="text-secondary" />
          <span className="font-medium text-foreground">{selectedStudent}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 text-sm">
          <Clock size={14} className="text-secondary" />
          <span className="text-muted-foreground">{selectedDate}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 text-sm">
          <Target size={14} className="text-secondary" />
          <span className="text-muted-foreground">Laparoscopic Cholecystectomy</span>
        </div>
      </div>

      {/* 2. Summary Cards — Single aligned row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SiqCard className="py-4 px-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Score</div>
          <div className="text-2xl font-black font-display text-foreground">{overallScore} <span className="text-sm font-normal text-muted-foreground">/ 5</span></div>
        </SiqCard>
        <SiqCard className="py-4 px-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Competency</div>
          <div className="text-sm font-bold font-display text-foreground leading-tight">Intermediate</div>
        </SiqCard>
        <SiqCard className="py-4 px-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Phases Detected</div>
          <div className="text-2xl font-black font-display text-foreground">{phases.length}</div>
        </SiqCard>
        <SiqCard className="py-4 px-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Duration</div>
          <div className="text-2xl font-black font-display text-foreground">23:00</div>
        </SiqCard>
      </div>

      {/* 3. Tab Bar */}
      <Tabs defaultValue="scorecard" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6 bg-accent/60 rounded-xl p-1 h-auto">
          <TabsTrigger value="scorecard" className="text-xs font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-primary gap-1.5">
            <Layers size={14} /> Scorecard
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-primary gap-1.5">
            <Clock size={14} /> Timeline
          </TabsTrigger>
          <TabsTrigger value="keyframes" className="text-xs font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-primary gap-1.5">
            <Image size={14} /> Frames
          </TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-primary gap-1.5">
            <MessageSquare size={14} /> Feedback
          </TabsTrigger>
        </TabsList>

        {/* === SCORECARD TAB === */}
        <TabsContent value="scorecard">
          <div className="space-y-3">
            {phases.map((phase) => {
              const isExpanded = expandedPhases.includes(phase.id);
              return (
                <div key={phase.id} className="rounded-xl overflow-hidden border border-border/50 shadow-card bg-card">
                  {/* Always-visible phase summary */}
                  <div className="px-4 py-3.5">
                    {/* Row 1: Phase ID, Name, Score, Status */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="font-display font-bold text-secondary text-xs shrink-0 w-7">{phase.id}</span>
                      <span className="font-semibold text-sm text-foreground flex-1 truncate">{phase.name}</span>
                      <span className={`font-display font-black text-lg ${scoreColor(phase.score)}`}>
                        {phase.score}
                      </span>
                      <StatusBadge status={phase.status} />
                    </div>

                    {/* Row 2: Inline rubric metrics */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-2.5 pl-10">
                      {phase.rubrics.map((r, i) => (
                        <MetricPill key={i} label={r.label} score={r.score} max={r.maxScore} />
                      ))}
                    </div>

                    {/* Row 3: Timing + Condensed insight */}
                    <div className="flex items-start gap-3 pl-10">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
                        <Clock size={12} />
                        <span>{phase.startTime} → {phase.endTime}</span>
                        <span className="font-medium text-foreground">({phase.duration})</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 pl-10 line-clamp-2 leading-relaxed">
                      {phase.observation}
                    </p>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors border-t border-border/30 ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-accent/40 text-muted-foreground hover:bg-accent/70'}`}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>Full rubric notes & AI observations</span>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 py-4 bg-accent/20 border-t border-border/30 space-y-3">
                      <div className="border-l-2 border-l-secondary pl-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Observation</p>
                        <p className="text-sm text-foreground leading-relaxed">{phase.observation}</p>
                      </div>
                      {phase.additionalNotes && (
                        <div className="border-l-2 border-l-warning pl-3">
                          <p className="text-xs font-bold text-warning uppercase tracking-wider mb-1">Additional Notes</p>
                          <p className="text-sm text-foreground leading-relaxed">{phase.additionalNotes}</p>
                        </div>
                      )}
                      <div className="border-l-2 border-l-primary pl-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Rubric Assessment</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{phase.rubricAssessment}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* === TIMELINE TAB === */}
        <TabsContent value="timeline">
          <SiqCard className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left py-2.5 pr-3">Phase</th>
                  <th className="text-left py-2.5 pr-3">Name</th>
                  <th className="text-left py-2.5 pr-3">Duration</th>
                  <th className="text-left py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {timingData.map((t) => (
                  <tr key={t.phase} className="border-b border-border/30 last:border-0">
                    <td className="py-2.5 pr-3 font-bold text-secondary text-xs">{t.phase}</td>
                    <td className="py-2.5 pr-3 text-foreground">{t.name}</td>
                    <td className="py-2.5 pr-3 font-medium font-display text-foreground">{t.duration}</td>
                    <td className="py-2.5 text-success font-medium text-xs">✓ {t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Minimal horizontal bar visualization */}
            <div className="mt-5 pt-4 border-t border-border/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Phase Duration</p>
              <div className="space-y-2">
                {phases.map((p) => {
                  const [min, sec] = p.duration.split(':').map(Number);
                  const totalSec = min * 60 + sec;
                  const maxSec = 7 * 60 + 15; // longest phase
                  const pct = (totalSec / maxSec) * 100;
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-6 shrink-0 font-bold">{p.id}</span>
                      <div className="flex-1 h-4 bg-accent rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.status === 'Flagged' ? 'bg-warning/70' : 'bg-secondary/60'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-10 text-right">{p.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SiqCard>
        </TabsContent>

        {/* === KEY FRAMES TAB === */}
        <TabsContent value="keyframes">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {keyFrames.map((frame) => (
              <SiqCard key={frame.id} className="p-0 overflow-hidden">
                <div className="aspect-video bg-accent flex items-center justify-center">
                  <Eye size={24} className="text-muted-foreground/40" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{frame.label}</span>
                  <span className={`text-xs font-bold font-display ${frame.confidence >= 80 ? 'text-success' : frame.confidence >= 60 ? 'text-warning' : 'text-destructive'}`}>
                    {frame.confidence}%
                  </span>
                </div>
              </SiqCard>
            ))}
          </div>
        </TabsContent>

        {/* === FEEDBACK TAB === */}
        <TabsContent value="feedback">
          <FeedbackSection />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button onClick={() => navigate('/new-submission')} className="py-3.5 border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all">
          Submit Another
        </button>
        <button className="py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
          Share Report
        </button>
      </div>
    </PageLayout>
  );
};

// --- Feedback Section (condensed first, expandable) ---

const FeedbackSection = () => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="space-y-4">
      {/* Condensed summary */}
      <SiqCard>
        <p className="text-sm text-foreground leading-relaxed mb-3">
          <strong>Overall:</strong> Intermediate — Ready for Supervised Practice (3.7/5.0). Strong performance across 5 of 7 phases with 2 requiring improvement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex gap-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Top Strength</p>
              <p className="text-xs text-muted-foreground">Clipping & Cutting (4.5/5) — expert-level clip application</p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Top Improvement</p>
              <p className="text-xs text-muted-foreground">GB Dissection (2.8/5) — plane identification needs work</p>
            </div>
          </div>
        </div>
      </SiqCard>

      {/* Expand full feedback */}
      <button
        onClick={() => setShowFull(!showFull)}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-secondary hover:bg-accent/50 rounded-lg transition-colors"
      >
        {showFull ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {showFull ? 'Collapse full evaluation' : 'View full evaluation & phase breakdown'}
      </button>

      {showFull && (
        <SiqCard className="space-y-3 text-sm text-foreground leading-relaxed">
          <p>
            The strongest performance was observed during <strong>Clipping & Cutting</strong> (4.5/5.0), where technique, instrument control,
            and pacing were consistent with competent practice.
          </p>
          <p>
            The area most requiring attention is <strong>Gallbladder Dissection</strong> (2.8/5.0). The dissection plane periodically approached
            the liver bed rather than tracking along the gallbladder wall. Thermal application was slightly excessive in the mid-phase.
          </p>
          <p>
            <strong>Recommendation:</strong> Supervised practice on 5–10 additional standard cases is recommended. Specific simulation drills
            for the gallbladder dissection phase would accelerate progression.
          </p>
        </SiqCard>
      )}
    </div>
  );
};

export default SubmissionDetail;
