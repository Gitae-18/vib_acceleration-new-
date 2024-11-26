import configparser
import os.path

_CONFIG_FILE = '/etc/vibnet.conf'
_ENCODING = 'utf-8'

_SECTION_COMMON = 'Common'
_KEY_MODEL_NO = "model_no"
_KEY_SERIAL_NO = "serial_no"
_KEY_DEVICE_ID = "device_id"
_KEY_SUB_ADDR = 'sub_addr'
_KEY_PUSH_ADDR = 'push_addr'
_KEY_REQ_ADDR = 'req_addr'

_MODEL_NO = "FL-VIBNET101"
_SERIAL_NO = "44G29WP20303202"
_DEVICE_ID = "D2834567"
_SUB_ADDR = "tcp://192.168.0.100:5555"
_PUSH_ADDR = "tcp://192.168.0.100:5557"
_REQ_ADDR = "tcp://192.168.0.100:5559"

class VibnetConfig:
    """DCU 환경설정을 위한 클래스로 config.ini 파일이 생성되며 
        공유폴더, 네트워크, 데이터수집 스케줄 및 디비백업 스케줄의 내용을 포함한다.
    """
    def __init__(self):
        super().__init__()
        if os.path.isfile(_CONFIG_FILE) == False:
            self._GeneratorDefault()
            
    def _Read(self):
        """현재 설정된 내용을 반환합니다.
            :return: configparser object
        """
        config = configparser.ConfigParser()
        config.read(_CONFIG_FILE, encoding=_ENCODING) 

        # 설정파일의 색션 확인
        # config.sections()
        return config

    def _Write(self, config):
        with open(_CONFIG_FILE, 'w', encoding=_ENCODING) as configfile:
            config.write(configfile)

    def _GeneratorDefault(self):
        # 설정파일 만들기
        config = configparser.ConfigParser()

        section = _SECTION_COMMON
        config[section] = {}
        config[section][_KEY_MODEL_NO] = _MODEL_NO
        config[section][_KEY_SERIAL_NO] = _SERIAL_NO
        config[section][_KEY_DEVICE_ID] = _DEVICE_ID
        config[section][_KEY_SUB_ADDR] = _SUB_ADDR
        config[section][_KEY_PUSH_ADDR] = _PUSH_ADDR
        config[section][_KEY_REQ_ADDR] = _REQ_ADDR

        self._Write(config)

    def GetConfig(self):
        """TM, Align 서버 접속정보 네트워크 대한 설정을 가져온다.

            :return :ConfigNetwork Class

            예제:
                다음과 같이 사용하세요:

                >>> cfg = DcuConfig().GetNetwork()
                >>> print(cfg.model_no)
                >>> print(cfg.serial_no)
                >>> print(cfg.device_id)
                >>> print(cfg.push_addr)
                >>> print(cfg.sub_addr)
        """

        config = self._Read()
        section = config[_SECTION_COMMON]
        return {
            'model_no' : section[_KEY_MODEL_NO],
            'serial_no' : section[_KEY_SERIAL_NO],
            'device_id' : section[_KEY_DEVICE_ID],
            'sub_addr' : section[_KEY_SUB_ADDR],
            'push_addr' : section[_KEY_PUSH_ADDR],
            'req_addr' : section[_KEY_REQ_ADDR],
        }

    def SetConfig(self, model_no=None, serial_no=None, device_id=None, sub_addr=None, push_addr=None, req_addr=None):
        config = self._Read()
        section = _SECTION_COMMON

        if model_no != None:
            config[section][_KEY_MODEL_NO] = model_no

        if serial_no != None:
            config[section][_KEY_SERIAL_NO] = serial_no

        if device_id != None:
            config[section][_KEY_DEVICE_ID] = device_id

        if push_addr != None:
            config[section][_KEY_PUSH_ADDR] = push_addr

        if sub_addr != None:
            config[section][_KEY_SUB_ADDR] = sub_addr

        if req_addr != None:
            config[section][_KEY_REQ_ADDR] = req_addr

        self._Write(config)

