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
  res.render("./solicitud/crear-solicitud.hbs");
});

// POST "/solicitud/crear"
router.post("/crear", isLoggedIn, async (req, res, next) => {
  const { titulo, descripcion, categoria, fechaServicio } = req.body;
  console.log("solicitud creada: ", req.body);
  try {
    const respuesta = await Solicitud.create({
      titulo,
      descripcion,
      categoria,
      fechaServicio,
    });
    console.log(respuesta);
    res.redirect(`/solicitud/${respuesta._id}/`);
  } catch (error) {
    next(error);
  }
});

router.get("/:solicitudId", isLoggedIn, async (req, res, next) => {
  res.render("./solicitud/detalles-solicitud.hbs");
});

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
