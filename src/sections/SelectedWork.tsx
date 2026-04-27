import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  span: 'wide' | 'tall' | 'normal';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'AIRA',
    subtitle: 'AI Legal Research Assistant',
    description: 'AI-powered legal assistant leveraging LLaMA 3.2B for deep contextual understanding of legal PDFs. React.js + FastAPI + PostgreSQL with spaCy/NLTK preprocessing pipelines.',
    tags: ['LLaMA', 'FastAPI', 'React.js', 'spaCy'],
    span: 'wide',
  },
  {
    id: 2,
    title: 'Agentic BRD',
    subtitle: 'Design-to-Story Automation',
    description: 'LLM workflow that decomposes Figma UI designs into BRDs and testable Jira User Stories. End-to-end Figma → Jira integration.',
    tags: ['LLMs', 'Figma', 'Jira'],
    span: 'normal',
  },
  {
    id: 3,
    title: 'AI Infra & MCP',
    subtitle: 'Enterprise AI Platform',
    description: 'NVIDIA NemoClaw framework with MCP server for standardized AI-to-system communication. Micro-frontend architecture via Webpack Module Federation.',
    tags: ['NemoClaw', 'MCP', 'Docker'],
    span: 'normal',
  },
  {
    id: 4,
    title: 'Autonomous IT Ops',
    subtitle: 'AI Security & DevOps Agents',
    description: 'Suite of specialized AI agents: automated pentest, log & code analysis, load testing. Enterprise IT automation with advanced LLMs.',
    tags: ['Python', 'AI Agents', 'Security'],
    span: 'normal',
  },
  {
    id: 5,
    title: 'Productivity AI',
    subtitle: 'Team Velocity Analytics',
    description: 'AI-driven scoring system for weekly/monthly productivity metrics. Real-time reporting dashboards for IT departments.',
    tags: ['AI/ML', 'Analytics', 'Python'],
    span: 'normal',
  },
  {
    id: 6,
    title: 'ATS',
    subtitle: 'Applicant Tracking System',
    description: 'CV parser module using AI for high-accuracy resume extraction. Full-stack with RBAC, CI/CD, and comprehensive testing.',
    tags: ['React.js', 'PostgreSQL', 'AI', 'Jest'],
    span: 'wide',
  },
];

const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: header, start: 'top 85%', end: 'top 55%', scrub: 0.4 },
        }
      );

      cards.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 65%', scrub: 0.4 },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-20 py-[14vh] px-[6vw]"
      style={{ background: 'var(--surface)' }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-14 will-change-transform flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--vermillion)' }}>
            Work
          </p>
          <h2 className="font-display font-700 headline-section" style={{ color: 'var(--ink)' }}>
            Selected<br />projects
          </h2>
        </div>
        <p className="hidden lg:block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
          {projects.length} projects
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className={`group relative rounded-xl p-7 cursor-pointer will-change-transform transition-all duration-500 ${
              project.span === 'wide' ? 'md:col-span-2' : ''
            }`}
            style={{
              border: '1px solid oklch(0.94 0.005 260 / 0.06)',
              background: 'var(--surface-raise)',
            }}
            data-cursor-hover
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.62 0.22 25 / 0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.94 0.005 260 / 0.06)';
            }}
          >
            {/* Top: Number + Arrow */}
            <div className="flex items-start justify-between mb-6">
              <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: 'var(--ink-muted)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0"
                style={{ background: 'var(--vermillion)' }}
              >
                <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--surface)' }} />
              </div>
            </div>

            {/* Content: Asymmetric layout for wide cards */}
            <div className={project.span === 'wide' ? 'grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-end' : ''}>
              <div>
                <h3
                  className="font-display font-700 tracking-[-0.03em] leading-[1.05] mb-1 transition-colors duration-300"
                  style={{
                    color: 'var(--ink)',
                    fontSize: project.span === 'wide' ? 'clamp(32px, 4vw, 52px)' : 'clamp(24px, 3vw, 36px)',
                  }}
                >
                  {project.title}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--vermillion)' }}>
                  {project.subtitle}
                </p>
              </div>

              <div>
                <p className="text-[15px] leading-[1.65] mb-5" style={{ color: 'var(--ink-muted)' }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{
                        color: 'var(--ink-muted)',
                        border: '1px solid oklch(0.94 0.005 260 / 0.06)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;