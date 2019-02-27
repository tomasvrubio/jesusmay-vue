module.exports = {
  port: process.env.PORT || 8081,
  mongo: {
    user: process.env.DB_USER || 'jesusmay',
    password: process.env.DB_PASS || 'jesusmay',
    connectionString: process.env.DB_CSTRING ||'mongodb://localhost:27017/JESUSMAYDB'
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
