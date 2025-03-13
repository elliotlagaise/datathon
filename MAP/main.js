import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat, transform} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';

let logger = JSON.parse(localStorage.getItem('logger')) || [];

// Create a marker feature
const markerStyle = new Style({
  image: new Icon({
    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
    scale: 1,
    color: '#ff0000'
  })
});
// Create a vector source and layer to hold the marker
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource
});

// Function to load JSON data
async function loadJsonFileData() {
  const response = await fetch('./data/parcelles/parcelles_distances_nearest.json');
  const data = await response.json();
  return data;
}

// document.addEventListener('DOMContentLoaded', async () => {
//   const data = await loadJsonFileData(); 
//   await loadPoints(data); // Affiche les points dès le début
// });


async function loadPoints(data) {
  vectorSource.clear(); // Nettoie les anciens marqueurs avant d'ajouter les nouveaux

  data.forEach(item => {
    const marker = new Feature({
      geometry: new Point(fromLonLat([item.centroid_y, item.centroid_x])), // ⚠️ Inversion
      score_final: item.score_final
    });

    marker.setStyle(markerStyle);
    vectorSource.addFeature(marker);
  });
}



async function loadSpecificJsonData(from, to) {
  const response = await fetch('data/parcelles/parcelles_distances_nearest.json');

  const data = await response.json();

  const filteredData = data.filter(item => parseFloat(item.score_final) >= from && parseFloat(item.score_final) <= to);
  return filteredData;
}

async function deleteMarkersN(n) {
  const data = await loadJsonFileData();
  let filteredData;
  switch (n) {
    case 1:
      filteredData = data.filter(item => parseFloat(item.score_final) >= 0 && parseFloat(item.score_final) <= 1);
      break;
    case 2:
      filteredData = data.filter(item => parseFloat(item.score_final) >= 1 && parseFloat(item.score_final) <= 2);
      break;
    case 3:
      filteredData = data.filter(item => parseFloat(item.score_final) >= 2 && parseFloat(item.score_final) <= 3);
      break;
    case 4:
      filteredData = data.filter(item => parseFloat(item.score_final) >= 3 && parseFloat(item.score_final) <= 4);
      break;
    case 5:
      filteredData = data.filter(item => parseFloat(item.score_final) >= 4 && parseFloat(item.score_final) <= 5);
      break;
  }
  const tolerance = 0.001;
  filteredData.forEach(item => {
    const feature = vectorSource.getFeatures().find(f => {
      const coords = f.getGeometry().getCoordinates();
      const lonLat = transform(coords, 'EPSG:3857', 'EPSG:4326');
      return Math.abs(lonLat[0] - item.centroid_x) < tolerance && Math.abs(lonLat[1] - item.centroid_y) < tolerance;
    });
    if (feature) {
      vectorSource.removeFeature(feature);
    }
  });
}

// Initialize the map without markers
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new View({
    center: fromLonLat([2.3522, 48.8566]), // Paris
    zoom: 10
  })
});


document.getElementById('main_refresh_btn').addEventListener('click', () => {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dateTime = { date: formattedDate, time: formattedTime };

  // Mise à jour de l'affichage
  document.getElementById('main_refresh_timer').textContent = `Rafraîchi au ${dateTime.date} à ${dateTime.time}`;

  let existingData = JSON.parse(localStorage.getItem('dateTimeLog')) || [];
  existingData.push(dateTime);

  // Sauvegarde des données mises à jour dans localStorage
  localStorage.setItem('dateTimeLog', JSON.stringify(existingData));

  logger.push(`\nHistorique des rafraîchissements mis à jour : ${existingData.at(-1).time} ${existingData.at(-1).date} \n`);
  localStorage.setItem('logger', JSON.stringify(logger));
});

// Fonction pour afficher la date et l'heure du dernier rafraîchissement des données
function displayLastRefresh() {
  const lastRefreshElement = document.getElementById('main_refresh_timer');
  const historyData = JSON.parse(localStorage.getItem('dateTimeLog')) || [];

  if (historyData.length > 0) {
    const lastEntry = historyData.at(-1);
    lastRefreshElement.textContent = `Dernier rafraîchissement : ${lastEntry.date} à ${lastEntry.time}`;
  } else {
    lastRefreshElement.textContent = "Aucun rafraîchissement enregistré.";
  }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', displayLastRefresh);

map.on('click', async (event) => {
  const response = await fetch('data/parcelles/parcelles_distances_nearest.json');
  const data = await response.json();

  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    const scoring = feature.get('score_final');
    if (scoring !== undefined) {
      const scoringLabel = document.querySelector('#scoring-label');
      scoringLabel.textContent = `Scoring: ${scoring}`;
    }
  });
});


const btn1 = document.querySelector('#segment-1');
const btn2 = document.querySelector('#segment-2');
const btn3 = document.querySelector('#segment-3');
const btn4 = document.querySelector('#segment-4');
const btn5 = document.querySelector('#segment-5');

document.getElementById('segment-1').addEventListener('click', async () => {

  if(btn1.style.paddingRight == '15px') 
    {
    btn1.style.paddingRight = '0px';
    btn1.style.transition = 'padding-right 0.3s';
    deleteMarkersN(1);
  }
  else 
  {
    btn1.style.transition = 'padding-right 0.3s';
    btn1.style.paddingRight = '15px';
    const data = await loadSpecificJsonData(0, 1);
    await loadPoints(data);
  }
});

document.getElementById('segment-2').addEventListener('click', async () => {
  if(btn2.style.paddingRight == '15px') 
    {
    btn2.style.paddingRight = '0px';
    btn2.style.transition = 'padding-right 0.3s';
    deleteMarkersN(2);
  }
  else 
  {
  btn2.style.transition = 'padding-right 0.3s';
  btn2.style.paddingRight = '15px';
  const data = await loadSpecificJsonData(1, 2);
  await loadPoints(data);
  }
});

document.getElementById('segment-3').addEventListener('click', async () => {
  if(btn3.style.paddingRight == '15px') 
    {
    btn3.style.paddingRight = '0px';
    btn4.style.transition = 'padding-right 0.3s';
    deleteMarkersN(3);
  }
  else 
  {
    btn3.style.transition = 'padding-right 0.3s';
    btn3.style.paddingRight = '15px';
    const data = await loadSpecificJsonData(2, 3);
    await loadPoints(data);
  }
});

document.getElementById('segment-4').addEventListener('click', async () => {
  if(btn4.style.paddingRight == '15px') 
    {
    btn4.style.paddingRight = '0px';
    btn4.style.transition = 'padding-right 0.3s';
    deleteMarkersN(4);
  }
  else 
  {
    btn4.style.transition = 'padding-right 0.3s';
    btn4.style.paddingRight = '15px';
    const data = await loadSpecificJsonData(3, 4);
    await loadPoints(data);
  }
});

document.getElementById('segment-5').addEventListener('click', async () => {
  if(btn5.style.paddingRight == '15px') 
    {
    btn5.style.paddingRight = '0px';
    btn5.style.border = '0';
    deleteMarkersN(5);
  }
  else 
  {
    btn5.style.transition = 'padding-right 0.3s';
    btn5.style.paddingRight = '15px';
    const data = await loadSpecificJsonData(4, 5);
    await loadPoints(data);
  }
});