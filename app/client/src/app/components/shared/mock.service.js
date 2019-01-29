(function() {
  'use strict';

  angular
    .module('frontend.shared')
    .factory('mockService', MockService);

  MockService.$inject = [
    'SERVER_API',
    '$http',
    'Upload',
  ];

  /**
   * Service d'accès au serveur du reverse proxy du cloud
   * @param       {Constant} SERVER_API - configuration pour l'accès au serveur
   * @param       {Service}  $http      - service de gestion des appels HTTP
   * @constructor
   */
  function MockService(SERVER_API, $http, Upload) {
    const url = `${SERVER_API.URL}/api`;
    const fileTypes = [{
      type: 'JSON',
      label: 'JSON',
      accept: 'application/json',
    }, {
      type: 'JS',
      label: 'JAVASCRIPT',
      accept: 'application/javascript',
    }, {
      type: 'CSS',
      label: 'CSS',
      accept: 'text/css',
    }, {
      type: 'HTML',
      label: 'HTML',
      accept: 'text/html',
    }, {
      type: 'XML',
      label: 'XML',
      accept: 'application/xml',
    }, {
      type: 'TEXT',
      label: 'TEXTE',
      accept: '*',
    }];
    return {
      getMocks: () => $http.get(`${url}`).then(result => result.data),
      addMock: (mock) => $http.post(`${url}`, mock).then(result => result.data),
      addMockFile: (mock, file) => Upload.upload({ url: `${url}/${mock._id}/file`, data: { file } }).then(result => result.data),
      deleteMock: (mock) => $http.delete(`${url}/${mock._id}`),
      updateMock: (mock) => $http.put(`${url}/${mock._id}`, mock).then(result => result.data),
      updateMockFile: (mock, file) => Upload.upload({ url: `${url}/${mock._id}/file`, data: { file } }).then(result => result.data),
      fileTypes,
    };
  }
})();
