const {config} = require('./config')
const mysql = require('mysql2/promise')

export const connect = async () => {
    return await mysql.createConnection(config);
}
