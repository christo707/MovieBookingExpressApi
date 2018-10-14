'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _seats = require('./seats');

var _seats2 = _interopRequireDefault(_seats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var seatInfo = new Schema({
  name: {
    type: String,
    required: true
  },
  seats: [{
    type: Number,
    required: true
  }]
});

module.exports = _mongoose2.default.model('SeatInfo', seatInfo);
//# sourceMappingURL=seatInfo.js.map