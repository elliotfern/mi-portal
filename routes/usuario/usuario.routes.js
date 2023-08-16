// require
const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");
const Solicitud = require("../../models/Solicitud.model.js");

const { isLoggedIn } = require("../../middlewares/auth.middlewares.js");

const uploader = require("../../middlewares/cloudinary.middlewares.js");

// rutas
// GET "/usuario/perfil/:usuarioId" => renderizar la vista del usuario
router.get("/perfil", isLoggedIn, async (req, res, next) => {
  // hay que sacar el id de usuario desde la sesion abierta
  console.log(req.session.user);
  const usuarioId = req.session.user._id;
  try {
    const respuesta = await Usuario.findById(usuarioId);
    res.render("./usuario/perfil-usuario.hbs", {
      usuarioDetalles: respuesta,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/usuario/subir-imagen-perfil" => esta ruta sirve para transmitir a la base de datos y cloudinary la imagen de perfil
router.post(
  "/subir-imagen-perfil",
  uploader.single("imagen"),
  async (req, res, next) => {
    console.log("fichero de la imagen de perfil", req.file);

    try {
      await Usuario.findByIdAndUpdate(req.session.user._id, {
        imagen: req.file.path,
      });
      res.redirect("/usuario/perfil");
    } catch (error) {
      next(error);
    }
  }
);

//GET "usuario/perfil/:usuarioId/edit" => renderizar la vista de la página de edición del perfil de usuario
router.get("/perfil/:usuarioId/edit", isLoggedIn, async (req, res, next) => {
  console.log("info de usuario", req.params.usuarioId);
  try {
    const datosUsuario = await Usuario.findById(req.params.usuarioId);
    res.render("./usuario/editar-perfil.hbs", { datosUsuario });
  } catch (error) {
    next(error);
  }
});

// POST "usuario/perfil/:usuarioId/edit"
router.post("/perfil/:usuarioId/edit", isLoggedIn, async (req, res, next) => {
  const usuarioId = req.params.usuarioId;
  const { nombreCompleto, correo } = req.body;

  try {
    await Usuario.findByIdAndUpdate(usuarioId, {
      nombreCompleto: nombreCompleto,
      correo: correo,
    });
    res.redirect(`/usuario/perfil/`);
  } catch (error) {
    next(error);
  }
});

//GET usuario/catalogo catálogo que mostrará todos los perfiles de usuarios
router.get("/catalogo", isLoggedIn, async (req, res, next) => {
  try {
    const todosUsuarios = await Usuario.find();
    res.render("./usuario/catalogo.hbs", { todosUsuarios });
  } catch (error) {
    next(error);
  }
});

//GET usuario/:usuarioId/detalles esto accede al perfil de cada usuario
router.get("/:usuarioId/detalles", isLoggedIn, async (req, res, next) => {
  try {
    const usuarioObj = await Usuario.findById(req.params.usuarioId);
    res.render("usuario/detalles-usuario.hbs", { usuarioObj });
    console.log(usuarioObj);
  } catch (error) {
    next(error);
  }
});

//POST va a recibir la orden del formulario que añade a dicho vecino a "mis favoritos"
router.post("/:usuarioId/detalles", isLoggedIn, async (req, res, next) => {
  const usuarioFav = req.body._id;
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.session.user._id,
      { $push: { favoritos: usuarioFav } }
    );
    // console.log(usuarioActualizado)
    res.redirect(`/usuario/${req.session.user._id}/detalles`);
  } catch (error) {
    next(error);
  }
});

//GET "usuario/:usuarioId/interacciones" => esto renderiza una vista con los usuarios favoritos y comentarios de cada usuario
router.get("/:usuarioId/interacciones", isLoggedIn, async (req, res, next) => {
  const usuarioId = req.params.usuarioId;

  try {
    const usuariosFavoritos = await Usuario.findById(usuarioId)
      .select({ favoritos: 1 })
      .populate("favoritos");
    console.log("usuarios favoritos", usuariosFavoritos);
    res.render("usuario/perfil-interacciones.hbs", {
      dataUsuarios: usuariosFavoritos,
    });
  } catch (error) {
    next(error);
  }
});

//GET "usuario/perfil/mis-prestadas" => esto renderiza una vista con todas las solicitudes activas en curso en las que el usuario está implicado
router.get(
  "/perfil/mis-solicitudes-prestadas",
  isLoggedIn,
  async (req, res, next) => {
    //1 Buscar todas las solicitudes con el estado "en progreso"
    try {
      const usuarioPrestId = req.session.user._id;
      const solEnProg = await Solicitud.find({
        $and: [{ estado: "en progreso" }, { usuarioPrestante: usuarioPrestId }],
      })
        .populate("usuarioPrestante") //{ $or: [ property: value }, { property: value } ] }
        .populate("usuarioCreador");
      console.log("muestrame todas las solicitudes prestadas", solEnProg);
      res.render("./usuario/sols-prestadas.hbs", { solEnProg });
    } catch (error) {
      next(error);
    }
  }
);

//POST "usuario/perfil/mis-prestadas" => recibe la orden del form y elimina la solicitud
router.post("/perfil/mis-solicitudes-prestadas", isLoggedIn, async (req, res, next) => {
  try {
    await Solicitud.findByIdAndDelete(req.body._id)
    res.redirect("/usuario/perfil/mis-solicitudes-prestadas")
  } catch (error) {
    next(error)
  }
})

//POST "usuario/perfil/mis-prestadas/completadas" => recibe la orden del form y lleva la solicitud al catálogo de solicitudes completadas PRIVADAS
router.post("/perfil/mis-solicitudes-prestadas/completadas", isLoggedIn, async (req, res, next) => {
  try {
    await Solicitud.findByIdAndUpdate(req.body._id, { estado: "completado" })
    res.redirect("/solicitud/catalogo/completadas")
  } catch (error) {
    next(error)
  }
})

//POST "usuario/perfil/mis-prestadas/mensajeria" => recibe la orden del form y nos redirige a la url de la conversación
router.post("/perfil/mis-solicitudes-prestadas/conversacion", isLoggedIn, async (req, res, next) => {
  const { idSolicitud, idUsuarioCreador, idUsuarioPrestante } = req.body
  res.redirect(`/mensajeria/${idSolicitud}/${idUsuarioCreador}/${idUsuarioPrestante}`)
})

// GET "usuario/perfil/mis-solicitudes-creadas"
router.get("/perfil/mis-solicitudes-creadas", isLoggedIn, async (req, res, next) => {
  try {
    const usuarioCreadorId = req.session.user._id;
    const solUsuarioCreador = await Solicitud.find({
      $and: [{ estado: "en progreso" }, { usuarioCreador: usuarioCreadorId }],
    })
      .populate("usuarioPrestante") //{ $or: [ property: value }, { property: value } ] }
      .populate("usuarioCreador");

    console.log("muestrame todas las solicitudes del creador", solUsuarioCreador);
    res.render("./usuario/sols-creadas.hbs", { solUsuarioCreador });
  } catch (error) {
    next(error)
  }
})

//GET "usuario/perfil/historial-solicitudes-prestante-completadas" => esto renderiza una vista con todas las solicitudes completadas en las que el usuario está implicado
router.get("/perfil/historial-solicitudes-prestante-completadas", isLoggedIn, async (req, res, next) => {
  try {
    const usuarioPrestId = req.session.user._id;
    const solCompletadas = await Solicitud.find({
      $and: [{ estado: "completado" }, { usuarioPrestante: usuarioPrestId }],
    })
      .populate("usuarioPrestante")
      .populate("usuarioCreador");
    res.render("./usuario/historial-prestantes-completadas.hbs", { solCompletadas });
  } catch (error) {
    next(error);
  }
}
);

//GET "usuario/perfil/historial-solicitudes-creadas-completadas" => esto renderiza una vista con el historial de solicitudes creadas completadas
router.get("/perfil/historial-solicitudes-creadas-completadas", isLoggedIn, async (req, res, next) => {
  try {
    const todasSolCompletadas = await Solicitud.find({
      $and: [{ estado: "completado" }, { usuarioCreador: req.session.user._id }],
    })
      .populate("usuarioPrestante")
      .populate("usuarioCreador")
    console.log("todas las solicitudes completadas segun el usuario creador id session:", todasSolCompletadas)
    res.render("./usuario/historial-creadas-completadas.hbs", { todasSolCompletadas })
  } catch (error) {
    next(error)
  }
})

// POST "/usuario/perfil/mis-solicitudes-prestadas/mensajes" => esto recibe la informacion del boton "abrir conversa" y redirige a otra pagina
router.post("/perfil/mis-solicitudes-prestadas/mensajes", isLoggedIn, (req, res, next) => {
  const { idSolicitud } = req.body
  res.redirect(`/mensajeria/conversacion/${idSolicitud}/`)
})

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
