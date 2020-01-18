window.onload = () => {
  let map;

  getLocation(
    result => {
      const coords = result.coords;
      map = initMap({ lat: coords.latitude, lng: coords.longitude });
    },
    () => {
      console.log("error getting location");
    }
  );
};

const getLocation = (succ, err) => {
  navigator.geolocation.getCurrentPosition(succ, err);
};

const initMap = (center, zoom = 15) => {
  return new google.maps.Map(document.getElementById("map"), {
    center,
    zoom
  });
};
