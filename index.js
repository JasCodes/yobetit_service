const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000

const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const countriesRouter = require("./routes/countries");
const slotsRouter = require("./routes/slots");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/", indexRouter);
app.use("/countries", countriesRouter);
app.use("/slots", slotsRouter);

const listener = app.listen(PORT, function () {
  console.log("Listening on port " + listener.address().port);
});
