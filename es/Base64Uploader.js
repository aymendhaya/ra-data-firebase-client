import _extends from 'babel-runtime/helpers/extends';
import _Promise from 'babel-runtime/core-js/promise';
var convertFileToBase64 = function convertFileToBase64(file) {
  return new _Promise(function (resolve, reject) {
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

        return _Promise.all(newPictures.map(convertFileToBase64)).then(function (base64Pictures) {
          return base64Pictures.map(function (image64) {
            return {
              src: image64,
              title: '' + params.data.title
            };
          });
        }).then(function (transformedNewPictures) {
          return requestHandler(type, resource, _extends({}, params, {
            data: _extends({}, params.data, {
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

export default addUploadFeature;