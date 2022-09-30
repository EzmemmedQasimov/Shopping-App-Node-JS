const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator/check");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Invalid email!").isEmail().normalizeEmail(),
    body("password", "Invalid password")
      // .isAlphanumeric()
      // .isLength({ min: 4 })
      // .trim(),
  ],
  authController.postLogin
);
router.get("/register", authController.getRegister);
router.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email already exist.");
        }
      })
      .normalizeEmail(),
    body("password", "Password should be 4 characters")
      .isAlphanumeric()
      .isLength({ min: 4 })
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match!");
        }
        return true;
      })
      .trim(),
  ],
  authController.postRegister
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPasswrod);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
