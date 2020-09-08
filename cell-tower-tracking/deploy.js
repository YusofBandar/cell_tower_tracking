const fs = require('fs');

const getConfig = () => {
    const config = {};

    if(!process.env.APIKEY) throw new Error('USER env variable not defined');

    config.apiKey = process.env.APIKEY;

    return config;
}

const writeConfig = (config) => {
    fs.writeFileSync('./src/config.js', `export default ${JSON.stringify(config)}`)
}

console.log('WRITING CONFIG');
writeConfig(getConfig());
