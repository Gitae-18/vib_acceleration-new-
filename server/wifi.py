import subprocess
import RPi.GPIO as GPIO
import re
import configparser
import os.path
import time

#CONFIG_FILE = 'vib_wifi.conf'
CONFIG_FILE = '/etc/vib_wifi.conf'
CONFIG_ENCODING = 'utf-8'
SECTION = 'WiFi_IP'
KEY_METHOD = "method"
KEY_IP = "ip"
KEY_SUBNET = "subnet"
KEY_GATEWAY = "gateway"

GPIO_LED_SETUP = 16

LED_OFF = 0
LED_ON = 1

def hal_init():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(GPIO_LED_SETUP, GPIO.OUT)

def get_wifi_connection_name():
    try:
        result = os.popen("nmcli con show").read()  # nmcli 명령어 실행
        print("nmcli con show output:", result)  # 결과 출력
        for line in result.splitlines():
            if "wifi" in line:  # WiFi 타입의 연결만 선택
                connection_name = line.split()[0]  # 첫 번째 열에서 연결 이름 추출
                print("Detected Connection Name:", connection_name)
                return connection_name
        print("No WiFi connection found.")
        return None
    except Exception as e:
        print(f"Error finding WiFi connection name: {e}")
        return None
        
class WiFiConfig():
    def __init__(self):
        super().__init__()
        self.config = configparser.ConfigParser()
        if os.path.isfile(CONFIG_FILE) == False:
            # 설정파일 만들기
            self.config[SECTION] = {}
            self.config[SECTION][KEY_METHOD] = "auto"
            self._write()

        self._read()

    def _read(self):
        self.config.read(CONFIG_FILE, encoding=CONFIG_ENCODING) 

    def _write(self):
        with open(CONFIG_FILE, 'w', encoding=CONFIG_ENCODING) as configfile:
            self.config.write(configfile)

    @property
    def method(self):
        section = self.config[SECTION]
        return section.get(KEY_METHOD, '')

    @method.setter
    def method(self, value: str):
        self.config[SECTION][KEY_METHOD] = value

    @property
    def ip(self):
        section = self.config[SECTION]
        return section.get(KEY_IP, '')

    @ip.setter
    def ip(self, value: str):
        self.config[SECTION][KEY_IP] = value

    @property
    def subnet(self):
        section = self.config[SECTION]
        return section.get(KEY_SUBNET, '')

    @subnet.setter
    def subnet(self, value: str):
        self.config[SECTION][KEY_SUBNET] = value

    @property
    def gateway(self):
        section = self.config[SECTION]
        return section.get(KEY_GATEWAY, '')

    @gateway.setter
    def gateway(self, value: str):
        self.config[SECTION][KEY_GATEWAY] = value

    def save(self):
        self._write()

