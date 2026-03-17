import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, hsl(210 40% 94%) 0%, hsl(200 35% 96%) 25%, hsl(180 25% 96%) 50%, hsl(60 30% 95%) 75%, hsl(45 50% 92%) 100%)',
      }}
    >
      {/* Ambient glow accents */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: 'hsl(210 50% 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] pointer-events-none" style={{ background: 'hsl(45 70% 70%)' }} />

      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-warning" />

      {/* Hero branding */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1
          className="text-7xl sm:text-8xl md:text-9xl font-black font-display tracking-tighter mb-4 leading-none"
          style={{
            background: 'linear-gradient(135deg, hsl(211 60% 28%) 0%, hsl(197 65% 45%) 40%, hsl(45 80% 55%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SurgicalIQ
        </h1>
        <motion.p
          className="text-sm text-muted-foreground tracking-wide font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Powered by IBM watsonx.ai
        </motion.p>
      </motion.div>

      {/* Search card */}
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
      >
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-card overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-warning" />
          <div className="p-7 space-y-5">
            {/* Student Name */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Student Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Chen"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
                />
              </div>
            </div>

            {/* Date of Procedure */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Date of Procedure
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Month"
                    className="w-full h-11 pl-8 pr-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
                  />
                </div>
                <input
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Day"
                  className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all text-center"
                />
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year"
                  className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all text-center"
                />
              </div>
            </div>

            <div className="gradient-line" />

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-soft group"
            >
              <Search size={15} className="group-hover:scale-110 transition-transform" />
              Search Records
            </button>
          </div>
        </div>

        <motion.p
          className="mt-10 text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          AI-Assisted Surgical Training Evaluation · Simulation Only
        </motion.p>
      </motion.div>
    </div>
  );
};

export default EducatorLanding;
