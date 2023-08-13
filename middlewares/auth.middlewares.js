function isLoggedIn(req, res, next) {
  //si el usuario no está loggeado
  if (req.session.user === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
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
  updateLocals: updateLocals
};