class WiFi():
    def __init__(self, interface='wlan0') -> None:
        hal_init()
        self.wifi_config = WiFiConfig()
        self.ap_mode = self.check_ap_mode()
        self.mac = '00:00:00:00:00:00'
        self.ip = '172.0.0.1'
        self.netmask = '255.255.255.0'
        self.gateway = '172.0.0.1'
        self.connection_wifi = False
        self.ssid_list = []
        self.interface = interface
        self.update_network_info()
        self.update_hostapd_ssid('vib-' + self.mac)

    def get_ssid_list(self):
        return self.ssid_list

    def scan_ssid(self, retries=2):
        new_list = []
        attempt = 0  # 재시도 횟수

        while attempt < retries:
            try:
                # Wi-Fi 스캔 실행
                result = subprocess.check_output(["iwlist", self.interface, "scan"], universal_newlines=True)

                # 결과에서 SSID 정보 추출
                for line in result.split("\n"):
                    if "ESSID" in line:
                        ssid = line.split(":")[1].strip().replace('"', '')  # 큰따옴표 제거
                        if len(ssid) > 0 and not ssid.startswith('\x00'):
                            new_list.append(ssid)

                # 성공 시 루프 종료
                break

            except subprocess.CalledProcessError as e:
                print(f"Error during Wi-Fi scan: {e}")
                attempt += 1  # 재시도 횟수 증가
                if attempt < retries:
                    print(f"Retrying... ({attempt}/{retries})")
                    time.sleep(1)  # 1초 대기
                else:
                    print("Max retries reached. Wi-Fi scan failed.")

        self.ssid_list = new_list

    def update_network_info(self):
        # ip, netmask, mac
        try:
            # ifconfig 명령어를 사용하여 wlan0의 네트워크 정보 가져오기
            cmd = ["ifconfig", self.interface]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # 결과에서 IP 주소, 넷마스크 및 MAC 주소 추출
            lines = result.stdout.strip().split('\n')
            for line in lines:
                if 'inet ' in line:
                    self.ip = line.split()[1]
                elif 'netmask ' in line:
                    self.netmask = line.split()[3]
                elif 'ether ' in line:
                    self.mac = line.split()[1]
        except subprocess.CalledProcessError as e:
            print("Error:", e.stderr)

        if self.ap_mode == True:
            self.gateway = self.ip
        else:
            # g/w
            try:
                # route 명령어를 사용하여 wlan0의 게이트웨이 정보 가져오기
                cmd = ["ip", "route", "show", "dev", self.interface]
                result = subprocess.run(cmd, capture_output=True, text=True, check=True)
                
                # 결과에서 게이트웨이 정보 추출
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if line.startswith("default"):
                        self.gateway = line.split()[2]
                
            except subprocess.CalledProcessError as e:
                print("Error:", e.stderr)

    def connect_to_wifi(self, ssid, password, method):
        retries = 3
        attempt = 0
        while attempt < retries:
            try:           
                # nmcli 명령 실행하여 WiFi에 연결
                if method == 'manual':
                    self.set_manual_ip(ssid)
                else: #auto
                    self.set_auto_ip(ssid)
                subprocess.run(["nmcli", "-w", "30",  "device", "wifi", "connect", ssid, "password", password], check=True)
                print(f"Connection WiFi {ssid}")
                self.update_network_info()
                print(f'method : {method}')
                

                self.connection_wifi = True
                break
            except subprocess.CalledProcessError as e:
                attempt += 1
                
                print(f"Error: {e}")
                print(f"Fail Connection WiFi {ssid} (Attempt {attempt}/{retries})")

                if attempt < retries:
                    print("Retrying...")
                    time.sleep(5)
                else:
                    print("Max retries reached. Wi-Fi connection failed.")

        return self.connection_wifi

    def set_static_ip(self, ip_address, subnet_mask, gateway):
        try:
            subprocess.run(['sudo', 'ifconfig', self.interface, ip_address, 'netmask', subnet_mask])
            subprocess.run(['sudo', 'route', 'add', 'default', 'gw', gateway, self.interface])
            print("고정 IP 주소가 설정되었습니다.")
            return True
        except Exception as e:
            print("고정 IP 주소를 설정하는 동안 오류가 발생했습니다:", e)
            return False

    def set_dhcp(self):
        try:
            # DHCP로 설정하기 위해 IP 주소 및 라우터 정보 삭제
            subprocess.run(['sudo', 'ifconfig', self.interface, '0.0.0.0'])
            subprocess.run(['sudo', 'route', 'del', 'default', 'gw', '0.0.0.0', self.interface])
            subprocess.run(['sudo', 'dhclient', '-r', self.interface])  # DHCP 릴리스
            subprocess.run(['sudo', 'dhclient', self.interface])  # DHCP 재요청
            print("DHCP로 설정되었습니다.")
            return True
        except Exception as e:
            print("DHCP로 설정하는 동안 오류가 발생했습니다:", e)
            return False

    def update_hostapd_ssid(self, new_ssid):
        filename = '/etc/hostapd/hostapd.conf'
        try:
            with open(filename, 'r') as file:
                lines = file.readlines()

            # 새로운 ssid로 변경
            for i, line in enumerate(lines):
                if line.strip().startswith('ssid='):
                    lines[i] = f'ssid={new_ssid}\n'
                    break

            # 변경된 내용을 파일에 쓰기
            with open(filename, 'w') as file:
                file.writelines(lines)

            print(f"ssid가 {new_ssid}로 변경되었습니다.")
        except Exception as e:
            print("파일을 업데이트하는 동안 오류가 발생했습니다:", e)

    def check_ap_mode(self):
        try:
            result = subprocess.run(['iw', 'dev'], capture_output=True, text=True)
            lines = result.stdout.splitlines()
            for line in lines:
                if "type AP" in line:
                    return True
            return False
        except Exception as e:
            print("오류가 발생했습니다: ", e)
            return False


    def start_ap_mode(self):
        try:
            '''
            # hostapd와 dnsmasq 패키지 설치
            subprocess.run(['sudo', 'apt-get', 'install', 'hostapd', 'dnsmasq'], check=True)

            # 설정 파일을 백업하고 초기화
            subprocess.run(['sudo', 'mv', '/etc/dnsmasq.conf', '/etc/dnsmasq.conf.orig'], check=True)
            subprocess.run(['echo', '', '|', 'sudo', 'tee', '/etc/dnsmasq.conf'], check=True)
            subprocess.run(['echo', 'DAEMON_CONF="/etc/hostapd/hostapd.conf"', '|', 'sudo', 'tee', '-a', '/etc/default/hostapd'], check=True)

            # hostapd 설정 파일 작성
            with open('/etc/hostapd/hostapd.conf', 'w') as f:
                f.write('interface=wlan0\n')
                fCHUU.write('driver=nl80211\n')
                f.write('ssid=My_AP\n')  # AP의 SSID 설정
                f.write('hw_mode=g\n')
                f.write('channel=7\n')
                f.write('wmm_enabled=0\n')
                f.write('macaddr_acl=0\n')
                f.write('auth_algs=1\n')
                f.write('ignore_broadcast_ssid=0\n')
                f.write('wpa=2\n')
                f.write('wpa_passphrase=MyPassword\n')  # AP의 비밀번호 설정
                f.write('wpa_key_mgmt=WPA-PSK\n')
                f.write('wpa_pairwise=TKIP\n')
                f.write('rsn_pairwise=CCMP\n')

            # dnsmasq 설정 파일 작성
            with open('/etc/dnsmasq.conf', 'w') as f:
                f.write('interface=wlan0\n')
                f.write('dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h\n')

            # IP forwarding 활성화
            subprocess.run(['echo', 'net.ipv4.ip_forward=1', '|', 'sudo', 'tee', '-a', '/etc/sysctl.conf'], check=True)
            subprocess.run(['sudo', 'sh', '-c', 'echo 1 > /proc/sys/net/ipv4/ip_forward'], check=True)
            '''

            # AP 모드로 변경
            subprocess.run(['service', 'dhcpcd', 'restart'], check=True)
            subprocess.run(['systemctl', 'restart', 'dnsmasq.service'], check=True)
            subprocess.run(['systemctl', 'restart', 'hostapd.service'], check=True)

        except subprocess.CalledProcessError as e:
            print("오류가 발생했습니다: ", e)
            return False

        self.ap_mode = self.check_ap_mode()
        print(self.ap_mode)
        return True

    def stop_ap_mode(self):
        try:
            # AP 모드 관련 서비스 종료  
            subprocess.run(['systemctl', 'restart', 'NetworkManager'], check=True)              
            subprocess.run(['systemctl', 'stop', 'hostapd'], check=True)
            subprocess.run(['systemctl', 'stop', 'dnsmasq'], check=True)

            """ # 인터페이스 초기화
            if self.is_network_manager_active():
                print("NetworkManager 활성화 상태 - 재시작 진행 중...")
                subprocess.run(['systemctl', 'restart', 'NetworkManager'], check=True)
            else:
                print("NetworkManager 비활성화 상태 - 수동으로 인터페이스 초기화 중...")
                subprocess.run(['sudo', 'ifconfig', self.interface, 'down'], check=True)
                subprocess.run(['sudo', 'ifconfig', self.interface, 'up'], check=True) """

            print("AP 모드 종료 및 인터페이스 초기화 완료")
        except subprocess.CalledProcessError as e:
            print(f"AP 모드 종료 중 오류 발생: {e}")
            return False
        except Exception as e:
            print(f"예기치 못한 오류 발생: {e}")
            return False

        self.ap_mode = self.check_ap_mode()
        return True

    def get_current_ssid(self):
        try:            
            result = subprocess.run(['iwgetid', '-r'], capture_output=True, text=True, check=True)
            ssid = result.stdout.strip()
            return ssid
        except subprocess.CalledProcessError as e:
