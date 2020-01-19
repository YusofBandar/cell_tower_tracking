const baseUrl = "http://127.0.0.1:5501";

const getTowers = (lat, lng) => {
    return getRequest(`${baseUrl}/towers?lat=${lat}&lng=${lng}`);
};

export default {
  getTowers
};

const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "get"
          }).then(result => {
              return result;
          })
          .then(result => {
            result.json().then((r) => {
                resolve(r);
            })
          })
          .catch((err) => {
              reject(err);
          })
    })
}
