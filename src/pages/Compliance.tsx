import { ShieldCheck } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { SiqCard } from '@/components/SiqComponents';

const sections = [
  {
    icon: '🔒',
    title: 'Data De-identification',
    content: 'All trainee submissions are stored using anonymous IDs. Names are never attached to procedural footage in the evaluation system.',
  },
  {
    icon: '🏥',
    title: 'Simulation Environment Only',
    content: 'SurgicalIQ operates exclusively in simulation and training environments. No real patient data, PHI, or live OR footage is collected or processed in the current platform.',
  },
  {
    icon: '☁️',
    title: 'Secure Cloud Storage',
    content: 'All footage and images are encrypted at rest and in transit. Role-based access control ensures only authorized educators and trainees can view relevant submissions.',
  },
  {
    icon: '📋',
    title: 'Post-MVP Compliance Roadmap',
    content: 'As SurgicalIQ scales into hospital environments, the platform will be architected for full HIPAA compliance including BAA agreements, audit trails, and PHI handling protocols.',
  },
];

const Compliance = () => {
  return (
    <PageLayout title="Privacy & Compliance" activeTab="profile">
      <div className="space-y-6">
        {sections.map((s, i) => (
          <SiqCard key={i}>
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
              <span>{s.icon}</span>
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </SiqCard>
        ))}

        <SiqCard className="border-primary/10 italic">
          <p className="text-sm text-muted-foreground">
            "Our mission is to provide world-class surgical feedback while maintaining the highest standards of data integrity and privacy."
          </p>
        </SiqCard>
      </div>
    </PageLayout>
  );
};

export default Compliance;
