import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let Screen = new Schema({
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

module.exports = mongoose.model('Screen', Screen);
