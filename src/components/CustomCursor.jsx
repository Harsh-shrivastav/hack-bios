import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Touch devices have no mouse to track — mounting the RAF loop and
    // DOM writes below would just burn battery/CPU every frame for a
    // cursor that can never be seen. Bail out before any of that starts.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.interactive') || 
        (window.getComputedStyle(target).cursor === 'pointer')
      ) {
        if (ringRef.current) ringRef.current.classList.add('hovering');
      } else {
        if (ringRef.current) ringRef.current.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    let rafId;
    const update = () => {
      // Smooth lerp for the cursor ring
      const delay = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * delay;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * delay;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="custom-cursor-dot" ref={dotRef}></div>
      <div id="custom-cursor-ring" ref={ringRef}></div>
    </>
  );
};

export default CustomCursor;
