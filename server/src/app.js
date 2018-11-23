/**
 * @fileoverview Express application
 * @module app
 * @requires {@link external:express}
 * @requires {@link external:path}
 * @requires {@link external:body-parser}
 * @requires {@link external:cors}
 * @requires config/app
 * @requires config/db
 * @requires lib/errorhandler
 * @requires routes/main
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const appCfg = require('./config/app');
const { connect } = require('./config/db');
const errorHandler = require('./lib/errorhandler');

// Importation des routers
const mainRouter = require('./routes/main');

// Configuration de l'application
const app = express();

app.set('port', appCfg.port);

// Connexion à la BDD
connect().catch(() => process.exit(1));

// Middleware CORS
app.use(cors(appCfg.crossOrigin));

// Body parser pour extraire vers un json le body ou les paramètres
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Client
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// Ajout des routes
app.use('/', mainRouter);

// Gestion des erreurs
app.use(errorHandler.errorNoRouteMapped);
app.use(errorHandler.errorHandler);

module.exports = app;
