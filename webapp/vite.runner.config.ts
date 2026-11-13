import { defineConfig } from 'vite'
import path from 'node:path'

// Builds the React lesson runner (src/react-runner/entry.ts) into one self-contained file, public/react-runner.js, that
// the sandboxed preview frame loads. Run `npm run build:react-runner` after changing the runner, and commit the file.
export default defineConfig({
  publicDir: false,
  // React reads this to choose its development build (readable error messages), which a library build does not set.
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  build: {
    outDir: 'public',
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/react-runner/entry.ts'),
      name: 'ReactLessonRunner',
      formats: ['iife'],
      fileName: () => 'react-runner.js',
    },
  },
})
