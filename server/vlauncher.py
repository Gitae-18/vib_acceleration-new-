import RPi.GPIO as GPIO
import time
import subprocess
from wifi import WiFi

wifi = WiFi('wlan0')

def button_wait():
    button_pin = 19

    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    while True:
        button_pressed_time = None
        
        while GPIO.input(button_pin) == GPIO.LOW:
            if button_pressed_time is None:
                button_pressed_time = time.time()
            elif time.time() - button_pressed_time >= 3:
                button_pressed_time = None
                print("reboot")
                break
            time.sleep(0.1)

        if button_pressed_time is not None:
            if time.time() - button_pressed_time >= 0.1:
                wifi.start_ap_mode()
            #process = subprocess.Popen(['python3', '/home/feelink/vibnet-web/app.py'])

        time.sleep(0.1)

if __name__ == '__main__':
    button_wait()
