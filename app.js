const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const adventureRoute = require("./routes/adventureRoute");
const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const viewRoute = require("./routes/viewRoutes");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "public")));
//Set Security HTTP Headers
app.use(helmet());
app.use(
  expressCspHeader({
    directives: {
      "default-src": [SELF],
      "script-src": [SELF, INLINE, "somehost.com"],
      "style-src": [SELF, "mystyles.net"],
      "img-src": ["data:", "*"],
      "worker-src": [NONE],
      "block-all-mixed-content": true,
    },
  })
);
app.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against xss
app.use(xss());

app.use(compression());

//serving static files test middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);

  next();
});

app.use(compression());

app.use("/", viewRoute);
app.use("/api/v1/adventures", adventureRoute);
app.use("/api/v1/adventures", adventureRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/boards", boardRoute);

module.exports = app;
