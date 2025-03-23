import React, { useState, useEffect } from 'react';

interface StatsPanelProps {
  isRunning: boolean;
  generation: number;
  autoTrain?: boolean;
}

// Mock data for the statistics chart
interface StatPoint {
  generation: number;
  avgFitness: number;
  maxFitness: number;
  minFitness: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  isRunning, 
  generation,
  autoTrain = false
}) => {
  const [stats, setStats] = useState<StatPoint[]>([]);

  // Generate some mock statistics data whenever the generation changes
  useEffect(() => {
    // Only add data points when we have a new generation
    if (generation > 0 && (stats.length === 0 || stats[stats.length - 1].generation !== generation)) {
      const lastAvg = stats.length > 0 ? stats[stats.length - 1].avgFitness : 10;
      const lastMax = stats.length > 0 ? stats[stats.length - 1].maxFitness : 15;
      
      // Generate new point with slight randomness but overall upward trend
      const newPoint: StatPoint = {
        generation,
        avgFitness: Math.max(0, lastAvg + (Math.random() * 5 - 2)),
        maxFitness: Math.max(lastAvg, lastMax + (Math.random() * 4 - 1)),
        minFitness: Math.max(0, lastAvg - (5 + Math.random() * 3)),
      };
      
      setStats(prevStats => [...prevStats, newPoint]);
    }
  }, [generation, stats]);

  // Format fitness value with 2 decimal places
  const formatFitness = (value: number): string => {
    return value.toFixed(2);
  };

  // Get current stats
  const currentStats = stats.length > 0 ? stats[stats.length - 1] : {
    generation: 0,
    avgFitness: 0,
    maxFitness: 0,
    minFitness: 0,
  };

  // Calculate improvement from previous generation
  const prevStats = stats.length > 1 ? stats[stats.length - 2] : currentStats;
  const avgImprovement = currentStats.avgFitness - prevStats.avgFitness;
  
  // Get improvement trend (↑, ↓, or →)
  const getImprovementTrend = (current: number, previous: number): string => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.01) return '→';
    return diff > 0 ? '↑' : '↓';
  };

  // Render a simple bar chart of fitness by generation
  const renderChart = () => {
    if (stats.length === 0) return null;
    
    const maxValue = Math.max(...stats.map(s => s.maxFitness)) * 1.1; // Add 10% margin
    
    return (
      <div className="chart mt-4 h-[200px] flex items-end">
        {stats.map((point, index) => (
          <div key={index} className="bar-group relative flex-1 flex items-end h-full">
            {/* Max fitness */}
            <div 
              className="bar max-bar w-[70%] mx-auto bg-blue-500 rounded-t"
              style={{ height: `${(point.maxFitness / maxValue) * 100}%` }}
            />
            
            {/* Average fitness */}
            <div 
              className="bar avg-bar absolute w-[70%] left-[15%] mx-auto bg-green-500 rounded-t"
              style={{ 
                height: `${(point.avgFitness / maxValue) * 100}%`,
                bottom: 0
              }}
            />
            
            {/* Min fitness */}
            <div 
              className="bar min-bar absolute w-[70%] left-[15%] mx-auto bg-red-500 rounded-t"
              style={{ 
                height: `${(point.minFitness / maxValue) * 100}%`,
                bottom: 0
              }}
            />
            
            {/* Generation label (only show for even generations to avoid crowding) */}
            {index % 2 === 0 && (
              <div className="generation-label absolute bottom-[-20px] text-xs w-full text-center">
                {point.generation}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="stats-panel p-4 bg-white rounded-lg shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-2">Statistics</h2>
      
      <div className="stats-grid grid grid-cols-2 gap-4">
        <div className="stat-card p-3 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">Generation</h3>
          <p className="text-2xl font-bold">{generation}</p>
          <div className="text-xs text-gray-500 mt-1">
            {autoTrain ? 'Auto-training enabled' : 'Manual training'}
          </div>
        </div>
        
        <div className="stat-card p-3 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="text-xl font-bold">{isRunning ? 'Running' : 'Paused'}</p>
          <div className={`text-xs ${isRunning ? 'text-green-500' : 'text-gray-500'} mt-1`}>
            {isRunning ? 'Simulation active' : 'Waiting for input'}
          </div>
        </div>
        
        <div className="stat-card p-3 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">Avg Fitness</h3>
          <p className="text-xl font-bold">{formatFitness(currentStats.avgFitness)}</p>
          <div className={`text-xs ${avgImprovement >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
            {getImprovementTrend(currentStats.avgFitness, prevStats.avgFitness)}{' '}
            {formatFitness(Math.abs(avgImprovement))}
          </div>
        </div>
        
        <div className="stat-card p-3 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">Max Fitness</h3>
          <p className="text-xl font-bold">{formatFitness(currentStats.maxFitness)}</p>
          <div className={`text-xs ${(currentStats.maxFitness - prevStats.maxFitness) >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
            {getImprovementTrend(currentStats.maxFitness, prevStats.maxFitness)}{' '}
            {formatFitness(Math.abs(currentStats.maxFitness - prevStats.maxFitness))}
          </div>
        </div>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default StatsPanel; 