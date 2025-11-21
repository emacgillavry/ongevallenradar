// Import CSS dependencies
import 'choices.js/public/assets/styles/choices.min.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/app.css';

// Import dependencies
import Cookies from 'js-cookie';
import Choices from 'choices.js';
import { Map, Popup, NavigationControl, AttributionControl } from 'maplibre-gl';
import Autocomplete from '@trevoreyre/autocomplete-js';

// Configuration and constants (non-DOM dependent)
const cookieName = 'ongevallenradar';
const defaultTypes = {
  0: true,
  1: true,
};
const defaultMeldersCat = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
};

// Base path configuration for assets
const basePath = import.meta.env.VITE_BASE_PATH || '/';
const getAssetPath = (path) => {
  // Remove leading slash from path and ensure basePath ends with slash
  const cleanPath = path.replace(/^\//, '');
  const cleanBasePath = basePath.endsWith('/') ? basePath : basePath + '/';
  return cleanBasePath + cleanPath;
};

const getBaseUrl = (path) => {
  // Always use window.location.origin to ensure same-origin requests
  const baseHost = window.location.origin;
  const basePath = import.meta.env.VITE_BASE_PATH || '/';

  const cleanPath = path.replace(/^\//, '');
  const cleanBasePath = basePath.endsWith('/') ? basePath : basePath + '/';

  return `${baseHost}${cleanBasePath}${cleanPath}`;
};

// GeoServer configuration
const geoserverHost = import.meta.env.VITE_WFS_HOST || 'https://geoserver.stichtingimn.nl';
const geoserverPath = import.meta.env.VITE_WFS_PATH || '/geoserver/ows';
const geoserverUrl = `${geoserverHost}${geoserverPath}?`;

// Unified layer configuration with metadata and default visibility
const layerConfig = {
  actueel: {
    title: 'Actuele meldingen',
    type: 'vector',
    defaultVisible: true,
    order: 1, // UI checkbox order
    zIndex: 50, // Map drawing order (highest - on top)
    sourceUrl: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:4326&outputFormat=application/json`,
  },
  uur: {
    title: 'Meldingen laatste zestig minuten',
    type: 'vector',
    defaultVisible: true,
    order: 2, // UI checkbox order
    zIndex: 40, // Map drawing order (below actueel)
    sourceUrl: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:uur&version=1.1.0&srsname=EPSG:4326&outputFormat=application/json`,
  },
  vandaag: {
    title: 'Meldingen vandaag',
    type: 'vector',
    defaultVisible: false,
    order: 3, // UI checkbox order
    zIndex: 30, // Map drawing order (below uur)
    sourceUrl: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:vandaag&version=1.1.0&srsname=EPSG:4326&outputFormat=application/json`,
  },
  imwegen: {
    title: 'IM-wegen',
    type: 'raster',
    defaultVisible: false,
    order: 4, // UI checkbox order
    zIndex: 10, // Map drawing order (overlay layer)
    sourceUrl: `${geoserverUrl}service=WMS&request=GetMap&layers=im_wegen:imwegen&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`,
  },
  bps: {
    title: 'Hectometerpalen',
    type: 'raster',
    defaultVisible: false,
    order: 5, // UI checkbox order
    zIndex: 20, // Map drawing order (overlay layer)
    sourceUrl: `${geoserverUrl}service=WMS&request=GetMap&layers=bps:bps_palen&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`,
  },
  rayons: {
    title: 'Rayons',
    type: 'raster',
    defaultVisible: false,
    order: 6, // UI checkbox order
    zIndex: 15, // Map drawing order (base overlay layer)
    sourceUrl: `${geoserverUrl}service=WMS&request=GetMap&layers=rayons:rayons&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`,
  },
};

// Extract default visibility settings from layerConfig
const defaultLayerInfo = Object.keys(layerConfig).reduce((acc, key) => {
  acc[key] = layerConfig[key].defaultVisible;
  return acc;
}, {});

// Rayons array (constant data)
const rayons = [
  'D50',
  'D51',
  'D52',
  'D54',
  'D55',
  'D57',
  'D58',
  'D59',
  'F01',
  'F02',
  'F03',
  'F04',
  'F05',
  'F06',
  'F09',
  'F10',
  'F11',
  'F12',
  'F14',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
  'F21',
  'F22',
  'FL100',
  'FL101',
  'FL103',
  'FL104',
  'G30',
  'G32',
  'G33',
  'G34',
  'G35',
  'G37',
  'G38',
  'G39',
  'GL235',
  'GL236',
  'GL237',
  'GL238',
  'GL239',
  'GL241',
  'GL242',
  'GL243',
  'GL245',
  'GL246',
  'GL248',
  'GL249',
  'GL250',
  'GL251',
  'GL252',
  'GL254',
  'GL255',
  'GL256',
  'GL257',
  'GL258',
  'GL259',
  'GL260',
  'GL261',
  'GL262',
  'GL263',
  'GL264',
  'GL265',
  'GL266',
  'GL267',
  'GL268',
  'GL270',
  'L351',
  'L352',
  'L353',
  'L355',
  'L357',
  'L358',
  'L359',
  'L361',
  'L362',
  'L363',
  'L364',
  'L366',
  'L367',
  'L368',
  'L369',
  'NB296',
  'NB297',
  'NB299',
  'NB300',
  'NB302',
  'NB303',
  'NB304',
  'NB305',
  'NB306',
  'NB307',
  'NB309',
  'NB310',
  'NB311',
  'NB312',
  'NB314',
  'NB316',
  'NB318',
  'NB319',
  'NB320',
  'NB321',
  'NB323',
  'NB324',
  'NB325',
  'NB326',
  'NB327',
  'NB328',
  'NB329',
  'NB330',
  'NB331',
  'NB332',
  'NB333',
  'NB334',
  'NB335',
  'NB336',
  'NB337',
  'NB338',
  'NB339',
  'NH111',
  'NH113',
  'NH114',
  'NH115',
  'NH116',
  'NH117',
  'NH118',
  'NH121',
  'NH122',
  'NH123',
  'NH124',
  'NH125',
  'NH126',
  'NH127',
  'NH128',
  'NH129',
  'NH130',
  'NH131',
  'NH132',
  'NH133',
  'NH134',
  'NH135',
  'NH136',
  'NH137',
  'NH138',
  'NH141',
  'NH142',
  'NH143',
  'NH150',
  'O72',
  'O73',
  'O74',
  'O75',
  'O76',
  'O77',
  'O81',
  'O82',
  'O83',
  'O84',
  'O85',
  'O86',
  'O87',
  'O88',
  'O89',
  'U205',
  'U206',
  'U207',
  'U208',
  'U210',
  'U211',
  'U212',
  'U213',
  'U214',
  'U216',
  'U217',
  'U219',
  'U220',
  'U221',
  'U222',
  'U223',
  'U224',
  'U226',
  'U227',
  'U228',
  'Z281',
  'Z282',
  'Z283',
  'Z285',
  'Z286',
  'Z287',
  'Z288',
  'Z289',
  'Z290',
  'ZH151',
  'ZH152',
  'ZH153',
  'ZH154',
  'ZH155',
  'ZH156',
  'ZH157',
  'ZH158',
  'ZH159',
  'ZH161',
  'ZH162',
  'ZH163',
  'ZH164',
  'ZH166',
  'ZH167',
  'ZH168',
  'ZH169',
  'ZH170',
  'ZH171',
  'ZH172',
  'ZH173',
  'ZH175',
  'ZH177',
  'ZH178',
  'ZH179',
  'ZH180',
  'ZH181',
  'ZH185',
  'ZH186',
  'ZH163a',
];

// Start the main application code (DOM-dependent only)
document.addEventListener('DOMContentLoaded', function () {
  // Cookie config and state variables (DOM-dependent)
  let cookieInfo;
  const loadCookie = function () {
    const cookieValue = Cookies.get(cookieName);
    cookieInfo = cookieValue ? JSON.parse(cookieValue) : null;
  };
  loadCookie();

  // Initialize state from cookies
  let filterType = cookieInfo ? cookieInfo.filterType : false;
  let selectedTypes = cookieInfo ? cookieInfo.selectedTypes : defaultTypes;
  let allowBeep = cookieInfo ? cookieInfo.allowBeep : true;
  const selectedMelders = {};
  let selectedMeldersCat = cookieInfo ? cookieInfo.selectedMeldersCat : defaultMeldersCat;
  let filterMelder = cookieInfo ? cookieInfo.filterMelder : false;
  let selectedRayons = cookieInfo ? cookieInfo.selectedRayons : {};
  let filterRayon = cookieInfo ? cookieInfo.filterRayon : false;
  let layerInfo = cookieInfo ? cookieInfo.layers : defaultLayerInfo;
  let cirkel = cookieInfo ? cookieInfo.cirkel : false;

  // Set initial UI state (DOM-dependent)
  document.getElementById('cirkel').checked = cirkel;

  // Track existing features for beeping functionality
  const existingFeatures = {
    actueel: new Set(),
    uur: new Set(),
    vandaag: new Set(),
  };

  // Unified GeoJSON loading function for MapLibre
  const loadGeoJSON = async (layerKey) => {
    try {
      const layerDef = layerConfig[layerKey];
      if (!layerDef || layerDef.type !== 'vector') {
        throw new Error(`Invalid layer key or not a vector layer: ${layerKey}`);
      }
      const url = layerDef.sourceUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const geojsonData = await response.json();

      // Check for new features and handle beeping (only for actueel layer)
      if (layerKey === 'actueel' && allowBeep && geojsonData.features) {
        let shouldBeep = false;

        // Check each feature to see if it's new
        for (const feature of geojsonData.features) {
          const meldnr = feature.properties?.meldnr;
          if (meldnr && !existingFeatures[layerKey].has(meldnr)) {
            // This is a new feature - check if it passes filters
            const mockFeature = {
              get: (prop) => feature.properties?.[prop],
            };

            if (filterFunction(mockFeature)) {
              shouldBeep = true;
            }
          }
        }

        // Update the tracking set with current feature IDs
        existingFeatures[layerKey].clear();
        geojsonData.features.forEach((feature) => {
          const meldnr = feature.properties?.meldnr;
          if (meldnr) {
            existingFeatures[layerKey].add(meldnr);
          }
        });

        // Beep if we found new features that pass filters
        if (shouldBeep) {
          beep();
        }
      } else if (geojsonData.features) {
        // For non-actueel layers, just update the tracking set without beeping
        existingFeatures[layerKey].clear();
        geojsonData.features.forEach((feature) => {
          const meldnr = feature.properties?.meldnr;
          if (meldnr) {
            existingFeatures[layerKey].add(meldnr);
          }
        });
      }

      // Cache the raw data for filtering without refetching
      rawDataCache[layerKey] = geojsonData;

      // Apply filtering to the data before updating the map
      const filteredData = filterGeoJSON(geojsonData);

      // Update the map source with filtered data
      map.getSource(layerKey).setData(filteredData);

      return { success: true, data: filteredData, layerKey: layerKey };
    } catch (error) {
      console.error(`Error loading ${layerKey} data:`, error);
      return { success: false, error: error, layerKey: layerKey };
    }
  };

  // Cache for raw (unfiltered) GeoJSON data
  const rawDataCache = {
    actueel: null,
    uur: null,
    vandaag: null,
  };

  // Apply current filters to already loaded data without refetching
  const applyFiltersToLayer = (layerKey) => {
    const rawData = rawDataCache[layerKey];
    if (!rawData) {
      return;
    }

    const filteredData = filterGeoJSON(rawData);
    map.getSource(layerKey).setData(filteredData);
  };

  // Filter GeoJSON data based on current filter settings
  const filterGeoJSON = (geojsonData) => {
    if (!geojsonData || !geojsonData.features) {
      return geojsonData;
    }

    const filteredFeatures = geojsonData.features.filter((feature) => {
      // Create mock feature object for compatibility with existing filterFunction
      const mockFeature = {
        get: (prop) => feature.properties?.[prop],
      };
      return filterFunction(mockFeature);
    });

    return {
      ...geojsonData,
      features: filteredFeatures,
    };
  };

  const filterFunction = (feature) => {
    // Rayon filter
    if (filterRayon) {
      const rayon = feature.get('rayon');
      if (!selectedRayons[rayon]) {
        return false;
      }
    }

    // Melder filter
    if (filterMelder) {
      const melder = feature.get('melder').toLowerCase();
      if (selectedMelders[melder] === false) {
        return false;
      }
    }

    // Type filter
    if (filterType) {
      const incidentType = feature.get('incident_type');
      const showOngevallen = selectedTypes['0'];
      const showOverig = selectedTypes['1'];

      if (!showOngevallen && !showOverig) return false;
      if (showOngevallen && !showOverig) return incidentType === 'Ongeval';
      if (!showOngevallen && showOverig) return incidentType !== 'Ongeval';
      // Both selected - show all
      return true;
    }

    return true;
  };

  // Initialize Choices.js with rayons as choices
  const selectElement = document.getElementById('sel-rayon');
  const rayonChoices = new Choices(selectElement, {
    removeItemButton: true,
    searchEnabled: false,
    itemSelectText: '',
    noResultsText: 'Geen resultaten gevonden',
    noChoicesText: 'Geen keuzes beschikbaar',
    placeholderValue: 'Selecteer rayons...',
    choices: rayons.map(function (rayon) {
      return {
        value: rayon,
        label: rayon,
        selected: selectedRayons[rayon] === true,
      };
    }),
  });

  // Function to update placeholder visibility based on selected items
  const updateRayonPlaceholder = () => {
    const hasSelectedItems = rayonChoices.getValue().length > 0;
    const inputElement = selectElement.parentNode.querySelector('.choices__input--cloned');

    if (inputElement) {
      if (hasSelectedItems) {
        inputElement.placeholder = '';
        inputElement.setAttribute('aria-label', '');
        // Maintain a reasonable minimum width when items are selected
        inputElement.style.minWidth = '8ch';
        inputElement.style.width = '8ch';
      } else {
        inputElement.placeholder = 'Selecteer rayons...';
        inputElement.setAttribute('aria-label', 'Selecteer rayons...');
        // Let Choices.js calculate width based on placeholder
        inputElement.style.minWidth = '';
        inputElement.style.width = '';
      }
    }
  };

  // Set initial placeholder state based on pre-selected items
  setTimeout(() => {
    updateRayonPlaceholder();
  }, 100);

  const hasRayon = () => Object.values(selectedRayons).some((selected) => selected === true);

  // Function to save current settings to cookies
  const saveToCookie = function () {
    const json = {};
    json.layers = layerInfo; // Use current layerInfo object directly
    json.filterRayon = filterRayon;
    json.selectedRayons = selectedRayons;
    json.filterMelder = filterMelder;
    json.selectedMeldersCat = selectedMeldersCat;
    json.cirkel = cirkel;
    json.allowBeep = allowBeep;
    json.filterType = filterType;
    json.selectedTypes = selectedTypes;
    Cookies.set(cookieName, JSON.stringify(json));
  };

  document.getElementById('save').addEventListener('click', function (evt) {
    saveToCookie();
  });

  document.getElementById('clear').addEventListener('click', function (evt) {
    Cookies.remove(cookieName);
    loadCookie();
    loadCirkelFromCookie();
    onChangeCirkel({ target: document.getElementById('cirkel') });
    loadLayerInfoFromCookie();
    applyLayerVisbility();
    loadRayonInfoFromCookie();
    // Clear all selected rayons in Choices.js
    rayonChoices.removeActiveItems();
    setToggleImg();
    loadMelderInfoFromCookie();
    setMelderFilter();
    loadBeepFromCookie();
    setBeepImg();
    loadTypesFromCookie();
    setTypeFilter();
  });

  document.getElementById('options').addEventListener('click', function (evt) {
    document.getElementById('mainoptions').style.display = 'none';
    document.getElementById('secondaryoptions').style.display = 'flex';
  });

  document.getElementById('backtomain').addEventListener('click', function (evt) {
    const mainOptions = document.getElementById('mainoptions');
    const secondaryOptions = document.getElementById('secondaryoptions');

    // Hide secondary options first
    secondaryOptions.style.display = 'none';

    // Show main options with proper flex display
    mainOptions.style.display = 'flex';

    // Force a reflow to ensure proper layout recalculation
    mainOptions.offsetHeight;
  });

  const setToggleImg = () => {
    const toggleAanImg = getAssetPath('assets/images/toggle_aan.svg');
    const toggleUitImg = getAssetPath('assets/images/toggle_uit.svg');
    const filterButtonImg = document.getElementById('filter-button-img');
    filterButtonImg.src = filterRayon ? toggleUitImg : toggleAanImg;
  };
  setToggleImg();
  document.getElementById('filter-button').addEventListener('click', function (evt) {
    if (!hasRayon()) {
      return;
    }
    filterRayon = !filterRayon;
    setToggleImg();

    // Apply filters to cached data instead of refetching
    Object.keys(layerConfig).forEach((layerKey) => {
      if (layerConfig[layerKey].type === 'vector') {
        applyFiltersToLayer(layerKey);
      }
    });
  });
  // Add Choices.js event listeners
  selectElement.addEventListener('addItem', function (event) {
    selectedRayons[event.detail.value] = true;
    filterRayon = true;

    // Update placeholder visibility
    updateRayonPlaceholder();

    // Save to cookie automatically
    saveToCookie();

    // Apply filters to cached data instead of refetching
    Object.keys(layerConfig).forEach((layerKey) => {
      if (layerConfig[layerKey].type === 'vector') {
        applyFiltersToLayer(layerKey);
      }
    });
  });

  selectElement.addEventListener('removeItem', function (event) {
    selectedRayons[event.detail.value] = false;
    if (!hasRayon()) {
      document.getElementById('filter-button-img').src = getAssetPath(
        'assets/images/toggle_aan.svg'
      );
      filterRayon = false;
    }

    // Update placeholder visibility
    updateRayonPlaceholder();

    // Save to cookie automatically
    saveToCookie();

    // Apply filters to cached data instead of refetching
    Object.keys(layerConfig).forEach((layerKey) => {
      if (layerConfig[layerKey].type === 'vector') {
        applyFiltersToLayer(layerKey);
      }
    });
  });

  // Helper function to generate sources from layerConfig
  const generateSources = () => {
    const sources = {
      osm: {
        type: 'raster',
        tiles: [
          import.meta.env.VITE_TILE_SERVER_URL_TEMPLATE ||
            'https://kaartserver.incidentcentrale.nl/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        minZoom: 7,
        maxZoom: 17,
        bounds: [2.81, 50.29, 8.43, 53.75],
      },
    };

    // Add sources from layerConfig
    Object.keys(layerConfig).forEach((layerId) => {
      const layerDef = layerConfig[layerId];

      if (layerDef.type === 'vector') {
        // Vector sources start with empty data, loaded dynamically
        sources[layerId] = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        };
      } else if (layerDef.type === 'raster') {
        // Raster sources use WMS tiles
        sources[layerId + '-wms'] = {
          type: 'raster',
          tiles: [layerDef.sourceUrl],
          tileSize: 256,
        };
      }
    });

    return sources;
  };

  // Convert EPSG:3857 coordinates [570000, 6817000] to WGS84 [lng, lat]
  // This is approximately [5.12, 52.37] (Netherlands center)
  const map = new Map({
    container: 'map',
    style: {
      version: 8,
      sprite: getBaseUrl('sprite'), // Absolute URL required by MapLibre
      glyphs: getBaseUrl('fonts/{fontstack}/{range}.pbf'), // Local font glyphs for text rendering
      sources: generateSources(),
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minZoom: 7,
          maxZoom: 17,
          paint: {
            'raster-fade-duration': 0,
          },
        },
        // Generate only raster layers from layerConfig
        // Vector layers will be added properly after sprite loading
        // Sort by zIndex for proper map drawing order (lower zIndex = drawn first/behind)
        ...Object.keys(layerConfig)
          .filter((layerId) => layerConfig[layerId].type === 'raster')
          .sort((a, b) => layerConfig[a].zIndex - layerConfig[b].zIndex)
          .map((layerId) => {
            const layerDef = layerConfig[layerId];

            return {
              id: layerId,
              type: 'raster',
              source: layerId + '-wms',
              layout: {
                visibility: layerInfo[layerId] ? 'visible' : 'none',
              },
              paint: {
                'raster-fade-duration': 0,
              },
            };
          }),
      ],
    },
    // In production we disable style validation to avoid strict validation errors
    // during deploys where sprite/glyph URLs might be rewritten. Use Vite's
    // import.meta.env.PROD flag to detect production mode.
    validateStyle: import.meta.env.PROD ? false : true,
    center: [5.12, 52.37], // Netherlands center in WGS84
    zoom: 8,
    maxZoom: 17,
    minZoom: 7,
    // maxBounds: [2.81, 50.29, 8.43, 53.75], // Netherlands bounds in WGS84
    attributionControl: false, // Disable default attribution control
    locale: {
      'AttributionControl.ToggleAttribution': 'Bronvermelding',

      'NavigationControl.ZoomIn': 'Zoom in',
      'NavigationControl.ZoomOut': 'Zoom uit',
    },
    dragRotate: false, // Disable map rotation with right-click + drag
    touchZoomRotate: false, // Disable rotation on touch devices
    pitchWithRotate: false, // Disable pitch when rotating
    touchPitch: false, // Disable pitch on touch devices
  });

  // Add zoom control to the map (zoom buttons only, no compass)
  // Determine position based on initial screen size
  const navPosition = window.innerWidth < 800 ? 'bottom-left' : 'top-left';
  map.addControl(
    new NavigationControl({
      showCompass: false,
      showZoom: true,
    }),
    navPosition
  );

  // Add custom attribution control without MapLibre prefix (collapsible)
  map.addControl(
    new AttributionControl({
      customAttribution:
        '<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>',
      compact: true,
    }),
    'bottom-right'
  );

  // Force map resize after DOM is loaded to fix 15px gap issue
  // This ensures the canvas size matches the container size after CSS Grid layout is complete
  requestAnimationFrame(() => {
    map.resize();
  });

  // Load initial data for visible layers
  map.on('load', async () => {
    try {
      // Sprite is automatically loaded from /sprite.png and /sprite.json by MapLibre

      // Create all vector layers with proper sprite-based styling
      // These layers were not created in the initial style - we add them here once sprites are loaded

      // Define the dynamic icon expression for actueel layer (priority-based colors)
      const actueleIconExpression = [
        'case',
        // If cirkel is enabled AND incident_type is not 'Ongeval', use circles
        ['all', ['literal', cirkel], ['!=', ['get', 'incident_type'], 'Ongeval']],
        [
          'case',
          ['==', ['get', 'nummer'], 'een'],
          'circle-red',
          ['==', ['get', 'nummer'], 'twee'],
          'circle-orange',
          ['in', ['get', 'nummer'], ['literal', ['drie', 'vier', 'vijf']]],
          'circle-yellow',
          'circle-gray', // default circle
        ],
        // Otherwise use triangles
        [
          'case',
          ['==', ['get', 'nummer'], 'een'],
          'triangle-red',
          ['==', ['get', 'nummer'], 'twee'],
          'triangle-orange',
          ['in', ['get', 'nummer'], ['literal', ['drie', 'vier', 'vijf']]],
          'triangle-yellow',
          'triangle-gray', // default triangle
        ],
      ];

      // Define the icon expression for uur and vandaag layers (light gray only)
      const uureVandaagIconExpression = [
        'case',
        // If cirkel is enabled AND incident_type is not 'Ongeval', use circles
        ['all', ['literal', cirkel], ['!=', ['get', 'incident_type'], 'Ongeval']],
        'circle-lightgray', // Light gray circle
        'triangle-lightgray', // Light gray triangle
      ];

      // Helper function to get insertion point for proper layer ordering by zIndex
      const getLayerInsertionPoint = (targetZIndex) => {
        const layers = map.getStyle().layers;
        for (let i = layers.length - 1; i >= 0; i--) {
          const layer = layers[i];
          // Find corresponding layer configuration
          const layerConfigEntry = Object.entries(layerConfig).find(
            ([key, config]) => config.type === 'raster' && layer.id === key
          );
          if (layerConfigEntry && layerConfigEntry[1].zIndex < targetZIndex) {
            return layer.id;
          }
        }
        return undefined; // Insert at the bottom
      };

      // Add vector layers in zIndex order to ensure proper layering
      const vectorLayers = [
        {
          id: 'vandaag',
          zIndex: layerConfig.vandaag.zIndex,
          expression: uureVandaagIconExpression,
          size: 1.0,
        },
        {
          id: 'uur',
          zIndex: layerConfig.uur.zIndex,
          expression: uureVandaagIconExpression,
          size: 1.0,
        },
        {
          id: 'actueel',
          zIndex: layerConfig.actueel.zIndex,
          expression: actueleIconExpression,
          size: 1.0,
        },
      ];

      // Sort by zIndex to add in correct order
      vectorLayers.sort((a, b) => a.zIndex - b.zIndex);

      vectorLayers.forEach(({ id, expression, size }) => {
        const layerName = id + '-layer';
        const beforeLayerId = getLayerInsertionPoint(layerConfig[id].zIndex);

        // Add symbol layer for icons
        map.addLayer(
          {
            id: layerName,
            type: 'symbol',
            source: id,
            layout: {
              visibility: layerInfo[id] ? 'visible' : 'none',
              'icon-image': expression,
              'icon-size': size,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            },
          },
          beforeLayerId
        );

        // Add text layer for labels
        const textLayerName = id + '-labels';
        const textExpression = [
          'concat',
          ['get', 'bps'],
          '\n',
          ['get', 'tijdstip'],
          '\n',
          ['get', 'incident_type'],
        ];

        // Configure text layer based on layer type
        const textLayerConfig = {
          id: textLayerName,
          type: 'symbol',
          source: id,
          layout: {
            visibility: layerInfo[id] ? 'visible' : 'none',
            'text-field': textExpression,
            'text-font': ['Open Sans Bold'],
            'text-size': 11,
            'text-offset': [0, -3],
            'text-anchor': 'center',
            'text-allow-overlap': true,
            'text-ignore-placement': false,
          },
          paint: {
            'text-color': id === 'actueel' ? '#00007a' : '#000000',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1.5,
          },
        };

        // For uur and vandaag layers, only show labels at high zoom levels (equivalent to resolution <= 78)
        // OpenLayers resolution ~78 corresponds to zoom level ~10-11 in MapLibre
        if (id === 'uur' || id === 'vandaag') {
          textLayerConfig.layout['text-size'] = [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            0, // Hide text below zoom 10
            10,
            11, // Show text at full size from zoom 11+
          ];
        }

        map.addLayer(textLayerConfig, beforeLayerId);
      });
    } catch (error) {
      console.error('Failed to load triangle images:', error);
    }

    // Apply layer visibility settings from `layerInfo` to MapLibre layers/UI
    applyLayerVisbility();
    // Load data for visible layers
    if (layerInfo.actueel) {
      loadGeoJSON('actueel');
    }
    if (layerInfo.uur) {
      loadGeoJSON('uur');
    }
    if (layerInfo.vandaag) {
      loadGeoJSON('vandaag');
    }
  });

  // Initialize autocomplete after map is created (so map.easeTo() works)
  new Autocomplete('#autocomplete', {
    autoSelect: true,
    search: (input) => {
      // Use PDOK Locatieserver suggest API with env variable
      const PDOK_API_BASE = import.meta.env.VITE_PDOK_API_BASE;
      // Remove commas and periods from input before searching
      const cleanInput = input.replace(/[,.]/g, '');
      const url = `${PDOK_API_BASE}/suggest?rows=10&fq=type:hectometerpaal&fl=id,score,type,hectometernummer,hectometerletter,wegnummer&q=${encodeURIComponent(cleanInput)}`;
      if (cleanInput.length < 3) {
        return Promise.resolve([]);
      }
      return fetch(url)
        .then((response) => response.json())
        .then((data) => data.response.docs);
    },
    getResultValue: (result) => {
      if (result.type === 'hectometerpaal') {
        const hm = (parseInt(result.hectometernummer, 10) / 10).toFixed(1);
        const letter = result.hectometerletter ? ` ${result.hectometerletter}` : '';
        return `Hectometerpaal ${result.wegnummer}-${hm}${letter}`;
      }
      return result.weergavenaam;
    },
    onSubmit: (result) => {
      if (result && result.id) {
        const PDOK_API_BASE = import.meta.env.VITE_PDOK_API_BASE;
        const getUrl = `${PDOK_API_BASE}/lookup?id=${result.id}`;
        fetch(getUrl)
          .then((response) => response.json())
          .then((data) => {
            const zoomlevel = {
              gemeente: 9,
              woonplaats: 9,
              weg: 14,
              hectometerpaal: 18,
              postcode: 14,
              adres: 14,
            };
            const doc = data.response.docs[0];
            const location = {
              center: doc.centroide_ll
                .slice(6, -1)
                .split(' ')
                .map((x) => parseFloat(x, 10)),
              zoom: zoomlevel[doc.type],
            };
            // Use the map instance to fly to the selected location
            map.easeTo({
              center: location.center,
              zoom: location.zoom,
              duration: 10,
            });
          });
      }
    },
  });

  // MapLibre popup implementation
  let currentPopup = null;

  // Helper function to generate popup HTML content from feature properties
  const generatePopupContent = (properties) => {
    let html =
      '<h3 class="popover-title">Info</h3><div id="popup-content" class="popover-content"><table class="table"><tbody>';
    html += '<tr><td>IM nummer</td><td>' + (properties.meldnr || '') + '</td></tr>';
    html += '<tr><td>Locatie</td><td>' + (properties.bps || '') + '</td></tr>';
    html += '<tr><td>Tijdstip</td><td>' + (properties.tijdstip || '') + '</td></tr>';

    // Handle type replacements like in original code
    let incidentType = properties.incident_type || '';
    incidentType = incidentType
      .replace('Pech', 'Pechverplaatsing')
      .replace('Onbeheerd', 'Onbeheerd voertuig');
    html += '<tr><td>Type</td><td>' + incidentType + '</td></tr>';

    html += '<tr><td>Berger</td><td>' + (properties.berger || '') + '</td></tr>';
    html += '<tr><td>Melder</td><td>' + (properties.melder || '') + '</td></tr>';
    html += '<tr><td>ETA</td><td>' + (properties.aankomst || '') + '</td></tr>';
    html += '</tbody></table></div>';
    return html;
  };

  // Add click event listener to map for popup functionality
  map.on('click', (e) => {
    // Close existing popup
    if (currentPopup) {
      currentPopup.remove();
      currentPopup = null;
    }

    // Query rendered features at the click point
    const features = map.queryRenderedFeatures(e.point, {
      // Only query vector layers that contain incident data
      layers: ['actueel-layer', 'uur-layer', 'vandaag-layer'],
    });

    if (features.length > 0) {
      // Use the first feature found
      const feature = features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const properties = feature.properties;

      // Ensure popup appears over the feature, not offset
      // Handle the case where multiple identical features might be at the same coordinate
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Generate popup content
      const popupContent = generatePopupContent(properties);

      // Create new MapLibre popup
      currentPopup = new Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '276px',
        className: 'popover',
      })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
    }
  });

  // Change cursor to pointer when hovering over incident features
  map.on('mouseenter', ['actueel-layer', 'uur-layer', 'vandaag-layer'], () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change cursor back when leaving incident features
  map.on('mouseleave', ['actueel-layer', 'uur-layer', 'vandaag-layer'], () => {
    map.getCanvas().style.cursor = '';
  });

  const setBeepImg = () => {
    const soundOnImg = getAssetPath('assets/images/sound_on.svg');
    const soundOffImg = getAssetPath('assets/images/sound_off.svg');
    const beepButtonImg = document.getElementById('beep-button-img');
    beepButtonImg.src = allowBeep ? soundOnImg : soundOffImg;
  };
  setBeepImg();

  document.getElementById('beep-button').addEventListener('click', function (evt) {
    allowBeep = !allowBeep;
    setBeepImg();
  });
  const beep = function () {
    const sound = new Audio(
      'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
    );
    // Handle autoplay policy - browsers require user interaction before playing audio
    const playPromise = sound.play();

    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        // Audio playback failed due to autoplay policy
        // You could show a visual notification instead, or do nothing
      });
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const formatHour = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const setDateTime = function () {
    const dateElement = document.getElementById('date');
    const hourElement = document.getElementById('hour');
    const date = new Date();
    if (dateElement) {
      dateElement.innerHTML = formatDate(date);
    }
    if (hourElement) {
      hourElement.innerHTML = formatHour(date);
    }
  };

  // MapLibre feature reloading
  const reloadFeatures = async () => {
    setDateTime();

    const loadPromises = [];
    const layerKeys = ['actueel', 'uur', 'vandaag'];

    for (const layerKey of layerKeys) {
      // Check if layer is visible in MapLibre
      const layer = map.getLayer(layerKey + '-layer');
      if (layer && map.getLayoutProperty(layerKey + '-layer', 'visibility') === 'visible') {
        loadPromises.push(loadGeoJSON(layerKey));
      }
    }

    // Wait for all layers to load
    await Promise.all(loadPromises);
  };

  // melders filter
  const melder_filter = document.getElementById('filter-melder');
  const melders = [
    {
      id: '0',
      title: 'Politiemeldkamer',
      items: ['Politiemeldkamer', 'KLPD'],
    },
    {
      id: '1',
      title: 'Verkeerscentrale',
      items: ['Verkeerscentrale'],
    },
    {
      id: '2',
      title: 'ANWB',
      items: ['ANWB'],
    },
    {
      id: '3',
      title: 'Alarmcentrale',
      items: ['SOS International', 'Allianz Global Assistance', 'Eurocross', 'VHD'],
    },
    {
      id: '5',
      title: 'Elektr. Detectie Ongevallen',
      items: ['EDO'],
    },
    {
      id: '4',
      title: 'Onbekend',
      items: ['Overig', 'Wegbeheerder'],
    },
  ];

  // Initialize selectedMelders based on selectedMeldersCat and melders configuration
  for (let m = 0, mm = melders.length; m < mm; ++m) {
    const isSelected = selectedMeldersCat[melders[m].id];
    for (let itemI = 0, itemII = melders[m].items.length; itemI < itemII; ++itemI) {
      selectedMelders[melders[m].items[itemI].toLowerCase()] = isSelected;
    }
  }

  let m, mm;
  const handleMelderFilter = function (evt) {
    for (m = 0, mm = melders.length; m < mm; ++m) {
      if (melders[m].id === evt.target.value) {
        selectedMeldersCat[evt.target.value] = evt.target.checked;
        for (let itemI = 0, itemII = melders[m].items.length; itemI < itemII; ++itemI) {
          selectedMelders[melders[m].items[itemI].toLowerCase()] = evt.target.checked;
        }
        break;
      }
    }
    filterMelder = true;

    // Apply filters to cached data instead of refetching
    Object.keys(layerConfig).forEach((layerKey) => {
      if (layerConfig[layerKey].type === 'vector') {
        applyFiltersToLayer(layerKey);
      }
    });

    // Save filter state to cookie
    saveToCookie();
  };
  for (m = 0, mm = melders.length; m < mm; ++m) {
    const checked = selectedMeldersCat[melders[m].id] ? ' checked' : '';
    melder_filter.insertAdjacentHTML(
      'beforeend',
      '<label><input id="melder_' +
        melders[m].id +
        '" type="checkbox" value="' +
        melders[m].id +
        '"' +
        checked +
        '/><i class="mi mi-check"></i>' +
        melders[m].title +
        '</label>'
    );
    document
      .getElementById('melder_' + melders[m].id)
      .addEventListener('change', handleMelderFilter);
  }

  const setMelderFilter = function () {
    for (let i = 0, ii = melders.length; i < ii; ++i) {
      const checked = selectedMeldersCat[melders[i].id];
      const melderElement = document.getElementById('melder_' + melders[i].id);
      melderElement.checked = checked;
      if (!checked) {
        handleMelderFilter({ target: melderElement });
      }
    }
  };
  setMelderFilter();

  const handleTypeFilter = function (evt) {
    selectedTypes[evt.target.value] = evt.target.checked;
    filterType = true;

    // Apply filters to cached data instead of refetching
    Object.keys(layerConfig).forEach((layerKey) => {
      if (layerConfig[layerKey].type === 'vector') {
        applyFiltersToLayer(layerKey);
      }
    });

    // Save filter state to cookie
    saveToCookie();
  };

  const typeContainer = document.getElementById('filter-type');
  const typeOptions = [
    {
      id: '0',
      title: 'Ongeval',
    },
    {
      id: '1',
      title: 'Pech en overig',
    },
  ];

  let t, tt;

  for (t = 0, tt = typeOptions.length; t < tt; ++t) {
    const checked = selectedTypes[typeOptions[t].id] ? ' checked' : '';
    typeContainer.insertAdjacentHTML(
      'beforeend',
      '<label><input id="type_' +
        typeOptions[t].id +
        '" type="checkbox" value="' +
        typeOptions[t].id +
        '"' +
        checked +
        '/><i class="mi mi-check"></i>' +
        typeOptions[t].title +
        '</label>'
    );
    document
      .getElementById('type_' + typeOptions[t].id)
      .addEventListener('change', handleTypeFilter);
  }

  const setTypeFilter = function () {
    for (t = 0, tt = typeOptions.length; t < tt; ++t) {
      const checked = selectedTypes[typeOptions[t].id];
      const typeElement = document.getElementById('type_' + typeOptions[t].id);
      typeElement.checked = checked;
      if (!checked) {
        handleTypeFilter({ target: typeElement });
      }
    }
  };
  setTypeFilter();

  const applyLayerVisbility = function () {
    const inputs = document.querySelectorAll('#layer-body input');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = input.id;
      const key = id.replace('vis_', '');
      const visible = !!layerInfo[key];
      input.checked = visible;

      // Use layerConfig to determine MapLibre layer id mapping
      if (layerConfig[key]) {
        const layerDef = layerConfig[key];
        const mapLayerId = layerDef.type === 'vector' ? key + '-layer' : key;
        const textLayerId = layerDef.type === 'vector' ? key + '-labels' : null;

        // If the map and layer exist, update MapLibre layer visibility
        try {
          if (map && typeof map.getLayer === 'function' && map.getLayer(mapLayerId)) {
            map.setLayoutProperty(mapLayerId, 'visibility', visible ? 'visible' : 'none');

            // Also update text layer visibility for vector layers
            if (textLayerId && map.getLayer(textLayerId)) {
              map.setLayoutProperty(textLayerId, 'visibility', visible ? 'visible' : 'none');
            }
          }
        } catch (e) {
          // Ignore errors if layer isn't present yet
        }
      }
    }
  };

  // MapLibre layer list control - create checkboxes for layer visibility
  const layerBody = document.getElementById('layer-body');

  // Create checkboxes for each layer using the unified layerConfig
  // Sort by order property to maintain consistent UI layout
  const sortedLayerKeys = Object.keys(layerConfig).sort(
    (a, b) => layerConfig[a].order - layerConfig[b].order
  );

  sortedLayerKeys.forEach((layerId) => {
    const layerDef = layerConfig[layerId];
    const checked = layerInfo[layerId] ? ' checked' : '';
    const checkboxHtml = `<label><input id="vis_${layerId}" type="checkbox" value=""${checked}/><i class="mi mi-check"></i>${layerDef.title}</label>`;
    layerBody.insertAdjacentHTML('beforeend', checkboxHtml);

    // Add event listener for checkbox changes
    document.getElementById('vis_' + layerId).addEventListener('change', function (evt) {
      const visible = evt.target.checked;

      // Update layerInfo object
      layerInfo[layerId] = visible;

      // Get MapLibre layer id (vector layers have '-layer' suffix)
      const mapLayerId = layerDef.type === 'vector' ? layerId + '-layer' : layerId;

      // Update MapLibre layer visibility
      if (map && map.getLayer(mapLayerId)) {
        map.setLayoutProperty(mapLayerId, 'visibility', visible ? 'visible' : 'none');

        // Also update text layer visibility for vector layers
        const textLayerId = layerDef.type === 'vector' ? layerId + '-labels' : null;
        if (textLayerId && map.getLayer(textLayerId)) {
          map.setLayoutProperty(textLayerId, 'visibility', visible ? 'visible' : 'none');
        }

        // Load data for vector layers when made visible
        if (layerDef.type === 'vector' && visible) {
          loadGeoJSON(layerId);
        }
      }

      // Save layer visibility to cookies
      saveToCookie();
    });
  });

  // Collapse/expand sidebar (aside) with sliding effect and resize map
  const eastPanel = document.querySelector('aside');
  const collapseButton = document.getElementById('collapse-button');
  const mapContainer = document.getElementById('map');
  collapseButton.addEventListener('click', function () {
    eastPanel.classList.toggle('collapsed');
    if (eastPanel.classList.contains('collapsed')) {
      mapContainer.style.width = 'calc(100vw - 15px)';
    } else {
      mapContainer.style.width = 'calc(100vw - 340px)';
    }
    if (window.map && typeof window.map.resize === 'function') {
      window.map.resize();
    }
  });

  const onChangeCirkel = function (evt) {
    cirkel = evt.target.checked;

    // Store preference in cookie using the existing function
    saveToCookie();

    // Update map layers with new styling
    if (map) {
      // Define the dynamic icon expression for actueel layer (priority-based colors)
      const actueleIconExpression = [
        'case',
        // If cirkel is enabled AND incident_type is not 'Ongeval', use circles
        ['all', ['literal', cirkel], ['!=', ['get', 'incident_type'], 'Ongeval']],
        [
          'case',
          ['==', ['get', 'nummer'], 'een'],
          'circle-red',
          ['==', ['get', 'nummer'], 'twee'],
          'circle-orange',
          ['in', ['get', 'nummer'], ['literal', ['drie', 'vier', 'vijf']]],
          'circle-yellow',
          'circle-gray', // default circle
        ],
        // Otherwise use triangles
        [
          'case',
          ['==', ['get', 'nummer'], 'een'],
          'triangle-red',
          ['==', ['get', 'nummer'], 'twee'],
          'triangle-orange',
          ['in', ['get', 'nummer'], ['literal', ['drie', 'vier', 'vijf']]],
          'triangle-yellow',
          'triangle-gray', // default triangle
        ],
      ];

      // Define the icon expression for uur and vandaag layers (light gray only)
      const uureVandaagIconExpression = [
        'case',
        // If cirkel is enabled AND incident_type is not 'Ongeval', use circles
        ['all', ['literal', cirkel], ['!=', ['get', 'incident_type'], 'Ongeval']],
        'circle-lightgray', // Light gray circle
        'triangle-lightgray', // Light gray triangle
      ];

      // Update actueel layer
      try {
        if (map.getLayer && map.getLayer('actueel-layer')) {
          console.log('Updating actueel-layer with new circle preference');
          map.setLayoutProperty('actueel-layer', 'icon-image', actueleIconExpression);
        }
      } catch (error) {
        console.error('Error updating actueel-layer:', error);
      }

      // Update uur and vandaag layers
      ['uur-layer', 'vandaag-layer'].forEach((layerName) => {
        try {
          if (map.getLayer && map.getLayer(layerName)) {
            map.setLayoutProperty(layerName, 'icon-image', uureVandaagIconExpression);
          }
        } catch (error) {
          console.error(`Error updating layer ${layerName}:`, error);
        }
      });
    }
  };

  document.getElementById('cirkel').addEventListener('change', onChangeCirkel);

  setDateTime();
  window.setInterval(reloadFeatures, 10000);
});
