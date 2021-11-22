const express = require('express');
const validate = require('../../middlewares/validate');
const artworkController = require('../../controllers/artwork.controller');

const artworkValidation = require('../../validations/artwork.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Artworks
 *   description: User Artworks
 */

/**
 * @swagger
 * /artwork/saveArtwork:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Save an artwork to collection
 *     tags: [Artworks]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - creater
 *               - price
 *               - collectionId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               creater:
 *                 type: string
 *               price:
 *                 type: string
 *               image:
 *                 type: string
 *               collectionId:
 *                 type: string
 *             example:
 *               name: Grafitti
 *               description: Artwork that blinds the eye
 *               creator: 613715f7a5e8c80016d054a7
 *               price: 23
 *               collectionId: 613739c6db7e4a2728326b1c
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/saveArtwork', validate(artworkValidation.createArtworkVS), artworkController.saveArtwork);
/**
 * @swagger
 * /artwork/getUserArtworks?userId={userId}&page={page}&perPage={perPage}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get all User Artworks
 *     tags: [Artworks]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User Id
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Artworks Per Page
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Artwork'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/getUserArtworks', [validate(artworkValidation.getArtworksVS)], artworkController.getUserArtworks);
/**
 * @swagger
 * /artwork/addToFavourite:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add to Favourites
 *     tags: [Artworks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artworkId
 *             properties:
 *               artworkId:
 *                 type: string
 *             example:
 *               artworkId: 61374ae3cdec8033aca18dd2
 *     responses:
 *       "201":
 *         description: Added Successfuly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Artwork'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/addToFavourite',
  [auth('manageUsers'), validate(artworkValidation.addFavouriteVS)],
  artworkController.addToFavourite
);
/**
 * @swagger
 * /artwork/removeFromFavourite:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove from Favourites
 *     tags: [Artworks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artworkId
 *             properties:
 *               artworkId:
 *                 type: string
 *             example:
 *               artworkId: 61374ae3cdec8033aca18dd2
 *     responses:
 *       "201":
 *         description: Removed Successfuly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Artwork'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/removeFromFavourite',
  [auth('manageUsers'), validate(artworkValidation.removeFavouriteVS)],
  artworkController.removeFromFavourites
);
/**
 * @swagger
 * /artwork/getFavouriteArtworks?page={page}&perPage={perPage}&userId={userId}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get user Favourite Artworks
 *     tags: [Artworks]
 *     parameters:
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Artworks Per Page
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User Id
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Artwork'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/getFavouriteArtworks',
  [auth('manageUsers'), validate(artworkValidation.getFavouriteVS)],
  artworkController.getFavouriteArtworks
);
/**
 * @swagger
 * /artwork/increaseViewCount:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Increase View Count
 *     tags: [Artworks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artworkId
 *             properties:
 *               artworkId:
 *                 type: string
 *             example:
 *               artworkId: 61374ae3cdec8033aca18dd2
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Artwork'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/increaseViewCount', [validate(artworkValidation.increaseViewVS)], artworkController.increaseArtworkViews);

router.post(
  '/updateTokenId',
  [auth('manageUsers'), validate(artworkValidation.updateTokenVS)],
  artworkController.updateTokenId
);

router.post('/placeBid', [auth('manageUsers'), validate(artworkValidation.placeBidVS)], artworkController.placeBid);
router.post(
  '/openArtworkAuction',
  [auth('manageUsers'), validate(artworkValidation.openAuctionVS)],
  artworkController.createAuction
);

router.get('/getSingleArtwork', [validate(artworkValidation.getSingleArtVS)], artworkController.getSingleArtwork);

router.get('/getAllArtWorks', validate(artworkValidation.getAllArtworks), artworkController.getAllArtWorks);
router.get('/getAuctionBids', [validate(artworkValidation.getAuctionBidsVS)], artworkController.getAuctionBids);

router.get(
  '/getCollectionArtworks',
  [validate(artworkValidation.getCollectionArtworksVS)],
  artworkController.getArtworksByCollection
);

router.post(
  '/changeAuctionStatus',
  [auth('manageUsers'), validate(artworkValidation.changeAuctionStatusVS)],
  artworkController.changeAuctionStatus
);

router.post(
  '/deleteArtwork',
  [auth('manageUsers'), validate(artworkValidation.deleteArtworkVS)],
  artworkController.deleteArtwork
);

router.get(
  '/getClosedAuctions',
  [auth('manageUsers'), validate(artworkValidation.nftClaimListVS)],
  artworkController.getWinnedAuctions
);

router.get(
  '/getSoldAuctions',
  [auth('manageUsers'), validate(artworkValidation.nftClaimListVS)],
  artworkController.getSoldItems
);

router.get(
  '/getTimeoutAuctions',
  [auth('manageUsers'), validate(artworkValidation.nftClaimListVS)],
  artworkController.getTimeoutItems
);

router.get('/getArtworkHistory', [validate(artworkValidation.getHistoryVS)], artworkController.getArtworkHistory);

module.exports = router;
