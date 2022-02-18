// db.js
const postgres = require('postgres')

const sql = postgres('postgres://wessel:password@127.0.0.1:5432/uni')

module.exports = sql