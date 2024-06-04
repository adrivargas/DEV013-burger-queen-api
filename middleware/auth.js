const jwt = require('jsonwebtoken');
const { connect } = require('../connect');  // Conexión a la base de datos

module.exports = (secret) => async (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // Verificar la identidad del usuario usando `decodedToken.uid`
    const db = await connect();
    const user = await db.collection('users').findOne({ _id: decodedToken.uid });

    if (!user) {
      return next(403);
    }

    req.user = user;
    next();
  });
};

module.exports.isAuthenticated = (req) => (
  // Decidir basado en la información de la solicitud si el usuario está autenticado
  !!req.user
);

module.exports.isAdmin = (req) => (
  // Decidir basado en la información de la solicitud si el usuario es admin
  req.user && req.user.roles === 'admin'
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
