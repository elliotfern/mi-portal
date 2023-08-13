// require
const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");

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

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
