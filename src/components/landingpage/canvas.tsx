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

interface ThemeColors {
  light: {
    primary: string;
    secondary: string;
    background: string;
  };
  dark: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface CanvasOptions {
  prominent?: boolean;
  themeColors?: ThemeColors;
}

// Default theme colors
const defaultThemeColors: ThemeColors = {
  light: {
    primary: '#DE5499',
    secondary: '#E99F4C',
    background: '#EDDCD9'
  },
  dark: {
    primary: '#DE5499',
    secondary: '#E99F4C',
    background: '#264143'
  }
};

// Enhanced canvas animation
export function renderCanvas(
  canvasElement?: HTMLCanvasElement, 
  options?: CanvasOptions
): (() => void) | undefined {
  try {
    // Wait for the DOM to be ready before accessing canvas
    const canvas = canvasElement || document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }
    
    // Determine if we're in prominent mode
    const isProminent = options?.prominent || false;
    const themeColors = options?.themeColors || defaultThemeColors;

    // Set up initial state
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    
    // Variables for animation
    let running = true;
    let phase = Math.random() * 2 * Math.PI;
    let lines: Line[] = [];
    const pos: Position = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };    // Configuration - enhanced for more prominent visual effect and better cursor following
    const config = {
      trails: isProminent ? 45 : 30,             // Significantly more trails for prominent mode
      size: isProminent ? 55 : 45,               // Reduced size for better cursor following
      friction: isProminent ? 0.35 : 0.38,       // Significantly less friction for snappier movement
      dampening: isProminent ? 0.05 : 0.045,     // Increased dampening for better response
      tension: isProminent ? 0.9 : 0.92,         // Further reduced tension for closer cursor following
      lineWidth: isProminent ? 16 : 12,          // Thick lines for prominence
      baseOpacity: isProminent ? 0.08 : 0.05,    // Higher base opacity
      opacityVariation: isProminent ? 0.04 : 0.02, // More opacity variation for dynamic effect
      colorCycleSpeed: isProminent ? 0.0025 : 0.0015, // Faster color cycling
      colorSaturation: isProminent ? 90 : 80,    // More saturated colors
      colorLightness: isProminent ? 75 : 70,     // Brighter colors
      useColorShift: isProminent,                // Enable color shifting for prominent mode
      useThemeColors: isProminent,               // Use theme colors in prominent mode
      responsiveness: isProminent ? 0.9 : 0.8,   // Significantly higher value for immediate cursor response
      velocityFactor: isProminent ? 0.15 : 0.1   // New parameter for velocity influence
    };

    // Line class with proper TypeScript types
    class Line {
      spring: number;
      friction: number;
      nodes: Node[];
      colorOffset: number;
      
