import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { PROCEDURES } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const PROCEDURE_ICONS: Record<string, string> = {
  "Wound Closure & Suturing": "🔪",
  "Burr Hole Placement": "🧠",
  "Laparoscopic Port Placement": "🎯",
  "Skin Incision Technique": "✂️",
  "Wound Debridement": "🩹",
  "Laceration Repair": "🔬",
};

const OnboardingResidentStep2 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [selected, setSelected] = useState<string[]>(user.selectedProcedures);
  const [isLoading, setIsLoading] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [showOther, setShowOther] = useState(false);

  const toggle = (p: string) => {
    setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = () => {
    setUser(prev => ({ ...prev, selectedProcedures: selected }));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard-resident');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => navigate('/onboarding-resident')} className="mb-8 text-primary"><ChevronLeft /></button>
      <div className="mb-6">
        <div className="h-1.5 w-full bg-border rounded-full mb-4">
          <div className="h-full w-full bg-primary rounded-full transition-all" />
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Step 2 of 2</p>
        <h2 className="text-2xl font-bold text-primary">What are you working on?</h2>
        <p className="text-muted-foreground text-sm mt-1">Select the procedures you are currently training on.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PROCEDURES.map(p => {
          const isSelected = selected.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle(p)}
              className={`p-4 bg-card border rounded-lg text-left font-medium text-primary flex justify-between items-center transition-all hover:border-primary ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <span className="flex items-center gap-3">
                <span>{PROCEDURE_ICONS[p] || '📋'}</span>
                {p}
              </span>
              <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                {isSelected && <Check size={12} className="text-primary-foreground" />}
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setShowOther(!showOther)}
          className={`p-4 bg-card border rounded-lg text-left font-medium text-primary flex justify-between items-center transition-all hover:border-primary ${showOther ? 'border-primary' : 'border-border'}`}
        >
          <span className="flex items-center gap-3">➕ Other</span>
        </button>
        {showOther && (
          <input
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="w-full p-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-primary"
            placeholder="Enter procedure name..."
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold mt-8 hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Enter SurgicalIQ →
      </button>

      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-card z-[100] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-primary rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold text-primary">Setting up your profile...</h3>
            <p className="text-muted-foreground mt-2">Loading expert benchmarks and curriculum.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingResidentStep2;
