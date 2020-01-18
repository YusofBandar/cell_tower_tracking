window.onload = () => {
  let map;

  getLocation(
    result => {
      const coords = result.coords;
      const centre = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(centre);
     
      map.addListener("projection_changed",() => {
         const pixelCentre = coordsToPixel(map, map.center);
         updateLocationMarker(pixelCentre);
      })
    },
    () => {
      console.log("error getting location");
    }
  );
};

const coordsToPixel = (map, coord) => {
    return map.getProjection().fromLatLngToPoint(coord);
}

const getLocation = (succ, err) => {
  navigator.geolocation.getCurrentPosition(succ, err);
};

const updateLocationMarker = (pixelCoords) => {
    let svg = d3.select("svg");

    svg.append("g")
        .attr("class","centre")
        .selectAll("circles")
        .data([pixelCoords])
        .enter()
        .append("circle")
        .attr("cx",pixelCoords.x)
        .attr("cy",pixelCoords.y)
        .attr("r",10);
}

const initMap = (center, zoom = 15) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom,
    disableDefaultUI : true,
    disableDoubleClickZoom : true,
    draggable : false
  });
};
