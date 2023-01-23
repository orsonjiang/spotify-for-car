const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/api-controller");

router.get("/:url/queue", ApiController.getQueue);

module.exports = router;
