/**
 * @fileoverview Mock router
 * @module routes/mock
 * @requires {@link external:express}
 * @requires controllers/mock
 */

const express = require('express');
const controller = require('../controllers/mock');

const router = express.Router({ mergeParams: true });

// Gère toutes les autres requêtes sur /mocks
router.all('*', controller.handleRequest);

module.exports = router;
