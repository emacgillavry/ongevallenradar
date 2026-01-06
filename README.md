# Ongevallenradar

## Configuration

### Environment Files

The application uses Vite's environment variable system:

- **`.env.example`** - Template showing all available variables (tracked in git)
- **`.env`** - Base configuration with defaults for development (git-ignored, create from `.env.example`)
- **`.env.production`** - Production overrides (git-ignored, optional)

### Setup

1. Copy the example file to create your local configuration:

   ```bash
   cp src/.env.example src/.env
   ```

2. `.env` provides default values optimized for development (static data, OSM tiles)

3. When running `npm run build`, Vite automatically loads `.env.production` if it exists, overriding values from `.env`

4. Typically these values need to be overridden for production:
   - `VITE_USE_STATIC_DATA` - Switch from static test data to live GeoServer
   - `VITE_TILE_SERVER_URL_TEMPLATE` - Switch from OSM to production tile cache
   - `VITE_BASE_PATH` - Set deployment subdirectory if needed

## Development

Start a local development server:

```bash
npm run dev
```

Open the [application](http://localhost:5173) in a web browser.

## Test the build process

```bash
npm run build
```

## Create production build + deployment packages

```bash
 npm run build:release
```

Upload generated ZIP/GZIP to GitHub as part of creating a new release.
