import { useNavigate } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import { SiqCard } from '@/components/SiqComponents';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Microscope className="text-primary-foreground" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">SurgicalIQ</h1>
        <p className="text-muted-foreground mt-2 font-medium">Expert surgical knowledge. Scaled.</p>
        <p className="text-muted-foreground/70 text-sm mt-1">AI-powered evaluation for the next generation of surgeons.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <SiqCard onClick={() => navigate('/onboarding-resident')} className="text-left hover:border-primary group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h3 className="font-bold text-primary">I am a Resident / Trainee</h3>
              <p className="text-sm text-muted-foreground">Submit procedures and get instant feedback</p>
            </div>
          </div>
        </SiqCard>

        <SiqCard onClick={() => navigate('/onboarding-educator')} className="text-left hover:border-primary group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h3 className="font-bold text-primary">I am an Educator / Attending</h3>
              <p className="text-sm text-muted-foreground">Review cohort performance and track progress</p>
            </div>
          </div>
        </SiqCard>
      </div>
      <p className="mt-12 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">AI-Powered Evaluation Platform</p>
    </div>
  );
};

export default Welcome;
