// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// aqui puedo registrar los helpers
hbs.registerHelper('usuarioCreador', function (usuarioA, usuarioB, options) {
    if (usuarioA.toString() !== usuarioB.toString()) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})

// aqui puedo registrar los helpers
hbs.registerHelper('usuarioLogeado', function (usuarioA, usuarioB, options) {
    if (usuarioA.toString() === usuarioB.toString()) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})



// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "mi-portal";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
