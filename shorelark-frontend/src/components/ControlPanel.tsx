import { useState } from 'react';
import { simulationService } from '../services/simulation';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  generation: number;
  onRunningChange: (isRunning: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onGenerationChange: (generation: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  speed,
  generation,
  onRunningChange,
  onSpeedChange,
  onGenerationChange,
}) => {
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    'Welcome to Shorelark Simulation!',
    'This is a simulation of artificial life and evolution.',
    'Use the controls to start, pause, and adjust the simulation.',
    'Train the simulation to evolve better organisms over generations.',
  ]);

  const handleStartStop = () => {
    onRunningChange(!isRunning);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(e.target.value));
  };

  const handleTrain = () => {
    // Pause the simulation while training
    onRunningChange(false);
    
    // Update the terminal with a training message
    addTerminalMessage(`Training generation ${generation + 1}...`);
    
    // Call the train method from the simulation service
    try {
      simulationService.train();
      const newGeneration = generation + 1;
      onGenerationChange(newGeneration);
      addTerminalMessage(`Training complete for generation ${newGeneration}!`);
    } catch (error) {
      addTerminalMessage(`Error during training: ${error}`);
    }
  };

  const handleReset = () => {
    onRunningChange(false);
    simulationService.reset();
    onGenerationChange(0);
    addTerminalMessage('Simulation reset to initial state.');
  };

  const addTerminalMessage = (message: string) => {
    setTerminalMessages(prev => [...prev, message]);
  };

  return (
    <div className="control-panel flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Simulation Controls</h2>
        <div className="text-sm text-gray-500">Generation: {generation}</div>
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <button 
            className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleStartStop}
          >
            {isRunning ? 'Pause' : 'Run'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleTrain}
          >
            Train
          </button>
        </div>
        
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
        >
          Reset
        </button>
        
        <div className="mt-2">
          <label htmlFor="speed" className="form-label">
            Simulation Speed: {speed} fps
          </label>
          <input
            type="range"
            id="speed"
            name="speed"
            min="1"
            max="60"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="terminal flex-grow mt-4 overflow-y-auto">
        {terminalMessages.map((message, index) => (
          <span key={index} className="terminal-line">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
