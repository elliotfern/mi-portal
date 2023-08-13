// require
const express = require("express");
const router = express.Router();

const Usuario = require("../../models/Usuario.model.js");

const uploader = require("../../middlewares/cloudinary.middlewares.js");

// rutas
// GET "/usuario/perfil/:usuarioId" => renderizar la vista del usuario
router.get("/perfil", async (req, res, next) => {
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

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
