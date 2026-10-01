// ══════════════════════════════════════════════════════════════════
// DUSTIQ — ESP32 Edition
// Sensors: GP2Y1010AU0F (dust) + DHT11 (temperature/humidity)
// Outputs: Green LED (safe), orange LED (caution), buzzer (danger)
// Logs to a microSD card approximately every 30 seconds
// ══════════════════════════════════════════════════════════════════

#include <SPI.h>
#include <SD.h>
#include <DHT.h>

// Pin definitions
#define DUST_LED_PIN   27
#define DUST_VO_PIN    34  // ADC1 channel; input only

#define DHT_PIN        4
#define DHT_TYPE       DHT11

#define LED_GREEN      25
#define LED_ORANGE     17
#define BUZZER_PIN     16

#define SD_CS_PIN      5   // VSPI defaults: MOSI=23, MISO=19, SCK=18

// GP2Y1010AU0F sampling timing (microseconds)
#define SAMPLING_TIME  280
#define DELTA_TIME     40
#define SLEEP_TIME     9680

// Dust thresholds (µg/m³)
#define THRESHOLD_CAUTION  200.0
#define THRESHOLD_DANGER   350.0

#define SAMPLE_INTERVAL_MS  30000

DHT dht(DHT_PIN, DHT_TYPE);

float twaSum = 0.0;
uint32_t twaCount = 0;
uint32_t shiftStart = 0;

const char* LOG_FILE = "/dustiq.csv";

float readDust() {
  digitalWrite(DUST_LED_PIN, LOW);
  delayMicroseconds(SAMPLING_TIME);
  int raw = analogRead(DUST_VO_PIN);
  delayMicroseconds(DELTA_TIME);
  digitalWrite(DUST_LED_PIN, HIGH);
  delayMicroseconds(SLEEP_TIME);

  // This conversion is an initial estimate; calibrate for your sensor and setup.
  float voltage = raw * (3.3f / 4095.0f);  // ESP32 12-bit ADC estimate
  float density = (voltage - 0.6f) / 0.005f;
  return max(density, 0.0f);
}

void setAlerts(float density) {
  if (density >= THRESHOLD_DANGER) {
    digitalWrite(BUZZER_PIN, HIGH);
    digitalWrite(LED_ORANGE, LOW);
    digitalWrite(LED_GREEN, LOW);
  } else if (density >= THRESHOLD_CAUTION) {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_ORANGE, HIGH);
    digitalWrite(LED_GREEN, LOW);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_ORANGE, LOW);
    digitalWrite(LED_GREEN, HIGH);
  }
}

void logToSD(uint32_t elapsed_s, float dust, float twa,
             float tempC, float humidity) {
  File f = SD.open(LOG_FILE, FILE_APPEND);
  if (f) {
    f.print(elapsed_s);
    f.print(",");
    f.print(dust, 1);
    f.print(",");
    f.print(twa, 1);
    f.print(",");
    f.print(tempC, 1);
    f.print(",");
    f.println(humidity, 1);
    f.close();
  } else {
    Serial.println("SD write failed");
  }
}

void printStatus(uint32_t elapsed_s, float dust, float twa,
                 float tempC, float humidity) {
  String zone = "SAFE";
  if (dust >= THRESHOLD_DANGER) {
    zone = "DANGER";
  } else if (dust >= THRESHOLD_CAUTION) {
    zone = "CAUTION";
  }

  Serial.print("T+");
  Serial.print(elapsed_s);
  Serial.print("s | Dust: ");
  Serial.print(dust, 1);
  Serial.print(" ug/m3 | TWA: ");
  Serial.print(twa, 1);
  Serial.print(" ug/m3 | Temp: ");
  Serial.print(tempC, 1);
  Serial.print("C | RH: ");
  Serial.print(humidity, 1);
  Serial.print("% | ");
  Serial.println(zone);
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\nDUSTIQ starting...");

  pinMode(DUST_LED_PIN, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_ORANGE, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(DUST_LED_PIN, HIGH);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_ORANGE, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  dht.begin();
  Serial.println("DHT11 initialised");

  Serial.print("SD card... ");
  if (!SD.begin(SD_CS_PIN)) {
    Serial.println("FAILED — check wiring and FAT32 format");
    for (int i = 0; i < 6; i++) {
      digitalWrite(LED_ORANGE, HIGH);
      delay(200);
      digitalWrite(LED_ORANGE, LOW);
      delay(200);
    }
  } else {
    Serial.println("OK");
    if (!SD.exists(LOG_FILE)) {
      File f = SD.open(LOG_FILE, FILE_WRITE);
      if (f) {
        f.println("elapsed_s,dust_ug_m3,twa_ug_m3,temp_c,humidity_pct");
        f.close();
        Serial.println("New log file created");
      }
    } else {
      Serial.println("Appending to existing log");
    }
  }

  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_ORANGE, HIGH);
  delay(500);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_ORANGE, LOW);

  shiftStart = millis();
  Serial.println("Monitoring started — reading approximately every 30 seconds");
}

void loop() {
  float dust = readDust();

  twaSum += dust;
  twaCount++;
  float twa = twaSum / twaCount;

  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();
  if (isnan(tempC)) {
    tempC = -1.0;
  }
  if (isnan(humidity)) {
    humidity = -1.0;
  }

  uint32_t elapsed_s = (millis() - shiftStart) / 1000;

  setAlerts(dust);
  printStatus(elapsed_s, dust, twa, tempC, humidity);
  logToSD(elapsed_s, dust, twa, tempC, humidity);

  delay(SAMPLE_INTERVAL_MS);
}
