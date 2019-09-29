const bluetooth = require('node-bluetooth');
var GPS = require('gps');
 
// create bluetooth device instance
const device = new bluetooth.DeviceINQ();
var gps = new GPS;

gps.on('data', function(parsed) {
    console.log(`GPS Data: ${JSON.stringify(parsed)}`);
});

device
.on('finished',  console.log.bind(console, 'finished'))
.on('found', function found(address, name){
    if (name === "Garmin GLO 2 #5b0d") {
          // find serial port channel
        device.findSerialPortChannel(address, function(channel){
            console.log('Found RFCOMM channel for serial port on %s: ', name, channel);
            bluetooth.connect(address, channel, function(err, connection){
                if(err) return console.error(err);
          
                connection.delimiter = Buffer.from('\n', 'utf8');
                connection.on('data', (buffer) => {
                    gps.update(buffer.toString().split('\n')[1]);
                    //gps.update(buffer.toString().split('\n')[1]);
                });
            });
        })
    }
}).scan();

