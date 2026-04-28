import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import HeroMesh from '../components/HeroMesh';

gsap.registerPlugin(ScrollTrigger);

const roles = [
  'Software Engineer',
  'AI Systems Architect',
  'Frontend Craftsman',
  'Full-Stack Developer',
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const firstNameWrapRef = useRef<HTMLDivElement>(null);
  const lastNameWrapRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const fallenChars = useRef(new Set<string>());
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCharClick = useCallback((e: React.MouseEvent<HTMLSpanElement>, word: string, index: number) => {
    const el = e.currentTarget;
    const key = `${word}-${index}`;

    // Already fallen
    if (fallenChars.current.has(key)) return;
    fallenChars.current.add(key);

    // Distance from letter to bottom of viewport
    const rect = el.getBoundingClientRect();
    const fallDistance = window.innerHeight - rect.top + 60;

    // Random physics for each letter
    const xDrift = (Math.random() - 0.5) * 120;
    const rotation = (Math.random() - 0.5) * 180;

    gsap.to(el, {
      y: `+=${fallDistance}`,
      x: xDrift,
      rotation,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.4,
      ease: 'power2.in', // gravity feel — accelerating
      onComplete: () => {
        el.style.visibility = 'hidden';
      },
    });

    // Reset all letters after both words have fully fallen
    const totalLetters = 'Youssef'.length + 'Shoair'.length;
    if (fallenChars.current.size >= totalLetters) {
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        // Reset all fallen chars
        const headline = headlineRef.current;
        if (!headline) return;
        const allChars = headline.querySelectorAll('.char') as NodeListOf<HTMLElement>;
        fallenChars.current.clear();
        allChars.forEach((c) => {
          c.style.visibility = 'visible';
          gsap.fromTo(c,
            { y: '-80%', opacity: 0, rotation: 0, x: 0 },
            { y: 0, opacity: 1, rotation: 0, x: 0, duration: 0.6, ease: 'expo.out', delay: Math.random() * 0.3 },
          );
        });
      }, 3000);
    }
  }, []);

  // Role ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const rightCol = rightColRef.current;
    const statusBar = statusBarRef.current;
    const bg = bgRef.current;
    const mesh = meshRef.current;

    if (!section || !headline || !rightCol || !statusBar || !bg || !mesh) return;

    const ctx = gsap.context(() => {
      const chars = headline.querySelectorAll('.char');
      const rightElements = rightCol.querySelectorAll('.reveal-item');
      const statusItems = statusBar.querySelectorAll('.status-item');

      // Initial state
      gsap.set(chars, { y: '110%', rotateX: 40 });
      gsap.set(rightElements, { y: 40, opacity: 0 });
      gsap.set(statusItems, { y: 20, opacity: 0 });
      gsap.set(bg, { opacity: 0 });
      gsap.set(mesh, { opacity: 0, scale: 1.15 });

      // Entrance timeline
      const entranceTl = gsap.timeline({ delay: 0.2 });

      entranceTl.to(bg, {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
      });

      entranceTl.to(mesh, {
        opacity: 1,
        scale: 1,
        duration: 2.0,
        ease: 'expo.out',
      }, '-=1.2');

      entranceTl.to(chars, {
        y: '0%',
        rotateX: 0,
        duration: 1.1,
        stagger: 0.04,
        ease: 'expo.out',
        onComplete: () => {
          // Remove overflow clipping so letters can fall freely
          if (firstNameWrapRef.current) firstNameWrapRef.current.style.overflow = 'visible';
          if (lastNameWrapRef.current) lastNameWrapRef.current.style.overflow = 'visible';
          if (sectionRef.current) sectionRef.current.style.overflow = 'visible';
        },
      }, '-=1.0');

      entranceTl.to(rightElements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
      }, '-=0.6');

      entranceTl.to(statusItems, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'expo.out',
      }, '-=0.5');

      // Scroll-driven exit
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(chars, { x: 0, opacity: 1 });
            gsap.set(rightElements, { y: 0, opacity: 1 });
            gsap.set(statusItems, { y: 0, opacity: 1 });
          },
        },
      });

      scrollTl.fromTo(headline,
        { x: 0, opacity: 1 },
        { x: '-45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(rightCol,
        { y: 0, opacity: 1 },
        { y: '20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(statusBar,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(bg,
        { scale: 1, y: 0 },
        { scale: 1.06, y: '-5vh', ease: 'none' },
        0.7
      );

      scrollTl.fromTo(mesh,
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 1.08, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned relative z-10"
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0" style={{ background: 'oklch(0.12 0.008 260)' }} />
        {/* Subtle gradient accent */}
        <div
          className="absolute top-0 right-0 w-[60vw] h-[60vh]"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, oklch(0.62 0.22 25 / 0.06), transparent 60%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[40vw] h-[40vh]"
          style={{
            background: 'radial-gradient(ellipse at 20% 80%, oklch(0.45 0.12 260 / 0.08), transparent 60%)',
          }}
        />
      </div>

      {/* Interactive mesh */}
      <div
        ref={meshRef}
        className="absolute inset-0 will-change-transform"
      >
        <HeroMesh />
      </div>

      {/* Content: Asymmetric split */}
      <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-end lg:items-center px-[6vw] pb-[16vh] lg:pb-0">
        {/* Left: Name as architecture */}
        <div ref={headlineRef} className="will-change-transform">
          <div ref={firstNameWrapRef} className="overflow-hidden mb-1">
            <h1 className="font-display headline-hero" style={{ color: 'var(--ink)', fontWeight: 500 }}>
              {'Youssef'.split('').map((char, i) => (
                <span
                  key={i}
                  className="char inline-block cursor-pointer select-none"
                  style={{ transformOrigin: 'bottom left' }}
                  onClick={(e) => handleCharClick(e, 'Youssef', i)}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>
          <div ref={lastNameWrapRef} className="overflow-hidden">
            <h1 className="font-display headline-hero" style={{ color: 'var(--vermillion)' }}>
              {'Shoair'.split('').map((char, i) => (
                <span
                  key={i}
                  className="char inline-block cursor-pointer select-none"
                  style={{ transformOrigin: 'bottom left' }}
                  onClick={(e) => handleCharClick(e, 'Shoair', i)}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Right: Role ticker + CTA + descriptor */}
        <div ref={rightColRef} className="lg:pl-[4vw] mt-8 lg:mt-0">
          <div className="reveal-item">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--ink-muted)' }}>
              Currently
            </p>
            <div className="h-[clamp(36px,4.5vw,58px)] overflow-hidden relative mb-6">
              {roles.map((role, i) => (
                <p
                  key={role}
                  className="font-display font-700 text-[clamp(1.375rem,3vw,2.625rem)] tracking-[-0.03em] leading-[1.35] absolute inset-0 whitespace-nowrap transition-[transform,opacity] duration-500"
                  style={{
                    color: 'var(--ink)',
                    transform: i === roleIndex ? 'translateY(0)' : i === (roleIndex - 1 + roles.length) % roles.length ? 'translateY(-110%)' : 'translateY(110%)',
                    opacity: i === roleIndex ? 1 : 0,
                  }}
                >
                  {role}
                </p>
              ))}
            </div>
          </div>

          <p className="reveal-item text-base leading-relaxed max-w-[42ch] mb-8" style={{ color: 'var(--ink-muted)' }}>
            Building AI-driven systems, agentic workflows, and interfaces that prove the craft. 4+ years shipping production code.
          </p>

          <button
            onClick={scrollToWork}
            className="reveal-item liquid-btn btn-liquid magnetic-button w-fit flex items-center gap-3 text-[15px] font-medium will-change-transform"
            data-cursor-hover
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--fill-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--fill-y', `${e.clientY - rect.top}px`);
            }}
          >
            <span>View selected work</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status bar: real info, not decoration */}
      <div
        ref={statusBarRef}
        className="absolute bottom-0 left-0 right-0 z-10 px-[6vw] py-5 sm:py-6 flex flex-wrap items-center gap-x-8 gap-y-2"
        style={{ borderTop: '1px solid oklch(0.94 0.005 260 / 0.06)' }}
      >
        <span className="status-item hidden sm:inline font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
          Kuala Lumpur, MY
        </span>
        <span className="status-item hidden sm:inline font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
          Etiqa Insurance & Takaful
        </span>
        <span className="status-item flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--vermillion)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--vermillion)' }} />
          Available for interesting problems
        </span>
        <span className="status-item ml-auto font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
          Scroll to explore
        </span>
      </div>
    </section>
  );
};

export default Hero;