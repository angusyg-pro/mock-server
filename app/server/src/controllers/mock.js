/**
 * @fileoverview REST controleur
 * @module controllers/rest
 * @requires services/mock
 */

const service = require('../services/mock');

const controller = {};

/**
 * Récupère la réponse correspondante à la requête
 * @param  {external:Request}  req  - requête reçue
 * @param  {external:Response} res  - réponse à envoyer
 * @param  {nextMiddleware}    next - fonction de callback vers le prochain middleware
 */
controller.handleRequest = (req, res, next) => {
  service.getResponse(req.url)
    .then((response) => {
      const responseType = response.type === 'FILE' ? response.fileType : response.type;
      switch (responseType) {
        case 'CSS':
          res.set('Content-Type', 'text/css; charset=UTF-8');
          break;
        case 'JS':
          res.set('Content-Type', 'application/javascript; charset=UTF-8');
          break;
        case 'HTML':
          res.set('Content-Type', 'text/html; charset=UTF-8');
          break;
        case 'TEXT':
          res.set('Content-Type', 'text/plain; charset=UTF-8');
          break;
        case 'XML':
          res.set('Content-Type', 'application/xml; charset=UTF-8');
          break;
        case 'REST':
          res.set('Content-Type', 'application/json; charset=UTF-8');
          return res.status(response.statusCode).json(JSON.parse(response.data));
        default:
          break;
      }
      if (response.type === 'FILE') return res.download(response.data, response.filename);
      return res.status(response.statusCode).send(response.data);
      //
      // if (response.type === 'FILE') {
      //   switch (response.fileType) {
      //     case 'CSS':
      //       res.set('Content-Type', 'text/css; charset=UTF-8');
      //       break;
      //     case 'JS':
      //       res.set('Content-Type', 'application/javascript; charset=UTF-8');
      //       break;
      //     case 'HTML':
      //       res.set('Content-Type', 'text/html; charset=UTF-8');
      //       break;
      //     case 'JSON':
      //       res.set('Content-Type', 'application/json; charset=UTF-8');
      //       break;
      //     default:
      //       break;
      //   }
      //   return res.download(response.data, response.filename);
      // }
      // res.set('Content-Type', 'text/plain; charset=UTF-8');
      // return res.status(response.statusCode).send(JSON.parse(response.data));
      //return res.status(response.statusCode).json(JSON.parse(response.data));
    })
    .catch(err => next(err));
};

module.exports = controller;
