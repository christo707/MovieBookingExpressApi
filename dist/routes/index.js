'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _screen = require('../controller/screen');

var _screen2 = _interopRequireDefault(_screen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import user from '../controller/user';
// import comment from '../controller/comment';
// import account from '../controller/account';

var router = (0, _express2.default)();

// connect to db
(0, _db2.default)(function (db) {

  // internal middleware
  //router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  var r = _express2.default.Router();
  router.use('/v1', r);
  r.get('/', function (req, res) {
    res.send('Movie API is UP');
  });
  r.use('/screens', (0, _screen2.default)({ config: _config2.default, db: db }));
  // router.use('/posts', post({ config, db }));
  // router.use('/comments', comment({ config, db }));
  // router.use('/account', account({ config, db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map