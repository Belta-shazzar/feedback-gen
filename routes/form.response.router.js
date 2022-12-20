const express = require("express")
const { addAResponse } = require("../controller/form.response.controller")

const router = express.Router()

router.post("/", addAResponse);

module.exports = router;