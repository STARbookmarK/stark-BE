import dotenv from 'dotenv';
dotenv.config();

export default {
  "development": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "starkDB",
    "host": "52.11.219.14",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "starkDB",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  }
}