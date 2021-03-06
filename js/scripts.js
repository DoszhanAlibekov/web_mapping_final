// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibW16enl5aGgiLCJhIjoiY2s2dTl6OGNsMDduejNkcXAwYzFmMm5mYSJ9.CbLRIkFjQIPksjZ-wwKWNg';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.989186,40.746867]
var initialZoom = 13

// add a geocoder
// map.addControl(
// new MapboxGeocoder({
// accessToken: mapboxgl.pk.'eyJ1IjoibW16enl5aGgiLCJhIjoiY2s2YTI4YzJtMDIybTNlbWcxbHU0dXB4MiJ9.HcY5VSHxtQ4k4d9cddGRKQ',
// mapboxgl: mapboxgl
// })
// );
// a helper function for looking up colors and descriptions for NYC land use codes
var LandUseLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#f4f455',
        description: '1 & 2 Family',
      };
    case 2:
      return {
        color: '#f7d496',
        description: 'Multifamily Walk-up',
      };
    case 3:
      return {
        color: '#FF9900',
        description: 'Multifamily Elevator',
      };
    case 4:
      return {
        color: '#f7cabf',
        description: 'Mixed Res. & Commercial',
      };
    case 5:
      return {
        color: '#ea6661',
        description: 'Commercial & Office',
      };
    case 6:
      return {
        color: '#d36ff4',
        description: 'Industrial & Manufacturing',
      };
    case 7:
      return {
        color: '#dac0e8',
        description: 'Transportation & Utility',
      };
    case 8:
      return {
        color: '#5CA2D1',
        description: 'Public Facilities & Institutions',
      };
    case 9:
      return {
        color: '#8ece7c',
        description: 'Open Space & Outdoor Recreation',
      };
    case 10:
      return {
        color: '#bab8b6',
        description: 'Parking Facilities',
      };
    case 11:
      return {
        color: '#5f5f60',
        description: 'Vacant Land',
      };
    case 12:
      return {
        color: '#5f5f60',
        description: 'Other',
      };
    default:
      return {
        color: '#5f5f60',
        description: 'Other',
      };
  }
};

// set the default text for the feature-info div

var defaultText = '<p>Move the mouse over the map to get more info on a neighborhood property</p>'
$('#feature-info').html(defaultText)

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map', // put the map in this container
  style: 'mapbox://styles/mapbox/dark-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// wait for the initial style to Load
map.on('style.load', function() {

  // add a geojson source to the map using our external geojson file
  map.addSource('5th-st', {
    type: 'geojson',
    data: './data/5th.geojson',
  });
  map.addSource('7th-st', {
    type: 'geojson',
    data: './data/7th.geojson',
  });
  map.addSource('segment', {
    type: 'geojson',
    data: './data/segment.geojson',
  });
  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources)

  // add a layer for our custom source
  map.addLayer({
    id: 'fill-5th-st',
    type: 'fill',
    source: '5th-st',
    paint: {
      'fill-color': {
        type: 'categorical',
        property: 'landuse',
        stops: [
          [
            '01',
            LandUseLookup(1).color,
          ],
          [
            '02',
            LandUseLookup(2).color,
          ],
          [
            '03',
            LandUseLookup(3).color,
          ],
          [
            '04',
            LandUseLookup(4).color,
          ],
          [
            '05',
            LandUseLookup(5).color,
          ],
          [
            '06',
            LandUseLookup(6).color,
          ],
          [
            '07',
            LandUseLookup(7).color,
          ],
          [
            '08',
            LandUseLookup(8).color,
          ],
          [
            '09',
            LandUseLookup(9).color,
          ],
          [
            '10',
            LandUseLookup(10).color,
          ],
          [
            '11',
            LandUseLookup(11).color,
          ],

        ]
      }
    }
  })
  map.addLayer({
    id: 'fill-7th-st',
    type: 'fill',
    source: '7th-st',
    paint: {
      'fill-color': {
        type: 'categorical',
        property: 'landuse',
        stops: [
          [
            '01',
            LandUseLookup(1).color,
          ],
          [
            '02',
            LandUseLookup(2).color,
          ],
          [
            '03',
            LandUseLookup(3).color,
          ],
          [
            '04',
            LandUseLookup(4).color,
          ],
          [
            '05',
            LandUseLookup(5).color,
          ],
          [
            '06',
            LandUseLookup(6).color,
          ],
          [
            '07',
            LandUseLookup(7).color,
          ],
          [
            '08',
            LandUseLookup(8).color,
          ],
          [
            '09',
            LandUseLookup(9).color,
          ],
          [
            '10',
            LandUseLookup(10).color,
          ],
          [
            '11',
            LandUseLookup(11).color,
          ],

        ]
      }
    }
  });
  // add line segments

  // console.log(map.getStyle().sources);
  map.addLayer({
    id: 'line-segment',
    type: 'line',
    source: 'segment',
    layout: {},
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 3,
    },

  });
  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 2,
      'line-opacity': 0.9,
      'line-color': 'white',

    }

  });


