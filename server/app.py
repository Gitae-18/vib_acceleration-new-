from flask import Flask, request, render_template, jsonify, send_from_directory
from wifi import WiFi
from vib_config import VibnetConfig
import time
import subprocess
import shutil

wifi = WiFi('wlan0')
vib_config = VibnetConfig()
app = Flask(__name__, static_folder="../client/build", static_url_path="/")
def stop_vibnet():
    subprocess.call(["pkill", "vibnet"])

def start_vibnet_background():
    subprocess.Popen(["vibnet"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# React 정적 파일 제공
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# 404 처리: React 라우트로 연결
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')
def restart_vibnet():
    stop_vibnet()
    time.sleep(1)  # 프로세스 종료를 기다립니다.
    start_vibnet_background()

class DeviceInfo():
    def __init__(self, device_id, ip, sub_port, push_port, req_port) -> None:
        self.device_id = device_id
        self.ip = ip
        self.sub_port = sub_port
        self.push_port = push_port
        self.req_port = req_port

def normalize_address(addr):    
    if not addr.startswith("tcp://"):
        return f"tcp://{addr}"
    return addr

def get_device_info():
    cfg_devinfo = vib_config.GetConfig()
    print(f"Config Data: {cfg_devinfo}")

    def parse_address(address):
        print(f"now address : {address}")        
        if address.startswith("tcp://"):
            address = address.split("tcp://")[1]

        parts = address.split(":")
        if len(parts) != 2:
            raise ValueError(f"Invalid address format: {address}. Port is missing.")

        ip = parts[0]
        port = parts[1]

        return ip, port

    try:
        ip, sub_port = parse_address(cfg_devinfo['sub_addr'])
        _, push_port = parse_address(cfg_devinfo['push_addr'])
        _, req_port = parse_address(cfg_devinfo['req_addr'])
    except ValueError as e:
        print(f"[Error] {e}")
        raise

    return DeviceInfo(cfg_devinfo['device_id'], ip, sub_port, push_port, req_port)


def set_device_info(dev_id, ip, sub_port, push_port, req_port):
    if not all([dev_id, ip, sub_port, push_port, req_port]):
        raise ValueError("All fields must be non-empty!")

    prefix = f"tcp://{ip}:" if not ip.startswith("tcp://") else f"{ip}:"
    
    config_data = {
        'device_id': dev_id,
        'sub_addr': prefix + sub_port,
        'push_addr': prefix + push_port,
        'req_addr': prefix + req_port,
    }
    print(f"Setting Config Data: {config_data}")
    vib_config.SetConfig(**config_data)
    

def get_storage(path="/"):    
    try:
        total, used, free = shutil.disk_usage(path)
        return {
            "total": total // (1024**3),
            "used": used // (1024**3),
            "free": free // (1024**3)
        }
    except FileNotFoundError:
        return {"error": f"Path '{path}' not found"}
    except PermissionError:
        return {"error": f"Permission denied for path '{path}'"}
    
@app.route('/api/network/ap_mode', methods=['GET'])
def get_ap_mode():
    ap_mode = wifi.check_ap_mode()
    return jsonify({"ap_mode": ap_mode})

@app.route('/api/network/start_ap', methods=['POST'])
def start_ap():
    success = wifi.start_ap_mode()
    return jsonify({"success": success})

@app.route('/api/network/stop_ap', methods=['POST'])
def stop_ap():
    success = wifi.stop_ap_mode()
    return jsonify({"success": success})

""" @app.route('/api/network/scan', methods=['GET'])
def scan_wifi():
    wifi.scan_ssid()
    ssid_list = wifi.get_ssid_list()
    return jsonify({"ssid_list": ssid_list}) """

@app.route('/api/network/update', methods=['POST'])
def update_network_info():
    try:
        wifi.update_network_info()
        return jsonify({"success": True, "message": "Network info updated"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/network', methods=['GET'])
def get_network_info():  
        dev_info_obj = get_device_info()
        #print(dev_info_obj)
        dev_info = {
            "dev_id": dev_info_obj.device_id,
            "ip": dev_info_obj.ip,
            "sub_port": dev_info_obj.sub_port,
            "push_port": dev_info_obj.push_port,
            "req_port": dev_info_obj.req_port
        }
        wifi_info = {
            "ip": wifi.ip,
            "netmask": wifi.netmask,
            "gateway": wifi.gateway,
            "ap_mode": wifi.check_ap_mode(),
            "mac": wifi.mac
        }        
        return jsonify({"dev_info": dev_info, "wifi_info": wifi_info})

@app.route('/api/network/connect', methods=['POST'])
def connect_wifi():
    try:
        # JSON 요청 데이터 파싱
        data = request.json
        ssid = data.get('ssid')
        password = data.get('password')

        if not ssid:
            return jsonify({"success": False, "error": "SSID is required"}), 400
        if not password:
            return jsonify({"success": False, "error": "Password is required"}), 400

        # AP 모드인지 확인
        is_ap = wifi.check_ap_mode()
        if is_ap:
            wifi.stop_ap_mode()
            time.sleep(3)
            print('AP mode stopped, waiting...')

        # Wi-Fi 연결 시도
        rst = wifi.connect_to_wifi(ssid, password)
        if rst:
            restart_vibnet()
            return jsonify({
                "success": True,
                "message": "Wi-Fi connected successfully",
                "ap_mode": wifi.check_ap_mode()
            })
        else:
            # 연결 실패 시 AP 모드 다시 시작
            if is_ap:
                wifi.start_ap_mode()
            return jsonify({
                "success": False,
                "message": "Wi-Fi connection failed",
                "ap_mode": wifi.check_ap_mode()
            })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.route('/api/network/scan', methods=['GET'])
def scan_wifi():
    try:
        # Wi-Fi 스캔 실행
        wifi.scan_ssid()

        # 검색된 SSID 목록 가져오기
        ssid_list = wifi.get_ssid_list()

        print("검색된 WiFi SSID 목록:", ssid_list)

        # 검색된 SSID 목록을 JSON으로 반환
        return jsonify({
            "success": True,
            "ssid_list": ssid_list
        })
    except Exception as e:
        # 오류 발생 시 처리
        print("Wi-Fi 스캔 중 오류 발생:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@app.route('/api/storage', methods=['GET'])
def storage_info():
    storage = get_storage()
    return jsonify(storage) 

@app.route('/api/reload', methods=['POST'])
def reload_device():
    try:
        # 요청 데이터 받기
        data = request.json
        param = data.get('param')

        if param == 'edit_devinfo':
            # 요청 필드 받기
            dev_id = data.get('id')
            ip = data.get('ip')
            push_port = data.get('push_port')
            sub_port = data.get('sub_port')
            req_port = data.get('req_port')

            # 필드 검증
            if not all([dev_id, ip, sub_port, push_port, req_port]):
                return jsonify({"status": "error", "message": "Missing fields"}), 400

            # 장치 정보 업데이트 로직
            set_device_info(dev_id, ip, push_port, sub_port, req_port)
            restart_vibnet()

            return jsonify({"status": "success", "message": "Device info updated!"}), 200

        return jsonify({"status": "error", "message": "Invalid parameter!"}), 400

    except Exception as e:
        # 예외 처리 및 로그 출력
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

""" @app.route('/network', methods=['GET', 'POST'])
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


    return render_template('index.html', dev_info = dev_info, wifi = wifi) """

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=80)