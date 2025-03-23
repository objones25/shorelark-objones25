import { useEffect, useState } from 'react';
import { simulationService } from '../services/simulation';

interface StatsPanelProps {
  isRunning: boolean;
  generation: number;
}

interface Stats {
  animalCount: number;
  foodCount: number;
  avgFitness: number;
  bestFitness: number;
  worstFitness: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ isRunning, generation }) => {
  const [stats, setStats] = useState<Stats>({
    animalCount: 0,
    foodCount: 0,
    avgFitness: 0,
    bestFitness: 0,
    worstFitness: 0,
  });

  const [generationHistory, setGenerationHistory] = useState<number[]>([]);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);

  // Update stats when running or when generation changes
  useEffect(() => {
    const updateStats = () => {
      const world = simulationService.getWorld();
      if (!world) return;

      // Calculate stats from world data
      const animalCount = world.animals.length;
      const foodCount = world.food.length;
      
      // In a real implementation, these would come from the WASM module
      const avgFitness = Math.random() * 100;
      const bestFitness = avgFitness + Math.random() * 50;
      const worstFitness = avgFitness - Math.random() * 50;

      setStats({
        animalCount,
        foodCount,
        avgFitness,
        bestFitness,
        worstFitness,
      });
    };

    updateStats();

    // Set up interval if simulation is running
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(updateStats, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, generation]);

  // Update history when generation changes
  useEffect(() => {
    if (generation > 0) {
      setGenerationHistory(prev => [...prev, generation]);
      setFitnessHistory(prev => [...prev, stats.avgFitness]);
    }
  }, [generation]);

  const StatItem = ({ label, value }: { label: string; value: number | string }) => (
    <div className="flex justify-between items-center border-b border-gray-200 py-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );

  return (
    <div className="stats-panel h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      
      <div className="space-y-1">
        <StatItem label="Generation" value={generation} />
        <StatItem label="Animals" value={stats.animalCount} />
        <StatItem label="Food" value={stats.foodCount} />
        <StatItem label="Average Fitness" value={stats.avgFitness.toFixed(2)} />
        <StatItem label="Best Fitness" value={stats.bestFitness.toFixed(2)} />
        <StatItem label="Worst Fitness" value={stats.worstFitness.toFixed(2)} />
      </div>
      
      {generationHistory.length > 0 && (
        <div className="mt-6 flex-grow">
          <h3 className="text-lg font-medium mb-2">Fitness History</h3>
          <div className="h-48 bg-gray-100 rounded-md p-2 relative">
            {/* Simple bar chart visualization */}
            <div className="absolute inset-0 flex items-end justify-around p-2">
              {fitnessHistory.map((fitness, index) => {
                const height = `${(fitness / 150) * 100}%`;
                return (
                  <div 
                    key={index} 
                    className="bg-blue-500 w-4 mx-1 rounded-t"
                    style={{ height }}
                    title={`Gen ${generationHistory[index]}: ${fitness.toFixed(2)}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel; 