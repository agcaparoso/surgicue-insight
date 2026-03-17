import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Clock, Activity, Layers, Target, Eye, MessageSquare, Image, Search, User, TrendingUp, Shield, Zap, FileText, Loader2, Brain, ListChecks, StickyNote, CheckCircle2, AlertTriangle, XCircle, Award, ArrowUpRight, Crosshair, CalendarDays, Stethoscope } from 'lucide-react';
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
    idealDuration: '05:00–08:00',
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
    idealDuration: '01:00–02:30',
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
    idealDuration: '04:00–06:00',
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
    idealDuration: '01:00–02:00',
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
    idealDuration: '01:30–03:00',
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
    idealDuration: '01:00–02:00',
    observation: 'Bag extraction through umbilical port. Controlled retraction without tearing.',
    rubricAssessment: 'Extraction was smooth and controlled. Port site closure adequate. Clean completion.',
  },
];

const keyFrames = [
  { id: 1, label: 'Port Placement', confidence: 94, caption: 'Systematic trocar positioning with standard four-port technique' },
  { id: 2, label: 'CVS Achieved', confidence: 78, caption: 'Critical View of Safety achieved with moderate confidence' },
  { id: 3, label: 'Clip Application', confidence: 96, caption: 'Proper clip placement observed — perpendicular orientation confirmed' },
  { id: 4, label: 'Dissection Plane', confidence: 62, caption: 'Dissection plane slightly off — proximity to liver bed detected' },
  { id: 5, label: 'Bag Insertion', confidence: 91, caption: 'Clean bag insertion with controlled technique, no spillage' },
  { id: 6, label: 'Final Hemostasis', confidence: 88, caption: 'Adequate hemostasis confirmed at gallbladder fossa' },
];

// --- Helpers ---

const scoreColor = (score: number) =>
  score >= 4 ? 'text-success' : score >= 3 ? 'text-warning' : 'text-destructive';

const scoreBg = (score: number) =>
  score >= 4 ? 'bg-success/10' : score >= 3 ? 'bg-warning/10' : 'bg-destructive/10';

const StatusIcon = ({ status }: { status: 'Passed' | 'Flagged' | 'Failed' }) => {
  if (status === 'Passed') return <CheckCircle2 size={16} className="text-success shrink-0" />;
  if (status === 'Flagged') return <AlertTriangle size={16} className="text-warning shrink-0" />;
  return <XCircle size={16} className="text-destructive shrink-0" />;
};

