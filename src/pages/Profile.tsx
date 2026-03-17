import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Settings, Info, LogOut, ChevronRight, Bell } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard, SectionHeader } from '@/components/SiqComponents';
import { useUser } from '@/context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user.name || 'Dr. Alex Rivera';
  const initials = displayName.split(' ').filter(w => w[0]?.match(/[A-Z]/)).map(w => w[0]).join('').slice(0, 2) || 'AR';
  const roleLabel = `${user.educatorRole || 'Attending'} • ${user.department || 'Surgery'}`;

  const menuItems = [
    { icon: <User size={18} />, label: 'Edit Profile' },
    { icon: <Bell size={18} />, label: 'Notification Preferences' },
    { icon: <ShieldCheck size={18} />, label: 'Privacy & Compliance', onClick: () => navigate('/compliance') },
    { icon: <Info size={18} />, label: 'Help & Support' },
  ];

  return (
    <PageLayout title="Profile" activeTab="profile">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4 shadow-card">
          {initials}
        </div>
        <h2 className="text-xl font-bold text-primary font-display">{displayName}</h2>
        <p className="text-muted-foreground text-sm">{roleLabel}</p>
        {user.institution && <p className="text-xs text-muted-foreground mt-1">{user.institution}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-black font-display text-primary">12</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Total</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-2xl font-black font-display text-primary">75%</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Pass Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black font-display text-primary">82</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Avg Score</div>
        </div>
      </div>

      <SectionHeader>My Procedures</SectionHeader>
      <div className="space-y-2 mb-2">
        {(user.selectedProcedures.length > 0 ? user.selectedProcedures : ['Wound Closure & Suturing', 'Burr Hole Placement', 'Skin Incision Technique']).map((p, i) => (
          <SiqCard key={i} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-primary">{p}</span>
            <button className="text-xs text-destructive font-bold hover:underline">Remove</button>
          </SiqCard>
        ))}
      </div>

      <SectionHeader>Settings</SectionHeader>
      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-secondary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-secondary">{item.icon}</div>
              <span className="font-medium text-sm text-foreground">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}

        <button
          onClick={() => navigate('/welcome')}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-destructive/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-destructive"><LogOut size={18} /></div>
            <span className="font-medium text-sm text-destructive">Sign Out</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>
    </PageLayout>
  );
};

export default Profile;
