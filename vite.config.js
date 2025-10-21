import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import compression from 'vite-plugin-compression'

export default defineConfig({
  build: {
    emptyOutDir: true, // Clear dist directory on build
    assetsInlineLimit: (filePath, content) => {
      // Never inline SVG files to prevent encoding issues
      if (filePath.endsWith('.svg')) {
        return false;
      }
      // Use default 4KB limit for other assets
      return 4096;
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: ['vendor/openlayers/dist/ol.js', 'vendor/openlayers/dist/ol.css'],
          dest: 'vendor/openlayers/dist'
        },
        {
          src: 'img/*',
          dest: 'img'
        }
      ]
    }),
    // Generate gzip compressed files
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // Generate Brotli compressed files
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
})