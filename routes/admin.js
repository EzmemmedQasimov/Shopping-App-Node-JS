const { body } = require("express-validator/check");
const path = require("path");

const express = require("express");

const isAuth = require("../middleware/isAuth");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isAlphanumeric().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isAlphanumeric().isLength({ max: 100 }),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isAlphanumeric().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isAlphanumeric().isLength({ max: 100 }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
