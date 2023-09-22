import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  format: ['esm', 'cjs'],
  target: 'node18',
  dts: true,
  minify: true,
  sourcemap: true,
});
