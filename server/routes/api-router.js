const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/api-controller");
const auth = require("../auth")

router.get("/:url/details", ApiController.getRoom);
router.get("/:url/queue", ApiController.getQueue);
router.get("/:url/search", ApiController.search);
router.post("/:url/add", ApiController.addToQueue);

router.get("/myLibrary", auth.verify, ApiController.getLibrary);
router.get("/myPlaylist/:id", auth.verify, ApiController.getPlaylist);

module.exports = router;
