import dotenv from 'dotenv';
dotenv.config();

export default {
  "env": process.env.NODE_ENV,
  "port": 8081,
  "mysql": {
    "development": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "starkDB",
      "host": "52.11.219.14",
      "dialect": "mysql",
      "logging": false
    },
    "production": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "starkDB",
      "host": "localhost",
      "dialect": "mysql",
      "logging": false
    }
  },
  "jwt": {
    "secret": process.env.JWT_SECRET,
    "expires": {
      "access": '1h',
      "refresh": '60d'
    }
  },
  "cookie": {
    "secret": process.env.COOKIE_SECRET,
    "option": {
      maxAge: 1000*60*60*24*60, // 60 day
      httpOnly: true
    }
  }
};