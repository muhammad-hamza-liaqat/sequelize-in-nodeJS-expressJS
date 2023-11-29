const Queue = require("bull");
const fs = require("fs");
const path = require("path");
const {getOrderData} = require("../controller/orderController");

const downloadQueue = new Queue("csvFile");

function downloadData(Fname) {
  downloadQueue.add({ Fname: Fname });
}

downloadQueue.process(async (job, done) => {
  await getOrderData(job.data.Fname)
    .then((result) => {})
    .catch((error) => {
      console.log("error:", error);
    });
});

downloadQueue.on("failed", (job, error) => {
  console.log(`job failed with error: ${error.message}`);
});

function pauseQueue() {
  downloadQueue.pause();
  downloadQueue
    .empty()
    .then(() => {
      console.log("queue empty!");
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  downloadQueue.resume();
}

module.exports = downloadData;