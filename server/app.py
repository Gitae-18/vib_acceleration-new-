from flask import Flask, request, jsonify, send_from_directory
from wifi import WiFi
from vib_config import VibnetConfig
import subprocess
import time

app = Flask(__name__, static_folder="../client/build", static_url_path="/")

wifi = WiFi('wlan0')
vib_config = VibnetConfig()

class DeviceInfo:
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

@app.route('/api/device_info', methods=["GET"])
def api_device_info():
    dev_info = get_device_info()
    wifi.update_network_info()

    return jsonify({
        "dev_info": {
            "dev_id": dev_info.dev_id,
            "ip": dev_info.ip,
            "sub_port": dev_info.sub_port,
            "push_port": dev_info.push_port,
            "req_port": dev_info.req_port
        },
        "wifi": {
            "ssid_list": wifi.get_ssid_list()
        }
    })

@app.route('/<path:path>', methods=["GET"])
def serve_react_app(path):
    return send_from_directory(app.static_folder, path)

@app.errorhandler(404)
def serve_react_fallback(e):
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
