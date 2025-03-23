# Simulation WASM

WebAssembly bindings for the simulation library.

## Building

The standard way to build the WebAssembly module:

```bash
wasm-pack build
```

This will generate the WASM bindings in the `pkg/` directory.

## Notes

- Uses getrandom 0.3 with the wasm_js feature
- Requires the getrandom_backend="wasm_js" configuration flag (set in .cargo/config.toml)
- Compatible with rand 0.9 and rand_chacha 0.9

## Troubleshooting

If you encounter errors related to random number generation in WebAssembly, make sure:

1. The `wasm_js` feature is enabled for getrandom in Cargo.toml
2. The configuration flag `getrandom_backend="wasm_js"` is set (via .cargo/config.toml or RUSTFLAGS) 