import SequelizeAuto from 'sequelize-auto';
import config from '../config/config.js';

const env = config.env || 'development';
const mysql = config.mysql[env];
const auto = new SequelizeAuto(mysql.database, mysql.username, mysql.password, {
  host: mysql.host,
  port: '3306',
  directory: './src/models/out',
  dialect: mysql.dialect,
  lang: 'esm',
  additional: {
    timestamps: false,
    underscored: false,
    paranoid: false, // timestamps 가 true 일 때 사용할 수 있기 때문에 false 일 경우 속성에 추가되지 않음.
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
})

auto.run((err) => {
  if(err) throw err;
})