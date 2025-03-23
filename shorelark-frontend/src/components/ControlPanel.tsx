import { useState } from 'react';
import { simulationService } from '../services/simulation';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  generation: number;
  autoTrain: boolean;
  autoTrainInterval: number;
  onRunningChange: (isRunning: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onGenerationChange: (generation: number) => void;
  onAutoTrainChange: (autoTrain: boolean) => void;
  onAutoTrainIntervalChange: (interval: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  speed,
  generation,
  autoTrain,
  autoTrainInterval,
  onRunningChange,
  onSpeedChange,
  onGenerationChange,
  onAutoTrainChange,
  onAutoTrainIntervalChange,
}) => {
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    'Welcome to Shorelark Simulation!',
    'This is a simulation of artificial life and evolution.',
    'Use the controls to start, pause, and adjust the simulation.',
    'Train the simulation to evolve better organisms over generations.',
  ]);

  const [lastLoggedInterval, setLastLoggedInterval] = useState<number>(0);

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

  const handleAutoTrainToggle = () => {
    const newAutoTrain = !autoTrain;
    onAutoTrainChange(newAutoTrain);
    addTerminalMessage(`Auto-training ${newAutoTrain ? 'enabled' : 'disabled'}.`);
    
    if (newAutoTrain) {
      addTerminalMessage(`Will automatically train every ${autoTrainInterval / 1000} seconds.`);
    }
  };

  const handleAutoTrainIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = Number(e.target.value) * 1000; // Convert to milliseconds
    onAutoTrainIntervalChange(newInterval);
    
    // Only log if the interval has changed by at least 1 second or it's the first change
    if (Math.abs(newInterval - lastLoggedInterval) >= 1000 || lastLoggedInterval === 0) {
      addTerminalMessage(`Auto-train interval set to ${newInterval / 1000} seconds.`);
      setLastLoggedInterval(newInterval);
    }
  };

  const addTerminalMessage = (message: string) => {
    setTerminalMessages(prev => {
      // Keep only the last 10 messages to prevent excessive buildup
      const newMessages = [...prev, message];
      if (newMessages.length > 10) {
        return newMessages.slice(newMessages.length - 10);
      }
      return newMessages;
    });
    
    // Scroll to the bottom of terminal after message is added
    setTimeout(() => {
      const terminal = document.querySelector('.terminal');
      if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
      }
    }, 10);
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
            disabled={autoTrain}
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

        <div className="mt-2">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="autoTrain"
              name="autoTrain"
              checked={autoTrain}
              onChange={handleAutoTrainToggle}
              className="mr-2"
            />
            <label htmlFor="autoTrain" className="form-label">
              Auto-Train
            </label>
          </div>
          
          {autoTrain && (
            <div>
              <label htmlFor="autoTrainInterval" className="form-label">
                Interval: {autoTrainInterval / 1000} seconds
              </label>
              <input
                type="range"
                id="autoTrainInterval"
                name="autoTrainInterval"
                min="1"
                max="30"
                value={autoTrainInterval / 1000}
                onChange={handleAutoTrainIntervalChange}
                className="w-full"
              />
            </div>
          )}
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
