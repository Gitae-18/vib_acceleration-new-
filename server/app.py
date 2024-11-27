from flask import Flask, request, render_template
from wifi import WiFi
from vib_config import VibnetConfig
import time
import subprocess

wifi = WiFi('wlan0')
vib_config = VibnetConfig()
app = Flask(__name__)

def stop_vibnet():
    subprocess.call(["pkill", "vibnet"])

def start_vibnet_background():
    subprocess.Popen(["vibnet"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def restart_vibnet():
    stop_vibnet()
    time.sleep(1)  # 프로세스 종료를 기다립니다.
    start_vibnet_background()

class DeviceInfo():
    def __init__(self, dev_id, ip, sub_port, push_port, req_port) -> None:
        self.dev_id = dev_id
        self.ip = ip
        self.sub_port = sub_port
        self.push_port = push_port
        self.req_port = req_port

def get_device_info():
    cfg_devinfo = vib_config.GetConfig()

    string = cfg_devinfo['sub_addr']
    parts = string.split("//")[1].split(":")
    ip = parts[0]
    sub_port = parts[1]

    string = cfg_devinfo['push_addr']
    parts = string.split(":")
    push_port = parts[-1]

    string = cfg_devinfo['req_addr']
    parts = string.split(":")
    req_port = parts[-1]

    return DeviceInfo(cfg_devinfo['device_id'], ip, sub_port, push_port, req_port)

def set_device_info(dev_id, ip, sub_port, push_port, req_port):
    prefix = "tcp://{}:".format(ip)
    vib_config.SetConfig(device_id = dev_id, 
        sub_addr = prefix + sub_port,
        push_addr = prefix + push_port,
        req_addr = prefix + req_port)

@app.route('/', methods=['GET', 'POST'])
def home():
    dev_info = get_device_info()
    wifi.update_network_info()

    if request.method == 'GET':
        None
    elif request.method == 'POST':
        param = request.form.get('param')
        print(param)
        if param == 'set_ap':
            wifi.start_ap_mode()
        elif param == 'unset_ap':
            wifi.stop_ap_mode()
        elif param == 'edit_devinfo':
            set_device_info(request.form.get('id'),
                request.form.get('ip'),
                request.form.get('sub_port'),
                request.form.get('push_port'),
                request.form.get('req_port'))
            dev_info = get_device_info()
            restart_vibnet()
        elif param == 'scan':
            wifi.scan_ssid()
            print("검색된 WiFi SSID 목록:")
            for ssid in wifi.get_ssid_list():
                print(ssid)
        elif param == 'connect':
            ssid = request.form.get('ssid')
            password = request.form.get('password')

            is_ap = wifi.check_ap_mode()
            if is_ap == True:
                wifi.stop_ap_mode()
                time.sleep(3)
                print('sleep - done')

            rst = wifi.connect_to_wifi(ssid, password)
            if rst == True:
                restart_vibnet()

            if rst == False and is_ap == True:
                wifi.start_ap_mode()


    return render_template('index.html', dev_info = dev_info, wifi = wifi)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
