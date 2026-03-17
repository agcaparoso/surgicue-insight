import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Activity, Layers, Target, Eye, MessageSquare, Image, User, TrendingUp, Shield, Zap, FileText, Loader2, Brain, ListChecks, StickyNote, CheckCircle2, AlertTriangle, XCircle, Award, Crosshair, CalendarDays, Stethoscope, Trophy, Timer, GitBranch, Scissors, Focus, Hand, Sparkles, Package, Droplets, ArrowDownToLine, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import { SiqCard, StatusBadge } from '@/components/SiqComponents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import ElenaGood3 from '@/assets/Elena_Good3.png';
import ElenaGood2 from '@/assets/Elena_Good2.png';
import ElenaGood1 from '@/assets/Elena_Good1.png';
import MarcusOkay3 from '@/assets/Marcus_Okay3.png';
import MarcusGood1 from '@/assets/Marcus_Good1.png';
import MarcusBad2 from '@/assets/Marcus_Bad2.png';

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
  pros: string[];
  cons: string[];
  additionalNotes?: string;
  idealDuration?: string;
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
    idealDuration: '02:30–04:00',
    pros: [
      'Systematic trocar placement with standard four-port technique',
      'Pneumoperitoneum achieved efficiently without complications',
      'Port triangulation appropriate for optimal instrument ergonomics',
    ],
    cons: [
      'Slight hesitation during initial trocar insertion sequence',
    ],
  },
  {
    id: 'P2', name: "Calot's Triangle Dissection", score: 3.3, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 3.5, maxScore: 5 },
      { label: 'Field Clarity', score: 3.2, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '03:05', endTime: '10:20', duration: '07:15', framesAnalyzed: 8,
    idealDuration: '05:00–08:00',
    pros: [
      'Dissection duration within acceptable range at 07:15',
      'Critical View of Safety was ultimately achieved',
    ],
    cons: [
      'Field clarity periodically suboptimal — obscured operative view',
      'CVS verification confidence only moderate (78%)',
      'Continued supervised practice recommended for this phase',
    ],
  },
  {
    id: 'P3', name: 'Clipping & Cutting', score: 4.5, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.5, maxScore: 5 },
      { label: 'Field Clarity', score: 4.6, maxScore: 5 },
      { label: 'Instrument Control', score: 4.4, maxScore: 5 },
    ],
    startTime: '10:20', endTime: '12:00', duration: '01:40', framesAnalyzed: 4,
    idealDuration: '01:00–02:30',
    pros: [
      'Clip application precise and methodical — expert-level execution',
      'Perpendicular clip orientation confirmed on cystic duct',
      'At least two clips on patient-side verified',
    ],
    cons: [
      'No significant concerns identified for this phase',
    ],
  },
  {
    id: 'P4', name: 'Gallbladder Dissection', score: 2.8, maxScore: 5, status: 'Flagged',
    rubrics: [
      { label: 'Tissue Handling', score: 2.8, maxScore: 5 },
      { label: 'Field Clarity', score: 2.5, maxScore: 5 },
      { label: 'Instrument Control', score: 3.0, maxScore: 5 },
    ],
    startTime: '12:00', endTime: '18:00', duration: '06:00', framesAnalyzed: 10,
    idealDuration: '04:00–06:00',
    pros: [
      'Grasper counter-traction adequate throughout the phase',
      'Hook cautery used appropriately for primary dissection',
    ],
    cons: [
      'Dissection plane strayed toward liver bed — risk of bile duct injury',
      'Excess thermal application noted during mid-phase',
      'Tissue handling requires significant improvement',
    ],
    additionalNotes: 'Hook used for most of dissection. Periodic coagulation for small bleeders.',
  },
  {
    id: 'P5', name: 'Gallbladder Packaging', score: 4.0, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.0, maxScore: 5 },
      { label: 'Field Clarity', score: 4.1, maxScore: 5 },
      { label: 'Instrument Control', score: 3.9, maxScore: 5 },
    ],
    startTime: '18:00', endTime: '19:30', duration: '01:30', framesAnalyzed: 3,
    idealDuration: '01:00–02:00',
    pros: [
      'Gallbladder placed into retrieval bag cleanly',
      'No spillage observed — controlled bag opening technique',
    ],
    cons: [
      'Minor delay in bag positioning before insertion',
    ],
  },
  {
    id: 'P6', name: 'Cleaning & Coagulation', score: 3.8, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 3.8, maxScore: 5 },
      { label: 'Field Clarity', score: 3.7, maxScore: 5 },
      { label: 'Instrument Control', score: 3.9, maxScore: 5 },
    ],
    startTime: '19:30', endTime: '21:30', duration: '02:00', framesAnalyzed: 4,
    idealDuration: '01:30–03:00',
    pros: [
      'Thorough irrigation with adequate hemostasis at gallbladder fossa',
      'Coagulation applied appropriately to target areas',
    ],
    cons: [
      'Slightly prolonged irrigation cycle without clear clinical necessity',
    ],
  },
  {
    id: 'P7', name: 'Gallbladder Retraction', score: 4.1, maxScore: 5, status: 'Passed',
    rubrics: [
      { label: 'Tissue Handling', score: 4.2, maxScore: 5 },
      { label: 'Field Clarity', score: 4.0, maxScore: 5 },
      { label: 'Instrument Control', score: 4.1, maxScore: 5 },
    ],
    startTime: '21:30', endTime: '23:00', duration: '01:30', framesAnalyzed: 2,
    idealDuration: '01:00–02:00',
    pros: [
      'Smooth and controlled bag extraction through umbilical port',
      'Port site closure adequate — clean completion',
    ],
    cons: [
      'No significant concerns identified for this phase',
    ],
  },
];

