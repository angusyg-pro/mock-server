/**
 * @fileoverview Mock API router
 * @module routes/mock
 * @requires {@link external:express}
 * @requires controllers/api
 */

const express = require('express');
const controller = require('../controllers/api');

const router = express.Router({ mergeParams: true });

/**
 * Liste touts les mocks
 * @path {GET} /api
 * @response {json} array of versions
 * @name getMocks
 */
router.get('/', controller.getMocks);

/**
 * Ajoute un mock
 * @path {POST} /api
 * @name addMock
 */
router.post('/', controller.addMock);

/**
 * Ajoute un fichier de mock
 * @path {POST} /api/:id/file
 * @name addMockFile
 */
router.post('/:id/file', controller.addMockFile);

/**
 * Supprime un mock
 * @path {DELETE} /api/:id
 * @name deleteMock
 */
router.delete('/:id', controller.deleteMock);

/**
 * Modifie un mock
 * @path {PUT} /api/:id
 * @name updateMock
 */
router.put('/:id', controller.updateMock);

module.exports = router;
