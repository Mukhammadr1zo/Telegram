import express from 'express';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import checkToken from './middlewares/checkToken.js';

import filesRouter from './routes/files.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';

const PORT = process.env.PORT || 3001;
const app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type', 'token'
  ],
};

app.use(express.json(), cors(corsOpts), fileUpload({limits: {fileSize: 50 * 1024 * 1024}}), express.static('public'), checkToken);
app.use(usersRouter, messagesRouter, filesRouter)

app.get('/test', (_, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 200,
    message: 'ok'
  })
});

app.get('/login', (req, res) => {
  res.status(200).end(fs.readFileSync(path.join(process.cwd(), 'public', 'login.html')));
});

app.get('/', (req, res) => {
  res.status(200).end(fs.readFileSync(path.join(process.cwd(), 'public', 'index.html')));
})

app.get('/register', (req, res) => {
  res.status(200).end(fs.readFileSync(path.join(process.cwd(), 'public', 'register.html')));
})

app.use((error, req, res, _) => {
  console.log(error);

  res.setHeader('Access-Control-Allow-Origin', '*')
  if (error.status != 500) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(error.status).json({
      status: error.status,
      message: error.message
    })
  }

  fs.appendFileSync(path.join(process.cwd(), 'src', 'log.txt'),
  `${req.url} ||| ${error.name} ||| ${new Date()} ||| ${error.status} ||| ${error.message}\n`)


  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(error.status).json({
    status: error.status,
    message: 'InternalServerError'
  });

  process.exit();
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
