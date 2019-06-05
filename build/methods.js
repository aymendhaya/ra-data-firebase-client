'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _sortBy = require('sort-by');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _reactAdmin = require('react-admin');

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
          return base64Pictures.map(function (picture64) {
            return {
              src: picture64,
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

var getImageSize = function getImageSize(file) {
  return new _promise2['default'](function (resolve) {
    var img = document.createElement('img');
    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height
      });
    };
    img.src = file.src;
  });
};

var upload = function () {
  var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(fieldName, submitedData, id, resourceName, resourcePath) {
    var file, rawFile, result, ref, snapshot, imageSize;
    return _regenerator2['default'].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = submitedData[fieldName] && submitedData[fieldName][0];
            rawFile = file.rawFile;
            result = {};

            if (!(file && rawFile && rawFile.name)) {
              _context.next = 25;
              break;
            }

            ref = _firebase2['default'].storage().ref().child(resourcePath + '/' + id + '/' + fieldName);
            _context.next = 7;
            return ref.put(rawFile);

          case 7:
            snapshot = _context.sent;

            result[fieldName] = [{}];
            result[fieldName][0].uploadedAt = Date.now();
            result[fieldName][0].src = snapshot.downloadURL.split('?').shift() + '?alt=media';
            result[fieldName][0].type = rawFile.type;

            if (!(rawFile.type.indexOf('image/') === 0)) {
              _context.next = 24;
              break;
            }

            _context.prev = 13;
            _context.next = 16;
            return getImageSize(file);

          case 16:
            imageSize = _context.sent;

            result[fieldName][0].width = imageSize.width;
            result[fieldName][0].height = imageSize.height;
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](13);

            console.error('Failed to get image dimensions');

          case 24:
            return _context.abrupt('return', result);

          case 25:
            return _context.abrupt('return', false);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[13, 21]]);
  }));

  return function upload(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var save = function () {
  var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee2(id, data, previous, resourceName, resourcePath, firebaseSaveFilter, uploadResults, isNew, timestampFieldNames) {
    var _Object$assign3;

    var _Object$assign2;

    return _regenerator2['default'].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (uploadResults) {
              uploadResults.map(function (uploadResult) {
                return uploadResult ? (0, _assign2['default'])(data, uploadResult) : false;
              });
            }

            if (isNew) {
              (0, _assign2['default'])(data, (_Object$assign2 = {}, _Object$assign2[timestampFieldNames.createdAt] = Date.now(), _Object$assign2));
            }

            data = (0, _assign2['default'])(previous, (_Object$assign3 = {}, _Object$assign3[timestampFieldNames.updatedAt] = Date.now(), _Object$assign3), data);

            if (!data.key) {
              data.key = id;
            }
            if (!data.id) {
              data.id = id;
            }

            _context2.next = 7;
            return _firebase2['default'].database().ref(resourcePath + '/' + data.key).update(firebaseSaveFilter(data));

          case 7:
            return _context2.abrupt('return', { data: data });

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function save(_x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13, _x14) {
    return _ref2.apply(this, arguments);
  };
}();

var del = function () {
  var _ref3 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee3(id, resourceName, resourcePath, uploadFields) {
    return _regenerator2['default'].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (uploadFields.length) {
              uploadFields.map(function (fieldName) {
                return _firebase2['default'].storage().ref().child(resourcePath + '/' + id + '/' + fieldName)['delete']();
              });
            }

            _context3.next = 3;
            return _firebase2['default'].database().ref(resourcePath + '/' + id).remove();

          case 3:
            return _context3.abrupt('return', { data: id });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function del(_x15, _x16, _x17, _x18) {
    return _ref3.apply(this, arguments);
  };
}();

var delMany = function () {
  var _ref4 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee4(ids, resourceName, previousData) {
    return _regenerator2['default'].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return ids.map(function (id) {
              return _firebase2['default'].database().ref(resourceName + '/' + id).remove();
            });

          case 2:
            return _context4.abrupt('return', { data: ids });

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function delMany(_x19, _x20, _x21) {
    return _ref4.apply(this, arguments);
  };
}();

var getItemID = function getItemID(params, type, resourceName, resourcePath, resourceData) {
  var itemId = params.data.id || params.id || params.data.key || params.key;
  if (!itemId) {
    itemId = _firebase2['default'].database().ref().child(resourcePath).push().key;
  }

  if (!itemId) {
    throw new Error('ID is required');
  }

  if (resourceData && resourceData[itemId] && type === _reactAdmin.CREATE) {
    throw new Error('ID already in use');
  }

  return itemId;
};

var getOne = function getOne(params, resourceName, resourceData) {
  if (params.id && resourceData[params.id]) {
    return { data: resourceData[params.id] };
  } else {
    throw new Error('Key not found');
  }
};

var getList = function getList(params, resourceName, resourceData) {
  var valuesToReturn = (0, _values2['default'])(resourceData);

  if (params.filter) {
    var filters = (0, _entries2['default'])(params.filter);
    filters.forEach(function (_ref5) {
      var filterKey = _ref5[0],
          filterValue = _ref5[1];

      valuesToReturn = valuesToReturn.filter(function (value) {
        if (value && value[filterKey] && (0, _typeof3['default'])(value[filterKey]) !== 'object') {
          var propsToFilter = ('' + value[filterKey]).toLowerCase();
          if (propsToFilter.includes(('' + filterValue).toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    });
  }

  if (params.pagination) {
    var values = [];
    values = valuesToReturn;
    if (params.sort) {
      values.sort((0, _sortBy2['default'])('' + (params.sort.order === 'ASC' ? '-' : '') + params.sort.field));
    }

    var keys = values.map(function (i) {
      return i.id;
    });
    var _params$pagination = params.pagination,
        page = _params$pagination.page,
        perPage = _params$pagination.perPage;

    var _start = (page - 1) * perPage;
    var _end = page * perPage;
    var data = values ? values.slice(_start, _end) : [];
    var ids = keys.slice(_start, _end) || [];
    var total = values ? values.length : 0;
    return { data: data, ids: ids, total: total };
  } else {
    throw new Error('Error processing request');
  }
};

var getMany = function getMany(params, resourceName, resourceData) {
  var data = (0, _values2['default'])(resourceData).filter(function (item) {
    return params.ids.indexOf(item.id) > -1;
  });
  return { data: data, ids: params.ids };
};

exports['default'] = {
  upload: upload,
  save: save,
  del: del,
  delMany: delMany,
  getItemID: getItemID,
  getOne: getOne,
  getList: getList,
  getMany: getMany,
  addUploadFeature: addUploadFeature,
  convertFileToBase64: convertFileToBase64
};
module.exports = exports['default'];