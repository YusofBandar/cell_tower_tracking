const fs = require('fs');

const getConfig = () => {
    const config = {};

    if(!process.env.API_KEY) throw new Error('API_KEY env variable not defined');
    if(!process.env.API_HOST) throw new Error('API_HOST env variable not defined');

    config.apiKey = process.env.API_KEY;
    config.host = process.env.API_HOST;

    return config;
}

const writeConfig = (config) => {
    fs.writeFileSync('./src/config.js', `export default ${JSON.stringify(config)}`)
}

console.log('WRITING CONFIG');
writeConfig(getConfig());
