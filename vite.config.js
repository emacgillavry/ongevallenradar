import { defineConfig, loadEnv } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { compression } from 'vite-plugin-compression2';
import { execSync } from 'child_process';

export default defineConfig(({ mode }) => {
  // Load environment variables from src/.env files
  const env = loadEnv(mode, 'src', '');

  return {
    base: env.VITE_BASE_PATH || '/', // Set base path for deployment
    root: 'src', // Set src as the root directory
    publicDir: '../public', // Public assets directory
    server: {
      host: '0.0.0.0', // Expose to network
      port: 5173, // Default Vite port
    },
    build: {
      outDir: '../dist', // Build output to dist directory at project root
      emptyOutDir: true, // Clear dist directory on build
      assetsInlineLimit: (filePath, content) => {
        // Never inline SVG files to prevent encoding issues
        if (filePath.endsWith('.svg')) {
          return false;
        }
        // Use default 4KB limit for other assets
        return 4096;
      },
    },
    plugins: [
      // Plugin to inject build information into HTML
      {
        name: 'html-build-info',
        transformIndexHtml(html) {
          const buildTime = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
          let gitCommit = 'unknown';
          let gitBranch = 'unknown';

          try {
            gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
          } catch (e) {
            // Git not available or not a git repo
          }

          try {
            gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
          } catch (e) {
            // Git not available or not a git repo
          }

          return html
            .replace('__BUILD_TIME__', buildTime)
            .replace('__GIT_COMMIT__', gitCommit)
            .replace('__GIT_BRANCH__', gitBranch);
        },
      },
      htmlMinifier({
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeEmptyAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'assets/images/*',
            dest: 'assets/images',
          },
        ],
      }),
      // Generate gzip and Brotli compressed files
      compression({
        algorithms: ['gzip', 'brotliCompress'],
        include: /\.(js|css|html|json|svg)$/i,
        threshold: 512,
        deleteOriginalAssets: false,
      }),
    ],
  };
});
