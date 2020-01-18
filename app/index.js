window.onload = () => {
  let map;

  getLocation(
    result => {
      const coords = result.coords;
      const centre = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(centre);
      let positionCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: centre,
        radius: 40
      });

      map.addListener("projection_changed",() => {
          console.log("result", coordsToPixel(map, map.center));
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

const initMap = (center, zoom = 15) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom
  });
};
