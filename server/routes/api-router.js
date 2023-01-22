const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/api-controller");

router.get("/login", AuthController.login);
router.get("/callback", AuthController.callback);

module.exports = router;
