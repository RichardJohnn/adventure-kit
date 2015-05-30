let AppDispatcher = require('../dispatcher/app_dispatcher');
let DrawConstants = require('../constants/draw_constants');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

const CHANGE_EVENT = 'change';

let _draw = {};

let DrawStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _draw;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let action = payload.action;

    switch (action.actionType) {
      case DrawConstants.CHANGE_PRIMARY_COLOR:
        break;

      case DrawContstants.CHANGE_SECONDARY_COLOR:
        break;
    }

    return true;
  })
});

export default DrawStore;
