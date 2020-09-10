import config from './config'
import axios from 'axios';

const API = axios.create({ baseURL: config.host});

export const Towers = (lat, lng, range = 300) => API.get(`towers?lat=${lat}&lng=${lng}&range=${range}`)
                                                        .then((response) => response.data)
                                                        .catch((error) => console.error(error));

export const CalculatedLocation = (mcc, mnc, cellTowers) => axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${config.apiKey}`, 
    { homeMobileCountryCode: mcc, homeMobileNetworkCode: mnc, considerIp: "false", cellTowers})
                                                        .then((response) => response.data)
                                                        .catch((error) => console.error(error));
