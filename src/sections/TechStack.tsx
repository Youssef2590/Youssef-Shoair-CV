import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  category: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  { category: 'AI / ML', skills: ['OpenAI', 'LLaMA', 'Gemma', 'NemoClaw', 'MCP', 'spaCy', 'NLTK', 'Agentic Workflows', 'LM Studio'] },
  { category: 'Frontend', skills: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'SCSS', 'HTML5', 'GSAP', 'Framer Motion', 'Bootstrap', 'UIKit'] },
  { category: 'Backend', skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Redis', 'REST APIs', 'SQL', 'MySQL'] },
  { category: 'DevOps / Tools', skills: ['Docker', 'GitHub Actions', 'Datadog', 'GrowthBook', 'Vercel', 'Webpack Module Federation', 'Figma', 'Jira', 'Git'] },
];

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<(HTMLDivElement | null)[]>([]);
  const eduRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // HoverGrid: proximity-based glow on skill tags
  const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
    const tags = gridRef.current?.querySelectorAll<HTMLElement>('.skill-tag');
    if (!tags) return;
    const { clientX, clientY } = e;

    tags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2);
      const maxDist = 180;
      const intensity = Math.max(0, 1 - dist / maxDist);

      tag.style.borderColor = `oklch(0.62 0.22 25 / ${(0.06 + intensity * 0.45).toFixed(2)})`;
      tag.style.color = intensity > 0.2
        ? `oklch(${(0.60 + intensity * 0.34).toFixed(2)} 0.005 260)`
        : 'var(--ink-muted)';
      tag.style.background = intensity > 0.1
        ? `oklch(0.62 0.22 25 / ${(intensity * 0.06).toFixed(3)})`
        : 'var(--surface-raise)';
    });
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    const tags = gridRef.current?.querySelectorAll<HTMLElement>('.skill-tag');
    if (!tags) return;
    tags.forEach((tag) => {
      tag.style.borderColor = 'oklch(0.94 0.005 260 / 0.08)';
      tag.style.color = 'var(--ink-muted)';
      tag.style.background = 'var(--surface-raise)';
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const groups = groupsRef.current.filter(Boolean);
    const edu = eduRef.current;

    if (!section || !header || groups.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: header, start: 'top 85%', end: 'top 55%', scrub: 0.4 },
        }
      );

      groups.forEach((group) => {
        if (!group) return;
        gsap.fromTo(group,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
            scrollTrigger: { trigger: group, start: 'top 90%', end: 'top 65%', scrub: 0.4 },
          }
        );
      });

      if (edu) {
        gsap.fromTo(edu,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
            scrollTrigger: { trigger: edu, start: 'top 90%', end: 'top 70%', scrub: 0.4 },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="relative z-20 py-[14vh] px-[6vw] overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-16 will-change-transform">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--vermillion)' }}>
          Stack
        </p>
        <h2 className="font-display font-700 headline-section" style={{ color: 'var(--ink)' }}>
          Tools of<br />the trade
        </h2>
      </div>

      {/* Skill groups: category as large label, skills as flowing tags */}
      <div
        ref={gridRef}
        className="space-y-14"
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
      >
        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.category}
            ref={(el) => { groupsRef.current[groupIndex] = el; }}
            className="will-change-transform"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-8 items-start">
              {/* Category label */}
              <p className="font-display font-700 text-[clamp(1.25rem,2.5vw,1.75rem)] tracking-[-0.02em] lg:pt-1" style={{ color: 'var(--ink)' }}>
                {group.category}
              </p>

              {/* Skills as flowing text */}
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag px-4 py-2 font-mono text-[12px] sm:text-[12px] tracking-[0.02em] rounded-full cursor-default"
                    style={{
                      color: 'var(--ink-muted)',
                      border: '1px solid oklch(0.94 0.005 260 / 0.08)',
                      background: 'var(--surface-raise)',
                      transition: 'border-color 0.25s, color 0.25s, background 0.25s',
                    }}
                    data-cursor-hover
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider between groups */}
            {groupIndex < skillGroups.length - 1 && (
              <div className="mt-10" style={{ borderBottom: '1px solid oklch(0.94 0.005 260 / 0.05)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Education: compact, side-by-side */}
      <div
        ref={eduRef}
        className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 will-change-transform"
      >
        {/* Current */}
        <div
          className="glow-card p-6 rounded-xl"
          style={{ border: '1px solid oklch(0.94 0.005 260 / 0.08)', background: 'var(--surface-raise)' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--vermillion)' }}>
                In Progress
              </p>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--vermillion)' }} />
            </div>
            <h3 className="font-display font-700 text-[1.125rem] tracking-[-0.02em] mb-1" style={{ color: 'var(--ink)' }}>
              MA Business Administration
            </h3>
            <p className="font-mono text-[11px] tracking-[0.05em]" style={{ color: 'var(--ink-muted)' }}>
              Business Analytics · Asia Pacific University
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] mt-2" style={{ color: 'var(--ink-muted)' }}>
              Expected June 2027
            </p>
          </div>
        </div>

        {/* Completed */}
        <div
          className="glow-card p-6 rounded-xl"
          style={{ border: '1px solid oklch(0.94 0.005 260 / 0.06)', background: 'var(--surface-raise)' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
          }}
        >
          <div className="relative z-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--ink-muted)' }}>
              Completed 2024
            </p>
            <h3 className="font-display font-700 text-[1.125rem] tracking-[-0.02em] mb-1" style={{ color: 'var(--ink)' }}>
              BA Computer Science
            </h3>
            <p className="font-mono text-[11px] tracking-[0.05em]" style={{ color: 'var(--ink-muted)' }}>
              Data Analysis · Asia Pacific University
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] mt-2" style={{ color: 'var(--ink-muted)' }}>
              Sept 2021 – Aug 2024
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;