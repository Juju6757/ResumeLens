import { useEffect, useRef } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    // Adjust number of particles based on screen size
    const particleCount = Math.min(Math.floor(window.innerWidth / 12), 100);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // HIGH SPEED: higher velocity values
        vx: (Math.random() - 0.5) * 4.5,
        vy: (Math.random() - 0.5) * 4.5,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use a neutral color that works in both light/dark due to opacity handling
      ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particleCount; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles if they are close enough
          if (dist < 140) {
            ctx.beginPath();
            // Opacity of line depends on distance
            const opacity = 1 - (dist / 140);
            ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.4})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-[0.25] dark:opacity-[0.15]" />;
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
      
      {/* High-Speed Connected Graph Pattern */}
      <ParticleNetwork />

      {/* Animated Blobs (Sped up) */}
      <div 
        className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:mix-blend-screen dark:bg-primary/10"
        style={{ animationDuration: '3s' }}
      ></div>
      <div 
        className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:mix-blend-screen dark:bg-primary/10"
        style={{ animationDuration: '3s', animationDelay: '1s' }}
      ></div>
      <div 
        className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:mix-blend-screen dark:bg-primary/10"
        style={{ animationDuration: '3s', animationDelay: '2s' }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
