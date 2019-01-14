// portland map initializer
var map = window.L.map('map').setView([45.5235494,-122.654917], 13);


// You can use GeoJSON from portland directly!
var demUrl = 'https://opendata.arcgis.com/datasets/43447f114b184e5a81024ca65bddf5f9_126.geojson';



// base tile layer
window.L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);


window.L.geoJSON(window.nebdata, {
  style: style,
  onEachFeature: function onEachFeature(feature, layer) {
    layer.on({
      click: layer.bindPopup(`<h2>${feature.properties.NAME}</h2><p>Number of demolitions ${feature.properties.NUMPOINTS}</p>`)
    })
  }
}).addTo(map);

function style(feature) {
  return {
    fillColor: getColor(feature.properties.NUMPOINTS),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  }

  function getColor(d) {
    return d < 10 ? '#e5f5f9' :
           d < 20 ? '#ccece6' :
           d < 40 ? '#99d8c9' :
           d < 80 ? '#66c2a4' :
           d < 120 ? '#41ae76' :
           d < 160 ? '#238b45' :
           d < 200 ? '#006d2c' :
           d < 240 ? '#00441b' :
                     '#f7fcfd'
  }
}

var demLayer = window.L.geoJSON(null, {
  pointToLayer: (feature, latlng) => new window.L.CircleMarker(latlng, {
    radius: 3,
    fillColor: "#254732",
    color: 'transparent',
    opacity: 1,
    fillOpacity: 0.4
  }),
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`
      <h2>Residential Demolition Permits</h2>
      <ul>
        <li>Status: ${feature.properties.STATUS}</li>
        <li>Propstreet: ${feature.properties.PROPSTREET}</li>
        <li>Permit: ${feature.properties.PERMIT}</li>
        <li>Type: ${feature.properties.TYPE}</li>
        <li>Work Description: ${feature.properties.WORK_DESCRIPTION}</li>
        <li>Issued: ${feature.properties.ISSUED}</li>
        <li>Finaled: ${feature.properties.FINALED}</li>
        <li>Description: ${feature.properties.DESCRIPTION}</li>
      </ul>
    `)
  },
})


fetch (demUrl)
.then ((resp) => resp.json())
.then (json => {
    demLayer.addData(json)
    demLayer.addTo(map);
})
  .catch(err => { console.error(err) });
