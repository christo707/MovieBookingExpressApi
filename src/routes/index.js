import express from 'express';
import config from '../config';
import initializeDb from '../db';
import middleware from '../middleware';
import screen from '../controller/screen';

let router = express();

// connect to db
initializeDb(db => {

  // internal middleware
  //router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  let r = express.Router();
  router.use('/v1', r);
  r.get('/', (req, res) => {
      res.send('Movie API is UP');
  });
   r.use('/screens', screen({ config, db }));
});

export default router;
