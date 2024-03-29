// require
const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");
const Solicitud = require("../../models/Solicitud.model.js");
const moment = require("moment"); // require

const { isLoggedIn, isAdmin } = require("../../middlewares/auth.middlewares.js");

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
    res.redirect(`/solicitud/${respuesta._id}/detalles`);
  } catch (error) {
    next(error);
  }
});

// GET para renderizar detalles de una solicitud creada por ID
router.get("/:solicitudId/detalles", isLoggedIn, async (req, res, next) => {
  try {
    const usuarioLogeado = req.session.user._id
    const solicitudOb = await Solicitud.findById(
      req.params.solicitudId
    ).populate("usuarioCreador")
    console.log("objeto", solicitudOb);
    const dateFormat = moment(solicitudOb.fechaServicio).format("DD-MM-YYYY");

    res.render("solicitud/detalles-solicitud.hbs", { solicitudOb, dateFormat, usuarioLogeado });
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
      res.redirect(`/solicitud/${req.body._id}/detalles`);
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
    const dateFormat = moment(detallesSolicitud.fechaServicio).format(
      "YYYY-MM-DD"
    );
    console.log("data", dateFormat);

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
      fechaFormat: dateFormat,
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
    res.redirect(`/solicitud/${solicitudId}/detalles`);
  } catch (error) {
    next(error);
  }
});

//GET "/solicitud/catalogo/completadas" => vista para mostrar el historial de solicitudes completadas
router.get("/catalogo/completadas", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const solicitudesCompletadas = await Solicitud.find({
      estado: "completado",
    })
      .populate("usuarioCreador")
      .populate("usuarioPrestante")
    res.render("solicitud/catalogo-completadas.hbs", {
      solicitudesCompletadas,
    });
  } catch (error) {
    next(error);
  }
});

//GET "/solicitud/catalogo/:categoria" => renderiza una vista con todas las solicitudes pendientes
router.get("/catalogo/pendientes/:categoria", isLoggedIn, isAdmin, async (req, res, next) => {
  console.log("usuario", req.session.user)
  const categoriaEscogida = req.params.categoria;

  const categorias = [
    { name: "bricolaje", isSelected: false },
    { name: "cuidados", isSelected: false },
    { name: "mascotas", isSelected: false },
    { name: "transporte", isSelected: false },
    { name: "alimentacion", isSelected: false },
    { name: "otros", isSelected: false },
  ];

  try {

    if (categoriaEscogida === "todas") {
      const todasSolPend = await Solicitud.find({ estado: "pendiente" })
        .populate("usuarioCreador")

      const cloneSolicitudes = JSON.parse(JSON.stringify(categorias));

      res.render("solicitud/catalogo.hbs", { respuesta: todasSolPend, isLoggin: req.session.user._id, categoriaSeleccionada: cloneSolicitudes, });
    } else {
      const todasSolPend = await Solicitud.find({ estado: "pendiente", categoria: categoriaEscogida })
        .populate("usuarioCreador")
      console.log(categoriaEscogida)

      const cloneSolicitudes = JSON.parse(JSON.stringify(categorias));

      cloneSolicitudes.forEach((eachCategoria) => {
        if (
          categoriaEscogida.toString() === eachCategoria.name.toString()
        ) {
          eachCategoria.isSelected = true;
          console.log("la categoria seleccionada es: ", eachCategoria);
        }
      });

      res.render("solicitud/catalogo.hbs", { respuesta: todasSolPend, isLoggin: req.session.user._id, categoriaSeleccionada: cloneSolicitudes, });
    }

  } catch (error) {
    next(error);
  }
});

//POST "/solicitud/catalogo/:categoria" => esta ruta post procesa el boton de filtrado de la categoria segun lo que quiere el usuario
router.post("/catalogo/filtro", isLoggedIn, (req, res, next) => {
  const categoria = req.body.categoria;
  res.redirect(`/solicitud/catalogo/pendientes/${categoria}`);
})

// POST "/solicitud/:solicitudId/catalogo" => boton que al clicar cambia el estado de una solicitud de pendiente a en progreso
router.post("/:solicitudId/catalogo/", isLoggedIn, async (req, res, next) => {
  const solicitudId = req.params.solicitudId;
  const usuarioLogeado = req.session.user._id;

  try {
    await Solicitud.findByIdAndUpdate(solicitudId, {
      estado: "en progreso",
      usuarioPrestante: usuarioLogeado,
    });
    res.redirect("/solicitud/catalogo/pendientes/todas");
  } catch (error) {
    next(error);
  }
});

// POST "/solicitud/:solicitudId/catalogo" => boton que al clicar cambia el estado de una solicitud en progresa a completada
router.post("/:solicitudId/catalogo/completada", isLoggedIn, async (req, res, next) => {
  const solicitudId = req.params.solicitudId;

  try {
    await Solicitud.findByIdAndUpdate(solicitudId, {
      estado: "completado",
    });
    res.redirect("/usuario/perfil");
  } catch (error) {
    next(error);
  }
});


// exporta el fichero para poder connectar con él desde cualquier archivo
module.exports = router;


