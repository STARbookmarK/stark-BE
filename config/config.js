import dotenv from 'dotenv';
dotenv.config();

export default {
  "development": {
    "username": "root",
    "password": "root",
    "database": "stark",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "stark",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
  }
}