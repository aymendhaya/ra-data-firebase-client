import _Promise from 'babel-runtime/core-js/promise';
import _extends from 'babel-runtime/helpers/extends';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

var _this = this;

/* globals localStorage */
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from 'react-admin';
import firebase from 'firebase';

var baseConfig = {
  userProfilePath: '/users/',
  userAdminProp: 'isAdmin',
  localStorageTokenName: 'RAFirebaseClientToken',
  handleAuthStateChange: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(auth, config) {
      var snapshot, profile, firebaseToken, user;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!auth) {
                _context.next = 17;
                break;
              }

              _context.next = 3;
              return firebase.database().ref(config.userProfilePath + auth.user.uid).once('value');

            case 3:
              snapshot = _context.sent;
              profile = snapshot.val();

              if (!(profile && profile[config.userAdminProp])) {
                _context.next = 12;
                break;
              }

              firebaseToken = auth.user.getIdToken();
              user = { auth: auth, profile: profile, firebaseToken: firebaseToken };

              localStorage.setItem(config.localStorageTokenName, firebaseToken);
              return _context.abrupt('return', user);

            case 12:
              firebase.auth().signOut();
              localStorage.removeItem(config.localStorageTokenName);
              throw new Error('sign_in_error');

            case 15:
              _context.next = 19;
              break;

            case 17:
              localStorage.removeItem(config.localStorageTokenName);
              throw new Error('sign_in_error');

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function handleAuthStateChange(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};

export default (function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  config = _extends({}, baseConfig, config);

  var firebaseLoaded = function firebaseLoaded() {
    return new _Promise(function (resolve) {
      firebase.auth().onAuthStateChanged(resolve);
    });
  };

  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(type, params) {
      var username, password, alreadySignedIn, auth;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(type === AUTH_LOGOUT)) {
                _context2.next = 3;
                break;
              }

              config.handleAuthStateChange(null, config)['catch'](function () {});
              return _context2.abrupt('return', firebase.auth().signOut());

            case 3:
              if (!firebase.auth().currentUser) {
                _context2.next = 6;
                break;
              }

              _context2.next = 6;
              return firebase.auth().currentUser.reload();

            case 6:
              if (!(type === AUTH_CHECK)) {
                _context2.next = 12;
                break;
              }

              _context2.next = 9;
              return firebaseLoaded();

            case 9:
              if (firebase.auth().currentUser) {
                _context2.next = 11;
                break;
              }

              throw new Error('sign_in_error');

            case 11:
              return _context2.abrupt('return', true);

            case 12:
              if (!(type === AUTH_LOGIN)) {
                _context2.next = 20;
                break;
              }

              username = params.username, password = params.password, alreadySignedIn = params.alreadySignedIn;
              auth = firebase.auth().currentUser;

              if (!(!auth || !alreadySignedIn)) {
                _context2.next = 19;
                break;
              }

              _context2.next = 18;
              return firebase.auth().signInWithEmailAndPassword(username, password);

            case 18:
              auth = _context2.sent;

            case 19:
              return _context2.abrupt('return', config.handleAuthStateChange(auth, config));

            case 20:
              return _context2.abrupt('return', false);

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
});