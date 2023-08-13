const express = require("express");
const router = express.Router();
const Usuario = require("../../models/Usuario.model.js");
const bcrypt = require("bcryptjs");

//GET "/auth/registro" => renderizar el formulario de registro
router.get("/registro", (req, res, next) => {
  res.render("./auth/registro.hbs");
});

//POST "/auth/registro" => Recibe la info del formulario y redirige a login
router.post("/registro", async (req, res, next) => {
  console.log(req.body);

  const { correo, password, nombreCompleto } = req.body;

  //esto es para que los campos deban ser rellenados
  if (correo === "" || password === "" || nombreCompleto === "") {
    res.status(400).render("./auth/registro.hbs", {
      errorMessage: "Todos los campos deben estar completos",
    });
    return; //detén la ruta
  }

  // validación para que el password tenga x condiciones

  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).render("./auth/registro.hbs", {
      errorMessage:
        "La contraseña debe tener, al menos, una mayúscula, una minúscula, un caracter especial y, al menos, una longitud de 8 caracteres",
    });
    return;
  }
  //encontrar usuario con credenciales iguales entre BD y form
  try {
    const foundUser = await Usuario.findOne({ correo: correo });
    console.log("coincidencia encontrada", foundUser);

    if (foundUser !== null) {
      res.status(400).render("./auth/registro.hbs", {
        errorMessage: "Ya existe un usuario con las mismas credenciales",
      });
      return;
    }
    //encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    await Usuario.create({
      correo: correo,
      password: passwordHash,
      nombreCompleto: nombreCompleto,
    });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

//GET "/auth/login" => renderizar el formulario de acceso a la sesión
router.get("/login", (req, res, next) => {
  res.render("./auth/login.hbs");
});

//POST "/auth/login" => recibir datos del formulario y abrir sesión"
router.post("/login", async (req, res, next) => {
  console.log(req.body);
  const { correo, password } = req.body;

  try {
    //validación para la coincidencia del mail entre form y BD
    const foundUser = await Usuario.findOne({ correo: correo });
    console.log("coincidencia en el mail", foundUser);

    if (foundUser === null) {
      res.status(400).render("./auth/login", {
        errorMessage: "No existe un usuario con ese email",
      });
      return;
    }
    //para validar si el password coincide entre BD y form
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    console.log(isPasswordCorrect);

    if (isPasswordCorrect === false) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Contraseña no válida",
      });

      return;
    }

    //crear una sesión activa del usuario

    req.session.user = {
      _id: foundUser._id,
      correo: foundUser.correo,
      rol: foundUser.rol,
    };
    //guardamos en la sesión ifo del usuario que no debe cambiar

    req.session.save(() => {
      res.redirect("/usuario/perfil");
      //! YA TENEMOS ACCESO A REQ.SESSION.USER EN CUALQUIER LADO DE MI SERVIDOR
    });
  } catch (error) {
    next(error);
  }
});

//GET "/usuario/logout" => crear ruta para la desconexión de la sesión
router.get("/logout", (req, res, next) => {

  // 1 cerrar de la sesión
  req.session.destroy(() => {
    res.locals.isUserActive = false;
    res.render("./auth/logout.hbs")
  })
 
})

module.exports = router;
