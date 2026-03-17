import { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

// --- SIQ Card ---
export const SiqCard = ({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`bg-card rounded-xl p-6 shadow-card border border-border/40 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-secondary/30' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- Status Badge ---
export const StatusBadge = ({ status }: { status: 'Passed' | 'Flagged' | 'Failed' }) => {
  const config = {
    Passed: { bg: 'bg-success/10 border-success/30', text: 'text-success', label: 'PASS' },
    Flagged: { bg: 'bg-warning/10 border-warning/30', text: 'text-warning', label: 'REVIEW' },
    Failed: { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', label: 'NEEDS WORK' },
  };
  const s = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

// --- Score Dot ---
export const ScoreDot = ({ score, maxScore = 5 }: { score: number; maxScore?: number }) => {
  const ratio = score / maxScore;
  const color = ratio >= 0.8 ? 'bg-success' : ratio >= 0.6 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full ${color} shadow-sm`} />
      <span className="text-2xl font-bold font-display text-foreground">{score}/{maxScore}</span>
    </div>
  );
};

// --- Segmented Progress Bar ---
export const SegmentedBar = ({ score, maxScore = 5, segments = 7 }: { score: number; maxScore?: number; segments?: number }) => {
  const filled = Math.round((score / maxScore) * segments);
  const ratio = score / maxScore;
  const colorClass = ratio >= 0.8 ? 'bg-secondary' : ratio >= 0.6 ? 'bg-warning' : 'bg-destructive';

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-full ${i < filled ? colorClass : 'bg-border'}`}
        />
      ))}
    </div>
  );
};

// --- Section Header ---
export const SectionHeader = ({ icon, children }: { icon?: string; children: ReactNode }) => (
  <div className="section-header mb-5 mt-8">
    {icon && <span>{icon}</span>}
    {children}
  </div>
);

// --- Form Input ---
export const FormInput = ({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
      placeholder={placeholder}
    />
  </div>
);

// --- Form Select ---
export const FormSelect = ({ label, options, value, onChange }: {
  label?: string; options: string[]; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-xl border border-border bg-card text-sm appearance-none focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
    >
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// --- Stat Card ---
export const StatCard = ({ label, value, colorClass }: { label: string; value: string; colorClass?: string }) => (
  <SiqCard className="flex flex-col items-center justify-center py-5 text-center">
    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{label}</span>
    <span className={`text-3xl font-black font-display ${colorClass || 'text-primary'}`}>{value}</span>
  </SiqCard>
);
