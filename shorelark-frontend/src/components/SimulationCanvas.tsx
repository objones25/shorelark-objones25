import { useRef, useEffect } from 'react';
import { simulationService } from '../services/simulation';

interface SimulationCanvasProps {
  width: number;
  height: number;
  isRunning: boolean;
  speed: number;
  onSimulationStep?: () => void;
}

// Constants for visual representation
const FOOD_RADIUS = 3;
const ANIMAL_RADIUS = 5;
const ANIMAL_VISION_LENGTH = 20;
const ANIMAL_COLOR = '#ef4444';  // Red
const FOOD_COLOR = '#22c55e';    // Green
const VISION_COLOR = 'rgba(59, 130, 246, 0.5)';  // Blue, semi-transparent

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ 
  width, 
  height, 
  isRunning, 
  speed,
  onSimulationStep 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Main animation loop
  useEffect(() => {
    if (!isRunning || !simulationService.isInitialized) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const frameDelay = 1000 / speed;
    let lastTime = 0;

    const renderFrame = (timestamp: number) => {
      if (timestamp - lastTime >= frameDelay) {
        simulationService.step();
        if (onSimulationStep) {
          onSimulationStep();
        }
        renderWorld(ctx);
        lastTime = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, speed, onSimulationStep]);

  // Initial render and resize handling
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    renderWorld(ctx);
  }, [width, height]);

  // Render the world state to the canvas
  const renderWorld = (ctx: CanvasRenderingContext2D) => {
    const world = simulationService.getWorld();
    if (!world) return;

    ctx.clearRect(0, 0, width, height);

    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    for (const food of world.food) {
      ctx.beginPath();
      ctx.arc(food.x, food.y, FOOD_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw animals and their vision
    for (const animal of world.animals) {
      // Vision cones
      for (let i = 0; i < animal.vision.length; i++) {
        const visionStrength = animal.vision[i];
        if (visionStrength <= 0) continue;

        ctx.fillStyle = VISION_COLOR;
        
        // Calculate the angle of this vision ray
        const angle = animal.rotation + (i / animal.vision.length) * Math.PI * 2;
        
        // Draw a triangle for the vision cone
        ctx.beginPath();
        ctx.moveTo(animal.x, animal.y);
        const x1 = animal.x + Math.cos(angle - 0.1) * ANIMAL_VISION_LENGTH * visionStrength;
        const y1 = animal.y + Math.sin(angle - 0.1) * ANIMAL_VISION_LENGTH * visionStrength;
        const x2 = animal.x + Math.cos(angle + 0.1) * ANIMAL_VISION_LENGTH * visionStrength;
        const y2 = animal.y + Math.sin(angle + 0.1) * ANIMAL_VISION_LENGTH * visionStrength;
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      }

      // Animal body
      ctx.fillStyle = ANIMAL_COLOR;
      ctx.beginPath();
      ctx.arc(animal.x, animal.y, ANIMAL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Direction indicator
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(animal.x, animal.y);
      ctx.lineTo(
        animal.x + Math.cos(animal.rotation) * ANIMAL_RADIUS,
        animal.y + Math.sin(animal.rotation) * ANIMAL_RADIUS
      );
      ctx.stroke();
    }
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
    </div>
  );
};

export default SimulationCanvas;
