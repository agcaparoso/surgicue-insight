import { useNavigate } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import { SiqCard } from '@/components/SiqComponents';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen page-gradient flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary tracking-tight font-display mb-1">
          Surgical<span className="text-secondary">IQ</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">
          MVP · Hackathon Build
        </div>
        <p className="text-muted-foreground font-medium text-sm">AI-assisted surgical training evaluation</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <SiqCard onClick={() => navigate('/onboarding-resident')} className="text-left group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h3 className="font-bold text-primary font-display">I am a Resident / Trainee</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Submit procedures and get instant feedback</p>
            </div>
          </div>
        </SiqCard>

        <SiqCard onClick={() => navigate('/onboarding-educator')} className="text-left group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h3 className="font-bold text-primary font-display">I am an Educator / Attending</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Review cohort performance and track progress</p>
            </div>
          </div>
        </SiqCard>
      </div>
      <p className="mt-12 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Powered by AI · Simulation Only</p>
    </div>
  );
};

export default Welcome;
