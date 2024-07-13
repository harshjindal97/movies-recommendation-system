const { parentPort } = require('worker_threads');

let x = 0;
for (let i = 0; i < 10000000000; i++) {
  x = x + 1;
}

// Send the result back to the main thread
parentPort.postMessage(x);