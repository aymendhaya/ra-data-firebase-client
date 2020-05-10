import sortBy from 'sort-by';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _this = window;
var convertFileToBase64 = function convertFileToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      return resolve({ result: reader.result, type: file.type, title: file.title, size: file.rawFile.size });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file.rawFile);
  });
};
var index = (function (firebase) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { context: '', imagekey: 'images', filekey: 'files' };

  var database = firebase.default.database();
  return {
    create: function create(source, params) {
      var resource = [settings.context, source].join('/');
      var uid = params.data.id || database.ref().child(resource).push().key;

      var create = !params.data[settings.imagekey] && !params.data[settings.filekey] ? new Promise(function (resolve, reject) {
        var ref = database.ref([resource, uid].join('/'));
        ref.set(_extends({}, params.data, { id: uid }));
        resolve();
      }) : Promise.all((!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]]).map(function (img) {
        return _extends({}, img, { type: 'image' });
      }).map(convertFileToBase64).concat((!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]]).map(function (file) {
        return _extends({}, file, { type: 'file' });
      }).map(convertFileToBase64))).then(function (base64ed) {
        return base64ed.map(function (item64, key) {
          return {
            src: item64.result,
            id: params.data.id + '_' + item64.type + '_' + key,
            title: item64.title,
            type: item64.type,
            size: item64.size
          };
        });
      }).then(function (transformedNewItems) {
        var _babelHelpers$extends;

        database.ref([resource, uid].join('/')).set(_extends({}, params.data, (_babelHelpers$extends = {}, defineProperty(_babelHelpers$extends, settings.imagekey, transformedNewItems.filter(function (i) {
          return i.type === 'image';
        })), defineProperty(_babelHelpers$extends, settings.filekey, transformedNewItems.filter(function (i) {
          return i.type === 'file';
        })), defineProperty(_babelHelpers$extends, 'id', uid), _babelHelpers$extends)));
      });

      return create.then(function (res) {
        return { data: _extends({}, params.data, { id: uid }) };
      });
    },
    update: function update(source, params) {
      var resource = [settings.context, source].join('/');
      var update = !params.data[settings.imagekey] && !params.data[settings.filekey] ? new Promise(function (resolve, reject) {
        database.ref([resource, params.id].join('/')).set(params.data);
        resolve();
      }) : Promise.all((!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]]).filter(function (p) {
        return p.rawFile instanceof File;
      }).map(function (img) {
        return _extends({}, img, { type: 'image' });
      }).map(convertFileToBase64).concat((!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]]).filter(function (p) {
        return p.rawFile instanceof File;
      }).map(function (file) {
        return _extends({}, file, { type: 'file' });
      }).map(convertFileToBase64))).then(function (base64ed) {
        return base64ed.map(function (item64, key) {
          return {

            src: item64.result,
            id: params.data.id + '_' + item64.type + '_' + key,
            title: item64.title,
            type: item64.type,
            size: item64.size
          };
        });
      }).then(function (transformedNewItems) {
        var _babelHelpers$extends2;

        database.ref([resource, params.id].join('/')).set(_extends({}, params.data, (_babelHelpers$extends2 = {}, defineProperty(_babelHelpers$extends2, settings.imagekey, [].concat(toConsumableArray(transformedNewItems.filter(function (i) {
          return i.type === 'image';
        })), toConsumableArray((!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]]).filter(function (p) {
          return !(p.rawFile instanceof File);
        })))), defineProperty(_babelHelpers$extends2, settings.filekey, [].concat(toConsumableArray(transformedNewItems.filter(function (i) {
          return i.type === 'file';
        })), toConsumableArray((!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]]).filter(function (p) {
          return !(p.rawFile instanceof File);
        })))), _babelHelpers$extends2)));
      });
      return update.then(function (res) {
        return { data: params.data };
      });
    },
    getList: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(source, params) {
        var resource, field, ref;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                resource = [settings.context, source].join('/');
                field = params.sort.field;
                ref = database.ref(resource);
                return _context.abrupt('return', ref.orderByChild(field).once('value').then(function (snapshot) {
                  var valuesToReturn = snapshot.val() ? Object.values(snapshot.val()) : [];
                  if (params.filter) {
                    var filterset = params.filter;
                    filterset = Object.assign(filterset, filterset.q ? { id: filterset.q } : {});
                    delete filterset.q;
                    var filters = Object.entries(filterset);
                    filters.forEach(function (_ref2) {
                      var _ref3 = slicedToArray(_ref2, 2),
                          filterKey = _ref3[0],
                          filterValue = _ref3[1];

                      valuesToReturn = valuesToReturn.filter(function (value) {
                        if (value && value[filterKey] && _typeof(value[filterKey]) !== 'object') {
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
                      values.sort(sortBy('' + (params.sort.order === 'ASC' ? '-' : '') + params.sort.field));
                    }
                    var _params$pagination = params.pagination,
                        page = _params$pagination.page,
                        perPage = _params$pagination.perPage;

                    var _start = (page - 1) * perPage;
                    var _end = page * perPage;
                    var data = values ? values.slice(_start, _end) : [];
                    var total = snapshot.val() ? Object.keys(snapshot.val()).length : 0;

                    return { data: data, total: total };
                  } else {
                    throw new Error('Error processing request');
                  }
                }));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function getList(_x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }(),

    getOne: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source, params) {
        var resource, ref;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                resource = [settings.context, source].join('/');
                _context2.next = 3;
                return database.ref([resource, params.id].join('/'));

              case 3:
                ref = _context2.sent;
                return _context2.abrupt('return', ref.once('value').then(function (snapshot) {
                  return {
                    data: snapshot.val() };
                }));

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function getOne(_x4, _x5) {
        return _ref4.apply(this, arguments);
      };
    }(),

    getMany: function getMany(source, params) {
      var resource = [settings.context, source].join('/');
      var getMany = new Promise(function (resolve, reject) {
        var data = params.ids.map(function (id) {
          return database.ref([resource, id].join('/')).once('value').then(function (snapshot) {
            return snapshot.val();
          });
        });
        resolve(data);
      });
      return getMany.then(function (data) {
        return { data: data };
      });
    },

    getManyReference: function getManyReference(source, params) {
      var resource = [settings.context, source].join('/');
      var getManyRef = new Promise(function (resolve, reject) {
        var data = params.ids.map(function (id) {
          return database.ref([resource, id].join('/')).once('value').then(function (snapshot) {
            return snapshot.val();
          });
        });
        resolve(data);
      });
      return getManyRef.then(function (data) {
        return { data: data };
      });
    },

    updateMany: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, params) {
        var resource, updateMany;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                resource = [settings.context, source].join('/');
                updateMany = new Promise(function (resolve, reject) {
                  params.ids.map(function (id) {
                    database.ref([resource, id].join('/')).once('value').then(function (snapshot) {
                      var update = new Promise(function (resolve, reject) {
                        database.ref([resource, id].join('/')).set(Object.assign(snapshot.val(), params.data));
                        resolve();
                      });
                      return update.then(function (res) {
                        return { data: params.data };
                      });
                    });
                  });
                  resolve();
                });
                return _context3.abrupt('return', updateMany.then(function (res) {
                  return { data: params.ids };
                }));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this);
      }));

      return function updateMany(_x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }(),

    delete: function _delete(source, params) {
      var resource = [settings.context, source].join('/');
      var Delete = new Promise(function (resolve, reject) {
        database.ref([resource, params.id].join('/')).set(null);
        resolve();
      });
      return Delete.then(function (res) {
        return { data: params.previousData };
      });
    },

    deleteMany: function deleteMany(source, params) {
      var resource = [settings.context, source].join('/');
      var deleteMany = new Promise(function (resolve, reject) {
        params.ids.map(function (id) {
          return database.ref([resource, id].join('/')).set(null);
        });
        resolve();
      });
      return deleteMany.then(function (res) {
        return { data: params };
      });
    }
  };
});

export default index;
//# sourceMappingURL=index.es.js.map
