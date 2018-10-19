/**
 * @fileoverview Service de récupération des mocks
 * @module services/mock
 * @requires {@link external:path}
 * @requires {@link external:multer}
 * @requires {@link external:fs-extra}
 * @requires config/app
 * @requires models/mock
 * @requires lib/errors
 * @requires lib/logger
 */

const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');
const config = require('../config/app');
const Mock = require('../models/mock');
const { ApiError, NotFoundError } = require('../lib/errors');
const logger = require('../lib/logger');

const service = {};

// Configuration de multer pour stockage disque
const storage = multer.diskStorage({
  filename: (req, file, cb) => cb(null, req.params.id),
  destination: (req, file, cb) => {
    Mock.findById(req.params.id)
      .then((mock) => {
        if (mock) return cb(null, config.mockFilesFolder);
        // Mock non trouvée
        return cb(new ApiError('MOCK_NOT_FOUND', `Aucun mock trouvé avec l'id '${req.params.id}'`));
      })
      .catch(err => cb(new ApiError(err)));
  },
});

// Récupération d'un service d'upload multer
const upload = multer({ storage }).single('file');

/**
 * Vérifie si un autre mock exiset déjà avec la même URL
 * @param  {Mock} mock - Mock à créer
 * @return {Promise} rejettée si erreur
 */
const checkNewMock = (mock, update) => {
  logger.debugFuncCall(mock);
  return new Promise(async (resolve, reject) => {
    try {
      if (!mock.url.startsWith('/mocks/')) mock.url = `/mocks/${mock.url}`;
      // Recherche d'un mock avec la même URL
      const m = await Mock.findOne({ url: mock.url, method: mock.method });
      if (m && !update) return reject(new ApiError('EXISTING_URL', `L'URL '${mock.method} ${mock.url}' est déjà utilisée`));
      return resolve();
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Liste tous les mocks
 * @return {Promise<Mock[]>} résolue avec la liste des mocks, rejettée si erreur
 */
service.getMocks = () => {
  logger.debugFuncCall();
  return new Promise(async (resolve, reject) => {
    try {
      // Recherche et alimentation des déploiements de toutes les versions
      const mocks = await Mock.find() || [];
      return resolve(mocks);
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Ajoute un mock
 * @return {Promise<Mock>} résolue avec le mock créé, rejettée si erreur
 */
service.addMock = (mock) => {
  logger.debugFuncCall(mock);
  return new Promise(async (resolve, reject) => {
    try {
      // Vérification de la possibilité de créer le mock (pas de même URL)
      await checkNewMock(mock, false);
      // Création du mock
      return resolve(await Mock.create(mock));
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Upload le fichier d'un mock FILE
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @return {Promise} rejettée si erreur
 */
service.addMockFile = (req, res) => {
  logger.debugFuncCall();
  return new Promise(async (resolve, reject) => {
    try {
      // Recherche du mock associé au fichier
      const mock = await Mock.findById(req.params.id);
      if (mock) {
        // Extrait le fichier envoyé et le sauvegarde sur le disque
        upload(req, res, async (err) => {
          if (err) return reject(new ApiError(err));
          mock.data = path.join(config.mockFilesFolder, mock._id.toString());
          await mock.save();
          return resolve(mock);
        });
      } else return reject(new ApiError('MOCK_NOT_FOUND', `Aucun mock trouvé avec l'id '${req.params.id}'`));
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Supprime un mock
 * @param  {string} id - id du mock à supprimer
 * @return {Promise} rejettée si erreur
 */
service.deleteMock = (id) => {
  logger.debugFuncCall(id);
  return new Promise(async (resolve, reject) => {
    try {
      // Recherche du mock
      const mock = await Mock.findById(id);
      if (mock) {
        // Si le mock est de type FILE on supprime le fichier correspondant
        if (mock.type === 'FILE') fs.removeSync(mock.data);
        // Suppression du mock
        await Mock.remove({ _id: mock._id });
        return resolve();
      }
      // Aucun mock trouvé on renvoie une erreur
      return reject(new ApiError('MOCK_NOT_FOUND', `Aucun mock trouvé avec l'id '${id}'`));
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Modifie un mock
 * @param  {string} id - id du mock à modifier
 * @return {Promise} rejettée si erreur
 */
service.updateMock = (id, updatedMock) => {
  logger.debugFuncCall(id);
  return new Promise(async (resolve, reject) => {
    try {
      // Vérification de la possibilité de créer le mock (pas de même URL)
      await checkNewMock(updatedMock, true);
      // Recherche du mock à modifier
      let mock = await Mock.findById(id);
      if (mock) {
        // Si le mock passe de fichier à json, suppression du fichier associé
        if (mock.type === 'FILE' && updatedMock.type !== 'FILE') {
          fs.removeSync(mock.data);
          mock.filename = null;
        }
        // Modification du mock
        mock = await Mock.findByIdAndUpdate(id, updatedMock);
        return resolve(mock);
      }
      // Aucun mock trouvé on renvoie une erreur
      return reject(new ApiError('MOCK_NOT_FOUND', `Aucun mock trouvé avec l'id '${id}'`));
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

/**
 * Recherche le mock correspondant à une URL
 * @param  {string} url - URL du mock
 * @return {Promise<Mock>} résolue avec le mock, rejettée sinon
 */
service.getResponse = (url) => {
  logger.debugFuncCall(url);
  return new Promise(async (resolve, reject) => {
    try {
      // Recherche du mock correspondant à l'URL
      const mock = await Mock.findOne({ url: `/mocks${url}` });
      if (mock) {
        logger.debug(`Envoi du mock: ${mock}`);
        return resolve(mock);
      }
      // Aucun mock trouvé on renvoie une erreur
      return reject(new NotFoundError(url));
    } catch (err) {
      return reject(new ApiError(err));
    }
  });
};

module.exports = service;
