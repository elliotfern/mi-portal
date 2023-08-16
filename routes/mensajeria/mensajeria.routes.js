const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");
const Solicitud = require("../../models/Solicitud.model.js");
const Mensajeria = require("../../models/Mensajeria.model.js");

const { isLoggedIn } = require("../../middlewares/auth.middlewares.js");

//GET `/mensajeria/${idSolicitud}/${idUsuarioCreador}/${idUsuarioPrestante}` => traer la id de solicitud, creador y prestante y renderizar una vista donde se va a establecer un diálogo
router.get("/:idSolicitud/:idUsuarioCreador/:idUsuarioPrestante", isLoggedIn, async (req, res, next) => {
try {
    const solicitudId = req.params.idSolicitud;
    const creadorId = req.params.idUsuarioCreador;
    const prestanteId = req.params.idUsuarioPrestante;
    console.log("ids", solicitudId, creadorId, prestanteId)
    res.render("mensajeria/mensajes.hbs", {solicitudId, creadorId, prestanteId})
    console.log(solicitudId)
    
} catch (error) {
    next(error)
}
})

//POST "/:idSolicitud/:idUsuarioCreador/:idUsuarioPrestante" => recibe el mensaje enviado por el formulario, lo renderiza en una nueva vista y lo envía a la BD
router.post("/crear-mensaje", isLoggedIn, async (req, res, next) => {
    console.log("mensaje", req.body.mensaje)
    console.log("solicitud ID", req.body.solicitudId)
    const mensajeInfo = await Mensajeria.create({mensaje: req.body.mensaje, usuarioCreador: req.body.idUsuarioCreador, usuarioPrestante: req.body.idUsuarioPrestante, nombreServicio: req.body.idSolicitud})
    res.redirect("/")
})



module.exports = router;