const RubricDots = ({ score, maxScore = 5 }: { score: number; maxScore?: number }) => {
  const filled = Math.round(score);
  const color = score >= 4 ? 'bg-success' : score >= 3 ? 'bg-warning' : 'bg-destructive';
  const empty = 'bg-border';
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxScore }).map((_, i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < filled ? color : empty}`} />
      ))}
    </div>
  );
};

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

// Parse duration string to seconds
const durationToSec = (d: string) => {
  const [min, sec] = d.split(':').map(Number);
  return min * 60 + sec;
};

// Parse ideal range to seconds
const parseIdealRange = (range: string) => {
  const parts = range.split('–');
  return { min: durationToSec(parts[0]), max: durationToSec(parts[1]) };
};

// Shared styles matching landing page
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

// --- Sidebar with AI Insights + Report ---

const AIInsightsSidebar = () => {
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [showModal, setShowModal] = useState(false);

  const generateReport = () => {
    setShowModal(true);
    setReportState('loading');
    setTimeout(() => {
      setShowModal(false);
      setReportState('done');
    }, 3000);
  };

  return (
    <aside className="w-80 shrink-0 space-y-5">
      {/* Sidebar Header */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-1">
            <Brain size={18} className="text-secondary" />
            <h2 className="font-display font-bold text-sm text-foreground">IBM AI Insights</h2>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-wide">Powered by IBM Watson</p>
        </div>
      </div>

      {/* Case Overview */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="gradient-border-left">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Case Overview</h3>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Standard laparoscopic cholecystectomy performed by Dr. Sarah Chen. AI analysis detected 7 procedural phases over 23 minutes. Overall competency rated at <strong className="text-secondary">Intermediate (Level 3)</strong> with 2 phases flagged for review.
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Analysis */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="gradient-border-left">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Milestone Analysis</h3>
            </div>
            <ul className="space-y-2">
              {[
                { text: 'Critical View of Safety achieved — moderate confidence (78%)', color: 'bg-warning' },
                { text: 'Clip application precise — expert-level execution (96%)', color: 'bg-success' },
                { text: 'Dissection plane deviated near liver bed in P4', color: 'bg-destructive' },
                { text: 'Hemostasis confirmed at gallbladder fossa', color: 'bg-success' },
                { text: 'No instrument collisions or unnecessary movements detected', color: 'bg-success' },
                { text: 'Procedure completed within expected time range', color: 'bg-success' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-foreground leading-relaxed">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} mt-1.5 shrink-0`} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Captured Notes */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="gradient-border-left">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Captured Notes</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Trocar triangulation consistent with 4-port technique',
                'Calot\'s dissection took 07:15 — within acceptable range',
                'Hook cautery used for primary dissection',
                'Periodic coagulation applied for minor bleeders',
                'Grasper counter-traction adequate throughout',
                'Retrieval bag insertion clean, no spillage',
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="text-secondary font-bold shrink-0">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="gradient-line" />

      {/* AI-Assisted Surgical Report */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-secondary" />
            <h3 className="font-display font-bold text-sm text-foreground">AI-Assisted Surgical Report</h3>
          </div>

          {reportState === 'idle' && (
            <>
              <p className="text-xs text-muted-foreground mb-4">Generate a structured AI-assisted surgical report powered by IBM Watsonx.ai.</p>
              <button
                onClick={generateReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white active:scale-[0.98] transition-all shadow-soft group"
                style={{ background: buttonGradient }}
                onMouseEnter={(e) => (e.currentTarget.style.background = buttonGradientHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = buttonGradient)}
              >
                <Brain size={14} className="group-hover:scale-110 transition-transform" />
                Generate Report
              </button>
            </>
          )}

          {reportState === 'done' && (
            <div className="space-y-4 animate-accordion-down">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1.5">Procedure Summary</h4>
                <p className="text-xs text-foreground leading-relaxed">
                  Dr. Sarah Chen performed a standard laparoscopic cholecystectomy on March 15, 2026. Completed in 23 minutes across 7 phases. Overall score: 3.7/5.0 (Intermediate, Level 3).
                </p>
              </div>
              <div className="gradient-line" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1.5">Key Actions</h4>
                <ul className="space-y-1.5">
                  {['Systematic trocar placement with standard positioning', 'CVS achieved with moderate AI confidence (78%)', 'Precise clip application — perpendicular, 2+ clips', 'Controlled extraction through umbilical port', 'Thorough irrigation and hemostasis at fossa'].map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                      <span className="text-secondary font-bold shrink-0">•</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="gradient-line" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-success mb-1.5">Performance Highlights</h4>
                <ul className="space-y-1.5">
                  {['Clipping & Cutting: 4.5/5 — expert level', 'Preparation: systematic and safe (4.2/5)', '5 of 7 phases above competency threshold'].map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />{h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="gradient-line" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-warning mb-1.5">Areas for Improvement</h4>
                <ul className="space-y-1.5">
                  {['GB Dissection (2.8/5) — plane strayed toward liver', 'Excess thermal application mid-phase', 'Calot\'s field clarity suboptimal (3.2/5)'].map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />{a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="gradient-line" />
              <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1.5">Recommendation</h4>
                <p className="text-xs text-foreground leading-relaxed">
                  Supervised practice on 5–10 additional standard cases. Focus on dissection plane identification and thermal control.
                </p>
              </div>
              <button
                onClick={generateReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-bold text-secondary hover:bg-accent/50 transition-colors"
              >
                <Brain size={12} /> Regenerate Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen loading modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] backdrop-blur-sm flex flex-col items-center justify-center" style={{ background: 'hsla(210, 45%, 90%, 0.95)' }}>
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
      )}
    </aside>
  );
};

const SubmissionDetail = () => {
  const navigate = useNavigate();
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const overallScore = 3.7;
  const maxTimelineSec = Math.max(...phases.map(p => {
    const ideal = p.idealDuration ? parseIdealRange(p.idealDuration).max : 0;
    return Math.max(durationToSec(p.duration), ideal);
  }));

  return (
    <TooltipProvider>
      <div className="min-h-screen relative" style={gradientBg}>
        {/* Ambient glows matching landing page */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: 'hsl(210 55% 72%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] pointer-events-none" style={{ background: 'hsl(42 65% 72%)' }} />

        {/* Top Bar */}
        <header className="sticky top-0 z-50 h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6">
          <h1
            className="text-2xl font-black font-display tracking-tight pb-1"
            style={titleStyle}
          >
            SurgicalIQ
          </h1>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border hover:border-secondary/40 transition-colors">
            <User size={14} className="text-primary" />
          </button>
        </header>

        {/* Gradient accent line below header */}
        <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />

        <div className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
          {/* Student Info Header Card */}
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-card overflow-hidden mb-8">
            <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <User size={16} className="text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Student Name</p>
                    <p className="text-sm font-bold text-foreground">John Doe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Stethoscope size={16} className="text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Instructor</p>
                    <p className="text-sm font-bold text-foreground">Dr. Sarah Chen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Date of Procedure</p>
                    <p className="text-sm font-bold text-foreground">03/15/2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Target size={16} className="text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Procedure</p>
                    <p className="text-sm font-bold text-foreground truncate">Laparoscopic Cholecystectomy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content + Sidebar */}
          <div className="flex gap-6">
            {/* Left: Main Dashboard */}
            <div className="flex-1 min-w-0">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <SiqCard className="py-6 px-5 relative overflow-hidden bg-card/70 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Score</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-display text-foreground">{overallScore}</span>
                    <span className="text-sm font-normal text-muted-foreground">/ 5</span>
                    <Sparkline />
                  </div>
                </SiqCard>
                <SiqCard className="py-6 px-5 relative overflow-hidden bg-card/70 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Competency</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-display text-foreground">Intermediate</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                      <Shield size={10} /> Level 3
                    </span>
                  </div>
                </SiqCard>
                <SiqCard className="py-6 px-5 relative overflow-hidden bg-card/70 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Phases Detected</div>
                  <div className="text-3xl font-black font-display text-foreground">{phases.length}</div>
                </SiqCard>
                <SiqCard className="py-6 px-5 relative overflow-hidden bg-card/70 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Duration</div>
                  <div className="text-3xl font-black font-display text-foreground">23:00</div>
                </SiqCard>
              </div>

              {/* Recommended Next Step Badge */}
              <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl bg-secondary/5 border border-secondary/20 backdrop-blur-sm">
                <Zap size={16} className="text-secondary shrink-0" />
                <span className="text-sm text-foreground"><strong className="text-secondary">Recommended:</strong> Supervised practice on 5–10 additional standard cases. Focus drills on gallbladder dissection phase.</span>
              </div>

              {/* Gradient section divider */}
              <div className="gradient-line mb-8" />

              {/* Tabs */}
              <Tabs defaultValue="scorecard" className="w-full">
                <TabsList className="w-full grid grid-cols-4 mb-8 bg-card/70 backdrop-blur-sm rounded-xl p-1.5 h-auto border border-border/50 shadow-soft">
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
                  <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-card overflow-hidden">
                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.7fr_0.6fr_2.5fr] gap-3 px-5 py-3 bg-accent/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Phase</span>
                      <span className="text-center">Score</span>
                      <span className="text-center">Tissue</span>
                      <span className="text-center">Clarity</span>
                      <span className="text-center">Control</span>
                      <span className="text-center">Duration</span>
                      <span>AI Summary</span>
                    </div>

                    {phases.map((phase) => {
                      const isExpanded = expandedPhases.includes(phase.id);
                      const statusBorderColor = phase.status === 'Passed' ? 'border-l-success' : phase.status === 'Flagged' ? 'border-l-warning' : 'border-l-destructive';

                      return (
                        <div key={phase.id}>
                          {/* Phase row */}
                          <button
                            onClick={() => togglePhase(phase.id)}
                            className={`w-full text-left transition-colors hover:bg-accent/30 border-l-[3px] ${statusBorderColor} ${isExpanded ? 'bg-accent/20' : ''}`}
                          >
                            {/* Desktop row */}
                            <div className="hidden md:grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.7fr_0.6fr_2.5fr] gap-3 px-5 py-3.5 items-center border-b border-border/40">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <StatusIcon status={phase.status} />
                                <span className="font-display font-bold text-secondary text-xs shrink-0">{phase.id}</span>
                                <span className="font-semibold text-sm text-foreground truncate">{phase.name}</span>
                                <StatusBadge status={phase.status} />
                              </div>

                              <div className="flex flex-col items-center gap-1">
                                <span className={`font-display font-black text-base ${scoreColor(phase.score)}`}>{phase.score}</span>
                              </div>

                              {phase.rubrics.map((r, i) => (
                                <Tooltip key={i}>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                      <span className={`text-xs font-bold font-display ${scoreColor(r.score)}`}>{r.score}</span>
                                      <RubricDots score={r.score} maxScore={r.maxScore} />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent><p>{r.label}: {r.score}/{r.maxScore}</p></TooltipContent>
                                </Tooltip>
                              ))}

                              <span className="text-xs font-medium text-muted-foreground font-display text-center">{phase.duration}</span>

                              <span className="text-[11px] text-muted-foreground truncate leading-relaxed">{phase.observation.split('.')[0]}.</span>
                            </div>

                            {/* Mobile row */}
                            <div className="md:hidden px-4 py-4 border-b border-border/40">
                              <div className="flex items-center gap-2.5 mb-3">
                                <StatusIcon status={phase.status} />
                                <span className="font-display font-bold text-secondary text-xs shrink-0">{phase.id}</span>
                                <span className="font-semibold text-sm text-foreground flex-1 truncate">{phase.name}</span>
                                <span className={`font-display font-black text-lg ${scoreColor(phase.score)}`}>{phase.score}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                {phase.rubrics.map((r, i) => (
                                  <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-accent/30">
                                    <span className="text-[9px] text-muted-foreground font-medium">{r.label.split(' ')[0]}</span>
                                    <span className={`text-sm font-bold font-display ${scoreColor(r.score)}`}>{r.score}</span>
                                    <RubricDots score={r.score} maxScore={r.maxScore} />
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Clock size={11} className="shrink-0" />
                                <span className="shrink-0">{phase.duration}</span>
                                <span className="mx-1">·</span>
                                <span className="truncate flex-1">{phase.observation.split('.')[0]}.</span>
                              </div>
                            </div>
                          </button>

                          {/* Expanded detail */}
                          {isExpanded && (
                            <div className={`px-5 py-5 bg-accent/10 border-b border-border/40 border-l-[3px] ${statusBorderColor} space-y-4 animate-accordion-down`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="gradient-border-left pl-4">
                                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Brain size={12} /> AI Observation
                                  </p>
                                  <p className="text-sm text-foreground leading-relaxed">{phase.observation}</p>
                                </div>
                                <div className="border-l-2 border-primary/30 pl-4">
                                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Crosshair size={12} /> Rubric Assessment
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{phase.rubricAssessment}</p>
                                </div>
                              </div>
                              {phase.additionalNotes && (
                                <div className="border-l-2 border-warning/40 pl-4">
                                  <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1.5">Additional Notes</p>
                                  <p className="text-sm text-foreground leading-relaxed">{phase.additionalNotes}</p>
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-secondary" /> <strong className="text-foreground">Start:</strong> {phase.startTime}</span>
                                <span className="flex items-center gap-1.5"><strong className="text-foreground">End:</strong> {phase.endTime}</span>
                                <span className="flex items-center gap-1.5"><strong className="text-foreground">Duration:</strong> {phase.duration}</span>
                                <span className="flex items-center gap-1.5"><Eye size={12} className="text-secondary" /> <strong className="text-foreground">Frames:</strong> {phase.framesAnalyzed}</span>
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
                  <SiqCard className="bg-card/70 backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
                      <TrendingUp size={14} className="text-secondary shrink-0" />
                      This chart compares actual phase duration against the expected optimal range.
                    </p>

                    {/* Legend */}
                    <div className="flex items-center gap-5 mb-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded-sm bar-gradient" />
                        Actual Duration
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded-sm bg-accent border border-border/50" />
                        Ideal Range
                      </div>
                    </div>

                    <div className="space-y-4">
                      {phases.map((p) => {
                        const actualSec = durationToSec(p.duration);
                        const ideal = p.idealDuration ? parseIdealRange(p.idealDuration) : { min: 0, max: 0 };
                        const barMax = maxTimelineSec * 1.15;
                        const actualPct = (actualSec / barMax) * 100;
                        const idealMinPct = (ideal.min / barMax) * 100;
                        const idealWidthPct = ((ideal.max - ideal.min) / barMax) * 100;

                        return (
                          <div key={p.id} className="group">
                            <div className="flex items-center gap-3 mb-1.5">
                              <StatusIcon status={p.status} />
                              <span className="text-xs font-bold text-secondary w-6 shrink-0">{p.id}</span>
                              <span className="text-xs font-medium text-foreground flex-1 truncate">{p.name}</span>
                              <span className="text-xs font-display font-bold text-foreground shrink-0">{p.duration}</span>
                            </div>
                            <div className="relative h-7 bg-accent/40 rounded-lg overflow-hidden ml-[60px]">
                              {/* Ideal range background */}
                              <div
                                className="absolute top-0 bottom-0 bg-success/10 border-l border-r border-success/20"
                                style={{ left: `${idealMinPct}%`, width: `${idealWidthPct}%` }}
                              />
                              {/* Actual bar */}
                              <div
                                className={`absolute top-1 bottom-1 rounded-md transition-all ${p.status === 'Flagged' ? 'bar-gradient-warn' : 'bar-gradient'}`}
                                style={{ width: `${actualPct}%`, left: 0 }}
                              />
                            </div>
                            {/* Hover detail */}
                            <div className="ml-[60px] flex items-center gap-3 mt-1 text-[10px] text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                              <span>{p.startTime} → {p.endTime}</span>
                              <span>·</span>
                              <span>Ideal: {p.idealDuration}</span>
                              <span>·</span>
                              <span>{p.framesAnalyzed} frames analyzed</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SiqCard>
                </TabsContent>

                {/* === KEY FRAMES TAB === */}
                <TabsContent value="keyframes">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {keyFrames.map((frame) => (
                      <div key={frame.id} className="rounded-xl overflow-hidden border border-border/50 bg-card/70 backdrop-blur-sm shadow-card hover:shadow-lg hover:border-secondary/30 transition-all group">
                        <div className="aspect-video bg-accent/60 flex items-center justify-center relative">
                          <Eye size={24} className="text-muted-foreground/30 group-hover:text-secondary/50 transition-colors" />
                          {/* Gradient hover accent */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
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
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{frame.caption}</p>
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
                <button
                  onClick={() => navigate('/new-submission')}
                  className="py-3.5 border-2 border-secondary/40 text-secondary rounded-xl font-bold text-sm hover:bg-secondary/5 active:scale-[0.98] transition-all"
                >
                  Submit Another
                </button>
                <button
                  className="py-3.5 rounded-xl font-bold text-sm text-white active:scale-[0.98] transition-all shadow-soft"
                  style={{ background: buttonGradient }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = buttonGradientHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = buttonGradient)}
                >
                  Share Report
                </button>
              </div>
            </div>

            {/* Right Sidebar — hidden on small screens */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <AIInsightsSidebar />
              </div>
            </div>
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
      {/* Overall Assessment Card */}
      <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-card overflow-hidden">
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

      {/* Strength + Improvement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-success/20 bg-card/70 backdrop-blur-sm shadow-soft overflow-hidden">
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
        <div className="rounded-xl border border-warning/20 bg-card/70 backdrop-blur-sm shadow-soft overflow-hidden">
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

      {/* Recommendation Card */}
      <div className="rounded-xl border border-secondary/20 bg-card/70 backdrop-blur-sm shadow-soft overflow-hidden">
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

      {/* Recommended Next Actions */}
      <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-soft overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-warning" />
        <div className="p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target size={16} className="text-primary" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Recommended Next Actions</h4>
          </div>
          <ul className="space-y-3">
            {[
              { icon: Crosshair, text: 'Practice gallbladder dissection plane identification in simulation lab' },
              { icon: Eye, text: 'Review Critical View of Safety criteria with attending surgeon' },
              { icon: Activity, text: 'Complete 3 supervised cholecystectomy cases before independent practice' },
            ].map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-foreground leading-relaxed">
                <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                  <action.icon size={12} className="text-primary" />
                </div>
                {action.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => setShowFull(!showFull)}
        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-secondary hover:bg-accent/50 rounded-xl border border-border/50 transition-colors"
      >
        {showFull ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {showFull ? 'Collapse full evaluation' : 'View full evaluation & phase breakdown'}
      </button>

      {showFull && (
        <SiqCard className="space-y-4 text-sm text-foreground leading-relaxed animate-accordion-down bg-card/70 backdrop-blur-sm">
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
