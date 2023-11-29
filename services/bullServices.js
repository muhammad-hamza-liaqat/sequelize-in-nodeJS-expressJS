const Queue = require("bull");
const Worker = require("bull");
const QueueScheduler = require("bull");
// const { Queue, Worker, QueueScheduler } = require('bull');
const { createCsvWriter } = require('csv-writer').createObjectCsvWriter;
const orderModel = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Sequelize = require('sequelize');


const orderQueue = new Queue('orderQueue', {
  redis: {
    port: 6379,
    host: 'localhost',
  },
});

const worker = new Worker('orderQueue', async (job) => {
  const { data, header, filePath } = job.data;

  const csvWriter = createCsvWriter({
    path: filePath,
    header: header,
  });

  await csvWriter.writeRecords(data);
});

const scheduler = new QueueScheduler('orderQueue');

worker.on('completed', () => {
  worker.close();
  process.exit();
});

// orderQueue.process(async (job,data)=>{
//   console.log(job);
//   const { data1, header, filePath } = job.data;

//   const csvWriter = createCsvWriter({
//     path: filePath,
//     header: header,
//   });

//   await csvWriter.writeRecords(data1);
// })
const bullService = {
  addToQueue: async (startDate, endDate) => {
    try {
      const data = await orderModel.findAll({
        where: {
          orderDate: {
            [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      });

      const header = Object.keys(orderModel.getAttributes());

      const fileId = uuidv4();
      const csvFilePath = path.join(__dirname, '../uploads', `${fileId}.csv`);

      await orderQueue.add('generateCSV', { data, header, filePath: csvFilePath });

      return {
        fileId: fileId,
        message: 'Data saved to CSV',
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Internal server error');
    }
  },

};

module.exports = bullService;
