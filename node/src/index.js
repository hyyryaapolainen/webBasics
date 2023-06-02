//import "./styles.css";

const geoDataURL = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";

const posMigrationURL = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f"

const negMigrationURL = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e"

let posMigData = null;
let negMigData = null

async function setUpDocument() {
    var geoDataPromise = await fetch(geoDataURL)
    var geoData = await geoDataPromise.json()

    const posMigPromise = await fetch(posMigrationURL)
    posMigData = await posMigPromise.json()

    const negMigPromise = await fetch(negMigrationURL)
    negMigData = await negMigPromise.json()

    var map = L.map('map', {
      minZoom: -3,
      weight: 2
    }).setView([64.92411, 25.748151],5);
    L.geoJSON(geoData, {
      style: mapstyle,
      onEachFeature: onEachFeature
    }).addTo(map);
}


if (document.readyState !== "loading") {
  console.log("Document is ready!");
  setUpDocument();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready after waiting!");
    setUpDocument();
  });
}
function onEachFeature(feature, layer)
{
  var key = feature.properties.kunta
  var posIndex = posMigData.dataset.dimension.Tuloalue.category.index["KU"+key]
  var negIndex = negMigData.dataset.dimension.Lähtöalue.category.index["KU"+key]
  var posValue = posMigData.dataset.value[posIndex]
  var negValue = negMigData.dataset.value[negIndex]
  console.log(posValue)
  console.log(negValue)
  var totalMigration = posValue - negValue
  console.log(totalMigration)


  layer.bindTooltip(feature.properties.name)
  
  layer.bindPopup(
    `<ul>
        <li>Positive migration: ${posValue}</li>
        <li>Negative migration: ${negValue}</li>
    </ul>`)
  
}
function mapstyle(feature) {
  return{
		fillColor:"#fff",
	        color:"#000",
	        weight:'1',
	        fillOpacity:1
	};
    }