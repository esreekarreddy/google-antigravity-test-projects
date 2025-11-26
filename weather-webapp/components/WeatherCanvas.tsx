import React, { useRef, useEffect } from 'react';
import { WeatherState } from '../types';

interface WeatherCanvasProps {
  weatherState: WeatherState;
  cardRects: DOMRect[];
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'rain' | 'snow' | 'splash' | 'star' | 'cloud' | 'dust';
  size: number;

  constructor(w: number, h: number, type: 'rain' | 'snow' | 'splash' | 'star' | 'cloud' | 'dust', startX?: number, startY?: number) {
    this.type = type;
    this.x = startX ?? Math.random() * w;
    this.y = startY ?? (type === 'splash' ? 0 : Math.random() * h - h); 
    this.size = Math.random();

    if (type === 'rain') {
      this.vx = 0;
      this.vy = Math.random() * 8 + 15;
      this.life = 100;
      this.y = Math.random() * -h; 
    } else if (type === 'snow') {
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 1.5 + 0.5;
      this.life = 100;
      this.y = Math.random() * -h;
      this.size = Math.random() * 3 + 1;
    } else if (type === 'splash') {
      this.vx = (Math.random() - 0.5) * 4; // Explode out
      this.vy = -Math.random() * 3; // Upwards first
      this.life = 15 + Math.random() * 10;
      this.size = Math.random() * 2;
    } else if (type === 'star') {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = 0;
      this.vy = 0;
      this.life = Math.random() * 100;
      this.size = Math.random() * 1.5;
    } else if (type === 'dust') {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 100;
        this.size = Math.random() * 2;
    } else {
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
    }
    this.maxLife = this.life;
  }

  update(w: number, h: number, cardRects: DOMRect[], mouseX: number, mouseY: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150 && (this.type === 'rain' || this.type === 'snow' || this.type === 'dust')) {
        const force = (150 - dist) / 150;
        this.vx += (dx / dist) * force * 0.5;
        this.vy += (dy / dist) * force * 0.5;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.type === 'rain') {
      this.vy += 0.1;
      this.vx *= 0.99;

      // Improved Collision Box
      for (let rect of cardRects) {
        // Hit top edge of card (+/- 5px tolerance)
        if (this.x >= rect.left && this.x <= rect.right && Math.abs(this.y - rect.top) < 15) {
          return 'hit';
        }
      }

      if (this.y > h) this.y = -10;
    } else if (this.type === 'snow') {
      this.x += Math.sin(this.y * 0.02) * 0.5;
      
      for (let rect of cardRects) {
        if (this.x >= rect.left && this.x <= rect.right && Math.abs(this.y - rect.top) < 5) {
           this.life -= 2; 
           this.vy = 0; 
           if(this.life <= 0) {
               this.y = -10; 
               this.life = 100;
               this.vy = Math.random() * 1.5 + 0.5;
           }
           return 'stick';
        }
      }
      
      if (this.y > h) this.y = -10;
    } else if (this.type === 'splash') {
      this.vy += 0.2; // gravity
      this.life--;
    } else if (this.type === 'star') {
        this.life += 0.05;
    } else if (this.type === 'dust') {
        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        if (this.y < 0) this.y = h;
    }

    if (this.type === 'splash' && this.life <= 0) return 'dead';
    return 'alive';
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'rain') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx, this.y + 15);
      ctx.strokeStyle = `rgba(174, 194, 224, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (this.type === 'snow') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.8, this.life / 50)})`;
      ctx.fill();
    } else if (this.type === 'splash') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${this.life / 20})`; // Brighter splash
      ctx.fill();
    } else if (this.type === 'star') {
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(this.life));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    } else if (this.type === 'dust') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 220, 0.3)`;
        ctx.fill();
    }
  }
}

const WeatherCanvas: React.FC<WeatherCanvasProps> = ({ weatherState, cardRects }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    particles.current = [];
    const w = canvas.width;
    const h = canvas.height;

    let count = 0;
    let type: 'rain' | 'snow' | 'splash' | 'star' | 'dust' = 'rain';

    if (weatherState === WeatherState.Rain) { count = 300; type = 'rain'; }
    else if (weatherState === WeatherState.Storm) { count = 500; type = 'rain'; }
    else if (weatherState === WeatherState.Snow) { count = 200; type = 'snow'; }
    else if (weatherState === WeatherState.ClearNight) { count = 150; type = 'star'; }
    else if (weatherState === WeatherState.Sunny) { count = 50; type = 'dust'; }

    for (let i = 0; i < count; i++) {
        particles.current.push(new Particle(w, h, type));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (weatherState === WeatherState.Storm && Math.random() > 0.99) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
          ctx.fillRect(0, 0, w, h);
      }

      const newParticles: Particle[] = [];
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      
      for (const p of particles.current) {
        const status = p.update(canvas.width, canvas.height, cardRects, mX, mY);
        
        if (status === 'hit') {
           // Spawn MORE splashes for better visibility
           for(let k=0; k<5; k++) {
               newParticles.push(new Particle(w, h, 'splash', p.x, p.y));
           }
           p.y = -10; 
           p.vy = Math.random() * 8 + 15; 
        } else if (status === 'dead') {
           continue; 
        }
        
        p.draw(ctx);
        newParticles.push(p);
      }

      particles.current = newParticles;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [weatherState, cardRects]);

  useEffect(() => {
    const handleResize = () => {
        if(canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default WeatherCanvas;