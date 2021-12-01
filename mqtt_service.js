const mqtt = require('mqtt')
const machineName = require('os').hostname();
const localMQTTClient = mqtt.connect('mqtt://63.250.63.228');

let mqtt_connected = false;
localMQTTClient.on('connect', () => {
    mqtt_connected = true;
    console.log('Mqtt connected');
});

function sendMqtt(tag, record) {
    let recordMQTT = JSON.parse(record);
    if (mqtt_connected) {
        recordMQTT.machine = machineName;
        recordMQTT.tag= tag; "si7021"
        recordMQTT.time_stamp= new Date().getTime();
        localMQTTClient.publish('rtbigdata', JSON.stringify(recordMQTT));
        console.log(recordMQTT);
    }

}
module.exports = {
    sendMqtt
}