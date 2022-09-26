const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator/check");
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8307275f0940d3",
    pass: "5509dfb040eb4c",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login Page",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          pageTitle: "Login Page",
          path: "/login",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            pageTitle: "Login Page",
            path: "/login",
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getRegister = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", {
    pageTitle: "Register Page",
    path: "/register",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      pageTitle: "Register Page",
      path: "/register",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  return bcrypt
    .hash(password, 12)
    .then((password) => {
      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transport.sendMail({
        to: email,
        from: "ezmemmed@yahoo.com",
        subject: "Signed up!",
        html: "<h1>Signed up successfully</h1>",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User not found!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        user.save();
      })
      .then((result) => {
        res.redirect("/login");
        transport.sendMail({
          to: req.body.email,
          from: "ezmemmed@yahoo.com",
          subject: "Reset Password!",
          html: `
            <p>Click this <a href="${fullUrl}/${token}">link</a> to set a new password!</p>
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPasswrod = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-passwrod",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const resetToken = req.body.resetToken;
  const userId = req.body.userId;
  let user;
  User.findOne({
    resetToken: resetToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
