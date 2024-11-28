import RPi.GPIO as GPIO
import time
import threading
from max17048g import MAX17048G

GPIO_BATT_ALRT = 23
GPIO_BATT_CHARGE_MODE = 22
GPIO_BATT_CHARGE_IN = 25
GPIO_BATT_LOW = 5
GPIO_BATT_HIGH = 6

GPIO_LED_BOOT = 4
GPIO_PWR_SWITCH = 14

LED_OFF = 0
LED_ON = 1
BATT_LED_RED = 2
BATT_LED_GREEN = 3
BATT_LED_RED_BLINK = 4

def batt_alrt_process():
    global battery_gauge
#battery_gauge.test()

    alrt_status = battery_gauge._get_status()
    if alrt_status & 0x20:
        update_batt_led()
        #battery_gauge._clear_status_flag(0x20)

    if alrt_status & 0x10:
        update_batt_led()
        #battery_gauge._clear_status_flag(0x10)

    battery_gauge._set_status(0x40)


def update_batt_led():
    global battery_gauge
    global led_th

    charger_in = GPIO.input(GPIO_BATT_CHARGE_IN)
    batt_soc = battery_gauge.get_soc()

    print("c =", charger_in)

    if batt_soc < 10.0 and charger_in == 0:
        turn_off_switch()

    if batt_soc < 20.0:
        led_th.set_battery_led(BATT_LED_RED if charger_in == 0 else BATT_LED_RED_BLINK)
    else:
        led_th.set_battery_led(BATT_LED_GREEN)

def interrupt_handler(channel):
#print('======= interrupt : ', channel)
    if channel == GPIO_BATT_CHARGE_IN:
        update_batt_led()
    elif channel == GPIO_BATT_ALRT:
        batt_alrt_process()

def turn_off_switch():
#print("turn_off")
    GPIO.output(GPIO_PWR_SWITCH, GPIO.LOW)

def hal_init():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(GPIO_PWR_SWITCH, GPIO.OUT, initial=GPIO.HIGH)
    GPIO.setup(GPIO_BATT_ALRT, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(GPIO_BATT_CHARGE_MODE, GPIO.OUT, initial=GPIO.HIGH)
    GPIO.setup(GPIO_BATT_CHARGE_IN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(GPIO_BATT_LOW, GPIO.OUT, initial=GPIO.HIGH)
    GPIO.setup(GPIO_BATT_HIGH, GPIO.OUT, initial=GPIO.HIGH)
    GPIO.setup(GPIO_LED_BOOT, GPIO.OUT, initial=GPIO.LOW)

class BatteryLed(threading.Thread):
    def __init__(self):
        super(BatteryLed, self).__init__()
        self._batt_led_blinking = False
        self._pause_event = threading.Event()
        self._batt_led_status = LED_OFF
        self._last_command = -1
        #self._pause_event.set()  # 스레드를 일시 정지 상태로 시작합니다.

    def run(self):
        self._batt_led_blinking = True
        while self._batt_led_blinking:
            self._pause_event.wait()  # 일시 정지 상태인 경우 기다립니다.
            for _ in range(5): # 500ms
                if not self._pause_event.is_set(): break
                time.sleep(0.1)

            if self._pause_event.is_set():
                if self._batt_led_status == LED_OFF:
                    low_value = GPIO.LOW
                    high_value = GPIO.HIGH
                    self._batt_led_status = BATT_LED_RED
                else:
                    low_value = GPIO.HIGH
                    high_value = GPIO.HIGH
                    self._batt_led_status = LED_OFF

                GPIO.output(GPIO_BATT_LOW, low_value)
                GPIO.output(GPIO_BATT_HIGH, high_value)

    def stop(self):
        self._batt_led_blinking = False
        self.resume()

    def pause(self):
        self._pause_event.clear()  # 스레드를 일시 정지합니다.

    def resume(self):
        self._pause_event.set()  # 스레드를 다시 시작합니다.

    def set_battery_led(self, command):
        if self._last_command == command: return
        if self._last_command == BATT_LED_RED_BLINK:
            self.pause()
            time.sleep(0.1)
            
        self._last_command = command

        if command == BATT_LED_RED:
            low_value = GPIO.LOW
            high_value = GPIO.HIGH
        elif command == BATT_LED_GREEN:
            low_value = GPIO.HIGH
            high_value = GPIO.LOW
        elif command == BATT_LED_RED_BLINK:
            self._batt_led_status = LED_OFF
            low_value = GPIO.HIGH
            high_value = GPIO.HIGH
            self.resume()
        else:
            low_value = GPIO.HIGH
            high_value = GPIO.HIGH

        GPIO.output(GPIO_BATT_LOW, low_value)
        GPIO.output(GPIO_BATT_HIGH, high_value)


def main():
    global battery_gauge
    global led_th

    hal_init()
    battery_gauge = MAX17048G()

    led_th = BatteryLed()
    led_th.daemon = True
    led_th.start()

#battery_gauge.test()
    if GPIO.input(GPIO_BATT_ALRT) == 0:   # 감지
        batt_alrt_process()

    update_batt_led()

    GPIO.add_event_detect(GPIO_BATT_ALRT, GPIO.FALLING, callback=interrupt_handler, bouncetime=100)
    GPIO.add_event_detect(GPIO_BATT_CHARGE_IN, GPIO.BOTH, callback=interrupt_handler, bouncetime=300)

    th_run = True
    while th_run:
        time.sleep(10)
        '''
        user_input = input("Type \'x\' to exit")
        if user_input.lower() == 'x': th_run = False
        '''

    led_th.stop()
    led_th.join()

    led_th.set_battery_led(LED_OFF)
    print('done')

if __name__ == '__main__':
    main()
