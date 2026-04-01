require("dotenv").config(); // MUST be at top

const mongoUri =
  process.env.AZURE_COSMOS_CONNECTIONSTRING ||
  process.env.MONGODB_URI;

// 🔥 HARD FAIL (no silent error)
if (!mongoUri) {
  console.error("❌ FATAL: MongoDB URI is missing");
  console.error("👉 Set AZURE_COSMOS_CONNECTIONSTRING or MONGODB_URI");
  process.exit(1);
}

console.log("🔍 Mongo URI found. Connecting...");

require("dotenv").config(); // add at top of file (only once)

async function getApp() {

  const mongoUri =
    process.env.AZURE_COSMOS_CONNECTIONSTRING ||
    process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MongoDB URI is missing");
    process.exit(1);
  }

  console.log("🔍 Connecting to MongoDB...");

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
}

