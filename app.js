const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");
const MONGO_URI =
  "mongodb+srv://azmammad:ylqqNP7wRWq29Tuq@cluster0.6rwjomi.mongodb.net/shop";

const app = express();

const store = new MongoDbStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const csrfProtection = csrf();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "/500",
  });
});

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Əzməmməd",
          email: "ezmemmed@yahoo.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    console.log("connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
