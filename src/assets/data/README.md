# Static test data

This directory contains static GeoJSON files for local development testing.

## Usage

Set `VITE_USE_STATIC_DATA=true` in `src/.env` to use these files instead of live GeoServer data.

## Files

- `actueel.json` - Sample current incidents
- `uur.json` - Sample incidents from last hour
- `vandaag.json` - Sample today's incidents

## Creating test data

To capture real data for testing:

1. Open the live site in browser
2. Open DevTools Network tab
3. Find the WFS requests (e.g., `typename=meldingen:actueel`)
4. Copy the response JSON
5. Save to the appropriate file in this directory

Or use curl:

```bash
curl "https://tileserver2.incidentcentrale.nl/geoserver/ows?service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:4326&outputFormat=application/json" > src/assets/data/actueel.json
```
