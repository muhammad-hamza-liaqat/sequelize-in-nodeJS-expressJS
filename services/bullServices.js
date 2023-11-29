const Queue = require("bull");
const Worker = require("bull");
const QueueScheduler = require("bull");
const orderModel = require('../models/orderModel');
const Sequelize = require('sequelize');

const orderQueue = new Queue('orderQueue', {
  redis: {
    port: 6379,
    host: 'localhost',
  },
});

const worker = new Worker('orderQueue', async (job) => {
  const { data, header } = job.data;
  // You can perform any processing here without writing to CSV
});

const scheduler = new QueueScheduler('orderQueue');

worker.on('completed', () => {
  worker.close();
  process.exit();
});

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

      await orderQueue.add('generateCSV', { data, header });

      return {
        message: 'Data processing completed',
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Internal server error');
    }
  },
};

module.exports = bullService;
