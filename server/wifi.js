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
        this.stopApMode();
        this.startApMode();
    }

    get ssidList() {
        return this.ssidList;
    }
    set ssidList(value) {
        this._ssidList = value;
    }
    scanSsid() {
        return new Promise((resolve, reject) => {
            try {
                exec(`iwlist ${this.inter} scan`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`scan SSID error : ${stderr}`);
                        reject(stderr);
                        return;
                    }
                    const lines = stdout.split('\n');
                    const ssids = lines
                        .filter(line => line.trim().startsWith('ESSID:'))
                        .map(line => line.split(':')[1].trim().replace(`/"/g,"`))
                        .filter(ssid => ssid && !ssid.startsWith('\x00'));
                    this.ssidList = ssids; // setter를 통해 값을 업데이트
                    resolve(this.ssidList);
                });
            } catch (error) {
                console.error("An error occurred in scanSsid:", error);
                reject(error);
            }
        });
    }    updateGateway() {
        exec(`ip route show dev ${this.inter}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${stderr}`);
                return;
            }

            const lines = stdout.split('\n');
            const defaultLine = lines.find(line => line.startsWith('default'));
            if (defaultLine) {
                this.gateway = defaultLine.split(' ')[2];
            }
        });
    }
    updateNetworkInfo() {
        exec(`ifconfig ${this.inter}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${stderr}`);
                return;
            }

            // 결과에서 IP 주소, 넷마스크 및 MAC 주소 추출
            const lines = stdout.split('\n');
            lines.forEach(line => {
                if (line.includes('inet ')) {
                    this.ip = line.split('inet ')[1].split(' ')[0];
                }
                if (line.includes('netmask')) {
                    this.netmask = line.split('netmask ')[1].split(' ')[0];
                }
                if (line.includes('ether')) {
                    this.mac = line.split('ether ')[1].split(' ')[0];
                }
            });

            // 게이트웨이 정보 업데이트
            if (this.apMode) {
                this.gateway = this.ip;
            } else {
                this.updateGateway();
            }
        });
    }

    async connectToWiFi(ssid, password) {
        try {
            return await new Promise((resolve, reject) => {
                exec(`nmcli -w 30 device wifi connect ${ssid} password ${password}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error connecting to WiFi ${ssid}: ${stderr}`);
                        this.connectionWifi = false;
                        reject(new Error(`Failed to connect to WiFi ${ssid}: ${stderr}`));
                    } else {
                        console.log(`Connected to WiFi ${ssid}`);
                        this.updateNetworkInfo();
                        this.connectionWifi = true;
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            throw new Error('WiFi connection failed');
        }
    }
    
    /* checkApMode() {
        try {
            const result = execSync('iw dev').toString();
            const lines = result.split('\n');
            for (const line of lines) {
                if (line.includes('type AP')) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('오류가 발생했습니다:', error);
            return false;
        }
    } */
    checkApMode() {
        try {
            const result = execSync('iw dev').toString();  // 결과를 문자열로 변환
            const isApModeActive = result.includes('type AP');  // 'type AP' 포함 여부 확인
            return isApModeActive;
        } catch (error) {
            console.error('AP 모드 상태 확인 중 오류가 발생했습니다:', error);
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
    
    /* startApMode() {
        return new Promise((resolve, reject) => {
            // 시스템 명령 실행하여 dhcpcd, dnsmasq, hostapd 재시작
            exec('sudo service dhcpcd restart && sudo systemctl restart dnsmasq.service && sudo systemctl restart hostapd.service', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error restarting services: ${stderr}`);
                    reject(stderr);
                } else {
                    console.log('Services restarted successfully');
                    // 실제 AP 모드 상태를 확인하는 로직 필요
                    // 예제에서는 AP 모드 상태를 확인하는 별도의 함수가 필요하다고 가정
                    this.checkApMode().then(isApMode => {
                        resolve(isApMode);  // AP 모드의 상태를 반환
                    }).catch(err => {
                        reject(err);
                    });
                }
            });
        });
    } */
    startApModeSync() {
        try {
            // dhcpcd, dnsmasq, hostapd 서비스를 동기적으로 재시작
            execSync('sudo service dhcpcd restart');
            execSync('sudo systemctl restart dnsmasq.service');
            execSync('sudo systemctl restart hostapd.service');
            console.log('Services restarted successfully');
            
            // AP 모드 상태를 동기적으로 확인
            return this.checkApMode(); // 동기적인 AP 모드 확인 함수가 필요합니다
        } catch (error) {
            console.error(`Error restarting services: ${error.stderr}`);
            return false;
        }
    }
    /* async stopApMode() {
        try {
            await new Promise((resolve, reject) => {
                // NetworkManager 재시작
                exec('sudo systemctl restart NetworkManager', (error, stdout, stderr) => {
                    if (error) {
                        console.error("Failed to restart NetworkManager:", stderr);
                        reject(new Error(`NetworkManager restart failed: ${stderr}`));
                        return;
                    }
                    resolve();
                });
            });
    
            await new Promise((resolve, reject) => {
                // hostapd 서비스 중지
                exec('sudo systemctl stop hostapd', (error, stdout, stderr) => {
                    if (error) {
                        console.error("Failed to stop hostapd service:", stderr);
                        reject(new Error(`hostapd stop failed: ${stderr}`));
                        return;
                    }
                    resolve();
                });
            });
    
            await new Promise((resolve, reject) => {
                // dnsmasq 서비스 중지
                exec('sudo systemctl stop dnsmasq', (error, stdout, stderr) => {
                    if (error) {
                        console.error("Failed to stop dnsmasq service:", stderr);
                        reject(new Error(`dnsmasq stop failed: ${stderr}`));
                        return;
                    }
                    resolve();
                });
            });
    
            await new Promise((resolve, reject) => {
                // IP forwarding 비활성화 (옵셔널)
                exec('sudo sh -c "echo 0 > /proc/sys/net/ipv4/ip_forward"', (error, stdout, stderr) => {
                    if (error) {
                        console.error("Failed to disable IP forwarding:", stderr);
                        reject(new Error(`IP forwarding disable failed: ${stderr}`));
                        return;
                    }
                    resolve();
                });
            });
    
            this.apMode = false; // AP 모드 상태 업데이트
            console.log("AP mode stopped successfully.");
            return true;
        } catch (error) {
            console.error(`An error occurred while stopping AP mode: ${error.message}`);
            throw new Error('Stopping AP mode failed');
        }
    } */
    stopApMode() {
        try {
            // NetworkManager 재시작
            /* execSync('sudo systemctl restart NetworkManager');
            console.log("NetworkManager restarted successfully."); */
    
            // hostapd 서비스 중지
            execSync('sudo systemctl stop hostapd');
            console.log("hostapd service stopped successfully.");
    
            // dnsmasq 서비스 중지
            execSync('sudo systemctl stop dnsmasq');
            console.log("dnsmasq service stopped successfully.");
    
            // IP forwarding 비활성화 (옵셔널)
            execSync('sudo sh -c "echo 0 > /proc/sys/net/ipv4/ip_forward"');
            console.log("IP forwarding disabled successfully.");
    
            this.apMode = false; // AP 모드 상태 업데이트
            console.log("AP mode stopped successfully.");
            return true;
        } catch (error) {
            console.error(`An error occurred while stopping AP mode: ${error}`);
            throw new Error('Stopping AP mode failed: ' + error.message);
        }
    }
    

}
module.exports = WiFi;
/* if (require.main === module) {
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
} */