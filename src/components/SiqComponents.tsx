import { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

// --- SIQ Card ---
export const SiqCard = ({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`bg-card rounded-lg p-4 shadow-soft border border-transparent active:border-primary/20 transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- Status Badge ---
export const StatusBadge = ({ status }: { status: 'Passed' | 'Flagged' | 'Failed' }) => {
  const config = {
    Passed: { bg: 'bg-success/15', text: 'text-success', icon: <CheckCircle2 size={12} /> },
    Flagged: { bg: 'bg-warning/15', text: 'text-warning', icon: <AlertTriangle size={12} /> },
    Failed: { bg: 'bg-destructive/15', text: 'text-destructive', icon: <XCircle size={12} /> },
  };
  const s = config[status];
  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>
      {s.icon} {status}
    </span>
  );
};

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
      className="w-full p-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-primary transition-colors"
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
      className="w-full p-4 rounded-lg border border-border bg-card text-sm appearance-none focus:outline-none focus:border-primary"
    >
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// --- Stat Card ---
export const StatCard = ({ label, value, colorClass }: { label: string; value: string; colorClass?: string }) => (
  <SiqCard className="flex flex-col items-center justify-center py-6">
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
    <span className={`text-2xl font-black ${colorClass || 'text-primary'}`}>{value}</span>
  </SiqCard>
);
