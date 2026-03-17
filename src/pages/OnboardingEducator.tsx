import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { FormInput, FormSelect } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';

const OnboardingEducator = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  return (
    <div className="min-h-screen page-gradient p-6">
      <button onClick={() => navigate('/welcome')} className="mb-8 p-2 hover:bg-accent rounded-full transition-colors text-primary"><ChevronLeft /></button>
      <div className="mb-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-primary font-display">Set up your educator profile</h2>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <FormInput label="Full Name" placeholder="Dr. Sarah Chen" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value, role: 'educator' })} />
        <FormInput label="Institution / Hospital" placeholder="Massachusetts General Hospital" value={user.institution} onChange={(e) => setUser({ ...user, institution: e.target.value })} />
        <FormSelect label="Department" options={['General Surgery', 'Neurosurgery', 'Orthopedics', 'Cardiothoracic', 'Vascular', 'Other']} value={user.department} onChange={(e) => setUser({ ...user, department: e.target.value })} />
        <FormInput label="Number of Active Trainees" placeholder="12" type="number" value={user.numTrainees} onChange={(e) => setUser({ ...user, numTrainees: e.target.value })} />
        <FormSelect label="Role" options={['Attending Surgeon', 'Program Director', 'Simulation Lab Director', 'Other']} value={user.educatorRole} onChange={(e) => setUser({ ...user, educatorRole: e.target.value })} />

        <button
          onClick={() => {
            setUser(prev => ({ ...prev, role: 'educator' }));
            navigate('/dashboard-educator');
          }}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold mt-8 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Enter SurgicalIQ <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingEducator;
