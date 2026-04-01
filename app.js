var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { format } = require("date-fns");

// routes
var indexRouter = require("./routes/index");

// ✅ MAIN FUNCTION
async function getApp() {

  // ✅ 1. GET CONNECTION STRING
  const mongoUri =
    process.env.AZURE_COSMOS_CONNECTIONSTRING ||
    process.env.MONGODB_URI;

  // ✅ 2. VALIDATE
  if (!mongoUri) {
    console.error("❌ MongoDB URI is missing");
    console.error("👉 Set AZURE_COSMOS_CONNECTIONSTRING or MONGODB_URI");
    process.exit(1);
  }

  console.log("🔍 Connecting to MongoDB...");

  // ✅ 3. CONNECT DB
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }

  // ✅ 4. CREATE EXPRESS APP
  var app = express();

  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  // view engine
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

  // 404
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

  // ✅ 5. RETURN APP (CRITICAL)
  return app;
}

// normalize port
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

// ✅ 6. EXPORT FUNCTION (CRITICAL FIX)
module.exports = getApp;
