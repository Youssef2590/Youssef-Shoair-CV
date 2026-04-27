import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '6', label: 'Companies' },
  { value: '10+', label: 'Projects Shipped' },
];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const statsEl = statsRef.current;
    const portrait = portraitRef.current;

    if (!section || !headline || !body || !statsEl || !portrait) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Phase 1: ENTRANCE (0%-30%)
      scrollTl.fromTo(portrait,
        { y: '30vh', opacity: 0, scale: 1.08 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(headline,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.02
      );

      scrollTl.fromTo(body,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );

      scrollTl.fromTo(statsEl,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.12
      );

      // Phase 3: EXIT (70%-100%)
      scrollTl.fromTo(headline,
        { x: 0, opacity: 1 },
        { x: '-35vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(portrait,
        { y: 0, opacity: 1 },
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo([body, statsEl],
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned relative z-10"
      style={{ background: 'var(--surface)' }}
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 px-[6vw] py-[10vh] items-center">
        {/* Left: Text content */}
        <div className="relative z-10">
          <div ref={headlineRef} className="mb-10 will-change-transform">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-5" style={{ color: 'var(--vermillion)' }}>
              About
            </p>
            <h2 className="font-display font-900 headline-about tracking-[-0.04em] leading-[0.92]" style={{ color: 'var(--ink)' }}>
              Engineer
            </h2>
            <h2 className="font-display font-900 headline-about tracking-[-0.04em] leading-[0.92]" style={{ color: 'var(--ink-muted)' }}>
              who ships
            </h2>
          </div>

          <div ref={bodyRef} className="mb-10 will-change-transform">
            <p className="text-[17px] leading-[1.7] max-w-[52ch]" style={{ color: 'var(--ink-muted)' }}>
              I specialize in AI integration, agentic workflows, and scalable frontend architecture. 
              From orchestrating NVIDIA NemoClaw agents to building MCP servers, I bridge the gap 
              between sophisticated LLMs and interfaces people actually want to use.
            </p>
            <p className="text-[17px] leading-[1.7] max-w-[52ch] mt-5" style={{ color: 'var(--ink-muted)' }}>
              Currently pursuing an MA in Business Analytics at Asia Pacific University
              while engineering AI systems at Etiqa. BA in Computer Science (Data Analysis), 2024.
            </p>
          </div>

          {/* Stats: information density, not decoration */}
          <div ref={statsRef} className="flex gap-10 will-change-transform">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-900 text-[clamp(32px,4vw,56px)] tracking-[-0.04em] leading-none" style={{ color: 'var(--vermillion)' }}>
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] mt-2" style={{ color: 'var(--ink-muted)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Portrait, offset and cropped */}
        <div
          ref={portraitRef}
          className="hidden lg:block will-change-transform"
        >
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
            <img
              src="/about-portrait.jpg"
              alt="Youssef Shoair"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, oklch(0.15 0.005 260 / 0.5), transparent 40%)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;