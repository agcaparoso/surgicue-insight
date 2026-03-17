import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { FormInput, FormSelect } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';
import { SPECIALTIES, YEARS } from '@/lib/mockData';

const OnboardingResident = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => navigate('/welcome')} className="mb-8 text-primary"><ChevronLeft /></button>
      <div className="mb-6">
        <div className="h-1.5 w-full bg-border rounded-full mb-4">
          <div className="h-full w-1/2 bg-primary rounded-full transition-all" />
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Step 1 of 2</p>
        <h2 className="text-2xl font-bold text-primary">Set up your trainee profile</h2>
      </div>

      <div className="space-y-4">
        <FormInput label="Full Name" placeholder="Dr. Alex Rivera" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value, role: 'resident' })} />
        <FormInput label="Medical School / Program" placeholder="Johns Hopkins Medicine" value={user.program} onChange={(e) => setUser({ ...user, program: e.target.value })} />
        <FormSelect label="Year of Training" options={YEARS} value={user.year} onChange={(e) => setUser({ ...user, year: e.target.value })} />
        <FormSelect label="Primary Specialty" options={SPECIALTIES} value={user.specialty} onChange={(e) => setUser({ ...user, specialty: e.target.value })} />
        <FormInput label="Assigned Attending" placeholder="Dr. Sarah Chen" value={user.attending} onChange={(e) => setUser({ ...user, attending: e.target.value })} />

        <button
          onClick={() => {
            setUser(prev => ({ ...prev, role: 'resident' }));
            navigate('/onboarding-resident-step2');
          }}
          className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold mt-8 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingResident;
