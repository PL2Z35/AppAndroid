const passport = require('passport');
const pool = require('../database/database');
const newMail = require("../controllers/mail");
const { v4: uuidv4 } = require('uuid');
const helpers = require('../lib/helpers');

const signup = passport.authenticate('local.signup', {
    successRedirect: "/profile",
    failureRedirect: "/",
});

const signin = async (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: "/profile",
        failureRedirect: "/",
    })(req, res, next);
}

const forgotPasswordChange = async (req, res, next) => {
    const resp = await pool.query("select * from link where link ='" + req.params.link + "'");
    if (resp.length != 0) {
        const link = resp[0];
        await pool.query("delete from link where username ='" + link.username + "'")
        res.render('pages/change', { link })
    } else {
        req.flash('message', 'link not found')
        res.redirect('/')
    }
}

const forgotPassword = async (req, res, next) => {
    if (req.params.username.length == 1) {
        const { username } = req.body;
        const resp = await pool.query("select * from user where username ='" + req.body.username + "'");
        if (!(username) || resp.length == 0) {
            req.flash("success", "Check your email for the link to change your password.")
        } else {
            const links = await pool.query("select username from link where username ='" + req.body.username + "'")
            if (links.length == 0) {
                const link = {
                    link: await uuidv4(),
                    username: req.body.username
                }
                await newMail.newMail(link.link, resp[0].mail);
                await pool.query('insert into link set ?', link)
                req.flash("success", "Check your email for the link to change your password...")
            } else {
                req.flash("success", "Check your email for the link to change your password..")
            }
        }
        res.redirect('/');
    } else {
        if ((req.body.password1 == req.body.password2) && checkPassword(req.body.password1)) {
            const newPass = await helpers.encryptPassword(req.body.password1);
            await pool.query("update user set password = '" + newPass + "' where username='" + req.params.username + "'");
            req.flash('success', 'modified password')
        } else {
            req.flash('message', 'Invalid password')
        }
        if (!(req.user === undefined)) {
            res.redirect('/profile')
        } else {
            res.redirect('/')
        }
    }
}


const index = async (req, res, next) => {
    res.render('pages/index')
}

const signupView = async (req, res, next) => {
    res.render('pages/register')
}

const profile = async (req, res, next) => {
    req.session.cookie.expires = 10000;
    const pass = await pool.query("select * from user where username = '" + req.user.username + "'");
    if (await helpers.matchPassword(pass[0].username, pass[0].password)) {
        const notPass = "notPass";
        res.render('pages/profile', { notPass })
    } else {
        res.render('pages/profile')
    }
}

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'logout')
        res.redirect('/');
    });
}

const changePasswordProfile = async (req, res, next) => {
    const resp = await pool.query("select * from user where username ='" + req.params.username + "'");
    if (resp.length != 0) {
        const link = resp[0];
        res.render('pages/change', { link })
    } else {
        res.redirect('/profile')
    }
}

function checkPassword(str) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    return re.test(str);
}

module.exports = { changePasswordProfile, profile, index, signin, signup, forgotPassword, forgotPasswordChange, signupView, logout }