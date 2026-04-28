import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#tech' },
  { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      setIsVisible(isMobile || scrollY > heroHeight * 0.5);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [isVisible]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-[6vw] py-5 opacity-0 -translate-y-full"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleClick(e, '#hero')}
            className="font-display font-700 text-xl transition-colors duration-300 relative z-[60]"
            style={{ color: 'var(--ink)' }}
            data-cursor-hover
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--vermillion)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
          >
            YS
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="link-underline font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300"
                style={{ color: 'var(--ink-muted)' }}
                data-cursor-hover
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button — 44x44 touch target */}
          <button
            className="md:hidden relative z-[60] flex items-center justify-center w-11 h-11 -mr-2"
            style={{ color: 'var(--ink)' }}
            data-cursor-hover
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="relative w-5 h-3.5">
              {/* Top line */}
              <span
                className="absolute left-0 w-full h-px transition-all duration-300"
                style={{
                  background: 'currentColor',
                  top: menuOpen ? '50%' : '0',
                  transform: menuOpen ? 'rotate(45deg)' : 'rotate(0)',
                }}
              />
              {/* Middle line */}
              <span
                className="absolute left-0 top-1/2 w-full h-px transition-all duration-300"
                style={{
                  background: 'currentColor',
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              />
              {/* Bottom line */}
              <span
                className="absolute left-0 w-full h-px transition-all duration-300"
                style={{
                  background: 'currentColor',
                  bottom: menuOpen ? 'calc(50% - 0.5px)' : '0',
                  transform: menuOpen ? 'rotate(-45deg)' : 'rotate(0)',
                }}
              />
            </div>
          </button>
        </div>

        {/* Background blur — only on desktop or when menu closed */}
        <div
          className="absolute inset-0 -z-10 backdrop-blur-md"
          style={{
            background: 'oklch(0.15 0.005 260 / 0.85)',
            borderBottom: '1px solid oklch(0.94 0.005 260 / 0.05)',
            marginTop: '-1px',
          }}
        />
      </nav>

      {/* Mobile Menu Overlay — outside nav for proper stacking */}
      <div
        className="md:hidden fixed inset-0 z-[55] flex flex-col items-start justify-center px-[6vw] transition-opacity duration-400"
        style={{
          background: 'oklch(0.12 0.008 260 / 0.98)',
          backdropFilter: 'blur(24px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="font-display font-700 text-[clamp(32px,8vw,48px)] tracking-[-0.03em] leading-[1.1] transition-all duration-300"
              style={{
                color: 'var(--ink)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
                opacity: menuOpen ? 1 : 0,
                transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms',
              }}
              tabIndex={menuOpen ? 0 : -1}
              data-cursor-hover
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--vermillion)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu footer */}
        <div
          className="absolute bottom-[6vh] left-[6vw] right-[6vw] flex items-center justify-between transition-all duration-300"
          style={{
            opacity: menuOpen ? 1 : 0,
            transitionDelay: menuOpen ? '350ms' : '0ms',
            borderTop: '1px solid oklch(0.94 0.005 260 / 0.06)',
            paddingTop: '1.5rem',
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
            Youssef Shoair
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--vermillion)' }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-muted)' }}>
              Available
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;