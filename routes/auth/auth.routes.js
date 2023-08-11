const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario.model.js')


//GET "/auth/registro" => renderizar el formulario de registro
router.get("/registro", (req, res, next) => {
    res.render("./auth/registro.hbs")
})

//POST "/auth/registro" => Recibe la info del formulario y redirige a login
router.post("/registro", async (req, res, next) => {
    console.log(req.body)
    try {
        const {usuario, correo, password} = req.body;
        await Usuario.create({usuario, correo, password})
        res.redirect("/login")
    } catch (error) {
        next(error)
    }


})



module.exports = router;