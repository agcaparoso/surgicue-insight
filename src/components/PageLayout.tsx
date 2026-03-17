import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Home, ClipboardList, BarChart3, Plus } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  activeTab?: 'home' | 'submissions' | 'stats' | 'profile';
  showNav?: boolean;
}

const PageLayout = ({ title, children, showBack = true, activeTab, showNav = true }: PageLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const dashboardRoute = user.role === 'educator' ? '/dashboard-educator' : '/dashboard-resident';

  return (
    <div className="min-h-screen pb-24 pt-16 flex flex-col page-gradient">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 z-50">
        <div className="w-10">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-accent rounded-full transition-colors">
              <ChevronLeft size={22} className="text-primary" />
            </button>
          )}
        </div>
        <h1 className="text-base font-bold tracking-tight text-primary font-display">{title}</h1>
        <button onClick={() => navigate('/profile')} className="w-9 h-9 bg-accent rounded-full flex items-center justify-center border border-border/50 overflow-hidden hover:border-secondary/50 transition-colors">
          <User size={16} className="text-primary" />
        </button>
      </nav>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-2 z-50">
          <NavTab icon={<Home size={20} />} label="Home" active={activeTab === 'home'} onClick={() => navigate(dashboardRoute)} />
          <NavTab icon={<ClipboardList size={20} />} label="Submissions" active={activeTab === 'submissions'} onClick={() => navigate('/submissions')} />
          <NavTab icon={<BarChart3 size={20} />} label="Dashboard" active={activeTab === 'stats'} onClick={() => navigate(dashboardRoute)} />
          <NavTab icon={<User size={20} />} label="Profile" active={activeTab === 'profile'} onClick={() => navigate('/profile')} />
        </nav>
      )}

      {/* FAB */}
      {showNav && (
        <button
          onClick={() => navigate('/new-submission')}
          className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-card flex flex-col items-center justify-center z-40 active:scale-95 transition-transform hover:opacity-90"
        >
          <Plus size={22} />
        </button>
      )}
    </div>
  );
};

const NavTab = ({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-1/4 gap-1 transition-colors ${active ? 'text-secondary' : 'text-muted-foreground'}`}>
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    {active && <div className="w-5 h-0.5 bg-secondary rounded-full" />}
  </button>
);

export default PageLayout;
