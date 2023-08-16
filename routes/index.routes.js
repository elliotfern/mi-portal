const express = require("express");
const router = express.Router();

// aqui ejecutamos la funcion que actualiza las variables locales en TODAS las llamadas
const { updateLocals } = require("../middlewares/auth.middlewares.js");
router.use(updateLocals);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// establecer prefijo de rutas de autentificación
const authRouter = require("./auth/auth.routes.js");
router.use("/auth", authRouter);

// establecer prefijo de rutas de usuario
const usuarioRouter = require("./usuario/usuario.routes.js");
router.use("/usuario", usuarioRouter);

// establecer prefijo de rutas de solicitud
const solicitudRouter = require("./solicitud/solicitud.routes.js");
router.use("/solicitud", solicitudRouter);

const mensajeriaRouter = require("./mensajeria/mensajeria.routes.js");
router.use("/mensajeria", mensajeriaRouter);

module.exports = router;
