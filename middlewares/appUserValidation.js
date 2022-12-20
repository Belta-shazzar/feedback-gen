const { check, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

exports.validateUser = [
  check("fullName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("User name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("email")
    .isEmail()
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .isLength(8)
    .withMessage("Password must be at least 8 characters long!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: errors.array() });
    }
    next();
  },
];
