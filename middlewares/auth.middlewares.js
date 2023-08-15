function isLoggedIn(req, res, next) {
  //si el usuario no está loggeado
  if (req.session.user === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
}

function isAdmin(req, res, next) {
  //si el usuario es admin
  if (req.session.user.rol === "admin") {
    res.locals.isUserAdmin = true;
  } else {
    res.locals.isUserAdmin = false;
  }
  next()
}

function updateLocals(req, res, next) {
  if (req.session.user === undefined) {
    res.locals.isUserActive = false;
  } else {
    res.locals.isUserActive = true;
  }

  next()
}

module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
  isAdmin: isAdmin
};
