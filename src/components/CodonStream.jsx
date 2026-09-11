import React, { useEffect, useRef } from 'react';

// Site-wide living background: glowing circuit-trace pattern on canvas.
// Fixed to the viewport, sits behind the whole page.
const CodonStream = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, DPR;
    let t = 0;
    let particles = [];
    let runners = [];
    let nextSpawn = 0;
    let raf;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    // Phones/tablets: this canvas redraws full-screen every frame, and
    // shadowBlur (used on nearly every shape below) is one of the most
    // expensive Canvas2D ops on mobile GPUs — many fall back to a slow
    // software blur for it. On coarse-pointer devices we render at native
    // resolution (not 2x), skip shadowBlur entirely (colors alone still
    // read as "glowing" against the dark background), thin out the
    // particle/runner counts, and cap the framerate — this keeps the same
    // effect recognizable while cutting the per-frame cost drastically.
    // If the user has asked for reduced motion, skip the animation loop
    // altogether and paint one static frame.
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shadowMul = isMobile ? 0 : 1;
    const densityDivisor = isMobile ? 6400 : 3200;
    const runnerDivisor = isMobile ? 100 : 55;
    const frameInterval = isMobile ? 2 : 1; // draw every Nth RAF tick

    const rnd = (a, b) => a + Math.random() * (b - a);
    const polyLen = (pts) => {
      let s = 0;
      for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      return s;
    };
    const drawPartial = (pts, frac) => {
      if (frac <= 0) return;
      let remaining = frac * polyLen(pts);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        const segLen = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (remaining <= 0) break;
        if (segLen <= remaining) {
          ctx.lineTo(pts[i][0], pts[i][1]);
          remaining -= segLen;
        } else {
          const f = segLen ? remaining / segLen : 0;
          ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f);
          remaining = 0;
        }
      }
      ctx.stroke();
    };
    const pointAtDistance = (pts, dist) => {
      let remaining = dist;
      for (let i = 1; i < pts.length; i++) {
        const segLen = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (segLen >= remaining) {
          const f = segLen ? remaining / segLen : 0;
          return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
        }
        remaining -= segLen;
      }
      return pts[pts.length - 1];
    };

    function spawnRunner() {
      const y = rnd(0, H);
      const l1 = rnd(45, 130), l2 = rnd(30, 120);
      const relPts = [[0, 0], [-l1, 0], [-l1, l2], [-l1 + rnd(-55, 75), l2]];
      runners.push({
        y,
        relPts,
        total: polyLen(relPts),
        xAnchor: W + rnd(0, 200),
        speed: rnd(0.7, 1.6),
        w: rnd(1.3, 2.8),
        pulse: rnd(0, 6.28),
        born: t,
        revealDur: rnd(16, 30),
        sparked: false,
        sparkT: 0
      });
    }

    function make() {
      particles = []; runners = [];

      for (let i = 0; i < (W * H) / densityDivisor; i++) {
        particles.push({
          x: rnd(0, W), y: rnd(0, H), r: rnd(0.8, 3.2),
          vx: rnd(0.4, 2.6), phase: rnd(0, 6.28), a: rnd(0.4, 0.95)
        });
      }

      const seedCount = Math.max(22, Math.floor(W / 65));
      for (let i = 0; i < seedCount; i++) {
        spawnRunner();
        const rn = runners[runners.length - 1];
        rn.xAnchor = rnd(-100, W + 100);
        rn.born = t - rn.revealDur;
      }
    }

    function resize() {
      W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, isMobile ? 1 : 2);
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      make();
    }

    function onMouseMove(e) {
      mouse.tx = (e.clientX / W) - 0.5;
      mouse.ty = (e.clientY / H) - 0.5;
    }

    function background() {
      ctx.fillStyle = '#010401'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.48, H * 0.5, 0, W * 0.48, H * 0.5, Math.max(W, H) * 0.75);
      g.addColorStop(0, 'rgba(0,255,55,0.10)');
      g.addColorStop(0.42, 'rgba(0,105,35,0.055)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function drawStream() {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      const pDepth = 85;
      const px = mouse.x * pDepth, py = mouse.y * pDepth;
      for (const q of particles) {
        const x = ((q.x + t * q.vx * 0.09) % W) + px;
        const y = q.y + Math.sin(t * 0.0022 + q.phase) * 12 + py;
        const twinkle = 0.6 + 0.4 * Math.sin(t * 0.03 + q.phase * 2);
        ctx.beginPath(); ctx.arc(x, y, q.r * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,255,140,${Math.min(1, q.a * twinkle)})`;
        ctx.shadowBlur = 14 * shadowMul; ctx.shadowColor = 'rgba(0,255,85,.85)'; ctx.fill();
      }

      const rDepth = 42;
      const rx = mouse.x * rDepth, ry = mouse.y * rDepth;

      const maxRunners = Math.max(isMobile ? 14 : 30, Math.floor(W / runnerDivisor));
      if (t >= nextSpawn && runners.length < maxRunners) {
        spawnRunner();
        nextSpawn = t + rnd(3, 9);
      }

      for (let i = runners.length - 1; i >= 0; i--) {
        const rn = runners[i];
        rn.xAnchor -= rn.speed;
        if (rn.xAnchor < -250) { runners.splice(i, 1); continue; }

        const fadeIn = Math.min(1, (W + 150 - rn.xAnchor) / 220);
        const fadeOut = Math.min(1, rn.xAnchor / (W * 0.3));
        const a = Math.max(0, Math.min(fadeIn, fadeOut));
        if (a <= 0.01) continue;

        const abs = rn.relPts.map((pt) => [rn.xAnchor + pt[0] + rx, rn.y + pt[1] + ry]);
        const age = t - rn.born;
        const reveal = Math.min(1, age / rn.revealDur);

        ctx.strokeStyle = `rgba(150,255,100,${0.68 * a})`;
        ctx.lineWidth = rn.w;
        ctx.shadowBlur = 13 * shadowMul;
        ctx.shadowColor = 'rgba(0,255,80,.8)';
        drawPartial(abs, reveal);

        if (reveal < 1) {
          const head = pointAtDistance(abs, reveal * rn.total);
          ctx.beginPath();
          ctx.arc(head[0], head[1], 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,255,180,${0.9 * a})`;
          ctx.shadowBlur = 18 * shadowMul;
          ctx.shadowColor = 'rgba(180,255,120,1)';
          ctx.fill();
        } else {
          if (!rn.sparked) { rn.sparked = true; rn.sparkT = t; }

          abs.forEach((pt) => {
            const pulse = 0.5 + 0.5 * Math.sin(t * 0.02 + rn.pulse);
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], 1.6 + pulse * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(190,255,130,${(0.5 + 0.5 * pulse) * a})`;
            ctx.shadowBlur = 14 * shadowMul;
            ctx.shadowColor = 'rgba(120,255,90,.95)';
            ctx.fill();
          });

          const flowPos = (t * 2.4 + rn.pulse * 30) % rn.total;
          const fp = pointAtDistance(abs, flowPos);
          ctx.beginPath();
          ctx.arc(fp[0], fp[1], 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230,255,200,${0.85 * a})`;
          ctx.shadowBlur = 16 * shadowMul;
          ctx.shadowColor = 'rgba(200,255,150,1)';
          ctx.fill();

          const sparkAge = t - rn.sparkT;
          if (sparkAge >= 0 && sparkAge < 22) {
            const end = abs[abs.length - 1];
            const sf = 1 - sparkAge / 22;
            ctx.beginPath();
            ctx.arc(end[0], end[1], 3 + (1 - sf) * 20, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(200,255,150,${sf * 0.8 * a})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 20 * shadowMul;
            ctx.shadowColor = 'rgba(180,255,120,1)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(end[0], end[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${sf * a})`;
            ctx.shadowBlur = 22 * shadowMul;
            ctx.shadowColor = 'rgba(200,255,160,1)';
            ctx.fill();
          }
        }
      }
    }

    let frameCount = 0;
    function animate() {
      frameCount++;
      // On mobile, only actually draw every Nth tick (t still advances every
      // tick so motion speed looks the same, just less frequently painted) —
      // this is a straightforward way to cut GPU/CPU work roughly in half
      // without changing any of the animation math above.
      if (frameCount % frameInterval === 0) {
        t++;
        background();
        drawStream();
      }
      raf = requestAnimationFrame(animate);
    }

    resize();
    if (reduceMotion) {
      // Respect the user's OS-level reduced-motion preference: paint one
      // static frame and never start the loop.
      background();
      drawStream();
    } else {
      animate();
    }

    addEventListener('resize', resize);
    addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(0,8,3,.08)' }}
      />
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 25%, rgba(0,0,0,.08) 62%, rgba(0,0,0,.42) 100%), linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.04))'
        }}
      />
    </>
  );
};

export default CodonStream;
