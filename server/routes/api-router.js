const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/api-controller");
const auth = require("../auth")

router.get("/:url/queue", ApiController.getQueue);
router.get("/:url/search", ApiController.search);
router.post("/:url/add", ApiController.addToQueue);

module.exports = router;
