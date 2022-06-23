const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const pool = require('../database/database')

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'username',
    passReqToCallback: true
}, async (req, password, username, done) => {
    const { name, mail } = req.body;
    let newUser = {
        name,
        mail,
        username,
        password: username,
        failedSessions: 0
    };
    const res = await pool.query("SELECT * FROM user where username=?", username);
    if (res.length == 0) {
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO user SET ?', newUser);
        newUser.id = result.insertId;
        return done(null, newUser, req.flash('success', 'User saved successfully'));
    } else {
        return done(null, null, req.flash('message', 'Incorrect data'));
    }
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM user where username = ?', username);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword && parseInt(user.failedSessions) <= 2) {
            await pool.query("update user set failedSessions = 0 where username = '" + user.username + "'")
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else if (parseInt(user.failedSessions) <= 2) {
            await pool.query("update user set failedSessions = " + parseInt(user.failedSessions + 1) + " where username = '" + user.username + "'")
            done(null, false, req.flash('message', 'Incorrect data'));
        } else {
            done(null, false, req.flash('message', 'User Blocked'))
        }
    } else {
        done(null, false, req.flash('message', 'incorrect data'))
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    done(null, rows[0]);
});

