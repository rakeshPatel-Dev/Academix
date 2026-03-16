// backend/src/server.js
import "dotenv/config";
import app from "./app.js";
import connectDB from './config/mongoose.config.js';

const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB()
  .then(() => {
    // Only listen if not running on Vercel
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch(error => {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  });

export default app;

