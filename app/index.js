import draw from "./draw.js";
import conversion from "./conversions.js";
import api from "./api.js";
import location from "./location.js";
import mapStyling from "./mapStyling.js";

const providers = [
  { provider: "BT", net: [0, 76, 77], mcc: 23430, mnc: 23430 },
  { provider: "O2", net: [2, 10, 11], mcc: 23410, mnc: 23410 },
  { provider: "Vodaphone", net: [7, 15, 91, 92], mcc: 23415, mnc: 23415 }
];

window.onload = () => {
  let map;
  let selectedProvider = providers[1];
  let accuracy = {};

  location
    .getLocation()
    .then(result => {
      const coords = result.coords;
      let currentCoords = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(currentCoords);
      return currentCoords;
    })
    .then(coords => {
      api.getTowers(coords.lat, coords.lng).then(towers => {
        let overlay = new google.maps.OverlayView();

        location
          .getCalculatedLocation(towers, selectedProvider, coords)
          .then(calcLocation => {
            if ("location" in calcLocation) {
              accuracy = calcLocation;
              calculatedLocation(overlay, calcLocation, coords);
            }
          });

        d3.select(".providers").call(sel => {
          draw.updateProviders(sel, providers, "O2", provider => {
            selectedProvider = provider;
            location
              .getCalculatedLocation(towers, selectedProvider, coords)
              .then(calcLocation => {
                if ("location" in calcLocation) {
                  accuracy = calcLocation;
                  calculatedLocation(overlay, calcLocation, coords);
                }
              });
          });
        });

        overlay.draw = () => {
          overlayDraw(overlay, coords, towers, selectedProvider, accuracy);
        };
        overlay.setMap(map);
      });
    })
    .catch(err => {
      console.err(err);
    });
};

const calculatedLocation = (overlay, calcLocation, coords) => {
  let accuracyCoords = conversion.offsetCoordsMetres(
    coords.lat,
    coords.lng,
    calcLocation.accuracy,
    calcLocation.accuracy
  );
  const centrePixel = coordsToPixel(
    overlay,
    new google.maps.LatLng(calcLocation.location.lat, calcLocation.location.lng)
  );
  const accuracy = coordsToPixel(
    overlay,
    new google.maps.LatLng(accuracyCoords[0], accuracyCoords[1])
  );

  d3.select("svg").call(svg => {
    draw.updateCalculatedLocationMarker(
      svg,
      centrePixel,
      Math.abs(accuracy.x - centrePixel.x)
    );
  });
};

const coordsToPixel = (overlay, coord) => {
  return overlay.getProjection().fromLatLngToContainerPixel(coord);
};

const overlayDraw = (
  overlay,
  currentCoords,
  cellTowers,
  provider,
  accuracy
) => {
  const pixelCentre = coordsToPixel(
    overlay,
    new google.maps.LatLng(currentCoords.lat, currentCoords.lng)
  );

  let cellTowerMarkers = cellTowers.map(tower => {
    let pixelCoord = coordsToPixel(
      overlay,
      new google.maps.LatLng(tower.lat, tower.lon)
    );
    tower.x = pixelCoord.x;
    tower.y = pixelCoord.y;
    return tower;
  });

  d3.select("svg").call(svg => {
    draw.updateCellTowerMarkers(svg, cellTowerMarkers, provider);
    draw.updateLocationMarker(svg, pixelCentre);
  });
  "location" in accuracy && calculatedLocation(overlay, accuracy, currentCoords); 

};

const initMap = (center, zoom = 14) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom,
    styles: mapStyling.styling(),
    disableDefaultUI: false,
    disableDoubleClickZoom: false
  });
};
