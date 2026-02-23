import "dotenv/config";
import app from "./app.js"
import connectDB from './config/mongoose.config.js'

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})