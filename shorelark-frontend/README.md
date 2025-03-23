# Shorelark Frontend

A modern frontend for the Shorelark simulation project, built with React, TypeScript, and Tailwind CSS.

## About Shorelark

Shorelark is a simulation of evolution powered by neural networks, genetic algorithms, and WebAssembly. The original project was created by [Patryk Wychowaniec](https://github.com/Patryk27/shorelark).

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Rust and cargo
- wasm-pack

## Setup

1. Build the Rust WASM module:

```bash
cd libs/simulation-wasm
wasm-pack build --release
```

2. Install frontend dependencies:

```bash
cd shorelark-frontend
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Features

- Interactive simulation visualization with canvas rendering
- Real-time statistics of the simulation
- Controls for running, pausing, and training the simulation
- Generation tracking and fitness history visualization

## Architecture

The frontend is structured as follows:

- **src/components**: UI components including simulation canvas, control panel, and stats display
- **src/services**: Service layer for communication with the WebAssembly module
- **src/wasm**: Directory for WASM module output

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.
