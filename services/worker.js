
console.log('Node.js version:', process.version);
const { Worker } = require('bull');
const { getOrderData } = require('../controller/orderController');

const worker = new Worker('getOrderDataQueue', async job => {
  try {
    console.log(`Processing job ${job.id} with data:`, job.data);

    await getOrderData(job.data);

    console.log(`Job ${job.id} completed.`);
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
  }
});

(async () => {
  await worker.connect();
  worker.workerCleanup(); 
  await worker.start();
})();
