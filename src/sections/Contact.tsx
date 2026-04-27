import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Email', href: 'mailto:youssef_shoair@outlook.com', external: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/youssef-shoair-821361173', external: true },
  { label: 'GitHub', href: 'https://github.com', external: true },
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const content = contentRef.current;

    if (!section || !headline || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headline,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 40%', scrub: 0.4 },
        }
      );

      gsap.fromTo(content,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 35%', scrub: 0.4 },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 py-[16vh] px-[6vw]"
      style={{ background: 'var(--surface)' }}
    >
      <div className="max-w-5xl">
        {/* Label */}
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-6" style={{ color: 'var(--vermillion)' }}>
          Contact
        </p>

        {/* Big headline as CTA */}
        <h2
          ref={headlineRef}
          className="font-display font-900 text-[clamp(40px,8vw,120px)] tracking-[-0.04em] leading-[0.92] mb-10 will-change-transform"
          style={{ color: 'var(--ink)' }}
        >
          Let's build<br />
          <span style={{ color: 'var(--vermillion)' }}>together</span>
        </h2>

        {/* Content row */}
        <div ref={contentRef} className="will-change-transform grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <p className="text-[17px] leading-[1.7] max-w-[48ch] mb-8" style={{ color: 'var(--ink-muted)' }}>
              Open for collaborations, contracts, and interesting problems.
              Based in Kuala Lumpur, working globally.
            </p>

            {/* Links as big text */}
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3 w-fit transition-colors duration-300"
                  style={{ color: 'var(--ink-muted)' }}
                  data-cursor-hover
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
                >
                  <span className="font-display font-700 text-[clamp(20px,3vw,32px)] tracking-[-0.02em]">
                    {link.label}
                  </span>
                  {link.external && (
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all duration-300" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right: availability */}
          <div className="flex items-center gap-3 pb-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--vermillion)' }} />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
              Available for work
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-[12vh] pt-8 flex items-center justify-between" style={{ borderTop: '1px solid oklch(0.94 0.005 260 / 0.06)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-muted)' }}>
          © 2025 Youssef Shoair
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-muted)' }}>
          Built with React & GSAP
        </p>
      </div>
    </section>
  );
};

export default Contact;