import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { httpLogger } from './utils';
import {
  getMovies,
  postComment,
  getComments,
  getCharacters,
  status,
} from './controllers';

// express router
const router = express.Router();

// middlewares
// router.use(morgan('dev')); // dev logging API
router.use(httpLogger);
router.use(helmet()); // security
router.use(cors());
router.use(express.json()); // request application/type === json
router.use(express.urlencoded({ extended: false })); // form data object, value objectnya berasal dari input attribute name
// router.use(compression()); // Gzip compressing can greatly decrease the size of the response body

router.get('/', status);
router.get('/v1/movies/', getMovies);
router.get('/v1/characters/', getCharacters);
router.post('/v1/comments/', postComment);
router.get('/v1/comments/', getComments);

export default router;
