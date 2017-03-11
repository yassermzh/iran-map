var fs = require('fs')
// downloaded geojson from mapzen.com
var content = fs.readFileSync('./maps/tehran_iran_admin.geojson')
content = JSON.parse(content)

function toNumber(persianNumber) {
  var str = persianNumber.trim()
  if (str.length == 2) {
    return (str.charCodeAt(0) - 1776) * 10 +
      str.charCodeAt(1) - 1776
  } else if (str.length == 1) {
    return str.charCodeAt(0) - 1776
  }
}

content.features = content.features
  .filter(f => f.properties.name.includes('منطقه'))
  .filter(f => f.properties.name.includes('شهر تهران'))
  .map(f => {
    f.properties.area = toNumber(f.properties.name.slice(6,8))
    return f;
  })

//console.log('areas:', content.features, content.features.length)
fs.writeFileSync('dist/tehran_areas.geojson', JSON.stringify(content), {encoding: 'utf8'})
