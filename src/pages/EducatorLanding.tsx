import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, CalendarIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const LOADING_MESSAGES = [
  'Processing surgical transcript…',
  'Identifying procedural phases…',
  'Generating AI-assisted insights…',
  'Preparing performance dashboard…',
];

const EducatorLanding = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (loading && msgIndex >= LOADING_MESSAGES.length - 1) {
      const timeout = setTimeout(() => navigate('/submission-detail'), 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading, msgIndex, navigate]);

  const handleSearch = () => {
    setMsgIndex(0);
    setLoading(true);
  };

  const gradientBg = {
    background: 'linear-gradient(160deg, hsl(210 45% 90%) 0%, hsl(200 35% 93%) 30%, hsl(170 20% 94%) 50%, hsl(50 40% 92%) 75%, hsl(42 55% 88%) 100%)',
  };

  const titleStyle = {
    background: 'linear-gradient(135deg, hsl(211 60% 28%) 0%, hsl(197 65% 45%) 40%, hsl(45 80% 55%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={gradientBg}>
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-40 blur-[100px] pointer-events-none" style={{ background: 'hsl(210 55% 72%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-35 blur-[100px] pointer-events-none" style={{ background: 'hsl(42 65% 72%)' }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-warning" />

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black font-display tracking-tight pb-2 mb-4"
            style={titleStyle}
          >
            SurgicalIQ
          </h1>
          <p className="text-xs text-muted-foreground tracking-wide font-medium mb-12">
            AI-Assisted Surgical Education & Performance Analysis
          </p>

          <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-6" />

          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              className="text-sm font-medium text-foreground/70"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-8">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= msgIndex ? 'w-6 bg-secondary' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-visible" style={gradientBg}>
      {/* Ambient glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-40 blur-[100px] pointer-events-none" style={{ background: 'hsl(210 55% 72%)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-35 blur-[100px] pointer-events-none" style={{ background: 'hsl(42 65% 72%)' }} />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-warning" />

      {/* Hero */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1
          className="text-7xl sm:text-8xl md:text-9xl font-black font-display tracking-tight pb-3 leading-[1.1]"
          style={titleStyle}
        >
          SurgicalIQ
        </h1>
        <motion.p
          className="text-[11px] text-muted-foreground tracking-wide font-medium mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Powered by IBM watsonx.ai
        </motion.p>
        <motion.p
          className="text-sm sm:text-[15px] text-foreground/55 max-w-xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          AI tools for educators to track surgical skill and deliver instant feedback.
        </motion.p>
      </motion.div>

      {/* Search card */}
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
      >
        <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-card overflow-visible">
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
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
                />
              </div>
            </div>

            {/* Date of Procedure - single field with calendar picker */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Date of Procedure
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-full h-11 px-4 rounded-xl border border-border bg-background/80 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all",
                      !date && "text-muted-foreground/60"
                    )}
                  >
                    {date ? format(date, 'MM/dd/yyyy') : 'MM/DD/YYYY'}
                    <CalendarIcon size={15} className="text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="gradient-line" />

            <button
              onClick={handleSearch}
              className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-soft group text-white"
              style={{
                background: 'linear-gradient(135deg, hsl(207 50% 52%), hsl(197 55% 48%))',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, hsl(207 50% 58%), hsl(197 55% 54%))')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, hsl(207 50% 52%), hsl(197 55% 48%))')}
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
          AI-Assisted Surgical Education · Simulation Only
        </motion.p>
      </motion.div>
    </div>
  );
};

export default EducatorLanding;
