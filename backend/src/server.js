import "dotenv/config";
import app from "./app.js";
import connectDB from './config/mongoose.config.js';

const port = process.env.PORT || 3000;

// Start server only after DB connects
try {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}