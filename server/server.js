'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { spawn, exec } = require('child_process');
const wifi = require('./wifi');
const child = spawn('pwd');
const app = express();
const cors = require('cors');
const vibConfig = require('./vib-config');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = 5001;


function restartVibnet() {
    exec("kill vibnet", (err, stdout, stderr) => {
        if(err) return console.error("Vibnet quit error:", err);
        setTimeout(() => {
            spawn("vibnet", {stdio: 'ignore'});
        }, 1000);
    });
}

app.get("/", async(req,res) => {
    const devInfo = await vibConfig.getDeviceInfo();
    await wifi.updateNetworkInfo();
    res.render('index', { devInfo, wifi});
})

/* app.post('/', async (req, res) => {
    const param = req.body.param;

    switch (param) {
        case 'set_ap':
            wifi.startApMode();
            break;
        case 'unset_ap':
            wifi.stopApMode();
            break;
        case 'edit_devinfo':
            await vibConfig.setDeviceInfo(req.body);
            restartVibnet();
            break;
        case 'scan':
            const ssids = await wifi.scanSsid();
            console.log("검색된 WiFi SSID 목록:", ssids);
            break;
        case 'connect':
            const { ssid, password } = req.body;
            const connected = await wifi.connectToWifi(ssid, password);
            if (!connected) wifi.startApMode();
            break;
        default:
            break;
    }

    res.redirect('/');
});
 */
app.post('/handle_ap', async (req,res) => {
    const param = req.body.param;
    const dev_id = req.query.id;
    if(dev_id) {
        if(param) {
            wifi.startApMode();
        }
        else {
            wifi.stopApMode();
        }
        res.status(200).send({ message: "AP mode updated successfully." });
    } else {
        res.status(400).send({ error: "Invalid device ID" });
    }    
});
app.get("/dev_information", async (req, res) => {
    const dev_id = req.query.id;

})
app.get("/net_information", async (req, res) => {
    const dev_id = req.query.id;
    const config = new vibConfig();
    const deviceConfig = config.getConfig();

    if (deviceConfig.device_id !== dev_id) {
        res.status(404).send({ error: "Invalid device ID" });
        return;
    }


    res.json({
        IP_Address: deviceConfig.ip_address, 
        SubnetMask: deviceConfig.subnet_mask,
        Default_Gateway: deviceConfig.default_gateway,
        Mode: deviceConfig.mode,
        SSID: deviceConfig.ssid
    });
})
// 서버 시작
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
