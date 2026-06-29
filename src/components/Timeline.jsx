import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Stars, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { title: "Registrations Open", date: "TBA", desc: "Start assembling your squad. Registration portal officially opens." },
  { title: "Idea Submission", date: "TBA", desc: "Submit your initial pitch deck and project abstract." },
  { title: "Shortlisting", date: "TBA", desc: "Top teams will be filtered based on innovation and feasibility." },
  { title: "Hackathon Day 1", date: "TBA", desc: "Opening ceremony. Hacking begins! 36 hours non-stop." },
  { title: "Hackathon Day 2", date: "TBA", desc: "Mentoring rounds, final development phase, and hard deadline." },
  { title: "Results & Closing", date: "TBA", desc: "Final pitches to the jury, prize distribution, and closing." },
];

function AstronautModel({ activeStep, scrollProgress }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/astronaut.glb');
  const { actions } = useAnimations(animations, group);
  const emissiveMeshesRef = useRef([]);
  
  useEffect(() => {
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const action = actions[actionNames[0]];
      action.play();
      action.timeScale = 0.5;
    }
    
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        const mat = child.material.clone();
        if (mat.emissive) {
          mat.emissive = new THREE.Color(0x00ff41);
          mat.emissiveIntensity = 0.2;
          meshes.push(child);
        }
        child.material = mat;
      }
    });
    emissiveMeshesRef.current = meshes;
  }, [actions, scene]);

  useFrame((state) => {
    if (!group.current) return;
    
    // Smoothly rotate towards cursor (Parallax)
    const targetRotationY = (state.pointer.x * Math.PI) / 4;
    const targetRotationX = (-state.pointer.y * Math.PI) / 6;
    
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y, 
      targetRotationY + (scrollProgress.current * Math.PI * 0.5), 
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    
    // Vertical sync with scroll progress
    const verticalTarget = 2.5 - (scrollProgress.current * 5.5);
    
    // Horizontal offset: Move AWAY from the active card
    // If step is even (left), move astronaut right (+1.5). If odd (right), move left (-1.5).
    const isEvenStep = activeStep % 2 === 0;
    const horizontalTarget = isEvenStep ? 1.5 : -1.5;

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      verticalTarget,
      0.08
    );

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      horizontalTarget,
      0.06
    );

    // Subtle glow intensity change on "hover" (cursor proximity) or movement
    const intensity = 0.2 + (Math.abs(state.pointer.x) + Math.abs(state.pointer.y)) * 0.3;
    emissiveMeshesRef.current.forEach((child) => {
      if (child.material && child.material.emissiveIntensity !== undefined) {
        child.material.emissiveIntensity = THREE.MathUtils.lerp(child.material.emissiveIntensity, intensity, 0.1);
      }
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
      <primitive ref={group} object={scene} scale={1.2} position={[0, 0, 0]} />
    </Float>
  );
}

const Timeline = () => {
  const containerRef = useRef(null);
  const scrollProgress = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        }
      });

      const items = gsap.utils.toArray('.timeline-item');
      items.forEach((item, index) => {
        const textElements = item.querySelectorAll('.animate-text');
        
        // Initial state for text
        gsap.set(textElements, { opacity: 0, y: 10 });

        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 30%",
          onEnter: () => {
            setActiveStep(index);
            gsap.to(item, { 
              opacity: 1, 
              scale: 1.05, 
              duration: 0.6, 
              borderColor: '#00ff41', 
              boxShadow: '0 0 30px rgba(0, 255, 65, 0.4)' 
            });
            gsap.to(textElements, { 
              opacity: 1, 
              y: 0, 
              stagger: 0.1, 
              duration: 0.8, 
              ease: 'power3.out' 
            });
          },
          onEnterBack: () => {
            setActiveStep(index);
          },
          onLeave: () => {
             gsap.to(item, { opacity: 0.3, scale: 1, duration: 0.5, borderColor: 'rgba(0, 255, 65, 0.1)', boxShadow: 'none' });
          },
          onLeaveBack: () => {
            gsap.to(item, { opacity: 0.3, scale: 1, duration: 0.5, borderColor: 'rgba(0, 255, 65, 0.1)', boxShadow: 'none' });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" className="relative bg-[#020502]" ref={containerRef}>
      
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020502] via-transparent to-[#020502] z-10 pointer-events-none"></div>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full">
          <color attach="background" args={['#020502']} />
          <ambientLight intensity={0.4} />
          
          <pointLight position={[5, 10, 5]} color="#00ff41" intensity={80} />
          <spotLight position={[0, 5, 10]} angle={0.5} penumbra={1} color="#00ff41" intensity={50} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
          
          <Suspense fallback={null}>
            <AstronautModel activeStep={activeStep} scrollProgress={scrollProgress} />
            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={15} blur={2} far={4} color="#00ff41" />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 -mt-[100vh] pt-24 pb-32">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4 glitch text-white uppercase tracking-tighter" data-text="/ EXPEDITION_LOG">
            <span className="text-[#00ff41]">/</span> EXPEDITION_LOG
          </h2>
          <p className="text-[#00ff41] font-mono text-sm tracking-[0.3em] opacity-70">
            SYSTEM_STATUS: TRAVERSING_TIMELINE...
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col gap-40">
          {stages.map((stage, index) => {
            const isEven = index % 2 === 0;
            const isActive = activeStep === index;
            
            return (
              <div 
                key={index} 
                className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`timeline-item w-full md:w-[42%] bg-[#0a120a]/60 backdrop-blur-xl border border-[#00ff41]/20 p-10 opacity-30 transition-all duration-700 relative overflow-hidden group shadow-2xl`}
                >
                  <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1.5 h-full transition-all duration-1000 ${isActive ? 'bg-[#00ff41] shadow-[0_0_20px_#00ff41]' : 'bg-transparent'}`}></div>
                  
                  <div className="absolute inset-0 bg-[#00ff41]/0 group-hover:bg-[#00ff41]/5 transition-colors duration-500 pointer-events-none"></div>

                  <span className={`animate-text inline-block mb-6 font-mono text-xs uppercase tracking-[0.2em] px-4 py-1.5 border transition-all duration-500 rounded-sm ${isActive ? 'bg-[#00ff41] text-[#050a05] border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]' : 'bg-transparent text-[#00ff41] border-[#00ff41]/30'}`}>
                    {stage.date} - INIT_PROTOCOL
                  </span>
                  
                  <h3 className={`animate-text text-3xl md:text-4xl font-mono mb-4 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {stage.title}
                  </h3>
                  
                  <p className="animate-text text-gray-400 font-sans text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {stage.desc}
                  </p>

                  {/* Decorative Elements */}
                  <div className="mt-8 flex gap-2 opacity-30">
                    <div className="w-8 h-[1px] bg-[#00ff41]"></div>
                    <div className="w-2 h-[1px] bg-[#00ff41]"></div>
                    <div className="w-2 h-[1px] bg-[#00ff41]"></div>
                  </div>

                  <div className={`absolute -z-10 bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-[#00ff41]/10 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


useGLTF.preload('/astronaut.glb');

export default Timeline;
