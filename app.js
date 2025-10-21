(function() {
  var cookieName = 'ongevallenradar';
  var cookieInfo;
  var loadCookie = function() {
    cookieInfo = Cookies.getJSON(cookieName);
  }
  loadCookie();
  var filterType;
  var selectedTypes;
  var defaultTypes = {
    0: true,
    1: true
  };
  var loadTypesFromCookie = function() {
    filterType = cookieInfo ? cookieInfo.filterType : false;
    selectedTypes = cookieInfo ? cookieInfo.selectedTypes : defaultTypes;
  }
  loadTypesFromCookie();

  var allowBeep;
  var loadBeepFromCookie = function() {
    allowBeep = cookieInfo ? cookieInfo.allowBeep : true;
  }
  loadBeepFromCookie();
  var selectedMelders = {};
  var selectedMeldersCat;
  var filterMelder;
  var defaultMeldersCat = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };
  var loadMelderInfoFromCookie = function() {
    selectedMeldersCat = cookieInfo ? cookieInfo.selectedMeldersCat : defaultMeldersCat;
    filterMelder = cookieInfo ? cookieInfo.filterMelder : false;
  }
  loadMelderInfoFromCookie();
  var selectedRayons;
  var filterRayon;
  var loadRayonInfoFromCookie = function() {
    selectedRayons = cookieInfo ? cookieInfo.selectedRayons : {};
    filterRayon = cookieInfo ? cookieInfo.filterRayon : false;
  }
  loadRayonInfoFromCookie();

  var defaultLayerInfo = {
    uur: true,
    actueel: true
  };
  var layerInfo;
  var loadLayerInfoFromCookie = function() {
    layerInfo = cookieInfo ? cookieInfo.layers : defaultLayerInfo;
  }
  loadLayerInfoFromCookie();

  var cirkel;
  var loadCirkelFromCookie = function() {
    cirkel = cookieInfo ? cookieInfo.cirkel : false;
    $('#cirkel').attr('checked', cirkel);
  }
  loadCirkelFromCookie();

  var geoserverHost = import.meta.env.VITE_WFS_HOST || 'geoserver.stichtingimn.nl';
  var geoserverPath = import.meta.env.VITE_WFS_PATH || '/geoserver/ows';
  var geoserverUrl = geoserverHost + geoserverPath + '?';
  var useJSONP = true;

  var rayons = [
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

  var imageStyles = {
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

  var doJSONP = function(url, success, failure, scope) {
    var cbname = 'fn' + scope.key + Date.now();
    var script = document.createElement('script');
    script.src = url.replace('%output%', 'text/javascript&format_options=callback:' + cbname);
    window[cbname] = function(jsonData) {
      success.call(scope, jsonData);
      delete window[cbname];
    };
    document.head.appendChild(script);
  };

  var doGET = function(url, success, failure, scope) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          success.call(scope, xmlhttp);
        } else if (failure) {
          failure.call(scope, xmlhttp);
        }
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
    return xmlhttp;
  };

  var styleCache = {};
  var styleCacheUur = {};
  var styleCacheVandaag = {};

  var geojsonFormat = new ol.format.GeoJSON();

  var sourceUrls = {
    actueel: geoserverUrl + 'service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%',
    uur: geoserverUrl + 'service=WFS&request=GetFeature&typename=meldingen:uur&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%',
    vandaag: geoserverUrl + 'service=WFS&request=GetFeature&typename=meldingen:vandaag&version=1.1.0&srsname=EPSG:3857&outputFormat=%output%'
  };

  var sources = {
    actueel: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: useJSONP ? undefined : sourceUrls.actueel.replace('%output%', 'application/json'),
      format: geojsonFormat
    }),
    uur: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: (useJSONP === true) ? undefined : sourceUrls.uur.replace('%output%', 'application/json'),
      format: geojsonFormat
    }),
    vandaag: new ol.source.Vector({
      useSpatialIndex: false,
      strategy: ol.loadingstrategy.all,
      url: (useJSONP === true) ? undefined : sourceUrls.vandaag.replace('%output%', 'application/json'),
      format: geojsonFormat
    })
  };

  var filterFunction = function(feature) {
    var rayon = feature.get('rayon');
    if (filterRayon === true && selectedRayons[rayon] !== true) {
      return false;
    }
    var melder = feature.get('melder').toLowerCase();
    if (filterMelder === true && selectedMelders[melder] === false) {
      return false;
    }
    var incidentType = feature.get('incident_type');
    if (filterType === true) {
      if (selectedTypes['0'] === false && selectedTypes['1'] === true) {
        return incidentType !== 'Ongeval';
      } else if (selectedTypes['0'] === true && selectedTypes['1'] === false) {
        return incidentType === 'Ongeval';
      } else {
        return selectedTypes['0'] && selectedTypes['1'];
      }
    }
  };

  var layers = {
    uur: new ol.layer.Vector({
      zIndex: 4,
      visible: !!layerInfo.uur,
      id: 'uur',
      title: 'Meldingen laatste zestig minuten',
      style: function(feature, resolution) {
        var showLabel = resolution <= 78;
        if (filterFunction(feature) === false) {
          return null;
        }
        var text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
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
        var showLabel = resolution <= 78;
        if (filterFunction(feature) === false) {
          return null;
        }
        var text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
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
        var nummer = feature.get('nummer');
        if (filterFunction(feature) === false) {
          return null;
        }
        var text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
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

  // initial load of features in case of JSONP
  for (var key in layers) {
    if (useJSONP) {
      var source = sources[key];
      if (layers[key].getVisible()) {
        doJSONP(sourceUrls[key], function(jsonData) {
          this.source.addFeatures(this.source.getFormat().readFeatures(jsonData));
        }, undefined, {source: source, key: key});
      } else {
        layers[key].once('change:visible', function(evt) {
          if (evt.target.getVisible()) {
            doJSONP(sourceUrls[this.key], function(jsonData) {
              this.source.addFeatures(this.source.getFormat().readFeatures(jsonData));
            }, undefined, this);
          }
        }, {key: key, source: source});
      }
    }
  }

  for (var i = 0, ii = rayons.length; i < ii; ++i) {
    $('#sel-rayon').append($("<option></option>").attr("value", rayons[i]).text(rayons[i]));
  }

  var hasRayon = function() {
    var result = false;
    for (var rayon in selectedRayons) {
      if (selectedRayons[rayon] === true) {
        result = true;
        break;
      }
    }
    return result;
  };

  $('#save').on('click', function(evt) {
    var json = {};
    json.layers = {};
    $("#layer-body :input").each(function(){
      var input = $(this);
      json.layers[input.attr('id').replace('vis_', '')] = input.is(':checked');
    });
    json.filterRayon = filterRayon;
    json.selectedRayons = selectedRayons;
    json.filterMelder = filterMelder;
    json.selectedMeldersCat = selectedMeldersCat;
    json.cirkel = cirkel;
    json.allowBeep = allowBeep;
    json.filterType = filterType;
    json.selectedTypes = selectedTypes;
    Cookies.set(cookieName, json);
  });

  $('#clear').on('click', function(evt) {
    Cookies.remove(cookieName);
    loadCookie();
    loadCirkelFromCookie();
    onChangeCirkel({target: $('#cirkel')[0]})
    loadLayerInfoFromCookie();
    applyLayerVisbility();
    loadRayonInfoFromCookie();
    applyInitialRayons();
    setToggleImg();
    loadMelderInfoFromCookie();
    setMelderFilter();
    loadBeepFromCookie();
    setBeepImg();
    loadTypesFromCookie();
    setTypeFilter();
  });

  $('#options').on('click', function(evt) {
    $('#mainoptions').hide();
    $('#secondaryoptions').show();
  });

  $('#backtomain').on('click', function(evt) {
    $('#mainoptions').show();
    $('#secondaryoptions').hide();
  });

  var setToggleImg = function() {
    var toggleAanImg = 'img/toggle_aan.svg';
    var toggleUitImg = 'img/toggle_uit.svg';
    if (filterRayon) {
      $('#filter-button-img').attr('src', toggleUitImg);
    } else {
      $('#filter-button-img').attr('src', toggleAanImg);
    }
  };
  setToggleImg();
  $('#filter-button').on('click', function(evt){ 
    if (!hasRayon()) {
      return;
    }
    filterRayon = !filterRayon;
    setToggleImg();
    for (var key in sources) {
      var source = sources[key];
      source.changed();
    }
  });
  $('#sel-rayon').multiSelect({
    afterSelect: function(values) {
      selectedRayons[values[0]] = true;
    },
    afterDeselect: function(values) {
      if (values !== null) {
        selectedRayons[values[0]] = false;
      }
      if (!hasRayon()) {
        $('#filter-button-img').attr('src', 'img/toggle_aan.svg');
        filterRayon = false;
        for (var key in sources) {
          var source = sources[key];
          source.changed();
        }
      }
    }
  });
  var applyInitialRayons = function() {
    var initialRayons = [];
    for (var r in selectedRayons) {
      if (selectedRayons[r] === true) {
        initialRayons.push(r);
      }
    }
    $('#sel-rayon').multiSelect('deselect_all');
    $('#sel-rayon').multiSelect('select', initialRayons);
  }
  applyInitialRayons();

  var map = new ol.Map({
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

  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  map.addOverlay(overlay);

  map.on('click', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    overlay.setPosition(undefined);
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      if (feature && layer !== null) {
        var coordinate = evt.coordinate;
        var html = '<table class="table"><tbody>';
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

  var setBeepImg = function() {
    var beepAanImg = 'img/sound_on.svg';
    var beepUitImg = 'img/sound_off.svg';
    if (allowBeep) {
      $('#beep-button-img').attr('src', beepAanImg);
    } else {
      $('#beep-button-img').attr('src', beepUitImg);
    }
  };
  setBeepImg();

  $('#beep-button').on('click', function(evt) {
    allowBeep = !allowBeep;
    setBeepImg();
  });
  var beep = function() {
    var sound = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    sound.play();
  };

  var sourceHasFeature = function(source, feature) {
    var sourceFeatures = source.getFeatures();
    for (var i = 0, ii = sourceFeatures.length; i < ii; ++i) {
      if (feature.get('meldnr') === sourceFeatures[i].get('meldnr')) {
        return true;
      }
    }
    return false;
  };

  var getRemove = function(source, features) {
    var sourceFeatures = source.getFeatures();
    var removeList = [];
    for (var i = 0, ii = sourceFeatures.length; i < ii; ++i) {
      var feature = sourceFeatures[i];
      var remove = true;
      for (var j = 0, jj = features.length; j < jj; ++j) {
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

  var handleNewFeatures = function(config, features) {
    var doBeep = false;
    var key = config.key;
    var source = config.source;
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      var feature = features[i];
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

  var formatDate = function(date) {
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  };

  var formatHour = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  };

  var setDateTime = function() {
    var dateElement = document.getElementById('date');
    var hourElement = document.getElementById('hour');
    var date = new Date();
    if (dateElement) {
      dateElement.innerHTML = formatDate(date);
    }
    if (hourElement) {
      hourElement.innerHTML = formatHour(date);
    }
  };

  var reloadFeatures = function() {
    setDateTime();
    for (var key in layers) {
      if (layers[key].getVisible() === true) {
        var source = sources[key];
        if (useJSONP) {
          doJSONP(sourceUrls[key], function(jsonData) {
            var features = this.source.getFormat().readFeatures(jsonData);
            handleNewFeatures(this, features);
          }, undefined, {source: source, key: key});
        } else {
          doGET(sourceUrls[key].replace('%output%', 'application/json'), function(xmlhttp) {
            var features = this.source.getFormat().readFeatures(xmlhttp.responseText);
            handleNewFeatures(this, features);
          }, undefined, {source: source, key: key});
        }
      }
    }
  };

  // melders filter
  var melder_filter = $('#filter-melder');
  var melders = [{
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
  var m, mm;
  var handleMelderFilter = function(evt) {
    for (m = 0, mm = melders.length; m < mm; ++m) {
      if (melders[m].id === evt.target.value) {
        selectedMeldersCat[evt.target.value] = evt.target.checked;
        for (var itemI = 0, itemII = melders[m].items.length; itemI < itemII; ++itemI) {
          selectedMelders[melders[m].items[itemI].toLowerCase()] = evt.target.checked;
        }
        break;
      }
    }
    filterMelder = true;
    for (var key in sources) {
      var source = sources[key];
      source.changed();
    }
  };
  for (m = 0, mm = melders.length; m < mm; ++m) {
    var checked = selectedMeldersCat[melders[m].id] ? ' checked' : '';
    melder_filter.append('<div class="pretty"><input id="melder_' + melders[m].id + '" type="checkbox" value="' + melders[m].id +  '"' + checked + '/><label><i class="mi mi-check"></i>' + melders[m].title + '</label></div><br/>');
    $('#melder_' + melders[m].id).on('change', handleMelderFilter);
  }

  var setMelderFilter = function() {
    for (i = 0, ii = melders.length; i < ii; ++i) {
      var checked = selectedMeldersCat[melders[i].id];
      $('#melder_' + melders[i].id).prop('checked', checked);
      if (!checked) {
        handleMelderFilter({target: $('#melder_' + melders[i].id)[0]});
      }
    }
  };
  setMelderFilter();

  var handleTypeFilter = function(evt) {
    selectedTypes[evt.target.value] = evt.target.checked;
    filterType = true;
    for (var key in sources) {
      var source = sources[key];
      source.changed();
    }
  }

  var typeContainer = $('#filter-type');
  var typeOptions = [{
    id: '0',
    title: 'Ongeval'
  }, {
    id: '1',
    title: 'Pech en overig'
  }];

  var t, tt;

  for (t = 0, tt = typeOptions.length; t < tt; ++t) {
    var checked = selectedTypes[typeOptions[t].id] ? ' checked' : '';
    typeContainer.append('<div class="pretty"><input id="type_' + typeOptions[t].id + '" type="checkbox" value="' + typeOptions[t].id +  '"' + checked + '/><label><i class="mi mi-check"></i>' + typeOptions[t].title + '</label></div><br/>');
    $('#type_' + typeOptions[t].id).on('change', handleTypeFilter);
  }

  var setTypeFilter = function() {
    for (t = 0, tt = typeOptions.length; t < tt; ++t) {
      var checked = selectedTypes[typeOptions[t].id];
      $('#type_' + typeOptions[t].id).prop('checked', checked);
      if (!checked) {
        handleTypeFilter({target: $('#type_' + typeOptions[t].id)[0]});
      }
    }
  };
  setTypeFilter();

  var findLayerById = function(id) {
    var layersArray = map.getLayers().getArray()
    for (var i = 0, ii = layersArray.length; i < ii; ++i) {
      if (layersArray[i].get('id') === id) {
        return layersArray[i];
      }
    }
  };

  var applyLayerVisbility = function() {
    $("#layer-body :input").each(function(){
      var input = $(this);
      var id = input.attr('id');
      var visible = !!layerInfo[id.replace('vis_', '')];
      input.attr('checked', visible);
      var layer = findLayerById(id.replace('vis_', ''));
      layer.setVisible(visible);
    });
  };

  // layer list control
  var layerBody = $('#layer-body');
  var layersArray = map.getLayers().getArray().reverse();
  for (var l = 0, ll = layersArray.length; l < ll; ++l) {
    var layer = layersArray[l];
    if (layer.get('title')) {
      var checked = layer.getVisible() ? ' checked' : '';
      layerBody.append('<div class="pretty"><input id="vis_' + layer.get('id') + '" type="checkbox" value=""' + checked + '/><label><i class="mi mi-check"></i>' + layer.get('title') + '</label></div><br/>');
      $('#vis_' + layer.get('id')).on('change', $.proxy(function(evt) {
        this.setVisible(evt.target.checked);
      }, layer));
    }
  }

  var onChangeCirkel = function(evt) {
    cirkel = evt.target.checked;
    // clear the style caches
    styleCache = {};
    styleCacheUur = {};
    styleCacheVandaag = {};
    for (var key in sources) {
      sources[key].changed();
    }
  }

  $('#cirkel').on('change', onChangeCirkel);

  var collapsibleEl = $('#eastpanel');
  var buttonEl =  $("#collapse-button");
  var expanded = true;
  buttonEl.click(function() {
    if (expanded) {
      $('#map').css({width: 'calc(100% - 15px)'});
      $('#centerpanel').css({right: '0px'});
      collapsibleEl.css({display: 'none'});
    } else {
      $('#map').css({width: 'calc(100% - 340px)'});
      $('#centerpanel').css({right: '325px'});
      collapsibleEl.css({display: ''});
    }
    buttonEl.toggleClass('expanded');
    buttonEl.toggleClass('collapsed');
    expanded = !expanded;
    map.updateSize();
  });

  setDateTime();
  window.setInterval(reloadFeatures, 10000);
})();
