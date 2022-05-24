import Sequelize from 'sequelize';
import config from '../config/config.js';
import initModels from './out/init-models.js';

const env = config.env || 'development';
const mysql = config.mysql[env];
const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql);

export default initModels(sequelize);