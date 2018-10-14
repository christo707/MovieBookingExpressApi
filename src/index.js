import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
const LocalStrategy = require('passport-local').Strategy;
import config from './config';
import routes from './routes';

console.log('\n');
console.log(' ,-----,--.  ,--.,------. ,--. ,---.,--------.,-----.');
console.log("| .--./|  '--'  ||  .--. '|  |'   .-'--.  .--'  .-.  ' ");
console.log("| |  | |  .--.  ||  '--'.'|  |`.  `-.  |  |  |  | |  | ");
console.log("| '--'\\|  |  |  ||  | \\  \\|  |.-'    | |  |  '  '-'  ' ");
console.log(" -----'`--'  `--'`--' `--'`--'`-----'  `--'   `-----'  ");
console.log('\n');
let app = express();
app.server = http.createServer(app);

// middleware
// parse application/json
app.use(bodyParser.json({
  limit : config.bodyLimit
}));
app.use(bodyParser.urlencoded({ extended: true}));

// api routes v1
app.use('/api', routes);

app.server.listen(config.port);

console.log(`Started on port ${app.server.address().port}`);

export default app;