#print(f"Error occurred: {e}")
            return None

    def set_wificonfig(self, method: str, ip: str = None, subnet: str = None, gateway: str = None):
        print(method, ip, subnet, gateway)

        if method == 'manual':
            self.wifi_config.method = method
            if self.wifi_config.method != method or self.wifi_config.ip != ip or self.wifi_config.subnet != subnet or self.wifi_config.gateway != gateway:
                self.wifi_config.method = method
                self.wifi_config.ip = ip
                self.wifi_config.subnet = subnet
                self.wifi_config.gateway = gateway
                self.wifi_config.save()
#self.set_manual_ip()
        else: #auto
            if self.wifi_config.method != method:
                self.wifi_config.method = method
                self.wifi_config.save()
#self.set_auto_ip()

        self.update_network_info()

    
    def subnet_to_cidr(self, subnet_mask):
    
        return sum(bin(int(octet)).count('1') for octet in subnet_mask.split('.'))
    
    def setting_manual_ip(self, connection_name, ip, subnet, gateway):
        try:
            # 서브넷 마스크를 CIDR로 변환
            cidr = self.subnet_to_cidr(subnet)

            # IP 주소 설정 (CIDR 형식)
            subprocess.run(
                ["sudo", "nmcli", "con", "mod", connection_name, "ipv4.addresses", f"{ip}/{cidr}"],
                check=True
            )

            # 게이트웨이 설정
            subprocess.run(
                ["sudo", "nmcli", "con", "mod", connection_name, "ipv4.gateway", gateway],
                check=True
            )

            # 수동 IP 모드 활성화
            subprocess.run(
                ["sudo", "nmcli", "con", "mod", connection_name, "ipv4.method", "manual"],
                check=True
            )

            # 네트워크 연결 활성화
            subprocess.run(
                ["sudo", "nmcli", "con", "up", connection_name],
                check=True
            )

            print("IP configuration updated successfully.")
            return True

        except subprocess.CalledProcessError as e:
            print(f"Failed to set manual IP: {e}")
            return False


    def set_manual_ip(self, ssid):
        #ssid = self.get_current_ssid()
        print(f'current ssid : {ssid}')
        if ssid == None:
            return

        ip_address = self.wifi_config.ip
        subnet_mask = self.wifi_config.subnet
        gateway = self.wifi_config.gateway
        try:
            subprocess.run(['nmcli', 'connection', 'modify', ssid, 'ipv4.method', 'manual', 'ipv4.addresses', ip_address, 'ipv4.gateway', gateway, 'ipv4.dns', "8.8.8.8"], check=True)

            subprocess.run(['nmcli', 'connection', 'down', ssid], check=True)
            subprocess.run(['nmcli', 'connection', 'up', ssid], check=True)
            subprocess.run(['nmcli', 'connection', 'save', ssid], check=True)

            print(f"Manual IP configuration saved for SSID: {ssid}")
        except Exception as e:
            print(f"Error occurred: {e}")

    def set_auto_ip(self, ssid):
        #ssid = self.get_current_ssid()
        print(f'current ssid : {ssid}')
        if ssid == None:
            return

        try:
            subprocess.run(['nmcli', 'connection', 'modify', ssid, 'ipv4.method', 'auto'], check=True)
            subprocess.run(['nmcli', 'connection', 'down', ssid], check=True)
            subprocess.run(['nmcli', 'connection', 'up', ssid], check=True)
            subprocess.run(['nmcli', 'connection', 'save', ssid], check=True)

            print(f"Manual IP configuration saved for SSID: {ssid}")
        except Exception as e:
            print(f"Error occurred: {e}")


    def check_ip_config(self, ssid):
        try:
            # IP 설정 방식 확인
            result = subprocess.run(['nmcli', 'connection', 'show', ssid], 
                                  capture_output=True, 
                                  text=True, 
                                  check=True)
            
            # IPv4 설정 정보 추출
            ip_config = {}
            for line in result.stdout.split('\n'):
                if 'ipv4.method' in line:
                    ip_config['method'] = line.split(':')[1].strip()
                elif 'ipv4.addresses' in line:
                    ip_config['address'] = line.split(':')[1].strip()
                elif 'ipv4.gateway' in line:
                    ip_config['gateway'] = line.split(':')[1].strip()
                elif 'ipv4.dns' in line:
                    ip_config['dns'] = line.split(':')[1].strip()
            
            return (ip_config.get('method', 'unknown'), ip_config)
        except subprocess.CalledProcessError as e:
            print(f"Error checking {connection_name}: {e}")
            return (ssid, 'error', {})
if __name__ == '__main__':
    wifi = WiFi('wlan0')

    if wifi.ap_mode:
        wifi.stop_ap_mode()
    else:
        wifi.start_ap_mode()
