const { Worker } = require("bull");
const { getOrderData, deleteFile } = require("../controller/orderController");

const worker = new Worker("getOrderDataQueue", async (job) => {
  try {
    if (job.name === "getOrderDataJob") {
      await getOrderData(job.data);
    } else if (job.name === "deleteFileJob") {
      await deleteFile(job.data);
    }

    console.log(`Job ${job.id} completed.`);
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
  }
});

// Connect and start the worker
(async () => {
  await worker.connect();
  worker.workerCleanup(); 
  await worker.start();
})();
