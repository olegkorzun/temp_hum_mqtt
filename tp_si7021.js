const TIMER = 1000;
const TAG = "si7021";
let i2cBusNo = +process.argv[2];
if (isNaN(i2cBusNo) || i2cBusNo < 0 || i2cBusNo > 7) i2cBusNo = 1;
// Si7021 constructor options object is optional, i2cBusNo defaults to 1
//
const Si7021 = require('./Si7021');
const si7021 = new Si7021({ i2cBusNo : i2cBusNo });
const {sendMqtt}= require('./mqtt_service');

const readSensorData = () => {
  si7021.readSensorData()
    .then((data) => {
      let i2c_data = new Object()
      i2c_data["humidity"] = +data.humidity;
      i2c_data["temperature_F"] = +data.temperature_C * 9/5 + 32;
      sendMqtt(TAG,JSON.stringify(i2c_data));
      console.log(`data = ${JSON.stringify(i2c_data, null, 2)}`);
      setTimeout(readSensorData, TIMER);
    })
    .catch((err) => {
      console.log(`Si7021 read error: ${err}`);
      setTimeout(readSensorData, TIMER);
    });
};

si7021.reset()
  .then(() => readSensorData())
  .catch((err) => console.error(`Si7021 reset failed: ${err} `));

