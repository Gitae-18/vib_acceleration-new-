'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { spawn, exec } = require('child_process');
const WiFi = require('./wifi');
const wifi = new WiFi('wlan0');
const child = spawn('pwd');
const app = express();
const cors = require('cors');
const vibConfig = require('./vib-config');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = 4001;


function restartVibnet() {
    exec("kill vibnet", (err, stdout, stderr) => {
        if(err) return console.error("Vibnet quit error:", err);
        setTimeout(() => {
            spawn("vibnet", {stdio: 'ignore'});
        }, 1000);
    });
}

/* app.get("/", async(req,res) => {
    const devInfo = await vibConfig.getDeviceInfo();
    await wifi.updateNetworkInfo();
    res.render('index', { devInfo, wifi});
}) */

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
app.post('/handle_ap', async (req, res) => {
    const param = req.body.param;
    const dev_id = 'D000001'; 
    c
    if (dev_id) {
        try {
            if (param) {
                await wifi.startApMode();
            } else {
                await wifi.stopApMode();
            }
            res.status(200).send({ message: "AP mode updated successfully." });
        } catch (error) {
            console.error("Error handling AP mode:", error);
            res.status(500).send({ error: "Failed to update AP mode." });
        }
    } else {
        res.status(400).send({ error: "Invalid device ID" });
    }
});

/* app.get("/dev_information", async (req, res) => {
    const dev_id = req.query.id;

}) */
app.get("/net_information", async (req, res) => {
    try {
        // const dev_id = req.query.id; // 실제 사용 시 주석을 해제하고 req.query.id를 사용하세요.
        const dev_id = 'D000001';
        const config = new vibConfig();
        const deviceConfig = config.getConfig(); 
        if (deviceConfig.device_id !== dev_id) {
            res.status(404).send({ error: "Invalid device ID" });
            return;
        }

        console.log('Device Config : ', deviceConfig);

        res.send({
            IP_Address: '192.168.10.14',
            SubnetMask: '255.255.255.0',
            Default_Gateway: '192.168.10.1',
            Mode: 'NoActive',
            SSID: 'vib-e4:5f:01:fb:3d:e7'
        });
    } catch (error) {
        console.error('Error fetching device config:', error);
        res.status(500).send({ error: "An error occurred while fetching device configuration." });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