      constructor(spring: number) {
        this.spring = spring + 0.1 * Math.random() - 0.05;
        this.friction = config.friction + 0.01 * Math.random() - 0.005;
        this.colorOffset = Math.random() * 40 - 20; // Random color offset for variety
        this.nodes = [];
        
        for (let i = 0; i < config.size; i++) {
          this.nodes.push({
            x: pos.x,
            y: pos.y,
            vx: 0,
            vy: 0
          });
        }
      }      update(): void {
        let spring = this.spring;
        let node = this.nodes[0];
        
        // Apply responsiveness factor for first node to follow cursor more closely
        const responseFactor = config.responsiveness || 0.6;
        
        // Direct positioning for the first node to stick to cursor
        if (typeof config.velocityFactor === 'number' && config.velocityFactor > 0) {
          // Use a blend of direct positioning and spring physics for the lead node
          // This helps the animation stick closer to the cursor
          node.x = node.x * 0.7 + pos.x * 0.3;
          node.y = node.y * 0.7 + pos.y * 0.3;
          
          // Still apply some velocity for natural movement
          node.vx = (pos.x - node.x) * spring * responseFactor;
          node.vy = (pos.y - node.y) * spring * responseFactor;
        } else {
          // Regular spring physics for non-lead nodes
          node.vx += (pos.x - node.x) * spring * responseFactor;
          node.vy += (pos.y - node.y) * spring * responseFactor;
        }
        
        // Add velocity influence for smoother following (increased effect)
        const velocityFactor = config.velocityFactor || 0.1;
        if (velocity.x !== 0 && velocity.y !== 0) {
          node.vx += velocity.x * velocityFactor;
          node.vy += velocity.y * velocityFactor;
        }
        
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
      
      draw(hue: number, isDarkMode: boolean, progress: number): void {
        if (!ctx) return;
        
        let x = this.nodes[0].x;
        let y = this.nodes[0].y;
        let nextX, nextY;
        
        // More dynamic opacity and width based on position in the trail
        const dynamicOpacity = config.baseOpacity + Math.sin(progress + this.colorOffset/30) * config.opacityVariation;
        
        // Apply different styles for prominent mode
        if (config.useThemeColors) {
          // Use theme colors with gradient along the path
          const gradient = ctx.createLinearGradient(
            this.nodes[0].x, this.nodes[0].y, 
            this.nodes[this.nodes.length-1].x, this.nodes[this.nodes.length-1].y
          );
          
          const colors = isDarkMode ? themeColors.dark : themeColors.light;
          gradient.addColorStop(0, `${colors.primary}${Math.round(dynamicOpacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(0.5, `${colors.secondary}${Math.round(dynamicOpacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${colors.primary}${Math.round(dynamicOpacity * 255).toString(16).padStart(2, '0')}`);
          
          ctx.strokeStyle = gradient;
        } else if (config.useColorShift) {
          // Dynamic color shifting based on position and progress
          const lineHue = (hue + this.colorOffset) % 360;
          ctx.strokeStyle = isDarkMode 
            ? `hsla(${lineHue},${config.colorSaturation}%,${config.colorLightness}%,${dynamicOpacity})`
            : `hsla(${lineHue},${config.colorSaturation+10}%,${config.colorLightness-20}%,${dynamicOpacity})`;
        } else {
          // Original style with slight enhancement
          ctx.strokeStyle = isDarkMode 
            ? `hsla(${hue},${config.colorSaturation}%,${config.colorLightness}%,${dynamicOpacity})` 
            : `hsla(${hue},100%,50%,${dynamicOpacity})`;
        }
        
        // Variable line width for more dynamic appearance
        ctx.lineWidth = config.lineWidth - Math.sin(progress * 2 + this.colorOffset) * 4;
        
        // Draw the curved path
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
    }    
    
    // Initialize lines
    for (let i = 0; i < config.trails; i++) {
      lines.push(new Line(0.45 + (i / config.trails) * 0.025));
    }

    // Handle mouse/touch movement with enhanced tracking
    let lastX = pos.x;
    let lastY = pos.y;
    let velocity = { x: 0, y: 0 };
      function handleMouse(e: MouseEvent | TouchEvent): void {
      e.preventDefault();
      
      // Store previous position
      lastX = pos.x;
      lastY = pos.y;
      
      // Calculate position relative to the canvas
      const rect = canvas.getBoundingClientRect();
      
      // Update current position with offset calculation
      if ('touches' in e && e.touches.length > 0) {
        pos.x = e.touches[0].clientX - rect.left;
        pos.y = e.touches[0].clientY - rect.top;
      } else if ('clientX' in e) {
        pos.x = e.clientX - rect.left;
        pos.y = e.clientY - rect.top;
      }
      
      // Calculate velocity for more responsive animation
      velocity.x = pos.x - lastX;
      velocity.y = pos.y - lastY;
    }

    // Set up event listeners
    document.addEventListener("mousemove", handleMouse as EventListener);
    document.addEventListener("touchmove", handleMouse as EventListener);    document.addEventListener("touchstart", ((e: TouchEvent) => {
      if (e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        pos.x = e.touches[0].clientX - rect.left;
        pos.y = e.touches[0].clientY - rect.top;
      }
    }) as EventListener);

    // Automatic motion when no user interaction
    let autoMoveTimer: number | null = null;
    let noInteractionTime = 0;
    const startAutoMove = () => {
      if (autoMoveTimer !== null) return;
      
      autoMoveTimer = window.setInterval(() => {
        noInteractionTime += 16; // Approximately 16ms per frame
        
        if (noInteractionTime > 2000) { // After 2 seconds of no interaction
          // Create gentle circular motion
          const radius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.25;
          const speed = 0.0005;
          const t = Date.now() * speed;
          
          pos.x = ctx.canvas.width / 2 + Math.cos(t) * radius + Math.sin(t * 1.5) * radius * 0.3;
          pos.y = ctx.canvas.height / 2 + Math.sin(t) * radius + Math.cos(t * 2) * radius * 0.2;
        }
      }, 16);
    };
    
    document.addEventListener("mousemove", () => {
      noInteractionTime = 0;
    });
    
    document.addEventListener("touchmove", () => {
      noInteractionTime = 0;
    });
    
    // Start auto-move
    startAutoMove();

    // Handle window resize with proper scaling
    window.addEventListener("resize", () => {
      if (!ctx) return;
      
      // Save current center position ratio
      const centerXRatio = pos.x / ctx.canvas.width;
      const centerYRatio = pos.y / ctx.canvas.height;
      
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      
      // Adjust position based on new dimensions
      pos.x = ctx.canvas.width * centerXRatio;
      pos.y = ctx.canvas.height * centerYRatio;
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
    
    observer.observe(document.documentElement, { attributes: true });    
    
    // Render function with enhanced visual effects
    let progress = 0;
    function render(): void {
      if (!running || !ctx) return;
      
      // Update progress for animation effects
      progress += 0.01;
      
      ctx.globalCompositeOperation = "source-over";
      
      // Enhanced clearing for more smooth trails
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      ctx.globalCompositeOperation = "lighter";
      
      // Check if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Update phase for color change with enhanced speed
      phase += config.colorCycleSpeed;
      const hue = Math.round(phase * 60 + 200) % 360;
        
      // Update and draw all lines
      for (let i = 0; i < lines.length; i++) {
        lines[i].update();
        lines[i].draw(hue, isDarkMode, progress);
      }
      
      requestAnimationFrame(render);
    }

    // Start animation
    render();

    // Set up focus/blur handling
    window.addEventListener("blur", () => { 
      running = false;
      if (autoMoveTimer !== null) {
        clearInterval(autoMoveTimer);
        autoMoveTimer = null;
      }
    });
    
    window.addEventListener("focus", () => { 
      if (!running) {
        running = true;
        render();
        startAutoMove();
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
      
      if (autoMoveTimer !== null) {
        clearInterval(autoMoveTimer);
        autoMoveTimer = null;
      }
    };
  } catch (err) {
    console.error("Error in renderCanvas:", err);
  }
}