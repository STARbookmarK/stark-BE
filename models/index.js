import Sequelize from 'sequelize';
import configFile from '../config/config.js';
import User from './user.js';
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};
const sequelize = new Sequelize(config.database, config.usernae, config.password, config);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);
User.associate(db);

export default db;