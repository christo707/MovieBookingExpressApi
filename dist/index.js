'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;


console.log('\n');
console.log(' ,-----,--.  ,--.,------. ,--. ,---.,--------.,-----.');
console.log("| .--./|  '--'  ||  .--. '|  |'   .-'--.  .--'  .-.  ' ");
console.log("| |  | |  .--.  ||  '--'.'|  |`.  `-.  |  |  |  | |  | ");
console.log("| '--'\\|  |  |  ||  | \\  \\|  |.-'    | |  |  '  '-'  ' ");
console.log(" -----'`--'  `--'`--' `--'`--'`-----'  `--'   `-----'  ");
console.log('\n');
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// middleware
// parse application/json
app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));
app.use(_bodyParser2.default.urlencoded({ extended: true }));

// api routes v1
app.use('/api', _routes2.default);

app.server.listen(_config2.default.port);

console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map