import api from "./api.js";
import conversion from "./conversions.js";
import mapStyling from "./mapStyling.js";

const providers = [
  { provider: "BT", net: [0, 76, 77] },
  { provider: "O2", net: [2, 10, 11] },
  { provider: "Vodaphone", net: [7, 15, 91, 92] }
];

window.onload = () => {
  let map;

  let currentCoords;
  let originalCoords;

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
      };
      overlay.setMap(map);

      updateProviders(providers, "BT", provider => {
        selectedProvider = provider;
        draw(overlay, currentCoords, cellTowers, selectedProvider);
      });
    },
    () => {
      console.log("error getting location");
    }
  );

  watchPosition(result => {
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

const watchPosition = (succ, err) => {
  navigator.geolocation.watchPosition(succ, err);
};

const updateCalLocationMarker = pixelCoords => {
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
    .style("fill", "rgba(255,255,255)")
    .transition()
    .style("opacity", 0.8)
    .style("stroke", "rgba(255, 255, 255")
    .attr("r", 7)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.selectAll(".calCentre circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y);
}

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
    disableDefaultUI: true,
    disableDoubleClickZoom: true
  });
};
