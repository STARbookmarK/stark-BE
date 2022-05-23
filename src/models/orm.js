import SequelizeAuto from 'sequelize-auto';
import configFile from '../config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const auto = new SequelizeAuto(config.database, config.username, config.password, {
  host: config.host,
  port: '3306',
  directory: './src/models/out',
  dialect: config.dialect,
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