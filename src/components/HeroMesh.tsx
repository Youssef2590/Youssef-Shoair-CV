import { useEffect, useRef, useCallback } from 'react';

/*
 * Interactive flow-field particle system.
 * – Noise-based vector field drives particle motion
 * – Cursor creates a vortex that swirls particles
 * – Click sends a radial shockwave
 * – Particles leave fading ribbon trails
 * – Vermillion near cursor, cool grey elsewhere
 */

// ── Noise (value noise with smooth interpolation) ────────────────
const PERM = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : -x;
  const v = h === 0 || h === 3 ? y : -y;
  return u + v;
}
function noise2D(x: number, y: number) {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[xi] + yi];
  const ab = PERM[PERM[xi] + yi + 1];
  const ba = PERM[PERM[xi + 1] + yi];
  const bb = PERM[PERM[xi + 1] + yi + 1];
  return lerpN(
    lerpN(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerpN(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  );
}

// ── Config ───────────────────────────────────────────────────────
const PARTICLE_COUNT = 300;
const TRAIL_LENGTH = 36;
const SPEED = 1.6;
const NOISE_SCALE = 0.0022;
const NOISE_SPEED = 0.00018;
const MOUSE_RADIUS = 320;
const VORTEX_STRENGTH = 0.16;
const SHOCKWAVE_SPEED = 7;
const SHOCKWAVE_LIFE = 45;

const GREY_RGB = [170, 170, 178] as const;
const VERMILLION_RGB = [238, 52, 59] as const;
const WARM_RGB = [255, 100, 90] as const;

interface Particle {
  x: number;
  y: number;
  trail: [number, number][];
  speed: number;
  hue: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  life: number;
}

const HeroMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const shockwavesRef = useRef<Shockwave[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const spawnParticle = useCallback((w: number, h: number): Particle => {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      trail: [],
      speed: SPEED * (0.5 + Math.random() * 0.8),
      hue: Math.random(),
    };
  }, []);

  const initParticles = useCallback(
    (w: number, h: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(spawnParticle(w, h));
      }
      particlesRef.current = particles;
    },
    [spawnParticle],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };

      if (particlesRef.current.length !== PARTICLE_COUNT) {
        initParticles(w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Use window-level events so the z-10 content layer doesn't block interaction
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only track if cursor is within the hero canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        shockwavesRef.current.push({
          x,
          y,
          radius: 0,
          life: SHOCKWAVE_LIFE,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick);

    let time = 0;

    const draw = () => {
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const shockwaves = shockwavesRef.current;

      time++;
      const noiseTime = time * NOISE_SPEED;

      ctx.clearRect(0, 0, w, h);

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += SHOCKWAVE_SPEED;
        sw.life--;
        if (sw.life <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        const alpha = (sw.life / SHOCKWAVE_LIFE) * 0.4;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${VERMILLION_RGB[0]},${VERMILLION_RGB[1]},${VERMILLION_RGB[2]},${alpha})`;
        ctx.lineWidth = 3 * (sw.life / SHOCKWAVE_LIFE);
        ctx.stroke();
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Flow field angle from noise
        let angle: number;
        if (prefersReducedMotion) {
          angle = Math.PI * 0.25;
        } else {
          const n = noise2D(p.x * NOISE_SCALE, p.y * NOISE_SCALE + noiseTime);
          angle = n * Math.PI * 4;
        }

        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed;

        // Cursor vortex
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let mouseT = 0;

        if (dist < MOUSE_RADIUS && dist > 1) {
          mouseT = 1 - dist / MOUSE_RADIUS;
          const t = mouseT * mouseT;

          const nx = dx / dist;
          const ny = dy / dist;
          const tx = -ny;
          const ty = nx;

          vx += tx * VORTEX_STRENGTH * t * 60;
          vy += ty * VORTEX_STRENGTH * t * 60;
          vx -= nx * t * 0.4;
          vy -= ny * t * 0.4;
        }

        // Shockwave push
        for (const sw of shockwaves) {
          const sdx = p.x - sw.x;
          const sdy = p.y - sw.y;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
          const ringDist = Math.abs(sDist - sw.radius);
          if (ringDist < 40) {
            const push = (1 - ringDist / 40) * (sw.life / SHOCKWAVE_LIFE) * 4;
            const sn = sDist > 0.1 ? 1 / sDist : 0;
            vx += sdx * sn * push;
            vy += sdy * sn * push;
          }
        }

        p.x += vx;
        p.y += vy;

        p.trail.push([p.x, p.y]);
        if (p.trail.length > TRAIL_LENGTH) {
          p.trail.shift();
        }

        // Wrap around edges
        const margin = 20;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Reset trail on wrap to prevent cross-screen lines
        if (p.trail.length > 1) {
          const last = p.trail[p.trail.length - 1];
          const prev = p.trail[p.trail.length - 2];
          if (
            Math.abs(last[0] - prev[0]) > w * 0.5 ||
            Math.abs(last[1] - prev[1]) > h * 0.5
          ) {
            p.trail.length = 0;
            p.trail.push([p.x, p.y]);
          }
        }

        // Draw trail
        if (p.trail.length < 2) continue;

        const colorT = Math.min(1, mouseT * 2);
        const isAccent = p.hue < 0.25;

        for (let j = 1; j < p.trail.length; j++) {
          const segT = j / p.trail.length;
          const alpha =
            segT * segT * (colorT > 0.1 ? 0.55 + colorT * 0.4 : 0.32);

          let r: number, g: number, b: number;
          if (colorT > 0.05) {
            const base = isAccent ? WARM_RGB : VERMILLION_RGB;
            const blend = colorT * segT;
            r = Math.round(
              GREY_RGB[0] + (base[0] - GREY_RGB[0]) * blend,
            );
            g = Math.round(
              GREY_RGB[1] + (base[1] - GREY_RGB[1]) * blend,
            );
            b = Math.round(
              GREY_RGB[2] + (base[2] - GREY_RGB[2]) * blend,
            );
          } else {
            [r, g, b] = GREY_RGB;
          }

          ctx.beginPath();
          ctx.moveTo(p.trail[j - 1][0], p.trail[j - 1][1]);
          ctx.lineTo(p.trail[j][0], p.trail[j][1]);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = segT * (1.0 + colorT * 1.2);
          ctx.stroke();
        }

        // Head dot near cursor
        if (mouseT > 0.05) {
          const headAlpha = mouseT * 0.85;
          const dotR = 1.2 + mouseT * 2;
          const base = isAccent ? WARM_RGB : VERMILLION_RGB;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${headAlpha})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
};

export default HeroMesh;
