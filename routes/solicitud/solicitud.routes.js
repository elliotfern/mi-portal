// require
const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");
const Solicitud = require("../../models/Solicitud.model.js");

const { isLoggedIn } = require("../../middlewares/auth.middlewares.js");

const uploader = require("../../middlewares/cloudinary.middlewares.js");

// aqui van las rutas
// GET "/solicitud/crear" => esto renderiza la vista del formulario de crar solicitudes
router.get("/crear", isLoggedIn, (req, res, next) => {
  const usuarioCreador = req.session.user._id
  console.log(usuarioCreador)
  res.render("./solicitud/crear-solicitud.hbs", {usuarioCreador});
});

// POST "/solicitud/crear"
router.post("/crear", isLoggedIn, async (req, res, next) => {
  const { titulo, descripcion, categoria, fechaServicio, usuarioCreador } = req.body;
  console.log("solicitud creada: ", req.body);
  try {
    const respuesta = await Solicitud.create({
      titulo,
      descripcion,
      categoria,
      fechaServicio,
      usuarioCreador
    });
    console.log(respuesta);
    res.redirect(`/solicitud/${respuesta._id}/`);
  } catch (error) {
    next(error);
  }
});

// GET para renderizar la vista de la solicitud creada
router.get("/:solicitudId", isLoggedIn, async (req, res, next) => {
  try {
    const solicitudObjecto = await Solicitud.findById(req.params.solicitudId)
    .populate("usuarioCreador")
    console.log("objeto", solicitudObjecto)

   
    res.render("./solicitud/detalles-solicitud.hbs", {solicitudObjecto});
  } catch (error) {
    next(error)
  }
  
});

//POST => subir la imagen
router.post(
  "/subir-imagen-solicitud",
  uploader.single("imagenSolicitud"),
  async (req, res, next) => {
    console.log("fichero de la imagen de perfil", req.file);
    console.log("id de la solicitud", req.body._id)

    try {
      await Solicitud.findByIdAndUpdate(req.body._id, {
        imagenSolicitud: req.file.path,
      });
      res.redirect(`/solicitud/${req.body._id}`);
    } catch (error) {
      next(error);
    }
  }
);

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
