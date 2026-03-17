import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Clock, Activity, Layers, Target, Eye, MessageSquare, Image, Search, User, TrendingUp, Shield, Zap } from 'lucide-react';
import { SiqCard, StatusBadge } from '@/components/SiqComponents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const scoreBg = (score: number) =>
  score >= 4 ? 'bg-success/10' : score >= 3 ? 'bg-warning/10' : 'bg-destructive/10';

// Mini sparkline SVG
const Sparkline = () => (
  <svg width="60" height="20" viewBox="0 0 60 20" className="inline-block ml-2 opacity-60">
    <polyline
      points="0,16 10,12 20,14 30,10 40,8 50,6 60,4"
      fill="none"
      stroke="hsl(197, 58%, 42%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 h-14 bg-card/95 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
          <h1 className="text-lg font-black font-display gradient-text tracking-tight">SurgicalIQ</h1>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border hover:border-secondary/40 transition-colors">
            <User size={14} className="text-primary" />
          </button>
        </header>

        {/* Gradient accent line below header */}
        <div className="gradient-line" />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* 1. Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm shadow-soft">
              <Activity size={14} className="text-secondary" />
              <span className="font-semibold text-foreground">{selectedStudent}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm shadow-soft">
              <Clock size={14} className="text-secondary" />
              <span className="text-muted-foreground">{selectedDate}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm shadow-soft">
              <Target size={14} className="text-secondary" />
              <span className="text-muted-foreground">Laparoscopic Cholecystectomy</span>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-soft">
              <Search size={14} />
              Search Records
            </button>
          </div>

          {/* 2. Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <SiqCard className="py-6 px-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Score</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-display text-foreground">{overallScore}</span>
                <span className="text-sm font-normal text-muted-foreground">/ 5</span>
                <Sparkline />
              </div>
            </SiqCard>
            <SiqCard className="py-6 px-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Competency</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-display text-foreground">Intermediate</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  <Shield size={10} /> Level 3
                </span>
              </div>
            </SiqCard>
            <SiqCard className="py-6 px-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Phases Detected</div>
              <div className="text-3xl font-black font-display text-foreground">{phases.length}</div>
            </SiqCard>
            <SiqCard className="py-6 px-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Duration</div>
              <div className="text-3xl font-black font-display text-foreground">23:00</div>
            </SiqCard>
          </div>

          {/* Recommended Next Step Badge */}
          <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl bg-secondary/5 border border-secondary/20">
            <Zap size={16} className="text-secondary shrink-0" />
            <span className="text-sm text-foreground"><strong className="text-secondary">Recommended:</strong> Supervised practice on 5–10 additional standard cases. Focus drills on gallbladder dissection phase.</span>
          </div>

          {/* Gradient section divider */}
          <div className="gradient-line mb-8" />

          {/* 3. Tabs */}
          <Tabs defaultValue="scorecard" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-8 bg-card rounded-xl p-1.5 h-auto border border-border shadow-soft">
              <TabsTrigger value="scorecard" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft data-[state=active]:gradient-underline gap-1.5 transition-all">
                <Layers size={14} /> Scorecard
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft data-[state=active]:gradient-underline gap-1.5 transition-all">
                <Clock size={14} /> Timeline
              </TabsTrigger>
              <TabsTrigger value="keyframes" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft data-[state=active]:gradient-underline gap-1.5 transition-all">
                <Image size={14} /> Frames
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft data-[state=active]:gradient-underline gap-1.5 transition-all">
                <MessageSquare size={14} /> Feedback
              </TabsTrigger>
            </TabsList>

            {/* === SCORECARD TAB === */}
            <TabsContent value="scorecard">
              {/* Table header */}
              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_0.8fr_2fr] gap-2 px-5 py-3 bg-accent/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Phase</span>
                  <span>Score</span>
                  <span>Tissue</span>
                  <span>Clarity</span>
                  <span>Control</span>
                  <span>Duration</span>
                  <span>Key Insight</span>
                </div>

                {phases.map((phase) => {
                  const isExpanded = expandedPhases.includes(phase.id);
                  return (
                    <div key={phase.id}>
                      {/* Phase row */}
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className={`w-full text-left transition-colors hover:bg-accent/30 ${isExpanded ? 'bg-accent/20' : ''}`}
                      >
                        {/* Desktop: table row */}
                        <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_0.8fr_2fr] gap-2 px-5 py-3.5 items-center border-b border-border/40">
                          <div className="flex items-center gap-3">
                            <div className="gradient-border-left pl-2">
                              <span className="font-display font-bold text-secondary text-xs">{phase.id}</span>
                            </div>
                            <span className="font-semibold text-sm text-foreground truncate">{phase.name}</span>
                            <StatusBadge status={phase.status} />
                          </div>
                          <span className={`font-display font-black text-lg ${scoreColor(phase.score)}`}>{phase.score}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`text-xs font-bold font-display ${scoreColor(phase.rubrics[0].score)} ${scoreBg(phase.rubrics[0].score)} px-2 py-1 rounded-md text-center`}>
                                {phase.rubrics[0].score}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent><p>Tissue Handling: {phase.rubrics[0].score}/{phase.rubrics[0].maxScore}</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`text-xs font-bold font-display ${scoreColor(phase.rubrics[1].score)} ${scoreBg(phase.rubrics[1].score)} px-2 py-1 rounded-md text-center`}>
                                {phase.rubrics[1].score}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent><p>Field Clarity: {phase.rubrics[1].score}/{phase.rubrics[1].maxScore}</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`text-xs font-bold font-display ${scoreColor(phase.rubrics[2].score)} ${scoreBg(phase.rubrics[2].score)} px-2 py-1 rounded-md text-center`}>
                                {phase.rubrics[2].score}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent><p>Instrument Control: {phase.rubrics[2].score}/{phase.rubrics[2].maxScore}</p></TooltipContent>
                          </Tooltip>
                          <span className="text-xs font-medium text-muted-foreground font-display">{phase.duration}</span>
                          <span className="text-xs text-muted-foreground truncate leading-relaxed">{phase.observation}</span>
                        </div>

                        {/* Mobile: card-style row */}
                        <div className="md:hidden px-5 py-4 border-b border-border/40">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-display font-bold text-secondary text-xs shrink-0">{phase.id}</span>
                            <span className="font-semibold text-sm text-foreground flex-1 truncate">{phase.name}</span>
                            <span className={`font-display font-black text-lg ${scoreColor(phase.score)}`}>{phase.score}</span>
                            <StatusBadge status={phase.status} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {phase.rubrics.map((r, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground truncate">{r.label.split(' ')[0]}</span>
                                <span className={`font-bold font-display ${scoreColor(r.score)}`}>{r.score}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Clock size={11} />
                            <span>{phase.duration}</span>
                            <span className="mx-1">·</span>
                            <span className="truncate flex-1">{phase.observation}</span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail — slides down inline */}
                      {isExpanded && (
                        <div className="px-5 py-5 bg-accent/10 border-b border-border/40 space-y-4 animate-accordion-down">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="gradient-border-left pl-4">
                              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1.5">AI Observation</p>
                              <p className="text-sm text-foreground leading-relaxed">{phase.observation}</p>
                            </div>
                            <div className="border-l-2 border-primary/30 pl-4">
                              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Rubric Assessment</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{phase.rubricAssessment}</p>
                            </div>
                          </div>
                          {phase.additionalNotes && (
                            <div className="border-l-2 border-warning/40 pl-4">
                              <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1.5">Additional Notes</p>
                              <p className="text-sm text-foreground leading-relaxed">{phase.additionalNotes}</p>
                            </div>
                          )}
                          {/* Timing detail */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/30">
                            <span><strong className="text-foreground">Start:</strong> {phase.startTime}</span>
                            <span><strong className="text-foreground">End:</strong> {phase.endTime}</span>
                            <span><strong className="text-foreground">Duration:</strong> {phase.duration}</span>
                            <span><strong className="text-foreground">Frames Analyzed:</strong> {phase.framesAnalyzed}</span>
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
                      <th className="text-left py-3 pr-3">Phase</th>
                      <th className="text-left py-3 pr-3">Name</th>
                      <th className="text-left py-3 pr-3">Duration</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timingData.map((t) => (
                      <tr key={t.phase} className="border-b border-border/30 last:border-0 hover:bg-accent/20 transition-colors">
                        <td className="py-3 pr-3 font-bold text-secondary text-xs">{t.phase}</td>
                        <td className="py-3 pr-3 text-foreground">{t.name}</td>
                        <td className="py-3 pr-3 font-medium font-display text-foreground">{t.duration}</td>
                        <td className="py-3 text-success font-medium text-xs">✓ {t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Gradient bar visualization */}
                <div className="mt-6 pt-5 border-t border-border/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Phase Duration</p>
                  <div className="space-y-2.5">
                    {phases.map((p) => {
                      const [min, sec] = p.duration.split(':').map(Number);
                      const totalSec = min * 60 + sec;
                      const maxSec = 7 * 60 + 15;
                      const pct = (totalSec / maxSec) * 100;
                      return (
                        <div key={p.id} className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground w-6 shrink-0 font-bold">{p.id}</span>
                          <div className="flex-1 h-5 bg-accent/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${p.status === 'Flagged' ? 'bar-gradient-warn' : 'bar-gradient'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-10 text-right font-display font-medium">{p.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SiqCard>
            </TabsContent>

            {/* === KEY FRAMES TAB === */}
            <TabsContent value="keyframes">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {keyFrames.map((frame) => (
                  <div key={frame.id} className="rounded-xl overflow-hidden border border-border bg-card shadow-card hover:shadow-lg hover:border-secondary/30 transition-all group">
                    <div className="aspect-video bg-accent/60 flex items-center justify-center relative">
                      <Eye size={24} className="text-muted-foreground/30 group-hover:text-secondary/50 transition-colors" />
                      {/* Gradient hover accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{frame.label}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded-md ${frame.confidence >= 80 ? 'text-success bg-success/10' : frame.confidence >= 60 ? 'text-warning bg-warning/10' : 'text-destructive bg-destructive/10'}`}>
                            {frame.confidence}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent><p>AI Confidence: {frame.confidence}%</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* === FEEDBACK TAB === */}
            <TabsContent value="feedback">
              <FeedbackSection />
            </TabsContent>
          </Tabs>

          {/* Gradient section divider */}
          <div className="gradient-line mt-10 mb-8" />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-5 pb-8">
            <button onClick={() => navigate('/new-submission')} className="py-3.5 border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all">
              Submit Another
            </button>
            <button className="py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-soft">
              Share Report
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// --- Feedback Section ---

const FeedbackSection = () => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="space-y-5">
      <SiqCard className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
        <p className="text-sm text-foreground leading-relaxed mb-4 pt-1">
          <strong>Overall:</strong> Intermediate — Ready for Supervised Practice (3.7/5.0). Strong performance across 5 of 7 phases with 2 requiring improvement.
        </p>
        <div className="gradient-line mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3 items-start p-3 rounded-lg bg-success/5 border border-success/15">
            <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground mb-0.5">Top Strength</p>
              <p className="text-xs text-muted-foreground">Clipping & Cutting (4.5/5) — expert-level clip application</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 rounded-lg bg-warning/5 border border-warning/15">
            <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground mb-0.5">Top Improvement</p>
              <p className="text-xs text-muted-foreground">GB Dissection (2.8/5) — plane identification needs work</p>
            </div>
          </div>
        </div>
      </SiqCard>

      <button
        onClick={() => setShowFull(!showFull)}
        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-secondary hover:bg-accent/50 rounded-xl border border-border/50 transition-colors"
      >
        {showFull ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {showFull ? 'Collapse full evaluation' : 'View full evaluation & phase breakdown'}
      </button>

      {showFull && (
        <SiqCard className="space-y-4 text-sm text-foreground leading-relaxed animate-accordion-down">
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
