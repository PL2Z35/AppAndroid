const { Router } = require('express');
const { changePasswordProfile, profile, signup, signin, forgotPassword, forgotPasswordChange, index, signupView, logout, changePassword } = require('../controllers/login')
const router = Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/', index)

router.post('/signup', signup);

router.get('/signup', signupView);

router.post('/signin', signin);

router.get('/profile', isLoggedIn, profile);

router.get('/logout', isLoggedIn, logout);

router.get('/forgot/password', (req, res, next) => {
    res.render("pages/forgot")
})

router.post('/forgot/password/:username', forgotPassword);

router.get('/forgot/password/:link', forgotPasswordChange);

router.get('/change/password/:username', isLoggedIn, changePasswordProfile);

module.exports = router;