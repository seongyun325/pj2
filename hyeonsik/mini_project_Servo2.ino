#include <Servo.h>

const int SERVO = 10;
Servo servo;

void setup() {
  Serial.begin(9600);
  servo.attach(SERVO);
  servo.write(0);
  delay(1000);
}

void loop() {
  if(Serial.available()){
    char userInput = Serial.read();

    switch(userInput){
      case '0':
          servo.write(-10);
          delay(1000);
          break;
      case '1':
          servo.write(100);
          delay(1000);
          break;
      default:
          break;  
      }
    }

}
