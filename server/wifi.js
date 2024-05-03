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
        exec(`ip route show dev ${this.interface}`, (error, stdout, stderr) => {
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
        exec(`ifconfig ${this.interface}`, (error, stdout, stderr) => {
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
    
    checkApMode() {
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
                try {
                    // hostapd와 dnsmasq 패키지 설치
                   // console.log("Installing hostapd and dnsmasq...");
                    //execSync('sudo apt-get install -y hostapd dnsmasq', { stdio: 'inherit' });
                
                    // 설정 파일을 백업하고 초기화
                    console.log("Backing up and resetting configuration files...");
                    execSync('sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig');
                    execSync('echo "" | sudo tee /etc/dnsmasq.conf'); // 파일을 비웁니다.
                
                    // DAEMON_CONF 추가
                    console.log("Adding DAEMON_CONF to hostapd...");
                    execSync('echo \'DAEMON_CONF="/etc/hostapd/hostapd.conf"\' | sudo tee -a /etc/default/hostapd');
                
                    console.log("Setup completed successfully.");
                } catch (error) {
                    console.error("Failed to complete setup:", error);
                }
                    execSync('sudo chmod u+w /etc/dnsmasq.conf');
                    //execSync('sudo chmod u+w /etc/hostapd.conf');
                    fs.writeFileSync('/etc/hostapd/hostapd.conf', `
                    interface=wlan0
                    driver=nl80211
                    ssid=My_AP
                    hw_mode=g
                    channel=7
                    wmm_enabled=0
                    macaddr_acl=0
                    auth_algs=1
                    ignore_broadcast_ssid=0
                    wpa=2
                    wpa_passphrase=MyPassword
                    wpa_key_mgmt=WPA-PSK
                    wpa_pairwise=TKIP
                    rsn_pairwise=CCMP
                    `);

                    // dnsmasq.conf 설정 파일 작성
                    try {
                        const configContent = `
                        interface=wlan0
                        dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h
                        `;
                        execSync(`echo "${configContent}" | sudo tee /etc/dnsmasq.conf`);
                        console.log('Configuration updated successfully');
                    } catch (error) {
                        console.error('Failed to write to /etc/dnsmasq.conf', error);
                    } 
                     const configContent = `
                    interface=wlan0
                    dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h
                    `;

                    fs.writeFile('/etc/dnsmasq.conf', configContent, (error) => {
                        if (error) {
                            console.error('Failed to write to /etc/dnsmasq.conf:', error);
                        } else {
                            console.log('Configuration updated successfully');
                        }
                    });

                    // IP forwarding 활성화
                    try {
                        execSync('echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf');
                        execSync('sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"');
                        console.log("IP forwarding has been enabled.");
                    } catch (error) {
                        console.error("Failed to enable IP forwarding:", error);
                    }
                    
                    exec('sudo service dhcpcd restart', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Failed to restart dhcpcd: ${stderr}`);
                            return;
                        }
                        console.log('dhcpcd restarted successfully.');
                    });
                
                    // dnsmasq 서비스 재시작
                    exec('sudo systemctl restart dnsmasq.service', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Failed to restart dnsmasq service: ${stderr}`);
                            return;
                        }
                        console.log('dnsmasq service restarted successfully.');
                    });
                
                    // hostapd 서비스 재시작
                    exec('sudo systemctl restart hostapd.service', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Failed to restart hostapd service: ${stderr}`);
                            return;
                        }
                        console.log('hostapd service restarted successfully.');
                    });
                this.updateApMode();
                console.log("AP mode started.");
                resolve(true);
            } catch (error) {
                console.error("Failed to start AP mode:", error);
                reject(false);
            }
        });
    }

    async stopApMode() {
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