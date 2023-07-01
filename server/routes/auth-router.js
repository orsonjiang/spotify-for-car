const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");
const auth = require("../auth")

router.get("/login", AuthController.login);
router.get("/callback", AuthController.callback);
router.get("/logout", AuthController.logout);
router.get("/profile", auth.verify, AuthController.profile);

router.get("/myLibrary", auth.verify, AuthController.getLibrary);
router.get("/myPlaylist/:id", auth.verify, AuthController.getPlaylist);

module.exports = router;
