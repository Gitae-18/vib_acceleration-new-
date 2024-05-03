const fs = require('fs');
const ini  = require('ini');
const path = require('path');

const CONFIG_FILE = './etc/vibnet.conf';
const ENCODING = "utf-8";
const SECTION_COMMON = "Common";
const KEYS = {
    model_no: 'model_no',
    serial_no: 'serial_no',
    device_id: 'device_id',
    sub_addr: 'sub_addr',
    push_addr: 'push_addr',
    req_addr: 'req_addr'
}

const DEFAULTS = {
    model_no: 'FL-VIBNET101',
    serial_no: '44G29WP20303202',
    device_id: 'D000001',
    sub_addr: 'tcp://192.168.0.100:5555',
    push_addr: 'tcp://192.168.0.100:5557',
    req_addr: 'tcp://192.168.0.100:5559'
}
class VibnetConfig{
    constructor() {
        if(!fs.existsSync(CONFIG_FILE)) {
            this.generateDefault();
        }
    }
    readConfig() {
        const fileContent = fs.readFileSync(CONFIG_FILE, ENCODING);
        return ini.parse(fileContent);
    }

    writeConfig(config) {
        const configString = ini.stringify(config);
        fs.writeFileSync(CONFIG_FILE, configString, ENCODING);
        console.log('file make successful');
    }
    generateDefault() {
        const config = {};
        config[SECTION_COMMON] = DEFAULTS;
        this.writeConfig(config);
    }
    getConfig() {
        const config = this.readConfig();
        return config[SECTION_COMMON];
    }
    setConfig(options) {
        const config = this.readConfig();
        const section = config[SECTION_COMMON];

        for (let key in KEYS) {
            if(options[key] !== undefined) {
                section[KEYS[key]] = options[key];
            }
        }
        config[SECTION_COMMON] = section;
        this.writeConfig(config);
    }
}

module.exports = VibnetConfig;