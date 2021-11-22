const Joi = require('joi');

const createArtworkVS = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    creater: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().optional(),
    collectionId: Joi.string().required(),
    artwork_type: Joi.string().required(),
    tokenId: Joi.string().optional(),
  }),
};

const getAllArtworks = {
  query: Joi.object().keys({
    page: Joi.string().optional(),
    perPage: Joi.string().optional(),
  }),
};

const getArtworksVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

const addFavouriteVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const removeFavouriteVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getFavouriteVS = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const increaseViewVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const placeBidVS = {
  body: Joi.object().keys({
    bidder: Joi.string().required(),
    artwork: Joi.string().required(),
    bid_amount: Joi.number().required(),
    owner: Joi.string().required(),
    auction: Joi.string().required(),
  }),
};

const openAuctionVS = {
  body: Joi.object().keys({
    initialPrice: Joi.number().required(),
    artwork: Joi.string().required(),
    endTime: Joi.date().required(),
  }),
};
const getSingleArtVS = {
  query: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getAuctionBidsVS = {
  query: Joi.object().keys({
    auctionId: Joi.string().required(),
  }),
};

const updateTokenVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
    tokenId: Joi.string().required(),
  }),
};

const getCollectionArtworksVS = {
  query: Joi.object().keys({
    collectionId: Joi.string().required(),
  }),
};

const changeAuctionStatusVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
    status: Joi.string().required(),
  }),
};
const deleteArtworkVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getHistoryVS = {
  query: Joi.object().keys({
    artworkId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const nftClaimListVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

module.exports = {
  createArtworkVS,
  getArtworksVS,
  addFavouriteVS,
  removeFavouriteVS,
  getFavouriteVS,
  increaseViewVS,
  placeBidVS,
  openAuctionVS,
  getSingleArtVS,
  getAuctionBidsVS,
  updateTokenVS,
  getCollectionArtworksVS,
  changeAuctionStatusVS,
  deleteArtworkVS,
  getHistoryVS,
  nftClaimListVS,
  getAllArtworks,
};
