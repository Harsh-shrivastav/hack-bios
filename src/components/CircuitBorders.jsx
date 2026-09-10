import React, { useEffect, useRef } from 'react';

// Site-wide, transparent overlay that draws a glowing circuit-border around
// any element tagged `.circuit-target` — the "overclock on hover" effect.
// Split out from CodonStream so it keeps working no matter which section
// CodonStream itself is scoped to.
const CircuitBorders = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, DPR, t = 0, raf;

    function resize() {
      W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    const getBoundEls = () => [...document.querySelectorAll('.circuit-target')];
    const boundOn = new Map();
    const hoverOn = new Map();
    const hoverCleanup = [];
    let io;

    function setupObserver() {
      const els = getBoundEls();
      els.forEach((el) => {
        if (!boundOn.has(el)) boundOn.set(el, false);
        if (!hoverOn.has(el)) {
          hoverOn.set(el, false);
          const onEnter = () => hoverOn.set(el, true);
          const onLeave = () => hoverOn.set(el, false);
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
          hoverCleanup.push(() => {
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
          });
        }
      });
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver((entries) => {
          entries.forEach((e) => { if (e.isIntersecting) boundOn.set(e.target, true); });
        }, { threshold: 0.12 });
        els.forEach((el) => io.observe(el));
      } else {
        els.forEach((el) => boundOn.set(el, true));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const stub = 18, pad = 12;
      getBoundEls().forEach((el) => {
        if (!boundOn.get(el)) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > H + 50) return;
        const x0 = r.left - pad, y0 = r.top - pad, x1 = r.right + pad, y1 = r.bottom + pad;

        const boost = hoverOn.get(el) ? 1 : 0;
        const pulseSpeed = boost ? 0.09 : 0.02;
        const pulse = 0.5 + 0.5 * Math.sin(t * pulseSpeed + x0 * 0.01);

        ctx.strokeStyle = `rgba(57,255,20,${(0.55 + pulse * 0.3) + boost * 0.15})`;
        ctx.lineWidth = 2.6 + boost * 1.6;
        ctx.shadowBlur = 18 + boost * 16;
        ctx.shadowColor = 'rgba(0,255,0,1)';
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

        [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]].forEach(([cx, cy, dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + dx * stub, cy + dy * stub);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, (3 + pulse * 2.2) + boost * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120,255,80,${(0.65 + pulse * 0.35)})`;
          ctx.shadowBlur = 20 + boost * 14;
          ctx.shadowColor = 'rgba(0,255,0,1)';
          ctx.fill();
        });

        const w = x1 - x0, h = y1 - y0;
        const perim = 2 * (w + h);
        const travelSpeed = boost ? 5.5 : 1.4;
        const pos = (t * travelSpeed) % perim;
        let tx, ty;
        if (pos < w) { tx = x0 + pos; ty = y0; }
        else if (pos < w + h) { tx = x1; ty = y0 + (pos - w); }
        else if (pos < 2 * w + h) { tx = x1 - (pos - w - h); ty = y1; }
        else { tx = x0; ty = y1 - (pos - 2 * w - h); }

        ctx.beginPath();
        ctx.arc(tx, ty, 3 + boost * 2, 0, Math.PI * 2);
        ctx.fillStyle = boost ? 'rgba(220,255,200,1)' : 'rgba(150,255,110,0.9)';
        ctx.shadowBlur = 22 + boost * 12;
        ctx.shadowColor = 'rgba(0,255,0,1)';
        ctx.fill();
      });
    }

    function animate() {
      t++;
      draw();
      raf = requestAnimationFrame(animate);
    }

    resize();
    setupObserver();
    animate();
    addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      if (io) io.disconnect();
      hoverCleanup.forEach((fn) => fn());
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
};

export default CircuitBorders;
