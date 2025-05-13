"use client";

// Define types for canvas animation
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Position {
  x: number;
  y: number;
}

// Simple canvas animation
export function renderCanvas(): (() => void) | undefined {
  try {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }

    // Set up initial state
    ctx.canvas.width = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight;
    
    // Variables for animation
    let running = true;
    let phase = Math.random() * 2 * Math.PI;
    let lines: Line[] = [];
    const pos: Position = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };
      // Configuration
    const config = {
      trails: 20,
      size: 50,
      friction: 0.5,
      dampening: 0.025,
      tension: 0.99
    };

    // Line class with proper TypeScript types
    class Line {
      spring: number;
      friction: number;
      nodes: Node[];
      
      constructor(spring: number) {
        this.spring = spring + 0.1 * Math.random() - 0.05;
        this.friction = config.friction + 0.01 * Math.random() - 0.005;
        this.nodes = [];
        
        for (let i = 0; i < config.size; i++) {
          this.nodes.push({
            x: pos.x,
            y: pos.y,
            vx: 0,
            vy: 0
          });
        }
      }
      
      update(): void {
        let spring = this.spring;
        let node = this.nodes[0];
        
        node.vx += (pos.x - node.x) * spring;
        node.vy += (pos.y - node.y) * spring;
        
        for (let i = 0; i < this.nodes.length; i++) {
          node = this.nodes[i];
          
          if (i > 0) {
            const prev = this.nodes[i - 1];
            node.vx += (prev.x - node.x) * spring;
            node.vy += (prev.y - node.y) * spring;
            node.vx += prev.vx * config.dampening;
            node.vy += prev.vy * config.dampening;
          }
          
          node.vx *= this.friction;
          node.vy *= this.friction;
          node.x += node.vx;
          node.y += node.vy;
          
          spring *= config.tension;
        }
      }
      
      draw(): void {
        if (!ctx) return;
        
        let x = this.nodes[0].x;
        let y = this.nodes[0].y;
        let nextX, nextY;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        for (let i = 1; i < this.nodes.length - 2; i++) {
          const currentNode = this.nodes[i];
          const nextNode = this.nodes[i + 1];
          
          nextX = (currentNode.x + nextNode.x) * 0.5;
          nextY = (currentNode.y + nextNode.y) * 0.5;
          
          ctx.quadraticCurveTo(currentNode.x, currentNode.y, nextX, nextY);
        }
        
        const i = this.nodes.length - 2;
        const currentNode = this.nodes[i];
        const nextNode = this.nodes[i + 1];
        
        ctx.quadraticCurveTo(currentNode.x, currentNode.y, nextNode.x, nextNode.y);
        ctx.stroke();
        ctx.closePath();
      }
    }    // Initialize lines
    for (let i = 0; i < config.trails; i++) {
      lines.push(new Line(0.45 + (i / config.trails) * 0.025));
    }

    // Handle mouse/touch movement
    function handleMouse(e: MouseEvent | TouchEvent): void {
      e.preventDefault();
      
      if ('touches' in e && e.touches.length > 0) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      } else if ('clientX' in e) {
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
    }

    // Set up event listeners
    document.addEventListener("mousemove", handleMouse as EventListener);
    document.addEventListener("touchmove", handleMouse as EventListener);
    document.addEventListener("touchstart", ((e: TouchEvent) => {
      if (e.touches.length === 1) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      }
    }) as EventListener);

    // Handle window resize
    window.addEventListener("resize", () => {
      if (!ctx) return;
      ctx.canvas.width = window.innerWidth - 20;
      ctx.canvas.height = window.innerHeight;
    });

    // Handle theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
          // Just trigger a redraw when theme changes
          render();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });    // Render function
    function render(): void {
      if (!running || !ctx) return;
      
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = "lighter";
      
      // Check if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Update phase for color change
      phase += 0.0015;
      const hue = Math.round(phase * 60 + 200) % 360;
      
      // Set line style based on theme
      ctx.strokeStyle = isDarkMode 
        ? `hsla(${hue},80%,70%,0.035)`
        : `hsla(${hue},100%,50%,0.025)`;
      ctx.lineWidth = 10;
      
      // Update and draw all lines
      for (let i = 0; i < lines.length; i++) {
        lines[i].update();
        lines[i].draw();
      }
      
      requestAnimationFrame(render);
    }

    // Start animation
    render();

    // Set up focus/blur handling
    window.addEventListener("blur", () => { running = false; });
    window.addEventListener("focus", () => { 
      if (!running) {
        running = true;
        render();
      }
    });
    
    // Position initially in the middle if no mouse movement
    pos.x = ctx.canvas.width / 2;
    pos.y = ctx.canvas.height / 2;
      return () => {
      // Cleanup
      running = false;
      document.removeEventListener("mousemove", handleMouse as EventListener);
      document.removeEventListener("touchmove", handleMouse as EventListener);
      observer.disconnect();
    };
  } catch (err) {
    console.error("Error in renderCanvas:", err);
  }
}