const keyFrames = [
  { id: 1, label: 'Port Placement', confidence: 94, caption: 'Systematic trocar positioning with standard four-port technique', image: ElenaGood1 },
  { id: 2, label: 'CVS Achieved', confidence: 78, caption: 'Critical View of Safety achieved with moderate confidence', image: ElenaGood2 },
  { id: 3, label: 'Clip Application', confidence: 96, caption: 'Proper clip placement observed — perpendicular orientation confirmed', image: ElenaGood3 },
  { id: 4, label: 'Dissection Plane', confidence: 62, caption: 'Dissection plane slightly off — proximity to liver bed detected', image: MarcusBad2 },
  { id: 5, label: 'Bag Insertion', confidence: 91, caption: 'Clean bag insertion with controlled technique, no spillage', image: MarcusGood1 },
  { id: 6, label: 'Final Hemostasis', confidence: 88, caption: 'Adequate hemostasis confirmed at gallbladder fossa', image: MarcusOkay3 },
];

// --- Helpers ---

const scoreColor = (score: number) =>
  score >= 4 ? 'text-success' : score >= 3 ? 'text-warning' : 'text-destructive';

const StatusIcon = ({ status }: { status: 'Passed' | 'Flagged' | 'Failed' }) => {
  if (status === 'Passed') return <CheckCircle2 size={16} className="text-success shrink-0" />;
  if (status === 'Flagged') return <AlertTriangle size={16} className="text-warning shrink-0" />;
  return <XCircle size={16} className="text-destructive shrink-0" />;
};

const durationToSec = (d: string) => {
  const [min, sec] = d.split(':').map(Number);
  return min * 60 + sec;
};

const parseIdealRange = (range: string) => {
  const parts = range.split('–');
  return { min: durationToSec(parts[0]), max: durationToSec(parts[1]) };
};

const gradientBg = {
  background: 'linear-gradient(160deg, hsl(210 45% 90%) 0%, hsl(200 35% 93%) 30%, hsl(170 20% 94%) 50%, hsl(50 40% 92%) 75%, hsl(42 55% 88%) 100%)',
};

