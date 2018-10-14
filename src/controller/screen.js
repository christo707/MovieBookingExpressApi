import {Router} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from '../config';
import Screen from '../model/screen';

export default({config, db}) => {
  let api = Router();

  //Add a new Screen
  //'api/v1/screens'
  // Storing theatre seats in form of matrix
  // 0 and 9 for unreserved, 9 for aisle seats
  // row is represented by array of numbers.
  // controller converts seats info to array of number and store in database
  api.post('/', (req, res) => {
    let total = 0;
    let screen = new Screen();
    let reqObj = JSON.parse(JSON.stringify(req.body));
    screen.name = reqObj.name;
    screen.rows = new Array(reqObj.seatInfo.length);
    let no = 0;
    for (var key in reqObj.seatInfo) {
      console.log('2: ' + reqObj.seatInfo[key].numberOfSeats);
      let row = new Object();
      row.name = key;
      row.seats = new Array(reqObj.seatInfo[key].numberOfSeats)
      for (let j = 0; j < reqObj.seatInfo[key].numberOfSeats; j++) {
        row.seats[j] = 0;
      }
      for (let j = 0; j < reqObj.seatInfo[key].aisleSeats.length; j++) {
        row.seats[reqObj.seatInfo[key].aisleSeats[j]] = 9;
      }
      total += reqObj.seatInfo[key].numberOfSeats;
      screen.rows[no++] = row;
    }
    screen.totalSeats = total;
    screen.save(function(err) {
      if (err) {
        if (err.code == 11000) {
          res.status(400);
          res.json({message: 'Screen with same name alread exist.'});
          return;
        }
        res.status(500);
        res.send(err);
        return;
      } else {}
      res.status(201);
      res.json({message: 'Screen Created successfully'});
    });
  });

  //Reserve
  //'api/v1/:name/reserve'
  api.post('/:name/reserve', (req, res) => {
    Screen.findOne({
      name: req.params.name
    }, (err, screen) => {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({message: 'Screen Not Found'});
        return;
      } else {
        let reqObj = JSON.parse(JSON.stringify(req.body));
        for (var key in reqObj.seats) {
          let e = true;
          let seat = new Object();
          seat.name = key;
          for (let j = 0; j < screen.rows.length; j++) {
            if (screen.rows[j].name == seat.name) {
              e = false;
              let arr = new Array(screen.rows[j].seats.length);
              for (let p = 0; p < screen.rows[j].seats.length; p++) {
                arr[p] = screen.rows[j].seats[p];
              }
              for (let k = 0; k < reqObj.seats[key].length; k++) {
                if (screen.rows[j].seats[reqObj.seats[key][k]] == 2 || screen.rows[j].seats[reqObj.seats[key][k]] == undefined) {
                  res.status(406).json({message: 'All Seats are not available'});
                  return;
                } else {
                  arr[reqObj.seats[key][k]] = 2;
                }
                screen.rows[j].seats = arr;
              }
            }
          }
          if (e == true) {
            res.status(406).json({message: 'All Seats are not available'});
            return;
          }
        }
        console.log(screen.rows[0]);
        screen.save(function(err) {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          } else {
            res.status(201);
            res.json({message: 'Booking done successfully'});
            return;
          }
        });
      }
    });
  });

  //Get Available Seats
  //'/api/v1/:name/available'
  api.get('/:name/available', (req, res) => {
    Screen.findOne({
      name: req.params.name
    }, (err, screen) => {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({message: 'Screen Not Found'});
        return;
      } else {
        let avail = new Object();
        let seats = new Object();
        for (let j = 0; j < screen.rows.length; j++) {
          let arr = new Array();
          let pos = 0;
          for (let k = 0; k < screen.rows[j].seats.length; k++) {
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
  api.get('/:name/seats', (req, res) => {
    let num = Number(req.query.numSeats);
    let row = req.query.choice[0];
    let seatno = Number(req.query.choice[1]);
    Screen.findOne({
      name: req.params.name
    }, (err, screen) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({message: 'Screen Not Found'});
        return;
      } else if (num == undefined || row == undefined || seatno == undefined) {
        res.status(204);
        res.json({message: 'Invalid Query Parameters'});
        return;
      } else {
        let avail = new Object();
        let seatsAvail = new Object();
        for (let j = 0; j < screen.rows.length; j++) {
          let arr = new Array();
          if (screen.rows[j].name == row) {
            console.log((seatno + 1) - num);
            let lef = ((seatno + 1) - num) >= 0
              ? (seatno + 1) - num
              : 0;
            let rig = ((seatno - 1) + num) <= screen.rows[j].seats.length
              ? (seatno - 1) + num
              : 0;
            while ((rig - lef + 1) >= num) {
              let y = lef;
              let no = 0;
              let ar = new Array();
              for (; y < (lef + num); y++) {
                if (screen.rows[j].seats[y] == 2 || (screen.rows[j].seats[y] == 9 && no != num))
                  break;
                ar[no] = y;
                console.log('1:' + ar);
                no++;
                console.log('No: ' + no);
              }
              if (no == num) {
                console.log('2:' + ar);
                arr.push(ar);
                console.log(seatsAvail);
              }
              lef++;
            }
          }
          if (screen.rows[j].name == row)
            seatsAvail[screen.rows[j].name] = arr;
          }

        avail["availableseats"] = seatsAvail;
        res.status(200);
        res.json(avail);
      }
    });
  });

  //Get All Screens
  //'/api/v1/screens/'
  api.get('/', (req, res) => {
    Screen.find({}, (err, screens) => {
      if (err) {
        res.status(500);
        res.send(err);
        retrn;
      } else if (Object.keys(screens).length === 0) {
        res.status(204).json({message: 'No Screens Present'});
      } else {
        res.status(200);
        res.json(screens);
      }
    });
  });

  // Get Screen By Name
  // '/api/v1/screens/:id'
  api.get('/:name', (req, res) => {
    Screen.find({
      name: req.params.name
    }, (err, screen) => {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({message: 'Screen Not Found'});
        return;
      } else {
        res.status(200);
        res.json(screen);
      }
    });
  });

  //Delete Screen
  // '/ai/v1/screens/:screenid'
  api.delete('/:screenid', (req, res) => {
    Screen.findById(req.params.screenid, (err, screen) => {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      } else if (!screen) {
        res.status(204);
        res.json({message: 'No Screen Present'});
        return;
      } else {
        Screen.remove({
          _id: req.params.screenid
        }, (err) => {
          if (err) {
            res.status(500);
            res.send(err);
          }
          res.status(200);
          res.json({message: 'Screen Removed successfully'});
        });
      }
    });
  });

  return api;
}
