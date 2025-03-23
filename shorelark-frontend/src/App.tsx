import { useState, useEffect, useRef } from 'react'
import './App.css'
import SimulationCanvas from './components/SimulationCanvas'
import ControlPanel from './components/ControlPanel'
import StatsPanel from './components/StatsPanel'
import WasmLoader from './components/WasmLoader'
import { simulationService } from './services/simulation'

function App() {
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(30)
  const [generation, setGeneration] = useState(0)
  const [autoTrain, setAutoTrain] = useState(false)
  const [autoTrainInterval, setAutoTrainInterval] = useState(5000) // 5 seconds default
  const simulationStepsRef = useRef(0)
  const lastTrainTimeRef = useRef(Date.now())

  const handleWasmLoaded = () => {
    setWasmLoaded(true)
  }

  const handleGenerationChange = (newGeneration: number) => {
    setGeneration(newGeneration)
  }

  // Handle auto-training
  useEffect(() => {
    if (!autoTrain || !isRunning || !wasmLoaded) return

    const checkForTraining = () => {
      const currentTime = Date.now()
      if (currentTime - lastTrainTimeRef.current >= autoTrainInterval) {
        // Perform training
        simulationService.train()
        setGeneration(prev => prev + 1)
        lastTrainTimeRef.current = currentTime
        simulationStepsRef.current = 0
      }
    }

    const intervalId = setInterval(checkForTraining, 100) // Check frequently
    
    return () => {
      clearInterval(intervalId)
    }
  }, [autoTrain, isRunning, wasmLoaded, autoTrainInterval])

  // Track simulation steps for potential step-based auto training
  const handleSimulationStep = () => {
    if (autoTrain && isRunning) {
      simulationStepsRef.current += 1
    }
  }

  return (
    <WasmLoader onLoaded={handleWasmLoaded}>
      <div className="min-h-screen p-6">
        <header className="mb-6 bg-black/50 p-4 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-white">Shorelark Simulation</h1>
          <p className="text-center text-gray-200 mt-2">
            Artificial evolution simulation powered by neural networks and genetic algorithms
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Control Panel */}
          <div className="lg:col-span-1 h-[500px] bg-white/90 rounded-lg shadow-lg p-4">
            <ControlPanel
              isRunning={isRunning}
              speed={speed}
              onRunningChange={setIsRunning}
              onSpeedChange={setSpeed}
              generation={generation}
              onGenerationChange={handleGenerationChange}
              autoTrain={autoTrain}
              onAutoTrainChange={setAutoTrain}
              autoTrainInterval={autoTrainInterval}
              onAutoTrainIntervalChange={setAutoTrainInterval}
            />
          </div>

          {/* Simulation Canvas */}
          <div className="lg:col-span-2 h-[500px] bg-white/75 rounded-lg shadow-lg p-4">
            <SimulationCanvas
              width={800}
              height={500}
              isRunning={isRunning && wasmLoaded}
              speed={speed}
              onSimulationStep={handleSimulationStep}
            />
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1 h-[500px] bg-white/90 rounded-lg shadow-lg p-4">
            <StatsPanel
              isRunning={isRunning}
              generation={generation}
              autoTrain={autoTrain}
            />
          </div>
        </main>

        <footer className="mt-8 text-center text-sm bg-black/50 p-4 rounded-lg shadow-lg text-white">
          <p>Based on the original Shorelark by Patryk Wychowaniec</p>
          <p>Powered by Rust, WebAssembly, React, and TypeScript</p>
        </footer>
      </div>
    </WasmLoader>
  )
}

export default App
