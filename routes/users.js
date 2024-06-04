const bcrypt = require('bcrypt');
const {connect} = require ('../connect')
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
} = require('../controller/users');
const users = require('../controller/users');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const db = connect();//Revisar debe ir connect

  try {
    // Verificar si ya existe un usuario administrador
    const existingAdminUser = await connect(users).findOne({ email: adminEmail });
    // await db.collection('users').findOne({ email: adminEmail })
    if (existingAdminUser) {
      console.log('El usuario administrador ya existe en la base de datos.');
      return next();
    }

    // Si no existe, crear un nuevo usuario administrador
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    const adminUser = {
      email: adminEmail,
      password: hashedPassword,
      roles: "admin",
    };

    // Insertar el nuevo usuario administrador en la base de datos
    await db.collection('users').insertOne(adminUser);

    console.log('Usuario administrador creado con éxito.');

    next();
  } catch (error) {
    console.error('Error al inicializar el usuario administrador:', error.message);
    next(error);
  }
};

module.exports = initAdminUser;


/*
 * Español:
 *
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */



  module.exports = (app, next) => {

  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, (req, resp) => {
  });

  app.post('/users', requireAdmin, (req, resp, next) => {
    // TODO: Implement the route to add new users
  });

  app.put('/users/:uid', requireAuth, (req, resp, next) => {
  });

  app.delete('/users/:uid', requireAuth, (req, resp, next) => {
  });

  initAdminUser(app, next);
};
