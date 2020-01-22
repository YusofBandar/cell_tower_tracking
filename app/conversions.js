// taken from https://gis.stackexchange.com/a/2980
const offsetCoordsMetres = (lat, lng, northOffset, eastOffset) => {
  //Earth’s radius, sphere
  const R = 6378137;

  //Coordinate offsets in radians
  const dLat = northOffset / R;
  const dLng = eastOffset / (R * Math.cos((Math.PI * lat) / 180));

  //OffsetPosition, decimal degrees
  const latO = lat + (dLat * 180) / Math.PI;
  const lngO = lng + (dLng * 180) / Math.PI;

  return [latO, lngO];
};

// taken from https://stackoverflow.com/a/11172685
const coordsDistanceMetres = (lat1, lng1, lat2, lng2) => {
  const R = 6378.137; // Radius of earth in KM

  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dlng = (lng2 * Math.PI) / 180 - (lng1 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlng / 2) *
      Math.sin(dlng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d * 1000; // meters
};

export default {
  offsetCoordsMetres,
  coordsDistanceMetres
};
