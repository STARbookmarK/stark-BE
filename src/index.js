import app from './app.js';
import config from './config/config.js';

// create server
app.listen(config.port, () => {
  console.log(config.port + ' 빈 포트에서 대기 중');
});