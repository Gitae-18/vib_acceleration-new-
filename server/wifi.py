import subprocess

#set_static_ip('192.168.10.7', '255.255.255.0', '192.168.10.1')
#set_dhcp()

class WiFi():
    def __init__(self, interface) -> None:
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

    def scan_ssid(self):
        new_list = []
        try:
            result = subprocess.check_output(["iwlist", self.interface, "scan"], universal_newlines=True)
            # 결과에서 SSID 정보 추출
            for line in result.split("\n"):
                if "ESSID" in line:
                    ssid = line.split(":")[1].strip().replace('"', '')  # 큰따옴표 제거
                    if len(ssid) > 0 and not ssid.startswith('\x00'):
                        new_list.append(ssid)

        except subprocess.CalledProcessError as e:
            print(f"Error: {e}")
        
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

    def connect_to_wifi(self, ssid, password):
        try:
            # nmcli 명령 실행하여 WiFi에 연결
            subprocess.run(["nmcli", "-w", "30",  "device", "wifi", "connect", ssid, "password", password], check=True)
            print(f"Connection WiFi {ssid}")
            self.update_network_info()
            self.connection_wifi = True
        except subprocess.CalledProcessError as e:
            print(f"Error: {e}")
            print(f"Fail Connection WiFi {ssid}")
            self.connection_wifi = False

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
            # AP 모드 종료
            subprocess.run(['systemctl', 'restart', 'NetworkManager'], check=True)
            subprocess.run(['systemctl', 'stop', 'hostapd'], check=True)
            subprocess.run(['systemctl', 'stop', 'dnsmasq'], check=True)
            # IP forwarding 비활성화
            #subprocess.run(['sudo', 'sh', '-c', 'echo 0 > /proc/sys/net/ipv4/ip_forward'], check=True)
        except subprocess.CalledProcessError as e:
            print("오류가 발생했습니다: ", e)
            return False

        self.ap_mode = self.check_ap_mode()
        return True

if __name__ == '__main__':
    wifi = WiFi('wlan0')

    if wifi.ap_mode:
        wifi.stop_ap_mode()
    else:
        wifi.start_ap_mode()
