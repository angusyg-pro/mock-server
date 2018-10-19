/**
 * @fileoverview API REST controleur
 * @module controllers/api
 * @requires services/mock
 */

const service = require('../services/mock');

const controller = {};

/**
 * Liste tous les mocks
 * @method getMocks
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.getMocks = (req, res, next) => {
  service.getMocks()
    .then(mocks => res.status(200).json(mocks))
    .catch(err => next(err));
};

/**
 * Ajoute un mock
 * @method addMock
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.addMock = (req, res, next) => {
  service.addMock(req.body)
    .then(mock => res.status(200).json(mock))
    .catch(err => next(err));
};

/**
 * Upload le fichier d'un mock
 * @method addMockFile
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.addMockFile = (req, res, next) => {
  service.addMockFile(req, res)
    .then(mock => res.status(200).json(mock))
    .catch(err => next(err));
};

/**
 * Supprime un mock
 * @method deleteMock
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.deleteMock = (req, res, next) => {
  service.deleteMock(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err));
};

/**
 * Modifie un mock
 * @method updateMock
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.updateMock = (req, res, next) => {
  service.updateMock(req.params.id, req.body)
    .then(mock => res.status(200).json(mock))
    .catch(err => next(err));
};

module.exports = controller;
