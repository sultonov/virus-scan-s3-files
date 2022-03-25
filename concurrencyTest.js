// CONCURRENT REQUESTS TO TEST PERFORMANCE
const http = require('http');
const fs = require('fs');
const bucket = process.env.TEST_BUCKET;
const files = process.env.TEST_FILES.split(",");
const logFileName = "concurrent.log";
const spentTime = [];

function sendHttpRequest(requestNumber, s3Key) {
    const options = {
        hostname: process.env.TEST_HOST,
        port: process.env.APP_PORT || 3100,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            spentTime[requestNumber - 1] = (new Date()) - spentTime[requestNumber - 1];
            fs.appendFileSync(logFileName,`${new Date().toLocaleTimeString()}: Request №${requestNumber} returned  in ${spentTime[requestNumber - 1]} milliseconds ${body}\n`);
        });
    });
    req.on('error', function(e) {
        spentTime[requestNumber - 1] = (new Date()) - spentTime[requestNumber - 1];
        fs.appendFileSync(logFileName,`${new Date().toLocaleTimeString()}: Request №${requestNumber} error: ${e.message} in ${spentTime[requestNumber - 1]} milliseconds\n`);
    });

    spentTime.push(new Date());
    fs.appendFileSync(logFileName,`${spentTime[requestNumber - 1].toLocaleTimeString()}: Request №${requestNumber} with file ${s3Key} sent\n`);
    req.write(JSON.stringify({ bucket: bucket, key: s3Key }));
    req.end();
}

function concurrentRequests() {
    for (let i = 1; i <= 100; i++) {
        sendHttpRequest(i, files[Math.floor(Math.random() * files.length)])
    }
}

fs.writeFileSync(logFileName, "Running concurrent requests!\n");
concurrentRequests();