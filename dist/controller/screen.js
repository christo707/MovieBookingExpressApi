'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _screen = require('../model/screen');

var _screen2 = _interopRequireDefault(_screen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //Add a new Screen
  //'api/v1/screens'
  // Storing theatre seats in form of matrix
  // 0 and 9 for unreserved, 9 for aisle seats
  // row is represented by array of numbers.
  // controller converts seats info to array of number and store in database
  api.post('/', function (req, res) {
    var total = 0;
    var screen = new _screen2.default();
    var reqObj = JSON.parse(JSON.stringify(req.body));
    screen.name = reqObj.name;
    screen.rows = new Array(reqObj.seatInfo.length);
    var no = 0;
    for (var key in reqObj.seatInfo) {
      console.log('2: ' + reqObj.seatInfo[key].numberOfSeats);
      var row = new Object();
      row.name = key;
      row.seats = new Array(reqObj.seatInfo[key].numberOfSeats);
      for (var j = 0; j < reqObj.seatInfo[key].numberOfSeats; j++) {
        row.seats[j] = 0;
      }
      for (var _j = 0; _j < reqObj.seatInfo[key].aisleSeats.length; _j++) {
        row.seats[reqObj.seatInfo[key].aisleSeats[_j]] = 9;
      }
      total += reqObj.seatInfo[key].numberOfSeats;
      screen.rows[no++] = row;
    }
    screen.totalSeats = total;
    screen.save(function (err) {
      if (err) {
        if (err.code == 11000) {
          res.status(400);
          res.json({ message: 'Screen with same name alread exist.' });
          return;
        }
        res.status(500);
        res.send(err);
        return;
      } else {}
      res.status(201);
      res.json({ message: 'Screen Created successfully' });
    });
  });

  //Reserve
  //'api/v1/:name/reserve'
  api.post('/:name/reserve', function (req, res) {
    _screen2.default.findOne({
      name: req.params.name
    }, function (err, screen) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({ message: 'Screen Not Found' });
        return;
      } else {
        var reqObj = JSON.parse(JSON.stringify(req.body));
        for (var key in reqObj.seats) {
          var e = true;
          var seat = new Object();
          seat.name = key;
          for (var j = 0; j < screen.rows.length; j++) {
            if (screen.rows[j].name == seat.name) {
              e = false;
              var arr = new Array(screen.rows[j].seats.length);
              for (var p = 0; p < screen.rows[j].seats.length; p++) {
                arr[p] = screen.rows[j].seats[p];
              }
              for (var k = 0; k < reqObj.seats[key].length; k++) {
                if (screen.rows[j].seats[reqObj.seats[key][k]] == 2 || screen.rows[j].seats[reqObj.seats[key][k]] == undefined) {
                  res.status(406).json({ message: 'All Seats are not available' });
                  return;
                } else {
                  arr[reqObj.seats[key][k]] = 2;
                }
                screen.rows[j].seats = arr;
              }
            }
          }
          if (e == true) {
            res.status(406).json({ message: 'All Seats are not available' });
            return;
          }
        }
        console.log(screen.rows[0]);
        screen.save(function (err) {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          } else {
            res.status(201);
            res.json({ message: 'Booking done successfully' });
            return;
          }
        });
      }
    });
  });

  //Get Available Seats
  //'/api/v1/:name/available'
  api.get('/:name/available', function (req, res) {
    _screen2.default.findOne({
      name: req.params.name
    }, function (err, screen) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({ message: 'Screen Not Found' });
        return;
      } else {
        var avail = new Object();
        var seats = new Object();
        for (var j = 0; j < screen.rows.length; j++) {
          var arr = new Array();
          var pos = 0;
          for (var k = 0; k < screen.rows[j].seats.length; k++) {
            if (screen.rows[j].seats[k] == 0 || screen.rows[j].seats[k] == 9) {
              arr[pos++] = k;
            }
          }
          seats[screen.rows[j].name] = arr;
        }
        avail["seats"] = seats;
        res.status(200);
        res.json(avail);
      }
    });
  });

  //Available Tickets
  //'/api/v1/screens/:name/seats'
  api.get('/:name/seats', function (req, res) {
    var num = Number(req.query.numSeats);
    var row = req.query.choice[0];
    var seatno = Number(req.query.choice[1]);
    _screen2.default.findOne({
      name: req.params.name
    }, function (err, screen) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({ message: 'Screen Not Found' });
        return;
      } else if (num == undefined || row == undefined || seatno == undefined) {
        res.status(204);
        res.json({ message: 'Invalid Query Parameters' });
        return;
      } else {
        var avail = new Object();
        var seatsAvail = new Object();
        for (var j = 0; j < screen.rows.length; j++) {
          var arr = new Array();
          if (screen.rows[j].name == row) {
            var lef = seatno + 1 - num >= 0 ? seatno + 1 - num : 0;
            var rig = seatno - 1 + num <= screen.rows[j].seats.length ? seatno - 1 + num : 0;
            while (rig - lef + 1 >= num) {
              var y = lef;
              var no = 0;
              var ar = new Array();
              for (; y < lef + num; y++) {
                if (screen.rows[j].seats[y] == 2 || screen.rows[j].seats[y] == 9 && !(no < num)) break;else {
                  ar[no] = y;
                  console.log('1:' + ar);
                  no++;
                  console.log('No: ' + no);
                }
              }
              if (no == num) {
                console.log('2:' + ar);
                arr.push(ar);
                console.log(seatsAvail);
              }
              lef++;
            }
          }
          if (screen.rows[j].name == row) seatsAvail[screen.rows[j].name] = arr;
        }

        avail["availableseats"] = seatsAvail;
        res.status(200);
        res.json(avail);
      }
    });
  });

  //Get All Screens
  //'/api/v1/screens/'
  api.get('/', function (req, res) {
    _screen2.default.find({}, function (err, screens) {
      if (err) {
        res.status(500);
        res.send(err);
        retrn;
      } else if (Object.keys(screens).length === 0) {
        res.status(204).json({ message: 'No Screens Present' });
      } else {
        res.status(200);
        res.json(screens);
      }
    });
  });

  // Get Screen By Name
  // '/api/v1/screens/:id'
  api.get('/:name', function (req, res) {
    _screen2.default.find({
      name: req.params.name
    }, function (err, screen) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({ message: 'Screen Not Found' });
        return;
      } else {
        res.status(200);
        res.json(screen);
      }
    });
  });

  //Delete Screen
  // '/ai/v1/screens/:screenid'
  api.delete('/:screenid', function (req, res) {
    _screen2.default.findById(req.params.screenid, function (err, screen) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({ message: 'No Screen Present' });
        return;
      } else {
        _screen2.default.remove({
          _id: req.params.screenid
        }, function (err) {
          if (err) {
            res.status(500);
            res.send(err);
          }
          res.status(200);
          res.json({ message: 'Screen Removed successfully' });
        });
      }
    });
  });

  return api;
};
//# sourceMappingURL=screen.js.map