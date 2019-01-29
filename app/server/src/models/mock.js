/**
 * @fileoverview Module de la Classe de Mock
 * @module models/mock
 * @requires {@link external:mongoose}
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Classe de Mock
 * @class
 * @name MockSchema
 */
const MockSchema = new Schema({
  /**
   * Code HTTP de retour du mock
   * @type {number}
   * @default 200
   */
  statusCode: {
    type: Number,
    default: 200,
    required: true,
  },

  /**
   * URL du mock
   * @type {string}
   */
  url: {
    type: String,
    required: true,
  },

  /**
   * Donnée du mock (JSON ou Path vers fichier)
   * @type {string}
   */
  data: {
    type: String,
    required: true,
  },

  /**
   * Si mock fichier, nom du fichier
   * @type {Object}
   */
  filename: {
    type: String,
  },

  /**
   * Description du mock
   * @type {string}
   */
  description: {
    type: String,
  },

  /**
   * Type du mock
   * @type {string}
   */
  type: {
    type: String,
    enum: ['REST', 'FILE', 'HTML', 'CSS', 'TEXT', 'XML', 'JS'],
    default: 'REST',
    required: true,
  },

  /**
   * Méthode HTTP du mock
   * @type {string}
   */
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    default: 'GET',
    required: true,
  },

  /**
   * Type du fichier
   * @type {string}
   */
  fileType: {
    type: String,
    enum: ['CSS', 'HTML', 'JS', 'TEXT', 'XML', 'JSON'],
  },
});

module.exports = mongoose.model('Mock', MockSchema);
