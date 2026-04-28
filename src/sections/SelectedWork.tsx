import { useCallback, useEffect, useRef, useState } from 'react';
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
  caseStudy: string;
  techStack: { category: string; items: string[] }[];
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'AIRA',
    subtitle: 'AI Legal Research Assistant',
    description: 'AI-powered legal assistant leveraging LLaMA 3.2B for deep contextual understanding of legal PDFs. React.js + FastAPI + PostgreSQL with spaCy/NLTK preprocessing pipelines.',
    tags: ['LLaMA', 'FastAPI', 'React.js', 'spaCy'],
    caseStudy: 'Built an end-to-end AI legal research assistant that processes and indexes legal PDFs for contextual Q&A. The system uses LLaMA 3.2B via LM Studio for inference, with a custom preprocessing pipeline built on spaCy and NLTK for entity extraction, chunking, and semantic search. Reduced legal research time by ~60% for the target users. Designed the full-stack architecture from document ingestion to conversational UI.',
    techStack: [
      { category: 'AI / NLP', items: ['LLaMA 3.2B', 'LM Studio', 'spaCy', 'NLTK', 'Sentence Transformers'] },
      { category: 'Backend', items: ['FastAPI', 'PostgreSQL', 'pgvector', 'Python'] },
      { category: 'Frontend', items: ['React.js', 'Tailwind CSS', 'TypeScript'] },
    ],
    link: '#',
  },
  {
    id: 2,
    title: 'Agentic BRD',
    subtitle: 'Design-to-Story Automation',
    description: 'LLM workflow that decomposes Figma UI designs into BRDs and testable Jira User Stories. End-to-end Figma → Jira integration.',
    tags: ['LLMs', 'Figma', 'Jira'],
    caseStudy: 'Engineered an agentic AI pipeline that takes Figma design screens as input and automatically generates structured Business Requirement Documents and Jira-ready User Stories with acceptance criteria. The system uses vision-language models to interpret UI layouts, component hierarchies, and user flows, then maps them to standardized BRD templates. Integrated directly with Jira API for one-click story creation with proper epics, labels, and story points.',
    techStack: [
      { category: 'AI', items: ['GPT-4V', 'LangChain', 'Prompt Engineering'] },
      { category: 'Integration', items: ['Figma API', 'Jira REST API', 'MCP'] },
      { category: 'Backend', items: ['Python', 'FastAPI'] },
    ],
    link: '#',
  },
  {
    id: 3,
    title: 'AI Infrastructure',
    subtitle: 'Enterprise Platform Engineering',
    description: 'Micro-frontend architecture via Webpack Module Federation with Datadog observability. Independent deployment of AI-powered features across teams.',
    tags: ['Docker', 'Datadog', 'Micro-frontends'],
    caseStudy: 'Architected the AI infrastructure layer for enterprise-scale deployment at Etiqa. Built a micro-frontend architecture via Webpack Module Federation, enabling independent deployment of AI-powered features across teams. Monitored with Datadog for latency, error rates, and agent performance. Established CI/CD pipelines with GitHub Actions for automated testing and deployment across multiple service boundaries.',
    techStack: [
      { category: 'Infrastructure', items: ['Docker', 'Datadog', 'GitHub Actions'] },
      { category: 'Frontend', items: ['React.js', 'Webpack Module Federation', 'Micro-frontends'] },
      { category: 'DevOps', items: ['CI/CD', 'Container Orchestration'] },
    ],
    link: '#',
  },
  {
    id: 4,
    title: 'NemoClaw',
    subtitle: 'Multi-Agent Orchestration',
    description: 'NVIDIA NemoClaw framework for orchestrating multiple AI agents in enterprise workflows. Model routing, fallback strategies, and agent lifecycle management.',
    tags: ['NVIDIA', 'NemoClaw', 'AI Agents'],
    caseStudy: 'Configured and deployed NVIDIA NemoClaw framework for multi-agent orchestration at Etiqa. The system manages agent lifecycle, handles model routing between different LLM backends, and implements fallback strategies for high-availability AI services. Designed the orchestration layer to support concurrent agent execution with shared context, enabling complex multi-step workflows across insurance and financial services domains.',
    techStack: [
      { category: 'AI Platform', items: ['NVIDIA NemoClaw', 'Agent Orchestration', 'LLM Routing'] },
      { category: 'Backend', items: ['Python', 'FastAPI', 'Redis'] },
      { category: 'Infrastructure', items: ['Docker', 'GPU Compute'] },
    ],
    link: '#',
  },
  {
    id: 5,
    title: 'A/B Testing Platform',
    subtitle: 'Feature Flagging & Experimentation',
    description: 'GrowthBook-powered experimentation platform for A/B testing AI model rollouts and feature flags across enterprise products.',
    tags: ['GrowthBook', 'A/B Testing', 'Analytics'],
    caseStudy: 'Integrated GrowthBook for feature flagging and A/B testing of AI model rollouts across Etiqa products. The platform enables controlled experimentation, from gradual model upgrades to UI variations, with statistical significance tracking. Built custom metric pipelines to measure AI feature impact on user engagement and task completion. Enabled product teams to safely roll out AI-powered features with automatic rollback on regression.',
    techStack: [
      { category: 'Experimentation', items: ['GrowthBook', 'Feature Flags', 'Statistical Analysis'] },
      { category: 'Backend', items: ['Python', 'REST API', 'Event Streaming'] },
      { category: 'Analytics', items: ['Custom Metrics', 'Dashboards'] },
    ],
    link: '#',
  },
  {
    id: 6,
    title: 'MCP Server',
    subtitle: 'Model Context Protocol',
    description: 'Custom MCP server for standardized AI-to-system communication. Bridges AI agents with internal tools, UI libraries, and databases.',
    tags: ['MCP', 'Python', 'FastAPI'],
    caseStudy: 'Built a custom MCP (Model Context Protocol) server that standardizes how AI agents interact with internal systems, from UI component libraries to database queries. The server exposes a unified tool interface that agents consume for code generation, documentation lookup, and data retrieval. Designed the protocol layer to be model-agnostic, supporting multiple LLM backends. Reduced integration time for new AI features from weeks to days by providing a consistent communication contract between agents and enterprise systems.',
    techStack: [
      { category: 'AI', items: ['MCP Protocol', 'LLM Integration', 'Tool Definitions'] },
      { category: 'Backend', items: ['Python', 'FastAPI', 'PostgreSQL'] },
      { category: 'Integration', items: ['REST API', 'WebSocket', 'JSON-RPC'] },
    ],
    link: '#',
  },
  {
    id: 7,
    title: 'Autonomous IT Ops',
    subtitle: 'AI Security & DevOps Agents',
    description: 'Suite of specialized AI agents: automated pentest, log & code analysis, load testing. Enterprise IT automation with advanced LLMs.',
    tags: ['Python', 'AI Agents', 'Security'],
    caseStudy: 'Developed a suite of autonomous AI agents for enterprise IT operations. The pentest agent performs automated vulnerability scanning and generates remediation reports. The log analysis agent ingests system logs in real-time, identifies anomalies, and triggers alerts. The code review agent analyzes PRs for security vulnerabilities and code quality issues. The load testing agent generates and executes stress test scenarios. All agents are orchestrated through a unified dashboard with role-based access control.',
    techStack: [
      { category: 'AI', items: ['LLMs', 'LangChain', 'Agent Frameworks', 'RAG'] },
      { category: 'Security', items: ['OWASP', 'Vulnerability Scanning', 'Log Analysis'] },
      { category: 'Backend', items: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'] },
    ],
    link: '#',
  },
  {
    id: 8,
    title: 'Productivity AI',
    subtitle: 'Team Velocity Analytics',
    description: 'AI-driven scoring system for weekly/monthly productivity metrics. Real-time reporting dashboards for IT departments.',
    tags: ['AI/ML', 'Analytics', 'Python'],
    caseStudy: 'Built an AI-powered productivity scoring system that tracks and analyzes team velocity across multiple dimensions: code commits, PR reviews, ticket throughput, and meeting efficiency. The system generates weekly and monthly reports with trend analysis, identifies bottlenecks, and provides actionable recommendations. Integrated with Jira, GitHub, and calendar APIs for automatic data collection. The dashboard provides real-time visibility into team performance with drill-down capabilities per team member and project.',
    techStack: [
      { category: 'AI / Analytics', items: ['Python', 'Plotly', 'Pandas', 'Scoring Models'] },
      { category: 'Integration', items: ['Jira API', 'GitHub API', 'Calendar API'] },
      { category: 'Frontend', items: ['React.js', 'Chart.js', 'Tailwind CSS'] },
    ],
    link: '#',
  },
  {
    id: 9,
    title: 'ATS',
    subtitle: 'Applicant Tracking System',
    description: 'CV parser module using AI for high-accuracy resume extraction. Full-stack with RBAC, CI/CD, and comprehensive testing.',
    tags: ['React.js', 'PostgreSQL', 'AI', 'Jest'],
    caseStudy: 'Led the development of the CV parser module within a full-featured Applicant Tracking System. The AI parser achieves 100% accuracy on structured resumes using Gemma 3 for intelligent field extraction, handling varied formats, languages, and layouts. The full platform includes role-based access control for recruiters and hiring managers, automated pipeline stages, email notifications, and interview scheduling. Built with comprehensive test coverage using Jest and React Testing Library. Deployed with CI/CD via GitHub Actions.',
    techStack: [
      { category: 'AI', items: ['Gemma 3', 'NLP', 'Document Parsing'] },
      { category: 'Backend', items: ['FastAPI', 'PostgreSQL', 'Redis', 'RBAC'] },
      { category: 'Frontend', items: ['React.js', 'TypeScript', 'Tailwind CSS'] },
      { category: 'DevOps', items: ['Jest', 'GitHub Actions', 'CI/CD', 'Docker'] },
    ],
    link: '#',
  },
];

