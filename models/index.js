import Sequelize from 'sequelize';
import configFile from '../config/config.js';
import initModels from './init-models.js';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default initModels(sequelize);