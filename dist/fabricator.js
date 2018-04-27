'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var models = {};

function Fabricator(name) {
  var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (models[name]) {
    throw new Error('Model "' + name + '" has already been registered');
  }
  models[name] = model;
}

Fabricator.extend = function (from, name) {
  var model = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!models[from]) {
    throw new Error('Base model "' + from + '" has not been registered');
  }
  Fabricator(name, _extends({}, models[from], model));
};

function Fabricate(name) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var model = models[name];

  if (!model) {
    throw new Error('Model "' + name + '" has not been registered');
  }

  if (typeof model === 'function') {
    return model.apply();
  }

  var extendedModel = _extends({}, model, defaults);
  var object = Object.keys(extendedModel).reduce(function (object, key) {
    var value = extendedModel[key];
    object[key] = typeof value === 'function' ? value.apply() : value;
    return object;
  }, {});

  return object;
}

Fabricate.times = function (count, name, defaults) {
  return Array(count).fill(0).map(function () {
    return Fabricate(name, defaults);
  });
};

var sequences = {};

Fabricate.sequence = function () {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '__VOID_SEQUENCE_NAME_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';

  if (sequences[name] == null) {
    sequences[name] = -1;
  }
  return ++sequences[name];
};

Fabricate.sequence.reset = function (name) {
  if (name) {
    if (sequences[name] != null) {
      delete sequences[name];
    } else {
      throw new Error('Sequece "' + name + '" does not exist');
    }
  } else {
    sequences = {};
  }
};

exports.Fabricator = Fabricator;
exports.Fabricate = Fabricate;
exports.__MODELS_OBJET_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = models;