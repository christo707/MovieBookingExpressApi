'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _screen = require('./screen');

var _screen2 = _interopRequireDefault(_screen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Reserve = new Schema({
  screen: [{
    type: Schema.Types.ObjectId,
    ref: 'Screen'
  }],
  seatInfo: [{
    name: {
      type: String,
      required: true
    },
    seats: {
      noOfSeats: {
        type: Number,
        required: true
      },
      seatsBooked: [{
        type: Number,
        required: true
      }]
    }
  }]
});

module.exports = _mongoose2.default.model('Reserve', Reserve);
//# sourceMappingURL=reserve.js.map