const datauri = require('datauri');
const child_process = require('child_process');
const fs = require('fs');
const http = require('http')

const subproc_params = {
    stdio: [
      0, // Use parent's stdin for child
      'pipe', // Pipe child's stdout to parent
      fs.openSync('/dev/null', 'w') // Direct child's stderr to the bitbucket
    ]
  };

// ffmpeg -y -i udp://10.5.5.9:8554 -fflags nobuffer -analyzeduration  1000000 -frames:v 1  -f image2 frame.jpg 2>/dev/null
const ffmpeg_args = [
                      '-i',
                      'udp://10.5.5.9:8554',
                      '-fflags',
                      'nobuffer',
                      '-analyzeduration',
                      '1000000',
                      '-frames:v',
                      '1',
                      '-f',
                      'image2'
                    ];

res = '';
const req = http.get({
  hostname: '10.5.5.9',
  port: 80,
  path: '/gp/gpControl/execute?p1=gpStream&a1=proto_v2&c1=restart',
  method: 'GET'
}, (res) => {
  console.log(res);
});

const ffmpeg_proc = child_process.spawn('/usr/local/bin/ffmpeg', subproc_params, ffmpeg_args);
console.log(ffmpeg_proc);

datauri_holder = new datauri();

img = '';
ffmpeg_proc.stdout.on('data', (chunk) => {
  img += chunk;
});

ffmpeg_proc.stdout.on('end', () => {
  datauri_holder.format('.jpg', img);
  
  console.log(datauri_holder.mimetype);
  console.log(datauri_holder.base64);
})

