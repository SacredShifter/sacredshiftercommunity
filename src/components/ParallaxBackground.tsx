import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxBackground = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallaxRef.current || !layer1Ref.current || !layer2Ref.current || !layer3Ref.current) return;

    // Create parallax timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Different speeds for different layers
    tl.to(layer1Ref.current, { yPercent: -50, ease: "none" }, 0)
      .to(layer2Ref.current, { yPercent: -30, ease: "none" }, 0)
      .to(layer3Ref.current, { yPercent: -20, ease: "none" }, 0);

    // Gentle rotation and scale on scroll
    gsap.to(layer1Ref.current, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none"
    });

    gsap.to(layer2Ref.current, {
      rotation: -360,
      duration: 40,
      repeat: -1,
      ease: "none"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={parallaxRef}
      className="absolute inset-0 w-full min-h-full pointer-events-none"
      style={{ zIndex: -1, height: '100%' }}
    >
      {/* Base Cosmic Portal Background */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 50% 50%, 
            hsl(300 100% 60% / 0.3) 0%, 
            hsl(240 100% 50% / 0.2) 20%, 
            transparent 40%),
          radial-gradient(circle at 50% 50%, 
            transparent 15%, 
            hsl(180 100% 50% / 0.1) 16%, 
            transparent 17%),
          radial-gradient(circle at 50% 50%, 
            transparent 25%, 
            hsl(120 100% 40% / 0.08) 26%, 
            transparent 27%),
          radial-gradient(circle at 50% 50%, 
            transparent 35%, 
            hsl(60 100% 50% / 0.06) 36%, 
            transparent 37%),
          radial-gradient(ellipse at center, 
            hsl(257 65% 15%) 0%, 
            hsl(250 70% 12%) 50%, 
            hsl(240 80% 8%) 100%)
        `,
        backgroundSize: '100% 100%'
      }} />
      
      {/* Layer 1 - Fastest */}
      <div 
        ref={layer1Ref}
        className="cosmic-grid-layer absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23A855F7' stroke-width='0.8' stroke-opacity='0.4'%3E%3Ccircle cx='50' cy='50' r='40'/%3E%3Ccircle cx='50' cy='50' r='25'/%3E%3Ccircle cx='50' cy='50' r='10'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Layer 2 - Medium */}
      <div 
        ref={layer2Ref}
        className="cosmic-grid-layer absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2300FFFF' stroke-width='0.6' stroke-opacity='0.3'%3E%3Cpolygon points='60,10 110,90 10,90'/%3E%3Cpolygon points='60,110 10,30 110,30'/%3E%3Ccircle cx='60' cy='60' r='50'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Layer 3 - Slowest */}
      <div 
        ref={layer3Ref}
        className="cosmic-grid-layer absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23FF00FF' stroke-width='0.4' stroke-opacity='0.2'%3E%3Ccircle cx='40' cy='40' r='35'/%3E%3Cpath d='M40 5 L75 40 L40 75 L5 40 Z'/%3E%3Cpath d='M40 15 L65 40 L40 65 L15 40 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
};