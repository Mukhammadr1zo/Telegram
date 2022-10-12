import { read, write } from '../utils/model.js';
import { InternalServerError, ForbiddenError } from '../utils/errors.js';
import path from 'path';

const GET = (req, res, next) => {
  try {
    let { fileName } = req.params;

    if (!fileName) {
      return next( new ForbiddenError(403, e.message));
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).sendFile(path.join(process.cwd(), 'src', 'uploads', req.params.fileName));
  } catch (e) {
    return next(new InternalServerError(500, e.message));
  }
}

const DOWNLOAD = (req, res, next) => {
  try {
    let { fileName } = req.params;

    if (!fileName) {
      return next( new ForbiddenError(403, e.message));
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).download(path.join(process.cwd(), 'src', 'uploads', req.params.fileName));
  } catch (e) {
    return next(new InternalServerError(500, e.message));
  }
}

export default {
  GET, 
  DOWNLOAD
}