// ─── Text scramble utility ────────────────────────────────
const scrambleText = (el: HTMLElement, finalText: string) => {
  const chars = '0123456789ABCDEF—/';
  let frame = 0;
  const totalFrames = finalText.length * 5;
  const update = () => {
    el.textContent = finalText
      .split('')
      .map((char, i) => (frame / 5 > i ? char : chars[Math.floor(Math.random() * chars.length)]))
      .join('');
    frame++;
    if (frame <= totalFrames) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const tiltRaf = useRef<number>(0);
  const isAnimating = useRef(false);

  // ─── Scroll entrance: dramatic "dealt" cards ────────────
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!section || !header || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: header, start: 'top 85%', once: true },
        }
      );

      cards.forEach((card, i) => {
        gsap.set(card, {
          y: 120, opacity: 0, scale: 0.88,
          rotateX: 10, rotateY: i % 2 === 0 ? -3 : 3,
          transformPerspective: 1200,
        });

        ScrollTrigger.create({
          trigger: card,
          start: 'top 93%',
          once: true,
          onEnter: () => {
            gsap.to(card, {
              y: 0, opacity: 1, scale: 1, rotateX: 0, rotateY: 0,
              duration: 1.4, ease: 'expo.out', delay: i * 0.07,
              onStart: () => {
                const numEl = numberRefs.current[i];
                if (numEl) scrambleText(numEl, String(i + 1).padStart(2, '0'));
              },
            });
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ─── 3D Tilt on hover ──────────────────────────────────
  const handleTiltMove = useCallback((e: React.MouseEvent, index: number) => {
    const card = cardsRef.current[index];
    if (!card || activeId === projects[index]?.id) return;

    cancelAnimationFrame(tiltRaf.current);
    tiltRaf.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      gsap.to(card, {
        rotateX: (y - 0.5) * -14,
        rotateY: (x - 0.5) * 14,
        scale: 1.03,
        duration: 0.35, ease: 'power2.out',
        overwrite: 'auto', transformPerspective: 1000,
      });

      card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    });
  }, [activeId]);

  const handleTiltLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    cancelAnimationFrame(tiltRaf.current);
    gsap.to(card, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.8, ease: 'expo.out', overwrite: 'auto',
    });
  }, []);

  // ─── Expand / collapse: smooth in-place height transition ───
  const handleToggle = useCallback((id: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const next = activeId === id ? null : id;
    const activeIdx = next !== null ? projects.findIndex(p => p.id === next) : -1;
    const prevActiveIdx = activeId !== null ? projects.findIndex(p => p.id === activeId) : -1;

    // Cancel any pending tilt RAF, then clear 3D tilt
    cancelAnimationFrame(tiltRaf.current);
    cardsRef.current.forEach((card) => {
      if (card) gsap.set(card, { rotateX: 0, rotateY: 0, scale: 1, overwrite: 'auto' });
    });

    // Lock current heights on cards that will change content
    const expandingCard = activeIdx >= 0 ? cardsRef.current[activeIdx] : null;
    const collapsingCard = prevActiveIdx >= 0 ? cardsRef.current[prevActiveIdx] : null;

    if (expandingCard) {
      expandingCard.style.height = `${expandingCard.offsetHeight}px`;
      expandingCard.style.overflow = 'hidden';
    }
    if (collapsingCard) {
      collapsingCard.style.height = `${collapsingCard.offsetHeight}px`;
      collapsingCard.style.overflow = 'hidden';
    }

    // React swaps content
    setActiveId(next);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Animate expanding card from collapsed height → expanded height
        if (expandingCard) {
          const targetHeight = expandingCard.scrollHeight;
          gsap.to(expandingCard, {
            height: targetHeight,
            duration: 0.65,
            ease: 'expo.out',
            onComplete: () => {
              expandingCard.style.height = '';
              expandingCard.style.overflow = '';
              isAnimating.current = false;
            },
          });

          // Stagger-reveal expanded content
          const children = expandingCard.querySelectorAll('.reveal-child');
          gsap.fromTo(children,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.03, duration: 0.45, ease: 'expo.out', delay: 0.18 }
          );
        }

        // Animate collapsing card from expanded height → collapsed height
        if (collapsingCard) {
          const targetHeight = collapsingCard.scrollHeight;
          gsap.to(collapsingCard, {
            height: targetHeight,
            duration: 0.55,
            ease: 'expo.out',
            onComplete: () => {
              collapsingCard.style.height = '';
              collapsingCard.style.overflow = '';
              if (!expandingCard) isAnimating.current = false;
            },
          });
        }

        if (!expandingCard && !collapsingCard) {
          isAnimating.current = false;
        }

        // Dim/undim all cards
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const isThisActive = next !== null && i === activeIdx;
          const isInactive = next !== null && !isThisActive;

          gsap.to(card, {
            opacity: isInactive ? 0.38 : 1,
            duration: 0.5,
            ease: 'expo.out',
            overwrite: 'auto',
          });
        });
      });
    });
  }, [activeId]);

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

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(12px,1.5vw,20px)]"
        style={{ perspective: '1200px' }}
      >
        {projects.map((project, i) => {
          const isActive = activeId === project.id;

          return (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="glow-card group relative cursor-pointer will-change-transform rounded-xl"
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              style={{
                background: 'var(--surface-raise)',
                border: `1px solid ${isActive ? 'oklch(0.62 0.22 25 / 0.3)' : 'oklch(0.94 0.005 260 / 0.08)'}`,
                transformStyle: 'preserve-3d',
                transition: 'border-color 0.4s ease-out',
              }}
              onClick={() => handleToggle(project.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(project.id); } }}
              onMouseMove={(e) => !isActive && handleTiltMove(e, i)}
              onMouseLeave={() => !isActive && handleTiltLeave(i)}
              data-cursor-hover
            >
              {/* Cursor spotlight */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                style={{
                  background: 'radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), oklch(0.62 0.22 25 / 0.07), transparent 40%)',
                }}
              />

              {/* Collapsed card */}
              {!isActive && (
                <div className="relative z-10 p-6 min-h-[200px] flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      ref={(el) => { numberRefs.current[i] = el; }}
                      className="font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: 'var(--vermillion)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]" style={{ transform: 'translateZ(10px)' }}>
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.1em]"
                          style={{ color: 'var(--ink-muted)', border: '1px solid oklch(0.94 0.005 260 / 0.06)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto" style={{ transform: 'translateZ(30px)' }}>
                    <h3
                      className="font-display font-700 text-[clamp(1.375rem,2.8vw,2.125rem)] tracking-[-0.03em] leading-[1.05]"
                      style={{ color: 'var(--ink)' }}
                    >
                      {project.title}
                    </h3>
                    <p className="font-mono text-[11px] tracking-[0.05em] mt-1" style={{ color: 'var(--ink-muted)' }}>
                      {project.subtitle}
                    </p>
                  </div>
                </div>
              )}

              {/* Expanded detail */}
              {isActive && (
                <div className="relative z-10 p-[clamp(24px,3vw,36px)]">
                  {/* Header */}
                  <div className="reveal-child flex items-start justify-between mb-6">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] block mb-2" style={{ color: 'var(--vermillion)' }}>
                        {String(i + 1).padStart(2, '0')} / Case Study
                      </span>
                      <h3
                        className="font-display font-700 text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.035em] leading-[1]"
                        style={{ color: 'var(--ink)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mt-1.5" style={{ color: 'var(--vermillion)' }}>
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[50%] pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="reveal-child px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]"
                          style={{ color: 'var(--ink-muted)', border: '1px solid oklch(0.94 0.005 260 / 0.06)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <p className="reveal-child text-[0.9375rem] leading-[1.7] max-w-[58ch] mb-4" style={{ color: 'var(--ink-muted)' }}>
                    {project.caseStudy}
                  </p>

                  {/* Compact tech stack */}
                  <div className="reveal-child flex flex-wrap gap-1.5 mt-5">
                    {project.techStack.flatMap((g) => g.items).map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full font-mono text-[9px] tracking-[0.02em]"
                        style={{ color: 'var(--ink-muted)', border: '1px solid oklch(0.94 0.005 260 / 0.08)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reveal-child inline-flex items-center gap-2 mt-6 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300"
                      style={{ color: 'var(--vermillion)' }}
                      onClick={(e) => e.stopPropagation()}
                      data-cursor-hover
                    >
                      View Project
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SelectedWork;