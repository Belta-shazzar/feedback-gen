require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./config/connect.db");

// routers
const userRouter = require("./routes/appUser.router");
const formRouter = require("./routes/form.router");
const responseRouter = require("./routes/form.response.router")

// extra security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")

// error handler
const errorHandlerMiddleware = require("./middlewares/error-handler");

const app = express();

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/form", formRouter);
app.use("/api/v1/form-response", responseRouter)

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO);
    app.listen(port, console.log(`server is listening on ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
