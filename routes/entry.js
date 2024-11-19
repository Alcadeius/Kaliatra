const express = require("express");
const router = express.Router();
const { addentry, getallentry } = require("../controllers/entrycontroller");
router.post("/", addentry);
router.get("/", getallentry);

module.exports = router;
