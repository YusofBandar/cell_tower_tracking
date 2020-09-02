import apiKey from './apiKey'
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5501'});

export const Towers = (lat, lng, range = 300) => API.get(`towers?lat=${lat}&lng=${lng}&range=${range}`)
                                                        .then((response) => response.data)
                                                        .catch((error) => console.error(error));

export const CalculatedLocation = (mcc, mnc, cellTowers) => axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, 
    { homeMobileCountryCode: mcc, homeMobileNetworkCode: mnc, considerIp: "false", cellTowers})
                                                        .then((response) => response.data)
                                                        .catch((error) => console.error(error));
