import { defineConfig } from 'tsup'

export default defineConfig({
    target: "node12",
    entryPoints: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: true,
    legacyOutput: true,
    // external: ['child_process', 'https'],
    // external: ['https'],
    // external: ['child_process'],
    // external: ['https', 'child_process'],
    // external: ['https', 'child_process', 'fs'],
})