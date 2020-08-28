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

export default {
    offsetCoordsMetres
}
