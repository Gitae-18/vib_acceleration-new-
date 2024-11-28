import time
from interface_i2c import interface_i2c

import threading

#Addresses
ADDR_VCELL = 0x02
ADDR_SOC = 0x04
ADDR_MODE = 0x06
ADDR_VERSION = 0x08
ADDR_HIBRT = 0x0A
ADDR_CONFIG = 0x0C
ADDR_VALRT = 0x14
ADDR_CRATE = 0x16
ADDR_VRESET_ID = 0x18
ADDR_STATUS = 0x1A
ADDR_TABLE = 0x40
ADDR_CMD = 0xFE


#COMMAND
CMD_RESET = [0x54, 0x00]
CMD_QUICKSTART = [0x40, 0x00]

MAX1704X_ALERTFLAG_ENABLE_VRESET = 0x40
MAX1704X_ALERTFLAG_SOC_CHANGE = 0x20 # Alert flag for state-of-charge change
MAX1704X_ALERTFLAG_SOC_LOW = 0x10 # Alert flag for state-of-charge low
MAX1704X_ALERTFLAG_VOLTAGE_RESET = 0x08 # Alert flag for voltage reset dip
MAX1704X_ALERTFLAG_VOLTAGE_LOW = 0x04 # Alert flag for cell voltage low
MAX1704X_ALERTFLAG_VOLTAGE_HIGH = 0x02 #  Alert flag for cell voltage high
MAX1704X_ALERTFLAG_RESET_INDICATOR = 0x01 # Alert flag for IC reset notification


class MAX17048G:
    def __init__(self):
        self._if = interface_i2c(1, 0x36)
        self._if.open()
        self._init_()
    
    def release(self):
        self._if.close()

    def _init_(self):
#self._reset()
#time.sleep(1)
        if self._get_status() & MAX1704X_ALERTFLAG_RESET_INDICATOR:
            self._set_config_alrt_20per()
            self._set_status_flag(MAX1704X_ALERTFLAG_ENABLE_VRESET)
            self._clear_status_flag(MAX1704X_ALERTFLAG_RESET_INDICATOR)

#self._reset()
#self._quick_start()

    def clear_flag_alrt(self):
        self._clear_config_flag(0x20)

    def _reset(self):
        self._if.write_datas(ADDR_CMD, CMD_RESET)
    
    def _set_config_alrt_20per(self):
        read_value = self._if.read_datas(ADDR_CONFIG, 2)
        read_value[1] = (32 - 20) | 0x40
        self._if.write_datas(ADDR_CONFIG, read_value)

    def _clear_config_flag(self, flag):
        read_value =  self._if.read_datas(ADDR_CONFIG, 2)
        read_value[1] = read_value[1] & ~flag
        self._if.write_datas(ADDR_CONFIG, read_value)

    def _quick_start(self):
        self._if.write_datas(ADDR_MODE, CMD_QUICKSTART)

    def get_mode(self):
        read_value = self._if.read_datas(ADDR_MODE, 2)
        return read_value[0] << 8 | read_value[1]

    def get_vcell(self):
        read_value = self._if.read_datas(ADDR_VCELL, 2)
        vcell = read_value[0] << 8 | read_value[1]
        return vcell * 78.125 / 1000000 

    def get_soc(self):
        read_value = self._if.read_datas(ADDR_SOC, 2)
        soc = read_value[0] << 8 | read_value[1]
        return soc / 256

    def _get_config(self):
        read_value =  self._if.read_datas(ADDR_CONFIG, 2)
        return read_value[0] << 8 | read_value[1]

    def _get_status(self):
        return self._if.read_data(ADDR_STATUS)

    def _set_status(self, value):
        self._if.write_data(ADDR_STATUS, value)

    def _set_status_flag(self, flag):
        self._if.write_data(ADDR_STATUS, self._get_status() | flag)

    def _clear_status_flag(self, flag):
        self._if.write_data(ADDR_STATUS, self._get_status() & ~flag)


    def test(self):
        print("mode = %#06x" % self.get_mode())
        print("status = %#04x" % self._get_status())
        print("configs = %#06x" % self._get_config())
        print("vcell =", self.get_vcell())
        print("soc =", self.get_soc())


def battery_test():
    global th_run
    battery_gauge = MAX17048G()

    while th_run:
        print("============================")
        battery_gauge.test()
        for _ in range(10):
            if not th_run:
                break
            time.sleep(0.1)

if __name__ == '__main__':
    global th_run

    th_run = True
    batt_thread = threading.Thread(target = battery_test)
    batt_thread.daemon = True  # 메인 스레드가 종료되면 자동으로 종료되도록 설정
    batt_thread.start()

    while th_run:
        user_input = input("입력: ")
        if user_input.lower() == 'x':
            th_run = False
        else:
            print(f"입력한 값: {user_input}")

    batt_thread.join()
    print("프로그램을 종료합니다.")

