'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _reactAdmin = require('react-admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @param {string[]|Object[]} trackedResources Array of resource names or array of Objects containing name and
 * optional path properties (path defaults to name)
 * @param {Object} firebaseConfig Options Firebase configuration
 */

var BaseConfiguration = {
  initialQuerytimeout: 10000,
  timestampFieldNames: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

var RestProvider = function RestProvider() {
  var firebaseConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = (0, _assign2['default'])({}, BaseConfiguration, options);
  var _options = options,
      timestampFieldNames = _options.timestampFieldNames,
      trackedResources = _options.trackedResources,
      initialQuerytimeout = _options.initialQuerytimeout;


  var resourcesStatus = {};
  var resourcesReferences = {};
  var resourcesData = {};
  var resourcesPaths = {};
  var resourcesUploadFields = {};

  if (_firebase2['default'].apps.length === 0) {
    _firebase2['default'].initializeApp(firebaseConfig);
    _firebase2['default'].auth().setPersistence(_firebase2['default'].auth.Auth.Persistence.SESSION);
  }

  /* Functions */
  var upload = options.upload || _methods2['default'].upload;
  var save = options.save || _methods2['default'].save;
  var del = options.del || _methods2['default'].del;
  var getItemID = options.getItemID || _methods2['default'].getItemID;
  var getOne = options.getOne || _methods2['default'].getOne;
  var getMany = options.getMany || _methods2['default'].getMany;
  var delMany = options.delMany || _methods2['default'].delMany;
  var getList = options.getList || _methods2['default'].getList;

  var firebaseSaveFilter = options.firebaseSaveFilter ? options.firebaseSaveFilter : function (data) {
    return data;
  };
  var firebaseGetFilter = options.firebaseGetFilter ? options.firebaseGetFilter : function (data) {
    return data;
  };

  // Sanitize Resources
  trackedResources.map(function (resource, index) {
    if (typeof resource === 'string') {
      resource = {
        name: resource,
        path: resource,
        uploadFields: []
      };
      trackedResources[index] = resource;
    }

    var _resource = resource,
        name = _resource.name,
        path = _resource.path,
        uploadFields = _resource.uploadFields;

    if (!resource.name) {
      throw new Error('name is missing from resource ' + resource);
    }
    resourcesUploadFields[name] = uploadFields || [];
    resourcesPaths[name] = path || name;
    resourcesData[name] = {};
  });

  var initializeResource = function initializeResource(_ref, resolve) {
    var name = _ref.name,
        isPublic = _ref.isPublic;

    var ref = resourcesReferences[name] = _firebase2['default'].database().ref(resourcesPaths[name]);
    resourcesData[name] = [];

    if (isPublic) {
      subscribeResource(ref, name, resolve);
    } else {
      _firebase2['default'].auth().onAuthStateChanged(function (auth) {
        if (auth) {
          subscribeResource(ref, name, resolve);
        }
      });
    }

    setTimeout(resolve, initialQuerytimeout);

    return true;
  };

  var subscribeResource = function subscribeResource(ref, name, resolve) {
    ref.once('value', function (childSnapshot) {
      /** Uses "value" to fetch initial data. Avoid the RA to show no results */
      if (childSnapshot.key === name) {
        var entries = childSnapshot.val() || {};
        (0, _keys2['default'])(entries).map(function (key) {
          resourcesData[name][key] = firebaseGetFilter(entries[key], name);
        });
        (0, _keys2['default'])(resourcesData[name]).forEach(function (itemKey) {
          resourcesData[name][itemKey].id = itemKey;
          resourcesData[name][itemKey].key = itemKey;
        });
        resolve();
      }
    });
    ref.on('child_added', function (childSnapshot) {
      resourcesData[name][childSnapshot.key] = firebaseGetFilter((0, _assign2['default'])({}, {
        id: childSnapshot.key,
        key: childSnapshot.key
      }, childSnapshot.val()), name);
    });

    ref.on('child_removed', function (oldChildSnapshot) {
      if (resourcesData[name][oldChildSnapshot.key]) {
        delete resourcesData[name][oldChildSnapshot.key];
      }
    });

    ref.on('child_changed', function (childSnapshot) {
      resourcesData[name][childSnapshot.key] = childSnapshot.val();
    });
  };

  trackedResources.map(function (resource) {
    resourcesStatus[resource.name] = new _promise2['default'](function (resolve) {
      initializeResource(resource, resolve);
    });
  });

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resourceName Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */

  return function () {
    var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(type, resourceName, params) {
      var result, uploadFields, itemId, uploads, currentData, uploadResults;
      return _regenerator2['default'].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return resourcesStatus[resourceName];

            case 2:
              result = null;
              _context.t0 = type;
              _context.next = _context.t0 === _reactAdmin.GET_LIST ? 6 : _context.t0 === _reactAdmin.GET_MANY ? 10 : _context.t0 === _reactAdmin.GET_MANY_REFERENCE ? 15 : _context.t0 === _reactAdmin.GET_ONE ? 19 : _context.t0 === _reactAdmin.DELETE ? 23 : _context.t0 === _reactAdmin.DELETE_MANY ? 28 : _context.t0 === _reactAdmin.UPDATE ? 32 : _context.t0 === _reactAdmin.CREATE ? 32 : 43;
              break;

            case 6:
              _context.next = 8;
              return getList(params, resourceName, resourcesData[resourceName]);

            case 8:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 10:
              _context.next = 12;
              return getMany(params, resourceName, resourcesData[resourceName]);

            case 12:
              result = _context.sent;

              // console.log('GET_MANY');
              console.log('reselut', result);
              return _context.abrupt('return', result);

            case 15:
              _context.next = 17;
              return getMany(params, resourceName, resourcesData[resourceName]);

            case 17:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 19:
              _context.next = 21;
              return getOne(params, resourceName, resourcesData[resourceName]);

            case 21:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 23:
              // console.log('DELETE');
              uploadFields = resourcesUploadFields[resourceName] ? resourcesUploadFields[resourceName] : [];
              _context.next = 26;
              return del(params.id, resourceName, resourcesPaths[resourceName], uploadFields);

            case 26:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 28:
              _context.next = 30;
              return delMany(params.ids, resourceName, resourcesData[resourceName]);

            case 30:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 32:
              console.log('UPDATE/CREATE');
              itemId = getItemID(params, type, resourceName, resourcesPaths[resourceName], resourcesData[resourceName]);
              uploads = resourcesUploadFields[resourceName] ? resourcesUploadFields[resourceName].map(function (field) {
                return upload(field, params.data, itemId, resourceName, resourcesPaths[resourceName]);
              }) : [];
              currentData = resourcesData[resourceName][itemId] || {};
              _context.next = 38;
              return _promise2['default'].all(uploads);

            case 38:
              uploadResults = _context.sent;
              _context.next = 41;
              return save(itemId, params.data, currentData, resourceName, resourcesPaths[resourceName], firebaseSaveFilter, uploadResults, type === _reactAdmin.CREATE, timestampFieldNames);

            case 41:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 43:
              console.error('Undocumented method: ', type);
              return _context.abrupt('return', { data: [] });

            case 45:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports['default'] = RestProvider;
module.exports = exports['default'];