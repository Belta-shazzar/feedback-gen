const AppUser = require("../model/appUser");
const { createJWT } = require("../config/jwt.config");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const userSignUp = async (req, res) => {
  const user = await AppUser.create({ ...req.body });
  const jwt = createJWT(user);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: { email: user.email }, jwt });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide an email or password")
  }

  const user = await AppUser.findOne({ email })

  if (!user) {
    throw new NotFoundError(`The email: ${email} is not registered`)
  } else {
    const checkPassword = await user.comparePassword(password);

    if (!checkPassword) {
      throw new BadRequestError("password is incorrect");
    }
    const jwt = createJWT(user);
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: { email: user.email }, jwt });
  }
}

module.exports = { userSignUp, signIn };
