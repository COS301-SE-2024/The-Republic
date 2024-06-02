// Uncomment line bellow when when Working locally
import "dotenv/config";

import app from "./app";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
