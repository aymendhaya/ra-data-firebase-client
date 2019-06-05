'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var convertFileToBase64 = function convertFileToBase64(file) {
  return new _promise2['default'](function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

var addUploadFeature = function addUploadFeature(requestHandler) {
  return function (type, resource, params) {
    if (type === 'UPDATE') {
      if (params.data.image && params.data.image.length) {
        var formerPictures = params.data.image.filter(function (p) {
          return !(p.rawFile instanceof File);
        });
        var newPictures = params.data.image.filter(function (p) {
          return p.rawFile instanceof File;
        });

        return _promise2['default'].all(newPictures.map(convertFileToBase64)).then(function (base64Pictures) {
          return base64Pictures.map(function (image64) {
            return {
              src: image64,
              title: '' + params.data.title
            };
          });
        }).then(function (transformedNewPictures) {
          return requestHandler(type, resource, (0, _extends3['default'])({}, params, {
            data: (0, _extends3['default'])({}, params.data, {
              image: [].concat(transformedNewPictures, formerPictures)
            })
          }));
        });
      }
    }
    // for other request types and reources, fall back to the defautl request handler
    return requestHandler(type, resource, params);
  };
};

exports['default'] = addUploadFeature;
module.exports = exports['default'];