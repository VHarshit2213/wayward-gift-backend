import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js"; // MongoDB connection

const server = http.createServer(app);

(async function bootstrap() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Start the server
    server.listen(env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
