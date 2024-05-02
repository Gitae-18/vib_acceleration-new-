const { exec, execSync } = require('child_process');
const fs = require('fs');
const ini  = require('ini');
const path = require('path');

class WiFi {
    constructor(inter) {
        this.inter = inter;
        this.apMode = this.checkApMode();
        this.mac = '00:00:00:00:00:00';
        this.ip = '172.0.0.1';
        this.netmask = '255.255.255.0';
        this.gateway = '172.0.0.1';
        this.connectionWifi = false;
        this.ssidList = [];
        this.updateNetworkInfo();
        this.updateHostapdSsid(`vib-${this.mac}`);
        this.apMode = false;
        this.updateApMode();
    }

    get ssidList() {
        return this.ssidList;
    }

    scanSsid() {
        return new Promise((resolve, reject) => {
            exec(`iwlist ${this.inter} scan`, (error, stdout, stderr) => {
                if(error) {
                    console.error(`scan SSID error : ${stderr}`);
                    reject(stderr);
                    return;
                }
                const lines = stdout.split('\n');
                this.ssidList = lines
                    .filter(line => line.trim().startsWith('ESSID:'))
                    .map(line => line.split(':')[1].trim().replace(`/"/g,"`))
                    .filter(ssid => ssid && !ssid.startsWith('\x00'));
                resolve(this.ssidList);
            });
        });
    }

    updateNetworkInfo() {
        exec(`ifconfig ${this.interface}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`updateNetworkInfo error: ${stderr}`);
                return;
            }
            const lines = stdout.split('\n');
            lines.forEach(line => {
                if(line.includes('inet')) this.ip = line.split()[1]; 
                if(line.includes('netmask')) this.netmask = line.split()[3];
                if(line.includes('ether')) this.mac = line.split()[1];
            });
        });
    }

    connectToWiFi(ssid, password) {
        return new Promise((resolve, reject) => {
            exec(`nmcli device wifi connect ${ssid} password ${password}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`connectToWiFi error : ${stderr}`);
                    this.connectionWiFi = false;
                    reject(stderr);
                } else {
                    console.log(`Connected to WiFi ${ssid}`);
                    this.updateNetworkInfo();
                    this.connectionWiFi = true;
                    resolve(true);
                }
            });
        });
    }
    checkApMode() {
        try{
            const result = execSync(`iw dev ${this.inter}`).toString();
            return result.includes('type AP');    
        } catch (error) {
            console.error(`checkApMode error: ${error}`);
            return false;
        }
    }
    setStaticIp(ipAddress, subnetMask, gateway) {
        return new Promise((resolve, reject) => {
            try {
                execSync(`sudo ifconfig ${this.inter} ${ipAddress} netmask ${subnetMask}`);
                execSync(`sudo route add default gw ${gateway} ${this.inter}`);
                console.log("Static IP address has been set");
                resolve(true);
            }
            catch (error) {
                console.error("An error occured while setting static IP:", error);
                reject(false);
            }
        });
    }
    setDhcp() {
        return new Promise((resolve, reject) => {
            try {
                execSync(`sudo ifconfig ${this.inter} 0.0.0.0`);
                execSync(`sudo route del default gw 0.0.0.0 ${this.inter}`);
                execSync(`sudo dhclient -r ${this.inter}`);
                execSync(`sudo dhclient ${this.inter}`);
                console.log("DHCP has been set.");
                resolve(true);
            }
            catch (error) {
                console.error("An error occurred while setting DHCP:", error);
                reject(false);
            }
        });
    }

    updateHostapdSsid(newSsid) {
        return new Promise((resolve, reject) => {
            const filename = '/etc/hostapd/hostapd.conf';
            try {
                let contents = fs.readFileSync(filename, 'utf8');
                let lines = contents.split('\n');
                lines = lines.map(line => line.startsWith('ssid=') ? `ssid=${newSsid}` : line);
                fs.writeFileSync(filename, lines.join('\n'));
                console.log(`SSID has been updated to ${newSsid}.`);
                resolve(true);
            }
            catch (error) {
                console.error("An error occurred while updating the SSID file:", error);
                reject(false);
            }
        });
    }

    updateApMode() {
        try {
            const output = execSync(`iw ${this.inter} info`).toString();
            this.apMode = output.includes('type AP');
            console.log("AP mode status updated:", this.apMode);
        }
        catch (error) {
            console.error("Error updating AP mode status:", error);
        }
    }
    
    startApMode() {
        return new Promise((resolve, reject) => {
            try {
                // 해당 설정에 필요한 실제 명령을 구현해야 합니다.
                execSync(`sudo systemctl restart hostapd.service`);
                execSync(`sudo systemctl restart dnsmasq.service`);
                this.updateApMode();
                console.log("AP mode started.");
                resolve(true);
            } catch (error) {
                console.error("Failed to start AP mode:", error);
                reject(false);
            }
        });
    }

    stopApMode() {
        return new Promise((resolve, reject) => {
            try {
                execSync(`sudo systemctl stop hostapd`);
                execSync(`sudo systemctl stop dnsmasq`);
                this.updateApMode();
                console.log("AP mode stopped.");
                resolve(true);
            } catch (error) {
                console.error("Failed to stop AP mode:", error);
                reject(false);
            }
        });
    }

}
if (require.main === module) {
    const wifi = new WiFi('wlan0');

    wifi.checkApMode().then(isApMode => {
        if (isApMode) {
            wifi.stopApMode().then(() => {
                console.log("AP 모드가 정상적으로 종료되었습니다.");
            }).catch(err => {
                console.error("AP 모드 종료 중 오류 발생:", err);
            });
        } else {
            wifi.startApMode().then(() => {
                console.log("AP 모드가 정상적으로 시작되었습니다.");
            }).catch(err => {
                console.error("AP 모드 시작 중 오류 발생:", err);
            });
        }
    });
}
module.exports = WiFi;