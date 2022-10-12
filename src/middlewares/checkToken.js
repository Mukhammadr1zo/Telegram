import { ForbiddenError } from '../utils/errors.js';
import jwt from '../utils/jwt.js';

export default (req, res, next) => {
  try {
    if (!(req.url == '/login' || req.url == '/register' || req.url == '/test' || req.url.includes('view') || req.url.includes('download'))) {
      let { token } = req.headers;

      if (!token) {
        return next(new ForbiddenError(403, 'token required'));
      }

      let { userId } = jwt.verify(token);

      req.userId = userId;

      return next();
    } else {
      return next();
    }

    
  } catch (e) {
    return next(new ForbiddenError(403, e.message));
  }
}
