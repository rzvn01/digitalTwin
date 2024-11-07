from machine import Pin, I2C, deepsleep
from time import sleep
from ldr import LDR
from water_sensor import WaterSensor
from wifi_manager import WiFiManager
import bme280
import urequests
import json
from display_manager import DisplayManager


class DigitalTwin:
    def __init__(self, displayManager):
        
        """
        Initializes the WeatherDisplay object with sensor pins, the display manager and 

        Parameters:
        - displayManager (DisplayManager): An instance of DisplayManager for managing the display.
        """
        
        self.LDR_PIN = 39
        self.WATER_SENSOR_PIN = 36
        self.i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400_000)
        
        self.bme = bme280.BME280(i2c=self.i2c, addr=0x76)
        self.ldr = LDR(self.LDR_PIN)
        self.displayManager = displayManager
        self.water_sensor=WaterSensor(self.WATER_SENSOR_PIN)

    def read_sensors(self):
        
        """
        Reads sensor values for moisture, light intensity, temperature, humidity, and pressure.

        Returns:
        Tuple: A tuple containing moisture, light intensity, temperature, humidity, and pressure values.
        """

        moisture = self.water_sensor.value()
        light_intensity = self.ldr.value()
        temp = self.bme.temperature
        hum = self.bme.humidity
        pres = self.bme.pressure

        return moisture, light_intensity, temp, hum, pres

    def display_sensor_values(self, moisture, light_intensity, temp, hum, pres):
        
        """
        Displays sensor values on the connected display.

        Parameters:
        - moisture (float): Moisture level in percentage.
        - light_intensity (float): Light intensity in percentage.
        - temp (float): Temperature in Celsius.
        - hum (float): Humidity in percentage.
        - pres (float): Atmospheric pressure in hPa.
        """

        self.displayManager.lcd.clear()
        self.displayManager.double_print("Moisture", "{:.1f}%".format(moisture), "Light",
                                         "{:.1f}%".format(light_intensity))
        self.displayManager.double_print("Temp", temp, "Humidity", hum)
        self.displayManager.single_print("Pressure", pres)


    def twin_condition(self):
    
        self.displayManager.print_text("Reading Data from the sensors")

        moisture, light_intensity, temp, hum, pres = self.read_sensors()
        self.display_sensor_values(moisture, light_intensity, temp, hum, pres)
        self.displayManager.lcd.clear()

        self.displayManager.print_text("Sending Data to ThingSpeak")

        self.send_to_thingspeak(moisture, temp, hum, pres, light_intensity)

    def send_to_thingspeak(self, moisture, temp, hum, pres, light_intensity):
        """
        Sends sensor data to ThingSpeak IoT platform.

        Parameters:
        - moisture (float): Moisture level in percentage.
        - temp (float): Temperature in Celsius.
        - hum (float): Humidity in percentage.
        - pres (float): Atmospheric pressure in hPa.
        - light_intensity (float): Light intensity in percentage.
        """

        API_URL = "https://api.thingspeak.com/update"
        API_KEY = "DO2L1H0RIXIHDZ3A"

        # POST request
        request_url = f"{API_URL}?api_key={API_KEY}"
        json = {"field1": temp, "field2": hum, "field3": pres, "field4": moisture, "field5": light_intensity}
        headers = {"Content-Type": "application/json"}
        response = urequests.post(request_url, json=json, headers=headers)

        print(f"Response from ThingSpeak: {response.text}")
        response.close()


if __name__ == "__main__":
    
    wifiManager = WiFiManager(ssid="Cacu", password="cacu12345")
    displayManager = DisplayManager()
    twin = DigitalTwin(displayManager)

    while True:
            
        displayManager.print_text("Connecting to   WiFi: "+wifiManager.ssid)
        wifiManager.connect_wifi()

        twin.twin_condition()

        displayManager.print_text("Disconnecting   from WiFi")
        wifiManager.disconnect_wifi()
        displayManager.lcd.clear()
        displayManager.lcd.display_off()
        displayManager.lcd.backlight_off()
        sleep(60)
        displayManager.lcd.display_on()
        displayManager.lcd.backlight_on()
        #deepsleep(10*1000)
