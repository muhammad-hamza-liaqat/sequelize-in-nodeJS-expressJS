// services/enqueueJobs.js
const { Queue } = require('bull');

const queue = new Queue('getOrderDataQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

// Assume you have startDate and endDate in your req.query
const startDate = process.argv[2];
const endDate = process.argv[3];

// Enqueue a job to execute the getOrderData function with dynamic parameters
(async () => {
  const job = await queue.add('getOrderDataJob', { startDate, endDate });
  console.log(`Job enqueued with ID: ${job.id}`);
})();
