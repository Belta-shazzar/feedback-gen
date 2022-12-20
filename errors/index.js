const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found")
const UnauthorizedError = require("./unauthorizedError")

module.exports = {
  CustomAPIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError
};
