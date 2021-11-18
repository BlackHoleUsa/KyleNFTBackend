const cron = require('node-cron');
const { auctionService } = require('../services');
const config = require('../config/config');
const logger = require('../config/logger');

cron.schedule('*/1 * * * *', async () => {
  await auctionService.checkAndCompleteAuctionStatus();
  console.log('in Corn');
});
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
  logger.info('Connected to MongoDB');
  await auctionService.checkAndCompleteAuctionStatus();
});
