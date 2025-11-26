import React, { useRef, useEffect, ReactNode, useState } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onRegister?: (rect: DOMRect) => void;
  noTilt?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onRegister, noTilt }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (onRegister && cardRef.current) {
        onRegister(cardRef.current.getBoundingClientRect());
        const observer = new ResizeObserver(() => {
            if(cardRef.current) onRegister(cardRef.current.getBoundingClientRect());
        });
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }
  }, [onRegister]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (noTilt || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-8 to 8 deg) - Subtler than before
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; 
    const rotateY = ((x - centerX) / centerX) * 5;

    // Apply 3D Transform
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Update Glare Position
    setGlarePos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    setGlarePos({ ...glarePos, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel rounded-3xl p-6 transition-transform duration-300 ease-out will-change-transform relative group ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glare Overlay */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none z-50 transition-opacity duration-500"
        style={{
            background: `radial-gradient(circle at ${glarePos.x}px ${glarePos.y}px, rgba(255,255,255,0.2) 0%, transparent 60%)`,
            opacity: glarePos.active ? 1 : 0
        }}
      />
      
      {/* Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none group-hover:border-white/40 transition-colors duration-500"></div>

      {/* Content Container - Slight Parallax for depth */}
      <div className="relative z-10" style={{ transform: noTilt ? 'none' : 'translateZ(20px)' }}>
          {children}
      </div>
    </div>
  );
};

export default GlassCard;