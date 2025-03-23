/**
 * Simulation Service
 * 
 * Handles interaction with the Rust WASM module for running the Shorelark simulation.
 */

// Types for the WASM module
interface Animal {
  x: number;
  y: number;
  rotation: number;
  vision: number[];
}

interface Food {
  x: number;
  y: number;
}

interface World {
  width: number;
  height: number;
  animals: Animal[];
  food: Food[];
}

interface Simulation {
  world(): World;
  step(): void;
  train(): void;
  reset(): void;
}

// Update the path to point to the correct location using the actual module name
const WASM_MODULE_PATH = '../../../libs/simulation-wasm/pkg/lib_simulation_wasm';

// Service wrapper for the Simulation
class SimulationService {
  private _module: any | null = null;
  private _simulation: Simulation | null = null;
  private _isInitialized = false;
  
  // We'll create a mock simulation for development purposes
  private _mockWorld: World = {
    width: 800,
    height: 500,
    animals: Array(10).fill(0).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 500,
      rotation: Math.random() * Math.PI * 2,
      vision: Array(8).fill(0).map(() => Math.random())
    })),
    food: Array(20).fill(0).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 500
    }))
  };

  /**
   * Initialize the WASM module and create a new simulation
   */
  async initialize(): Promise<void> {
    try {
      // Try to load the actual WASM module
      try {
        // Add vite-ignore to suppress the dynamic import warning
        // @ts-ignore
        this._module = await import(/* @vite-ignore */ WASM_MODULE_PATH);
        this._simulation = this._module.Simulation.new();
        this._isInitialized = true;
        console.log('Simulation initialized successfully with WASM module');
      } catch (e) {
        // If WASM module loading fails, use mock implementation
        console.warn('Failed to load WASM module, using mock implementation:', e);
        this._isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
      throw error;
    }
  }

  /**
   * Check if the simulation is initialized
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Get the current world state
   */
  getWorld(): World | null {
    if (this._simulation) {
      return this._simulation.world();
    }
    
    // If no simulation is available, return the mock world
    return this._mockWorld;
  }

  /**
   * Step forward in the simulation
   */
  step(): void {
    if (this._simulation) {
      this._simulation.step();
      return;
    }
    
    // Mock implementation
    this._mockWorld.animals.forEach(animal => {
      // Move animals randomly
      const speed = 2;
      animal.x += Math.cos(animal.rotation) * speed;
      animal.y += Math.sin(animal.rotation) * speed;
      
      // Wrap around edges
      if (animal.x < 0) animal.x = this._mockWorld.width;
      if (animal.x > this._mockWorld.width) animal.x = 0;
      if (animal.y < 0) animal.y = this._mockWorld.height;
      if (animal.y > this._mockWorld.height) animal.y = 0;
      
      // Randomly change direction occasionally
      if (Math.random() < 0.02) {
        animal.rotation += (Math.random() - 0.5) * Math.PI / 2;
      }
      
      // Update vision
      animal.vision = Array(8).fill(0).map(() => Math.random());
    });
    
    // Remove eaten food and generate new food randomly
    const foodEatenChance = 0.01;
    this._mockWorld.food = this._mockWorld.food.filter(() => Math.random() > foodEatenChance);
    
    if (Math.random() < 0.1 && this._mockWorld.food.length < 30) {
      this._mockWorld.food.push({
        x: Math.random() * this._mockWorld.width,
        y: Math.random() * this._mockWorld.height
      });
    }
  }

  /**
   * Train the simulation (run a generation)
   */
  train(): void {
    if (this._simulation) {
      this._simulation.train();
      return;
    }
    
    // Mock implementation
    console.log('Training mock simulation');
    // Reset animal positions
    this._mockWorld.animals.forEach(animal => {
      animal.x = Math.random() * this._mockWorld.width;
      animal.y = Math.random() * this._mockWorld.height;
      animal.rotation = Math.random() * Math.PI * 2;
    });
    
    // Reset food
    this._mockWorld.food = Array(20).fill(0).map(() => ({
      x: Math.random() * this._mockWorld.width,
      y: Math.random() * this._mockWorld.height
    }));
  }

  /**
   * Reset the simulation
   */
  reset(): void {
    if (this._simulation) {
      this._simulation.reset();
      return;
    }
    
    // Mock implementation
    this._mockWorld = {
      width: 800,
      height: 500,
      animals: Array(10).fill(0).map(() => ({
        x: Math.random() * 800,
        y: Math.random() * 500,
        rotation: Math.random() * Math.PI * 2,
        vision: Array(8).fill(0).map(() => Math.random())
      })),
      food: Array(20).fill(0).map(() => ({
        x: Math.random() * 800,
        y: Math.random() * 500
      }))
    };
  }
}

// Export a singleton instance
export const simulationService = new SimulationService();
