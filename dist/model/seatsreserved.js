'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var seatsReserved = new Schema({
  noOfSeats: {
    type: Number,
    required: true
  },
  seatsBooked: [{
    type: Number,
    required: true
  }]
});

module.exports = _mongoose2.default.model('SeatsReserved', seatsReserved);
//# sourceMappingURL=seatsreserved.js.map