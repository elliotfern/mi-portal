const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// establecer prefijo de rutas de autentificación
const authRouter = require("./auth/auth.routes.js")
router.use("/auth", authRouter)

module.exports = router;
