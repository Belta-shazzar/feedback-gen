const express = require("express");

const { JWTAuth } = require("../config/jwt.config");
const {
  createForm,
  getById,
  getMyForms,
  reviewMyForm,
  updateForm,
  deleteForm
} = require("../controller/form.controller");

const router = express.Router();

router.post("/createForm", JWTAuth, createForm);
router.get("/my_forms/", JWTAuth, getMyForms);
router.get("/review_form/:id", JWTAuth, reviewMyForm);
router.
route("/:id")
.get(getById)
.patch(JWTAuth, updateForm) //Not tested yet till after form validation is complete
.delete(JWTAuth, deleteForm)

module.exports = router;
