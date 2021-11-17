const httpStatus = require('http-status');
const { userService, artworkService, collectionService, historyService, notificationService } = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const catchAsync = require('../utils/catchAsync');
const { SEARCH_FILTERS } = require('../utils/enums');

const handleSearch = catchAsync(async (req, res) => {
  const { keyword, filter, page, perPage } = req.query;

  if (keyword) {
    const users = await userService.searchUsersByName(keyword, page, perPage);
    const artworks = await artworkService.searchArtworkByName(keyword, page, perPage);
    const collections = await collectionService.searchCollectionByName(keyword, page, perPage);

    let data = {};

    switch (filter) {
      case SEARCH_FILTERS.USERS:
        data.users = users;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        data.artworks = artworks;
        break;

      case SEARCH_FILTERS.COLLECTIONS:
        data.collections = collections;
        break;

      default:
        data = {
          users,
          artworks,
          collections,
        };
    }

    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      page,
      data,
    });
  } else {
    let users;
    let data = {};
    let artworks;
    let collections;
    switch (filter) {
      case SEARCH_FILTERS.USERS:
        users = await userService.getAllUsers();
        data.users = users;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        artworks = await artworkService.getAllArtWork();
        data.artworks = artworks;
        break;

      case SEARCH_FILTERS.COLLECTIONS:
        collections = await collectionService.getAllCollections();
        data.collections = collections;
        break;

      default:
        data = {
          users,
          artworks,
          collections,
        };
    }
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data,
    });
  }
});

const getAppActivity = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  const histories = await artworkService.getAllArtworksPaginated(page, perPage);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    data: histories.artworks,
    count: histories.count,
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const { user } = req;
  const { page, perPage } = req.query;

  const notifications = await notificationService.getUserNotifications(user._id, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    page,
    data: notifications,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, perPage } = req.query;

  const notifications = await notificationService.getUserNotifications(user._id, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    page,
    data: notifications,
  });
});

const getTranscendingArtists = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, perPage } = req.query;

  const artists = await userService.getUsersByMostArtworks();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const getLeadingCollectors = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, perPage } = req.query;

  const artists = await userService.fetchLeadingCollectors();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const tempUdateUser = catchAsync(async (req, res) => {
  EVENT.emit('create-stats', {
    userId: req.query.userId
  });
  res.status(httpStatus.CREATED).send({
    status: true
  });
});

module.exports = {
  handleSearch,
  getAppActivity,
  getTranscendingArtists,
  getNotifications,
  tempUdateUser,
  getLeadingCollectors
};
