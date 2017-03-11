var fs = require('fs')
// downloaded geojson from mapzen.com
// var content = fs.readFileSync('./maps/wof_bundle_85632361_county.geojson')
var content = fs.readFileSync('./maps/wof_bundle_85632361_country-region.geojson')
content = JSON.parse(content)
var regions = {
  Tehran: { name: 'Tehran', 'name:fa': 'تهران' },
  Esfahan: { name: 'Esfahan', 'name:fa': 'اصفهان' },
  Alborz: { name: 'Karaj', 'name:fa': 'کرج' },
  'Razavi Khorasan': { name: 'Mashhad', 'name:fa': 'مشهد' },
  Qom: { name: 'Qom', 'name:fa': 'قم' }
}
console.log('#total=', content.features.length)
content.features = content.features
  .filter(f => Object.keys(regions).includes(f.properties["wof:name"]))
  .map(f => {
    console.log(f.properties["wof:name"])
    return  {
      properties: regions[f.properties["wof:name"]],
      geometry: f.geometry,
      id: f.id,
      type: f.type,
    }
  })

fs.writeFileSync('dist/iran_regions.geojson', JSON.stringify(content), {encoding: 'utf8'})
