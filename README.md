# Ongevallenradar

## Configuration

### Environment Files

The application uses Vite's environment variable system:

- **`.env`** - Base configuration with defaults for development (tracked in git)
- **`.env.example`** - Template showing all available variables (tracked in git)
- **`.env.production`** - Production overrides (git-ignored, optional)

### How It Works

1. `.env` provides default values optimized for development (static data, OSM tiles)
2. When running `npm run build`, Vite automatically loads `.env.production` if it exists, overriding values from `.env`
3. Typically these values need to be overridden for production:
   - `VITE_USE_STATIC_DATA` - Switch from static test data to live GeoServer
   - `VITE_TILE_SERVER_URL_TEMPLATE` - Switch from OSM to production tile cache
   - `VITE_BASE_PATH` - Set deployment subdirectory if needed

## Development

Start a local development server:

    npm run dev

Open the [application](http://localhost:5173) in a web browser.

## Test the build process

    npm run build

## Create production build + deployment packages

    npm run build:release

Upload generated ZIP/GZIP to GitHub as part of creating a new release.
