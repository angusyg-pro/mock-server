(function() {
  'use strict';

  angular
    .module('frontend.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$uibModal',
    '$document',
    'mocks',
    'mockService',
    'errorHandlerService',
    'toastService',
    'SERVER_API',
  ];

  function HomeController($uibModal, $document, mocks, mockService, errorHandlerService, toastService, SERVER_API) {
    const vm = this;

    // Variables
    vm.SERVER_API = SERVER_API;
    vm.mocks = mocks;
    vm.types = [];
    vm.types['REST'] = 'JSON';
    vm.types['JS'] = 'JAVASCRIPT';
    vm.types['CSS'] = 'CSS';
    vm.types['HTML'] = 'HTML';
    vm.types['XML'] = 'XML';
    vm.types['TEXT'] = 'TEXTE';
    vm.types['FILE'] = 'FICHIER';
    vm.fileTypes = mockService.fileTypes;

    // Méthodes
    vm.addMock = addMock;
    vm.convertFileType = convertFileType;
    vm.deleteMock = deleteMock;
    vm.updateMock = updateMock;

    /**
     * Ouvre la fenêtre de dialogue d'ajout de mock
     * Au retour, fait appel au service de création du mock
     */
    function addMock() {
      // Ouvre la fenêtre de dialogue
      const modal = $uibModal.open({
        templateUrl: 'partials/add-modal.html',
        controller: 'AddModalController',
        controllerAs: 'addModal',
        size: 'lg',
        appendTo: angular.element($document[0].querySelector('.home')),
        resolve: {
          mock: null,
        }
      });

      // En retour, création du mock
      modal.result.then((newMock) => {
        let m;
        if (newMock.type === 'FILE') {
          // Initialise les données pour ne pas envoyer le fichier de suite
          m = {
            url: newMock.url,
            type: newMock.type,
            statusCode: newMock.statusCode,
            description: newMock.description,
            data: 'uploading',
            filename: newMock.data.name,
            fileType: newMock.fileType.type,
          }
        } else {
           m = newMock;
           delete m.fileType;
        }
        mockService.addMock(m)
          .then((mock) => {
            // OK, si le type de mock est un fichier, on upload le fichier
            if (mock.type === 'FILE') {
              mockService.addMockFile(mock, newMock.data)
                .then((m) => {
                  //OK,  Ajout de la version aux versions courantes
                  vm.mocks.push(m);
                  toastService.success('Nouveau mock créé');
                })
                .catch(error => errorHandlerService.handleServerError(error, 'Une erreur est survenue lors de l\'upload du mock'));
            } else {
              // Ajout de la version aux versions courantes
              vm.mocks.push(mock);
              toastService.success('Nouveau mock créé');
            }
          })
          .catch(error => errorHandlerService.handleServerError(error, 'Une erreur est survenue lors de la création du mock'));
      });
    }

    function convertFileType(fileType) {
      if (fileType) return vm.fileTypes.find(f => f.type === fileType).label;
      return '';
    }

    /**
     * Supprime un mock
     * @param  {Mock} mock - mock à supprimer
     */
    function deleteMock(mock) {
      mockService.deleteMock(mock)
        .then(() => {
          // Suppression du mock local
          vm.mocks.splice(vm.mocks.findIndex(m => m._id === mock._id), 1);
          toastService.success('Mock supprimé');
        })
        .catch(error => errorHandlerService.handleServerError(error, 'Une erreur est survenue lors de la suppression du mock'));
    }

    /**
     * Modifie un mock
     * @param  {Mock} mock - mock à modifier
     */
    function updateMock(mock) {
      // Ouvre la fenêtre de dialogue
      const modal = $uibModal.open({
        templateUrl: 'partials/add-modal.html',
        controller: 'AddModalController',
        controllerAs: 'addModal',
        size: 'lg',
        appendTo: angular.element($document[0].querySelector('.home')),
        resolve: {
          mock: () => Object.assign({}, mock),
        }
      });

      // En retour, modification du mock
      modal.result.then((newMock) => {
        let m;
        if (newMock.type === 'FILE') {
          // Initialise les données pour ne pas envoyer le fichier de suite
          m = {
            _id: newMock._id,
            url: newMock.url,
            type: newMock.type,
            statusCode: newMock.statusCode,
            description: newMock.description,
            filename: newMock.data.name,
            fileType: newMock.fileType.type,
          }
          // Si date n'est pas de type string, un nouveau fichier est à uploader
          if (typeof newMock.data !== 'string') m.data = 'uploading';
        } else m = newMock;
        mockService.updateMock(m)
          .then((mk) => {
            // OK, si le type de mock est un fichier, on upload le fichier
            if (newMock.type === 'FILE' && typeof newMock.data !== 'string') {
              mockService.updateMockFile(mock, newMock.data)
                .then((m) => {
                  //OK,  Ajout de la version aux versions courantes
                  vm.mocks[vm.mocks.findIndex(i => i._id === m._id)] = m;
                  toastService.success('Mock modifié');
                })
                .catch(error => errorHandlerService.handleServerError(error, 'Une erreur est survenue lors de la modification du mock'));
            } else {
              // Ajout de la version aux versions courantes
              vm.mocks[vm.mocks.findIndex(i => i._id === m._id)] = m;
              toastService.success('Mock modifié');
            }
          })
          .catch(error => errorHandlerService.handleServerError(error, 'Une erreur est survenue lors de la modification du mock'));
      });

    }
  }
})();
