import api from "./api.js";
import conversion from "./conversions.js";
import key from "./key.js";

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
  const topN = parseInt(connectedTowers.length * (30/100));
  
  return api.getGeoLocation(key.key(), selectedProvider, connectedTowers.slice(0, topN));
};

export default {
  getLocation,
  watchLocation,
  getCalculatedLocation
};
