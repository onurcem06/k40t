
import React, { useEffect, useRef } from 'react';

const ObsidianGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      label?: string;
      opacity: number;
    }

    const nodes: Node[] = [];
    const nodeCount = 100; // Nokta sayısı artırıldı
    const connectionDistance = 180; // Bağlantı mesafesi artırıldı
    
    const marketingTerms = [
      "ROAS", "KPI", "Meta Ads", "Google Ads", "CTR", 
      "Conversion", "B2B Strategy", "Growth", "Omnichannel", 
      "Data Analytics", "Performance", "Media Buy", "Creative"
    ];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      nodes.length = 0;

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        const isSpecial = i < marketingTerms.length;
        const radius = isSpecial ? 3 : 1.5;
        // Özel noktalara hafif turuncu dokunuşu
        const color = isSpecial ? '#f97316' : '#ffffff'; 
        const opacity = isSpecial ? 0.7 : 0.4;

        nodes.push({
          x,
          y,
          // Hareket hızı artırıldı (0.1'den 0.4'e)
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius,
          color,
          opacity,
          label: isSpecial ? marketingTerms[i] : undefined
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);

      // İnce bağlantı çizgileri
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(node => {
        ctx.globalAlpha = node.opacity;
        ctx.fillStyle = node.color;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        if (node.label) {
          ctx.font = '900 10px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          const textWidth = ctx.measureText(node.label).width;
          ctx.fillText(node.label, node.x - textWidth / 2, node.y + 20);
        }

        node.x += node.vx;
        node.y += node.vy;

        // Ekran dışına çıkınca diğer taraftan girme (wrap-around)
        if (node.x < -50) node.x = width + 50;
        if (node.x > width + 50) node.x = -50;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none bg-transparent"
      style={{ zIndex: 0 }}
    />
  );
};

export default ObsidianGraph;
