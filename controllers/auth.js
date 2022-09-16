const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
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

exports.getRegister = (req, res, next) => {
  res.render("auth/register", {
    pageTitle: "Register Page",
    path: "/register",
    isAuthenticated: req.session.user,
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/redirect");
      }
      return bcrypt.hash(password, 12).then((password) => {
        const user = new User({
          email: email,
          password: password,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      return res.redirect("login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};
