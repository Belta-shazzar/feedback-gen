const express = require("express");
const { validateUser } = require("../middlewares/appUserValidation");
const { userSignUp, signIn } = require("../controller/appUser.controller");
const router = express.Router();

router.post("/signUp", validateUser, userSignUp);
router.post("/signIn", signIn);

module.exports = router;
