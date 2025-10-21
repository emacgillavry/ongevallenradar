import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    emptyOutDir: true // Clear dist directory on build
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'vendor/openlayers/dist/*',
          dest: 'vendor/openlayers/dist'
        }
      ]
    })
  ]
})