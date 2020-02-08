const baseUrl = "http://127.0.0.1:5501";

const getTowers = (lat, lng) => {
  return getRequest(`${baseUrl}/towers?lat=${lat}&lng=${lng}`);
};

const getGeoLocation = (apiKey, carrier, cellTowers) => {
  const body = {
    homeMobileCountryCode: carrier.mcc,
    homeMobileNetworkCode: carrier.mnc,
    considerIp: "false",
    cellTowers
  };

  return postRequest(
    `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
    body
  );
};

const getKey = () => {
  return getRequest(`${baseUrl}/key`)
}

const getRequest = url => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "get"
    })
      .then(result => {
        return result;
      })
      .then(result => {
        result.json().then(r => {
          resolve(r);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postRequest = (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "post",
      body: JSON.stringify(body)
    })
      .then(result => {
        result.status === 404 && reject(result);
        return result;
      })
      .then(result => {
        result.json().then(r => {
          resolve(r);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default {
  getTowers,
  getGeoLocation,
  getKey
};
