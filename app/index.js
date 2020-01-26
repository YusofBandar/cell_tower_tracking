import api from "./api.js";
import conversion from "./conversions.js";
import mapStyling from "./mapStyling.js";
import key from "./key.js";

const providers = [
  { provider: "BT", net: [0, 76, 77], mcc: 23430, mnc: 23430 },
  { provider: "O2", net: [2, 10, 11], mcc: 23410, mnc: 23410 },
  { provider: "Vodaphone", net: [7, 15, 91, 92], mcc: 23415, mnc: 23415 }
];

window.onload = () => {
  let map;

  let currentCoords;
  let originalCoords;

  let calculatedCoords;
  let calculatedAccuracy;

  let cellTowers = [];

  let selectedProvider = providers[0];

  getLocation(
    result => {
      const coords = result.coords;
      currentCoords = { lat: coords.latitude, lng: coords.longitude };
      originalCoords = currentCoords;

      map = initMap(currentCoords);

      api.getTowers(currentCoords.lat, currentCoords.lng).then(result => {
        cellTowers = result;
      });

      let overlay = new google.maps.OverlayView();
      overlay.draw = () => {
        draw(overlay, currentCoords, cellTowers, selectedProvider);
        drawCalculated(overlay, calculatedCoords, calculatedAccuracy);
      };
      overlay.setMap(map);

      updateProviders(providers, "BT", provider => {
        selectedProvider = provider;
        draw(overlay, currentCoords, cellTowers, selectedProvider);

        getCalLocation(cellTowers, selectedProvider).then(result => {
          if ("location" in result) {
            calculatedCoords = result.location;
            calculatedAccuracy = result.accuracy;
            drawCalculated(overlay, calculatedCoords, calculatedAccuracy, true);
          }
        });
      });
    },
    () => {
      console.log("error getting location");
    }
  );

  watchPosition(result => {
    getCalLocation(cellTowers, selectedProvider).then(result => {
      if ("location" in result) {
        calculatedCoords = result.location;
        calculatedAccuracy = result.accuracy;
      }
    });

    const coords = result.coords;
    currentCoords = { lat: coords.latitude, lng: coords.longitude };
    if (
      conversion.coordsDistanceMetres(
        currentCoords.lat,
        currentCoords.lng,
        originalCoords.lat,
        originalCoords.lng
      ) >= 800
    ) {
      api.getTowers(currentCoords.lat, currentCoords.lng).then(result => {
        cellTowers = result;
      });
      originalCoords = currentCoords;
    }
    map.panTo(currentCoords);
  });
};

const drawCalculated = (overlay, coords, accuracy, providerUpdate = false) => {
  if (coords) {
    let accuracyCoords = conversion.offsetCoordsMetres(
      coords.lat,
      coords.lng,
      accuracy,
      accuracy
    );
    updateCalLocationMarker(
      coordsToPixel(overlay, new google.maps.LatLng(coords.lat, coords.lng)),
      coordsToPixel(
        overlay,
        new google.maps.LatLng(accuracyCoords[0], accuracyCoords[1])
      ),
      providerUpdate
    );
  }
};

const draw = (overlay, currentCoords, cellTowers, provider) => {
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
  updateCellTowerMarkers(cellTowerMarkers, provider);
  updateLocationMarker(pixelCentre);
};

const coordsToPixel = (overlay, coord) => {
  return overlay.getProjection().fromLatLngToContainerPixel(coord);
};

const getLocation = (succ, err) => {
  navigator.geolocation.getCurrentPosition(succ, err);
};

const getCalLocation = (cellTowers, selected) => {
  let connectedTowers = cellTowers
    .filter(d => (selected.net.indexOf(Number(d.net)) < 0 ? false : true))
    .map(d => {
      return {
        cellId: d.cell,
        locationAreaCode: d.area,
        mobileCountryCode: d.mcc,
        mobileNetworkCode: d.net
      };
    });

  return api.getGeoLocation(key.key(), selected, connectedTowers);
};

const watchPosition = (succ, err) => {
  navigator.geolocation.watchPosition(succ, err);
};

const updateCalLocationMarker = (pixelCoords, accuracy, providerUpdate) => {

  const updateAccuracy = (coords, radius) => {
    d3.selectAll(".calAccuracy circle")
      .attr("cx", coords.x)
      .attr("cy", coords.y)
      .transition()
      .style("opacity", 0.2)
      .attr("r", radius);
  };

  d3.select("svg")
    .selectAll(".calCentre")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "calCentre")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(181, 181, 181)")
    .transition()
    .style("opacity", 0.75)
    .attr("r", 7)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.select("svg")
    .selectAll(".calAccuracy")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "calAccuracy")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(197, 197, 197)")

  if (providerUpdate) {
    d3.selectAll(".calAccuracy circle")
    .transition()
    .style("opacity", 0.2)
    .attr("r", 0);

    d3.selectAll(".calCentre circle")
      .transition()
      .style("opacity", 0.75)
      .attr("r", 7)
      .duration(1000)
      .attr("cx", pixelCoords.x)
      .attr("cy", pixelCoords.y)
      .on("end", () => {
        updateAccuracy(pixelCoords, accuracy.x - pixelCoords.x);
      });
  } else {
    d3.selectAll(".calCentre circle")
      .attr("cx", pixelCoords.x)
      .attr("cy", pixelCoords.y);
    updateAccuracy(pixelCoords, accuracy.x - pixelCoords.x);
  }
};

const updateLocationMarker = pixelCoords => {
  d3.select("svg")
    .selectAll(".centre")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "centre")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(255,255,255)")
    .transition()
    .style("opacity", 0.8)
    .style("stroke", "rgba(255, 255, 255")
    .attr("r", 7)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.selectAll(".centre circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y);
};

const updateProviders = (providers, selected, cb) => {
  d3.select(".providers")
    .selectAll("button")
    .data(providers)
    .enter()
    .append("button")
    .html(d => d.provider)
    .on("click", d => {
      cb(d);
      updateProviders(providers, d.provider);
    });

  d3.selectAll(".providers button").style("opacity", d =>
    d.provider === selected ? 1 : 0.2
  );
};

const updateCellTowerMarkers = (cellTowers, selectedProvider) => {
  d3.select("svg")
    .selectAll(".cellTower")
    .data(cellTowers)
    .enter()
    .append("g")
    .attr("class", "cellTower")
    .append("circle")
    .attr("cx", (d, i) => d.x)
    .attr("cy", (d, i) => d.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(153, 241, 55)")
    .transition()
    .style("opacity", d => {
      return selectedProvider.net.indexOf(Number(d.net)) < 0 ? 0.1 : 0.7;
    })
    .attr("r", 8)
    .duration(1000)
    .delay(() => {
      return Math.random() * (3000 - 500) + 500;
    })
    .ease(d3.easeElastic);

  d3.selectAll(".cellTower circle")
    .attr("cx", (d, i) => cellTowers[i].x)
    .attr("cy", (d, i) => cellTowers[i].y)
    .style("opacity", d => {
      return selectedProvider.net.indexOf(Number(d.net)) < 0 ? 0.1 : 0.7;
    });
};

const initMap = (center, zoom = 14) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom,
    styles: mapStyling.styling(),
    disableDefaultUI: false,
    disableDoubleClickZoom: true
  });
};
