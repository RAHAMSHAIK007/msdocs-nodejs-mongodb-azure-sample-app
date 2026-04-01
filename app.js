var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { format } = require("date-fns");

// ✅ Load environment variables (IMPORTANT)
require("dotenv").config();

// 1st party dependencies
var indexRouter = require("./routes/index");

async function getApp() {

  // ✅ Step 1: Get Mongo URI safely
  const mongoUri =
    process.env.AZURE_COSMOS_CONNECTIONSTRING ||
    process.env.MONGODB_URI;

  // ✅ Step 2: Validate URI (prevents your previous error)
  if (!mongoUri) {
    console.error("❌ MongoDB URI is NOT defined!");
    process.exit(1); // stop app immediately
  }

  console.log("🔍 Connecting to MongoDB...");

  // ✅ Step 3: Connect to MongoDB (Azure Cosmos DB or MongoDB)
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected Successfully");
  } catch (err) {
    console.error("❌ Error connecting to database:", err);
    process.exit(1);
  }

  // ---------------- APP SETUP ----------------
  var app = express();

  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.locals.format = format;

  app.use("/", indexRouter);
  app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
  app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

  // catch 404
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
  });

  return app;
}

// Normalize port
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

module.exports = {
  getApp,
};
