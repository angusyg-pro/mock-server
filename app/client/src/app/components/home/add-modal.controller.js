(function() {
  'use strict';

  angular
    .module('frontend.home')
    .controller('AddModalController', AddModalController);

  AddModalController.$inject = [
    'mockService',
    '$uibModalInstance',
    'mock',
  ];

  function AddModalController(mockService, $uibModalInstance, mock) {
    const vm = this;

    // Variables
    vm.newMock = {
      url: '/mocks/',
      data: JSON.stringify({}),
      type: 'REST',
      statusCode: 200,
      description: '',
      method: 'GET',
      fileType: null,
    };
    vm.types = [{
      type: 'REST',
      label: 'JSON'
    }, {
      type: 'JS',
      label: 'JAVASCRIPT',
    }, {
      type: 'CSS',
      label: 'CSS',
    }, {
      type: 'HTML',
      label: 'HTML',
    }, {
      type: 'XML',
      label: 'XML',
    }, {
      type: 'TEXT',
      label: 'TEXTE',
    }, {
      type: 'FILE',
      label: 'FICHIER'
    }];
    vm.fileTypes = mockService.fileTypes;
    vm.methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
    vm.adding = true;
    vm.invalidData = false;

    // Méthodes
    vm.cancel = cancel;
    vm.selectType = selectType;
    vm.validate = validate;
    vm.validateData = validateData;
    vm.validateURL = validateURL;

    /**
     * Ferme la fenêtre de dialogue
     */
    function cancel() {
      $uibModalInstance.dismiss();
    }

    /**
     * Reset le champ data sur changement de type
     */
    function selectType() {
      // Reset des données
      vm.invalidData = false;
      vm.newMock.fileType = null;
      // Si le type est fichier on sélectionne par défaut le premier type
      switch (vm.newMock.type) {
        case 'FILE':
          vm.newMock.fileType = vm.fileTypes[0];
          break;
        case 'REST':
          vm.newMock.data = JSON.stringify({});
          break;
        case 'HTML':
        case 'CSS':
        case 'TEXT':
        case 'JS':
        case 'XML':
          vm.newMock.data = '';
          break;
      }
    }

    /**
     * Ferme la fenêtre de dialogue en renvoyant le mock à créer
     */
    function validate() {
      $uibModalInstance.close(vm.newMock);
    }

    /**
     * Valide le JSON de retour
     */
    function validateData() {
      if (vm.newMock.type === 'REST') {
        try {
          // Tentative de parse des données
          if (vm.newMock.data) JSON.parse(vm.newMock.data);
          else vm.newMock.data = JSON.stringify({});
          // JSON valide
          vm.invalidData = false;
        } catch (error) {
          // JSON invalide
          vm.invalidData = true;
        }
      } else vm.invalidData = false;
    }

    /**
     * Valide l'URL entrée (s'assure que le début est bien /mocks/)
     */
    function validateURL() {
      if (!vm.newMock.url || vm.newMock.url === '') vm.newMock.url = '/mocks/';
      else if (!vm.newMock.url.startsWith('/mocks/')) vm.newMock.url = `/mocks/${vm.newMock.url}`;
    }

    /**
     * Inialise le controleur à son chargement
     * @param  {[Mock]} mock - mock à modifier
     */
    function init(mock) {
      if (mock) {
        vm.adding = false;
        vm.newMock = mock;
        if (mock.type === 'FILE') {
          vm.newMock.data = { name: mock.filename };
          vm.newMock.fileType = vm.fileTypes.find(fileType => fileType.type === mock.fileType);
        }
      }
    }

    init(mock);
  }
})();
