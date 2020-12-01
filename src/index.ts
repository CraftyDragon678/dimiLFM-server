import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import app from './app';
import {
  mongodb as mongoConf, webPort, isHttps, cert, key,
} from '../config.json';
import io from './socket';

mongoose.connect(
  'mongodb://'
    + `${mongoConf.name}:${encodeURIComponent(mongoConf.password)}`
    + `@${mongoConf.host}:${mongoConf.port}`
    + `/${mongoConf.db}?authSource=${mongoConf.authSource}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  },
);

const server = isHttps
  ? (
    https.createServer({
      cert: fs.readFileSync(path.resolve(cert)),
      key: fs.readFileSync(path.resolve(key)),
    }, app).listen(webPort, () => {
      console.log('WEB: HTTPS READY');
    })
  )
  : (
    http.createServer(app).listen(webPort, () => {
      console.log('WEB: HTTP READY');
    })
  );

io.attach(server);
