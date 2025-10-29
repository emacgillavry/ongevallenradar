// Import CSS dependencies first (OpenLayers CSS loaded via HTML)
import 'choices.js/public/assets/styles/choices.min.css';

// Import dependencies
import Cookies from 'js-cookie';
import Choices from 'choices.js';

// OpenLayers is loaded via HTML script tag, so it's available as global 'ol'

// Start the main application code
(function() {
  // Cookie config
  const cookieName = 'ongevallenradar';
  let cookieInfo;
  const loadCookie = function() {
    const cookieValue = Cookies.get(cookieName);
    cookieInfo = cookieValue ? JSON.parse(cookieValue) : null;
  }
  loadCookie();
  // Filter types
  let filterType;
  let selectedTypes;
  const defaultTypes = {
    0: true,
    1: true
  };
  const loadTypesFromCookie = function() {
    filterType = cookieInfo ? cookieInfo.filterType : false;
    selectedTypes = cookieInfo ? cookieInfo.selectedTypes : defaultTypes;
  }
  loadTypesFromCookie();

  // Beep configuration
  let allowBeep;
  const loadBeepFromCookie = function() {
    allowBeep = cookieInfo ? cookieInfo.allowBeep : true;
  }
  loadBeepFromCookie();
  // Melder configuration
  const selectedMelders = {};
  let selectedMeldersCat;
  let filterMelder;
  const defaultMeldersCat = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };
  const loadMelderInfoFromCookie = function() {
    selectedMeldersCat = cookieInfo ? cookieInfo.selectedMeldersCat : defaultMeldersCat;
    filterMelder = cookieInfo ? cookieInfo.filterMelder : false;
  }
  loadMelderInfoFromCookie();
  let selectedRayons;
  let filterRayon;
  const loadRayonInfoFromCookie = function() {
    selectedRayons = cookieInfo ? cookieInfo.selectedRayons : {};
    filterRayon = cookieInfo ? cookieInfo.filterRayon : false;
  }
  loadRayonInfoFromCookie();

  const defaultLayerInfo = {
    uur: true,
    actueel: true
  };
  let layerInfo;
  const loadLayerInfoFromCookie = function() {
    layerInfo = cookieInfo ? cookieInfo.layers : defaultLayerInfo;
  }
  loadLayerInfoFromCookie();

  // Cirkel configuration
  let cirkel;
  const loadCirkelFromCookie = function() {
    cirkel = cookieInfo ? cookieInfo.cirkel : false;
    document.getElementById('cirkel').checked = cirkel;
  }
  loadCirkelFromCookie();

  const geoserverHost = import.meta.env.VITE_WFS_HOST || 'https://geoserver.stichtingimn.nl';
  const geoserverPath = import.meta.env.VITE_WFS_PATH || '/geoserver/ows';
  const geoserverUrl = `${geoserverHost}${geoserverPath}?`;

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
    'ZH163a'
  ];

  const imageStyles = {
    actueel: {
      een: {
        normal: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: '#FF0000'}),
          stroke: new ol.style.Stroke({color: '#990000', width: 2}),
          points: 3,
          radius: 13.5,
          angle: 0
        }),
        circle: new ol.style.Circle({
          fill: new ol.style.Fill({color: '#FF0000'}),
          stroke: new ol.style.Stroke({color: '#990000', width: 2}),
          radius: 9
        })
      },
      twee: {
        normal: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: '#FF6600'}),
          stroke: new ol.style.Stroke({color: '#B84F09', width: 2}),
          points: 3,
          radius: 13.5,
          angle: 0
        }),
        circle: new ol.style.Circle({
          fill: new ol.style.Fill({color: '#FF6600'}),
          stroke: new ol.style.Stroke({color: '#B84F09', width: 2}),
          radius: 9
        })
      },
      drie: {
        normal: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          points: 3,
          radius: 13.5,
          angle: 0
        }),
        circle: new ol.style.Circle({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          radius: 9
        })
      },
      vier: {
        normal: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          points: 3,
          radius: 13.5,
          angle: 0
        }),
        circle: new ol.style.Circle({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          radius: 9
        })
      },
      vijf: {
        normal: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          points: 3,
          radius: 13.5,
          angle: 0
        }),
        circle: new ol.style.Circle({
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: '#99990B', width: 2}),
          radius: 9
        })
      }
    },
    uur: {
      normal: new ol.style.RegularShape({
        fill: new ol.style.Fill({color: '#E5E5E5'}),
        stroke: new ol.style.Stroke({color: '#4C4C4C', width: 2}),
        points: 3,
        radius: 10,
        angle: 0
      }),
      circle: new ol.style.Circle({
        fill: new ol.style.Fill({color: '#E5E5E5'}),
        stroke: new ol.style.Stroke({color: '#4C4C4C', width: 2}),
        radius: 8
      })
    }
  };

  const fetchGeoJSON = async function(url, scope) {
    try {
      const response = await fetch(url.replace('%output%', 'application/json'));
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const jsonData = await response.json();
      return { success: true, data: jsonData, scope: scope };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false, error: error, scope: scope };
    }
  };

  let styleCache = {};
  let styleCacheUur = {};
  let styleCacheVandaag = {};

  const geojsonFormat = new ol.format.GeoJSON();

  const sourceUrls = {
    actueel: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%`,
    uur: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:uur&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%`,
    vandaag: `${geoserverUrl}service=WFS&request=GetFeature&typename=meldingen:vandaag&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%`
  };

  const sources = {
    actueel: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: sourceUrls.actueel.replace('%output%', 'application/json'),
      format: geojsonFormat
    }),
    uur: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: sourceUrls.uur.replace('%output%', 'application/json'),
      format: geojsonFormat
    }),
    vandaag: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: sourceUrls.vandaag.replace('%output%', 'application/json'),
      format: geojsonFormat
    })
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

  const layers = {
    uur: new ol.layer.Vector({
      zIndex: 4,
      visible: !!layerInfo.uur,
      id: 'uur',
      title: 'Meldingen laatste zestig minuten',
      style: function(feature, resolution) {
        const showLabel = resolution <= 78;
        if (filterFunction(feature) === false) {
          return null;
        }
        const text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
        if (!styleCacheUur[showLabel + '|' + text]) {
          styleCacheUur[showLabel + '|' + text]= new ol.style.Style({
            text: showLabel ? new ol.style.Text({
              fill: new ol.style.Fill({color: '#000000'}),
              stroke: new ol.style.Stroke({color: '#FFFFFF', width: 1.5}),
              font: 'bold 11px Arial',
              offsetY: -35,
              text: text
            }) : undefined,
            image: imageStyles.uur[(cirkel && feature.get('incident_type') !== 'Ongeval') ? 'circle' : 'normal']
          });
        }
        return styleCacheUur[showLabel + '|' + text];
      },
      source: sources.uur
    }),
    vandaag: new ol.layer.Vector({
      zIndex: 4,
      visible: !!layerInfo.vandaag,
      id: 'vandaag',
      title: 'Meldingen vandaag',
      style: function(feature, resolution) {
        const showLabel = resolution <= 78;
        if (filterFunction(feature) === false) {
          return null;
        }
        const text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
        if (!styleCacheVandaag[showLabel + '|' + text]) {
          styleCacheVandaag[showLabel + '|' + text]= new ol.style.Style({
            text: showLabel ? new ol.style.Text({
              fill: new ol.style.Fill({color: '#000000'}),
              stroke: new ol.style.Stroke({color: '#FFFFFF', width: 1.5}),
              font: 'bold 11px Arial',
              offsetY: -35,
              text: text
            }) : undefined,
            image: imageStyles.uur[(cirkel && feature.get('incident_type') !== 'Ongeval') ? 'circle' : 'normal']
          });
        }
        return styleCacheVandaag[showLabel + '|' + text];
      },
      source: sources.vandaag
    }),
    actueel: new ol.layer.Vector({
      visible: !!layerInfo.actueel,
      zIndex: 5,
      id: 'actueel',
      title: 'Actuele meldingen',
      style: function(feature, resolution) {
        const nummer = feature.get('nummer');
        if (filterFunction(feature) === false) {
          return null;
        }
        const text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
        if (!styleCache[nummer + '|' + text]) {
          styleCache[nummer + '|' + text] = new ol.style.Style({
            text: new ol.style.Text({
              fill: new ol.style.Fill({color: '#00007a'}),
              stroke: new ol.style.Stroke({color: '#FFFFFF', width: 1.5}),
              font: 'bold 11px Arial',
              offsetY: -35,
              text: text
            }),
            image: imageStyles.actueel[nummer][(cirkel && feature.get('incident_type') !== 'Ongeval') ? 'circle' : 'normal']
          });
        }
        return styleCache[nummer + '|' + text];
      },
      source: sources.actueel
    })
  };

  // initial load of features
  const loadLayerData = async (key, source) => {
    const result = await fetchGeoJSON(sourceUrls[key], {source: source, key: key});
    if (result.success) {
      const features = result.scope.source.getFormat().readFeatures(result.data);
      result.scope.source.addFeatures(features);
    }
  };

  for (const key in layers) {
    const source = sources[key];
    if (layers[key].getVisible()) {
      loadLayerData(key, source);
    } else {
      layers[key].once('change:visible', (evt) => {
        if (evt.target.getVisible()) {
          loadLayerData(key, source);
        }
      });
    }
  }

  // Initialize Choices.js with rayons as choices
  const selectElement = document.getElementById('sel-rayon');
  const rayonChoices = new Choices(selectElement, {
    removeItemButton: true,
    searchEnabled: false,
    itemSelectText: '',
    noResultsText: 'Geen resultaten gevonden',
    noChoicesText: 'Geen keuzes beschikbaar',
    choices: rayons.map(function(rayon) {
      return {
        value: rayon,
        label: rayon,
        selected: selectedRayons[rayon] === true
      };
    })
  });

  const hasRayon = () => Object.values(selectedRayons).some(selected => selected === true);

  document.getElementById('save').addEventListener('click', function(evt) {
    const json = {};
    json.layers = {};
    const inputs = document.querySelectorAll("#layer-body input");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      json.layers[input.id.replace('vis_', '')] = input.checked;
    }
    json.filterRayon = filterRayon;
    json.selectedRayons = selectedRayons;
    json.filterMelder = filterMelder;
    json.selectedMeldersCat = selectedMeldersCat;
    json.cirkel = cirkel;
    json.allowBeep = allowBeep;
    json.filterType = filterType;
    json.selectedTypes = selectedTypes;
    Cookies.set(cookieName, JSON.stringify(json));
  });

  document.getElementById('clear').addEventListener('click', function(evt) {
    Cookies.remove(cookieName);
    loadCookie();
    loadCirkelFromCookie();
    onChangeCirkel({target: document.getElementById('cirkel')})
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

  document.getElementById('options').addEventListener('click', function(evt) {
    document.getElementById('mainoptions').style.display = 'none';
    document.getElementById('secondaryoptions').style.display = 'block';
  });

  document.getElementById('backtomain').addEventListener('click', function(evt) {
    document.getElementById('mainoptions').style.display = 'block';
    document.getElementById('secondaryoptions').style.display = 'none';
  });

  const setToggleImg = () => {
    const toggleAanImg = 'assets/images/toggle_aan.svg';
    const toggleUitImg = 'assets/images/toggle_uit.svg';
    const filterButtonImg = document.getElementById('filter-button-img');
    filterButtonImg.src = filterRayon ? toggleUitImg : toggleAanImg;
  };
  setToggleImg();
  document.getElementById('filter-button').addEventListener('click', function(evt){ 
    if (!hasRayon()) {
      return;
    }
    filterRayon = !filterRayon;
    setToggleImg();
    for (const key in sources) {
      const source = sources[key];
      source.changed();
    }
  });
  // Add Choices.js event listeners
  selectElement.addEventListener('addItem', function(event) {
    selectedRayons[event.detail.value] = true;
  });
  
  selectElement.addEventListener('removeItem', function(event) {
    selectedRayons[event.detail.value] = false;
    if (!hasRayon()) {
      document.getElementById('filter-button-img').src = 'assets/images/toggle_aan.svg';
      filterRayon = false;
      for (const key in sources) {
        const source = sources[key];
        source.changed();
      }
    }
  });

  const map = new ol.Map({
    controls: ol.control.defaults({attribution: false}),
    layers: [
      new ol.layer.Tile({
        extent: [313086.06785608083, 6418264.391049679, 939258.2035682462, 7200979.560689885],
        source: new ol.source.OSM({
          url: import.meta.env.VITE_TILE_SERVER_URL_TEMPLATE || 'https://kaartserver.incidentcentrale.nl/{z}/{x}/{y}.png'
        })
      }),
      new ol.layer.Tile({
        visible: !!layerInfo.rayons,
        zIndex: 3,
        id: 'rayons',
        title: 'Rayons',
        source: new ol.source.TileWMS({
          url: geoserverUrl,
          params: {'LAYERS': 'rayons:rayons', 'TILED': true, 'VERSION': '1.1.1'}
        })
      }),
      new ol.layer.Tile({
        visible: !!layerInfo.bps,
        zIndex: 3,
        id: 'bps',
        title: 'Hectometerpalen',
        source: new ol.source.TileWMS({
          url: geoserverUrl,
          params: {'LAYERS': 'bps:bps_palen', 'TILED': true, 'VERSION': '1.1.1'}
        })
      }),
      new ol.layer.Tile({
        visible: !!layerInfo.imwegen,
        zIndex: 3,
        id: 'imwegen',
        title: 'IM-wegen',
        source: new ol.source.TileWMS({
          url: geoserverUrl,
          params: {'LAYERS': 'im_wegen:imwegen', 'TILED': true, 'VERSION': '1.1.1'}
        })
      }),
      layers.vandaag,
      layers.uur,
      layers.actueel
    ],
    target: 'map',
    view: new ol.View({ minResolution: 0.5971642834779395, maxResolution: 611.49622628141, center: [570000, 6817000], zoom: 1})
  });

  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  const overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  map.addOverlay(overlay);

  map.on('click', function(evt) {
    const pixel = map.getEventPixel(evt.originalEvent);
    overlay.setPosition(undefined);
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      if (feature && layer !== null) {
        const coordinate = evt.coordinate;
        let html = '<table class="table"><tbody>';
        html += '<tr><td>IM nummer</td><td>' + feature.get('meldnr') + '</td></tr>';
        html += '<tr><td>Locatie</td><td>' + feature.get('bps') + '</td></tr>';
        html += '<tr><td>Tijdstip</td><td>' + feature.get('tijdstip') + '</td></tr>';
        html += '<tr><td>Type</td><td>' + feature.get('incident_type').replace('Pech', 'Pechverplaatsing').replace('Onbeheerd', 'Onbeheerd voertuig') + '</td></tr>';
        html += '<tr><td>Berger</td><td>' + feature.get('berger') + '</td></tr>';
        html += '<tr><td>Melder</td><td>' + feature.get('melder') + '</td></tr>';
        html += '<tr><td>ETA</td><td>' + feature.get('aankomst') + '</td></tr>';
        html += '</tbody></table>';
        content.innerHTML = html;
        overlay.setPosition(feature.getGeometry().getCoordinates());
      }
    });
  });

  const setBeepImg = () => {
    const soundOnImg = 'assets/images/sound_on.svg';
    const soundOffImg = 'assets/images/sound_off.svg';
    const beepButtonImg = document.getElementById('beep-button-img');
    beepButtonImg.src = allowBeep ? soundOnImg : soundOffImg;
  };
  setBeepImg();

  document.getElementById('beep-button').addEventListener('click', function(evt) {
    allowBeep = !allowBeep;
    setBeepImg();
  });
  const beep = function() {
    const sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    // Handle autoplay policy - browsers require user interaction before playing audio
    const playPromise = sound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(function(error) {
        // Audio playback failed due to autoplay policy
        console.log('Audio playback prevented by browser autoplay policy:', error.name);
        // You could show a visual notification instead, or do nothing
      });
    }
  };

  const sourceHasFeature = function(source, feature) {
    const sourceFeatures = source.getFeatures();
    for (let i = 0, ii = sourceFeatures.length; i < ii; ++i) {
      if (feature.get('meldnr') === sourceFeatures[i].get('meldnr')) {
        return true;
      }
    }
    return false;
  };

  const getRemove = function(source, features) {
    const sourceFeatures = source.getFeatures();
    const removeList = [];
    for (let i = 0, ii = sourceFeatures.length; i < ii; ++i) {
      const feature = sourceFeatures[i];
      let remove = true;
      for (let j = 0, jj = features.length; j < jj; ++j) {
        if (feature.get('meldnr') === features[j].get('meldnr')) {
          remove = false;
        }
      }
      if (remove === true) {
        removeList.push(feature);
      }
    }
    return removeList;
  };

  const handleNewFeatures = function(config, features) {
    let doBeep = false;
    const key = config.key;
    const source = config.source;
    let i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      const feature = features[i];
      if (!sourceHasFeature(source, feature)) {
        // only beep for actueel
        doBeep = (key === 'actueel');
        // do not beep if we are filtered
        if (filterFunction(feature) === false) {
          doBeep = false;
        }
      }
    }
    if (allowBeep && doBeep) {
      beep();
    }
    // clear the style caches
    styleCache = {};
    styleCacheUur = {};
    styleCacheVandaag = {};
    source.clear();
    source.addFeatures(features);
  };

  const formatDate = (date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const formatHour = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const setDateTime = function() {
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

  const reloadFeatures = async () => {
    setDateTime();
    
    const loadPromises = [];
    for (const key in layers) {
      if (layers[key].getVisible()) {
        const source = sources[key];
        loadPromises.push(
          fetchGeoJSON(sourceUrls[key], {source: source, key: key})
            .then(result => {
              if (result.success) {
                const features = result.scope.source.getFormat().readFeatures(result.data);
                handleNewFeatures(result.scope, features);
              }
            })
        );
      }
    }
    
    // Wait for all layers to load
    await Promise.all(loadPromises);
  };

  // melders filter
  const melder_filter = document.getElementById('filter-melder');
  const melders = [{
    id: '0',
    title: 'Politiemeldkamer',
    items: ['Politiemeldkamer', 'KLPD']
  }, {
    id: '1',
    title: 'Verkeerscentrale',
    items: ['Verkeerscentrale']
  }, {
    id: '2',
    title: 'ANWB',
    items: ['ANWB']
  }, {
    id: '3',
    title: 'Alarmcentrale',
    items: ['SOS International', 'Allianz Global Assistance', 'Eurocross', 'VHD']
  }, {
    id: '5', 
    title: 'Elektr. Detectie Ongevallen', 
    items: ['EDO'] 
  }, {
    id: '4',
    title: 'Onbekend',
    items: ['Overig', 'Wegbeheerder']
  }];
  let m, mm;
  const handleMelderFilter = function(evt) {
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
    for (const key in sources) {
      const source = sources[key];
      source.changed();
    }
  };
  for (m = 0, mm = melders.length; m < mm; ++m) {
    const checked = selectedMeldersCat[melders[m].id] ? ' checked' : '';
    melder_filter.insertAdjacentHTML('beforeend', '<div class="pretty"><input id="melder_' + melders[m].id + '" type="checkbox" value="' + melders[m].id +  '"' + checked + '/><label><i class="mi mi-check"></i>' + melders[m].title + '</label></div><br/>');
    document.getElementById('melder_' + melders[m].id).addEventListener('change', handleMelderFilter);
  }

  const setMelderFilter = function() {
    for (let i = 0, ii = melders.length; i < ii; ++i) {
      const checked = selectedMeldersCat[melders[i].id];
      const melderElement = document.getElementById('melder_' + melders[i].id);
      melderElement.checked = checked;
      if (!checked) {
        handleMelderFilter({target: melderElement});
      }
    }
  };
  setMelderFilter();

  const handleTypeFilter = function(evt) {
    selectedTypes[evt.target.value] = evt.target.checked;
    filterType = true;
    for (const key in sources) {
      const source = sources[key];
      source.changed();
    }
  }

  const typeContainer = document.getElementById('filter-type');
  const typeOptions = [{
    id: '0',
    title: 'Ongeval'
  }, {
    id: '1',
    title: 'Pech en overig'
  }];

  let t, tt;

  for (t = 0, tt = typeOptions.length; t < tt; ++t) {
    const checked = selectedTypes[typeOptions[t].id] ? ' checked' : '';
    typeContainer.insertAdjacentHTML('beforeend', '<div class="pretty"><input id="type_' + typeOptions[t].id + '" type="checkbox" value="' + typeOptions[t].id +  '"' + checked + '/><label><i class="mi mi-check"></i>' + typeOptions[t].title + '</label></div><br/>');
    document.getElementById('type_' + typeOptions[t].id).addEventListener('change', handleTypeFilter);
  }

  const setTypeFilter = function() {
    for (t = 0, tt = typeOptions.length; t < tt; ++t) {
      const checked = selectedTypes[typeOptions[t].id];
      const typeElement = document.getElementById('type_' + typeOptions[t].id);
      typeElement.checked = checked;
      if (!checked) {
        handleTypeFilter({target: typeElement});
      }
    }
  };
  setTypeFilter();

  const findLayerById = function(id) {
    const layersArray = map.getLayers().getArray()
    for (let i = 0, ii = layersArray.length; i < ii; ++i) {
      if (layersArray[i].get('id') === id) {
        return layersArray[i];
      }
    }
  };

  const applyLayerVisbility = function() {
    const inputs = document.querySelectorAll("#layer-body input");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = input.id;
      const visible = !!layerInfo[id.replace('vis_', '')];
      input.checked = visible;
      const layer = findLayerById(id.replace('vis_', ''));
      layer.setVisible(visible);
    }
  };

  // layer list control
  const layerBody = document.getElementById('layer-body');
  const layersArray = map.getLayers().getArray().reverse();
  for (let l = 0, ll = layersArray.length; l < ll; ++l) {
    const layer = layersArray[l];
    if (layer.get('title')) {
      const checked = layer.getVisible() ? ' checked' : '';
      layerBody.insertAdjacentHTML('beforeend', '<div class="pretty"><input id="vis_' + layer.get('id') + '" type="checkbox" value=""' + checked + '/><label><i class="mi mi-check"></i>' + layer.get('title') + '</label></div><br/>');
      (function(currentLayer) {
        document.getElementById('vis_' + currentLayer.get('id')).addEventListener('change', function(evt) {
          currentLayer.setVisible(evt.target.checked);
        });
      })(layer);
    }
  }

  const onChangeCirkel = function(evt) {
    cirkel = evt.target.checked;
    // clear the style caches
    styleCache = {};
    styleCacheUur = {};
    styleCacheVandaag = {};
    for (const key in sources) {
      sources[key].changed();
    }
  }

  document.getElementById('cirkel').addEventListener('change', onChangeCirkel);

  const collapsibleEl = document.getElementById('eastpanel');
  const buttonEl = document.getElementById('collapse-button');
  const mapEl = document.getElementById('map');
  const centerPanelEl = document.getElementById('centerpanel');
  let expanded = true;
  buttonEl.addEventListener('click', function() {
    if (expanded) {
      mapEl.style.width = 'calc(100% - 15px)';
      centerPanelEl.style.right = '0px';
      collapsibleEl.style.display = 'none';
    } else {
      mapEl.style.width = 'calc(100% - 340px)';
      centerPanelEl.style.right = '325px';
      collapsibleEl.style.display = '';
    }
    buttonEl.classList.toggle('expanded');
    buttonEl.classList.toggle('collapsed');
    expanded = !expanded;
    map.updateSize();
  });

  setDateTime();
  window.setInterval(reloadFeatures, 10000);
})();
