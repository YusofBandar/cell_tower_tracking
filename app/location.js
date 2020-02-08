import api from "./api.js";
import conversion from "./conversions.js";

let key = "";

api.getKey().then(result => {
  key = result.key;
});

const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      result => {
        resolve(result);
      },
      err => {
        reject(err);
      }
    );
  });
};

const watchLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.watchPosition(
      result => {
        resolve(result);
      },
      err => {
        reject(err);
      }
    );
  });
};

const getCalculatedLocation = (cellTowers, selectedProvider, currentCoords) => {
  let connectedTowers = cellTowers
    .filter(d =>
      selectedProvider.net.indexOf(Number(d.net)) < 0 ? false : true
    )
    .map(d => {
      d.distance = conversion.coordsDistanceMetres(
        d.lat,
        d.lon,
        currentCoords.lat,
        currentCoords.lng
      );

      return d;
    })
    .sort((a, b) => a.distance - b.distance)
    .map(d => {
      return {
        cellId: d.cell,
        locationAreaCode: d.area,
        mobileCountryCode: d.mcc,
        mobileNetworkCode: d.net,
        distance: d.distance
      };
    });
  const topN = parseInt(connectedTowers.length * (30 / 100));
  if (key === "") {
    return api.getKey().then(result => {
      return api.getGeoLocation(
        result.key,
        selectedProvider,
        connectedTowers.slice(0, topN)
      );
    });
  }

  return api.getGeoLocation(
    key,
    selectedProvider,
    connectedTowers.slice(0, topN)
  );
};

export default {
  getLocation,
  watchLocation,
  getCalculatedLocation
};
