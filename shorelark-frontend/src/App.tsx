import { useState } from 'react'
import './App.css'
import SimulationCanvas from './components/SimulationCanvas'
import ControlPanel from './components/ControlPanel'
import StatsPanel from './components/StatsPanel'
import WasmLoader from './components/WasmLoader'

function App() {
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(30)
  const [generation, setGeneration] = useState(0)

  const handleWasmLoaded = () => {
    setWasmLoaded(true)
  }

  const handleGenerationChange = (newGeneration: number) => {
    setGeneration(newGeneration)
  }

  return (
    <WasmLoader onLoaded={handleWasmLoaded}>
      <div className="min-h-screen bg-[color:var(--color-background)] p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center">Shorelark Simulation</h1>
          <p className="text-center text-gray-600 mt-2">
            Artificial evolution simulation powered by neural networks and genetic algorithms
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Control Panel */}
          <div className="lg:col-span-1 h-[500px]">
            <ControlPanel
              isRunning={isRunning}
              speed={speed}
              onRunningChange={setIsRunning}
              onSpeedChange={setSpeed}
              generation={generation}
              onGenerationChange={handleGenerationChange}
            />
          </div>

          {/* Simulation Canvas */}
          <div className="lg:col-span-2 h-[500px]">
            <SimulationCanvas
              width={800}
              height={500}
              isRunning={isRunning && wasmLoaded}
              speed={speed}
            />
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1 h-[500px]">
            <StatsPanel
              isRunning={isRunning}
              generation={generation}
            />
          </div>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Based on the original Shorelark by Patryk Wychowaniec</p>
          <p>Powered by Rust, WebAssembly, React, and TypeScript</p>
        </footer>
      </div>
    </WasmLoader>
  )
}

export default App
