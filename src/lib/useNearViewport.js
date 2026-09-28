import { useEffect, useState } from 'react';

// Returns true once `ref`'s element comes within `margin` of the viewport,
// then stays true. Gate a component's effect setup (GSAP, listeners, layout
// reads) on it so that cost doesn't all land in the one burst after the
// whole site mounts on "Enter". Only defer behaviour with this — never
// markup: the element must render at its real size from the first paint,
// or scroll anchoring makes content jump (why LazySection was removed).
export function useNearViewport(ref, margin = '1500px') {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: `${margin} 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);

  return near;
}
