import app from './app.js';

// create server
app.listen(app.get('port'), () => {
  console.log(app.get('port') + ' 빈 포트에서 대기 중');
});