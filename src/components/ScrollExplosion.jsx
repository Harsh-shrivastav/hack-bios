import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ExplosionModel({ progress }) {
  const ref = useRef();
  const particleCount = 3000;

  // Use useMemo for geometry generation to avoid recreation
  const [positions, explodedPositions, randomFactors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const expl = new Float32Array(particleCount * 3);
    const rand = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Golden ratio spiral for even sphere distribution
        const p = i / particleCount;
        const phi = Math.acos(1 - 2 * p);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const radius = 2;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Exploded state (random outward displacement based on normal)
        const distance = 5 + Math.random() * 15;
        expl[i * 3] = x * distance;
        expl[i * 3 + 1] = y * distance;
        expl[i * 3 + 2] = z * distance;

        rand[i] = Math.random();
    }
    return [pos, expl, rand];
  }, [particleCount]);

  // We need to mutate the positions matrix every frame based on progress
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Rotate slowly
    ref.current.rotation.y += delta * 0.2;
    ref.current.rotation.x += delta * 0.1;

    const p = progress.current; // 0 to 1 value from scroll
    const positionsAttribute = ref.current.geometry.attributes.position;

    // A simple sine wave mapping to make it explode in the middle of the scroll and reassemble at the end
    // p goes 0 -> 1. We want 0 -> 1 -> 0 explosion factor.
    // Let's make factor = Math.sin(p * Math.PI);
    const explosionFactor = Math.sin(p * Math.PI);

    for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        
        // Add some noise based on time
        const noiseX = Math.sin(state.clock.elapsedTime * 2 + randomFactors[i] * 10) * 0.1 * explosionFactor;
        const noiseY = Math.cos(state.clock.elapsedTime * 2 + randomFactors[i] * 10) * 0.1 * explosionFactor;
        const noiseZ = Math.sin(state.clock.elapsedTime * 3 + randomFactors[i] * 10) * 0.1 * explosionFactor;

        currentPositions[idx] = positions[idx] + (explodedPositions[idx] - positions[idx]) * explosionFactor + noiseX;
        currentPositions[idx + 1] = positions[idx + 1] + (explodedPositions[idx + 1] - positions[idx + 1]) * explosionFactor + noiseY;
        currentPositions[idx + 2] = positions[idx + 2] + (explodedPositions[idx + 2] - positions[idx + 2]) * explosionFactor + noiseZ;
    }

    positionsAttribute.array.set(currentPositions);
    positionsAttribute.needsUpdate = true;
  });

  return (
    <Points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#00ff41"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

const ScrollExplosion = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const progressRef = useRef(0);

    useEffect(() => {
        let st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "=300%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                progressRef.current = self.progress;
                // Fade out text in the middle
                if(contentRef.current) {
                  const factor = Math.abs(Math.cos(self.progress * Math.PI));
                  contentRef.current.style.opacity = factor;
                  contentRef.current.style.transform = `scale(${0.8 + 0.2 * factor}) translateY(${self.progress * 50}px)`;
                }
            }
        });

        return () => {
            st.kill();
        };
    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full relative bg-[#050a05] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <ExplosionModel progress={progressRef} />
                </Canvas>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div ref={contentRef} className="text-center transition-all duration-300">
                    <h2 className="text-5xl md:text-7xl font-bold font-mono text-white mb-4 uppercase tracking-tighter" style={{ textShadow: "0 0 20px rgba(0, 255, 65, 0.8)"}}>
                        Shatter <br/> Boundaries.
                    </h2>
                    <p className="text-[#00e5ff] font-mono text-xl md:text-2xl tracking-[0.2em] uppercase">Rebuild the Future.</p>
                </div>
            </div>
        </section>
    );
};

export default ScrollExplosion;
