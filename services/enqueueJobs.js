const { Queue } = require('bull');

const queue = new Queue('getOrderDataQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

async function addJob(jobName, data) {
  const job = await queue.add(jobName, data);
  console.log(`Job enqueued with ID: ${job.id}`);
}

module.exports = {
  addJob,
};
