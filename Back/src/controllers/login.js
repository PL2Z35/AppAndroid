const { connect } = require('../database/database')

export const add = (req, res) => {

}

export const getUsers = async (req, res) => {
    const db = await connect();
    const [rows] = await db.query("select * from user");
    res.json(rows);
}

