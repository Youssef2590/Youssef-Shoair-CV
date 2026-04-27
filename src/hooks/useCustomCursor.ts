import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export const useCustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number | null>(null);

  const updateCursor = useCallback(() => {
    if (cursorRef.current && followerRef.current) {
      gsap.to(cursorRef.current, {
        x: mousePos.current.x,
        y: mousePos.current.y,
        duration: 0.08,
        ease: 'power2.out',
      });
      
      gsap.to(followerRef.current, {
        x: mousePos.current.x,
        y: mousePos.current.y,
        duration: 0.15,
        ease: 'power2.out',
      });
    }
    rafId.current = requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    followerRef.current = follower;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Mouse down/up handlers
    const handleMouseDown = () => {
      cursor.classList.add('click');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('click');
    };

    // Hover handlers for interactive elements
    const handleMouseEnter = () => {
      isHovering.current = true;
      cursor.classList.add('hover');
      follower.classList.add('hover');
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    };

    // Add listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Start animation loop
    rafId.current = requestAnimationFrame(updateCursor);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      cursor.remove();
      follower.remove();
    };
  }, [updateCursor]);

  // Function to refresh hover listeners (call after DOM changes)
  const refreshListeners = useCallback(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseEnter = () => {
      cursorRef.current?.classList.add('hover');
      followerRef.current?.classList.add('hover');
    };

    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove('hover');
      followerRef.current?.classList.remove('hover');
    };

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach((el) => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
  }, []);

  return { refreshListeners };
};

export default useCustomCursor;