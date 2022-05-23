import Sequelize from 'sequelize';
import configFile from '../config/config.js';
import initModels from './out/init-models.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default initModels(sequelize);