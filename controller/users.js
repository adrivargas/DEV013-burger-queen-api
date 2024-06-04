const express = require('express');
const router = express.Router();
const usersController = require('../controller/users');

// Ruta para obtener todos los usuarios
router.get('/', usersController.getUsers);

module.exports = router;

