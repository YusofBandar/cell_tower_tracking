import api from "./api.js";

window.onload = () => {
  let map;
  let currentCoords;
  let cellTowers = [];
  getLocation(
    result => {
      const coords = result.coords;
      currentCoords = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(currentCoords);

      api.getTowers(currentCoords.lat, currentCoords.lng).then(result => {
        cellTowers = result;
      });

      let overlay = new google.maps.OverlayView();
      overlay.draw = () => {
        draw(overlay, currentCoords, cellTowers);
      };
      overlay.setMap(map);
    },
    () => {
      console.log("error getting location");
    }
  );

  watchPosition(result => {
    const coords = result.coords;
    currentCoords = { lat: coords.latitude, lng: coords.longitude };
    map.panTo(currentCoords);
  });
};

const draw = (overlay, currentCoords, cellTowers) => {
  const pixelCentre = coordsToPixel(
    overlay,
    new google.maps.LatLng(currentCoords.lat, currentCoords.lng)
  );

  updateCellTowerMarkers(
    cellTowers.map(tower =>
      coordsToPixel(overlay, new google.maps.LatLng(tower.lat, tower.lon))
    )
  );

  updateLocationMarker(pixelCentre);
};

const coordsToPixel = (overlay, coord) => {
  return overlay.getProjection().fromLatLngToContainerPixel(coord);
};

const getLocation = (succ, err) => {
  navigator.geolocation.getCurrentPosition(succ, err);
};

const watchPosition = (succ, err) => {
  navigator.geolocation.watchPosition(succ, err);
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
    .transition()
    .style("opacity", 1)
    .attr("r", 10)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.selectAll(".centre circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y);
};

const updateCellTowerMarkers = cellTowers => {
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
    .transition()
    .style("opacity", 1)
    .attr("r", 10)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.selectAll(".cellTower circle")
    .attr("cx", (d, i) => cellTowers[i].x)
    .attr("cy", (d, i) => cellTowers[i].y);
};

const initMap = (center, zoom = 15) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom,

    disableDoubleClickZoom: true
  });
};
