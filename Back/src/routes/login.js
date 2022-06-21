const { Router } = require('express');
const { getUsers } = require('../controllers/login')
const router = Router();

router.get('/', getUsers);

module.exports = router;