const express = require('express');
const router = express.Router();
const { getUsers } = require('../controller/users');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/users', requireAdmin, getUsers);

module.exports = router;
