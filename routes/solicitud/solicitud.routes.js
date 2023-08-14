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
  const usuarioCreador = req.session.user._id;
  console.log(usuarioCreador);
  res.render("./solicitud/crear-solicitud.hbs", { usuarioCreador });
});

// POST "/solicitud/crear"
router.post("/crear", isLoggedIn, async (req, res, next) => {
  const { titulo, descripcion, categoria, fechaServicio, usuarioCreador } =
    req.body;
  console.log("solicitud creada: ", req.body);
  try {
    const respuesta = await Solicitud.create({
      titulo,
      descripcion,
      categoria,
      fechaServicio,
      usuarioCreador,
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
    const solicitudOb = await Solicitud.findById(
      req.params.solicitudId
    ).populate("usuarioCreador");
    console.log("objeto", solicitudOb);

    res.render("./solicitud/detalles-solicitud.hbs", { solicitudOb });
  } catch (error) {
    next(error);
  }
});

//POST => subir la imagen
router.post(
  "/subir-imagen-solicitud",
  uploader.single("imagenSolicitud"),
  async (req, res, next) => {
    console.log("fichero de la imagen de perfil", req.file);
    console.log("id de la solicitud", req.body._id);

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

// GET "/solicitud/:solicitudId/editar" => renderiza el formulario de edición de una solicitud
router.get("/:solicitudId/editar", isLoggedIn, async (req, res, next) => {
  const solicitudId = req.params.solicitudId;
  console.log("solicitud id", solicitudId);

  try {
    const detallesSolicitud = await Solicitud.findById(solicitudId);

    const categorias = [
      { name: "bricolaje", isSelected: false },
      { name: "cuidados", isSelected: false },
      { name: "mascotas", isSelected: false },
      { name: "transporte", isSelected: false },
      { name: "alimentación", isSelected: false },
      { name: "otros", isSelected: false },
    ];
    const cloneCategorias = JSON.parse(JSON.stringify(categorias));

    cloneCategorias.forEach((eachCategoria) => {
      if (
        detallesSolicitud.categoria.toString() === eachCategoria.name.toString()
      ) {
        eachCategoria.isSelected = true;
        console.log("la categoria seleccionada es: ", eachCategoria);
      }
    });

    console.log("detalles solicitud", detallesSolicitud);

    console.log("categoria: ", cloneCategorias);
    res.render("./solicitud/editar-solicitud.hbs", {
      detallesSolicitud: detallesSolicitud,
      categoriaSeleccionada: cloneCategorias,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/solicitud/:solicitudId/editar" => procesa el formulario en la base de datos y actualiza la solicitud
router.post("/:solicitudId/editar", async (req, res, next) => {
  const { titulo, descripcion, categoria, fechaServicio } = req.body;
  const solicitudId = req.params.solicitudId;
  try {
    const respuesta = await Solicitud.findByIdAndUpdate(solicitudId, {
      titulo: titulo,
      descripcion: descripcion,
      categoria: categoria,
      fechaServicio: fechaServicio,
    });
    res.redirect(`/solicitud/${solicitudId}`);
  } catch (error) {
    next(error);
  }
});

// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;
