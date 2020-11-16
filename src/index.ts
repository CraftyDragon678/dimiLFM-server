import mongoose from 'mongoose';
import app from './app';
import { mongodb as mongoConf, webPort } from '../config.json';

mongoose.connect(
  'mongodb://'
    + `${mongoConf.name}:${encodeURIComponent(mongoConf.password)}`
    + `@${mongoConf.host}:${mongoConf.port}`
    + `/${mongoConf.db}?authSource=${mongoConf.authSource}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.listen(webPort, () => { console.log('WEB: READY'); });
