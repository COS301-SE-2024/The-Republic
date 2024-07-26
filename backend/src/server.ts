import "dotenv/config";
import app from "@/app";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
  console.log(`Visit http://localhost:${PORT} to test Backend API`);
  console.log();
});
