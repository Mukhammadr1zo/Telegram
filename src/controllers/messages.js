import { read, write } from '../utils/model.js';
import { InternalServerError } from '../utils/errors.js';
import path from 'path';

const HOST = process.env.HEROKU_APP_NAME ? process.env.HEROKU_APP_NAME + '.heroku.com' : 'http://localhost';
const PORT = process.env.PORT || 3001;

const GET = (_, res, next) => {
  try {
    let messages = read('messages');
    let users = read('users');

    messages = messages.map(message => {
      message.user = users.find(user => user.userId == message.userId);

      delete message.userId;
      delete message.user.password;
      return message;
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(messages);

  } catch (e) { 
    return next(new InternalServerError(500, e.message));
  }
}

const SEND = (req, res, next) => {
  try {
    let messages = read('messages');
    let users = read('users');
    
    if (req.files) {
      let fileName = Date.now() + req.files.file.name.replace(/\s/g, '');
      req.files.file.mv(path.join(process.cwd(), 'src', 'uploads', fileName));
      req.body.file = {
        "name": req.files.file.name,
        "viewLink": `${HOST}:${PORT}/view/${fileName}`,
        "downloadLink": `${HOST}:${PORT}/download/${fileName}`
      };
    }

    req.body.userId = req.userId;
    req.body.messageId = messages.length ? messages.at(-1).messageId + 1 : 1;
    req.body.time = Date.now();

    messages.push(req.body);
    write('messages', messages);

    req.body.user = users.find(user => user.userId == req.userId);
    delete req.body.user.password;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201).json({
      status: 201,
      message: 'ok',
      data: req.body
    });

  } catch (e) {
    return next(new InternalServerError(500, e.message));
  }
}

export default {
  GET,
  SEND
}
