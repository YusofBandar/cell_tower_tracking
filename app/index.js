window.onload = () => {
  let map = initMap();
};


const initMap = () => {
  return new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
};
