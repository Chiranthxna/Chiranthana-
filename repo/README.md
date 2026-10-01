# DUSTIQ — ESP32 Dust Monitor

An ESP32 project that reads a Sharp GP2Y1010AU0F dust sensor and a DHT11 temperature/humidity sensor, indicates dust levels with LEDs and a buzzer, and writes measurements to a microSD card.

> **Important:** This is an educational/DIY monitor, not a certified air-quality or occupational-safety instrument. Calibrate the dust conversion for your sensor, wiring, and environment before relying on its readings.

## Features

- Dust readings from the GP2Y1010AU0F
- Temperature and relative humidity from a DHT11
- Green (safe), orange (caution), and buzzer (danger) indicators
- CSV logging to `/dustiq.csv` on a FAT32-formatted microSD card
- Serial status output at 115200 baud
- Caution and danger thresholds configurable in the sketch

## Repository layout

```text
firmware/
└── DUSTIQ_ESP32/
    └── DUSTIQ_ESP32.ino
```

## Hardware

- ESP32 development board
- Sharp GP2Y1010AU0F dust sensor and its recommended drive circuit
- DHT11 temperature/humidity sensor
- microSD card module and FAT32-formatted card
- Green LED, orange LED, suitable current-limiting resistors, and buzzer
- Jumper wires and a suitable power supply

### Pin connections

| Device signal | ESP32 pin | Notes |
| --- | ---: | --- |
| Dust sensor LED control | GPIO 27 | Drive the sensor IR LED using the transistor circuit specified for the sensor; do not connect the sensor LED directly to the ESP32 pin. |
| Dust sensor analog output (VO) | GPIO 34 | Input-only ADC1 pin. Ensure VO never exceeds the ESP32's permitted input voltage (3.3 V maximum). |
| DHT11 data | GPIO 4 | Use the required pull-up resistor if it is not built into the module. |
| Green LED | GPIO 25 | Use a current-limiting resistor. |
| Orange LED | GPIO 17 | Use a current-limiting resistor. |
| Buzzer signal | GPIO 16 | Check the buzzer's voltage/current requirements; use a driver transistor if needed. |
| SD card chip select (CS) | GPIO 5 | SPI bus uses ESP32 VSPI defaults below. |
| SD card MOSI | GPIO 23 | VSPI default. |
| SD card MISO | GPIO 19 | VSPI default. |
| SD card SCK | GPIO 18 | VSPI default. |

Connect grounds together. Check the datasheets for the exact sensor and SD module supply/logic requirements. Some SD modules are not safe to connect directly to 3.3 V ESP32 GPIO when powered or level-shifted for 5 V logic.

## Software setup

1. Install the Arduino IDE and add ESP32 board support using Espressif's Arduino-ESP32 installation instructions.
2. Install the **DHT sensor library** by Adafruit using the Arduino Library Manager. Install its **Adafruit Unified Sensor** dependency if prompted.
3. Open `firmware/DUSTIQ_ESP32/DUSTIQ_ESP32.ino`.
4. Select the appropriate ESP32 board and serial port, then upload the sketch.
5. Open Serial Monitor at **115200 baud**.
6. Format the microSD card as FAT32 before use.

`SPI`, `SD`, and the ESP32 ADC functions are supplied by the Arduino/ESP32 platform packages.

## Measurements and calibration

The sketch estimates dust density using a baseline of 0.6 V and a slope of 0.005 V per µg/m³. These values are not universal calibration constants. ESP32 ADC readings also vary by board and configuration. Compare against a trusted reference and calibrate the voltage conversion and thresholds for your setup.

The `twa_ug_m3` CSV column currently records a **cumulative arithmetic mean since the device started**, not a standards-compliant time-weighted average over a defined exposure period. The alert zone is based on the current dust reading. DHT11 read failures are logged as `-1`.

The sampling loop waits 30 seconds after each completed reading, so the actual interval is approximately 30 seconds plus sensor, serial, and SD-card processing time. If the SD card fails to initialize, monitoring continues but CSV logging will not work.

## CSV format

The sketch creates `/dustiq.csv` and writes this header:

```csv
elapsed_s,dust_ug_m3,twa_ug_m3,temp_c,humidity_pct
```

Elapsed time resets when the ESP32 restarts. If the file already exists, new rows are appended without replacing its header.

## Configuration

Edit the pin definitions, thresholds, and sample interval near the top of the sketch to match your hardware and desired behavior. Review the GP2Y1010AU0F datasheet and your circuit before changing its LED timing.

## License and reuse

This project is Copyright © 2026 Chiranthana (GitHub: [@Chiranthxan](https://github.com/Chiranthxan)) and is provided under the custom terms in [LICENSE](LICENSE).

Non-commercial use, modification, and sharing are permitted if the copyright notice and license text are retained. **Commercial use is not permitted without prior written permission.** To request commercial permission, contact Chiranthana through the [GitHub profile](https://github.com/Chiranthxan).

This is a custom, non-commercial license, not the MIT License and not an OSI-approved open-source license. GitHub cannot reliably notify the author whenever code is copied, downloaded, or reused elsewhere.
