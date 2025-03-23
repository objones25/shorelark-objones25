# WebAssembly Integration

This directory is intended to store the compiled WebAssembly module from the Rust project.

## Building the WASM Module

To build the WASM module, you need to:

1. Navigate to the simulation-wasm directory:
   ```bash
   cd /path/to/shorelark/libs/simulation-wasm
   ```

2. Build with wasm-pack:
   ```bash
   wasm-pack build --release
   ```

3. The compiled module will be in the `pkg` directory. You can either:
   - Copy the files to this directory
   - Update the import path in `src/services/simulation.ts` to point to the actual location

## Module Structure

The compiled WASM module is located at:
`/libs/simulation-wasm/pkg/lib_simulation_wasm.js`

The expected module exports a `Simulation` class with the following methods:
- `new()`: Creates a new simulation instance
- `world()`: Returns the current world state
- `step()`: Advances the simulation by one step
- `train()`: Trains the neural networks (runs a generation)
- `reset()`: Resets the simulation to its initial state 