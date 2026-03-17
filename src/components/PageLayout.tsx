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
    <div className="min-h-screen pb-24 pt-16 flex flex-col font-sans bg-background text-foreground">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <div className="w-10">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-accent rounded-full transition-colors">
              <ChevronLeft size={24} className="text-primary" />
            </button>
          )}
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-primary">{title}</h1>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-accent rounded-full flex items-center justify-center border border-border overflow-hidden">
          <User size={20} className="text-primary" />
        </button>
      </nav>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around px-2 z-50">
          <NavTab icon={<Home size={22} />} label="Home" active={activeTab === 'home'} onClick={() => navigate(dashboardRoute)} />
          <NavTab icon={<ClipboardList size={22} />} label="Submissions" active={activeTab === 'submissions'} onClick={() => navigate('/submissions')} />
          <NavTab icon={<BarChart3 size={22} />} label="Dashboard" active={activeTab === 'stats'} onClick={() => navigate(dashboardRoute)} />
          <NavTab icon={<User size={22} />} label="Profile" active={activeTab === 'profile'} onClick={() => navigate('/profile')} />
        </nav>
      )}

      {/* FAB */}
      {showNav && (
        <button
          onClick={() => navigate('/new-submission')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-soft flex flex-col items-center justify-center z-40 active:scale-95 transition-transform hover:opacity-90"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
};

const NavTab = ({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-1/4 gap-1 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    {active && <div className="w-1 h-1 bg-primary rounded-full" />}
  </button>
);

export default PageLayout;
