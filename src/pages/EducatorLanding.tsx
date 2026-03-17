import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Activity, Brain } from 'lucide-react';

const EducatorLanding = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = () => {
    navigate('/submission-detail');
  };

  return (
    <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-warning/5 blur-3xl pointer-events-none" />

      {/* Branding */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl md:text-7xl font-black font-display gradient-text tracking-tight mb-3">
          Surgical<span>IQ</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-secondary mb-5">
          <Brain size={12} /> Educator Dashboard
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Evaluate surgical performance through AI-assisted analysis and structured feedback.
        </p>
      </div>

      {/* Search Card */}
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
          <div className="p-8 space-y-6">
            {/* Student Name */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Student Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Chen"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
                />
              </div>
            </div>

            {/* Date of Procedure */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Date of Procedure
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Month"
                    className="w-full h-12 pl-9 pr-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
                  />
                </div>
                <input
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Day"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all text-center"
                />
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all text-center"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="gradient-line" />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-soft group"
            >
              <Search size={16} className="group-hover:scale-110 transition-transform" />
              Search Records
            </button>
          </div>
        </div>

        <p className="mt-8 text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">
          Powered by IBM Watsonx.ai · Simulation Only
        </p>
      </div>
    </div>
  );
};

export default EducatorLanding;
