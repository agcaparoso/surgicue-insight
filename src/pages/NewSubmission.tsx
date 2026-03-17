import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, Microscope, Plus, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { FormSelect, SectionHeader } from '@/components/SiqComponents';
import { PROCEDURES } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const NewSubmission = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('video');
  const [files, setFiles] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleFileAdd = () => {
    setFiles(prev => [...prev, `file_${prev.length + 1}.mp4`]);
  };

  const handleSubmit = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setTimeout(() => setAnalysisStep(1), 800);
    setTimeout(() => setAnalysisStep(2), 1600);
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate('/submission-detail');
    }, 3000);
  };

  const sources = [
    { key: 'photo', icon: <Camera size={20} />, label: 'Photo', desc: 'Upload 4-5 photos at key checkpoints' },
    { key: 'video', icon: <Video size={20} />, label: 'Video', desc: 'Upload a recorded training session' },
    { key: 'scope', icon: <Microscope size={20} />, label: 'Scope', desc: 'Upload laparoscopic/endoscopic footage' },
  ];

  return (
    <PageLayout title="New Submission" activeTab="submissions">
      <div className="space-y-6">
        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Step 1: Select Procedure</label>
          <FormSelect options={PROCEDURES} />
        </section>

        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Step 2: Camera Source</label>
          <div className="grid grid-cols-3 gap-3">
            {sources.map(s => (
              <button
                key={s.key}
                onClick={() => setSource(s.key)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${source === s.key ? 'border-secondary bg-secondary/5' : 'border-border bg-card hover:border-secondary/30'}`}
              >
                <div className={source === s.key ? 'text-secondary' : 'text-muted-foreground'}>{s.icon}</div>
                <span className={`text-[10px] font-bold uppercase mt-2 ${source === s.key ? 'text-secondary' : 'text-muted-foreground'}`}>{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Step 3: Upload Footage</label>
          <div
            onClick={handleFileAdd}
            className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-card cursor-pointer hover:border-secondary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-3">
              <Plus className="text-secondary" />
            </div>
            <p className="text-sm font-medium text-primary">Tap to browse or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, JPG, PNG (Max 500MB)</p>
          </div>
          {files.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-accent px-3 py-2 rounded-lg text-xs font-medium text-primary">
                  📎 {f}
                  <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-destructive hover:opacity-70">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Step 4: Context (Optional)</label>
          <textarea
            className="w-full p-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 min-h-[100px] transition-all"
            placeholder="e.g. First attempt at burr hole placement, struggled with left edge alignment..."
          />
        </section>

        <div className="bg-card p-4 rounded-xl flex gap-3 border border-border/50 shadow-soft">
          <ShieldCheck className="shrink-0 text-success" size={20} />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <strong>Privacy Notice:</strong> Your submission is stored securely and de-identified. No patient data is collected. Simulation environment only.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-card hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Submit for AI Evaluation →
        </button>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-card z-[100] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 border-4 border-accent rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-t-secondary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-6 font-display">Analyzing Footage</h3>
            <div className="space-y-3 w-full max-w-xs mx-auto">
              {[
                'Extracting procedural frames',
                'Comparing against expert benchmarks',
                'Generating feedback report',
              ].map((label, i) => (
                <div key={i} className="flex items-center gap-3 text-left">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${analysisStep > i ? 'bg-success' : analysisStep === i ? 'bg-secondary' : 'bg-border'}`}>
                    {analysisStep > i && <CheckCircle2 size={12} className="text-success-foreground" />}
                    {analysisStep === i && <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" />}
                  </div>
                  <span className={`text-sm font-medium ${analysisStep >= i ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default NewSubmission;
