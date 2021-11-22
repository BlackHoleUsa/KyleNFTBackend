const { Bid, Auction, User, BuySell } = require('../models');
const { AUCTION_STATUS, HISTORY_TYPE, NOTIFICATION_TYPE } = require('../utils/enums');
const artworkService = require('./artwork.service');
const { AUCTION_CONTRACT_INSTANCE } = require('../config/contract.config');
const EVENT = require('../triggers/custom-events').customEvent;

const saveAuction = async (params) => {
  let res = await Auction.create(params);
  return res.toObject();
};

const artworkExistsInAuction = async (artworkId) => {
  let auction = await Auction.find({ artwork: artworkId, status: AUCTION_STATUS.OPEN });
  return auction.length > 0;
};

const getOpenAuctions = async (page, perPage, sort, whereQuery) => {
  const auctions = await Auction.find()
    .sort(sort)
    .populate('artwork owner creater bids')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
  const count = await Auction.find().countDocuments();
  return { auctions, count };
};

const getOpenSales = async (page, perPage, sort, whereQuery) => {
  const sales = await BuySell.find(whereQuery)
    .sort(sort)
    .populate('artwork owner')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return sales;
};

const getSaleDetails = async (saleId) => {
  const sales = await BuySell.findOne({ _id: saleId })
    .populate({
      path: 'artwork',
      populate: {
        path: 'creater'
      }
    })
    .populate('owner')
    .lean();

  return sales;
};

const getAuctionDetails = async (aucId) => {
  const auction = await Auction.findOne({ _id: aucId })
    .populate({
      path: 'artwork',
      populate: {
        path: 'creater'
      }
    })
    .populate({
      path: 'bids',
      populate: {
        path: 'bidder'
      },
      options: { sort: { 'bid_amount': -1 } }
    })
    .populate('owner')
    .lean();

  return auction;
};

const checkAndCompleteAuctionStatus = async () => {
  try {
    const auctions = await Auction.find({ status: AUCTION_STATUS.OPEN });
    if (auctions) {
      for (auction of auctions) {
        const currentDate = new Date();
        const closingDate = new Date(auction.endTime);
        if (currentDate > closingDate) {
          await Auction.findOneAndUpdate({ _id: auction._id }, { status: AUCTION_STATUS.CLOSED });
          await artworkService.closeArtworkAuction(auction.artwork);
          let aucData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(auction.contractAucId).call();
          const { bidderAdd, latestBid, nftClaim, cancelled, ownerclaim } = aucData;
          let user = await User.findOne({ address: bidderAdd });

          if (auction.bids.length > 0) {
            await Auction.findOneAndUpdate(
              { _id: auction._id },
              {
                auctionWinner: user._id,
                bidAmount: latestBid,
                nftClaim,
                cancelled,
                ownerclaim,
              }
            );

            EVENT.emit('send-and-save-notification', {
              receiver: user._id,
              type: NOTIFICATION_TYPE.AUCTION_WIN,
              extraData: {
                auction: auction._id,
              },
            });

            EVENT.emit('send-and-save-notification', {
              receiver: auction.owner,
              type: NOTIFICATION_TYPE.AUCTION_END,
              extraData: {
                auction: auction._id,
              },
            });
          } else {
            await Auction.findOneAndUpdate({ _id: auction._id }, { status: AUCTION_STATUS.TIMEOUT, nftClaim: false, cancelled: false, });

            EVENT.emit('send-and-save-notification', {
              receiver: auction.owner,
              type: NOTIFICATION_TYPE.AUCTION_TIMEOUT,
              extraData: {
                auction: auction._id,
              },
            });

            console.log(`${auction.contractAucId} auction is cancelled`);
          }

          EVENT.emit('update-artwork-history', {
            artwork: auction.artwork,
            message: `auction closed`,
            auction: auction._id,
            type: HISTORY_TYPE.AUCTION_END,
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const getTimeoutAuctions = async (userId, page, perPage) => {
  const auctions = await Auction.find({ status: AUCTION_STATUS.TIMEOUT, cancelled: false, owner: userId })
    .populate('owner creater bids artwork')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return auctions;
};

const getClosedAuctions = async (userId, page, perPage) => {
  const auctions = await Auction.find({ auctionWinner: userId, status: AUCTION_STATUS.CLOSED, nftClaim: false })
    .populate('owner creater bids artwork')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return auctions;
};

const getSoldAuctions = async (userId, page, perPage) => {
  const auctions = await Auction.find({ owner: userId, status: AUCTION_STATUS.CLOSED, ownerclaim: false })
    .populate('owner creater bids artwork')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return auctions;
};
const getAuctionsWithBids = async (page, perPage) => {
  return await Auction.find({ 'bids.0': { $exists: true } })
    .populate('artwork owner creater bids')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

module.exports = {
  saveAuction,
  artworkExistsInAuction,
  getOpenAuctions,
  checkAndCompleteAuctionStatus,
  getAuctionsWithBids,
  getClosedAuctions,
  getSoldAuctions,
  getTimeoutAuctions,
  getOpenSales,
  getSaleDetails,
  getAuctionDetails
};
