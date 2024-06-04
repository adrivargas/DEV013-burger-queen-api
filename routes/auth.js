const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { connect } = require('../connect');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).send('Email and password are required.');
    }

    try {
      const db = await connect();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return resp.status(401).send('Invalid email or password.');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return resp.status(401).send('Invalid email or password.');
      }

      const token = jwt.sign(
        { uid: user._id, email: user.email, roles: user.roles },
        secret,
        { expiresIn: '1h' }
      );

      return resp.status(200).send({ token });
    } catch (error) {
      console.error('Error during login:', error.message);
      return next(error);
    }
  });

  return nextMain();
};
