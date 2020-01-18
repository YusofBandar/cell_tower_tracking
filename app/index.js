window.onload = () => {
  let map;

  getLocation(
    result => {
      const coords = result.coords;
      const centre = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(centre);

      let overlay = new google.maps.OverlayView();
      overlay.draw = () => {
        const pixelCentre = coordsToPixel(
          overlay,
          new google.maps.LatLng(centre.lat, centre.lng)
        );
        updateLocationMarker(pixelCentre);
      };
      overlay.setMap(map);
    },
    () => {
      console.log("error getting location");
    }
  );
};

const coordsToPixel = (overlay, coord) => {
  return overlay.getProjection().fromLatLngToContainerPixel(coord);
};

const getLocation = (succ, err) => {
  navigator.geolocation.getCurrentPosition(succ, err);
};

const updateLocationMarker = pixelCoords => {
  d3.select("svg")
    .selectAll("g")
    .data([pixelCoords])
    .enter()
    .append("g")
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

  d3.selectAll("g circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y);
};

const initMap = (center, zoom = 15) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom,

    disableDoubleClickZoom: true
  });
};
