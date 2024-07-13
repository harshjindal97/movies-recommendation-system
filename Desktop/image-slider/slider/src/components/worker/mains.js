const { Worker } = require('worker_threads');

const calc = () => {
  const worker = new Worker('./src/components/worker/worker.js');

  worker.on('message', (result) => {
    console.log(`Result from worker: ${result}`);
  });

  worker.on('error', (error) => {
    console.error(`Worker error: ${error}`);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};

calc();