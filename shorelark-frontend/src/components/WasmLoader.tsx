import { useState, useEffect } from 'react';
import { simulationService } from '../services/simulation';

interface WasmLoaderProps {
  children: React.ReactNode;
  onLoaded: () => void;
}

const WasmLoader: React.FC<WasmLoaderProps> = ({ children, onLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    
    const loadWasm = async () => {
      try {
        // Simulate loading progress
        let loadingProgress = 0;
        interval = setInterval(() => {
          loadingProgress += 10;
          setProgress(Math.min(loadingProgress, 90)); // Cap at 90% until actual load completes
          
          if (loadingProgress >= 90) {
            clearInterval(interval);
          }
        }, 200);
        
        // Initialize the simulation
        await simulationService.initialize();
        
        clearInterval(interval);
        setProgress(100);
        
        // Allow a brief moment at 100% for visual feedback
        setTimeout(() => {
          setIsLoading(false);
          onLoaded();
        }, 500);
      } catch (err) {
        if (interval) clearInterval(interval);
        setError(`Failed to load WebAssembly module: ${err}`);
      }
    };

    loadWasm();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onLoaded]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Simulation</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Loading Shorelark Simulation</h2>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-gray-500">{progress}% - Initializing WebAssembly module...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WasmLoader; 