const titleStyle = {
  background: 'linear-gradient(135deg, hsl(211 60% 28%) 0%, hsl(197 65% 45%) 40%, hsl(45 80% 55%) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const buttonGradient = 'linear-gradient(135deg, hsl(207 50% 52%), hsl(197 55% 48%))';
const buttonGradientHover = 'linear-gradient(135deg, hsl(207 50% 58%), hsl(197 55% 54%))';

const phaseIcons: Record<string, React.ElementType> = {
  P1: Target, P2: Focus, P3: Scissors, P4: Hand, P5: Package, P6: Droplets, P7: ArrowDownToLine,
};

// Score bar component
const ScoreBar = ({ score, maxScore = 5, label, icon: Icon }: { score: number; maxScore?: number; label: string; icon: React.ElementType }) => {
  const pct = (score / maxScore) * 100;
  const color = score >= 4 ? 'bg-success' : score >= 3 ? 'bg-warning' : 'bg-destructive';
  const textColor = score >= 4 ? 'text-success' : score >= 3 ? 'text-warning' : 'text-destructive';
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
          <span className={`text-xs font-bold font-display ${textColor}`}>{score}/{maxScore}</span>
        </div>
        <div className="h-2 bg-accent/40 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

// --- Report Modal ---

const ReportModal = ({ onClose }: { onClose: () => void }) => {
  const [state, setState] = useState<'loading' | 'done'>('loading');

  useState(() => {
    const t = setTimeout(() => setState('done'), 3000);
    return () => clearTimeout(t);
  });

  if (state === 'loading') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: 'hsla(210, 45%, 90%, 0.97)' }}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-warning flex items-center justify-center shadow-lg">
            <Brain size={28} className="text-primary-foreground animate-pulse" />
          </div>
          <div className="space-y-3">
            <Loader2 size={24} className="text-secondary animate-spin mx-auto" />
            <p className="text-sm font-bold text-foreground font-display">Connecting to IBM Watsonx.ai…</p>
            <p className="text-xs text-muted-foreground">Analyzing procedure and generating report…</p>
          </div>
          <div className="w-48 h-1 rounded-full bg-accent overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-warning rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" style={gradientBg}>
      {/* Modal top bar */}
      <header className="sticky top-0 z-50 h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-black font-display tracking-tight" style={titleStyle}>AI-Assisted Surgical Report</h1>
        <div className="w-32" />
      </header>
      <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Procedure Summary */}
        <div className="rounded-xl border border-border/40 bg-card shadow-card overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Brain size={18} className="text-secondary" />
              <h2 className="font-display font-bold text-foreground">Procedure Summary</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Dr. Sarah Chen performed a standard laparoscopic cholecystectomy on March 15, 2026. Completed in 23 minutes across 7 phases. Overall score: <strong className="text-secondary">3.7/5.0 (Intermediate, Level 3)</strong>. 5 of 7 phases above competency threshold, with 2 phases flagged for targeted improvement.
            </p>
          </div>
        </div>

        {/* Key Actions */}
        <div className="rounded-xl border border-border/40 bg-card shadow-card overflow-hidden">
          <div className="gradient-border-left">
            <div className="p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Key Actions</h3>
              <ul className="space-y-2">
                {['Systematic trocar placement with standard positioning', 'CVS achieved with moderate AI confidence (78%)', 'Precise clip application — perpendicular, 2+ clips', 'Controlled extraction through umbilical port', 'Thorough irrigation and hemostasis at fossa'].map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <span className="text-secondary font-bold shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Highlights & Improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl border border-success/20 bg-card shadow-card overflow-hidden">
            <div className="h-[2px] bg-success" />
            <div className="p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-success mb-3">Performance Highlights</h3>
              <ul className="space-y-2">
                {['Clipping & Cutting: 4.5/5 — expert level', 'Preparation: systematic and safe (4.2/5)', '5 of 7 phases above competency threshold'].map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />{h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border border-warning/20 bg-card shadow-card overflow-hidden">
            <div className="h-[2px] bg-warning" />
            <div className="p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-warning mb-3">Areas for Improvement</h3>
              <ul className="space-y-2">
                {['GB Dissection (2.8/5) — plane strayed toward liver', 'Excess thermal application mid-phase', "Calot's field clarity suboptimal (3.2/5)"].map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl border border-secondary/20 bg-card shadow-card overflow-hidden">
          <div className="gradient-border-left">
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <Zap size={16} className="text-secondary" />
                <h3 className="text-sm font-bold text-foreground">Recommendation</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Supervised practice on 5–10 additional standard cholecystectomy cases. Focus on dissection plane identification and controlled thermal energy usage. Simulation lab drills recommended for gallbladder dissection phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const SubmissionDetail = () => {
  const navigate = useNavigate();
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const overallScore = 3.7;
  const maxTimelineSec = Math.max(...phases.map(p => {
    const ideal = p.idealDuration ? parseIdealRange(p.idealDuration).max : 0;
    return Math.max(durationToSec(p.duration), ideal);
  }));

  return (
    <TooltipProvider>
      <div className="min-h-screen relative" style={gradientBg}>
        {/* Ambient glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: 'hsl(210 55% 72%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] pointer-events-none" style={{ background: 'hsl(42 65% 72%)' }} />

        {/* Top Bar */}
        <header className="sticky top-0 z-50 h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors">
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-2xl font-black font-display tracking-tight leading-none" style={titleStyle}>SurgicalIQ</h1>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border hover:border-secondary/40 transition-colors">
            <User size={14} className="text-primary" />
          </button>
        </header>
        <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />

        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">

          {/* STUDENT INFO */}
          <div className="section-header mb-4">
            <span>🎓</span> Student Info
          </div>
          <div className="rounded-2xl border border-border/40 bg-card backdrop-blur-md shadow-card overflow-hidden mb-8">
            <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { icon: User, label: 'Student Name', value: 'John Doe' },
                  { icon: Stethoscope, label: 'Instructor', value: 'Dr. Sarah Chen' },
                  { icon: CalendarDays, label: 'Date of Procedure', value: '03/15/2026' },
                  { icon: Target, label: 'Procedure', value: 'Laparoscopic Cholecystectomy' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="section-header mb-4">
            <span>📊</span> Summary
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { icon: Trophy, label: 'Overall Score', value: <><span className="text-3xl font-black font-display" style={titleStyle}>{overallScore}</span><span className="text-sm font-medium text-muted-foreground ml-1">/ 5</span></> },
              { icon: Award, label: 'Competency', value: <><span className="text-lg font-bold font-display" style={titleStyle}>Intermediate</span><div className="mt-1"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/10 text-secondary border border-secondary/20"><Shield size={10} /> Level 3</span></div></> },
              { icon: GitBranch, label: 'Phases Detected', value: <span className="text-3xl font-black font-display" style={titleStyle}>{phases.length}</span> },
              { icon: Timer, label: 'Total Duration', value: <span className="text-3xl font-black font-display" style={titleStyle}>23:00</span> },
            ].map((card, i) => (
              <div key={i} className="group relative rounded-xl border border-border/40 bg-card shadow-card overflow-hidden transition-all hover:shadow-lg hover:border-secondary/30 hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(211 60% 28% / 0.1), hsl(45 80% 55% / 0.15))' }}>
                      <card.icon size={17} className="text-secondary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</span>
                  </div>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Full-width Generate Report bar */}
          <button
            onClick={() => setShowReport(true)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 mb-8 rounded-xl text-sm font-bold text-white active:scale-[0.99] transition-all shadow-card border border-border/20 hover:shadow-lg"
            style={{ background: buttonGradient }}
            onMouseEnter={(e) => (e.currentTarget.style.background = buttonGradientHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = buttonGradient)}
          >
            <Brain size={18} />
            AI-Assisted Surgical Report — Generate Report
          </button>

          {/* Feedback Section (outside tabs) */}
          <div className="space-y-5 mb-8">
            <div className="rounded-xl border border-border/40 bg-card shadow-card overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Activity size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">Overall Assessment</h3>
                    <p className="text-[10px] text-muted-foreground">AI-evaluated performance summary</p>
                  </div>
                  <div className="ml-auto flex items-baseline gap-1">
                    <span className="text-2xl font-black font-display text-foreground">3.7</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                    <Shield size={10} /> Intermediate — Level 3
                  </span>
                  <span className="text-[10px] text-muted-foreground">Ready for Supervised Practice</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strong performance across 5 of 7 phases. 2 phases flagged for targeted improvement.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-success/20 bg-card shadow-soft overflow-hidden">
                <div className="h-[2px] bg-success" />
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-success" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Top Strength</h4>
                  </div>
                  <p className="text-xs font-bold text-success mb-1">Clipping & Cutting — 4.5/5</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Expert-level clip application with precise perpendicular orientation</p>
                </div>
              </div>
              <div className="rounded-xl border border-warning/20 bg-card shadow-soft overflow-hidden">
                <div className="h-[2px] bg-warning" />
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertTriangle size={16} className="text-warning" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Top Improvement Area</h4>
                  </div>
                  <p className="text-xs font-bold text-warning mb-1">GB Dissection — 2.8/5</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Plane identification needs work, excess thermal application noted</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-secondary/20 bg-card shadow-soft overflow-hidden">
              <div className="gradient-border-left">
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Zap size={16} className="text-secondary" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Recommendation</h4>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    Supervised practice on 5–10 additional standard cholecystectomy cases. Focus on dissection plane identification and controlled thermal energy usage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Next Step */}
          <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl bg-secondary/5 border border-secondary/20 backdrop-blur-sm">
            <Zap size={16} className="text-secondary shrink-0" />
            <span className="text-sm text-foreground"><strong className="text-secondary">Recommended:</strong> Supervised practice on 5–10 additional standard cases. Focus drills on gallbladder dissection phase.</span>
          </div>

          <div className="gradient-line mb-8" />

          {/* Tab Navigation — 3 tabs only */}
          <Tabs defaultValue="scorecard" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8 bg-card rounded-xl p-1.5 h-auto border border-border/40 shadow-soft">
              <TabsTrigger value="scorecard" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft gap-1.5 transition-all">
                <Layers size={14} /> Scorecard
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft gap-1.5 transition-all">
                <Clock size={14} /> Timeline
              </TabsTrigger>
              <TabsTrigger value="keyframes" className="text-xs font-bold py-3 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-soft gap-1.5 transition-all">
                <Image size={14} /> Key Frames
              </TabsTrigger>
            </TabsList>

            {/* === SCORECARD TAB === */}
            <TabsContent value="scorecard">
              <div className="space-y-8">
                {phases.map((phase) => {
                  const statusBorderColor = phase.status === 'Passed' ? 'border-l-success' : phase.status === 'Flagged' ? 'border-l-warning' : 'border-l-destructive';
                  const statusBg = phase.status === 'Passed' ? 'bg-success/5' : phase.status === 'Flagged' ? 'bg-warning/5' : 'bg-destructive/5';
                  const PhaseIcon = phaseIcons[phase.id] || Layers;
                  const actualSec = durationToSec(phase.duration);
                  const ideal = phase.idealDuration ? parseIdealRange(phase.idealDuration) : null;
                  const metIdeal = ideal ? actualSec >= ideal.min && actualSec <= ideal.max : true;

                  return (
                    <div key={phase.id} className={`rounded-xl border border-border/40 bg-card shadow-card overflow-hidden border-l-[4px] ${statusBorderColor}`}>
                      <div className={`px-6 py-4 ${statusBg}`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(211 60% 28% / 0.1), hsl(45 80% 55% / 0.15))' }}>
                            <PhaseIcon size={18} className="text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-secondary text-sm">{phase.id}:</span>
                              <span className="font-display font-bold text-base text-foreground">{phase.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black font-display ${scoreColor(phase.score)}`}>{phase.score}<span className="text-sm font-medium text-muted-foreground">/{phase.maxScore}</span></span>
                            <StatusBadge status={phase.status} />
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Performance Metrics</p>
                          <div className="space-y-3">
                            <ScoreBar score={phase.rubrics[0].score} maxScore={phase.rubrics[0].maxScore} label={phase.rubrics[0].label} icon={Hand} />
                            <ScoreBar score={phase.rubrics[1].score} maxScore={phase.rubrics[1].maxScore} label={phase.rubrics[1].label} icon={Eye} />
                            <ScoreBar score={phase.rubrics[2].score} maxScore={phase.rubrics[2].maxScore} label={phase.rubrics[2].label} icon={Crosshair} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-accent/30 text-xs flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Timer size={13} className="text-secondary" />
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-bold text-foreground font-display">{phase.duration}</span>
                          </div>
                          {phase.idealDuration && (
                            <>
                              <div className="w-px h-4 bg-border" />
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Ideal:</span>
                                <span className="font-medium text-foreground">{phase.idealDuration}</span>
                              </div>
                              <div className="w-px h-4 bg-border" />
                              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${metIdeal ? 'bg-success/10 border-success/20 text-success' : 'bg-warning/10 border-warning/20 text-warning'}`}>
                                {metIdeal ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                <span className="font-bold text-[10px] uppercase tracking-wider">{metIdeal ? 'Met Ideal' : 'Over/Under Ideal'}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-lg border border-success/25 bg-success/5 p-4">
                            <p className="text-[10px] font-bold text-success uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <ThumbsUp size={12} /> Pros
                            </p>
                            <ul className="space-y-2">
                              {phase.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />{pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-4">
                            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <ThumbsDown size={12} /> Cons
                            </p>
                            <ul className="space-y-2">
                              {phase.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />{con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {phase.additionalNotes && (
                          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                            <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-2">Additional Notes</p>
                            <p className="text-xs text-foreground leading-relaxed">{phase.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* === TIMELINE TAB === */}
            <TabsContent value="timeline">
              <div className="rounded-xl border border-border/40 bg-card shadow-card overflow-hidden p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <TrendingUp size={14} className="text-secondary shrink-0" />
                    Actual phase duration vs. expected optimal range
                  </p>
                  <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2"><div className="w-4 h-3 rounded-sm bar-gradient" /> Actual</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-3 rounded-sm bg-success/15 border border-success/30" /> Ideal Range</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {phases.map((p) => {
                    const actualSec = durationToSec(p.duration);
                    const ideal = p.idealDuration ? parseIdealRange(p.idealDuration) : { min: 0, max: 0 };
                    const barMax = maxTimelineSec * 1.15;
                    const actualPct = (actualSec / barMax) * 100;
                    const idealMinPct = (ideal.min / barMax) * 100;
                    const idealWidthPct = ((ideal.max - ideal.min) / barMax) * 100;
                    const isHovered = hoveredPhase === p.id;

                    return (
                      <div
                        key={p.id}
                        className={`relative rounded-lg px-3 py-2.5 transition-all cursor-pointer ${isHovered ? 'bg-secondary/8 ring-1 ring-secondary/20' : 'hover:bg-accent/20'}`}
                        onMouseEnter={() => setHoveredPhase(p.id)}
                        onMouseLeave={() => setHoveredPhase(null)}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <StatusIcon status={p.status} />
                          <span className="text-[11px] font-bold text-secondary font-display w-7 shrink-0">{p.id}</span>
                          <span className="text-[11px] font-semibold text-foreground flex-1">{p.name}</span>
                          <span className="text-[11px] font-display font-bold text-foreground shrink-0">{p.duration}</span>
                        </div>
                        <div className="relative h-8 bg-accent/30 rounded-lg overflow-hidden ml-[52px]">
                          <div className="absolute top-0 bottom-0 bg-success/12 border-l-2 border-r-2 border-success/25 rounded-sm" style={{ left: `${idealMinPct}%`, width: `${idealWidthPct}%` }} />
                          <div className={`absolute top-1 bottom-1 rounded-md transition-all shadow-sm ${isHovered ? 'opacity-100' : 'opacity-85'} ${p.status === 'Flagged' ? 'bar-gradient-warn' : 'bar-gradient'}`} style={{ width: `${actualPct}%`, left: 0 }} />
                          {actualPct > 15 && <span className="absolute top-1/2 -translate-y-1/2 left-2 text-[9px] font-bold text-white/90 z-10">{p.duration}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* === KEY FRAMES TAB === */}
            <TabsContent value="keyframes">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {keyFrames.map((frame) => (
                  <div key={frame.id} className="rounded-xl overflow-hidden border border-border/40 bg-card shadow-card hover:shadow-lg hover:border-secondary/30 transition-all group">
                    <div className="aspect-video bg-accent/60 relative overflow-hidden">
                      <img src={frame.image} alt={frame.label} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{frame.label}</span>
                        <span className={`text-xs font-bold font-display px-2 py-0.5 rounded-md ${frame.confidence >= 80 ? 'text-success bg-success/10' : frame.confidence >= 60 ? 'text-warning bg-warning/10' : 'text-destructive bg-destructive/10'}`}>
                          {frame.confidence}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{frame.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

        </div>

        {/* Report Modal */}
        {showReport && <ReportModal onClose={() => setShowReport(false)} />}
      </div>
    </TooltipProvider>
  );
};

export default SubmissionDetail;
