const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  getspesifycategory,
} = require("../controllers/categorycontroller");

router.post("/", addCategory);
router.get("/", getAllCategories);
router.get("/:category", getspesifycategory);

module.exports = router;
