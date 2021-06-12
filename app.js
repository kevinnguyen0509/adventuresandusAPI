const express = require("express");
const app = express();
const morgan = require("morgan");
const compression = require("compression");
const adventureRoute = require("./routes/adventureRoute");
const userRoute = require("./routes/userRoute");
const cors = require("cors");

app.use(cors());

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(compression());
app.use("/api/v1/adventures", adventureRoute);
app.use("/api/v1/users", userRoute);

module.exports = app;