// select lines around pointer
map.on('click', function(e) {
  // set bbox as 5px reactangle area around clicked point
  var bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5]
  ];
  var features = map.queryRenderedFeatures(bbox, {
    layers: ['line-segment']
  });

console.log(features)

if (features[0]) {
  console.log(e)
  new mapboxgl.Popup({offset:25})
  .setLngLat(e.lngLat)
  .setHTML(`This is ${features[0].properties.name} project. This project completed by ${features[0].properties.year}.`)
  .addTo(map)
}


//   map.on('load', function() {
//   map.addSource('segments', {
//   'type': 'geojson',
//   'data': {"type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {},
//       "name": "7th Ave Segment",
//       "year": "November, 2018",
//       "boarding": "673.6",
//       "activity": "1566.1",
//       "geometry": {
//         "type": "LineString",
//         "coordinates": [
//           [
//             286.0093116760254,
//             40.750930774180645
//           ],
//           [
//             286.01622104644775,
//             40.76052074107624
//           ]
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "name": "5th Ave Segment",
//       "year": "June, 2017",
//       "boarding": "237.7",
//       "activity": "612.6",
//       "geometry": {
//         "type": "LineString",
//         "coordinates": [
//           [
//             286.01038455963135,
//             40.74153451605774
//           ],
//           [
//             286.0036039352417,
//             40.73223448999161
//           ]
//         ]
//       }
//     }
//   ]
// }})});

  // map.on(('click', 'segments',function(e){
  //   var coordinates = e.features[0].geometry.coordinates.slice();
  //   var description = e.features[0].name;


    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }

    // new mapboxgl.Popup()
    // .setLngLat(coordinates)
    // .setHTML(description)
    // .addTo(map);
    // }));


    // map.on('mouseenter', 'segments', function() {
    // map.getCanvas().style.cursor = 'pointer';
    // });

    // Change it back to a pointer when it leaves.


    // map.on('mouseleave', 'segents', function() {
    // map.getCanvas().style.cursor = '';
    //
    // });

  // listen for the mouse moving over the map and react when the cursor is over our data

  map.on('mousemove', function (e) {
    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['fill-5th-st','fill-7th-st'],
    });


    // popups
    // Create a popup, but don't add it to the map yet.
    // var popup = new mapboxgl.Popup({
    // closeButton: false,
    // closeOnClick: false
    // });
    //
    // map.on('mouseenter', 'places', function(e) {
    // // Change the cursor style as a UI indicator.
    // map.getCanvas().style.cursor = 'pointer';
    //
    // var featureInfo = e.features[0].properties.description;
    //
    // // Ensure that if the map is zoomed out such that multiple
    // // copies of the feature are visible, the popup appears
    // // over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }



    // Populate the popup and set its coordinates
    // based on the feature found.
    // ==>edit popup
    // popup
    // .setHTML(featureInfo)
    // .addTo(map);
    // });
    //
    // map.on('mouseleave', 'places', function() {
    // map.getCanvas().style.cursor = '';
    // popup.remove();
    // });



    // if the mouse pointer is over a feature on our layer of interest
    // take the data for that feature and display it in the sidebar
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      var hoveredFeature = features[0]
      var featureInfo = `
        <h5>${hoveredFeature.properties.address}</h5>
        <p><strong>Land Use:</strong> ${LandUseLookup(parseInt(hoveredFeature.properties.landuse)).description}</p>
        <p><strong>Zoning:</strong> ${hoveredFeature.properties.zonedist1}</p>
      `
      $('#feature-info').html(featureInfo)

      // set this lot's polygon feature as the data for the highlight source
      map.getSource('highlight-feature').setData(hoveredFeature.geometry);
    } else {
      // if there is no feature under the mouse, reset things:
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      });

      // reset the default message
      $('#feature-info').html(defaultText)
    }

    // js for LineString

    // add segments

    // // add an empty data source, which we will use to highlight the line the user is hovering over
    // map.addSource('highlight-feature', {
    //   type: 'geojson',
    //   data: {
    //     type: 'FeatureCollection',
    //     features: []
    //   }
    // add a layer for the highlighted lot

  })
}) // missing to close style.load


})
$('#5th').on('click', function() {
  map.flyTo({
    center: [-73.993145,40.736690],
    zoom: initialZoom
  })
})

$('#7th').on('click', function() {

  var michiganLngLat = [-73.986944,40.756043]

  map.flyTo({
    center: michiganLngLat,
    zoom: initialZoom
  })
})
