'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Screen = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalSeats: {
    type: String,
    required: true
  },
  rows: [{
    "name": {
      type: String,
      required: true
    },
    seats: [{
      type: Number,
      required: true
    }]
  }]
});

module.exports = _mongoose2.default.model('Screen', Screen);
//# sourceMappingURL=screen.js.map