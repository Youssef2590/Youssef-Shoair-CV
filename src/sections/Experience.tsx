import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  current?: boolean;
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    role: 'AI Software Engineer',
    company: 'Etiqa Insurance & Takaful',
    location: 'Kuala Lumpur',
    period: 'Jul 2025 – Present',
    description: 'Configured NVIDIA NemoClaw frameworks for AI agent workflows. Built MCP server for internal EDC UI components. Engineered AI-driven BRD & Jira User Story generation from Figma designs. Deployed IT operations AI agents and productivity scoring systems.',
    current: true,
  },
  {
    id: 2,
    role: 'Software Developer',
    company: 'Tentacle Tech',
    location: 'Kuala Lumpur',
    period: 'Jan – Jul 2025',
    description: 'Engineered a knowledge model powered by LLaMA 3.2B for legal PDFs. Built and deployed an AI FAQ chatbot using FastAPI, PostgreSQL, React.js. Designed a CV parser endpoint with Gemma 3 achieving 100% parsing accuracy.',
  },
  {
    id: 3,
    role: 'Junior Software Developer',
    company: 'Tentacle Tech',
    location: 'Kuala Lumpur',
    period: 'Sep – Dec 2024',
    description: 'Structured and cleaned legal content for NLP tasks. Contributed to backend (FastAPI) and frontend (React.js). Collaborated on prompt engineering and model selection.',
  },
  {
    id: 4,
    role: 'Junior Frontend Developer',
    company: 'BroadBITS',
    location: 'Remote',
    period: 'Mar – Aug 2024',
    description: 'Contributed to a secure password management browser extension. Integrated front-end and back-end components with rigorous testing and debugging.',
  },
  {
    id: 5,
    role: 'Freelance Developer',
    company: 'Independent',
    location: 'Remote',
    period: 'Jan 2022 – Feb 2024',
    description: 'Delivered LLM-powered tools for small businesses: document summarizers, chatbot assistants, email generators. Full-stack with Django, FastAPI, React.js, PostgreSQL.',
  },
  {
    id: 6,
    role: 'Junior Associate Analyst',
    company: 'NAMA Foundation',
    location: 'Kuala Lumpur',
    period: 'Aug – Nov 2023',
    description: 'Designed dynamic data dashboards and reporting tools using Excel, SQL, Python (Plotly, Matplotlib). Data-driven process improvements.',
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const rows = rowsRef.current.filter(Boolean);

    if (!section || !header || rows.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: header, start: 'top 85%', end: 'top 55%', scrub: 0.4 },
        }
      );

      rows.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(row,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 70%', scrub: 0.4 },
            delay: i * 0.03,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative z-20 py-[14vh] px-[6vw]"
      style={{ background: 'var(--surface)' }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-14 will-change-transform flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--vermillion)' }}>
            Experience
          </p>
          <h2 className="font-display font-700 headline-section" style={{ color: 'var(--ink)' }}>
            Where I've<br />worked
          </h2>
        </div>
        <p className="hidden lg:block font-mono text-[11px] uppercase tracking-[0.14em] max-w-[28ch] text-right" style={{ color: 'var(--ink-muted)' }}>
          {experiences.length} roles across {new Set(experiences.map(e => e.company)).size} organizations, 2022 to present
        </p>
      </div>

      {/* Table-style experience rows */}
      <div className="w-full" style={{ borderTop: '1px solid oklch(0.94 0.005 260 / 0.08)' }}>
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            ref={(el) => { rowsRef.current[index] = el; }}
            className="group will-change-transform cursor-pointer transition-colors duration-300"
            role="button"
            tabIndex={0}
            aria-expanded={expandedId === exp.id}
            style={{ borderBottom: '1px solid oklch(0.94 0.005 260 / 0.06)' }}
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === exp.id ? null : exp.id); } }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'oklch(0.62 0.22 25 / 0.03)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            data-cursor-hover
          >
            {/* Main row */}
            <div className="grid grid-cols-[1fr] sm:grid-cols-[2fr_1fr_0.7fr_0.8fr] gap-2 sm:gap-4 py-5 sm:py-6 items-start sm:items-center">
              <div className="flex items-center gap-3 min-w-0">
                {exp.current && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--vermillion)' }} />
                )}
                <h3 className="font-display font-700 text-[clamp(1.125rem,2vw,1.5rem)] tracking-[-0.02em] truncate" style={{ color: 'var(--ink)' }}>
                  {exp.role}
                </h3>
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.1em] truncate" style={{ color: 'var(--ink-muted)' }}>
                {exp.company}
              </p>

              <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-muted)' }}>
                {exp.location}
              </p>

              <p className="font-mono text-[11px] uppercase tracking-[0.1em] sm:text-right whitespace-nowrap" style={{ color: exp.current ? 'var(--vermillion)' : 'var(--ink-muted)' }}>
                {exp.period}
              </p>
            </div>

            {/* Expandable description */}
            <div
              className="expand-panel"
              data-open={expandedId === exp.id ? 'true' : 'false'}
            >
              <div>
                <p className="pb-6 text-[15px] leading-[1.7] max-w-3xl sm:pl-[calc(1.5rem)]" style={{
                  color: 'var(--ink-muted)',
                  opacity: expandedId === exp.id ? 1 : 0,
                  transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
                }}>
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;