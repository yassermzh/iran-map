const fetch = require('node-fetch')
const async = require('async')
const fs = require('fs')

const osmIds = [
  {area: 1,  osmId: 5710706},
  {area: 10,  osmId: 5714616},
  {area: 11,  osmId: 5711010},
  {area: 12,  osmId: 5724306},
  {area: 2,  osmId: 5725072},
  {area: 3,  osmId: 5714586},
  {area: 4,  osmId: 5725071},
  {area: 5,  osmId: 5711407},
  {area: 6,  osmId: 5711567},
  {area: 7,  osmId: 5724225},
  {area: 8,  osmId: 5714602},
  {area: 9,  osmId: 5722613},
]

const out = {
  type: 'FeatureCollection',
  features: []
}

const getGeojson = (osm, callback) => {
  console.log('osm=', osm)
  const url = `http://polygons.openstreetmap.fr/get_geojson.py?id=${osm.osmId}&amp;params=0`
  console.log('url=', url)
  fetch(url)
    .then(body => body.text())
    .then(body => {
      let json
      if (body == 'None') {
        setTimeout(()=> { getGeojson(osm, callback) }, 15000)
      }
      json = JSON.parse(body)
      console.log(json)
      const feature = {
        type: 'Feature',
        properties: {osm: osm.osmId, area: osm.area},
        geometry: {
          type: 'Polygon',
          coordinates: json.geometries[0].coordinates[0]
        }
      }
      out.features.push(feature)
      setTimeout(callback, 2000)
    })
    .catch(e => {
      console.error('e=', e)
      callback()
    })
}

const done = () => {
  fs.writeFileSync('dist/mashhad-areas.geojson', JSON.stringify(out), 'utf8')
}

async.eachLimit(osmIds, 1, getGeojson, done)
