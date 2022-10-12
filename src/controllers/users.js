import { read, write } from '../utils/model.js';
import { InternalServerError, AuthorizationError } from '../utils/errors.js';
import sha256 from 'sha256';
import jwt from '../utils/jwt.js';
import path from 'path';

const HOST = process.env.HEROKU_APP_NAME ? process.env.HEROKU_APP_NAME + '.heroku.com' : 'http://localhost';
const PORT = process.env.PORT || 3001;

const GET = (_, res, next) => {
  try {
    let users = read('users').filter(user => delete user.password);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(users);
  } catch (e) {
    return next( new InternalServerError(500, e.message) );
  }
}

const LOGIN = (req, res, next) => {
  try {
    let { username, password } = req.body;
    let users = read('users');
    
    let user = users.find(user => user.username == username && user.password == sha256(password));

    if (!user) {
      return next( new AuthorizationError(401, 'wrong username or password') )
    }

    delete user.password;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      status: 200,
      message: 'ok',
      token: jwt.sign({userId: user.userId}),
      data: user
    });
  } catch (e) {
    return next( new InternalServerError(500, e.message) );
  }
}

const REGISTER = (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let users = read('users');

    req.body.userId = users.length ? users.at(-1).userId + 1 : 1;
    req.body.password = sha256(req.body.password);

    let user = users.find(user => user.username === req.body.username);

    if (user) {
      return next( new AuthorizationError(401, 'this user already exists'))
    }

    if (req.files) {
      let fileName = Date.now() + req.files.avatar.name.replace(/\s/g, '');
      req.files.avatar.mv(path.join(process.cwd(), 'src', 'uploads', fileName));

      req.body.avatar = {
        "viewLink": `${HOST}:${PORT}/view/${fileName}`,
        "downloadLink": `${HOST}:${PORT}/download/${fileName}`
      };
    } else {
      req.body.avatar = {
        "viewLink": `${HOST}:${PORT}/view/stock.jpg`,
        "downloadLink": `${HOST}:${PORT}/download/stock.jpg`
      }
    }

    console.log(req.body);

    users.push(req.body);
    write('users', users);

    delete req.body.password;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201).json({
      status: 201,
      message: 'ok',
      token: jwt.sign({userId: req.body.userId}),
      data: req.body
    });

  } catch (e) {
    return next(new InternalServerError(500, e.message));
  }
}

export default {
  GET,
  LOGIN,
  REGISTER
}
