import { useEffect, useRef } from 'react';

export default function StarfieldBackground({ starCount = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create stars with depth/layers for parallax scrolling
    stars = Array.from({ length: starCount }, () => {
      const depth = Math.random(); // 0 (far) to 1 (near)
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: depth * 1.5 + 0.1,
        depth: depth,
        alpha: Math.random(),
        twinkleSpeed: (Math.random() * 0.01 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        // Color mapping: white, soft blue, soft purple
        color: depth > 0.85 
          ? 'rgba(96, 165, 250, ' // soft blue
          : depth > 0.7 
            ? 'rgba(139, 92, 246, ' // soft purple
            : 'rgba(255, 255, 255, ' // white
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.0004;

      // Volumetric floating nebula layers
      // Purple nebula (top right)
      const nebulaX1 = canvas.width * (0.75 + Math.sin(time * 0.5) * 0.08);
      const nebulaY1 = canvas.height * (0.25 + Math.cos(time * 0.4) * 0.08);
      const grad1 = ctx.createRadialGradient(nebulaX1, nebulaY1, 0, nebulaX1, nebulaY1, canvas.width * 0.45);
      grad1.addColorStop(0, 'rgba(139, 92, 246, 0.12)'); // soft purple
      grad1.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blue nebula (bottom left)
      const nebulaX2 = canvas.width * (0.2 + Math.cos(time * 0.3) * 0.08);
      const nebulaY2 = canvas.height * (0.75 + Math.sin(time * 0.5) * 0.08);
      const grad2 = ctx.createRadialGradient(nebulaX2, nebulaY2, 0, nebulaX2, nebulaY2, canvas.width * 0.4);
      grad2.addColorStop(0, 'rgba(59, 130, 246, 0.10)'); // soft blue
      grad2.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach((s) => {
        // Slow vertical drift (parallax scrolling)
        s.y -= (s.depth * 0.15 + 0.05);
        if (s.y < 0) {
          s.y = canvas.height;
          s.x = Math.random() * canvas.width;
        }

        // Twinkle
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) {
          s.twinkleSpeed *= -1;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + Math.min(1, Math.max(0.1, s.alpha)) + ')';
        ctx.fill();

        // Add glow to bright/close stars
        if (s.depth > 0.9) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = s.color + (Math.min(1, Math.max(0.1, s.alpha)) * 0.25) + ')';
          ctx.fill();
        }
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #000000 0%, #07070a 40%, #0f0f15 75%, #000000 100%)' }}
    />
  );
}
