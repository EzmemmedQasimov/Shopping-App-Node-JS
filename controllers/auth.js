const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    isAuthenticated: req.session.user,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("632069488c1bf6ff86f7a2ac")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};
