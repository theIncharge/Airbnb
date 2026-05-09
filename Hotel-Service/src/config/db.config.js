import dotenv from 'dotenv'

dotenv.config()

const config={
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT
  }
  
}

export default config

// import dotenv from 'dotenv';
// dotenv.config();

// // Use an object, not "export default"
// const config = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: '127.0.0.1', // Change localhost to 127.0.0.1 for Docker stability
//     dialect: "mysql",
//     port: process.env.DB_PORT || 3307
//   }
// };

// export default config;