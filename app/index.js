window.onload = () => {
  let map;

  getLocation(
    result => {
      const coords = result.coords;
      const centre = { lat: coords.latitude, lng: coords.longitude };
      map = initMap(centre);
     
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
    zoom,
    disableDefaultUI : true,
    disableDoubleClickZoom : true,
    draggable : false
  });
};
